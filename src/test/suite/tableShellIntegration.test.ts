import * as assert from "assert";
import { JSDOM } from "jsdom";
import React from "react";
import {
  act,
  cleanup,
  fireEvent,
  render,
  waitFor,
  within,
} from "@testing-library/react";
import { toUnitListDocumentDto } from "../../application/unit-list/unitListDocument";
import { AjsTableViewerApp } from "../../presentation/webview/editor/ajsTable/AjsTableViewerApp";
import { createViewerEventBridge } from "../../presentation/webview/editor/viewerEventBridge";
import {
  createViewerDocumentChangedMessage,
  createViewerResourceStateMessage,
  createViewerRevealUnitMessage,
} from "../../presentation/webview/viewerHostMessages";
import { parseAjsDocumentForTest } from "../support/parseAjs";

type GlobalDescriptorMap = Map<string, PropertyDescriptor | undefined>;

const definition = `
unit=root,,jp1admin,;
{
  ty=n;
  el=jobnet,n,+240+144;
  unit=jobnet,,jp1admin,;
  {
    ty=n;
    el=leaf-job,j,+240+144;
    unit=leaf-job,,jp1admin,;
    {
      ty=j;
      cm=example;
    }
  }
}
`;

const installDomGlobals = (): {
  dom: JSDOM;
  previous: GlobalDescriptorMap;
} => {
  const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "http://localhost/",
  });
  const previous: GlobalDescriptorMap = new Map();
  const requestAnimationFrame = (callback: FrameRequestCallback): number =>
    dom.window.setTimeout(() => callback(dom.window.performance.now()), 0);
  const values: Record<string, unknown> = {
    window: dom.window,
    document: dom.window.document,
    navigator: dom.window.navigator,
    HTMLElement: dom.window.HTMLElement,
    Node: dom.window.Node,
    Element: dom.window.Element,
    Event: dom.window.Event,
    MessageEvent: dom.window.MessageEvent,
    KeyboardEvent: dom.window.KeyboardEvent,
    MouseEvent: dom.window.MouseEvent,
    MutationObserver: dom.window.MutationObserver,
    ResizeObserver: class {
      disconnect(): void {}
      observe(): void {}
      unobserve(): void {}
    },
    IntersectionObserver: class {
      disconnect(): void {}
      observe(): void {}
      unobserve(): void {}
    },
    getComputedStyle: dom.window.getComputedStyle.bind(dom.window),
    requestAnimationFrame,
    cancelAnimationFrame: (handle: number): void =>
      dom.window.clearTimeout(handle),
    CSS: { escape: (value: string): string => value },
    IS_REACT_ACT_ENVIRONMENT: true,
  };
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
  dom.window.HTMLElement.prototype.scrollIntoView = () => undefined;
  dom.window.scrollTo = () => undefined;
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

const isViewerMessage = (
  value: unknown,
  type: string,
): value is { type: string; data?: Record<string, unknown> } =>
  typeof value === "object" &&
  value !== null &&
  "type" in value &&
  value.type === type;

const countUnitSelectOperations = (messages: readonly unknown[]): number =>
  messages.filter((message) => {
    if (!isViewerMessage(message, "operation")) return false;
    return (message as { data?: unknown }).data === "unit.select";
  }).length;

const dispatchTableDocument = (
  eventBridge: ReturnType<typeof createViewerEventBridge>,
  documentDto: ReturnType<typeof toUnitListDocumentDto>,
): void => {
  act(() => {
    eventBridge.dispatch(
      new MessageEvent("message", {
        data: createViewerResourceStateMessage({
          isDarkMode: false,
          lang: "en",
          scrollType: "table",
        }),
      }),
    );
    eventBridge.dispatch(
      new MessageEvent("message", {
        data: createViewerDocumentChangedMessage(documentDto),
      }),
    );
  });
};

const getTableRowByCellText = (
  container: HTMLElement,
  cellText: string,
): HTMLElement => {
  const row = Array.from(
    container.querySelectorAll<HTMLElement>('[role="row"]'),
  ).find((candidate) =>
    Array.from(candidate.querySelectorAll('[role="gridcell"]')).some(
      (cell) => cell.textContent?.trim() === cellText,
    ),
  );
  assert.ok(row, `Expected a table row containing ${cellText}`);
  return row;
};

