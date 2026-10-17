import * as assert from "assert";
import { JSDOM } from "jsdom";
import { act, cleanup, renderHook } from "@testing-library/react";
import type { Row } from "@tanstack/table-core";
import type { TableRowView } from "../../presentation/webview/editor/ajsTable/tableViewerData";
import { useTableSearchController } from "../../presentation/webview/editor/ajsTable/tableSearchController";

type GlobalDescriptorMap = Map<string, PropertyDescriptor | undefined>;

const installDomGlobals = (): {
  dom: JSDOM;
  previous: GlobalDescriptorMap;
} => {
  const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "http://localhost/",
  });
  const previous: GlobalDescriptorMap = new Map();
  const values: Record<string, unknown> = {
    window: dom.window,
    document: dom.window.document,
    navigator: dom.window.navigator,
    HTMLElement: dom.window.HTMLElement,
    Node: dom.window.Node,
    Element: dom.window.Element,
    Event: dom.window.Event,
    MessageEvent: dom.window.MessageEvent,
    IS_REACT_ACT_ENVIRONMENT: true,
  };
  for (const [key, value] of Object.entries(values)) {
    previous.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
    Object.defineProperty(globalThis, key, {
      configurable: true,
      writable: true,
      value,
    });
  }
  return { dom, previous };
};

const restoreDomGlobals = (dom: JSDOM, previous: GlobalDescriptorMap): void => {
  for (const key of previous.keys()) {
    const descriptor = previous.get(key);
    if (descriptor) {
      Object.defineProperty(globalThis, key, descriptor);
    } else {
      delete (globalThis as Record<string, unknown>)[key];
    }
  }
  dom.window.close();
};

const createRow = (
  absolutePath: string,
  visibleValues: readonly unknown[],
): Row<TableRowView> =>
  ({
    original: { absolutePath } as TableRowView,
    getVisibleCells: () =>
      visibleValues.map((value, index) => ({
        id: `${absolutePath}-${index}`,
        getValue: () => value,
      })),
  }) as unknown as Row<TableRowView>;

suite("Table search controller", () => {
  let dom: JSDOM;
  let previousGlobals: GlobalDescriptorMap;

  suiteSetup(() => {
    ({ dom, previous: previousGlobals } = installDomGlobals());
  });

  teardown(() => {
    cleanup();
    delete window.vscode;
  });

  suiteTeardown(() => {
    restoreDomGlobals(dom, previousGlobals);
  });

  test("submits a committed search and reveals the first match", () => {
    const messages: unknown[] = [];
    const revealedPaths: string[] = [];
    window.vscode = {
      postMessage: (message: unknown) => messages.push(message),
    } as never;
    const rows = [
      createRow("/root/first", ["first job"]),
      createRow("/root/target", ["target job"]),
    ];

    const { result } = renderHook(() =>
      useTableSearchController({
        rows,
        parameterSearchValuesByPath: new Map(),
        revealPath: (absolutePath) => revealedPaths.push(absolutePath),
      }),
    );

    act(() => result.current.submitSearch("TARGET"));

    assert.strictEqual(result.current.searchQuery, "TARGET");
    assert.deepStrictEqual(result.current.searchState, {
      query: "target",
      matchedAbsolutePaths: ["/root/target"],
      searchedAbsolutePath: "/root/target",
    });
    assert.deepStrictEqual(revealedPaths, ["/root/target"]);
    assert.deepStrictEqual(messages, [
      { type: "search", data: { feature: "table" } },
    ]);
  });

  test("keeps search state and reveal when telemetry transport throws", () => {
    const revealedPaths: string[] = [];
    let attempted = 0;
    window.vscode = {
      postMessage: () => {
        attempted += 1;
        throw new Error("webview transport unavailable");
      },
    } as never;

    const { result } = renderHook(() =>
      useTableSearchController({
        rows: [createRow("/root/target", ["target job"])],
        parameterSearchValuesByPath: new Map(),
        revealPath: (absolutePath) => revealedPaths.push(absolutePath),
      }),
    );

    act(() => result.current.submitSearch("target"));

    assert.strictEqual(attempted, 1);
    assert.strictEqual(result.current.searchQuery, "target");
    assert.deepStrictEqual(result.current.searchState, {
      query: "target",
      matchedAbsolutePaths: ["/root/target"],
      searchedAbsolutePath: "/root/target",
    });
    assert.deepStrictEqual(revealedPaths, ["/root/target"]);
  });

  test("navigates active results, submits stale queries, and clears safely", () => {
    const messages: unknown[] = [];
    const revealedPaths: string[] = [];
    window.vscode = {
      postMessage: (message: unknown) => messages.push(message),
    } as never;
    const rows = [
      createRow("/root/first", ["target first"]),
      createRow("/root/second", ["target second"]),
    ];

    const { result } = renderHook(() =>
      useTableSearchController({
        rows,
        parameterSearchValuesByPath: new Map(),
        revealPath: (absolutePath) => revealedPaths.push(absolutePath),
      }),
    );

    act(() => result.current.submitSearch("target"));
    act(() => result.current.navigateSearch("TARGET", "next"));

    assert.strictEqual(
      result.current.searchState.searchedAbsolutePath,
      "/root/second",
    );
    assert.deepStrictEqual(revealedPaths, ["/root/first", "/root/second"]);
    assert.deepStrictEqual(messages, [
      { type: "search", data: { feature: "table" } },
    ]);

    act(() => result.current.navigateSearch("missing", "next"));
    assert.deepStrictEqual(result.current.searchState, {
      query: "missing",
      matchedAbsolutePaths: [],
      searchedAbsolutePath: undefined,
    });
    assert.deepStrictEqual(messages, [
      { type: "search", data: { feature: "table" } },
      { type: "search", data: { feature: "table" } },
    ]);

    act(() => result.current.resetSearch());
    assert.strictEqual(result.current.searchQuery, "");
    assert.deepStrictEqual(result.current.searchState, {
      matchedAbsolutePaths: [],
    });
    assert.deepStrictEqual(messages, [
      { type: "search", data: { feature: "table" } },
      { type: "search", data: { feature: "table" } },
    ]);
  });
});
