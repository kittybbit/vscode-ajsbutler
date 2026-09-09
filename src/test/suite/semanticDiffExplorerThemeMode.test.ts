import * as assert from "assert";
import { JSDOM } from "jsdom";
import {
  observeSemanticDiffExplorerThemeMode,
  resolveSemanticDiffExplorerThemeMode,
} from "../../presentation/webview/semantic-diff/semanticDiffExplorerThemeMode";

type MediaListener = () => void;

const createMediaQuery = (matches: boolean) => {
  const listeners = new Set<MediaListener>();
  return {
    get matches() {
      return matches;
    },
    set matches(value: boolean) {
      matches = value;
    },
    addEventListener: (_type: string, listener: MediaListener) => {
      listeners.add(listener);
    },
    removeEventListener: (_type: string, listener: MediaListener) => {
      listeners.delete(listener);
    },
    dispatch: () => listeners.forEach((listener) => listener()),
  };
};

suite("Semantic Diff Explorer theme mode", () => {
  test("prefers host theme signals and falls back to media preference", () => {
    const dom = new JSDOM("<!doctype html><html><body></body></html>");
    const media = createMediaQuery(true);
    const environment = {
      document: dom.window.document,
      matchMedia: () => media as unknown as MediaQueryList,
    };

    assert.strictEqual(
      resolveSemanticDiffExplorerThemeMode(environment),
      "dark",
    );
    dom.window.document.body.className = "vscode-light";
    assert.strictEqual(
      resolveSemanticDiffExplorerThemeMode(environment),
      "light",
    );
    dom.window.document.body.className = "";
    dom.window.document.documentElement.dataset.theme = "light";
    assert.strictEqual(
      resolveSemanticDiffExplorerThemeMode(environment),
      "light",
    );
    delete dom.window.document.documentElement.dataset.theme;
    assert.strictEqual(
      resolveSemanticDiffExplorerThemeMode(environment),
      "dark",
    );
    dom.window.close();
  });

  test("observes host class and media changes and cleans up", async () => {
    const dom = new JSDOM("<!doctype html><html><body></body></html>");
    const media = createMediaQuery(false);
    const modes: string[] = [];
    const stop = observeSemanticDiffExplorerThemeMode(
      (mode) => modes.push(mode),
      {
        document: dom.window.document,
        matchMedia: () => media as unknown as MediaQueryList,
        mutationObserver: dom.window
          .MutationObserver as unknown as typeof MutationObserver,
      },
    );
    assert.deepStrictEqual(modes, ["light"]);

    dom.window.document.body.className = "vscode-dark";
    await new Promise<void>((resolve) => dom.window.setTimeout(resolve, 0));
    assert.strictEqual(modes.at(-1), "dark");

    media.matches = true;
    media.dispatch();
    assert.strictEqual(modes.at(-1), "dark");
    stop();
    dom.window.document.body.className = "vscode-light";
    await new Promise<void>((resolve) => dom.window.setTimeout(resolve, 0));
    assert.strictEqual(modes.at(-1), "dark");
    dom.window.close();
  });
});
