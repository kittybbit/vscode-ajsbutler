import * as assert from "assert";
import { JSDOM } from "jsdom";
import React from "react";
import { VirtuosoMockContext } from "react-virtuoso";
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
import { useTableGridKeyboard } from "../../presentation/webview/editor/ajsTable/useTableGridKeyboard";
import type { TableGridFocusController } from "../../presentation/webview/editor/ajsTable/useTableGridFocus";
import type { TableGridFocus } from "../../presentation/webview/editor/ajsTable/tableNavigationModel";
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

const countRetiredOperationRequests = (messages: readonly unknown[]): number =>
  messages.filter((message) => isViewerMessage(message, "operation")).length;

const dispatchTableDocument = async (
  eventBridge: ReturnType<typeof createViewerEventBridge>,
  documentDto: ReturnType<typeof toUnitListDocumentDto>,
  postedMessages: unknown[],
): Promise<void> => {
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
  });
  await waitFor(() => {
    assert.ok(
      postedMessages.some((message) => isViewerMessage(message, "ready")),
    );
  });
  act(() => {
    eventBridge.dispatch(
      new MessageEvent("message", {
        data: createViewerDocumentChangedMessage(documentDto),
      }),
    );
  });
};

const renderTableViewer = () =>
  render(
    React.createElement(
      VirtuosoMockContext.Provider,
      { value: { itemHeight: 36, viewportHeight: 480 } },
      React.createElement(AjsTableViewerApp),
    ),
  );

const getTableRowByCellText = (
  container: HTMLElement,
  cellText: string,
): HTMLElement => {
  const row = Array.from(
    container.querySelectorAll<HTMLElement>('[role="row"]'),
  ).find(
    (candidate) =>
      candidate
        .querySelectorAll('[role="gridcell"]')[1]
        ?.textContent?.trim() === cellText,
  );
  assert.ok(row, `Expected a table row with unit name ${cellText}`);
  return row;
};

