import * as assert from "assert";
import { JSDOM } from "jsdom";
import React from "react";
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { ScheduleImpactCalendarView } from "../../presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarApp";
import type { SemanticDiffScheduleImpact } from "../../application/semantic-diff/semanticDiffScheduleImpact";

type GlobalValue = {
  key: string;
  descriptor: PropertyDescriptor | undefined;
};

const installDom = (): { dom: JSDOM; globals: GlobalValue[] } => {
  const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "http://localhost/",
  });
  const globals: GlobalValue[] = [];
  const values: Record<string, unknown> = {
    window: dom.window,
    document: dom.window.document,
    navigator: dom.window.navigator,
    HTMLElement: dom.window.HTMLElement,
    DocumentFragment: dom.window.DocumentFragment,
    Node: dom.window.Node,
    Element: dom.window.Element,
    Event: dom.window.Event,
    KeyboardEvent: dom.window.KeyboardEvent,
    MouseEvent: dom.window.MouseEvent,
    MutationObserver: dom.window.MutationObserver,
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
  dom.window.requestAnimationFrame = values.requestAnimationFrame as (
    callback: FrameRequestCallback,
  ) => number;
  return { dom, globals };
};

const restoreDom = (dom: JSDOM, globals: GlobalValue[]): void => {
  globals.forEach(({ key, descriptor }) => {
    if (descriptor) Object.defineProperty(globalThis, key, descriptor);
    else delete (globalThis as Record<string, unknown>)[key];
  });
  dom.window.close();
};

const selectFilterOption = (
  dom: JSDOM,
  control: HTMLElement,
  value: string,
): void => {
  act(() => {
    fireEvent.keyDown(control, { key: "ArrowDown" });
  });
  const option = dom.window.document.body.querySelector(
    `[data-value="${value}"]`,
  );
  assert.ok(option);
  act(() => {
    fireEvent.click(option as HTMLElement);
  });
};

const componentSidecar = (): SemanticDiffScheduleImpact => ({
  period: { from: "2026-01-01", to: "2026-01-03" },
  roots: [
    {
      id: "root-a",
      matchKind: "exact",
      canonicalPath: "/jobs/a.ajs",
      identityDecisionId: null,
      before: {
        side: "before",
        unitId: "before-a",
        unitPath: "/jobs/a.ajs",
        unitName: "a",
        outcome: "supported-runs",
        runs: [],
        issueIds: [],
      },
      after: {
        side: "after",
        unitId: "after-a",
        unitPath: "/jobs/a.ajs",
        unitName: "a",
        outcome: "supported-runs",
        runs: [],
        issueIds: [],
      },
      scopeTransition: null,
    },
    {
      id: "root-b",
      matchKind: "exact",
      canonicalPath: "/jobs/b.ajs",
      identityDecisionId: null,
      before: {
        side: "before",
        unitId: "before-b",
        unitPath: "/jobs/b.ajs",
        unitName: "b",
        outcome: "valid-no-runs",
        runs: [],
        issueIds: [],
      },
      after: {
        side: "after",
        unitId: "after-b",
        unitPath: "/jobs/b.ajs",
        unitName: "b",
        outcome: "valid-no-runs",
        runs: [],
        issueIds: [],
      },
      scopeTransition: null,
    },
  ],
  candidateGroups: [
    {
      id: "candidate-group-a",
      before: [
        {
          id: "candidate-a",
          unitId: "candidate-before-a",
          unitName: "candidate-a",
          unitPath: "/jobs/candidate-a.ajs",
        },
      ],
      after: [],
    },
  ],
  issues: [
    {
      id: "issue-a",
      occurrenceOrdinal: 0,
      kind: "uncalculated",
      side: "after",
      rootId: "root-a",
      reasonCode: "not-verified",
      targetKind: "attribute",
      targetId: "target-a",
      targetPath: "/jobs/a.ajs/job",
      parameterKey: "schedule",
      detail: {
        unitPath: "/jobs/a.ajs/job",
        parameterKey: "schedule",
        relationPair: null,
        scheduleRule: 1,
        period: { from: "2026-01-01", to: "2026-01-03" },
        beforeValues: [],
        afterValues: [],
        rawValues: [],
        removedSources: [],
      },
    },
  ],
  timelineItems: [
    {
      id: "run-a",
      state: "changed-time",
      side: "pair",
      rootId: "root-a",
      date: "2026-01-01",
      time: "09:00",
      rule: 1,
      occurrenceOrdinal: 0,
      before: null,
      after: null,
      sourceChangeRef: null,
    },
    {
      id: "run-b",
      state: "added",
      side: "after",
      rootId: "root-b",
      date: "2026-01-02",
      time: "10:00",
      rule: 1,
      occurrenceOrdinal: 0,
      before: null,
      after: null,
      sourceChangeRef: null,
    },
  ],
});

