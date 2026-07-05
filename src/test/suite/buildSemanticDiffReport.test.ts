import * as assert from "assert";
import type { AjsParserPort } from "../../application/parsing/AjsParserPort";
import {
  createBuildSemanticDiffReport,
  type BuildSemanticDiffReportInput,
} from "../../application/semantic-diff/buildSemanticDiffReport";
import type { CompareSemanticDiffInput } from "../../application/semantic-diff/compareSemanticDiff";
import type { SemanticDiffChangeSet } from "../../domain/models/semantic-diff/SemanticDiff";
import type { Unit } from "../../domain/values/Unit";

type BuildSemanticDiffReportObservations = {
  parsedContents: string[];
  comparedInputs: CompareSemanticDiffInput[];
  renderedChangeSets: SemanticDiffChangeSet[];
};

const createParser = (
  observations: BuildSemanticDiffReportObservations,
): AjsParserPort => ({
  parse: (content) => {
    observations.parsedContents.push(content);
    return content.includes("parse-error")
      ? {
          rootUnits: [] as Unit[],
          errors: [
            {
              line: 1,
              column: 1,
              message: "synthetic parse error",
            },
          ],
        }
      : {
          rootUnits: [] as Unit[],
          errors: [],
        };
  },
});

const createCompare =
  (observations: BuildSemanticDiffReportObservations) =>
  (input: CompareSemanticDiffInput): SemanticDiffChangeSet => {
    observations.comparedInputs.push(input);
    return {
      inputs: {
        before: { side: "before", document: input.before },
        after: { side: "after", document: input.after },
      },
      changes: [],
      confirmationRequired: [],
      unsupportedItems: [],
      limitations: [],
      reportSections: [],
    };
  };

const createRender =
  (observations: BuildSemanticDiffReportObservations) =>
  (changeSet: SemanticDiffChangeSet): string => {
    observations.renderedChangeSets.push(changeSet);
    return "rendered semantic diff";
  };

const createHarness = () => {
  const observations: BuildSemanticDiffReportObservations = {
    parsedContents: [],
    comparedInputs: [],
    renderedChangeSets: [],
  };
  const build = createBuildSemanticDiffReport(
    createParser(observations),
    createCompare(observations),
    createRender(observations),
  );
  return { observations, build };
};

suite("Build Semantic Diff Report", () => {
  test("parses both definitions, compares normalized documents, and renders markdown", () => {
    const { observations, build } = createHarness();
    const input: BuildSemanticDiffReportInput = {
      beforeContent: "unit=before,,jp1admin,;",
      afterContent: "unit=after,,jp1admin,;",
    };

    const result = build(input);

    assert.deepStrictEqual(observations.parsedContents, [
      "unit=before,,jp1admin,;",
      "unit=after,,jp1admin,;",
    ]);
    assert.strictEqual(observations.comparedInputs.length, 1);
    assert.strictEqual(observations.renderedChangeSets.length, 1);
    assert.deepStrictEqual(result, {
      ok: true,
      report: "rendered semantic diff",
    });
  });

  test("returns parse errors without comparing or rendering", () => {
    const { observations, build } = createHarness();

    const result = build({
      beforeContent: "parse-error",
      afterContent: "unit=after,,jp1admin,;",
    });

    assert.strictEqual(result.ok, false);
    if (result.ok) {
      throw new Error("Expected parse failure result.");
    }
    assert.strictEqual(result.errors.before.length, 1);
    assert.strictEqual(result.errors.after.length, 0);
    assert.deepStrictEqual(observations.comparedInputs, []);
    assert.deepStrictEqual(observations.renderedChangeSets, []);
  });
});
