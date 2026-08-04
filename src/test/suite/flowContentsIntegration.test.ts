import * as assert from "assert";
import { JSDOM } from "jsdom";
import React from "react";
import {
  act,
  cleanup,
  fireEvent,
  render,
  waitFor,
} from "@testing-library/react";
import { toUnitListDocumentDto } from "../../application/unit-list/unitListDocument";
import { createViewerEventBridge } from "../../presentation/webview/editor/viewerEventBridge";
import {
  createViewerDocumentChangedMessage,
  createViewerResourceStateMessage,
} from "../../presentation/webview/viewerHostMessages";
import { parseAjsDocumentForTest } from "../support/parseAjs";

type FlowViewerAppModule =
  typeof import("../../presentation/webview/editor/ajsFlow/AjsFlowViewerApp");

const loadFlowViewerApp = async (): Promise<FlowViewerAppModule> => {
  const originalCssLoader = require.extensions[".css"];
  require.extensions[".css"] = () => undefined;
  try {
    return (await import(
      "../../presentation/webview/editor/ajsFlow/AjsFlowViewerApp"
    )) as FlowViewerAppModule;
  } finally {
    if (originalCssLoader) {
      require.extensions[".css"] = originalCssLoader;
    } else {
      delete require.extensions[".css"];
    }
  }
};

const nestedDefinition = `
unit=root,,jp1admin,;
{
  ty=g;
  el=jobnet,n,+0+0;
  unit=jobnet,,jp1admin,;
  {
    ty=n;
    el=child-net,n,+240+144;
    unit=child-net,,jp1admin,;
    {
      ty=n;
      el=leaf-job,j,+240+144;
      unit=leaf-job,,jp1admin,;
      {
        ty=j;
      }
    }
  }
}
`;

type GlobalDescriptorMap = Map<string, PropertyDescriptor | undefined>;

const installDomGlobals = (): {
  dom: JSDOM;
  previous: GlobalDescriptorMap;
} => {
  const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "http://localhost/",
  });
  const previous: GlobalDescriptorMap = new Map();
  const domWindow = dom.window;
  const requestAnimationFrame = (callback: FrameRequestCallback): number =>
    domWindow.setTimeout(() => callback(domWindow.performance.now()), 0);
  const values: Record<string, unknown> = {
    window: domWindow,
    document: domWindow.document,
    navigator: domWindow.navigator,
    HTMLElement: domWindow.HTMLElement,
    Node: domWindow.Node,
    Element: domWindow.Element,
    Event: domWindow.Event,
    MessageEvent: domWindow.MessageEvent,
    KeyboardEvent: domWindow.KeyboardEvent,
    MouseEvent: domWindow.MouseEvent,
    MutationObserver: domWindow.MutationObserver,
    ResizeObserver: class {
      disconnect(): void {}
      observe(): void {}
      unobserve(): void {}
    },
    getComputedStyle: domWindow.getComputedStyle.bind(domWindow),
    requestAnimationFrame,
    cancelAnimationFrame: (handle: number): void =>
      domWindow.clearTimeout(handle),
    CSS: { escape: (value: string): string => value },
    IS_REACT_ACT_ENVIRONMENT: true,
  };
  Object.defineProperty(domWindow, "matchMedia", {
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
  domWindow.HTMLElement.prototype.scrollIntoView = () => undefined;
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

suite("Flow Contents integration", () => {
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

  test("connects the document to the Flow tree, graph, and header actions", async () => {
    const { AjsFlowViewerApp } = await loadFlowViewerApp();
    const eventBridge = createViewerEventBridge();
    const postedMessages: unknown[] = [];
    window.EventBridge = eventBridge;
    window.vscode = {
      postMessage: (message: unknown) => postedMessages.push(message),
    } as never;

    const view = render(React.createElement(AjsFlowViewerApp));
    const documentDto = toUnitListDocumentDto(
      parseAjsDocumentForTest(nestedDefinition),
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
      assert.ok(view.getByRole("tree"));
      assert.ok(view.getByRole("region", { name: /flow graph/i }));
      assert.ok(view.getByPlaceholderText(/search/i));
    });

    const currentScope = view.getByText("ROOT JOBNET");
    assert.ok(currentScope);
    const tree = view.getByRole("tree");
    const currentScopeRow = tree.querySelector<HTMLElement>(
      '[data-unit-tree-unit-id$="/jobnet"]',
    );
    assert.ok(currentScopeRow);

    fireEvent.click(currentScopeRow);
    assert.strictEqual(currentScopeRow.getAttribute("aria-selected"), "true");

    const relationshipFocusButton = view.getByRole("button", {
      name: /focus relationships/i,
    });
    fireEvent.click(relationshipFocusButton);
    assert.strictEqual(
      relationshipFocusButton.getAttribute("aria-pressed"),
      "true",
    );

    const searchInput = view.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: "leaf-job" } });
    fireEvent.keyUp(searchInput, { key: "Enter" });

    await waitFor(() => {
      assert.ok(view.getByLabelText("1 / 1"));
    });
    assert.ok(
      postedMessages.some(
        (message) =>
          typeof message === "object" &&
          message !== null &&
          JSON.stringify(message).includes("flow.relationship_focus.toggle"),
      ),
    );
  });
});
