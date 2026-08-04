import * as assert from "assert";
import { JSDOM } from "jsdom";
import React, { useMemo, useRef, useState } from "react";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { createTheme } from "@mui/material/styles";
import {
  type FlowGraphUnitDto,
  type ValidatedFlowGraphDocument,
  toFlowGraphDocumentDto,
  validateFlowGraphDocument,
} from "../../application/flow-graph/flowGraphDocument";
import type { UnitDefinitionDialogDto } from "../../application/unit-definition/buildUnitDefinition";
import { parseAjsDocumentForTest } from "../support/parseAjs";
import {
  collectExpandedAncestorUnitIds,
  collectExpandedAncestorUnitIdsForUnits,
} from "../../presentation/webview/editor/ajsFlow/flowExpandedAncestors";
import { useFlowGraphState } from "../../presentation/webview/editor/ajsFlow/useFlowGraphState";
import { useNestedExpansionState } from "../../presentation/webview/editor/ajsFlow/useNestedExpansionState";

const nestedDefinition = `
unit=root,,jp1admin,;
{
  ty=g;
  el=jobnet,n,+0+0;
  unit=jobnet,,jp1admin,;
  {
    ty=n;
    el=child-net,n,+240+144;
    el=job-b,j,+400+144;
    ar=(f=child-net,t=job-b);
    unit=child-net,,jp1admin,;
    {
      ty=n;
      el=grand-net,n,+240+144;
      el=nested-job,j,+400+144;
      ar=(f=grand-net,t=nested-job);
      unit=grand-net,,jp1admin,;
      {
        ty=n;
        el=leaf,j,+240+144;
        unit=leaf,,jp1admin,;
        {
          ty=j;
        }
      }
      unit=nested-job,,jp1admin,;
      {
        ty=j;
      }
    }
    unit=job-b,,jp1admin,;
    {
      ty=j;
    }
  }
}
`;

const theme = createTheme();
const emptySearchMatchedUnitIds: string[] = [];
const emptyUnitDefinitions: ReadonlyMap<string, UnitDefinitionDialogDto> =
  new Map();

const installDomGlobals = (): {
  dom: JSDOM;
  previous: Map<string, PropertyDescriptor | undefined>;
} => {
  const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "http://localhost/",
  });
  const previous = new Map<string, PropertyDescriptor | undefined>();
  const domWindow = dom.window;
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
    requestAnimationFrame: (callback: FrameRequestCallback): number =>
      domWindow.setTimeout(() => callback(domWindow.performance.now()), 0),
    cancelAnimationFrame: (handle: number): void =>
      domWindow.clearTimeout(handle),
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

