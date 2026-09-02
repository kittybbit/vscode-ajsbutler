import * as assert from "assert";
import type { AjsParserPort } from "../../application/parsing/AjsParserPort";
import {
  createBuildSemanticDiffReportData,
  type BuildSemanticDiffReportDataInput,
} from "../../application/semantic-diff/buildSemanticDiffReportData";
import type { CompareSemanticDiffInput } from "../../application/semantic-diff/compareSemanticDiff";
import type { SemanticDiffChangeSet } from "../../application/semantic-diff/semanticDiffDto";
import type { AjsDocument } from "../../domain/models/ajs/AjsDocument";

type BuildSemanticDiffReportDataObservations = {
  parsedContents: string[];
  comparedInputs: CompareSemanticDiffInput[];
};

const createParser = (
  observations: BuildSemanticDiffReportDataObservations,
): AjsParserPort => ({
  parse: (content) => {
    observations.parsedContents.push(content);
    return content.includes("parse-error")
      ? {
          ok: false,
          errors: [
            {
              line: 1,
              column: 1,
              message: "synthetic parse error",
            },
          ],
        }
      : {
          ok: true,
          document: {
            rootUnits: [],
            warnings: [],
          } satisfies AjsDocument,
        };
  },
});

const createCompare =
  (observations: BuildSemanticDiffReportDataObservations) =>
  (input: CompareSemanticDiffInput): SemanticDiffChangeSet => {
    observations.comparedInputs.push(input);
    return {
      inputs: {
        before: { side: "before", unitIds: [], relations: [] },
        after: { side: "after", unitIds: [], relations: [] },
      },
      changes: [],
      identityDecisions: [],
      confirmationRequired: [],
      unsupportedItems: [],
      limitations: [],
      reportSections: [],
    };
  };

const createHarness = () => {
  const observations: BuildSemanticDiffReportDataObservations = {
    parsedContents: [],
    comparedInputs: [],
  };
  const build = createBuildSemanticDiffReportData(
    createParser(observations),
    createCompare(observations),
  );
  return { observations, build };
};

suite("Build Semantic Diff Report Data", () => {
  test("parses both definitions and returns the compared application DTO", () => {
    const { observations, build } = createHarness();
    const input: BuildSemanticDiffReportDataInput = {
      beforeContent: "unit=before,,jp1admin,;",
      afterContent: "unit=after,,jp1admin,;",
    };

    const result = build(input);

    assert.deepStrictEqual(observations.parsedContents, [
      "unit=before,,jp1admin,;",
      "unit=after,,jp1admin,;",
    ]);
    assert.strictEqual(observations.comparedInputs.length, 1);
    assert.deepStrictEqual(result, {
      ok: true,
      changeSet: {
        inputs: {
          before: { side: "before", unitIds: [], relations: [] },
          after: { side: "after", unitIds: [], relations: [] },
        },
        changes: [],
        identityDecisions: [],
        confirmationRequired: [],
        unsupportedItems: [],
        limitations: [],
        reportSections: [],
      },
    });
  });

  test("returns host-neutral parse errors without comparing", () => {
    const { observations, build } = createHarness();

    const result = build({
      beforeContent: "parse-error",
      afterContent: "unit=after,,jp1admin,;",
    });

    assert.strictEqual(result.ok, false);
    if (result.ok) {
      throw new Error("Expected parse failure result.");
    }
    assert.deepStrictEqual(result.errors.before, [
      {
        line: 1,
        column: 1,
        message: "synthetic parse error",
      },
    ]);
    assert.strictEqual(result.errors.after.length, 0);
    assert.deepStrictEqual(observations.comparedInputs, []);
  });
});
