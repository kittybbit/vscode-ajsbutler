import * as assert from "assert";
import { JSDOM } from "jsdom";
import React from "react";
import { cleanup, fireEvent, render } from "@testing-library/react";
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
  teardown(() => {
    cleanup();
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
    assert.ok(
      view.container
        .querySelector("[data-schedule-impact-calendar-item-id='run-a']")
        ?.textContent?.includes("run-a"),
    );
    assert.ok(
      view.container
        .querySelector(
          "[data-schedule-impact-calendar-candidate-group-id='candidate-group-a']",
        )
        ?.textContent?.includes("candidate-group-a"),
    );
    assert.ok(
      view.container
        .querySelector("[data-schedule-impact-calendar-issue-id='issue-a']")
        ?.textContent?.includes("issue-a"),
    );

    const outcome = view.getByRole("combobox", { name: "Root outcome" });
    fireEvent.change(outcome, { target: { value: "valid-no-runs" } });
    assert.strictEqual(
      view
        .getByRole("region", { name: "Root outcomes" })
        .getAttribute("data-visible-count"),
      "1",
    );
    assert.strictEqual(
      view
        .getByRole("region", { name: "Schedule impact timeline" })
        .querySelectorAll("[data-schedule-impact-calendar-item-id]").length,
      1,
    );
  });
});
