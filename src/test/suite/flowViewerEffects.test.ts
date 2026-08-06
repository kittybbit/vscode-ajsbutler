import * as assert from "assert";
import { JSDOM } from "jsdom";
import React, { useCallback, useReducer, useRef, useState } from "react";
import { act, cleanup, render, waitFor } from "@testing-library/react";
import type { Edge, Node, ReactFlowInstance } from "@xyflow/react";
import {
  toUnitListDocumentDto,
  type UnitListDocumentDto,
} from "../../application/unit-list/unitListDocument";
import type { AjsDocument } from "../../domain/models/ajs/AjsDocument";
import { createViewerEventBridge } from "../../presentation/webview/editor/viewerEventBridge";
import {
  CHANGE_DOCUMENT,
  createViewerDocumentChangedMessage,
  createViewerRevealUnitMessage,
  REVEAL_UNIT,
} from "../../presentation/webview/viewerHostMessages";
import type { NavigationRequestDto } from "../../application/navigation/resolveNavigationTarget";
import {
  useFlowDocumentSubscription,
  useFlowScopeReset,
  useFlowViewerFitView,
  useFlowViewerOverflow,
  useRevealUnitSubscription,
} from "../../presentation/webview/editor/ajsFlow/useFlowViewerEffects";
import {
  reduceFlowInteractionState,
  createInitialFlowInteractionState,
} from "../../presentation/webview/editor/ajsFlow/flowInteractionController";

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
  const cancelAnimationFrame = (handle: number): void =>
    domWindow.clearTimeout(handle);
  const values: Record<string, unknown> = {
    window: domWindow,
    document: domWindow.document,
    navigator: domWindow.navigator,
    HTMLElement: domWindow.HTMLElement,
    Node: domWindow.Node,
    Element: domWindow.Element,
    Event: domWindow.Event,
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
    cancelAnimationFrame,
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
  Object.defineProperty(domWindow, "requestAnimationFrame", {
    configurable: true,
    value: requestAnimationFrame,
  });
  Object.defineProperty(domWindow, "cancelAnimationFrame", {
    configurable: true,
    value: cancelAnimationFrame,
  });
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

const documentFixture: AjsDocument = {
  rootUnits: [
    {
      id: "root-id",
      name: "root",
      unitAttribute: "root,,jp1admin,",
      unitType: "n",
      absolutePath: "/root",
      depth: 0,
      isRoot: true,
      isRootJobnet: true,
      hasSchedule: false,
      hasWaitedFor: false,
      layout: { h: 0, v: 0 },
      parameters: [{ key: "ty", value: "n" }],
      relations: [],
      children: [],
    },
  ],
  warnings: [],
};

const documentPayload = (): UnitListDocumentDto =>
  JSON.parse(
    JSON.stringify(toUnitListDocumentDto(documentFixture)),
  ) as UnitListDocumentDto;

const createReactFlowInstance = (calls: {
  fitView: unknown[];
  setCenter: unknown[];
}): ReactFlowInstance<Node, Edge> =>
  ({
    fitView: (options: unknown) => {
      calls.fitView.push(options);
      return Promise.resolve(true);
    },
    getNodesBounds: () => ({ height: 40, width: 80, x: 10, y: 20 }),
    getZoom: () => 1.5,
    setCenter: (...args: unknown[]) => {
      calls.setCenter.push(args);
      return Promise.resolve(true);
    },
  }) as unknown as ReactFlowInstance<Node, Edge>;

const FitViewFixture = ({
  instance,
}: {
  instance: ReactFlowInstance<Node, Edge>;
}) => {
  const reactFlowInstanceRef = useRef<ReactFlowInstance<Node, Edge> | null>(
    instance,
  );
  useFlowViewerFitView({
    edges: [],
    focusRequestVersion: 0,
    layoutRequestIdentity: {},
    nodes: [{ id: "target" } as Node],
    preserveViewportRequestVersion: 0,
    reactFlowInstanceRef,
    selectionFocusRequestVersion: 1,
    selectionFocusTargetUnitId: "target",
  });
  return null;
};

const DocumentSubscriptionFixture = () => {
  const [flowDocument, setFlowDocument] = useState<unknown>();
  const [currentUnitId, setCurrentUnitId] = useState<string>();
  const [unitDefinitionByPath, setUnitDefinitionByPath] = useState(new Map());
  const previousUnitIdRef = useRef<string | undefined>(undefined);
  useFlowDocumentSubscription({
    previousUnitIdRef,
    setFlowDocument: setFlowDocument as never,
    setCurrentUnitId,
    setUnitDefinitionByPath: setUnitDefinitionByPath as never,
  });
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      "output",
      { "data-testid": "document-status" },
      flowDocument ? "available" : "unavailable",
    ),
    React.createElement(
      "output",
      { "data-testid": "current-unit" },
      currentUnitId,
    ),
    React.createElement(
      "output",
      { "data-testid": "definition-count" },
      unitDefinitionByPath.size,
    ),
  );
};

const RevealSubscriptionFixture = ({
  onReveal,
}: {
  onReveal: (request: NavigationRequestDto) => void;
}) => {
  useRevealUnitSubscription({ handleRevealUnit: onReveal });
  return null;
};

