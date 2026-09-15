import * as assert from "assert";
import { JSDOM } from "jsdom";
import axe from "axe-core";
import React from "react";
import { VirtuosoMockContext } from "react-virtuoso";
import {
  act,
  cleanup,
  fireEvent,
  render,
  within,
} from "@testing-library/react";
import SemanticDiffExplorerApp from "../../presentation/webview/editor/semanticDiffExplorer/SemanticDiffExplorerApp";
import { buildSemanticDiffOutputContext } from "../../application/semantic-diff/buildSemanticDiffOutputContext";
import {
  createSemanticDiffExplorerActionIdAllocator,
  createSemanticDiffExplorerSession,
  createSemanticDiffExplorerSessionIdAllocator,
} from "../../application/semantic-diff/semanticDiffExplorer";
import type {
  SemanticDiffExplorerActionSet,
  SemanticDiffExplorerCard,
  SemanticDiffExplorerLeaf,
  SemanticDiffExplorerTreeNode,
  SemanticDiffExplorerViewModel,
} from "../../application/semantic-diff/semanticDiffExplorer";
import {
  SemanticDiffExplorerView,
  focusExplorerRowAfterVirtualizedScroll,
  flattenSemanticDiffExplorerTree,
} from "../../presentation/webview/editor/semanticDiffExplorer/semanticDiffExplorerView";
import { getSemanticDiffExplorerLabels } from "../../presentation/webview/editor/semanticDiffExplorer/semanticDiffExplorerLocalization";
import { createViewerEventBridge } from "../../presentation/webview/editor/viewerEventBridge";
import { createViewerResourceStateMessage } from "../../presentation/webview/viewerHostMessages";
import {
  createSemanticDiffTheme,
  semanticDiffExplorerFocusSx,
  semanticDiffExplorerGlobalStyles,
  semanticDiffExplorerSelectionSx,
  semanticDiffExplorerTargetSizePx,
} from "../../presentation/webview/shared/muiTheme";
import {
  createSemanticDiffExplorerSessionMessage,
  createSemanticDiffExplorerError,
  createSemanticDiffExplorerFailureMessage,
} from "../../application/semantic-diff/semanticDiffExplorerMessages";
import { createSemanticDiffDetail } from "../../application/semantic-diff/semanticDiffStructuredFacts";
import type { SemanticDiffResult } from "../../application/semantic-diff/semanticDiffDto";

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
  const requestAnimationFrame = (callback: FrameRequestCallback): number =>
    dom.window.setTimeout(() => callback(dom.window.performance.now()), 0);
  const cancelAnimationFrame = (handle: number): void =>
    dom.window.clearTimeout(handle);
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
    requestAnimationFrame,
    cancelAnimationFrame,
    IS_REACT_ACT_ENVIRONMENT: true,
  };
  dom.window.requestAnimationFrame = requestAnimationFrame;
  dom.window.cancelAnimationFrame = cancelAnimationFrame;
  dom.window.HTMLElement.prototype.scrollIntoView = () => undefined;
  dom.window.HTMLElement.prototype.scrollTo = () => undefined;
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
  return { dom, globals };
};

const restoreDom = (dom: JSDOM, globals: GlobalValue[]): void => {
  globals.forEach(({ key, descriptor }) => {
    if (descriptor) Object.defineProperty(globalThis, key, descriptor);
    else delete (globalThis as Record<string, unknown>)[key];
  });
  dom.window.close();
};

const availableActions = (): SemanticDiffExplorerActionSet => ({
  source: {
    available: true,
    actionId: "sde-action-900000001" as never,
    unavailableReason: null,
  },
  flow: {
    available: false,
    actionId: null,
    unavailableReason: "missing-target",
  },
});

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

