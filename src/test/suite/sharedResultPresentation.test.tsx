import * as assert from "assert";
import { JSDOM } from "jsdom";
import React from "react";
import { cleanup, render } from "@testing-library/react";
import ResultCard from "../../presentation/webview/editor/shared/result/ResultCard";
import ResultComparison from "../../presentation/webview/editor/shared/result/ResultComparison";
import ResultEmptyState from "../../presentation/webview/editor/shared/result/ResultEmptyState";
import ResultKeyValueList from "../../presentation/webview/editor/shared/result/ResultKeyValueList";
import ResultSection from "../../presentation/webview/editor/shared/result/ResultSection";
import ResultStatusChip from "../../presentation/webview/editor/shared/result/ResultStatusChip";
import { formatLocalizedDateRange } from "../../presentation/webview/editor/shared/result/formatLocalizedDateRange";

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

  test("formats localized ranges without changing endpoint order", () => {
    assert.strictEqual(
      formatLocalizedDateRange("2026-01-01", "2026-01-04", "en-US"),
      "2026-01-01 – 2026-01-04",
    );
    assert.strictEqual(
      formatLocalizedDateRange("2026-01-01", "2026-01-04", "ja-JP"),
      "2026-01-01〜2026-01-04",
    );
  });

  test("keeps comparison sides semantic, ordered, and responsive", () => {
    const view = render(
      <ResultComparison
        beforeLabel="Before"
        afterLabel="After"
        before="a-before-value-that-wraps"
        after={null}
        ariaLabel="Before / After"
        dataTestId="comparison"
      />,
    );
    const comparison = view.container.querySelector(
      '[data-result-comparison-label="Before / After"]',
    ) as HTMLElement;
    assert.ok(comparison);
    assert.strictEqual(comparison.getAttribute("aria-label"), "Before / After");
    assert.ok(
      [...document.querySelectorAll("style")].some((style) =>
        style.textContent?.includes("@media (min-width:900px)"),
      ),
    );
    const sides = [
      ...comparison.querySelectorAll("[data-result-comparison-side]"),
    ];
    assert.deepStrictEqual(
      sides.map((side) => side.getAttribute("data-result-comparison-side")),
      ["before", "after"],
    );
    assert.deepStrictEqual(
      [...comparison.querySelectorAll("h3")].map(
        (heading) => heading.textContent,
      ),
      ["Before", "After"],
    );
    assert.ok(sides[0]?.textContent?.includes("a-before-value-that-wraps"));
    assert.ok(sides[1]?.textContent?.includes("—"));
  });
});
