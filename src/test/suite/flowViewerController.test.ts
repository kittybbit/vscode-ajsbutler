import * as assert from "assert";
import { createTheme } from "@mui/material/styles";
import { JSDOM } from "jsdom";
import React from "react";
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import {
  type FlowGraphUnitDto,
  type ValidatedFlowGraphDocument,
  validateFlowGraphDocument,
} from "../../application/flow-graph/flowGraphDocument";
import { toUnitListDocumentDto } from "../../application/unit-list/unitListDocument";
import { createViewerDocumentChangedMessage } from "../../presentation/webview/viewerHostMessages";
import { createViewerEventBridge } from "../../presentation/webview/editor/viewerEventBridge";
import { useFlowViewerController } from "../../presentation/webview/editor/ajsFlow/useFlowViewerController";
import { parseAjsDocumentForTest } from "../support/parseAjs";

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
      el=grand-net,n,+240+144;
      unit=grand-net,,jp1admin,;
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
    IS_REACT_ACT_ENVIRONMENT: true,
  };
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

const findUnitByName = (
  unit: FlowGraphUnitDto,
  name: string,
): FlowGraphUnitDto | undefined => {
  if (unit.name === name) {
    return unit;
  }
  for (const child of unit.children) {
    const match = findUnitByName(child, name);
    if (match) {
      return match;
    }
  }
  return undefined;
};

const findRequiredUnit = (
  document: ValidatedFlowGraphDocument,
  name: string,
): FlowGraphUnitDto => {
  const match = document.document.rootUnits
    .map((unit) => findUnitByName(unit, name))
    .find((unit): unit is FlowGraphUnitDto => unit !== undefined);
  assert.ok(match, `Expected unit ${name} to exist`);
  return match;
};

const buildDocumentFixture = (): {
  hostDocument: ReturnType<typeof toUnitListDocumentDto>;
  flowDocument: ValidatedFlowGraphDocument;
} => {
  const document = parseAjsDocumentForTest(nestedDefinition);
  const hostDocument = toUnitListDocumentDto(document);
  const validation = validateFlowGraphDocument(hostDocument);
  assert.strictEqual(validation.status, "available");
  return {
    hostDocument,
    flowDocument: validation as ValidatedFlowGraphDocument,
  };
};

const expectedControllerKeys = [
  "canEnableFocusMode",
  "clearGraphHoveredUnit",
  "clearSelectedUnit",
  "clearTreeHoveredUnit",
  "currentUnit",
  "currentUnitIdState",
  "dialogData",
  "edges",
  "expandableNestedUnitIds",
  "flowDocumentDto",
  "focusModeEnabled",
  "graphHoveredUnit",
  "handleSearchClear",
  "handleSearchNavigate",
  "handleSearchSubmit",
  "hasExpandedAllNestedUnits",
  "hoveredUnitId",
  "nodes",
  "openSelectedNodeDefinition",
  "openSelectedNodeScope",
  "reactFlowInstanceRef",
  "searchResultPosition",
  "searchedUnitId",
  "selectFlowNode",
  "selectTreeUnit",
  "selectedNodeDetail",
  "selectedUnitId",
  "setDialogData",
  "showMiniMap",
  "toggleExpandAllNestedUnits",
  "toggleExpandedFlowNodeFromKeyboard",
  "toggleFocusMode",
  "toggleMiniMap",
  "treeHoveredUnit",
  "unitById",
].sort();

const ControllerFixture = ({ targetUnitId }: { targetUnitId: string }) => {
  const controller = useFlowViewerController({ theme: createTheme() });
  const selectedNodes = controller.nodes
    .filter((node) => node.data.isSelected)
    .map((node) => node.id);
  const expandedNodes = controller.nodes
    .filter((node) => node.data.isExpandedNested)
    .map((node) => node.id);

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      "output",
      { "data-testid": "keys" },
      JSON.stringify(Object.keys(controller).sort()),
    ),
    React.createElement(
      "output",
      { "data-testid": "current-unit" },
      controller.currentUnitIdState.currentUnitId ?? "",
    ),
    React.createElement(
      "output",
      { "data-testid": "selected-nodes" },
      JSON.stringify(selectedNodes),
    ),
    React.createElement(
      "output",
      { "data-testid": "expanded-nodes" },
      JSON.stringify(expandedNodes),
    ),
    React.createElement(
      "button",
      {
        "data-testid": "select-tree-unit",
        onClick: () => controller.selectTreeUnit(targetUnitId),
      },
      "select",
    ),
  );
};

suite("Flow Viewer Controller", () => {
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

  test("preserves the public controller contract and tree selection composition", () => {
    const { flowDocument, hostDocument } = buildDocumentFixture();
    const currentUnit = findRequiredUnit(flowDocument, "jobnet");
    const targetUnit = findRequiredUnit(flowDocument, "leaf-job");
    window.vscode = { postMessage: () => undefined } as never;
    window.EventBridge = createViewerEventBridge();

    const view = render(
      React.createElement(ControllerFixture, { targetUnitId: targetUnit.id }),
    );

    assert.deepStrictEqual(
      JSON.parse(view.getByTestId("keys").textContent ?? "[]"),
      expectedControllerKeys,
    );

    act(() => {
      window.EventBridge.dispatch(
        new MessageEvent("message", {
          data: createViewerDocumentChangedMessage(hostDocument),
        }),
      );
    });
    assert.strictEqual(
      view.getByTestId("current-unit").textContent,
      currentUnit.id,
    );

    fireEvent.click(view.getByTestId("select-tree-unit"));
    assert.deepStrictEqual(
      JSON.parse(view.getByTestId("selected-nodes").textContent ?? "[]"),
      [targetUnit.id],
    );
    assert.deepStrictEqual(
      JSON.parse(view.getByTestId("expanded-nodes").textContent ?? "[]"),
      [
        findRequiredUnit(flowDocument, "child-net").id,
        findRequiredUnit(flowDocument, "grand-net").id,
      ],
    );
  });
});
