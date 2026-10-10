import * as assert from "assert";
import * as fs from "fs";
import * as path from "path";
import {
  chromium,
  type Browser,
  type BrowserContext,
  type Page,
} from "playwright";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import React, { useMemo, useRef, useState } from "react";
import { VirtuosoMockContext } from "react-virtuoso";
import axe from "axe-core";
import {
  act,
  cleanup,
  fireEvent,
  render,
  waitFor,
  within,
} from "@testing-library/react";
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
import { MyAppContextProvider } from "../../presentation/webview/editor/MyContexts";
import { createViewerEventBridge } from "../../presentation/webview/editor/viewerEventBridge";
import { createViewerResourceStateMessage } from "../../presentation/webview/viewerHostMessages";

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

type AccessibilityDeepTreeFixture = {
  mount: (rootUnits: FlowGraphUnitDto[], selectedUnitId: string) => void;
  dispose: () => void;
};

type AccessibilityBrowserWindow = Window & {
  accessibilityDeepTreeFixture?: AccessibilityDeepTreeFixture;
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

const getTreeItemByUnitId = (
  container: HTMLElement,
  unitId: string,
): HTMLElement => {
  const row = Array.from(
    container.querySelectorAll<HTMLElement>('[role="treeitem"]'),
  ).find((candidate) => candidate.dataset.unitTreeUnitId === unitId);
  assert.ok(row, `Expected tree item ${unitId}`);
  return row;
};

const createTableRow = (index: number): TableRowView =>
  ({
    id: `job-${index}`,
    absolutePath: `/root/job-${index}`,
    group1: {
      name: `job-${index}`,
    },
  }) as unknown as TableRowView;

const getGridRowByUnitName = (
  grid: HTMLElement,
  unitName: string,
): HTMLElement => {
  const row = Array.from(
    grid.querySelectorAll<HTMLElement>('[role="row"]'),
  ).find(
    (candidate) =>
      candidate
        .querySelectorAll('[role="gridcell"]')[1]
        ?.textContent?.trim() === unitName,
  );
  assert.ok(row, `Expected a grid row for ${unitName}`);
  return row;
};

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
    <VirtuosoMockContext.Provider
      value={{ itemHeight: 36, viewportHeight: 480 }}
    >
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
    </VirtuosoMockContext.Provider>
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
  let previousWindowDescriptors: Map<string, PropertyDescriptor | undefined>;
  let previousScrollIntoView: PropertyDescriptor | undefined;

  suiteSetup(() => {
    previousWindowDescriptors = new Map(
      ["matchMedia", "scrollTo"].map((key) => [
        key,
        Object.getOwnPropertyDescriptor(window, key),
      ]),
    );
    previousScrollIntoView = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      "scrollIntoView",
    );
    Object.defineProperty(window, "matchMedia", {
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
    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
      configurable: true,
      value: () => undefined,
    });
    Object.defineProperty(window, "scrollTo", {
      configurable: true,
      value: () => undefined,
    });
  });

  teardown(() => {
    cleanup();
    delete window.vscode;
    delete window.EventBridge;
    document.body.innerHTML = "";
  });

  suiteTeardown(() => {
    for (const [key, descriptor] of previousWindowDescriptors) {
      if (descriptor) {
        Object.defineProperty(window, key, descriptor);
      } else {
        delete (window as unknown as Record<string, unknown>)[key];
      }
    }
    if (previousScrollIntoView) {
      Object.defineProperty(
        HTMLElement.prototype,
        "scrollIntoView",
        previousScrollIntoView,
      );
    } else {
      delete (HTMLElement.prototype as unknown as Record<string, unknown>)[
        "scrollIntoView"
      ];
    }
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

  test("keeps collapsed descendants out of the accessibility tree and restores focus", async () => {
    const child = createUnit("/root/child", 1, [], "/root");
    const root = createUnit("/root", 0, [child]);
    const view = renderTree([root], {
      currentUnitId: root.id,
      selectedUnitId: root.id,
    });
    const rootRow = getTreeItemByUnitId(view.container, root.id);

    rootRow.focus();
    fireEvent.keyDown(rootRow, { key: "ArrowLeft" });
    await waitFor(() =>
      assert.ok(!view.queryByRole("treeitem", { name: /child/i })),
    );
    assert.ok(document.activeElement === rootRow);
  });

  test("does not select a row twice when an expand button is activated", () => {
    const child = createUnit("/root/child", 1, [], "/root");
    const root = createUnit("/root", 0, [child]);
    const selected: string[] = [];
    const view = renderTree([root], {
      currentUnitId: root.id,
      onSelectUnit: (unitId) => selected.push(unitId),
    });
    const rootRow = getTreeItemByUnitId(view.container, root.id);
    const expandButton = rootRow.querySelector("button");

    assert.ok(expandButton);
    fireEvent.click(expandButton);
    assert.deepStrictEqual(selected, []);
    assert.ok(getTreeItemByUnitId(view.container, child.id));
  });

  test("selects and focuses rows while child pointer controls stay isolated", () => {
    const child = createUnit("/root/child", 1, [], "/root");
    const root = createUnit("/root", 0, [child]);
    const selected: string[] = [];
    const opened: string[] = [];
    const view = renderTree([root], {
      canOpenScopeUnit: (unit) => unit.id === root.id,
      onOpenScope: (unitId) => opened.push(unitId),
      onSelectUnit: (unitId) => selected.push(unitId),
    });
    const rootRow = getTreeItemByUnitId(view.container, root.id);
    const rowFrame = rootRow.querySelector<HTMLElement>(
      '[data-unit-tree-row="true"]',
    );
    const expandButton = rootRow.querySelector("button");

    assert.ok(rowFrame);
    assert.ok(expandButton);
    fireEvent.click(expandButton);
    assert.deepStrictEqual(selected, []);
    const childRow = view.container.querySelector(
      '[data-unit-tree-unit-id="/root/child"]',
    ) as HTMLElement | null;
    assert.ok(childRow);
    assert.strictEqual(childRow.getAttribute("role"), "treeitem");

    const openScopeButton = rootRow.querySelectorAll("button")[1];
    assert.ok(openScopeButton);
    fireEvent.click(openScopeButton);
    assert.deepStrictEqual(opened, [root.id]);
    assert.deepStrictEqual(selected, []);

    fireEvent.click(childRow);
    assert.deepStrictEqual(selected, [child.id]);

    fireEvent.mouseDown(rowFrame);
    assert.strictEqual(document.activeElement, rootRow);
    fireEvent.click(rowFrame);
    assert.deepStrictEqual(selected, [child.id, root.id]);
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
    const rootRow = getTreeItemByUnitId(view.container, root.id);
    const childRow = getTreeItemByUnitId(view.container, child.id);

    assert.strictEqual(childRow.getAttribute("aria-disabled"), "true");
    assert.strictEqual(childRow.tabIndex, -1);
    rootRow.focus();
    fireEvent.mouseDown(childRow);
    assert.strictEqual(document.activeElement, rootRow);
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
    const childRow = getTreeItemByUnitId(view.container, child.id);

    assert.strictEqual(document.activeElement, childRow);

    const rootRow = getTreeItemByUnitId(view.container, root.id);
    rootRow.focus();
    fireEvent.keyDown(rootRow, { key: "Enter", altKey: true });
    fireEvent.keyDown(rootRow, { key: "Escape" });

    assert.deepStrictEqual(opened, [root.id]);
    assert.strictEqual(escaped, 1);
  });

  test("renders a bounded deep tree with one active row", async function () {
    this.timeout(30_000);
    const { deepest, root } = createDeepTree(128);
    const browserErrors: string[] = [];
    const cleanupErrors: unknown[] = [];
    let browser: Browser | undefined;
    let context: BrowserContext | undefined;
    let page: Page | undefined;
    let fixtureLoaded = false;
    let failure: unknown;
    let failed = false;
    let browserStep = "launching Chromium";
    let state:
      | {
          rowCount: number;
          deepestAriaLevel: string | null;
          selectedRowCount: number;
          tabStopCount: number;
        }
      | undefined;

    try {
      browser = await chromium.launch({ timeout: 10_000 });
      browserStep = "creating browser context";
      context = await browser.newContext();
      browserStep = "opening browser page";
      page = await context.newPage();
      page.on("console", (message) => {
        if (message.type() === "error") {
          browserErrors.push(message.text());
        }
      });
      page.on("pageerror", (error) => browserErrors.push(error.message));
      browserStep = "loading the browser fixture bundle";
      const fixtureBundle = fs.readFileSync(
        path.resolve(__dirname, "../fixtures/accessibilityDeepTree.bundle.js"),
        "utf8",
      );
      await page.setContent(
        `<!doctype html><html><body><script>${fixtureBundle}</script></body></html>`,
        { timeout: 7_000 },
      );
      fixtureLoaded = true;
      browserStep = "mounting the deep tree component";
      const serializedFixture = JSON.stringify({
        rootUnits: [root],
        selectedUnitId: deepest.id,
      });
      await page.evaluate((payload) => {
        const { rootUnits, selectedUnitId } = JSON.parse(payload) as {
          rootUnits: FlowGraphUnitDto[];
          selectedUnitId: string;
        };
        const fixture = (window as AccessibilityBrowserWindow)
          .accessibilityDeepTreeFixture;
        if (!fixture) {
          throw new Error("The accessibility browser fixture did not load.");
        }
        fixture.mount(rootUnits, selectedUnitId);
      }, serializedFixture);
      browserStep = "waiting for the rendered deep tree";
      await page.waitForFunction(
        () => document.querySelectorAll('[role="treeitem"]').length === 129,
        undefined,
        { timeout: 8_000 },
      );
      browserStep = "reading rendered tree accessibility state";
      state = await page.evaluate(() => {
        const rows = Array.from(
          document.querySelectorAll<HTMLElement>('[role="treeitem"]'),
        );
        const deepestRow = rows.find(
          (row) => row.getAttribute("aria-level") === "129",
        );
        return {
          rowCount: rows.length,
          deepestAriaLevel: deepestRow?.getAttribute("aria-level") ?? null,
          selectedRowCount: rows.filter(
            (row) => row.getAttribute("aria-selected") === "true",
          ).length,
          tabStopCount: rows.filter((row) => row.tabIndex === 0).length,
        };
      });
    } catch (error) {
      failed = true;
      failure = new Error(
        `The accessibility browser failed while ${browserStep}.`,
        { cause: error },
      );
    }

    if (page !== undefined && fixtureLoaded) {
      try {
        await page.evaluate(() => {
          const fixture = (window as AccessibilityBrowserWindow)
            .accessibilityDeepTreeFixture;
          if (!fixture) {
            throw new Error("The accessibility browser fixture was lost.");
          }
          fixture.dispose();
        });
      } catch (error) {
        cleanupErrors.push(error);
      }
    }
    if (page !== undefined) {
      try {
        await page.close();
      } catch (error) {
        cleanupErrors.push(error);
      }
    }
    if (context !== undefined) {
      try {
        await context.close();
      } catch (error) {
        cleanupErrors.push(error);
      }
    }
    if (browser !== undefined) {
      try {
        await browser.close();
      } catch (error) {
        cleanupErrors.push(error);
      }
    }

    if (browserErrors.length > 0) {
      const browserError = new Error(
        `The accessibility browser reported errors: ${browserErrors.join("; ")}`,
      );
      failure = failed
        ? new AggregateError(
            [failure, browserError],
            "The accessibility browser case failed and reported browser errors.",
          )
        : browserError;
      failed = true;
    }
    if (failed) {
      if (cleanupErrors.length > 0) {
        throw new AggregateError(
          [failure, ...cleanupErrors],
          "The accessibility browser case failed and cleanup also failed.",
        );
      }
      throw failure;
    }
    if (cleanupErrors.length > 0) {
      throw new AggregateError(
        cleanupErrors,
        "The accessibility browser case cleanup failed.",
      );
    }

    assert.deepStrictEqual(state, {
      rowCount: 129,
      deepestAriaLevel: "129",
      selectedRowCount: 1,
      tabStopCount: 1,
    });
  });

  test("separates Enter focus handoff from Space selection", () => {
    const root = createUnit("/root", 0);
    const selected: string[] = [];
    const entered: string[] = [];
    const view = renderTree([root], {
      onSelectUnit: (unitId) => selected.push(unitId),
      onEnterUnit: (unitId) => entered.push(unitId),
    });
    const rootRow = getTreeItemByUnitId(view.container, root.id);

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
    const view = render(
      <ThemeProvider theme={createTheme()}>
        <TableGridFixture rowCount={128} />
      </ThemeProvider>,
    );
    const grid = view.getByRole("grid", { name: "Units" });
    const headers = within(grid).getAllByRole("columnheader");
    const cells = within(grid).getAllByRole("gridcell");

    assert.strictEqual(grid.getAttribute("aria-rowcount"), "129");
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
    assert.strictEqual(
      document.activeElement?.getAttribute("aria-colindex"),
      "2",
    );
    assert.strictEqual(
      document.activeElement
        ?.closest('[role="row"]')
        ?.querySelectorAll('[role="gridcell"]')[1]
        ?.textContent?.trim(),
      "job-0",
    );
  });

  test("keeps focused and selected rows distinct during keyboard traversal", () => {
    const view = render(
      <ThemeProvider theme={createTheme()}>
        <TableGridFixture rowCount={128} />
      </ThemeProvider>,
    );
    const grid = view.getByRole("grid", { name: "Units" });
    const firstRow = getGridRowByUnitName(grid, "job-0");
    const firstCell = within(firstRow).getAllByRole("gridcell")[0];
    firstCell.focus();
    fireEvent.keyDown(firstCell, { key: "ArrowDown" });

    const secondRow = getGridRowByUnitName(grid, "job-1");
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

  test("keeps the shared search control localized, focusable, and callback-driven", async () => {
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
    const eventBridge = createViewerEventBridge();
    window.EventBridge = eventBridge;
    window.vscode = { postMessage: () => undefined } as never;
    const renderControl = (
      matchedTargetId = controlProps.matchedTargetId,
      resultPosition = controlProps.resultPosition,
    ) => (
      <ThemeProvider theme={createTheme()}>
        <MyAppContextProvider>
          <HeaderSearchControl
            {...controlProps}
            matchedTargetId={matchedTargetId}
            resultPosition={resultPosition}
          />
        </MyAppContextProvider>
      </ThemeProvider>
    );
    const view = render(renderControl());
    act(() => {
      eventBridge.dispatch(
        new MessageEvent("message", {
          data: createViewerResourceStateMessage({
            isDarkMode: false,
            lang: "ja",
            scrollType: "table",
          }),
        }),
      );
    });
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
    await waitFor(() =>
      assert.ok(view.getByRole("button", { name: "検索をクリアする。" })),
    );

    const isMacShortcut = input.placeholder.endsWith("(\u2318F)");
    view.getByRole("button", { name: "次の結果" }).focus();
    const shortcutEvent = new KeyboardEvent("keydown", {
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

    view.rerender(renderControl(undefined, { current: 0, total: 0 }));
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
        getCanHide: () => true,
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
      getCanHide: () => true,
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

    const leafSwitch = view.getAllByRole("switch").at(-1);
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
