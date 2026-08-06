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
});
