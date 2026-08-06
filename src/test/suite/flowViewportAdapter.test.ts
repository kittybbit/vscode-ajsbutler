import * as assert from "assert";
import { JSDOM } from "jsdom";
import React, { useEffect } from "react";
import { act, cleanup, render, waitFor } from "@testing-library/react";
import type { Edge, Node, ReactFlowInstance } from "@xyflow/react";
import type { FlowNodeData } from "../../presentation/webview/editor/ajsFlow/flowNodePresentationModel";
import {
  useFlowViewportAdapter,
  type FlowRendererReady,
} from "../../presentation/webview/editor/ajsFlow/useFlowViewportAdapter";

type GlobalDescriptorMap = Map<string, PropertyDescriptor | undefined>;

type FrameState = {
  callbacks: Map<number, FrameRequestCallback>;
  cancelled: number[];
  nextId: number;
};

const installDomGlobals = (): {
  dom: JSDOM;
  previous: GlobalDescriptorMap;
  frames: FrameState;
} => {
  const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "http://localhost/",
  });
  const previous: GlobalDescriptorMap = new Map();
  const frames: FrameState = { callbacks: new Map(), cancelled: [], nextId: 1 };
  const requestAnimationFrame = (callback: FrameRequestCallback): number => {
    const id = frames.nextId++;
    frames.callbacks.set(id, callback);
    return id;
  };
  const cancelAnimationFrame = (id: number): void => {
    frames.cancelled.push(id);
    frames.callbacks.delete(id);
  };
  const values: Record<string, unknown> = {
    window: dom.window,
    document: dom.window.document,
    navigator: dom.window.navigator,
    HTMLElement: dom.window.HTMLElement,
    Node: dom.window.Node,
    Element: dom.window.Element,
    Event: dom.window.Event,
    MutationObserver: dom.window.MutationObserver,
    requestAnimationFrame,
    cancelAnimationFrame,
    IS_REACT_ACT_ENVIRONMENT: true,
  };
  Object.defineProperty(dom.window, "requestAnimationFrame", {
    configurable: true,
    value: requestAnimationFrame,
  });
  Object.defineProperty(dom.window, "cancelAnimationFrame", {
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
  return { dom, previous, frames };
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

type ViewportCalls = {
  fitView: unknown[];
  setCenter: unknown[];
};

const createReactFlowInstance = (
  calls: ViewportCalls,
): ReactFlowInstance<Node<FlowNodeData>, Edge> =>
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
  }) as unknown as ReactFlowInstance<Node<FlowNodeData>, Edge>;

const AdapterFixture = ({
  focusRequestVersion = 0,
  layoutRequestIdentity,
  onReady,
  selectionFocusRequestVersion = 0,
  selectionFocusTargetUnitId,
}: {
  focusRequestVersion?: number;
  layoutRequestIdentity: object;
  onReady?: (ready: FlowRendererReady) => void;
  selectionFocusRequestVersion?: number;
  selectionFocusTargetUnitId?: string;
}) => {
  const { onRendererReady } = useFlowViewportAdapter({
    edges: [],
    focusRequestVersion,
    layoutRequestIdentity,
    nodes: [{ id: "target" } as Node<FlowNodeData>],
    preserveViewportRequestVersion: 0,
    searchedUnitId: undefined,
    selectionFocusRequestVersion,
    selectionFocusTargetUnitId,
  });
  useEffect(() => onReady?.(onRendererReady), [onReady, onRendererReady]);
  return null;
};

suite("Flow viewport adapter", () => {
  let dom: JSDOM;
  let previousGlobals: GlobalDescriptorMap;
  let frames: FrameState;

  suiteSetup(() => {
    ({ dom, previous: previousGlobals, frames } = installDomGlobals());
  });

  teardown(() => {
    cleanup();
    frames.callbacks.clear();
    frames.cancelled.length = 0;
  });

  suiteTeardown(() => {
    restoreDomGlobals(dom, previousGlobals);
  });

  test("waits for renderer readiness and executes one current-zoom center", async () => {
    const calls: ViewportCalls = { fitView: [], setCenter: [] };
    let ready: FlowRendererReady | undefined;
    const view = render(
      React.createElement(AdapterFixture, {
        layoutRequestIdentity: {},
        onReady: (nextReady) => {
          ready = nextReady;
        },
        selectionFocusRequestVersion: 1,
        selectionFocusTargetUnitId: "target",
      }),
    );

    await waitFor(() => assert.ok(ready));
    assert.deepStrictEqual(calls, { fitView: [], setCenter: [] });
    act(() => ready?.(createReactFlowInstance(calls)));
    await waitFor(() => assert.strictEqual(frames.callbacks.size, 1));
    const [frameId, callback] = [...frames.callbacks.entries()][0];
    act(() => {
      frames.callbacks.delete(frameId);
      callback(dom.window.performance.now());
    });

    assert.deepStrictEqual(calls.setCenter, [
      [50, 40, { duration: 250, zoom: 1.5 }],
    ]);
    assert.deepStrictEqual(calls.fitView, []);
    view.unmount();
  });

  test("cancels an obsolete frame and cleans up the active frame on unmount", async () => {
    const calls: ViewportCalls = { fitView: [], setCenter: [] };
    let ready: FlowRendererReady | undefined;
    const layoutRequestIdentity = {};
    const view = render(
      React.createElement(AdapterFixture, {
        layoutRequestIdentity,
        onReady: (nextReady) => {
          ready = nextReady;
        },
        selectionFocusRequestVersion: 1,
        selectionFocusTargetUnitId: "target",
      }),
    );
    await waitFor(() => assert.ok(ready));
    act(() => ready?.(createReactFlowInstance(calls)));
    await waitFor(() => assert.strictEqual(frames.callbacks.size, 1));
    const firstFrameId = [...frames.callbacks.keys()][0];

    view.rerender(
      React.createElement(AdapterFixture, {
        layoutRequestIdentity,
        onReady: (nextReady) => {
          ready = nextReady;
        },
        selectionFocusRequestVersion: 2,
        selectionFocusTargetUnitId: "target",
      }),
    );
    await waitFor(() => assert.ok(frames.cancelled.includes(firstFrameId)));
    await waitFor(() => assert.strictEqual(frames.callbacks.size, 1));
    const secondFrameId = [...frames.callbacks.keys()][0];

    view.unmount();
    assert.ok(frames.cancelled.includes(secondFrameId));
    assert.deepStrictEqual(calls, { fitView: [], setCenter: [] });
  });
});
