import * as assert from "assert";
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
  teardown(() => cleanup());

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

  test("keeps dense and normal key/value items in independent readable rows", () => {
    const view = render(
      <>
        <ResultKeyValueList
          ariaLabel="Normal details"
          items={[
            { label: "First label", value: "First value" },
            { label: "Second label", value: "Second value" },
          ]}
        />
        <ResultKeyValueList
          ariaLabel="Dense details"
          dense
          items={[
            { label: "Dense first", value: "Dense value" },
            { label: "Dense second", value: "Dense value" },
          ]}
        />
      </>,
    );
    const lists = [...view.container.querySelectorAll("dl")];
    assert.strictEqual(lists.length, 2);
    lists.forEach((list) => {
      const rows = [...list.querySelectorAll("[data-result-key-value-row]")];
      assert.strictEqual(rows.length, 2);
      rows.forEach((row) => {
        assert.strictEqual(row.querySelectorAll("dt").length, 1);
        assert.strictEqual(row.querySelectorAll("dd").length, 1);
      });
    });
    assert.deepStrictEqual(
      [...lists[0].querySelectorAll("dt, dd")].map(
        (element) => element.textContent,
      ),
      ["First label", "First value", "Second label", "Second value"],
    );
    const narrowRules = [...document.styleSheets]
      .flatMap((sheet) => [...sheet.cssRules])
      .filter(
        (rule) =>
          "conditionText" in rule &&
          (rule as CSSMediaRule).conditionText === "(max-width: 32rem)",
      ) as CSSMediaRule[];
    assert.ok(narrowRules.length > 0);
    for (const element of [
      ...lists,
      ...lists.flatMap((list) => [
        ...list.querySelectorAll("[data-result-key-value-row]"),
      ]),
    ]) {
      const className = [...element.classList].find((name) =>
        name.startsWith("css-"),
      );
      assert.ok(className);
      const rule = narrowRules
        .flatMap((mediaRule) => [...mediaRule.cssRules])
        .find(
          (candidate) =>
            "selectorText" in candidate &&
            (candidate as CSSStyleRule).selectorText === `.${className}`,
        ) as CSSStyleRule | undefined;
      assert.ok(rule);
      assert.strictEqual(rule.style.display, "block");
    }
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
    const sides = [
      ...comparison.querySelectorAll("[data-result-comparison-side]"),
    ];
    assert.deepStrictEqual(
      sides.map((side) => side.getAttribute("data-result-comparison-side")),
      ["before", "after"],
    );
    const comparisonClass = [...comparison.classList].find((name) =>
      name.startsWith("css-"),
    );
    assert.ok(comparisonClass);
    const wideRules = [...document.styleSheets]
      .flatMap((sheet) => [...sheet.cssRules])
      .filter(
        (rule) =>
          "conditionText" in rule &&
          (rule as CSSMediaRule).conditionText === "(min-width:900px)",
      ) as CSSMediaRule[];
    assert.ok(wideRules.length > 0);
    // JSDOM cannot compute CSS Grid tracks; inspect the rendered class rule.
    assert.ok(
      wideRules
        .flatMap((mediaRule) => [...mediaRule.cssRules])
        .some(
          (rule) =>
            "selectorText" in rule &&
            (rule as CSSStyleRule).selectorText === `.${comparisonClass}` &&
            (rule as CSSStyleRule).cssText.includes(
              "grid-template-columns: repeat(2, minmax(0, 1fr))",
            ),
        ),
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
