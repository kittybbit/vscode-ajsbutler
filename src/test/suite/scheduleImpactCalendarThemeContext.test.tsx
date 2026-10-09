import * as assert from "assert";
import React from "react";
import { act, cleanup, render } from "@testing-library/react";
import ScheduleImpactCalendarApp from "../../presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarApp";
import { createViewerEventBridge } from "../../presentation/webview/editor/viewerEventBridge";
import { createViewerResourceStateMessage } from "../../presentation/webview/viewerHostMessages";
import type { SemanticDiffScheduleImpact } from "../../application/semantic-diff/semanticDiffScheduleImpact";

const emptySidecar = (): SemanticDiffScheduleImpact => ({
  period: { from: "2026-01-01", to: "2026-01-02" },
  roots: [],
  candidateGroups: [],
  issues: [],
  timelineItems: [],
});

suite("Schedule impact calendar shared theme context", () => {
  let bridge: ReturnType<typeof createViewerEventBridge>;
  let previousWindowProperties: Map<string, PropertyDescriptor | undefined>;
  const testWindow = window as Window & {
    EventBridge?: ReturnType<typeof createViewerEventBridge>;
    vscode?: { postMessage: (value: unknown) => void };
  };

  setup(() => {
    previousWindowProperties = new Map(
      ["EventBridge", "vscode"].map((key) => [
        key,
        Object.getOwnPropertyDescriptor(window, key),
      ]),
    );
    document.body.replaceChildren();
    bridge = createViewerEventBridge();
    testWindow.EventBridge = bridge;
  });
  teardown(() => {
    cleanup();
    for (const [key, descriptor] of previousWindowProperties) {
      if (descriptor === undefined) {
        Reflect.deleteProperty(window, key);
      } else {
        Reflect.defineProperty(window, key, descriptor);
      }
    }
    document.body.replaceChildren();
  });

  test("gates Calendar rendering on the window resource and applies locale/theme", () => {
    const messages: unknown[] = [];
    testWindow.vscode = {
      postMessage: (value: unknown) => messages.push(value),
    };
    const view = render(<ScheduleImpactCalendarApp sidecar={emptySidecar()} />);

    assert.deepStrictEqual(messages, [
      { type: "resource", data: { scrollType: "window" } },
    ]);
    assert.strictEqual(view.queryByTestId("schedule-impact-calendar"), null);

    act(() => {
      bridge.dispatch({
        data: createViewerResourceStateMessage({
          isDarkMode: false,
          lang: "ja-JP",
          scrollType: "window",
        }),
      } as MessageEvent);
    });
    assert.ok(
      view.getByRole("heading", { name: "スケジュール影響カレンダー" }),
    );
    assert.strictEqual(
      getComputedStyle(document.body).backgroundColor,
      "rgb(255, 255, 255)",
    );

    act(() => {
      bridge.dispatch({
        data: createViewerResourceStateMessage({
          isDarkMode: true,
          lang: "fr-FR",
          scrollType: "window",
        }),
      } as MessageEvent);
    });
    assert.ok(view.getByRole("heading", { name: "Schedule Impact Calendar" }));
    assert.strictEqual(
      getComputedStyle(document.body).backgroundColor,
      "rgb(18, 18, 18)",
    );
  });
});
