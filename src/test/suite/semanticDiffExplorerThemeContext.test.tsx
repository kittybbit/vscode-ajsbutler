import * as assert from "assert";
import { JSDOM } from "jsdom";
import React from "react";
import { act, cleanup, render } from "@testing-library/react";
import {
  MyAppContextProvider,
  useMyAppContext,
} from "../../presentation/webview/editor/MyContexts";
import { createViewerEventBridge } from "../../presentation/webview/editor/viewerEventBridge";
import { createViewerResourceStateMessage } from "../../presentation/webview/viewerHostMessages";

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
  return { dom, globals };
};

const restoreDom = (dom: JSDOM, globals: GlobalValue[]): void => {
  globals.forEach(({ key, descriptor }) => {
    if (descriptor) Object.defineProperty(globalThis, key, descriptor);
    else delete (globalThis as Record<string, unknown>)[key];
  });
  dom.window.close();
};

const ResourceProbe = (): React.ReactElement => {
  const { isDarkMode, lang, scrollType } = useMyAppContext();
  return (
    <output data-testid="resource">
      {`${isDarkMode ? "dark" : "light"}:${lang}:${scrollType}`}
    </output>
  );
};

suite("Shared viewer resource context", () => {
  let dom: JSDOM;
  let globals: GlobalValue[];

  setup(() => {
    ({ dom, globals } = installDom());
  });
  teardown(() => {
    cleanup();
    restoreDom(dom, globals);
  });

  test("keeps the table request as the provider default", () => {
    const bridge = createViewerEventBridge();
    const messages: unknown[] = [];
    dom.window.EventBridge = bridge;
    dom.window.vscode = {
      postMessage: (value: unknown) => messages.push(value),
    };

    render(
      <MyAppContextProvider>
        <ResourceProbe />
      </MyAppContextProvider>,
    );

    assert.deepStrictEqual(messages, [
      { type: "resource", data: { scrollType: "table" } },
    ]);
  });

  test("requests a window resource and updates theme and locale from it", () => {
    const bridge = createViewerEventBridge();
    const messages: unknown[] = [];
    dom.window.EventBridge = bridge;
    dom.window.vscode = {
      postMessage: (value: unknown) => messages.push(value),
    };
    const view = render(
      <MyAppContextProvider scrollType="window">
        <ResourceProbe />
      </MyAppContextProvider>,
    );

    assert.deepStrictEqual(messages, [
      { type: "resource", data: { scrollType: "window" } },
    ]);
    assert.strictEqual(view.queryByTestId("resource"), null);

    act(() => {
      bridge.dispatch({
        data: createViewerResourceStateMessage({
          isDarkMode: false,
          lang: "en",
          scrollType: "window",
        }),
      } as MessageEvent);
    });
    assert.strictEqual(
      view.getByTestId("resource").textContent,
      "light:en:window",
    );

    act(() => {
      bridge.dispatch({
        data: createViewerResourceStateMessage({
          isDarkMode: true,
          lang: "ja-JP",
          scrollType: "window",
        }),
      } as MessageEvent);
    });
    assert.strictEqual(
      view.getByTestId("resource").textContent,
      "dark:ja-JP:window",
    );
  });
});
