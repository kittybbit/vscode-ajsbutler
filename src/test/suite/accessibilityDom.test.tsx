import * as assert from "assert";
import { JSDOM } from "jsdom";
import React, { useRef, useState } from "react";
import axe from "axe-core";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import type { FlowGraphUnitDto } from "../../application/flow-graph/flowGraphDocument";
import UnitTreeSelector from "../../presentation/webview/editor/shared/UnitTreeSelector";
import SharedUnitDetailPane from "../../presentation/webview/editor/shared/SharedUnitDetailPane";
import { resolveTableGridRestorationFocus } from "../../presentation/webview/editor/ajsTable/navigation";
import {
  focusRenderedFlowNode,
  resolveFlowGraphEntryTabIndex,
} from "../../presentation/webview/editor/ajsFlow/flowKeyboardNavigation";
import {
  ActionIcon,
  FLOW_NODE_ACTION_SIZE_PX,
} from "../../presentation/webview/editor/ajsFlow/nodes/AjsNode";

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

const renderTree = (
  rootUnits: FlowGraphUnitDto[],
  options: {
    currentUnitId?: string;
    selectedUnitId?: string;
    isUnitEnabled?: (unit: FlowGraphUnitDto) => boolean;
    onSelectUnit?: (unitId: string) => void;
  } = {},
) =>
  render(
    <ThemeProvider theme={createTheme()}>
      <UnitTreeSelector
        rootUnits={rootUnits}
        unitById={createUnitById(rootUnits)}
        currentUnitId={options.currentUnitId}
        selectedUnitId={options.selectedUnitId}
        autoScrollSelectedUnit={false}
        isUnitEnabled={options.isUnitEnabled}
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
