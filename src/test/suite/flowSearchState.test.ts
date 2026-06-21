import * as assert from "assert";
import {
  createEmptyFlowSearchState,
  createRevealedFlowSearchState,
  createSubmittedFlowSearchState,
  getFlowSearchResultPosition,
  isActiveFlowSearchQuery,
  moveFlowSearchResult,
} from "../../presentation/webview/editor/ajsFlow/flowSearchState";

suite("Flow Search State", () => {
  test("creates an active query with the result-selected initial match", () => {
    const state = createSubmittedFlowSearchState(
      "  JOB  ",
      {
        matchedUnitId: "child",
        matchedUnitIds: ["root", "child", "leaf"],
        expandedAncestorUnitIds: [],
      },
      1,
    );

    assert.deepStrictEqual(state, {
      query: "job",
      matchedUnitIds: ["root", "child", "leaf"],
      searchedUnitId: "child",
      focusRequestVersion: 1,
    });
    assert.deepStrictEqual(getFlowSearchResultPosition(state), {
      current: 2,
      total: 3,
    });
    assert.strictEqual(isActiveFlowSearchQuery(state, "Job"), true);
  });

  test("moves cyclically through multiple results", () => {
    const initial = createSubmittedFlowSearchState(
      "job",
      {
        matchedUnitId: "child",
        matchedUnitIds: ["root", "child", "leaf"],
        expandedAncestorUnitIds: [],
      },
      1,
    );

    const next = moveFlowSearchResult(initial, "next");
    const wrappedNext = moveFlowSearchResult(next, "next");
    const wrappedPrevious = moveFlowSearchResult(wrappedNext, "previous");

    assert.strictEqual(next.searchedUnitId, "leaf");
    assert.strictEqual(wrappedNext.searchedUnitId, "root");
    assert.strictEqual(wrappedPrevious.searchedUnitId, "leaf");
    assert.strictEqual(wrappedPrevious.focusRequestVersion, 4);
  });

  test("keeps zero and one-result transitions stable", () => {
    const noMatches = createSubmittedFlowSearchState("missing", undefined, 1);
    const oneMatch = createSubmittedFlowSearchState(
      "job",
      {
        matchedUnitId: "job",
        matchedUnitIds: ["job"],
        expandedAncestorUnitIds: [],
      },
      1,
    );

    assert.strictEqual(moveFlowSearchResult(noMatches, "next"), noMatches);
    assert.deepStrictEqual(getFlowSearchResultPosition(noMatches), {
      current: 0,
      total: 0,
    });
    assert.deepStrictEqual(moveFlowSearchResult(oneMatch, "previous"), {
      ...oneMatch,
      focusRequestVersion: 2,
    });
  });

  test("keeps external reveal separate from a submitted query", () => {
    const revealed = createRevealedFlowSearchState("revealed", 3);

    assert.strictEqual(revealed.query, undefined);
    assert.strictEqual(getFlowSearchResultPosition(revealed), undefined);
    assert.strictEqual(isActiveFlowSearchQuery(revealed, "revealed"), false);
  });

  test("replaces the active query without retaining previous matches", () => {
    const initial = createSubmittedFlowSearchState(
      "job",
      {
        matchedUnitId: "job-a",
        matchedUnitIds: ["job-a", "job-b"],
        expandedAncestorUnitIds: [],
      },
      1,
    );
    const replaced = createSubmittedFlowSearchState("net", undefined, 1);

    assert.strictEqual(isActiveFlowSearchQuery(initial, "net"), false);
    assert.deepStrictEqual(replaced, {
      query: "net",
      matchedUnitIds: [],
      focusRequestVersion: 1,
    });
  });

  test("creates a fresh cleared state while preserving request ordering", () => {
    assert.deepStrictEqual(createEmptyFlowSearchState(4), {
      matchedUnitIds: [],
      focusRequestVersion: 4,
    });
    assert.deepStrictEqual(
      createSubmittedFlowSearchState("   ", undefined, 4),
      createEmptyFlowSearchState(4),
    );
  });
});
