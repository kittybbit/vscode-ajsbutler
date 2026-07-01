import * as assert from "assert";
import {
  focusHeaderSearchFromShortcut,
  formatHeaderSearchPlaceholder,
  isHeaderSearchShortcut,
  resolveHeaderSearchHelperText,
} from "../../presentation/webview/editor/shared/HeaderSearchField";

suite("Header Search Field", () => {
  test("uses the platform shortcut without intercepting other keys", () => {
    assert.strictEqual(
      isHeaderSearchShortcut(
        { ctrlKey: true, metaKey: false, key: "f" },
        false,
      ),
      true,
    );
    assert.strictEqual(
      isHeaderSearchShortcut({ ctrlKey: false, metaKey: true, key: "f" }, true),
      true,
    );
    assert.strictEqual(
      isHeaderSearchShortcut({ ctrlKey: true, metaKey: false, key: "f" }, true),
      false,
    );
    assert.strictEqual(
      isHeaderSearchShortcut(
        { ctrlKey: true, metaKey: false, key: "g" },
        false,
      ),
      false,
    );
  });

  test("formats the platform shortcut in the placeholder", () => {
    assert.strictEqual(
      formatHeaderSearchPlaceholder("Search", false),
      "Search...(CTRL+F)",
    );
    assert.strictEqual(
      formatHeaderSearchPlaceholder("Search current scope", true),
      "Search current scope...(\u2318F)",
    );
  });

  test("prevents browser find and focuses the search input", () => {
    let prevented = false;
    let focused = false;
    const handled = focusHeaderSearchFromShortcut(
      {
        ctrlKey: true,
        metaKey: false,
        key: "f",
        preventDefault: () => {
          prevented = true;
        },
      } as globalThis.KeyboardEvent,
      false,
      {
        current: {
          focus: () => {
            focused = true;
          },
        } as HTMLInputElement,
      },
    );

    assert.strictEqual(handled, true);
    assert.strictEqual(prevented, true);
    assert.strictEqual(focused, true);
  });

  test("resolves helper text from shared search state", () => {
    const labels = {
      noResults: "No results.",
      matched: "Matched target.",
      idle: "Search targets.",
    };

    assert.strictEqual(
      resolveHeaderSearchHelperText(undefined, undefined, labels),
      "Search targets.",
    );
    assert.strictEqual(
      resolveHeaderSearchHelperText(
        undefined,
        { current: 0, total: 0 },
        labels,
      ),
      "No results.",
    );
    assert.strictEqual(
      resolveHeaderSearchHelperText("target", { current: 1, total: 3 }, labels),
      "Matched target.",
    );
  });
});
