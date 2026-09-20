import * as assert from "assert";
import { JSDOM } from "jsdom";
import React, { createRef } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import ViewerFilterSelect from "../../presentation/webview/editor/shared/ViewerFilterSelect";
import { createViewerTheme } from "../../presentation/webview/shared/viewerTheme";

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
  dom.window.cancelAnimationFrame = values.cancelAnimationFrame as (
    handle: number,
  ) => void;
  return { dom, globals };
};

const restoreDom = (dom: JSDOM, globals: GlobalValue[]): void => {
  globals.forEach(({ key, descriptor }) => {
    if (descriptor) Object.defineProperty(globalThis, key, descriptor);
    else delete (globalThis as Record<string, unknown>)[key];
  });
  dom.window.close();
};

suite("Viewer filter select", () => {
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

  test("keeps the accessible trigger, anchored menu order, and long labels", () => {
    const triggerRef = createRef<HTMLDivElement>();
    const selected: string[] = [];
    const view = render(
      <ThemeProvider theme={createViewerTheme()}>
        <ViewerFilterSelect
          id="viewer-filter"
          label="Filter changes"
          value="all"
          triggerRef={triggerRef}
          options={[
            { value: "all", label: "All" },
            {
              value: "long",
              label:
                "A very long localized filter label that must wrap in a narrow menu",
            },
          ]}
          onChange={(value) => {
            selected.push(value);
            triggerRef.current?.focus();
          }}
        />
      </ThemeProvider>,
    );
    const trigger = view.getByRole("combobox", { name: "Filter changes" });
    assert.strictEqual(trigger.id, "viewer-filter");
    assert.strictEqual(trigger.getAttribute("aria-label"), "Filter changes");
    assert.strictEqual(triggerRef.current, trigger);
    assert.strictEqual(getComputedStyle(trigger).minHeight, "44px");

    act(() => {
      fireEvent.keyDown(trigger, { key: "ArrowDown" });
    });
    const heading = dom.window.document.body.querySelector(
      ".MuiListSubheader-root",
    );
    assert.ok(heading);
    assert.strictEqual(heading?.textContent, "Filter changes");
    assert.strictEqual(heading?.getAttribute("role"), "presentation");
    assert.strictEqual(heading?.getAttribute("aria-hidden"), "true");
    assert.strictEqual(heading?.hasAttribute("data-value"), false);
    assert.deepStrictEqual(
      [...dom.window.document.body.querySelectorAll("[data-value]")].map(
        (element) => element.getAttribute("data-value"),
      ),
      ["all", "long"],
    );
    const longOption = dom.window.document.body.querySelector(
      '[data-value="long"]',
    ) as HTMLElement;
    assert.ok(longOption);
    const injectedStyles = [...dom.window.document.querySelectorAll("style")]
      .map((style) => style.textContent ?? "")
      .join("\n");
    assert.match(injectedStyles, /white-space:normal/);
    assert.match(injectedStyles, /overflow-wrap:anywhere/);

    act(() => {
      fireEvent.click(longOption);
    });
    assert.deepStrictEqual(selected, ["long"]);
    assert.strictEqual(triggerRef.current, trigger);
    assert.strictEqual(dom.window.document.activeElement, trigger);
  });
});
