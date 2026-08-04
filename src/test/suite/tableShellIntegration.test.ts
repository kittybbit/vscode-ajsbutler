import * as assert from "assert";
import { JSDOM } from "jsdom";
import React from "react";
import {
  act,
  cleanup,
  fireEvent,
  render,
  waitFor,
  within,
} from "@testing-library/react";
import { toUnitListDocumentDto } from "../../application/unit-list/unitListDocument";
import { AjsTableViewerApp } from "../../presentation/webview/editor/ajsTable/AjsTableViewerApp";
import { createViewerEventBridge } from "../../presentation/webview/editor/viewerEventBridge";
import {
  createViewerDocumentChangedMessage,
  createViewerResourceStateMessage,
  createViewerRevealUnitMessage,
} from "../../presentation/webview/viewerHostMessages";
import { parseAjsDocumentForTest } from "../support/parseAjs";

type GlobalDescriptorMap = Map<string, PropertyDescriptor | undefined>;

const definition = `
unit=root,,jp1admin,;
{
  ty=n;
  el=jobnet,n,+240+144;
  unit=jobnet,,jp1admin,;
  {
    ty=n;
    el=leaf-job,j,+240+144;
    unit=leaf-job,,jp1admin,;
    {
      ty=j;
      cm=example;
    }
  }
}
`;

const installDomGlobals = (): {
  dom: JSDOM;
  previous: GlobalDescriptorMap;
} => {
  const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "http://localhost/",
  });
  const previous: GlobalDescriptorMap = new Map();
  const requestAnimationFrame = (callback: FrameRequestCallback): number =>
    dom.window.setTimeout(() => callback(dom.window.performance.now()), 0);
  const values: Record<string, unknown> = {
    window: dom.window,
    document: dom.window.document,
    navigator: dom.window.navigator,
    HTMLElement: dom.window.HTMLElement,
    Node: dom.window.Node,
    Element: dom.window.Element,
    Event: dom.window.Event,
    MessageEvent: dom.window.MessageEvent,
    KeyboardEvent: dom.window.KeyboardEvent,
    MouseEvent: dom.window.MouseEvent,
    MutationObserver: dom.window.MutationObserver,
    ResizeObserver: class {
      disconnect(): void {}
      observe(): void {}
      unobserve(): void {}
    },
    IntersectionObserver: class {
      disconnect(): void {}
      observe(): void {}
      unobserve(): void {}
    },
    getComputedStyle: dom.window.getComputedStyle.bind(dom.window),
    requestAnimationFrame,
    cancelAnimationFrame: (handle: number): void =>
      dom.window.clearTimeout(handle),
    CSS: { escape: (value: string): string => value },
    IS_REACT_ACT_ENVIRONMENT: true,
  };
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
  dom.window.HTMLElement.prototype.scrollIntoView = () => undefined;
  dom.window.scrollTo = () => undefined;
  for (const [key, value] of Object.entries(values)) {
    previous.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
    Object.defineProperty(globalThis, key, {
      configurable: true,
      writable: true,
      value,
    });
  }
  return { dom, previous };
};

const restoreDomGlobals = (dom: JSDOM, previous: GlobalDescriptorMap): void => {
  for (const key of previous.keys()) {
    const descriptor = previous.get(key);
    if (descriptor) {
      Object.defineProperty(globalThis, key, descriptor);
    } else {
      delete (globalThis as Record<string, unknown>)[key];
    }
  }
  dom.window.close();
};

const isViewerMessage = (
  value: unknown,
  type: string,
): value is { type: string; data?: Record<string, unknown> } =>
  typeof value === "object" &&
  value !== null &&
  "type" in value &&
  value.type === type;

suite("Table shell integration", () => {
  let dom: JSDOM;
  let previousGlobals: GlobalDescriptorMap;

  suiteSetup(() => {
    ({ dom, previous: previousGlobals } = installDomGlobals());
  });

  teardown(() => {
    cleanup();
    delete window.vscode;
    delete window.EventBridge;
    dom.window.document.body.innerHTML = "";
  });

  suiteTeardown(() => {
    restoreDomGlobals(dom, previousGlobals);
  });

  test("connects search, detail actions, and counterpart reveal in one shell", async () => {
    const eventBridge = createViewerEventBridge();
    const postedMessages: unknown[] = [];
    window.EventBridge = eventBridge;
    window.vscode = {
      postMessage: (message: unknown) => postedMessages.push(message),
    } as never;

    const view = render(React.createElement(AjsTableViewerApp));
    const documentDto = toUnitListDocumentDto(
      parseAjsDocumentForTest(definition),
    );

    act(() => {
      eventBridge.dispatch(
        new MessageEvent("message", {
          data: createViewerResourceStateMessage({
            isDarkMode: false,
            lang: "en",
            scrollType: "table",
          }),
        }),
      );
      eventBridge.dispatch(
        new MessageEvent("message", {
          data: createViewerDocumentChangedMessage(documentDto),
        }),
      );
    });

    await waitFor(() => {
      assert.ok(view.getByRole("grid", { name: "Unit list" }));
      assert.ok(view.getByPlaceholderText(/search unit list/i));
    });

    const searchInput = view.getByPlaceholderText(/search unit list/i);
    fireEvent.change(searchInput, { target: { value: "leaf-job" } });
    fireEvent.keyUp(searchInput, { key: "Enter" });

    await waitFor(() => assert.ok(view.getByLabelText("1 / 1")));
    const row = view.getByRole("row", { name: /leaf-job/i });
    const leafCell = within(row).getAllByRole("gridcell")[1];
    assert.ok(leafCell);
    fireEvent.keyDown(leafCell, { key: "d" });

    await waitFor(() =>
      assert.ok(
        view.getByRole("complementary", {
          name: "Selected list unit details",
        }),
      ),
    );
    fireEvent.click(
      view.getByRole("button", { name: "Open definition details" }),
    );
    assert.ok(view.getByRole("dialog"));

    fireEvent.click(view.getByRole("button", { name: "Open in flow graph" }));
    assert.ok(
      postedMessages.some(
        (message) =>
          isViewerMessage(message, "navigate") &&
          message.data?.targetView === "flow" &&
          message.data?.absolutePath === "/root/jobnet/leaf-job",
      ),
    );

    act(() => {
      eventBridge.dispatch(
        new MessageEvent("message", {
          data: createViewerRevealUnitMessage("/root/jobnet"),
        }),
      );
    });

    await waitFor(() => {
      const revealedRow = view.getByRole("row", { name: /jobnet/i });
      assert.strictEqual(revealedRow.getAttribute("aria-selected"), "true");
    });
  });
});