const restoreDomGlobals = (
  dom: JSDOM,
  previous: Map<string, PropertyDescriptor | undefined>,
): void => {
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

const parseFlowGraphDocumentForTest = (): ValidatedFlowGraphDocument => {
  const result = validateFlowGraphDocument(
    toFlowGraphDocumentDto(parseAjsDocumentForTest(nestedDefinition)),
  );
  assert.strictEqual(result.status, "available");
  return result as ValidatedFlowGraphDocument;
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

type FlowScopeStateFixtureProps = {
  flowDocument: ValidatedFlowGraphDocument;
  initialCurrentUnitId: string;
  childScopeId: string;
  unknownScopeId: string;
};

const FlowScopeStateFixture = ({
  flowDocument,
  initialCurrentUnitId,
  childScopeId,
  unknownScopeId,
}: FlowScopeStateFixtureProps) => {
  const [currentUnitId, setCurrentUnitId] = useState<string | undefined>(
    initialCurrentUnitId,
  );
  const [expandedUnitIds, setExpandedUnitIds] = useState<string[]>([]);
  const [dialogData, setDialogData] = useState<
    UnitDefinitionDialogDto | undefined
  >();
  const previousUnitIdRef = useRef<string | undefined>(undefined);
  const unitById = flowDocument.index.unitById;
  const currentUnit = currentUnitId ? unitById.get(currentUnitId) : undefined;
  const currentUnitIdState = useMemo(
    () => ({ currentUnitId, setCurrentUnitId }),
    [currentUnitId],
  );
  const dialogDataState = useMemo(
    () => ({ dialogData, setDialogData }),
    [dialogData],
  );
  const nestedExpansion = useNestedExpansionState({
    currentUnit,
    expandedUnitIds,
    setExpandedUnitIds,
    unitById,
  });
  const { nodes, edges } = useFlowGraphState({
    flowDocument,
    currentUnitId,
    currentUnitIdState,
    dialogDataState,
    expandedUnitIds,
    nestedExpansionState: nestedExpansion.nestedExpansionState,
    previousUnitIdRef,
    searchMatchedUnitIds: emptySearchMatchedUnitIds,
    theme,
    unitById,
    unitDefinitionByPath: emptyUnitDefinitions,
  });

  const graphState = nodes.map(({ id, data }) => ({
    id,
    isCurrent: data.isCurrent,
    isExpandedNested: data.isExpandedNested,
  }));

  return React.createElement(
    React.Fragment,
    null,
    React.createElement("output", { "data-testid": "scope" }, currentUnitId),
    React.createElement(
      "output",
      { "data-testid": "expanded" },
      JSON.stringify([...nestedExpansion.nestedExpansionState.expandedUnitIds]),
    ),
    React.createElement(
      "output",
      { "data-testid": "expandable" },
      JSON.stringify(nestedExpansion.expandableNestedUnitIds),
    ),
    React.createElement(
      "output",
      { "data-testid": "graph" },
      JSON.stringify(graphState),
    ),
    React.createElement(
      "output",
      { "data-testid": "edges" },
      JSON.stringify(edges),
    ),
    React.createElement(
      "button",
      {
        "data-testid": "enter-scope",
        onClick: () => setCurrentUnitId(childScopeId),
      },
      "enter",
    ),
    React.createElement(
      "button",
      {
        "data-testid": "return-scope",
        onClick: () => setCurrentUnitId(initialCurrentUnitId),
      },
      "return",
    ),
    React.createElement(
      "button",
      {
        "data-testid": "unavailable-scope",
        onClick: () => setCurrentUnitId(unknownScopeId),
      },
      "unavailable",
    ),
    React.createElement(
      "button",
      {
        "data-testid": "expand-child",
        onClick: () =>
          nestedExpansion.nestedExpansionState.toggleExpandedUnitId(
            childScopeId,
          ),
      },
      "expand",
    ),
    React.createElement(
      "button",
      {
        "data-testid": "expand-all",
        onClick: nestedExpansion.toggleExpandAllNestedUnits,
      },
      "expand all",
    ),
  );
};

const readJson = <Value>(
  view: ReturnType<typeof render>,
  testId: string,
): Value => JSON.parse(view.getByTestId(testId).textContent ?? "null") as Value;

suite("Flow scope state", () => {
  let dom: JSDOM;
  let previousGlobals: Map<string, PropertyDescriptor | undefined>;

  suiteSetup(() => {
    ({ dom, previous: previousGlobals } = installDomGlobals());
  });

  teardown(() => {
    cleanup();
    delete window.vscode;
    dom.window.document.body.innerHTML = "";
  });

  suiteTeardown(() => {
    restoreDomGlobals(dom, previousGlobals);
  });

  test("keeps scope changes and unavailable graph fallback deterministic", () => {
    const flowDocument = parseFlowGraphDocumentForTest();
    const rootScope = findRequiredUnit(flowDocument, "jobnet");
    const childScope = findRequiredUnit(flowDocument, "child-net");
    window.vscode = { postMessage: () => undefined } as never;

    const view = render(
      React.createElement(FlowScopeStateFixture, {
        flowDocument,
        initialCurrentUnitId: rootScope.id,
        childScopeId: childScope.id,
        unknownScopeId: "/root/unknown-scope",
      }),
    );

    const initialGraph = readJson<
      Array<{ id: string; isCurrent: boolean; isExpandedNested?: boolean }>
    >(view, "graph");
    assert.strictEqual(view.getByTestId("scope").textContent, rootScope.id);
    assert.ok(
      initialGraph.some(
        (node) => node.id === rootScope.id && node.isCurrent === true,
      ),
    );

    fireEvent.click(view.getByTestId("enter-scope"));
    const childGraph = readJson<
      Array<{ id: string; isCurrent: boolean; isExpandedNested?: boolean }>
    >(view, "graph");
    assert.strictEqual(view.getByTestId("scope").textContent, childScope.id);
    assert.ok(
      childGraph.some(
        (node) => node.id === childScope.id && node.isCurrent === true,
      ),
    );

    fireEvent.click(view.getByTestId("unavailable-scope"));
    assert.strictEqual(
      view.getByTestId("scope").textContent,
      "/root/unknown-scope",
    );
    assert.deepStrictEqual(readJson(view, "graph"), []);
    assert.deepStrictEqual(readJson(view, "edges"), []);

    fireEvent.click(view.getByTestId("return-scope"));
    assert.strictEqual(view.getByTestId("scope").textContent, rootScope.id);
    assert.ok(
      readJson<Array<{ id: string }>>(view, "graph").some(
        (node) => node.id === rootScope.id,
      ),
    );
  });

  test("keeps nested expansion identity and ancestor reveal stable", () => {
    const flowDocument = parseFlowGraphDocumentForTest();
    const rootScope = findRequiredUnit(flowDocument, "jobnet");
    const childScope = findRequiredUnit(flowDocument, "child-net");
    const grandScope = findRequiredUnit(flowDocument, "grand-net");
    const leaf = findRequiredUnit(flowDocument, "leaf");
    window.vscode = { postMessage: () => undefined } as never;

    const view = render(
      React.createElement(FlowScopeStateFixture, {
        flowDocument,
        initialCurrentUnitId: rootScope.id,
        childScopeId: childScope.id,
        unknownScopeId: "/root/unknown-scope",
      }),
    );

    assert.deepStrictEqual(readJson<string[]>(view, "expandable"), [
      childScope.id,
      grandScope.id,
    ]);
    assert.deepStrictEqual(readJson<string[]>(view, "expanded"), []);

    fireEvent.click(view.getByTestId("expand-child"));
    assert.deepStrictEqual(readJson<string[]>(view, "expanded"), [
      childScope.id,
    ]);
    assert.ok(
      readJson<Array<{ id: string; isExpandedNested?: boolean }>>(
        view,
        "graph",
      ).some(
        (node) => node.id === childScope.id && node.isExpandedNested === true,
      ),
    );

    fireEvent.click(view.getByTestId("expand-all"));
    assert.deepStrictEqual(readJson<string[]>(view, "expanded"), [
      childScope.id,
      grandScope.id,
    ]);

    fireEvent.click(view.getByTestId("expand-child"));
    assert.deepStrictEqual(readJson<string[]>(view, "expanded"), []);

    const unitById = flowDocument.index.unitById;
    assert.deepStrictEqual(
      collectExpandedAncestorUnitIds({
        unitById,
        unit: leaf,
        scopeUnit: rootScope,
      }),
      [childScope.id, grandScope.id],
    );
    assert.deepStrictEqual(
      collectExpandedAncestorUnitIdsForUnits({
        unitById,
        units: [leaf, grandScope],
        scopeUnit: rootScope,
      }),
      [childScope.id, grandScope.id],
    );
  });
});