suite("Table shell integration", () => {
  let dom: JSDOM;
  let previousGlobals: GlobalDescriptorMap;

  suiteSetup(() => {
    ({ dom, previous: previousGlobals } = installDomGlobals());
  });

  teardown(() => {
    cleanup();
    delete window.vscode;
    delete window.EventBridge;
    dom.window.document.body.innerHTML = "";
  });

  suiteTeardown(() => {
    restoreDomGlobals(dom, previousGlobals);
  });

  test("connects search, detail actions, and counterpart reveal in one shell", async () => {
    const eventBridge = createViewerEventBridge();
    const postedMessages: unknown[] = [];
    window.EventBridge = eventBridge;
    window.vscode = {
      postMessage: (message: unknown) => postedMessages.push(message),
    } as never;

    const view = render(React.createElement(AjsTableViewerApp));
    const documentDto = toUnitListDocumentDto(
      parseAjsDocumentForTest(definition),
    );

    act(() => {
      eventBridge.dispatch(
        new MessageEvent("message", {
          data: createViewerResourceStateMessage({
            isDarkMode: false,
            lang: "en",
            scrollType: "table",
          }),
        }),
      );
      eventBridge.dispatch(
        new MessageEvent("message", {
          data: createViewerDocumentChangedMessage(documentDto),
        }),
      );
    });

    await waitFor(() => {
      assert.ok(view.getByRole("grid", { name: "Unit list" }));
      assert.ok(view.getByPlaceholderText(/search unit list/i));
    });

    const searchInput = view.getByPlaceholderText(/search unit list/i);
    fireEvent.change(searchInput, { target: { value: "leaf-job" } });
    fireEvent.keyUp(searchInput, { key: "Enter" });

    await waitFor(() => assert.ok(view.getByLabelText("1 / 1")));
    const row = view.getByRole("row", { name: /leaf-job/i });
    const leafCell = within(row).getAllByRole("gridcell")[1];
    assert.ok(leafCell);
    fireEvent.keyDown(leafCell, { key: "d" });

    await waitFor(() =>
      assert.ok(
        view.getByRole("complementary", {
          name: "Selected list unit details",
        }),
      ),
    );
    fireEvent.click(
      view.getByRole("button", { name: "Open definition details" }),
    );
    assert.ok(view.getByRole("dialog"));

    fireEvent.click(view.getByRole("button", { name: "Open in flow graph" }));
    assert.ok(
      postedMessages.some(
        (message) =>
          isViewerMessage(message, "navigate") &&
          message.data?.targetView === "flow" &&
          message.data?.absolutePath === "/root/jobnet/leaf-job",
      ),
    );

    act(() => {
      eventBridge.dispatch(
        new MessageEvent("message", {
          data: createViewerRevealUnitMessage("/root/jobnet"),
        }),
      );
    });

    await waitFor(() => {
      const revealedRow = view.getByRole("row", { name: /jobnet/i });
      assert.strictEqual(revealedRow.getAttribute("aria-selected"), "true");
    });
  });

  test("keeps keyboard movement provisional until Enter and commits once", async () => {
    const eventBridge = createViewerEventBridge();
    const postedMessages: unknown[] = [];
    window.EventBridge = eventBridge;
    window.vscode = {
      postMessage: (message: unknown) => postedMessages.push(message),
    } as never;

    const view = render(React.createElement(AjsTableViewerApp));
    dispatchTableDocument(
      eventBridge,
      toUnitListDocumentDto(parseAjsDocumentForTest(definition)),
    );
    await waitFor(() =>
      assert.ok(view.getByRole("grid", { name: "Unit list" })),
    );

    const rootRow = getTableRowByCellText(view.container, "root");
    const rootCell = within(rootRow).getAllByRole("gridcell")[0];
    fireEvent.click(rootCell);
    const committedCount = countUnitSelectOperations(postedMessages);
    assert.strictEqual(rootRow.getAttribute("aria-selected"), "true");

    fireEvent.keyDown(rootCell, { key: "ArrowDown" });
    const focusedRow = view.getByRole("row", { name: /jobnet/i });
    assert.strictEqual(rootRow.getAttribute("aria-selected"), "true");
    assert.strictEqual(focusedRow.getAttribute("aria-selected"), "false");
    assert.strictEqual(
      countUnitSelectOperations(postedMessages),
      committedCount,
    );

    const focusedCell = within(focusedRow).getAllByRole("gridcell")[0];
    fireEvent.keyDown(focusedCell, { key: "Enter" });
    await waitFor(() =>
      assert.strictEqual(focusedRow.getAttribute("aria-selected"), "true"),
    );
    assert.strictEqual(
      countUnitSelectOperations(postedMessages),
      committedCount + 1,
    );
    assert.ok(view.getByRole("status").textContent?.includes("jobnet"));
  });

  test("uses explicit targets and focused paths for handoffs without stale commits", async () => {
    const eventBridge = createViewerEventBridge();
    const postedMessages: unknown[] = [];
    window.EventBridge = eventBridge;
    window.vscode = {
      postMessage: (message: unknown) => postedMessages.push(message),
    } as never;

    const view = render(React.createElement(AjsTableViewerApp));
    dispatchTableDocument(
      eventBridge,
      toUnitListDocumentDto(parseAjsDocumentForTest(definition)),
    );
    await waitFor(() =>
      assert.ok(view.getByRole("grid", { name: "Unit list" })),
    );

    const rootCell = getTableRowByCellText(
      view.container,
      "root",
    ).querySelector('[role="gridcell"]') as HTMLElement;
    fireEvent.click(rootCell);
    fireEvent.keyDown(rootCell, { key: "ArrowDown" });
    const provisionalRow = view.getByRole("row", { name: /jobnet/i });
    const beforeReveal = countUnitSelectOperations(postedMessages);

    act(() => {
      eventBridge.dispatch(
        new MessageEvent("message", {
          data: createViewerRevealUnitMessage("/root/jobnet/leaf-job"),
        }),
      );
    });
    await waitFor(() =>
      assert.strictEqual(
        view
          .getByRole("row", { name: /leaf-job/i })
          .getAttribute("aria-selected"),
        "true",
      ),
    );
    assert.strictEqual(provisionalRow.getAttribute("aria-selected"), "false");
    assert.strictEqual(
      countUnitSelectOperations(postedMessages),
      beforeReveal + 1,
    );

    const leafCell = within(
      view.getByRole("row", { name: /leaf-job/i }),
    ).getAllByRole("gridcell")[0];
    fireEvent.keyDown(leafCell, { key: "l" });
    await waitFor(() => {
      const leafTreeItem = view.getByRole("treeitem", { name: /leaf-job/i });
      assert.strictEqual(document.activeElement, leafTreeItem);
    });
    assert.strictEqual(
      countUnitSelectOperations(postedMessages),
      beforeReveal + 2,
    );
  });

  test("commits before Enter and activates the existing cell action once", async () => {
    const eventBridge = createViewerEventBridge();
    const postedMessages: unknown[] = [];
    window.EventBridge = eventBridge;
    window.vscode = {
      postMessage: (message: unknown) => postedMessages.push(message),
    } as never;

    const view = render(React.createElement(AjsTableViewerApp));
    dispatchTableDocument(
      eventBridge,
      toUnitListDocumentDto(parseAjsDocumentForTest(definition)),
    );
    await waitFor(() =>
      assert.ok(view.getByRole("grid", { name: "Unit list" })),
    );

    const rootRow = getTableRowByCellText(view.container, "root");
    const rootCell = within(rootRow).getAllByRole("gridcell")[0];
    fireEvent.click(rootCell);
    const jobnetRow = view.getByRole("row", { name: /jobnet/i });
    fireEvent.keyDown(rootCell, { key: "ArrowDown" });
    const jobnetActionCell = within(jobnetRow).getAllByRole("gridcell")[1];
    assert.ok(jobnetActionCell.querySelector("[data-grid-cell-action]"));
    const beforeEnter = countUnitSelectOperations(postedMessages);

    fireEvent.keyDown(jobnetActionCell, { key: "Enter" });
    await waitFor(() =>
      assert.strictEqual(rootRow.getAttribute("aria-selected"), "true"),
    );
    assert.strictEqual(
      countUnitSelectOperations(postedMessages),
      beforeEnter + 2,
    );
    assert.strictEqual(jobnetRow.getAttribute("aria-selected"), "false");
  });

  test("lets tree selection replace a provisional grid focus target", async () => {
    const eventBridge = createViewerEventBridge();
    const postedMessages: unknown[] = [];
    window.EventBridge = eventBridge;
    window.vscode = {
      postMessage: (message: unknown) => postedMessages.push(message),
    } as never;

    const view = render(React.createElement(AjsTableViewerApp));
    dispatchTableDocument(
      eventBridge,
      toUnitListDocumentDto(parseAjsDocumentForTest(definition)),
    );
    await waitFor(() =>
      assert.ok(view.getByRole("grid", { name: "Unit list" })),
    );

    const rootCell = getTableRowByCellText(
      view.container,
      "root",
    ).querySelector('[role="gridcell"]') as HTMLElement;
    fireEvent.click(rootCell);
    fireEvent.keyDown(rootCell, { key: "ArrowDown" });
    const provisionalRow = view.getByRole("row", { name: /jobnet/i });
    const beforeTreeSelection = countUnitSelectOperations(postedMessages);

    fireEvent.click(view.getByRole("treeitem", { name: /leaf-job/i }));
    await waitFor(() =>
      assert.strictEqual(
        view
          .getByRole("row", { name: /leaf-job/i })
          .getAttribute("aria-selected"),
        "true",
      ),
    );
    assert.strictEqual(provisionalRow.getAttribute("aria-selected"), "false");
    assert.strictEqual(
      countUnitSelectOperations(postedMessages),
      beforeTreeSelection + 1,
    );
  });

  test("commits the focused path before header exit and detail return", async () => {
    const eventBridge = createViewerEventBridge();
    const postedMessages: unknown[] = [];
    window.EventBridge = eventBridge;
    window.vscode = {
      postMessage: (message: unknown) => postedMessages.push(message),
    } as never;

    const view = render(React.createElement(AjsTableViewerApp));
    dispatchTableDocument(
      eventBridge,
      toUnitListDocumentDto(parseAjsDocumentForTest(definition)),
    );
    await waitFor(() =>
      assert.ok(view.getByRole("grid", { name: "Unit list" })),
    );

    const rootCell = getTableRowByCellText(
      view.container,
      "root",
    ).querySelector('[role="gridcell"]') as HTMLElement;
    fireEvent.click(rootCell);
    fireEvent.keyDown(rootCell, { key: "ArrowDown" });
    const focusedCell = within(
      view.getByRole("row", { name: /jobnet/i }),
    ).getAllByRole("gridcell")[0];
    const beforeHeaderExit = countUnitSelectOperations(postedMessages);

    fireEvent.keyDown(focusedCell, { key: "h" });
    assert.strictEqual(
      countUnitSelectOperations(postedMessages),
      beforeHeaderExit + 1,
    );
    assert.strictEqual(
      document.activeElement?.getAttribute("role"),
      "columnheader",
    );

    fireEvent.keyDown(document.activeElement as HTMLElement, { key: "Escape" });
    fireEvent.keyDown(focusedCell, { key: "d" });
    await waitFor(() =>
      assert.ok(
        view.getByRole("complementary", {
          name: "Selected list unit details",
        }),
      ),
    );
    const beforeDetailReturn = countUnitSelectOperations(postedMessages);
    fireEvent.keyDown(
      view.getByRole("complementary", { name: "Selected list unit details" }),
      { key: "r" },
    );
    assert.strictEqual(
      countUnitSelectOperations(postedMessages),
      beforeDetailReturn,
    );
  });

  test("discards provisional focus on document replacement and unmount", async () => {
    const eventBridge = createViewerEventBridge();
    const postedMessages: unknown[] = [];
    window.EventBridge = eventBridge;
    window.vscode = {
      postMessage: (message: unknown) => postedMessages.push(message),
    } as never;

    const view = render(React.createElement(AjsTableViewerApp));
    const documentDto = toUnitListDocumentDto(
      parseAjsDocumentForTest(definition),
    );
    dispatchTableDocument(eventBridge, documentDto);
    await waitFor(() =>
      assert.ok(view.getByRole("grid", { name: "Unit list" })),
    );

    const rootCell = getTableRowByCellText(
      view.container,
      "root",
    ).querySelector('[role="gridcell"]') as HTMLElement;
    fireEvent.click(rootCell);
    fireEvent.keyDown(rootCell, { key: "ArrowDown" });
    const beforeReplacement = countUnitSelectOperations(postedMessages);
    act(() => {
      eventBridge.dispatch(
        new MessageEvent("message", {
          data: createViewerDocumentChangedMessage(documentDto),
        }),
      );
    });
    await waitFor(() => {
      assert.strictEqual(
        view.queryByRole("complementary", {
          name: "Selected list unit details",
        }),
        null,
      );
    });
    assert.strictEqual(
      countUnitSelectOperations(postedMessages),
      beforeReplacement,
    );
    assert.strictEqual(view.queryByRole("status"), null);

    view.unmount();
    assert.strictEqual(
      countUnitSelectOperations(postedMessages),
      beforeReplacement,
    );
  });
});
