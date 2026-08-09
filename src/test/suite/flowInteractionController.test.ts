import * as assert from "assert";
import {
  createInitialFlowInteractionState,
  reduceFlowInteractionState,
} from "../../presentation/webview/editor/ajsFlow/flowInteractionController";

const searchResult = {
  matchedUnitId: "leaf",
  matchedUnitIds: ["child", "leaf"],
  expandedAncestorUnitIds: ["child"],
};

const revealTarget = {
  absolutePath: "/root/child/leaf",
  activeFlowScopeUnitId: "child",
  requiredExpandedAncestorUnitIds: ["nested"],
  revealedUnitId: "leaf",
};

suite("Flow interaction controller", () => {
  test("applies a matched search as one scope-local transition", () => {
    const state = reduceFlowInteractionState(
      createInitialFlowInteractionState(),
      { type: "searchSubmitted", query: " leaf ", result: searchResult },
    );

    assert.deepStrictEqual(state, {
      currentUnitId: undefined,
      expandedUnitIds: ["child"],
      preserveSearchOnNextScopeChange: false,
      graphFocusRequest: { revision: 0 },
      detailFocusRequestRevision: 0,
      selectorFocusRequest: { revision: 0 },
      selectionFocusRequest: { version: 0 },
      searchState: {
        query: "leaf",
        matchedUnitIds: ["child", "leaf"],
        searchedUnitId: "leaf",
        focusRequestVersion: 1,
      },
    });
  });

  test("keeps search navigation and clear transitions deterministic", () => {
    const submitted = reduceFlowInteractionState(
      createInitialFlowInteractionState(),
      { type: "searchSubmitted", query: "leaf", result: searchResult },
    );
    const navigated = reduceFlowInteractionState(submitted, {
      type: "searchNavigated",
      direction: "next",
    });
    const cleared = reduceFlowInteractionState(navigated, {
      type: "searchCleared",
    });

    assert.strictEqual(navigated.searchState.searchedUnitId, "child");
    assert.strictEqual(navigated.searchState.focusRequestVersion, 2);
    assert.deepStrictEqual(cleared.searchState, {
      matchedUnitIds: [],
      focusRequestVersion: 2,
    });
    assert.deepStrictEqual(cleared.expandedUnitIds, ["child"]);
  });

  test("applies external reveal and preserves its expanded ancestors once", () => {
    const revealed = reduceFlowInteractionState(
      createInitialFlowInteractionState(),
      { type: "externalReveal", target: revealTarget },
    );
    const preserved = reduceFlowInteractionState(revealed, {
      type: "scopeReset",
    });
    const reset = reduceFlowInteractionState(preserved, {
      type: "scopeReset",
    });

    assert.strictEqual(revealed.currentUnitId, "child");
    assert.deepStrictEqual(revealed.expandedUnitIds, ["nested"]);
    assert.strictEqual(revealed.searchState.searchedUnitId, "leaf");
    assert.strictEqual(revealed.preserveSearchOnNextScopeChange, true);
    assert.deepStrictEqual(preserved.expandedUnitIds, ["nested"]);
    assert.strictEqual(preserved.searchState.searchedUnitId, "leaf");
    assert.strictEqual(preserved.preserveSearchOnNextScopeChange, false);
    assert.deepStrictEqual(reset.expandedUnitIds, []);
    assert.deepStrictEqual(reset.searchState.matchedUnitIds, []);
  });

  test("does not leave a one-shot preserve intent when revealing in the same scope", () => {
    const initial = {
      ...createInitialFlowInteractionState(),
      currentUnitId: "child",
    };
    const revealed = reduceFlowInteractionState(initial, {
      type: "externalReveal",
      target: revealTarget,
    });

    assert.strictEqual(revealed.preserveSearchOnNextScopeChange, false);
  });

  test("keeps selection and cross-region focus intents distinct", () => {
    const selected = reduceFlowInteractionState(
      createInitialFlowInteractionState(),
      { type: "selectionChanged", unitId: "graph-unit" },
    );
    const detailFocused = reduceFlowInteractionState(selected, {
      type: "detailFocusRequested",
      unitId: "detail-unit",
    });
    const selectorFocused = reduceFlowInteractionState(detailFocused, {
      type: "selectorFocusRequested",
      savedGraphFocusUnitId: "detail-unit",
      targetUnitId: "scope",
    });
    const graphFocused = reduceFlowInteractionState(selectorFocused, {
      type: "selectorEscape",
    });

    assert.strictEqual(detailFocused.selectedUnitId, "detail-unit");
    assert.strictEqual(detailFocused.detailFocusRequestRevision, 1);
    assert.strictEqual(detailFocused.savedGraphFocusUnitId, "detail-unit");
    assert.deepStrictEqual(selectorFocused.selectorFocusRequest, {
      revision: 1,
      targetUnitId: "scope",
    });
    assert.deepStrictEqual(graphFocused.graphFocusRequest, {
      revision: 1,
      targetUnitId: "detail-unit",
    });
  });

  test("combines tree selection, ancestor expansion, and selection focus", () => {
    const state = reduceFlowInteractionState(
      {
        ...createInitialFlowInteractionState(),
        expandedUnitIds: ["existing"],
      },
      {
        type: "treeSelectionChanged",
        expandedNestedUnitIds: ["child", "grand"],
        selectedUnitId: "leaf",
      },
    );

    assert.deepStrictEqual(state.expandedUnitIds, [
      "existing",
      "child",
      "grand",
    ]);
    assert.strictEqual(state.selectedUnitId, "leaf");
    assert.deepStrictEqual(state.selectionFocusRequest, {
      targetUnitId: "leaf",
      version: 1,
    });
  });

  test("turns keyboard navigation into a selection viewport intent", () => {
    const state = reduceFlowInteractionState(
      createInitialFlowInteractionState(),
      { type: "keyboardNavigationRequested", unitId: "next-unit" },
    );

    assert.strictEqual(state.selectedUnitId, "next-unit");
    assert.deepStrictEqual(state.selectionFocusRequest, {
      targetUnitId: "next-unit",
      version: 1,
    });
    assert.strictEqual(state.currentUnitId, undefined);
  });

  test("creates one explicit scope transition and focus intent", () => {
    const state = reduceFlowInteractionState(
      {
        ...createInitialFlowInteractionState(),
        selectedUnitId: "old-unit",
      },
      {
        type: "scopeTransitionRequested",
        focusUnitId: "scope-entry",
        targetScopeUnitId: "next-scope",
      },
    );

    assert.strictEqual(state.currentUnitId, "next-scope");
    assert.strictEqual(state.selectedUnitId, undefined);
    assert.deepStrictEqual(state.graphFocusRequest, {
      revision: 1,
      expectedScopeUnitId: "next-scope",
      selectTarget: true,
      targetUnitId: "scope-entry",
    });
  });
});
