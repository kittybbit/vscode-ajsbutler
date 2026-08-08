import * as assert from "assert";
import { JSDOM } from "jsdom";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import React, { useMemo, useRef, useState } from "react";
import axe from "axe-core";
import { cleanup, fireEvent, render, within } from "@testing-library/react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import type { FlowGraphUnitDto } from "../../application/flow-graph/flowGraphDocument";
import type { TableRowView } from "../../presentation/webview/editor/ajsTable/tableViewerData";
import UnitTreeSelector, {
  type UnitTreeFocusRequest,
} from "../../presentation/webview/editor/shared/UnitTreeSelector";
import SharedUnitDetailPane from "../../presentation/webview/editor/shared/SharedUnitDetailPane";
import DisplayColumnSelector from "../../presentation/webview/editor/ajsTable/DisplayColumnSelector";
import { resolveTableGridRestorationFocus } from "../../presentation/webview/editor/ajsTable/navigation";
import VirtualizedTable from "../../presentation/webview/editor/ajsTable/VirtualizedTable";
import {
  focusRenderedFlowNode,
  resolveFlowGraphEntryTabIndex,
} from "../../presentation/webview/editor/ajsFlow/flowKeyboardNavigation";
import {
  ActionIcon,
  FLOW_NODE_ACTION_SIZE_PX,
} from "../../presentation/webview/editor/ajsFlow/nodes/AjsNode";
import { HeaderSearchControl } from "../../presentation/webview/editor/shared/HeaderSearchControl";
import type {
  HeaderSearchControlLabels,
  HeaderSearchDirection,
} from "../../presentation/webview/editor/shared/headerSearchControlModel";

type GlobalDescriptorMap = Map<string, PropertyDescriptor | undefined>;

const domGlobalKeys = [
  "window",
  "document",
  "navigator",
  "HTMLElement",
  "Node",
  "Element",
  "Event",
  "KeyboardEvent",
  "MouseEvent",
  "MutationObserver",
  "ResizeObserver",
  "getComputedStyle",
  "requestAnimationFrame",
  "cancelAnimationFrame",
  "IS_REACT_ACT_ENVIRONMENT",
] as const;