const createLeaf = (
  id: string,
  required = false,
  actions = unavailableActions(),
): SemanticDiffExplorerLeaf => ({
  kind: "change",
  id,
  recordId: id,
  changeKind: "changed",
  elementKind: "unit",
  confirmationLevel: required ? "confirmation-required" : "confirmed",
  attributeCategory: null,
  identityDecisionId: null,
  targetSide: "after",
  target: {
    side: "after",
    value: {
      kind: "unit",
      unit: {
        id,
        name: `unit-${id}`,
        absolutePath: `/group/${id}`,
        unitType: "unit",
      },
    },
  },
  before: null,
  after: null,
  relationPair: null,
  detail: {
    unitPath: `/group/${id}`,
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
  actions,
});

const card = (
  id: SemanticDiffExplorerCard["id"],
  count: number,
): SemanticDiffExplorerCard => ({ id, count, counts: { total: count } });

const createViewModel = (leafCount = 2): SemanticDiffExplorerViewModel => {
  const leaves = Array.from({ length: leafCount }, (_, index) =>
    createLeaf(
      `leaf-${index}`,
      index === 1,
      index === 0 ? availableActions() : undefined,
    ),
  );
  const group: SemanticDiffExplorerTreeNode = {
    id: "group:root",
    kind: "job-group",
    label: "Root",
    path: "/group",
    children: [],
    leaves,
  };
  return {
    filter: "all",
    cards: [
      card("changes", leafCount),
      card("elements", leafCount),
      card("attributes", 0),
      card("confirmation-required", leafCount > 1 ? 1 : 0),
      card("unsupported", 0),
      card("limitations", 0),
      card("schedule-run-changes", 0),
    ],
    tree: {
      id: "root",
      kind: "root",
      label: "root",
      path: null,
      children: [group],
      leaves: [],
    },
    leafCount,
    status: leafCount > 0 ? "findings" : "empty",
  };
};

const createSessionFixture = (
  withConfirmationRecords = true,
  withRequiredChange = true,
) => {
  const target = (id: string) => ({
    kind: "unit" as const,
    unit: {
      id,
      name: id,
      absolutePath: `/group/${id}`,
      unitType: "unit",
    },
  });
  const result: SemanticDiffResult = {
    inputs: {
      before: { side: "before", unitIds: [], relations: [] },
      after: { side: "after", unitIds: [], relations: [] },
    },
    changes: [
      {
        id: "ordinary-change",
        kind: "changed",
        elementKind: "unit",
        confirmationLevel: "confirmed",
        before: target("ordinary-before"),
        after: target("ordinary-change"),
        relationPair: null,
        identityDecisionId: "identity:ordinary-change",
      },
      ...(withRequiredChange
        ? [
            {
              id: "required-change",
              kind: "changed" as const,
              elementKind: "unit" as const,
              confirmationLevel: "confirmation-required" as const,
              before: target("required-before"),
              after: target("required-change"),
              relationPair: null,
              identityDecisionId: "identity:required-change",
            },
          ]
        : []),
    ],
    identityDecisions: [],
    confirmationRequired: withConfirmationRecords
      ? [
          {
            id: "confirmation-record",
            reasonCode: "wait-target-changed",
            target: target("confirmation-record"),
            relatedTargets: [],
            detail: createSemanticDiffDetail(),
            constraints: [],
            warning: null,
          },
        ]
      : [],
    unsupportedItems: [],
    limitations: [],
  };
  const context = buildSemanticDiffOutputContext(result);
  const session = createSemanticDiffExplorerSession(context, {
    sessionIdAllocator: createSemanticDiffExplorerSessionIdAllocator(900),
    actionIdAllocator: createSemanticDiffExplorerActionIdAllocator(900),
  });
  return { context, session };
};

const recordTuples = (container: HTMLElement): string[] =>
  [
    ...container.querySelectorAll<HTMLElement>(
      "[data-record-kind][data-record-id][data-row-id]",
    ),
  ]
    .map(
      (row) =>
        `${row.dataset.recordKind}:${row.dataset.recordId}:${row.dataset.rowId}`,
    )
    .sort();

const factText = (element: Element): string =>
  element.querySelector(".MuiChip-label")?.textContent?.trim() ??
  element.textContent?.trim() ??
  "";

const relativeLuminance = (hex: string): number => {
  const normalized =
    hex.length === 4
      ? `#${[1, 2, 3].map((index) => `${hex[index]}${hex[index]}`).join("")}`
      : hex;
  const channels = [0, 2, 4].map(
    (offset) =>
      Number.parseInt(normalized.slice(offset + 1, offset + 3), 16) / 255,
  );
  const linear = channels.map((channel) =>
    channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * linear[0]! + 0.7152 * linear[1]! + 0.0722 * linear[2]!;
};

const contrastRatio = (first: string, second: string): number => {
  const firstLuminance = relativeLuminance(first);
  const secondLuminance = relativeLuminance(second);
  return (
    (Math.max(firstLuminance, secondLuminance) + 0.05) /
    (Math.min(firstLuminance, secondLuminance) + 0.05)
  );
};

suite("Semantic diff Explorer DOM", () => {
  let dom: JSDOM;
  let globals: GlobalValue[];
  let eventBridge: ReturnType<typeof createViewerEventBridge>;

  setup(() => {
    ({ dom, globals } = installDom());
    eventBridge = createViewerEventBridge();
    Object.defineProperty(dom.window, "EventBridge", {
      configurable: true,
      value: eventBridge,
    });
  });
  teardown(() => {
    cleanup();
    restoreDom(dom, globals);
  });

  const dispatchResource = (isDarkMode: boolean, lang: string): void => {
    act(() => {
      eventBridge.dispatch({
        data: createViewerResourceStateMessage({
          isDarkMode,
          lang,
          scrollType: "window",
        }),
      } as MessageEvent);
    });
  };

  test("uses MUI standard colors and the stricter focus/target baseline", () => {
    const lightTheme = createSemanticDiffTheme({ mode: "light" });
    const darkTheme = createSemanticDiffTheme({ mode: "dark" });
    const lightGlobalStyles = semanticDiffExplorerGlobalStyles(lightTheme);
    assert.strictEqual(lightTheme.palette.background.default, "#fff");
    assert.strictEqual(darkTheme.palette.background.default, "#121212");
    assert.ok(contrastRatio(lightTheme.palette.primary.main, "#ffffff") >= 3);
    assert.ok(contrastRatio(darkTheme.palette.primary.main, "#121212") >= 3);
    assert.ok(
      contrastRatio(
        lightTheme.palette.primary.main,
        lightTheme.palette.background.default,
      ) >= 3,
    );
    assert.ok(
      contrastRatio(
        darkTheme.palette.primary.main,
        darkTheme.palette.background.default,
      ) >= 3,
    );
    assert.strictEqual(lightGlobalStyles.body.backgroundColor, "#fff");
    assert.strictEqual(lightGlobalStyles.body.color, "rgba(0, 0, 0, 0.87)");
    assert.strictEqual(semanticDiffExplorerTargetSizePx, 44);
    assert.ok(semanticDiffExplorerFocusSx["&:focus-visible"]);
    assert.ok(lightGlobalStyles["@media (forced-colors: active)"]);
  });

  test("injects resolved theme colors into the document stylesheet", () => {
    render(<SemanticDiffExplorerView viewModel={createViewModel()} />);
    const injectedStyles = [...dom.window.document.querySelectorAll("style")]
      .map((style) => style.textContent ?? "")
      .join("\n");
    assert.match(injectedStyles, /background-color:#fff/);
    assert.match(injectedStyles, /color:rgba\(0,\s*0,\s*0,\s*0\.87\)/);
    assert.strictEqual(
      getComputedStyle(document.body).backgroundColor,
      "rgb(255, 255, 255)",
    );
    assert.strictEqual(
      getComputedStyle(document.body).color,
      "rgba(0, 0, 0, 0.87)",
    );
  });

  test("uses system forced-colors and a visible two-pixel focus", () => {
    const focus = semanticDiffExplorerFocusSx["&:focus-visible"];
    assert.strictEqual(typeof focus?.outline, "function");
    if (typeof focus?.outline === "function") {
      assert.match(
        String(focus.outline(createSemanticDiffTheme({ mode: "light" }))),
        /2px solid/,
      );
    }
    const forcedColors = semanticDiffExplorerGlobalStyles(
      createSemanticDiffTheme({ mode: "light" }),
    )["@media (forced-colors: active)"] as Record<
      string,
      Record<string, string>
    >;
    assert.deepStrictEqual(forcedColors["button, select"], {
      backgroundColor: "ButtonFace",
      color: "ButtonText",
      borderColor: "ButtonText",
    });
    assert.strictEqual(
      forcedColors["button:focus-visible, select:focus-visible"]?.outline,
      "2px solid Highlight",
    );
    assert.strictEqual(
      "forcedColorAdjust" in forcedColors["button, select"]!,
      false,
    );
    const forcedSelection = semanticDiffExplorerSelectionSx(true)[
      "@media (forced-colors: active)"
    ] as Record<string, string>;
    assert.strictEqual(forcedSelection.borderLeftColor, "Highlight");
  });

  test("marks selected rows with a theme-contrast leading marker", () => {
    const lightView = render(
      <SemanticDiffExplorerView
        viewModel={createViewModel()}
        themeMode="light"
      />,
    );
    const lightTree = lightView.getByRole("tree");
    fireEvent.keyDown(lightTree, { key: "ArrowRight" });
    const lightSelected = lightView
      .getAllByRole("treeitem")
      .find((item) => item.getAttribute("aria-selected") === "true");
    assert.ok(lightSelected);
    assert.strictEqual(getComputedStyle(lightSelected!).borderLeftWidth, "4px");
    assert.strictEqual(
      getComputedStyle(lightSelected!).borderLeftColor,
      "rgb(25, 118, 210)",
    );
    const lightStyles = [...dom.window.document.querySelectorAll("style")]
      .map((style) => style.textContent ?? "")
      .join("\n");
    assert.match(lightStyles, /border-left-color:Highlight/);

    lightView.unmount();
    const darkView = render(
      <SemanticDiffExplorerView
        viewModel={createViewModel()}
        themeMode="dark"
      />,
    );
    const darkTree = darkView.getByRole("tree");
    fireEvent.keyDown(darkTree, { key: "ArrowRight" });
    const darkSelected = darkView
      .getAllByRole("treeitem")
      .find((item) => item.getAttribute("aria-selected") === "true");
    assert.ok(darkSelected);
    assert.strictEqual(getComputedStyle(darkSelected!).borderLeftWidth, "4px");
    assert.strictEqual(
      getComputedStyle(darkSelected!).borderLeftColor,
      "rgb(144, 202, 249)",
    );
  });

  test("keeps the semantic surface available at 200% text and 400%/320px reflow", () => {
    dom.window.document.documentElement.style.fontSize = "200%";
    Object.defineProperty(dom.window, "innerWidth", {
      configurable: true,
      value: 320,
    });
    const view = render(
      <SemanticDiffExplorerView viewModel={createViewModel()} />,
    );
    const output = view.getByRole("button", { name: "Output" });
    const filter = view.getByRole("combobox", { name: "Filter changes" });
    const tree = view.getByRole("tree", { name: "Semantic diff changes" });
    assert.strictEqual(output.getAttribute("type"), "button");
    assert.strictEqual(
      getComputedStyle(output).minHeight,
      `${semanticDiffExplorerTargetSizePx}px`,
    );
    assert.strictEqual(
      getComputedStyle(filter).minHeight,
      `${semanticDiffExplorerTargetSizePx}px`,
    );
    assert.ok(view.container.querySelector('p[role="status"]')?.textContent);
    assert.ok(view.container.querySelector('[aria-live="polite"]'));
    assert.ok(tree.getAttribute("aria-activedescendant"));
    const injectedStyles = [...dom.window.document.querySelectorAll("style")]
      .map((style) => style.textContent ?? "")
      .join("\n");
    assert.match(injectedStyles, /min\(100%, 14rem\)/);
    assert.match(injectedStyles, /overflow-wrap:anywhere/);
    dom.window.document.documentElement.style.fontSize = "400%";
    view.rerender(<SemanticDiffExplorerView viewModel={createViewModel()} />);
    assert.ok(view.getByRole("button", { name: "Output" }));
    assert.ok(view.getByRole("combobox", { name: "Filter changes" }));
    assert.ok(view.getByRole("tree", { name: "Semantic diff changes" }));
  });

  test("keeps focus, name-role-value, and status contracts explicit", () => {
    const view = render(
      <SemanticDiffExplorerView viewModel={createViewModel()} />,
    );
    const output = view.getByRole("button", { name: "Output" });
    const filter = view.getByRole("combobox", { name: "Filter changes" });
    const tree = view.getByRole("tree", { name: "Semantic diff changes" });
    assert.strictEqual(output.getAttribute("type"), "button");
    assert.strictEqual(filter.getAttribute("aria-label"), "Filter changes");
    tree.focus();
    assert.strictEqual(document.activeElement, tree);
    assert.ok(tree.getAttribute("aria-activedescendant"));
    assert.match(
      String(semanticDiffExplorerFocusSx["&:focus-visible"]?.outline),
      /2px solid/,
    );
    fireEvent.change(filter, { target: { value: "confirmation-required" } });
    assert.match(
      view.container.querySelector('[aria-live="polite"]')?.textContent ?? "",
      /Confirmation required/,
    );
    assert.ok(view.container.querySelector('p[role="status"]')?.textContent);
  });

  test("renders localized cards, reasons, details, actions, and accessible tree", async () => {
    const view = render(
      <SemanticDiffExplorerView
        viewModel={createViewModel()}
        language="ja-JP"
      />,
    );
    assert.ok(
      view.getByRole("heading", { name: "セマンティック差分エクスプローラー" }),
    );
    assert.ok(view.getByRole("button", { name: "出力" }));
    assert.ok(view.getByRole("combobox", { name: "変更を絞り込む" }));
    assert.ok(view.getByRole("region", { name: "概要カード" }));
    const tree = view.getByRole("tree", { name: "セマンティック差分の変更" });
    const items = view.getAllByRole("treeitem");
    assert.ok(items.length >= 3);
    assert.ok(within(tree).getByText("確認が必要"));
    assert.strictEqual(view.queryByText("条件付きリレーションの削除"), null);
    assert.ok(view.getAllByText(/変更前: 10/).length > 0);
    assert.ok(view.getByRole("button", { name: "ソースを開く" }));
    assert.ok(
      view.getAllByRole("button", { name: /フローを開く: 対象がありません/ })
        .length > 0,
    );
    const labels = getSemanticDiffExplorerLabels("ja-JP");
    assert.strictEqual(
      labels.reason("conditional-relation-removed"),
      "条件付きリレーションの削除",
    );
    assert.strictEqual(labels.detailField("before"), "変更前");
    assert.strictEqual(labels.state("candidate"), "候補");
    assert.strictEqual(labels.state("unsupported"), "未対応");
    assert.strictEqual(labels.state("uninterpretable"), "解釈不能");
    assert.strictEqual(labels.state("uncalculated"), "未計算");
    assert.strictEqual(labels.state("parse"), "解析の制約");
    assert.strictEqual(labels.state("normalization"), "正規化の制約");
    assert.notStrictEqual(
      labels.reason("unknown-reason-code"),
      "unknown-reason-code",
    );
    assert.notStrictEqual(
      labels.error("unknown-error-code"),
      "unknown-error-code",
    );
    assert.notStrictEqual(
      labels.state("unknown-state-code"),
      "unknown-state-code",
    );
    assert.deepStrictEqual(
      [...view.container.querySelectorAll('[data-fact="change-kind"]')].map(
        factText,
      ),
      ["変更", "変更"],
    );
    assert.deepStrictEqual(
      [...view.container.querySelectorAll('[data-fact="state"]')].map(factText),
      ["確定", "確認が必要"],
    );
    // jsdom cannot resolve CSS pseudo-elements; structural axe rules remain active.
    const results = await axe.run(view.container, {
      rules: { "color-contrast": { enabled: false } },
    });
    assert.deepStrictEqual(results.violations, []);
  });

  test("filters the actual host session message by exact record tuple", async () => {
    const { session } = createSessionFixture();
    const messages: unknown[] = [];
    dom.window.document.body.dataset.semanticDiffSessionId = session.sessionId;
    (
      dom.window as unknown as {
        vscode: { postMessage: (value: unknown) => void };
      }
    ).vscode = { postMessage: (value) => messages.push(value) };

    const view = render(<SemanticDiffExplorerApp />);
    assert.strictEqual((messages[0] as { type: string }).type, "resource");
    dispatchResource(false, "en");
    assert.strictEqual(messages.length, 2);
    assert.strictEqual((messages[1] as { type: string }).type, "ready");

    await act(async () => {
      dom.window.dispatchEvent(
        new dom.window.MessageEvent("message", {
          data: createSemanticDiffExplorerSessionMessage(
            session.sessionId,
            session.viewModel,
          ),
        }),
      );
      await Promise.resolve();
    });

    assert.deepStrictEqual(recordTuples(view.container), [
      "change:ordinary-change:change:ordinary-change:0",
      "change:required-change:change:required-change:0",
      "confirmation:confirmation-record:confirmation:confirmation-record:0",
    ]);
    assert.ok(view.container.querySelector('[data-row-kind="group"]'));
    assert.ok(view.getByRole("article", { name: "Changes: 2" }));
    assert.ok(view.getByRole("article", { name: "Confirmation required: 2" }));

    const ordinaryRow = view.container.querySelector(
      '[data-record-kind="change"][data-record-id="ordinary-change"]',
    ) as HTMLElement;
    const tree = view.getByRole("tree");
    fireEvent.click(ordinaryRow);
    const ordinaryRowId = ordinaryRow.dataset.rowId;
    assert.strictEqual(
      tree.getAttribute("aria-activedescendant"),
      ordinaryRowId,
    );
    assert.strictEqual(ordinaryRow.getAttribute("aria-selected"), "true");

    fireEvent.change(view.getByRole("combobox", { name: "Filter changes" }), {
      target: { value: "confirmation-required" },
    });
    assert.deepStrictEqual(recordTuples(view.container), [
      "change:required-change:change:required-change:0",
      "confirmation:confirmation-record:confirmation:confirmation-record:0",
    ]);
    assert.strictEqual(
      view
        .getByRole("article", { name: "Changes: 2" })
        .textContent?.includes("2"),
      true,
    );
    assert.strictEqual(
      tree.getAttribute("aria-activedescendant")?.includes("ordinary-change"),
      false,
    );
    assert.strictEqual(
      view.container.querySelector('[data-record-id="ordinary-change"]'),
      null,
    );

    fireEvent.change(view.getByRole("combobox", { name: "Filter changes" }), {
      target: { value: "all" },
    });
    assert.deepStrictEqual(recordTuples(view.container), [
      "change:ordinary-change:change:ordinary-change:0",
      "change:required-change:change:required-change:0",
      "confirmation:confirmation-record:confirmation:confirmation-record:0",
    ]);
    assert.strictEqual(
      tree.getAttribute("aria-activedescendant"),
      ordinaryRowId,
    );
    assert.strictEqual(
      view.container
        .querySelector(`[data-row-id="${ordinaryRowId}"]`)
        ?.getAttribute("aria-selected"),
      "true",
    );
    assert.strictEqual(
      view.container.querySelector('[aria-live="polite"]')?.textContent,
      "All",
    );
  });

  test("announces a zero-match result in the actual session App", async () => {
    const { session } = createSessionFixture(false, false);
    dom.window.document.body.dataset.semanticDiffSessionId = session.sessionId;
    (
      dom.window as unknown as {
        vscode: { postMessage: (value: unknown) => void };
      }
    ).vscode = { postMessage: () => undefined };
    const view = render(<SemanticDiffExplorerApp />);
    dispatchResource(false, "en");

    await act(async () => {
      dom.window.dispatchEvent(
        new dom.window.MessageEvent("message", {
          data: createSemanticDiffExplorerSessionMessage(
            session.sessionId,
            session.viewModel,
          ),
        }),
      );
      await Promise.resolve();
    });
    fireEvent.change(view.getByRole("combobox", { name: "Filter changes" }), {
      target: { value: "confirmation-required" },
    });

    assert.strictEqual(
      view.container.querySelector('p[role="status"]')?.textContent,
      "No confirmation-required items match this filter.",
    );
    assert.strictEqual(
      view.container.querySelector("[data-record-kind]"),
      null,
    );
    assert.ok(view.getByRole("combobox", { name: "Filter changes" }));
    assert.ok(view.getByRole("article", { name: "Changes: 1" }));
  });

  test("renders an initial host failure instead of leaving the Explorer loading", async () => {
    const messages: unknown[] = [];
    dom.window.document.body.dataset.semanticDiffSessionId = "sde-session-1";
    (
      dom.window as unknown as {
        vscode: { postMessage: (value: unknown) => void };
      }
    ).vscode = {
      postMessage: (value) => messages.push(value),
    };
    const view = render(<SemanticDiffExplorerApp />);
    dispatchResource(false, "en");
    assert.strictEqual(messages.length, 2);
    assert.strictEqual((messages[1] as { type: string }).type, "ready");

    await act(async () => {
      dom.window.dispatchEvent(
        new dom.window.MessageEvent("message", {
          data: createSemanticDiffExplorerFailureMessage(
            null,
            null,
            null,
            createSemanticDiffExplorerError("payload-too-large"),
          ),
        }),
      );
      await Promise.resolve();
    });

    assert.strictEqual(
      view.getByRole("status").textContent,
      "The Explorer message is too large",
    );
    assert.strictEqual(
      view.queryByText("Loading Semantic Diff Explorer…"),
      null,
    );
    assert.strictEqual(
      view.container.querySelector('div[aria-live="polite"]')?.textContent,
      "The Explorer message is too large",
    );
  });

  test("follows shared resource theme and locale in loading and loaded states", async () => {
    const { session } = createSessionFixture();
    const messages: unknown[] = [];
    dom.window.document.body.dataset.semanticDiffSessionId = session.sessionId;
    (
      dom.window as unknown as {
        vscode: { postMessage: (value: unknown) => void };
      }
    ).vscode = { postMessage: (value) => messages.push(value) };

    const view = render(<SemanticDiffExplorerApp />);
    dispatchResource(false, "en");
    assert.strictEqual(
      view.getByRole("main").dataset.semanticDiffThemeMode,
      "light",
    );
    assert.match(
      [...dom.window.document.querySelectorAll("style")]
        .map((style) => style.textContent ?? "")
        .join("\n"),
      /background-color:#fff/,
    );

    dispatchResource(true, "ja-JP");
    assert.strictEqual(
      view.getByRole("main").dataset.semanticDiffThemeMode,
      "dark",
    );
    assert.ok(
      view.getByRole("heading", { name: "セマンティック差分エクスプローラー" }),
    );
    assert.match(
      [...dom.window.document.querySelectorAll("style")]
        .map((style) => style.textContent ?? "")
        .join("\n"),
      /background-color:#121212/,
    );

    await act(async () => {
      dom.window.dispatchEvent(
        new dom.window.MessageEvent("message", {
          data: createSemanticDiffExplorerSessionMessage(
            session.sessionId,
            session.viewModel,
          ),
        }),
      );
      await Promise.resolve();
    });
    assert.strictEqual(
      view.getByRole("main").dataset.semanticDiffThemeMode,
      "dark",
    );

    assert.strictEqual(messages.length, 2);
  });

  test("supports tree parent/child keyboard semantics and sibling aria positions", () => {
    const view = render(
      <SemanticDiffExplorerView viewModel={createViewModel()} />,
    );
    const tree = view.getByRole("tree");
    const items = view.getAllByRole("treeitem");
    const group = items[0]!;
    assert.strictEqual(tree.getAttribute("tabindex"), "0");
    assert.strictEqual(
      items.filter((item) => item.getAttribute("tabindex") === "0").length,
      0,
    );
    tree.focus();
    assert.strictEqual(document.activeElement, tree);
    assert.strictEqual(tree.getAttribute("aria-activedescendant"), group.id);
    assert.strictEqual(group.getAttribute("aria-posinset"), "1");
    assert.strictEqual(group.getAttribute("aria-setsize"), "1");
    fireEvent.keyDown(tree, { key: "ArrowRight" });
    const selectedLeaf = view
      .getAllByRole("treeitem")
      .find(
        (item) =>
          item.getAttribute("aria-selected") === "true" && item !== group,
      );
    assert.ok(selectedLeaf);
    assert.strictEqual(
      tree.getAttribute("aria-activedescendant"),
      selectedLeaf?.id,
    );
    assert.strictEqual(document.activeElement, tree);
    assert.match(
      view.container.querySelector('[aria-live="polite"]')?.textContent ?? "",
      /Selected Changed/,
    );
    fireEvent.keyDown(tree, { key: "Enter" });
    assert.match(
      view.container.querySelector('[aria-live="polite"]')?.textContent ?? "",
      /Selected Changed/,
    );
    fireEvent.keyDown(tree, { key: "ArrowLeft" });
    assert.strictEqual(tree.getAttribute("aria-activedescendant"), group.id);
    assert.strictEqual(document.activeElement, tree);
    assert.match(
      view.container.querySelector('[aria-live="polite"]')?.textContent ?? "",
      /Selected Root/,
    );
    fireEvent.keyDown(tree, { key: "Enter" });
    assert.strictEqual(group.getAttribute("aria-expanded"), "false");
    fireEvent.keyDown(tree, { key: "ArrowRight" });
    assert.strictEqual(group.getAttribute("aria-expanded"), "true");
  });

  test("keeps hidden selection latent while filtering with a visible active entry", () => {
    const view = render(
      <SemanticDiffExplorerView viewModel={createViewModel()} />,
    );
    const tree = view.getByRole("tree");
    const allRows = view.getAllByRole("treeitem");
    const firstLeaf = allRows[1]!;
    fireEvent.click(firstLeaf);
    assert.strictEqual(
      tree.getAttribute("aria-activedescendant"),
      firstLeaf.id,
    );

    fireEvent.change(view.getByRole("combobox"), {
      target: { value: "confirmation-required" },
    });
    const visibleRows = view.getAllByRole("treeitem");
    assert.ok(visibleRows.length > 0);
    const visibleFirst = visibleRows[0]!;
    assert.strictEqual(
      tree.getAttribute("aria-activedescendant"),
      visibleFirst.id,
    );
    assert.strictEqual(
      visibleRows.filter(
        (item) => item.getAttribute("aria-selected") === "true",
      ).length,
      0,
    );

    fireEvent.change(view.getByRole("combobox"), {
      target: { value: "all" },
    });
    assert.strictEqual(
      tree.getAttribute("aria-activedescendant"),
      firstLeaf.id,
    );
    assert.strictEqual(firstLeaf.getAttribute("aria-selected"), "true");
    assert.strictEqual(
      view
        .getAllByRole("treeitem")
        .filter((item) => item.getAttribute("aria-selected") === "true").length,
      1,
    );

    fireEvent.change(view.getByRole("combobox"), {
      target: { value: "confirmation-required" },
    });
    const filteredAgainFirst = view.getAllByRole("treeitem")[0]!;
    assert.strictEqual(
      tree.getAttribute("aria-activedescendant"),
      filteredAgainFirst.id,
    );
    assert.strictEqual(
      view
        .getAllByRole("treeitem")
        .filter((item) => item.getAttribute("aria-selected") === "true").length,
      0,
    );
    fireEvent.keyDown(tree, { key: "ArrowDown" });
    assert.strictEqual(
      tree.getAttribute("aria-activedescendant"),
      filteredAgainFirst.id,
    );
  });

  test("renders candidate and change-level unsupported facts separately", () => {
    const base = createViewModel(1);
    const group = base.tree.children[0]!;
    const candidate = {
      ...createLeaf("candidate"),
      confirmationLevel: "candidate" as const,
    };
    const unsupported = {
      ...createLeaf("unsupported"),
      confirmationLevel: "unsupported" as const,
    };
    const viewModel: SemanticDiffExplorerViewModel = {
      ...base,
      tree: {
        ...base.tree,
        children: [{ ...group, leaves: [candidate, unsupported] }],
      },
      leafCount: 2,
    };
    const view = render(
      <SemanticDiffExplorerView viewModel={viewModel} language="ja-JP" />,
    );
    assert.deepStrictEqual(
      [...view.container.querySelectorAll('[data-fact="change-kind"]')].map(
        factText,
      ),
      ["変更", "変更"],
    );
    assert.deepStrictEqual(
      [...view.container.querySelectorAll('[data-fact="state"]')].map(factText),
      ["候補", "未対応"],
    );
  });

  test("keeps a 10,000-leaf tree bounded and gives Virtuoso an imperative path", () => {
    const viewModel = createViewModel(10_000);
    const flattened = flattenSemanticDiffExplorerTree(
      viewModel.tree,
      new Set(["group:root"]),
    );
    assert.strictEqual(flattened.length, 10_001);
    assert.strictEqual(flattened.at(-1)?.size, 10_000);
    const scrolls: number[] = [];
    const view = render(
      <VirtuosoMockContext.Provider
        value={{ itemHeight: 32, viewportHeight: 400 }}
      >
        <SemanticDiffExplorerView
          viewModel={viewModel}
          virtualizedScrollToIndex={(index) => scrolls.push(index)}
        />
      </VirtuosoMockContext.Provider>,
    );
    const tree = view.getByRole("tree");
    fireEvent.keyDown(tree, { key: "End" });
    assert.deepStrictEqual(scrolls, [10_000]);
    const renderedItems = view.getAllByRole("treeitem");
    assert.ok(renderedItems.length > 0);
    assert.ok(renderedItems.length < 10_001);
    fireEvent.keyDown(tree, { key: "Home" });
    assert.ok(view.getAllByRole("treeitem").length < 10_001);
  });

  test("restores focus after an offscreen virtualized row is rendered", async () => {
    const target = dom.window.document.createElement("div");
    let frames = 0;
    const focused: HTMLElement[] = [];
    focusExplorerRowAfterVirtualizedScroll({
      id: "leaf-9999",
      getElement: () => {
        if (frames < 2) return undefined;
        return target;
      },
      focus: (element) => focused.push(element),
      requestAnimationFrame: (callback) => {
        frames += 1;
        return dom.window.setTimeout(
          () => callback(dom.window.performance.now()),
          0,
        );
      },
    });

    await new Promise<void>((resolve) => dom.window.setTimeout(resolve, 10));
    assert.strictEqual(frames, 2);
    assert.deepStrictEqual(focused, [target]);
  });
});
