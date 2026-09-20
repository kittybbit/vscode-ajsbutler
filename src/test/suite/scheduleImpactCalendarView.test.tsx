import * as assert from "assert";
import { JSDOM } from "jsdom";
import React from "react";
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { VirtuosoMockContext } from "react-virtuoso";
import { ScheduleImpactCalendarView } from "../../presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarApp";
import type {
  SemanticDiffScheduleImpact,
  SemanticDiffScheduleImpactRoot,
} from "../../application/semantic-diff/semanticDiffScheduleImpact";
import { buildScheduleImpactCalendarModel } from "../../presentation/webview/editor/scheduleImpactCalendar/scheduleImpactCalendarModel";

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
    cancelAnimationFrame: (handle: number): void =>
      dom.window.clearTimeout(handle),
    IS_REACT_ACT_ENVIRONMENT: true,
  };
  dom.window.requestAnimationFrame = requestAnimationFrame;
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
  dom.window.HTMLElement.prototype.scrollIntoView = () => undefined;
  Object.defineProperties(dom.window.HTMLElement.prototype, {
    clientHeight: {
      configurable: true,
      get: () => 480,
    },
    offsetHeight: {
      configurable: true,
      get: () => 480,
    },
    scrollHeight: {
      configurable: true,
      get: () => 480_000,
    },
  });
  dom.window.HTMLElement.prototype.scrollTo = function scrollTo(
    optionsOrX?: ScrollToOptions | number,
    y?: number,
  ): void {
    const top = typeof optionsOrX === "number" ? y : optionsOrX?.top;
    if (typeof top !== "number") return;
    this.scrollTop = top;
    this.dispatchEvent(new dom.window.Event("scroll"));
  };
  return { dom, globals };
};

const restoreDom = (dom: JSDOM, globals: GlobalValue[]): void => {
  globals.forEach(({ key, descriptor }) => {
    if (descriptor) Object.defineProperty(globalThis, key, descriptor);
    else delete (globalThis as Record<string, unknown>)[key];
  });
  dom.window.close();
};

const root = (): SemanticDiffScheduleImpactRoot => ({
  id: "root-1",
  matchKind: "exact",
  canonicalPath: "/jobs/root.ajs",
  identityDecisionId: null,
  before: {
    side: "before",
    unitId: "before-root",
    unitPath: "/jobs/root.ajs",
    unitName: "root",
    outcome: "supported-runs",
    runs: [],
    issueIds: [],
  },
  after: {
    side: "after",
    unitId: "after-root",
    unitPath: "/jobs/root.ajs",
    unitName: "root",
    outcome: "valid-no-runs",
    runs: [],
    issueIds: [],
  },
  scopeTransition: null,
});

const sidecar = (): SemanticDiffScheduleImpact => ({
  period: { from: "2026-01-01", to: "2026-01-04" },
  roots: [root()],
  candidateGroups: [
    {
      id: "candidate-group-1",
      before: [
        {
          id: "candidate-before-1",
          unitId: "before-candidate",
          unitName: "before-job",
          unitPath: "/jobs/before-job",
        },
      ],
      after: [
        {
          id: "candidate-after-1",
          unitId: "after-candidate",
          unitName: "after-job",
          unitPath: "/jobs/after-job",
        },
      ],
    },
  ],
  issues: [
    {
      id: "issue-1",
      occurrenceOrdinal: 2,
      kind: "uncalculated",
      side: "after",
      rootId: "root-1",
      reasonCode: "runtime-state-not-verified",
      targetKind: "attribute",
      targetId: "target-1",
      targetPath: "/jobs/root.ajs/job",
      parameterKey: "schedule",
      detail: {
        unitPath: "/jobs/root.ajs/job",
        parameterKey: "schedule",
        relationPair: null,
        scheduleRule: 1,
        period: { from: "2026-01-01", to: "2026-01-04" },
        beforeValues: [],
        afterValues: ["09:30"],
        rawValues: ["09:30"],
        removedSources: [],
      },
    },
  ],
  timelineItems: [
    {
      id: "run-1",
      state: "changed-time",
      side: "pair",
      rootId: "root-1",
      date: "2026-01-02",
      time: "09:30",
      rule: 1,
      occurrenceOrdinal: 0,
      before: {
        id: "before-run-1",
        unitId: "before-unit-1",
        unitPath: "/jobs/before.ajs/job",
        unitName: "before-job",
        rule: 1,
        date: "2026-01-02",
        time: "09:00",
        side: "before",
        occurrenceOrdinal: 0,
        sourceChangeRef: { id: "change-1", occurrenceOrdinal: 0 },
      },
      after: {
        id: "after-run-1",
        unitId: "after-unit-1",
        unitPath: "/jobs/after.ajs/job",
        unitName: "after-job",
        rule: 1,
        date: "2026-01-02",
        time: "09:30",
        side: "after",
        occurrenceOrdinal: 0,
        sourceChangeRef: { id: "change-1", occurrenceOrdinal: 1 },
      },
      sourceChangeRef: { id: "change-1", occurrenceOrdinal: 1 },
    },
    {
      id: "run-2",
      state: "added",
      side: "after",
      rootId: "root-1",
      date: "2026-01-03",
      time: "10:00",
      rule: 2,
      occurrenceOrdinal: 1,
      before: null,
      after: null,
      sourceChangeRef: null,
    },
  ],
});

