import * as assert from "assert";
import { JSDOM } from "jsdom";
import React from "react";
import { cleanup, render } from "@testing-library/react";
import ResultCard from "../../presentation/webview/editor/shared/result/ResultCard";
import ResultEmptyState from "../../presentation/webview/editor/shared/result/ResultEmptyState";
import ResultKeyValueList from "../../presentation/webview/editor/shared/result/ResultKeyValueList";
import ResultSection from "../../presentation/webview/editor/shared/result/ResultSection";
import ResultStatusChip from "../../presentation/webview/editor/shared/result/ResultStatusChip";

suite("Shared result presentation", () => {
  let dom: JSDOM;
  let previousDocument: PropertyDescriptor | undefined;
  let previousWindow: PropertyDescriptor | undefined;

  setup(() => {
    dom = new JSDOM("<!doctype html><html><body></body></html>", {
      url: "http://localhost/",
    });
    previousDocument = Object.getOwnPropertyDescriptor(globalThis, "document");
    previousWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
    Object.defineProperty(globalThis, "document", {
      configurable: true,
      value: dom.window.document,
    });
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: dom.window,
    });
  });

  teardown(() => {
    cleanup();
    if (previousDocument)
      Object.defineProperty(globalThis, "document", previousDocument);
    else delete (globalThis as Record<string, unknown>).document;
    if (previousWindow)
      Object.defineProperty(globalThis, "window", previousWindow);
    else delete (globalThis as Record<string, unknown>).window;
    dom.window.close();
  });

  test("keeps semantic sections, wrapping metadata, status tones, and empty states", () => {
    const view = render(
      <ResultSection
        title="Root outcomes"
        ariaLabel="Root outcomes"
        count="2/2"
        dataGlobalCount={2}
        dataVisibleCount={2}
      >
        <ResultCard title="root-a" ariaLabel="root-a">
          <ResultKeyValueList
            items={[
              {
                label: "Source unit path",
                value: "/jobs/with-a-very-long-name-that-must-wrap",
              },
              {
                label: "Outcome",
                value: (
                  <ResultStatusChip label="Supported runs" tone="success" />
                ),
              },
            ]}
          />
        </ResultCard>
        <ResultEmptyState>No matching roots.</ResultEmptyState>
      </ResultSection>,
    );

    assert.ok(view.getByRole("heading", { name: "Root outcomes" }));
    assert.ok(view.getByRole("article", { name: "root-a" }));
    assert.ok(view.getByText("Source unit path"));
    assert.ok(view.getByText(/jobs\/with-a-very-long/));
    assert.ok(view.getByText("No matching roots."));
    assert.match(
      view.container.querySelector('[data-result-tone="success"]')?.textContent,
      /Supported runs/,
    );
    assert.strictEqual(
      view.container
        .querySelector("[data-global-count]")
        ?.getAttribute("data-global-count"),
      "2",
    );
  });
});
