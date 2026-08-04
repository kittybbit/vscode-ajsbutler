import * as assert from "assert";
import { JSDOM } from "jsdom";
import React, { useRef, useState } from "react";
import { cleanup, fireEvent, render } from "@testing-library/react";
import {
  toFlowGraphDocumentDto,
  type FlowGraphUnitDto,
  type ValidatedFlowGraphDocument,
  validateFlowGraphDocument,
} from "../../application/flow-graph/flowGraphDocument";
import { useFlowSearchState } from "../../presentation/webview/editor/ajsFlow/useFlowSearchState";
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

type FlowSearchControllerFixtureProps = {
  flowDocument: ValidatedFlowGraphDocument;
  initialScopeId: string;
};

const FlowSearchControllerFixture = ({
  flowDocument,
  initialScopeId,
}: FlowSearchControllerFixtureProps) => {
  const [currentUnitId, setCurrentUnitId] = useState(initialScopeId);
  const [expandedUnitIds, setExpandedUnitIds] = useState<string[]>([]);
  const preserveSearchOnNextScopeChange = useRef(false);
  const unitById = flowDocument.index.unitById;
  const currentUnit = unitById.get(currentUnitId);
  const search = useFlowSearchState({
    currentUnit,
    flowDocument,
    preserveSearchOnNextScopeChange,
    setCurrentUnitId,
    setExpandedUnitIds,
    unitById,
  });

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      "output",
      { "data-testid": "state" },
      JSON.stringify({
        currentUnitId,
        expandedUnitIds,
        focusRequestVersion: search.focusRequestVersion,
        matchedUnitIds: search.searchMatchedUnitIds,
        position: search.searchResultPosition,
        searchedUnitId: search.searchedUnitId,
      }),
    ),
    React.createElement(
      "output",
      { "data-testid": "preserve-search" },
      String(preserveSearchOnNextScopeChange.current),
    ),
    React.createElement(
      "button",
      {
        "data-testid": "submit",
        onClick: () => search.handleSearchSubmit("leaf"),
      },
      "submit",
    ),
    React.createElement(
      "button",
      {
        "data-testid": "navigate",
        onClick: () => search.handleSearchNavigate("leaf", "next"),
      },
      "navigate",
    ),
    React.createElement(
      "button",
      {
        "data-testid": "clear",
        onClick: search.handleSearchClear,
      },
      "clear",
    ),
    React.createElement(
      "button",
      {
        "data-testid": "reveal",
        onClick: () =>
          search.handleRevealUnit({ absolutePath: "/root/jobnet/child-net" }),
      },
      "reveal",
    ),
  );
};

const readState = (view: ReturnType<typeof render>): Record<string, unknown> =>
  JSON.parse(view.getByTestId("state").textContent ?? "{}") as Record<
    string,
    unknown
  >;

suite("Flow Search Controller", () => {
  let dom: JSDOM;
  let previousGlobals: GlobalDescriptorMap;

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

  test("submits, navigates, and clears current-scope search state", () => {
    const flowDocument = parseFlowGraphDocumentForTest();
    const scope = findRequiredUnit(flowDocument, "jobnet");
    const leaf = findRequiredUnit(flowDocument, "leaf-job");
    const postedMessages: unknown[] = [];
    window.vscode = {
      postMessage: (message: unknown) => postedMessages.push(message),
    } as never;

    const view = render(
      React.createElement(FlowSearchControllerFixture, {
        flowDocument,
        initialScopeId: scope.id,
      }),
    );

    fireEvent.click(view.getByTestId("submit"));
    assert.deepStrictEqual(readState(view), {
      currentUnitId: scope.id,
      expandedUnitIds: [
        findRequiredUnit(flowDocument, "child-net").id,
        findRequiredUnit(flowDocument, "grand-net").id,
      ],
      focusRequestVersion: 1,
      matchedUnitIds: [leaf.id],
      position: { current: 1, total: 1 },
      searchedUnitId: leaf.id,
    });
    assert.strictEqual((postedMessages[0] as { type: string }).type, "search");

    fireEvent.click(view.getByTestId("navigate"));
    assert.deepStrictEqual(readState(view), {
      currentUnitId: scope.id,
      expandedUnitIds: [
        findRequiredUnit(flowDocument, "child-net").id,
        findRequiredUnit(flowDocument, "grand-net").id,
      ],
      focusRequestVersion: 2,
      matchedUnitIds: [leaf.id],
      position: { current: 1, total: 1 },
      searchedUnitId: leaf.id,
    });
    assert.strictEqual((postedMessages[1] as { type: string }).type, "search");

    fireEvent.click(view.getByTestId("clear"));
    assert.deepStrictEqual(readState(view), {
      currentUnitId: scope.id,
      expandedUnitIds: [
        findRequiredUnit(flowDocument, "child-net").id,
        findRequiredUnit(flowDocument, "grand-net").id,
      ],
      focusRequestVersion: 2,
      matchedUnitIds: [],
    });
    assert.strictEqual((postedMessages[2] as { type: string }).type, "search");
  });

  test("reveals an available unit in its flow scope and preserves search intent", () => {
    const flowDocument = parseFlowGraphDocumentForTest();
    const scope = findRequiredUnit(flowDocument, "jobnet");
    const revealedScope = findRequiredUnit(flowDocument, "child-net");
    const view = render(
      React.createElement(FlowSearchControllerFixture, {
        flowDocument,
        initialScopeId: scope.id,
      }),
    );

    fireEvent.click(view.getByTestId("reveal"));
    assert.deepStrictEqual(readState(view), {
      currentUnitId: revealedScope.id,
      expandedUnitIds: [],
      focusRequestVersion: 1,
      matchedUnitIds: [revealedScope.id],
      searchedUnitId: revealedScope.id,
    });
    assert.strictEqual(view.getByTestId("preserve-search").textContent, "true");
  });
});