const getUnitTreeItemByAbsolutePath = (
  container: HTMLElement,
  absolutePath: string,
): HTMLElement => {
  const item = container.querySelector<HTMLElement>(
    `[role="treeitem"][data-unit-tree-unit-id="${absolutePath}"]`,
  );
  assert.ok(item, `Expected a unit tree item at ${absolutePath}`);
  return item;
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

    const view = renderTableViewer();
    const documentDto = toUnitListDocumentDto(
      parseAjsDocumentForTest(definition),
    );

    await dispatchTableDocument(eventBridge, documentDto, postedMessages);

    await waitFor(() => {
      assert.ok(view.getByRole("grid", { name: "Unit list" }));
      assert.ok(view.getByPlaceholderText(/search unit list/i));
    });

    const searchInput = view.getByPlaceholderText(/search unit list/i);
    fireEvent.change(searchInput, { target: { value: "example" } });
    fireEvent.keyUp(searchInput, { key: "Enter" });

    await waitFor(() => assert.ok(view.getByLabelText("1 / 1")));
    const row = getTableRowByCellText(view.container, "leaf-job");
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
      const revealedRow = getTableRowByCellText(view.container, "jobnet");
      assert.strictEqual(revealedRow.getAttribute("aria-selected"), "true");
    });

    fireEvent.click(
      view.getByRole("button", { name: "Open definition details" }),
    );
    assert.ok(view.getByRole("dialog"));
  });

  test("reports CSV copy only after clipboard write succeeds", async () => {
    const eventBridge = createViewerEventBridge();
    const postedMessages: unknown[] = [];
    window.EventBridge = eventBridge;
    window.vscode = {
      postMessage: (message: unknown) => postedMessages.push(message),
    } as never;
    const previousClipboard = Object.getOwnPropertyDescriptor(
      navigator,
      "clipboard",
    );
    let completeWrite: (() => void) | undefined;
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: () =>
          new Promise<void>((resolve) => {
            completeWrite = resolve;
          }),
      },
    });

    try {
      const view = renderTableViewer();
      await dispatchTableDocument(
        eventBridge,
        toUnitListDocumentDto(parseAjsDocumentForTest(definition)),
        postedMessages,
      );
      await waitFor(() =>
        assert.ok(view.getByRole("grid", { name: "Unit list" })),
      );

      fireEvent.click(
        view.getByRole("button", {
          name: "Copy the contents to clipboard as CSV.",
        }),
      );
      assert.strictEqual(
        postedMessages.some((message) =>
          isViewerMessage(message, "csv_export"),
        ),
        false,
      );
      assert.ok(completeWrite);
      completeWrite();
      await waitFor(() =>
        assert.strictEqual(
          postedMessages.filter((message) =>
            isViewerMessage(message, "csv_export"),
          ).length,
          1,
        ),
      );

      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: {
          writeText: async () => {
            throw new Error("clipboard unavailable");
          },
        },
      });
      fireEvent.click(
        view.getByRole("button", {
          name: "Copy the contents to clipboard as CSV.",
        }),
      );
      await new Promise((resolve) => setTimeout(resolve, 0));
      assert.strictEqual(
        postedMessages.filter((message) =>
          isViewerMessage(message, "csv_export"),
        ).length,
        1,
      );
    } finally {
      if (previousClipboard) {
        Object.defineProperty(navigator, "clipboard", previousClipboard);
      } else {
        Reflect.deleteProperty(navigator, "clipboard");
      }
    }
  });

  test("shows successful CSV copy feedback when telemetry transport throws", async () => {
    const eventBridge = createViewerEventBridge();
    const postedMessages: unknown[] = [];
    let throwCsvTelemetry = false;
    let attemptedCsvTelemetry = 0;
    window.EventBridge = eventBridge;
    window.vscode = {
      postMessage: (message: unknown) => {
        if (throwCsvTelemetry && isViewerMessage(message, "csv_export")) {
          attemptedCsvTelemetry += 1;
          throw new Error("webview transport unavailable");
        }
        postedMessages.push(message);
      },
    } as never;
    const previousClipboard = Object.getOwnPropertyDescriptor(
      navigator,
      "clipboard",
    );
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async () => undefined },
    });

    try {
      const view = renderTableViewer();
      await dispatchTableDocument(
        eventBridge,
        toUnitListDocumentDto(parseAjsDocumentForTest(definition)),
        postedMessages,
      );
      await waitFor(() =>
        assert.ok(view.getByRole("grid", { name: "Unit list" })),
      );

      throwCsvTelemetry = true;
      fireEvent.click(
        view.getByRole("button", {
          name: "Copy the contents to clipboard as CSV.",
        }),
      );

      await waitFor(() =>
        assert.strictEqual(
          view.getByRole("status").textContent,
          "Unit list copied as CSV.",
        ),
      );
      assert.strictEqual(attemptedCsvTelemetry, 1);
      assert.strictEqual(
        postedMessages.some((message) =>
          isViewerMessage(message, "csv_export"),
        ),
        false,
      );
      assert.ok(view.getByText("Copied"));
    } finally {
      if (previousClipboard) {
        Object.defineProperty(navigator, "clipboard", previousClipboard);
      } else {
        Reflect.deleteProperty(navigator, "clipboard");
      }
    }
  });

  test("keeps keyboard movement provisional until Enter and commits once", async () => {
    const eventBridge = createViewerEventBridge();
    const postedMessages: unknown[] = [];
    window.EventBridge = eventBridge;
    window.vscode = {
      postMessage: (message: unknown) => postedMessages.push(message),
    } as never;

    const view = renderTableViewer();
    await dispatchTableDocument(
      eventBridge,
      toUnitListDocumentDto(parseAjsDocumentForTest(definition)),
      postedMessages,
    );
    await waitFor(() =>
      assert.ok(view.getByRole("grid", { name: "Unit list" })),
    );

    const rootRow = getTableRowByCellText(view.container, "root");
    const rootCell = within(rootRow).getAllByRole("gridcell")[0];
    fireEvent.click(rootCell);
    const committedCount = countRetiredOperationRequests(postedMessages);
    assert.strictEqual(rootRow.getAttribute("aria-selected"), "true");

    fireEvent.keyDown(rootCell, { key: "ArrowDown" });
    const focusedRow = getTableRowByCellText(view.container, "jobnet");
    assert.strictEqual(rootRow.getAttribute("aria-selected"), "true");
    assert.strictEqual(focusedRow.getAttribute("aria-selected"), "false");
    assert.strictEqual(
      countRetiredOperationRequests(postedMessages),
      committedCount,
    );

    const focusedCell = within(focusedRow).getAllByRole("gridcell")[0];
    fireEvent.keyDown(focusedCell, { key: "Enter" });
    await waitFor(() =>
      assert.strictEqual(focusedRow.getAttribute("aria-selected"), "true"),
    );
    assert.strictEqual(
      countRetiredOperationRequests(postedMessages),
      committedCount,
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

    const view = renderTableViewer();
    await dispatchTableDocument(
      eventBridge,
      toUnitListDocumentDto(parseAjsDocumentForTest(definition)),
      postedMessages,
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
    const provisionalRow = getTableRowByCellText(view.container, "jobnet");
    const beforeReveal = countRetiredOperationRequests(postedMessages);

    act(() => {
      eventBridge.dispatch(
        new MessageEvent("message", {
          data: createViewerRevealUnitMessage("/root/jobnet/leaf-job"),
        }),
      );
    });
    await waitFor(() =>
      assert.strictEqual(
        getTableRowByCellText(view.container, "leaf-job").getAttribute(
          "aria-selected",
        ),
        "true",
      ),
    );
    assert.strictEqual(provisionalRow.getAttribute("aria-selected"), "false");
    assert.strictEqual(
      countRetiredOperationRequests(postedMessages),
      beforeReveal,
    );

    const leafCell = within(
      getTableRowByCellText(view.container, "leaf-job"),
    ).getAllByRole("gridcell")[0];
    fireEvent.keyDown(leafCell, { key: "l" });
    await waitFor(() => {
      const leafTreeItem = getUnitTreeItemByAbsolutePath(
        view.container,
        "/root/jobnet/leaf-job",
      );
      assert.strictEqual(document.activeElement, leafTreeItem);
    });
    assert.strictEqual(
      countRetiredOperationRequests(postedMessages),
      beforeReveal,
    );
  });

  test("commits before Enter and activates the existing cell action once", async () => {
    const eventBridge = createViewerEventBridge();
    const postedMessages: unknown[] = [];
    window.EventBridge = eventBridge;
    window.vscode = {
      postMessage: (message: unknown) => postedMessages.push(message),
    } as never;

    const view = renderTableViewer();
    await dispatchTableDocument(
      eventBridge,
      toUnitListDocumentDto(parseAjsDocumentForTest(definition)),
      postedMessages,
    );
    await waitFor(() =>
      assert.ok(view.getByRole("grid", { name: "Unit list" })),
    );

    const rootRow = getTableRowByCellText(view.container, "root");
    const rootCell = within(rootRow).getAllByRole("gridcell")[0];
    fireEvent.click(rootCell);
    const jobnetRow = getTableRowByCellText(view.container, "jobnet");
    fireEvent.keyDown(rootCell, { key: "ArrowDown" });
    const jobnetActionCell = within(jobnetRow).getAllByRole("gridcell")[2];
    const action = jobnetActionCell.querySelector<HTMLElement>(
      "[data-grid-cell-action]",
    );
    assert.ok(action);
    const beforeEnter = countRetiredOperationRequests(postedMessages);

    action?.focus();
    assert.strictEqual(fireEvent.keyDown(action, { key: "Enter" }), true);
    assert.strictEqual(jobnetRow.getAttribute("aria-selected"), "false");

    fireEvent.keyDown(jobnetActionCell, { key: "Enter" });
    await waitFor(() =>
      assert.strictEqual(rootRow.getAttribute("aria-selected"), "true"),
    );
    assert.strictEqual(
      countRetiredOperationRequests(postedMessages),
      beforeEnter,
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

    const view = renderTableViewer();
    await dispatchTableDocument(
      eventBridge,
      toUnitListDocumentDto(parseAjsDocumentForTest(definition)),
      postedMessages,
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
    const provisionalRow = getTableRowByCellText(view.container, "jobnet");
    const beforeTreeSelection = countRetiredOperationRequests(postedMessages);

    fireEvent.click(
      getUnitTreeItemByAbsolutePath(view.container, "/root/jobnet/leaf-job"),
    );
    await waitFor(() =>
      assert.strictEqual(
        getTableRowByCellText(view.container, "leaf-job").getAttribute(
          "aria-selected",
        ),
        "true",
      ),
    );
    assert.strictEqual(provisionalRow.getAttribute("aria-selected"), "false");
    assert.strictEqual(
      countRetiredOperationRequests(postedMessages),
      beforeTreeSelection,
    );
  });

  test("commits the focused path before header exit and detail return", async () => {
    const eventBridge = createViewerEventBridge();
    const postedMessages: unknown[] = [];
    window.EventBridge = eventBridge;
    window.vscode = {
      postMessage: (message: unknown) => postedMessages.push(message),
    } as never;

    const view = renderTableViewer();
    await dispatchTableDocument(
      eventBridge,
      toUnitListDocumentDto(parseAjsDocumentForTest(definition)),
      postedMessages,
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
      getTableRowByCellText(view.container, "jobnet"),
    ).getAllByRole("gridcell")[0];
    const beforeHeaderExit = countRetiredOperationRequests(postedMessages);

    fireEvent.keyDown(focusedCell, { key: "h" });
    assert.strictEqual(
      countRetiredOperationRequests(postedMessages),
      beforeHeaderExit,
    );
    assert.strictEqual(
      document.activeElement?.getAttribute("role"),
      "columnheader",
    );

    fireEvent.keyDown(document.activeElement as HTMLElement, { key: "Escape" });
    assert.ok(
      document.activeElement === focusedCell,
      "Escape must restore the originating grid cell",
    );
    const grid = view.getByRole("grid", { name: "Unit list" });
    const rovingTabStops = grid.querySelectorAll<HTMLElement>(
      '[role="gridcell"][tabindex="0"], [role="columnheader"][tabindex="0"]',
    );
    assert.strictEqual(rovingTabStops.length, 1);
    assert.ok(
      rovingTabStops[0] === focusedCell,
      "the sole grid tab stop must be the originating cell",
    );
    fireEvent.keyDown(focusedCell, { key: "d" });
    await waitFor(() =>
      assert.ok(
        view.getByRole("complementary", {
          name: "Selected list unit details",
        }),
      ),
    );
    const beforeDetailReturn = countRetiredOperationRequests(postedMessages);
    fireEvent.keyDown(
      view.getByRole("complementary", { name: "Selected list unit details" }),
      { key: "r" },
    );
    assert.strictEqual(
      countRetiredOperationRequests(postedMessages),
      beforeDetailReturn,
    );
  });

  test("clears saved header return when no restoration target exists", () => {
    const rowAbsolutePaths: string[] = [];
    const restoredTargets: (TableGridFocus | undefined)[] = [];
    let savedHeaderReturnFocus: TableGridFocus | undefined = {
      kind: "cell",
      absolutePath: "/root/removed",
      columnId: "#",
    };
    let clearCount = 0;
    const focusController = {
      getHeaderReturnFocus: () => savedHeaderReturnFocus,
      clearHeaderReturnFocus: () => {
        savedHeaderReturnFocus = undefined;
        clearCount += 1;
      },
      focusGridTarget: (focus: TableGridFocus | undefined) =>
        restoredTargets.push(focus),
    } as unknown as TableGridFocusController;
    const Header = () => {
      const handleGridKeyDown = useTableGridKeyboard({
        focusController,
        focusUnitTree: () => undefined,
        openDetailPane: () => undefined,
        pageSize: 10,
        rowAbsolutePaths,
        sortableColumnIds: [],
        visibleColumnIds: ["#"],
      });
      const focus: TableGridFocus = { kind: "header", columnId: "#" };
      return React.createElement("div", {
        role: "columnheader",
        onKeyDown: (event: React.KeyboardEvent<HTMLElement>) =>
          handleGridKeyDown(event, focus),
      });
    };
    const view = render(React.createElement(Header));
    const header = view.getByRole("columnheader");

    assert.strictEqual(fireEvent.keyDown(header, { key: "Escape" }), false);
    assert.strictEqual(clearCount, 1);
    assert.deepStrictEqual(restoredTargets, [undefined]);

    rowAbsolutePaths.push("/root/removed");
    assert.strictEqual(fireEvent.keyDown(header, { key: "Escape" }), true);
    assert.strictEqual(clearCount, 1);
    assert.deepStrictEqual(restoredTargets, [undefined]);
  });

  test("discards provisional focus on document replacement and unmount", async () => {
    const eventBridge = createViewerEventBridge();
    const postedMessages: unknown[] = [];
    window.EventBridge = eventBridge;
    window.vscode = {
      postMessage: (message: unknown) => postedMessages.push(message),
    } as never;

    const view = renderTableViewer();
    const documentDto = toUnitListDocumentDto(
      parseAjsDocumentForTest(definition),
    );
    await dispatchTableDocument(eventBridge, documentDto, postedMessages);
    await waitFor(() =>
      assert.ok(view.getByRole("grid", { name: "Unit list" })),
    );

    const rootCell = getTableRowByCellText(
      view.container,
      "root",
    ).querySelector('[role="gridcell"]') as HTMLElement;
    fireEvent.click(rootCell);
    fireEvent.keyDown(rootCell, { key: "ArrowDown" });
    const beforeReplacement = countRetiredOperationRequests(postedMessages);
    act(() => {
      eventBridge.dispatch(
        new MessageEvent("message", {
          data: createViewerDocumentChangedMessage(documentDto),
        }),
      );
    });
    await waitFor(() => {
      assert.strictEqual(
        view.container.querySelector('[role="row"][aria-selected="true"]'),
        null,
      );
    });
    assert.strictEqual(
      view.queryByRole("complementary", {
        name: "Selected list unit details",
      }),
      null,
    );
    assert.strictEqual(
      countRetiredOperationRequests(postedMessages),
      beforeReplacement,
    );

    view.unmount();
    assert.strictEqual(
      countRetiredOperationRequests(postedMessages),
      beforeReplacement,
    );
  });
});
