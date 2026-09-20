import * as assert from "assert";
import { JSDOM } from "jsdom";
import React from "react";
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import type {
  SemanticDiffExplorerActionSet,
  SemanticDiffExplorerLeaf,
  SemanticDiffExplorerViewModel,
} from "../../application/semantic-diff/semanticDiffExplorer";
import SemanticDiffExplorerApp from "../../presentation/webview/editor/semanticDiffExplorer/SemanticDiffExplorerApp";
import SemanticDiffExplorerContents from "../../presentation/webview/editor/semanticDiffExplorer/SemanticDiffExplorerContents";
import { SemanticDiffExplorerApp as CanonicalSemanticDiffExplorerApp } from "../../presentation/webview/editor/semanticDiffExplorer/SemanticDiffExplorerApp";
import { createViewerEventBridge } from "../../presentation/webview/editor/viewerEventBridge";
import { createViewerResourceStateMessage } from "../../presentation/webview/viewerHostMessages";

type GlobalValue = {
  key: string;
  descriptor: PropertyDescriptor | undefined;
};

const installDom = (): { dom: JSDOM; globals: GlobalValue[] } => {
  const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "http://localhost/",
  });
  const globals: GlobalValue[] = [];
  const resizeObserver = class {
    disconnect(): void {}
    observe(): void {}
    unobserve(): void {}
  };
  const values: Record<string, unknown> = {
    window: dom.window,
    document: dom.window.document,
    navigator: dom.window.navigator,
    HTMLElement: dom.window.HTMLElement,
    Node: dom.window.Node,
    Element: dom.window.Element,
    Event: dom.window.Event,
    KeyboardEvent: dom.window.KeyboardEvent,
    MouseEvent: dom.window.MouseEvent,
    MutationObserver: dom.window.MutationObserver,
    ResizeObserver: resizeObserver,
    getComputedStyle: dom.window.getComputedStyle.bind(dom.window),
    requestAnimationFrame: (callback: FrameRequestCallback): number =>
      dom.window.setTimeout(() => callback(dom.window.performance.now()), 0),
    cancelAnimationFrame: (handle: number): void =>
      dom.window.clearTimeout(handle),
    IS_REACT_ACT_ENVIRONMENT: true,
  };
  Object.entries(values).forEach(([key, value]) => {
    globals.push({
      key,
      descriptor: Object.getOwnPropertyDescriptor(globalThis, key),
    });
    Object.defineProperty(globalThis, key, {
      configurable: true,
      writable: true,
      value,
    });
  });
  dom.window.requestAnimationFrame = values.requestAnimationFrame as (
    callback: FrameRequestCallback,
  ) => number;
  dom.window.cancelAnimationFrame = values.cancelAnimationFrame as (
    handle: number,
  ) => void;
  Object.defineProperty(dom.window, "matchMedia", {
    configurable: true,
    value: () => ({
      matches: false,
      media: "",
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
  Object.defineProperty(dom.window, "EventBridge", {
    configurable: true,
    value: createViewerEventBridge(),
  });
  return { dom, globals };
};

const restoreDom = (dom: JSDOM, globals: GlobalValue[]): void => {
  globals.forEach(({ key, descriptor }) => {
    if (descriptor) Object.defineProperty(globalThis, key, descriptor);
    else delete (globalThis as Record<string, unknown>)[key];
  });
  dom.window.close();
};

const unavailableActions = (): SemanticDiffExplorerActionSet => ({
  source: {
    available: false,
    actionId: null,
    unavailableReason: "missing-target",
  },
  flow: {
    available: false,
    actionId: null,
    unavailableReason: "missing-target",
  },
});

const explorerLeaf = (id: string): SemanticDiffExplorerLeaf => ({
  kind: "change",
  id,
  recordId: id,
  changeKind: "changed",
  elementKind: "unit",
  confirmationLevel: "confirmed",
  attributeCategory: null,
  identityDecisionId: null,
  targetSide: "after",
  target: {
    side: "after",
    value: {
      kind: "unit",
      unit: {
        id,
        name: id,
        absolutePath: `/jobs/${id}`,
        unitType: "unit",
      },
    },
  },
  before: null,
  after: null,
  relationPair: null,
  detail: {
    unitPath: `/jobs/${id}`,
    parameterKey: "timeout",
    relationPair: null,
    scheduleRule: null,
    period: null,
    beforeValues: ["10"],
    afterValues: ["20"],
    rawValues: [],
    removedSources: [],
  },
  constraints: [],
  warning: null,
  actions: unavailableActions(),
});

const viewModel = (): SemanticDiffExplorerViewModel => ({
  filter: "all",
  cards: [
    {
      id: "changes",
      count: 1,
      counts: { total: 1 },
    },
  ],
  tree: {
    id: "root",
    kind: "root",
    label: "root",
    path: null,
    children: [
      {
        id: "group:jobs",
        kind: "job-group",
        label: "Jobs",
        path: "/jobs",
        children: [],
        leaves: [explorerLeaf("job-a")],
      },
    ],
    leaves: [],
  },
  leafCount: 1,
  status: "findings",
});

suite("Semantic Diff Explorer components", () => {
  let dom: JSDOM;
  let globals: GlobalValue[];

  setup(() => {
    ({ dom, globals } = installDom());
  });
  teardown(() => {
    cleanup();
    restoreDom(dom, globals);
  });

  test("composes the canonical editor App and MUI boundaries", () => {
    assert.strictEqual(
      SemanticDiffExplorerApp,
      CanonicalSemanticDiffExplorerApp,
    );
    const messages: unknown[] = [];
    Object.defineProperty(dom.window, "vscode", {
      configurable: true,
      value: { postMessage: (message: unknown) => messages.push(message) },
    });
    dom.window.document.body.dataset.semanticDiffSessionId =
      "sde-session-components";
    const loading = render(<SemanticDiffExplorerApp />);
    assert.strictEqual((messages[0] as { type: string }).type, "resource");
    act(() => {
      dom.window.EventBridge.dispatch({
        data: createViewerResourceStateMessage({
          isDarkMode: false,
          lang: "en",
          scrollType: "window",
        }),
      } as MessageEvent);
    });
    assert.ok(loading.getByRole("heading", { name: "Semantic Diff Explorer" }));
    assert.ok(loading.getByRole("status").textContent?.includes("Loading"));
    assert.strictEqual((messages[1] as { type: string }).type, "ready");
    loading.unmount();

    const actions: Array<{ id: string; element: HTMLElement | undefined }> = [];
    const view = render(
      <SemanticDiffExplorerContents
        viewModel={viewModel()}
        language="en"
        themeMode="light"
        outputAction={(element) => actions.push({ id: "output", element })}
        calendarAction={(element) => actions.push({ id: "calendar", element })}
      />,
    );
    const header = view.getByRole("banner");
    assert.strictEqual(
      header.getAttribute("data-semantic-diff-explorer-header"),
      "true",
    );
    assert.strictEqual(getComputedStyle(header).position, "sticky");
    assert.ok(view.getByRole("region", { name: "Summary cards" }));
    assert.ok(view.getByRole("tree", { name: "Semantic diff changes" }));
    assert.ok(
      [...view.container.querySelectorAll('[data-result-status="true"]')].some(
        (element) => element.textContent?.includes("findings"),
      ),
    );
    assert.ok(view.container.querySelector('[aria-live="polite"]'));
    const keyValueRows = [
      ...view.container.querySelectorAll("[data-result-key-value-row]"),
    ];
    assert.ok(keyValueRows.length > 0);
    keyValueRows.forEach((row) => {
      assert.strictEqual(row.querySelectorAll("dt").length, 1);
      assert.strictEqual(row.querySelectorAll("dd").length, 1);
    });
    fireEvent.click(view.getByRole("button", { name: "Output" }));
    fireEvent.click(view.getByRole("button", { name: "Schedule impact" }));
    assert.deepStrictEqual(
      actions.map(({ id, element }) => [id, element?.tagName]),
      [
        ["output", "BUTTON"],
        ["calendar", "BUTTON"],
      ],
    );
    assert.ok(view.container.querySelector('[data-row-id="group:jobs"]'));
    assert.ok(view.container.querySelector('[data-record-id="job-a"]'));
  });
});