suite("Schedule impact calendar components", () => {
  let dom: JSDOM;
  let globals: GlobalValue[];

  setup(() => {
    ({ dom, globals } = installDom());
  });
  teardown(async () => {
    cleanup();
    await new Promise<void>((resolve) => setImmediate(resolve));
    restoreDom(dom, globals);
  });

  test("composes the MUI shell and preserves controls and sections", () => {
    const view = render(
      <ScheduleImpactCalendarView sidecar={componentSidecar()} language="en" />,
    );
    assert.ok(view.getByTestId("schedule-impact-calendar"));
    assert.ok(view.getByRole("banner").querySelector("h1"));
    assert.ok(view.getByRole("heading", { name: "Schedule Impact Calendar" }));
    assert.ok(view.getByTestId("schedule-impact-calendar-result-count"));
    assert.ok(view.getByRole("combobox", { name: "Root jobnet" }));
    assert.ok(view.getByRole("combobox", { name: "Root outcome" }));
    assert.ok(view.getByRole("combobox", { name: "Run state" }));
    assert.ok(view.getByRole("region", { name: "Root outcomes" }));
    assert.ok(view.getByRole("region", { name: "Valid no-runs" }));
    assert.ok(view.getByRole("region", { name: "Identity candidates" }));
    assert.ok(
      view.getByRole("region", { name: "Uncalculated schedule portions" }),
    );
    const orderedRegions = [
      view.getByRole("region", { name: "Root outcomes" }),
      view.getByRole("region", { name: "Valid no-runs" }),
      view.getByRole("region", { name: "Identity candidates" }),
      view.getByRole("region", { name: "Uncalculated schedule portions" }),
      view.getByRole("region", { name: "Calendar legend" }),
      view.getByRole("region", { name: "Schedule impact timeline" }),
    ];
    orderedRegions.slice(0, -1).forEach((region, index) => {
      assert.notStrictEqual(
        region.compareDocumentPosition(orderedRegions[index + 1]!) &
          dom.window.Node.DOCUMENT_POSITION_FOLLOWING,
        0,
      );
    });
    const keyValueRows = [
      ...view.container.querySelectorAll("[data-result-key-value-row]"),
    ];
    assert.ok(keyValueRows.length > 0);
    keyValueRows.forEach((row) => {
      assert.strictEqual(row.querySelectorAll("dt").length, 1);
      assert.strictEqual(row.querySelectorAll("dd").length, 1);
    });
    assert.ok(view.getByTestId("schedule-impact-calendar-legend"));
    assert.ok(view.getByRole("region", { name: "Schedule impact timeline" }));
    const timelineItem = view.container.querySelector(
      "[data-schedule-impact-calendar-item-id='run-a']",
    );
    assert.ok(timelineItem);
    assert.doesNotMatch(
      timelineItem?.getAttribute("aria-label") ?? "",
      /run-a/,
    );
    const candidateGroup = view.container.querySelector(
      "[data-schedule-impact-calendar-candidate-group-id='candidate-group-a']",
    );
    assert.ok(candidateGroup);
    assert.doesNotMatch(
      candidateGroup?.getAttribute("aria-label") ?? "",
      /candidate-group-a/,
    );
    const issue = view.container.querySelector(
      "[data-schedule-impact-calendar-issue-id='issue-a']",
    );
    assert.ok(issue);
    assert.doesNotMatch(issue?.getAttribute("aria-label") ?? "", /issue-a/);
    assert.doesNotMatch(
      view.container.querySelector(
        "[data-schedule-impact-calendar-candidate-group-id='candidate-group-a']",
      )?.textContent ?? "",
      /candidate-group-a/,
    );
    assert.doesNotMatch(
      view.container.querySelector(
        "[data-schedule-impact-calendar-issue-id='issue-a']",
      )?.textContent ?? "",
      /issue-a/,
    );

    const rootStatus = view.getByRole("region", { name: "Root outcomes" });
    const noRuns = view.getByRole("region", { name: "Valid no-runs" });
    const issues = view.getByRole("region", {
      name: "Uncalculated schedule portions",
    });
    const assertCounts = (
      section: HTMLElement,
      globalCount: string,
      visibleCount: string,
    ): void => {
      assert.strictEqual(
        section.getAttribute("data-global-count"),
        globalCount,
      );
      assert.strictEqual(
        section.getAttribute("data-visible-count"),
        visibleCount,
      );
    };
    assertCounts(rootStatus, "2", "2");
    assertCounts(noRuns, "1", "1");
    assertCounts(issues, "1", "1");
    assert.ok(view.getByRole("list", { name: "Root outcomes" }));
    assert.ok(view.getByRole("list", { name: "Valid no-runs" }));
    assert.ok(
      view.getByRole("list", { name: "Uncalculated schedule portions" }),
    );

    const rootFilter = view.getByRole("combobox", { name: "Root jobnet" });
    selectFilterOption(dom, rootFilter, "root-a");
    assertCounts(rootStatus, "2", "1");
    assertCounts(noRuns, "1", "0");
    assertCounts(issues, "1", "1");
    assert.strictEqual(
      view.getByRole("alert").querySelector(".MuiAlert-message")?.textContent,
      "No roots have a valid no-run outcome.",
    );
    assert.strictEqual(
      view.queryByRole("list", { name: "Valid no-runs" }),
      null,
    );
    assert.ok(
      view.getByRole("list", { name: "Uncalculated schedule portions" }),
    );

    selectFilterOption(dom, rootFilter, "root-b");
    assertCounts(rootStatus, "2", "1");
    assertCounts(noRuns, "1", "1");
    assertCounts(issues, "1", "0");
    assert.strictEqual(
      view.getByRole("alert").querySelector(".MuiAlert-message")?.textContent,
      "No uncalculated schedule portions.",
    );
    assert.ok(view.getByRole("list", { name: "Valid no-runs" }));
    assert.strictEqual(
      view.queryByRole("list", {
        name: "Uncalculated schedule portions",
      }),
      null,
    );

    selectFilterOption(dom, rootFilter, "root-a");
    assertCounts(noRuns, "1", "0");
    assertCounts(issues, "1", "1");
    assert.strictEqual(
      view.getByRole("alert").querySelector(".MuiAlert-message")?.textContent,
      "No roots have a valid no-run outcome.",
    );
    assert.ok(
      view.getByRole("list", { name: "Uncalculated schedule portions" }),
    );
    assert.strictEqual(
      view
        .getByRole("region", { name: "Schedule impact timeline" })
        .querySelectorAll("[data-schedule-impact-calendar-item-id]").length,
      1,
    );
  });
});