const ScopeResetFixture = () => {
  const [interactionState, dispatch] = useReducer(reduceFlowInteractionState, {
    ...createInitialFlowInteractionState(),
    currentUnitId: "root",
    expandedUnitIds: ["nested"],
  });
  const [resetCount, setResetCount] = useState(0);
  const documentIdentity = useRef<object>({}).current;
  const resetScope = useCallback(() => {
    setResetCount((count) => count + 1);
    dispatch({ type: "scopeReset" });
  }, []);
  useFlowScopeReset({
    currentUnitId: interactionState.currentUnitId,
    documentIdentity,
    resetScope,
  });
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      "output",
      { "data-testid": "scope" },
      interactionState.currentUnitId,
    ),
    React.createElement(
      "output",
      { "data-testid": "expanded" },
      JSON.stringify(interactionState.expandedUnitIds),
    ),
    React.createElement("output", { "data-testid": "reset-count" }, resetCount),
    React.createElement(
      "button",
      {
        "data-testid": "change-scope",
        onClick: () =>
          dispatch({ type: "scopeChanged", currentUnitId: "nested" }),
      },
      "change",
    ),
  );
};

const OverflowFixture = () => {
  useFlowViewerOverflow();
  return null;
};

suite("Flow viewer effects", () => {
  let dom: JSDOM;
  let previousGlobals: GlobalDescriptorMap;

  suiteSetup(() => {
    ({ dom, previous: previousGlobals } = installDomGlobals());
  });

  teardown(() => {
    cleanup();
    delete window.EventBridge;
    delete window.vscode;
    dom.window.document.body.innerHTML = "";
  });

  suiteTeardown(() => {
    restoreDomGlobals(dom, previousGlobals);
  });

  test("focuses a rendered selection while preserving the current zoom", async () => {
    const calls = { fitView: [] as unknown[], setCenter: [] as unknown[] };
    const view = render(
      React.createElement(FitViewFixture, {
        instance: createReactFlowInstance(calls),
      }),
    );

    await waitFor(() => assert.strictEqual(calls.setCenter.length, 1));
    assert.deepStrictEqual(calls.setCenter[0], [
      50,
      40,
      { duration: 250, zoom: 1.5 },
    ]);
    assert.deepStrictEqual(calls.fitView, []);
    view.unmount();
  });

  test("resets expanded scope state when the scope changes", () => {
    const view = render(React.createElement(ScopeResetFixture));

    assert.deepStrictEqual(
      JSON.parse(view.getByTestId("expanded").textContent ?? "null"),
      [],
    );
    assert.strictEqual(view.getByTestId("reset-count").textContent, "1");

    act(() => view.getByTestId("change-scope").click());
    assert.deepStrictEqual(
      JSON.parse(view.getByTestId("expanded").textContent ?? "null"),
      [],
    );
    assert.strictEqual(view.getByTestId("reset-count").textContent, "2");
  });

  test("subscribes to document changes and removes the callback on cleanup", () => {
    const bridge = createViewerEventBridge();
    const postedMessages: unknown[] = [];
    window.EventBridge = bridge;
    window.vscode = {
      postMessage: (message: unknown) => postedMessages.push(message),
    } as never;
    const view = render(React.createElement(DocumentSubscriptionFixture));

    assert.strictEqual(bridge.callbacks[CHANGE_DOCUMENT]?.length, 1);
    act(() => {
      bridge.dispatch({
        data: createViewerDocumentChangedMessage(documentPayload()),
      } as MessageEvent);
    });
    assert.strictEqual(
      view.getByTestId("document-status").textContent,
      "available",
    );
    assert.strictEqual(view.getByTestId("current-unit").textContent, "root-id");
    assert.strictEqual(view.getByTestId("definition-count").textContent, "1");
    assert.deepStrictEqual(
      postedMessages.map((message) => (message as { type: string }).type),
      ["performance", "ready"],
    );

    view.unmount();
    assert.strictEqual(bridge.callbacks[CHANGE_DOCUMENT]?.length, 0);
  });

  test("handles valid reveal requests and ignores invalid requests", () => {
    const bridge = createViewerEventBridge();
    const requests: NavigationRequestDto[] = [];
    window.EventBridge = bridge;
    const view = render(
      React.createElement(RevealSubscriptionFixture, {
        onReveal: (request) => requests.push(request),
      }),
    );

    act(() => {
      bridge.dispatch({
        data: createViewerRevealUnitMessage("/root"),
      } as MessageEvent);
      bridge.dispatch({
        data: { type: REVEAL_UNIT, data: { absolutePath: "" } },
      } as MessageEvent);
    });
    assert.deepStrictEqual(requests, [{ absolutePath: "/root" }]);

    view.unmount();
    assert.strictEqual(bridge.callbacks[REVEAL_UNIT]?.length, 0);
  });

  test("restores global overflow styles when the viewer unmounts", () => {
    const root = document.createElement("div");
    root.id = "root";
    document.body.append(root);
    document.documentElement.style.overflow = "auto";
    document.body.style.overflow = "scroll";
    root.style.overflow = "clip";
    root.style.height = "42px";

    const view = render(React.createElement(OverflowFixture));
    assert.strictEqual(document.documentElement.style.overflow, "hidden");
    assert.strictEqual(document.body.style.overflow, "hidden");
    assert.strictEqual(root.style.overflow, "hidden");
    assert.strictEqual(root.style.height, "100%");

    view.unmount();
    assert.strictEqual(document.documentElement.style.overflow, "auto");
    assert.strictEqual(document.body.style.overflow, "scroll");
    assert.strictEqual(root.style.overflow, "clip");
    assert.strictEqual(root.style.height, "42px");
  });
});
