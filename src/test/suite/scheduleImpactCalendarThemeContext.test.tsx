import * as assert from "assert";
import { JSDOM } from "jsdom";
import React from "react";
import { act, cleanup, render } from "@testing-library/react";
import ScheduleImpactCalendarApp from "../../presentation/webview/editor/scheduleImpactCalendar/ScheduleImpactCalendarApp";
import { createViewerEventBridge } from "../../presentation/webview/editor/viewerEventBridge";
import { createViewerResourceStateMessage } from "../../presentation/webview/viewerHostMessages";
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
  const resizeObserver = class {
    disconnect(): void {}
    observe(): void {}
    unobserve(): void {}
  };
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
  return { dom, globals };
};

const restoreDom = (dom: JSDOM, globals: GlobalValue[]): void => {
  globals.forEach(({ key, descriptor }) => {
    if (descriptor) Object.defineProperty(globalThis, key, descriptor);
    else delete (globalThis as Record<string, unknown>)[key];
  });
  dom.window.close();
};

const emptySidecar = (): SemanticDiffScheduleImpact => ({
  period: { from: "2026-01-01", to: "2026-01-02" },
  roots: [],
  candidateGroups: [],
  issues: [],
  timelineItems: [],
});

suite("Schedule impact calendar shared theme context", () => {
  let dom: JSDOM;
  let globals: GlobalValue[];

  setup(() => {
    ({ dom, globals } = installDom());
  });
  teardown(() => {
    cleanup();
    restoreDom(dom, globals);
  });

  test("gates Calendar rendering on the window resource and applies locale/theme", () => {
    const bridge = createViewerEventBridge();
    const messages: unknown[] = [];
    dom.window.EventBridge = bridge;
    dom.window.vscode = {
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
    assert.match(
      [...dom.window.document.querySelectorAll("style")]
        .map((style) => style.textContent ?? "")
        .join("\n"),
      /background-color:#fff/,
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
    assert.match(
      [...dom.window.document.querySelectorAll("style")]
        .map((style) => style.textContent ?? "")
        .join("\n"),
      /background-color:#121212/,
    );
  });
});