const installDomGlobals = (): {
  dom: JSDOM;
  previous: GlobalDescriptorMap;
} => {
  const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "http://localhost/",
  });
  const previous: GlobalDescriptorMap = new Map();
  const domWindow = dom.window;
  const requestAnimationFrame = (callback: FrameRequestCallback): number =>
    domWindow.setTimeout(() => callback(domWindow.performance.now()), 0);
  const cancelAnimationFrame = (handle: number): void =>
    domWindow.clearTimeout(handle);
  const noOpResizeObserver = class {
    disconnect(): void {}
    observe(): void {}
    unobserve(): void {}
  };
  const values: Record<string, unknown> = {
    window: domWindow,
    document: domWindow.document,
    navigator: domWindow.navigator,
    HTMLElement: domWindow.HTMLElement,
    Node: domWindow.Node,
    Element: domWindow.Element,
    Event: domWindow.Event,
    KeyboardEvent: domWindow.KeyboardEvent,
    MouseEvent: domWindow.MouseEvent,
    MutationObserver: domWindow.MutationObserver,
    ResizeObserver: noOpResizeObserver,
    getComputedStyle: domWindow.getComputedStyle.bind(domWindow),
    requestAnimationFrame,
    cancelAnimationFrame,
    IS_REACT_ACT_ENVIRONMENT: true,
  };
  Object.defineProperty(domWindow, "matchMedia", {
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
  domWindow.HTMLElement.prototype.scrollIntoView = () => undefined;
  domWindow.scrollTo = () => undefined;
  for (const key of domGlobalKeys) {
    previous.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
    Object.defineProperty(globalThis, key, {
      configurable: true,
      writable: true,
      value: values[key],
    });
  }
  return { dom, previous };
};

const restoreDomGlobals = (dom: JSDOM, previous: GlobalDescriptorMap): void => {
  for (const key of domGlobalKeys) {
    const descriptor = previous.get(key);
    if (descriptor) {
      Object.defineProperty(globalThis, key, descriptor);
    } else {
      delete (globalThis as Record<string, unknown>)[key];
    }
  }
  dom.window.close();
};

const createUnit = (
  id: string,
  depth: number,
  children: FlowGraphUnitDto[] = [],
  parentId?: string,
): FlowGraphUnitDto =>
  ({
    id,
    name: id.split("/").at(-1) ?? id,
    unitAttribute: "",
    unitType: "g",
    absolutePath: id,
    depth,
    parentId,
    isRoot: depth === 0,
    isRootJobnet: false,
    hasSchedule: false,
    hasWaitedFor: false,
    layout: { h: 0, v: 0 },
    parameters: [],
    relations: [],
    children,
  }) as FlowGraphUnitDto;

const createDeepTree = (
  depth: number,
): { deepest: FlowGraphUnitDto; root: FlowGraphUnitDto } => {
  const root = createUnit("/deep-0", 0);
  let deepest = root;
  for (let index = 1; index <= depth; index += 1) {
    const child = createUnit(`/deep-${index}`, index, [], deepest.id);
    deepest.children = [child];
    deepest = child;
  }
  return { deepest, root };
};

const createUnitById = (
  units: readonly FlowGraphUnitDto[],
): ReadonlyMap<string, Pick<FlowGraphUnitDto, "id" | "parentId">> => {
  const entries: Array<[string, Pick<FlowGraphUnitDto, "id" | "parentId">]> =
    [];
  const visit = (unit: FlowGraphUnitDto): void => {
    entries.push([unit.id, { id: unit.id, parentId: unit.parentId }]);
    unit.children.forEach(visit);
  };
  units.forEach(visit);
  return new Map(entries);
};

const createTableRow = (index: number): TableRowView =>
  ({
    id: `job-${index}`,
    absolutePath: `/root/job-${index}`,
    group1: {
      name: `job-${index}`,
    },
  }) as unknown as TableRowView;

const TableGridFixture = ({ rowCount }: { rowCount: number }) => {
  const rows = useMemo(
    () => Array.from({ length: rowCount }, (_, index) => createTableRow(index)),
    [rowCount],
  );
  const [selectedAbsolutePath, setSelectedAbsolutePath] = useState(
    rows[0]?.absolutePath,
  );
  const table = useReactTable({
    data: rows,
    columns: [
      {
        id: "#",
        header: "#",
        enableHiding: false,
        enableSorting: false,
        accessorFn: (_row: TableRowView, index: number) => index + 1,
      },
      {
        id: "name",
        header: "Name",
        accessorFn: (row: TableRowView) => row.group1.name,
      },
      {
        id: "path",
        header: "Path",
        accessorFn: (row: TableRowView) => row.absolutePath,
      },
    ],
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <VirtualizedTable
      headerGroups={table.getHeaderGroups()}
      rows={table.getRowModel().rows}
      rowIndex={rows.findIndex(
        (row) => row.absolutePath === selectedAbsolutePath,
      )}
      columnVisibility={{}}
      searchQuery="job-1"
      parameterSearchValuesByPath={new Map()}
      selectedAbsolutePath={selectedAbsolutePath}
      selectRow={setSelectedAbsolutePath}
      focusUnitTree={() => undefined}
      openDetailPane={() => undefined}
      restoreFocusRequest={{ revision: 0 }}
      gridAriaLabel="Units"
    />
  );
};

const renderTree = (
  rootUnits: FlowGraphUnitDto[],
  options: {
    canOpenScopeUnit?: (unit: FlowGraphUnitDto) => boolean;
    currentUnitId?: string;
    focusRequest?: UnitTreeFocusRequest;
    selectedUnitId?: string;
    isUnitEnabled?: (unit: FlowGraphUnitDto) => boolean;
    onEscape?: VoidFunction;
    onEnterUnit?: (unitId: string) => void;
    onOpenScope?: (unitId: string) => void;
    onSelectUnit?: (unitId: string) => void;
  } = {},
) =>
  render(
    <ThemeProvider theme={createTheme()}>
      <UnitTreeSelector
        rootUnits={rootUnits}
        unitById={createUnitById(rootUnits)}
        canOpenScopeUnit={options.canOpenScopeUnit}
        currentUnitId={options.currentUnitId}
        focusRequest={options.focusRequest}
        selectedUnitId={options.selectedUnitId}
        autoScrollSelectedUnit={false}
        isUnitEnabled={options.isUnitEnabled}
        onEscape={options.onEscape}
        onEnterUnit={options.onEnterUnit}
        onOpenScope={options.onOpenScope}
        onSelectUnit={options.onSelectUnit ?? (() => undefined)}
        ariaLabel="Unit tree"
        title="Unit tree"
      />
    </ThemeProvider>,
  );

const DetailFocusFixture = () => {
  const invokingButtonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(true);

  return (
    <>
      <button ref={invokingButtonRef} onClick={() => setOpen(true)}>
        Open details
      </button>
      {open && (
        <SharedUnitDetailPane
          title="/root/job"
          subtitle="Job"
          ariaLabel="Unit details"
          collapsedAriaLabel="Collapsed unit details"
          collapseTooltip="Collapse details"
          closeAriaLabel="Close details"
          onClose={() => {
            setOpen(false);
            invokingButtonRef.current?.focus();
          }}
          onReturnFocus={() => invokingButtonRef.current?.focus()}
          rows={[{ label: "Path", value: "/root/job" }]}
          actions={[{ label: "Open", onClick: () => undefined }]}
        />
      )}
    </>
  );
};

suite("Browser accessibility DOM", () => {
  let dom: JSDOM;
  let previousGlobals: GlobalDescriptorMap;

  suiteSetup(() => {
    ({ dom, previous: previousGlobals } = installDomGlobals());
  });

  teardown(() => {
    cleanup();
    dom.window.document.body.innerHTML = "";
  });

  suiteTeardown(() => {
    restoreDomGlobals(dom, previousGlobals);
  });

  test("keeps one treeitem in the Tab sequence and preserves focus on rerender", () => {
    const root = createUnit("/root", 0);
    const other = createUnit("/other", 0);
    const view = renderTree([root, other], {
      currentUnitId: root.id,
      selectedUnitId: root.id,
    });
    const rows = view.getAllByRole("treeitem");

    assert.strictEqual(rows.filter((row) => row.tabIndex === 0).length, 1);
    rows[0].focus();
    fireEvent.keyDown(rows[0], { key: "ArrowDown" });
    assert.strictEqual(document.activeElement, rows[1]);
    view.rerender(
      <ThemeProvider theme={createTheme()}>
        <UnitTreeSelector
          rootUnits={[root, other]}
          unitById={createUnitById([root, other])}
          currentUnitId={root.id}
          selectedUnitId={other.id}
          autoScrollSelectedUnit={false}
          onSelectUnit={() => undefined}
          ariaLabel="Unit tree"
          title="Unit tree"
        />
      </ThemeProvider>,
    );
    assert.strictEqual(document.activeElement, rows[1]);
  });

  test("keeps hidden descendants out of the DOM after collapse and restores focus", () => {
    const child = createUnit("/root/child", 1, [], "/root");
    const root = createUnit("/root", 0, [child]);
    const view = renderTree([root], {
      currentUnitId: root.id,
      selectedUnitId: root.id,
    });
    const rootRow = view.getByRole("treeitem", { name: /root/i });

    rootRow.focus();
    fireEvent.keyDown(rootRow, { key: "ArrowLeft" });
    assert.strictEqual(view.queryByRole("treeitem", { name: /child/i }), null);
    assert.strictEqual(document.activeElement, rootRow);
  });

  test("does not select a row twice when an expand button is activated", () => {
    const child = createUnit("/root/child", 1, [], "/root");
    const root = createUnit("/root", 0, [child]);
    const selected: string[] = [];
    const view = renderTree([root], {
      currentUnitId: root.id,
      onSelectUnit: (unitId) => selected.push(unitId),
    });
    const rootRow = view.getByRole("treeitem", { name: /root/i });
    const expandButton = rootRow.querySelector("button");

    assert.ok(expandButton);
    fireEvent.click(expandButton);
    assert.deepStrictEqual(selected, []);
    assert.ok(view.getByRole("treeitem", { name: /child/i }));
  });

  test("exposes disabled nested rows and keeps them out of selection", () => {
    const child = createUnit("/root/disabled", 1, [], "/root");
    const root = createUnit("/root", 0, [child]);
    const selected: string[] = [];
    const view = renderTree([root], {
      currentUnitId: root.id,
      isUnitEnabled: (unit) => unit.id !== child.id,
      onSelectUnit: (unitId) => selected.push(unitId),
    });
    const childRow = view.getByRole("treeitem", { name: /disabled/i });

    assert.strictEqual(childRow.getAttribute("aria-disabled"), "true");
    assert.strictEqual(childRow.tabIndex, -1);
    fireEvent.click(childRow);

    assert.deepStrictEqual(selected, []);
  });

  test("reveals a requested nested row and delegates scope and Escape actions", () => {
    const child = createUnit("/root/child", 1, [], "/root");
    const root = createUnit("/root", 0, [child]);
    const opened: string[] = [];
    let escaped = 0;
    const view = renderTree([root], {
      canOpenScopeUnit: (unit) => unit.id === root.id,
      focusRequest: { revision: 1, targetUnitId: child.id },
      onEscape: () => {
        escaped += 1;
      },
      onOpenScope: (unitId) => opened.push(unitId),
    });
    const childRow = view.getByRole("treeitem", { name: /child/i });

    assert.strictEqual(document.activeElement, childRow);

    const rootRow = view.getByRole("treeitem", { name: /^root$/i });
    rootRow.focus();
    fireEvent.keyDown(rootRow, { key: "Enter", altKey: true });
    fireEvent.keyDown(rootRow, { key: "Escape" });

    assert.deepStrictEqual(opened, [root.id]);
    assert.strictEqual(escaped, 1);
  });

  test("renders a bounded deep tree with one active row", () => {
    const { deepest, root } = createDeepTree(128);
    const view = renderTree([root], { selectedUnitId: deepest.id });
    const rows = view.getAllByRole("treeitem");

    assert.strictEqual(rows.length, 129);
    assert.strictEqual(rows.filter((row) => row.tabIndex === 0).length, 1);
    assert.strictEqual(
      view
        .getByRole("treeitem", { name: /deep-128/i })
        .getAttribute("aria-level"),
      "129",
    );
  });

  test("separates Enter focus handoff from Space selection", () => {
    const root = createUnit("/root", 0);
    const selected: string[] = [];
    const entered: string[] = [];
    const view = renderTree([root], {
      onSelectUnit: (unitId) => selected.push(unitId),
      onEnterUnit: (unitId) => entered.push(unitId),
    });
    const rootRow = view.getByRole("treeitem", { name: /root/i });

    rootRow.focus();
    fireEvent.keyDown(rootRow, { key: "Enter" });
    fireEvent.keyDown(rootRow, { key: " " });

    assert.deepStrictEqual(selected, ["/root", "/root"]);
    assert.deepStrictEqual(entered, ["/root"]);
  });

  test("passes focused tree markup through selected axe rules", async () => {
    const root = createUnit("/root", 0);
    const view = renderTree([root], {
      currentUnitId: root.id,
      selectedUnitId: root.id,
    });
    const results = await axe.run(view.container, {
      runOnly: {
        type: "rule",
        values: [
          "aria-allowed-attr",
          "aria-required-attr",
          "aria-valid-attr",
          "duplicate-id",
          "duplicate-id-aria",
          "role-img-alt",
        ],
      },
    });

    assert.deepStrictEqual(
      results.violations.map(({ id }) => id),
      [],
    );
  });

  test("restores detail focus and hides collapsed content", () => {
    const view = render(
      <ThemeProvider theme={createTheme()}>
        <DetailFocusFixture />
      </ThemeProvider>,
    );
    const invokingButton = view.getByRole("button", { name: "Open details" });
    const collapseButton = view.getByRole("button", {
      name: "Collapse details",
    });

    fireEvent.click(collapseButton);
    assert.ok(
      view.getByRole("complementary", { name: "Collapsed unit details" }),
    );
    fireEvent.click(view.getByRole("button", { name: "Expand details" }));
    fireEvent.click(view.getByRole("button", { name: "Close details" }));
    assert.strictEqual(document.activeElement, invokingButton);
  });

  test("keeps final-row restoration and active-descendant references grounded", async () => {
    const restoredFocus = resolveTableGridRestorationFocus(
      { kind: "cell", absolutePath: "/root/middle", columnId: "name" },
      "/root/final",
      ["/root/first", "/root/middle", "/root/final"],
      ["name"],
      [],
    );
    assert.deepStrictEqual(restoredFocus, {
      kind: "cell",
      absolutePath: "/root/final",
      columnId: "name",
    });

    const grid = document.createElement("div");
    grid.setAttribute("role", "grid");
    grid.setAttribute("aria-label", "Units");
    grid.setAttribute("aria-activedescendant", "final-cell");
    const finalCell = document.createElement("div");
    finalCell.id = "final-cell";
    finalCell.setAttribute("role", "gridcell");
    finalCell.tabIndex = 0;
    grid.append(finalCell);
    document.body.append(grid);
    finalCell.focus();
    assert.strictEqual(document.activeElement, finalCell);

    const results = await axe.run(grid, {
      runOnly: {
        type: "rule",
        values: ["aria-valid-attr", "duplicate-id", "duplicate-id-aria"],
      },
    });
    assert.deepStrictEqual(
      results.violations.map(({ id }) => id),
      [],
    );
  });

  test("keeps the virtualized table grid accessible and keyboard-addressable", () => {
    const postedMessages: unknown[] = [];
    window.vscode = {
      postMessage: (message: unknown) => postedMessages.push(message),
    } as never;

    const view = render(
      <ThemeProvider theme={createTheme()}>
        <TableGridFixture rowCount={128} />
      </ThemeProvider>,
    );
    const grid = view.getByRole("grid", { name: "Units" });
    const headers = within(grid).getAllByRole("columnheader");
    const cells = within(grid).getAllByRole("gridcell");

    assert.strictEqual(grid.getAttribute("aria-rowcount"), "131");
    assert.strictEqual(grid.getAttribute("aria-colcount"), "3");
    assert.ok(headers.length >= 3);
    assert.ok(cells.length > 0);
    assert.strictEqual(
      cells.filter((cell) => cell.getAttribute("tabindex") === "0").length,
      1,
    );
    assert.ok(cells.some((cell) => cell.getAttribute("aria-colindex") === "2"));

    const focusedCell = cells.find(
      (cell) => cell.getAttribute("tabindex") === "0",
    );
    assert.ok(focusedCell);
    focusedCell?.focus();
    fireEvent.keyDown(focusedCell, { key: "ArrowRight" });

    assert.strictEqual(
      document.activeElement?.getAttribute("role"),
      "gridcell",
    );
    assert.ok(postedMessages.length >= 1);
    delete window.vscode;
  });

  test("keeps focused and selected rows distinct during keyboard traversal", () => {
    const view = render(
      <ThemeProvider theme={createTheme()}>
        <TableGridFixture rowCount={128} />
      </ThemeProvider>,
    );
    const firstRow = view.getByRole("row", { name: /job-0/i });
    const firstCell = within(firstRow).getAllByRole("gridcell")[0];
    firstCell.focus();
    fireEvent.keyDown(firstCell, { key: "ArrowDown" });

    const secondRow = view.getByRole("row", { name: /job-1/i });
    assert.strictEqual(firstRow.getAttribute("aria-selected"), "true");
    assert.strictEqual(secondRow.getAttribute("aria-selected"), "false");
    assert.strictEqual(
      within(secondRow)
        .getAllByRole("gridcell")
        .some((cell) => cell.getAttribute("tabindex") === "0"),
      true,
    );

    const secondCell = within(secondRow).getAllByRole("gridcell")[0];
    fireEvent.keyDown(secondCell, { key: "Enter" });
    assert.strictEqual(firstRow.getAttribute("aria-selected"), "false");
    assert.strictEqual(secondRow.getAttribute("aria-selected"), "true");
  });

  test("keeps the shared search control localized, focusable, and callback-driven", () => {
    const submittedQueries: string[] = [];
    const navigatedQueries: Array<[string, HeaderSearchDirection]> = [];
    let clearCount = 0;
    const labels: HeaderSearchControlLabels = {
      helperText: {
        noResults: "一致する結果はありません。",
        matched: "一致する対象を選択しています。",
        idle: "検索対象を入力してください。",
      },
      navigation: {
        resultAriaLabel: ({ current, total }) => `${current} / ${total}`,
        previousTooltip: "前の結果",
        previousAriaLabel: "前の結果",
        nextTooltip: "次の結果",
        nextAriaLabel: "次の結果",
      },
    };
    const controlProps = {
      matchedTargetId: "/root/target",
      resultPosition: { current: 2, total: 3 },
      placeholderLabel: "検索対象",
      labels,
      onSearchNavigate: (query: string, direction: HeaderSearchDirection) =>
        navigatedQueries.push([query, direction]),
      onSearchSubmit: (query: string) => submittedQueries.push(query),
      onSearchClear: () => {
        clearCount += 1;
      },
    };
    const view = render(
      <ThemeProvider theme={createTheme()}>
        <HeaderSearchControl {...controlProps} />
      </ThemeProvider>,
    );
    const input = view.getByRole("textbox") as HTMLInputElement;
    const longQuery = `  ${"対象".repeat(128)}  `;

    assert.ok(input.placeholder.startsWith("検索対象...("));
    assert.strictEqual(
      view.getByText("一致する対象を選択しています。").textContent,
      "一致する対象を選択しています。",
    );
    assert.strictEqual(view.getByLabelText("2 / 3").textContent, "2/3");
    assert.strictEqual(
      (view.getByRole("button", { name: "前の結果" }) as HTMLButtonElement)
        .disabled,
      false,
    );

    fireEvent.change(input, { target: { value: longQuery } });
    fireEvent.keyUp(input, { key: "Enter" });
    fireEvent.keyUp(input, { key: "Enter", shiftKey: true });
    fireEvent.blur(input);
    assert.strictEqual(input.value, longQuery);
    assert.deepStrictEqual(navigatedQueries, [
      [longQuery, "next"],
      [longQuery, "previous"],
    ]);
    assert.deepStrictEqual(submittedQueries, [longQuery]);

    const isMacShortcut = input.placeholder.endsWith("(\u2318F)");
    view.getByRole("button", { name: "次の結果" }).focus();
    const shortcutEvent = new dom.window.KeyboardEvent("keydown", {
      key: "f",
      cancelable: true,
      ctrlKey: !isMacShortcut,
      metaKey: isMacShortcut,
    });
    document.dispatchEvent(shortcutEvent);
    assert.strictEqual(shortcutEvent.defaultPrevented, true);
    assert.strictEqual(document.activeElement, input);

    fireEvent.click(view.getByRole("button", { name: "検索をクリアする。" }));
    assert.strictEqual(clearCount, 1);
    assert.strictEqual(input.value, "");
    assert.strictEqual(document.activeElement, input);

    view.rerender(
      <ThemeProvider theme={createTheme()}>
        <HeaderSearchControl
          {...controlProps}
          matchedTargetId={undefined}
          resultPosition={{ current: 0, total: 0 }}
        />
      </ThemeProvider>,
    );
    assert.strictEqual(
      view.getByText("一致する結果はありません。").textContent,
      "一致する結果はありません。",
    );
    assert.strictEqual(
      view.getByRole("button", { name: "前の結果" }).hasAttribute("disabled"),
      true,
    );
    assert.strictEqual(
      view.getByRole("button", { name: "次の結果" }).hasAttribute("disabled"),
      true,
    );
  });

  test("keeps grouped display-column controls discoverable and scoped", () => {
    const createLeafColumn = (id: string, label: string) => {
      const column = {
        id,
        columns: [],
        columnDef: { header: label, enableHiding: true },
        getLeafColumns: () => [column],
        getIsVisible: () => false,
      };
      return column;
    };
    const alpha = createLeafColumn("group.alpha", "Alpha");
    const beta = createLeafColumn("group.beta", "Beta");
    const group = {
      id: "group",
      columns: [alpha, beta],
      columnDef: { header: "Group columns", enableHiding: true },
      getLeafColumns: () => [alpha, beta],
      getIsVisible: () => false,
    };
    const visibilityUpdates: unknown[] = [];
    const anchor = document.createElement("button");
    document.body.append(anchor);
    const table = {
      getAllColumns: () => [group],
      setColumnVisibility: (update: (current: object) => object) =>
        visibilityUpdates.push(update({})),
      toggleAllColumnsVisible: () => undefined,
    };
    const view = render(
      <ThemeProvider theme={createTheme()}>
        <DisplayColumnSelector
          table={table as never}
          columnVisibility={{}}
          anchorEl={anchor}
          open={true}
          onClose={() => undefined}
        />
      </ThemeProvider>,
    );

    fireEvent.click(view.getByText("Group columns"));
    assert.ok(view.getByText("Alpha"));
    assert.ok(view.getByText("Beta"));

    const leafSwitch = view.getAllByRole("checkbox").at(-1);
    assert.ok(leafSwitch);
    fireEvent.click(leafSwitch as HTMLElement);
    assert.deepStrictEqual(visibilityUpdates, [{ "group.beta": true }]);
  });

  test("keeps native flow actions one-shot and uses graph fallback focus", () => {
    let activated = 0;
    const view = render(
      <ThemeProvider theme={createTheme()}>
        <ActionIcon
          title="Open scope"
          ariaLabel="Open scope"
          onClick={() => {
            activated += 1;
          }}
          icon={<span>open</span>}
        />
      </ThemeProvider>,
    );
    const button = view.getByRole("button", { name: "Open scope" });

    fireEvent.keyDown(button, { key: "Enter" });
    assert.strictEqual(activated, 0);
    fireEvent.click(button);
    assert.strictEqual(activated, 1);
    assert.strictEqual(FLOW_NODE_ACTION_SIZE_PX, 28);

    const graphRoot = document.createElement("div");
    graphRoot.innerHTML =
      '<div class="react-flow__node" data-id="node-1" tabindex="0"></div>';
    document.body.append(graphRoot);
    const node = graphRoot.querySelector<HTMLElement>(
      '.react-flow__node[data-id="node-1"]',
    );
    assert.ok(node);
    assert.strictEqual(resolveFlowGraphEntryTabIndex([]), 0);
    assert.strictEqual(resolveFlowGraphEntryTabIndex([{ id: "node-1" }]), -1);
    assert.strictEqual(
      focusRenderedFlowNode(graphRoot, "node-1", (value) => value),
      true,
    );
    assert.strictEqual(document.activeElement, node);
  });
});
