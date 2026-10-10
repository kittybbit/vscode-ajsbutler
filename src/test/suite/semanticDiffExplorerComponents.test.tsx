import * as assert from "assert";
import React from "react";
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import type {
  SemanticDiffExplorerActionSet,
  SemanticDiffExplorerLeaf,
  SemanticDiffExplorerViewModel,
} from "../../application/semantic-diff/semanticDiffExplorer";
import SemanticDiffExplorerApp from "../../presentation/webview/editor/semanticDiffExplorer/SemanticDiffExplorerApp";
import SemanticDiffExplorerContents from "../../presentation/webview/editor/semanticDiffExplorer/SemanticDiffExplorerContents";
import { SemanticDiffExplorerApp as CanonicalSemanticDiffExplorerApp } from "../../presentation/webview/editor/semanticDiffExplorer/SemanticDiffExplorerApp";
import { createViewerEventBridge } from "../../presentation/webview/editor/viewerEventBridge";
import { createViewerResourceStateMessage } from "../../presentation/webview/viewerHostMessages";

const unavailableActions = (): SemanticDiffExplorerActionSet => ({
  source: {
    available: false,
    actionId: null,
    unavailableReason: "missing-target",
  },
  flow: {
    available: false,
    actionId: null,
    unavailableReason: "missing-target",
  },
});

const explorerLeaf = (id: string): SemanticDiffExplorerLeaf => ({
  kind: "change",
  id,
  recordId: id,
  changeKind: "changed",
  elementKind: "unit",
  confirmationLevel: "confirmed",
  attributeCategory: null,
  identityDecisionId: null,
  targetSide: "after",
  target: {
    side: "after",
    value: {
      kind: "unit",
      unit: {
        id,
        name: id,
        absolutePath: `/jobs/${id}`,
        unitType: "unit",
      },
    },
  },
  before: null,
  after: null,
  relationPair: null,
  detail: {
    unitPath: `/jobs/${id}`,
    parameterKey: "timeout",
    relationPair: null,
    scheduleRule: null,
    period: null,
    beforeValues: ["10"],
    afterValues: ["20"],
    rawValues: [],
    removedSources: [],
  },
  constraints: [],
  warning: null,
  actions: unavailableActions(),
});

const viewModel = (): SemanticDiffExplorerViewModel => ({
  filter: "all",
  cards: [
    {
      id: "changes",
      count: 1,
      counts: { total: 1 },
    },
  ],
  tree: {
    id: "root",
    kind: "root",
    label: "root",
    path: null,
    children: [
      {
        id: "group:jobs",
        kind: "job-group",
        label: "Jobs",
        path: "/jobs",
        children: [],
        leaves: [explorerLeaf("job-a")],
      },
    ],
    leaves: [],
  },
  leafCount: 1,
  status: "findings",
});

suite("Semantic Diff Explorer components", () => {
  let eventBridge: ReturnType<typeof createViewerEventBridge>;
  let previousWindowProperties: Map<string, PropertyDescriptor | undefined>;
  const testWindow = window as Window & {
    EventBridge?: ReturnType<typeof createViewerEventBridge>;
    vscode?: { postMessage: (message: unknown) => void };
  };

  setup(() => {
    previousWindowProperties = new Map(
      ["EventBridge", "vscode"].map((key) => [
        key,
        Object.getOwnPropertyDescriptor(window, key),
      ]),
    );
    document.body.replaceChildren();
    delete document.body.dataset.semanticDiffSessionId;
    eventBridge = createViewerEventBridge();
    testWindow.EventBridge = eventBridge;
  });
  teardown(() => {
    cleanup();
    for (const [key, descriptor] of previousWindowProperties) {
      if (descriptor === undefined) {
        Reflect.deleteProperty(window, key);
      } else {
        Reflect.defineProperty(window, key, descriptor);
      }
    }
    document.body.replaceChildren();
    delete document.body.dataset.semanticDiffSessionId;
  });

  test("composes the canonical editor App and MUI boundaries", () => {
    assert.strictEqual(
      SemanticDiffExplorerApp,
      CanonicalSemanticDiffExplorerApp,
    );
    const messages: unknown[] = [];
    testWindow.vscode = {
      postMessage: (message: unknown) => messages.push(message),
    };
    document.body.dataset.semanticDiffSessionId = "sde-session-components";
    const loading = render(<SemanticDiffExplorerApp />);
    assert.strictEqual((messages[0] as { type: string }).type, "resource");
    act(() => {
      eventBridge.dispatch({
        data: createViewerResourceStateMessage({
          isDarkMode: false,
          lang: "en",
          scrollType: "window",
        }),
      } as MessageEvent);
    });
    assert.ok(loading.getByRole("heading", { name: "Semantic Diff Explorer" }));
    assert.ok(loading.getByRole("status").textContent?.includes("Loading"));
    assert.strictEqual((messages[1] as { type: string }).type, "ready");
    loading.unmount();

    const actions: Array<{ id: string; element: HTMLElement | undefined }> = [];
    const view = render(
      <SemanticDiffExplorerContents
        viewModel={viewModel()}
        language="en"
        themeMode="light"
        outputAction={(element) => actions.push({ id: "output", element })}
        calendarAction={(element) => actions.push({ id: "calendar", element })}
      />,
    );
    const header = view.getByRole("banner");
    assert.strictEqual(
      header.getAttribute("data-semantic-diff-explorer-header"),
      "true",
    );
    assert.strictEqual(getComputedStyle(header).position, "sticky");
    assert.ok(view.getByRole("region", { name: "Summary cards" }));
    assert.ok(view.getByRole("tree", { name: "Semantic diff changes" }));
    assert.ok(
      [...view.container.querySelectorAll('[data-result-status="true"]')].some(
        (element) => element.textContent?.includes("findings"),
      ),
    );
    assert.ok(view.container.querySelector('[aria-live="polite"]'));
    const keyValueRows = [
      ...view.container.querySelectorAll("[data-result-key-value-row]"),
    ];
    assert.ok(keyValueRows.length > 0);
    keyValueRows.forEach((row) => {
      assert.strictEqual(row.querySelectorAll("dt").length, 1);
      assert.strictEqual(row.querySelectorAll("dd").length, 1);
    });
    fireEvent.click(view.getByRole("button", { name: "Output" }));
    fireEvent.click(view.getByRole("button", { name: "Schedule impact" }));
    assert.deepStrictEqual(
      actions.map(({ id, element }) => [id, element?.tagName]),
      [
        ["output", "BUTTON"],
        ["calendar", "BUTTON"],
      ],
    );
    assert.ok(view.container.querySelector('[data-row-id="group:jobs"]'));
    assert.ok(view.container.querySelector('[data-record-id="job-a"]'));
  });
});