suite("Schedule impact calendar view", () => {
  let dom: JSDOM;
  let globals: GlobalValue[];

  setup(() => {
    ({ dom, globals } = installDom());
  });
  teardown(() => {
    cleanup();
    restoreDom(dom, globals);
  });

  test("exposes period, root outcome, separate filters, and timeline semantics", () => {
    const view = render(
      <ScheduleImpactCalendarView sidecar={sidecar()} language="ja-JP" />,
    );

    assert.ok(
      view.getByRole("heading", { name: "スケジュール影響カレンダー" }),
    );
    assert.ok(view.container.textContent?.includes("[2026-01-01〜2026-01-04)"));
    assert.ok(view.getByRole("combobox", { name: "ルートジョブネット" }));
    assert.ok(view.getByRole("combobox", { name: "ルート結果" }));
    assert.ok(view.getByRole("combobox", { name: "実行状態" }));
    assert.ok(view.getByRole("heading", { name: "2026-01-02" }));
    const changedItem = view.container.querySelector(
      "[data-schedule-impact-calendar-item-id='run-1']",
    );
    assert.ok(changedItem?.textContent?.includes("時刻変更"));
    assert.ok(
      view
        .getByRole("region", { name: "ルート結果" })
        .textContent?.includes("対応する実行"),
    );
    const rootComparison = view
      .getByRole("region", { name: "ルート結果" })
      .querySelector("[data-result-comparison]");
    assert.strictEqual(
      rootComparison?.getAttribute("aria-label"),
      "root-1: 変更前 / 変更後",
    );
    assert.deepStrictEqual(
      [...(rootComparison?.querySelectorAll("h3") ?? [])].map(
        (heading) => heading.textContent,
      ),
      ["変更前", "変更後"],
    );
    assert.deepStrictEqual(
      [
        ...(rootComparison?.querySelectorAll("[data-result-comparison-side]") ??
          []),
      ].map((side) => side.getAttribute("data-result-comparison-side")),
      ["before", "after"],
    );
    assert.ok(view.getByRole("heading", { name: "有効な実行なし" }));
    assert.ok(view.getByTestId("schedule-impact-calendar-legend"));
    const issueRegion = view.getByRole("region", {
      name: "未計算のスケジュール範囲",
    });
    assert.ok(issueRegion.textContent?.includes("issue-1"));
    assert.ok(issueRegion.textContent?.includes("attribute"));
    assert.ok(issueRegion.textContent?.includes("構造化詳細"));
    const issueLabels = [...issueRegion.querySelectorAll("dt")].map(
      (element) => element.textContent,
    );
    assert.ok(issueLabels.includes("ID"));
    assert.ok(issueLabels.includes("出現順"));
    assert.ok(issueLabels.includes("種別"));
    assert.ok(issueLabels.includes("対象種別"));
    assert.ok(issueLabels.includes("対象ID"));
    assert.ok(issueLabels.includes("パラメーターキー"));
    const candidateRegion = view.getByRole("region", {
      name: "同一性候補",
    });
    assert.ok(candidateRegion.textContent?.includes("candidate-before-1"));
    assert.ok(candidateRegion.textContent?.includes("before-job"));
    assert.ok(changedItem?.textContent?.includes("change-1"));
    const timelineLabels = [...(changedItem?.querySelectorAll("dt") ?? [])].map(
      (element) => element.textContent,
    );
    assert.ok(timelineLabels.includes("ルール"));
    assert.ok(timelineLabels.includes("出現順"));
    assert.ok(timelineLabels.includes("ソース変更参照"));
    const legend = view.getByTestId("schedule-impact-calendar-legend");
    assert.strictEqual(
      legend.querySelectorAll("[data-legend-pattern]").length,
      8,
    );
    assert.deepStrictEqual(
      [...legend.querySelectorAll("[data-legend-pattern]")].map((item) =>
        item.getAttribute("data-legend-pattern"),
      ),
      [
        "solid",
        "dashed",
        "dotted",
        "double",
        "solid",
        "dashed",
        "dotted",
        "double",
      ],
    );

    const firstItem = view
      .getByTestId("schedule-impact-calendar")
      .querySelector(
        "[data-schedule-impact-calendar-item-id='run-1']",
      ) as HTMLElement;
    assert.strictEqual(firstItem.tabIndex, 0);
    fireEvent.keyDown(firstItem, { key: "ArrowDown" });
    assert.strictEqual(
      dom.window.document.activeElement?.id,
      "schedule-impact-calendar-item-run-2",
    );
    const lastItem = view.container.querySelector(
      "[data-schedule-impact-calendar-item-id='run-2']",
    ) as HTMLElement;
    fireEvent.keyDown(lastItem, { key: "Home" });
    assert.strictEqual(dom.window.document.activeElement?.id, firstItem.id);
    fireEvent.keyDown(firstItem, { key: "Enter" });
    assert.ok(view.container.textContent?.includes("run-1"));

    const outcome = view.getByRole("combobox", { name: "ルート結果" });
    fireEvent.change(outcome, { target: { value: "uncalculated" } });
    assert.match(
      view.getAllByRole("status")[0]?.textContent ?? "",
      /2 件中 0 件/,
    );
    const rootStatus = view.getByRole("region", { name: "ルート結果" });
    assert.strictEqual(rootStatus.getAttribute("data-global-count"), "1");
    assert.strictEqual(rootStatus.getAttribute("data-visible-count"), "0");
    const noRuns = view.getByRole("region", { name: "有効な実行なし" });
    assert.strictEqual(noRuns.getAttribute("data-global-count"), "1");
    assert.strictEqual(noRuns.getAttribute("data-visible-count"), "0");
    const issues = view.getByRole("region", {
      name: "未計算のスケジュール範囲",
    });
    assert.strictEqual(issues.getAttribute("data-global-count"), "1");
    assert.strictEqual(issues.getAttribute("data-visible-count"), "0");
  });

  test("keeps every repeated section bounded and keyboard-reachable", async () => {
    const itemCount = 10_000;
    const large: SemanticDiffScheduleImpact = {
      ...sidecar(),
      candidateGroups: Array.from({ length: itemCount }, (_, index) => ({
        id: `candidate-group-${index}`,
        before: [],
        after: [],
      })),
      issues: Array.from({ length: itemCount }, (_, index) => ({
        id: `issue-${index}`,
        occurrenceOrdinal: index,
        kind: "uncalculated" as const,
        side: "after" as const,
        rootId: "root-1",
        reasonCode: "runtime-state-not-verified",
        targetKind: "attribute",
        targetId: `target-${index}`,
        targetPath: `/jobs/job-${index}`,
        parameterKey: "schedule",
        detail: {
          unitPath: `/jobs/job-${index}`,
          parameterKey: "schedule",
          relationPair: null,
          scheduleRule: 1,
          period: { from: "2026-01-01", to: "2026-01-04" },
          beforeValues: [],
          afterValues: [],
          rawValues: [],
          removedSources: [],
        },
      })),
      timelineItems: Array.from({ length: itemCount }, (_, index) => ({
        id: `run-${index}`,
        state: "changed-time" as const,
        side: "pair" as const,
        rootId: "root-1",
        date: `2026-01-${String(2 + Math.floor(index / (24 * 60))).padStart(2, "0")}`,
        time: `${String(Math.floor(index / 60) % 24).padStart(2, "0")}:${String(index % 60).padStart(2, "0")}`,
        rule: 1,
        occurrenceOrdinal: index,
        before: null,
        after: null,
        sourceChangeRef: null,
      })),
    };
    const view = render(
      <VirtuosoMockContext.Provider
        value={{ itemHeight: 48, viewportHeight: 480 }}
      >
        <ScheduleImpactCalendarView sidecar={large} language="en" />
      </VirtuosoMockContext.Provider>,
    );
    const renderedEntries = view.container.querySelectorAll(
      "[data-schedule-impact-calendar-item-id], [data-schedule-impact-calendar-candidate-group-id], [data-schedule-impact-calendar-issue-id], [data-schedule-impact-calendar-root-id], [data-schedule-impact-calendar-no-runs-root-id]",
    );
    assert.ok(renderedEntries.length < 300);
    assert.strictEqual(
      view
        .getByRole("region", { name: "Uncalculated schedule portions" })
        .getAttribute("data-global-count"),
      String(itemCount),
    );
    assert.ok(view.getByTestId("schedule-impact-calendar-legend"));
    assert.ok(view.container.textContent?.includes("candidate-group-0"));

    const expectedLastTimelineId =
      buildScheduleImpactCalendarModel(large).visibleItems.at(-1)?.item.id;
    assert.ok(expectedLastTimelineId);

    const firstTimeline = view.container.querySelector(
      "[data-schedule-impact-calendar-item-id='run-0']",
    ) as HTMLElement;
    assert.ok(firstTimeline);
    firstTimeline.focus();
    assert.strictEqual(dom.window.document.activeElement, firstTimeline);
    fireEvent.keyDown(firstTimeline, { key: "End" });
    await waitFor(() =>
      assert.strictEqual(
        view.container.querySelector(
          `[data-schedule-impact-calendar-item-id='${expectedLastTimelineId}']`,
        ) &&
          dom.window.document.activeElement?.getAttribute(
            "data-schedule-impact-calendar-item-id",
          ),
        expectedLastTimelineId,
      ),
    );

    const firstCandidate = view.container.querySelector(
      "[data-schedule-impact-calendar-candidate-group-id='candidate-group-0']",
    ) as HTMLElement;
    assert.ok(firstCandidate);
    firstCandidate.focus();
    assert.strictEqual(dom.window.document.activeElement, firstCandidate);
    fireEvent.keyDown(firstCandidate, { key: "End" });
    await waitFor(() =>
      assert.strictEqual(
        dom.window.document.activeElement?.getAttribute(
          "data-schedule-impact-calendar-candidate-group-id",
        ),
        `candidate-group-${itemCount - 1}`,
      ),
    );

    const firstIssue = view.container.querySelector(
      "[data-schedule-impact-calendar-issue-id='issue-0']",
    ) as HTMLElement;
    assert.ok(firstIssue);
    firstIssue.focus();
    assert.strictEqual(dom.window.document.activeElement, firstIssue);
    fireEvent.keyDown(firstIssue, { key: "End" });
    await waitFor(() =>
      assert.strictEqual(
        dom.window.document.activeElement?.getAttribute(
          "data-schedule-impact-calendar-issue-id",
        ),
        `issue-${itemCount - 1}`,
      ),
    );
  }).timeout(5000);

  test("exposes paired, one-sided, and root-scope identity facts", () => {
    const oneSided: SemanticDiffScheduleImpactRoot = {
      id: "one-sided-root",
      matchKind: "removed",
      canonicalPath: "/jobs/removed.ajs",
      identityDecisionId: null,
      before: {
        side: "before",
        unitId: "removed-before",
        unitPath: "/jobs/removed.ajs",
        unitName: "removed",
        outcome: "valid-no-runs",
        runs: [],
        issueIds: [],
      },
      after: null,
      scopeTransition: null,
    };
    const scoped: SemanticDiffScheduleImpactRoot = {
      id: "scope-root",
      matchKind: "added-root-scope",
      canonicalPath: "/jobs/scoped.ajs",
      identityDecisionId: "decision-1",
      before: null,
      after: {
        side: "after",
        unitId: "scoped-after",
        unitPath: "/jobs/scoped.ajs",
        unitName: "scoped",
        outcome: "valid-no-runs",
        runs: [],
        issueIds: [],
      },
      scopeTransition: {
        kind: "added-root-scope",
        counterpartPath: "/jobs/old-scoped.ajs",
        identityDecisionId: "decision-1",
      },
    };
    const view = render(
      <ScheduleImpactCalendarView
        sidecar={{ ...sidecar(), roots: [root(), oneSided, scoped] }}
        language="en"
      />,
    );
    const rootRegion = view.getByRole("region", { name: "Root outcomes" });
    const rootText = rootRegion.textContent ?? "";
    assert.match(rootText, /root-1/);
    assert.match(rootText, /before/);
    assert.match(rootText, /after/);
    assert.match(rootText, /one-sided-root/);
    assert.match(rootText, /Side absent/);
    assert.match(rootText, /Added root scope/);
    assert.match(rootText, /decision-1/);
    assert.match(rootText, /\/jobs\/old-scoped\.ajs/);
  });
});
