import * as assert from "assert";
import type { SemanticDiffOutputContext } from "../../application/semantic-diff/semanticDiffDto";
import {
  pickSemanticDiffOutputMode,
  presentSemanticDiffOutput,
  semanticDiffOutputModeItems,
  type SemanticDiffOutputMode,
} from "../../presentation/semantic-diff/semanticDiffOutput";

const emptyContext = (): SemanticDiffOutputContext => ({
  result: {
    inputs: {
      before: { side: "before", unitIds: [], relations: [] },
      after: { side: "after", unitIds: [], relations: [] },
    },
    changes: [],
    identityDecisions: [],
    confirmationRequired: [],
    unsupportedItems: [],
    limitations: [],
  },
  summary: {
    changeCountsByKind: {
      added: 0,
      removed: 0,
      changed: 0,
      renamed: 0,
      moved: 0,
    },
    changeCountsByElementKind: {
      "job-group": 0,
      jobnet: 0,
      unit: 0,
      relation: 0,
      attribute: 0,
    },
    changeCountsByAttributeCategory: {
      "execution-environment": 0,
      "execution-definition": 0,
      "start-condition": 0,
      "end-control": 0,
      "abnormal-end-control": 0,
      "wait-condition": 0,
      "external-integration": 0,
      schedule: 0,
    },
    unsupportedCountsByKind: {
      unsupported: 0,
      uninterpretable: 0,
      uncalculated: 0,
    },
    confirmationRequiredCount: 0,
    limitationCount: 0,
    scheduleRunChangeCount: 0,
    hasUncalculated: false,
    hasFindings: false,
  },
});

suite("Semantic diff output modes", () => {
  test("keeps Full first and marks it as the default", () => {
    assert.deepStrictEqual(
      semanticDiffOutputModeItems.map(({ mode }) => mode),
      ["full", "summary", "audit", "json"],
    );
    assert.match(semanticDiffOutputModeItems[0]!.description, /Default/);
  });

  test("returns undefined when the shared picker is cancelled", async () => {
    const selected = await pickSemanticDiffOutputMode(async () => undefined);

    assert.strictEqual(selected, undefined);
  });

  test("dispatches all modes from the same context without rebuilding it", () => {
    const context = emptyContext();
    const outputs = ["summary", "full", "audit", "json"].map((mode) =>
      presentSemanticDiffOutput(context, mode as SemanticDiffOutputMode),
    );

    assert.deepStrictEqual(
      outputs.map(({ mode }) => mode),
      ["summary", "full", "audit", "json"],
    );
    assert.deepStrictEqual(
      outputs.map(({ extension, languageId }) => [extension, languageId]),
      [
        [".md", "markdown"],
        [".md", "markdown"],
        [".md", "markdown"],
        [".json", "json"],
      ],
    );
    assert.deepStrictEqual(
      outputs.map(({ mediaType }) => mediaType),
      [
        "text/markdown; charset=utf-8",
        "text/markdown; charset=utf-8",
        "text/markdown; charset=utf-8",
        "application/json; charset=utf-8",
      ],
    );
    assert.ok(outputs.every(({ content }) => content.length > 0));
  });
});
