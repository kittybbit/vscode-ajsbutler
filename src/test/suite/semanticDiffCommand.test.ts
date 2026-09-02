import * as assert from "assert";
import * as vscode from "vscode";
import type { BuildSemanticDiffReportDataInput } from "../../application/semantic-diff/buildSemanticDiffReportData";
import type { SemanticDiffResult } from "../../application/semantic-diff/semanticDiffDto";
import {
  COMPARE_SEMANTIC_DIFF_COMMAND,
  executeCompareSemanticDiffCommand,
  type SemanticDiffCommandDeps,
} from "../../presentation/vscode/commands/semanticDiffCommand";

type SemanticDiffCommandObservations = {
  openDialogCount: number;
  readFiles: vscode.Uri[];
  openedReports: string[];
  clipboardWrites: string[];
  errorMessages: string[];
  reportInputs: BuildSemanticDiffReportDataInput[];
  renderedResults: SemanticDiffResult[];
  renderedLanguages: (string | undefined)[];
  reportSteps: string[];
};

const emptyResult = (): SemanticDiffResult => ({
  inputs: {
    before: { side: "before", unitIds: [], relations: [] },
    after: { side: "after", unitIds: [], relations: [] },
  },
  changes: [],
  identityDecisions: [],
  confirmationRequired: [],
  unsupportedItems: [],
  limitations: [],
});

class SemanticDiffCommandHarness {
  readonly observed: SemanticDiffCommandObservations = {
    openDialogCount: 0,
    readFiles: [],
    openedReports: [],
    clipboardWrites: [],
    errorMessages: [],
    reportInputs: [],
    renderedResults: [],
    renderedLanguages: [],
    reportSteps: [],
  };

  readonly beforeUri = vscode.Uri.parse("untitled:before.ajs");
  readonly deps: SemanticDiffCommandDeps;

  private readonly encoder = new TextEncoder();
  private readonly beforeContent: string;
  private readonly afterContent: string;

  constructor(
    overrides: Partial<SemanticDiffCommandDeps> & {
      beforeContent?: string;
      afterContent?: string;
      openDialogResult?: vscode.Uri[];
    } = {},
  ) {
    this.beforeContent = overrides.beforeContent ?? "unit=before,,jp1admin,;";
    this.afterContent = overrides.afterContent ?? "unit=after,,jp1admin,;";
    const openDialogResult = overrides.openDialogResult ?? [this.beforeUri];

    this.deps = {
      getActiveEditor: () =>
        ({
          document: { getText: () => this.afterContent },
        }) as unknown as vscode.TextEditor,
      showOpenDialog: async () => {
        this.observed.openDialogCount += 1;
        return openDialogResult;
      },
      showErrorMessage: async (message) => {
        this.observed.errorMessages.push(message);
        return undefined;
      },
      readFile: async (uri) => {
        this.observed.readFiles.push(uri);
        return this.encoder.encode(this.beforeContent);
      },
      openReport: async (report) => {
        this.observed.reportSteps.push("display");
        this.observed.openedReports.push(report);
      },
      buildSemanticDiffReportData: (input) =>
        this.buildSemanticDiffReportData(input),
      renderSemanticDiffMarkdown: (result, language) =>
        this.renderSemanticDiffMarkdown(result, language),
      ...overrides,
    };
  }

  private buildSemanticDiffReportData(input: BuildSemanticDiffReportDataInput) {
    this.observed.reportSteps.push("build-data");
    this.observed.reportInputs.push(input);
    return input.beforeContent.includes("parse-error") ||
      input.afterContent.includes("parse-error")
      ? {
          ok: false as const,
          errors: {
            before: [],
            after: [],
          },
        }
      : {
          ok: true as const,
          result: emptyResult(),
        };
  }

  private renderSemanticDiffMarkdown(
    result: SemanticDiffResult,
    language?: string,
  ): string {
    this.observed.reportSteps.push("render");
    this.observed.renderedResults.push(result);
    this.observed.renderedLanguages.push(language);
    return "rendered semantic diff";
  }
}

suite("Semantic diff command", () => {
  test("uses the contributed command id", () => {
    assert.strictEqual(
      COMPARE_SEMANTIC_DIFF_COMMAND,
      "ajsbutler.compareSemanticDiff",
    );
  });

  test("reads selected before definition and opens generated report", async () => {
    const harness = new SemanticDiffCommandHarness();

    const result = await executeCompareSemanticDiffCommand(harness.deps);

    assert.strictEqual(result.ok, true);
    assert.deepStrictEqual(result, {
      ok: true,
      report: "rendered semantic diff",
      action: "displayed",
    });
    assert.deepStrictEqual(harness.observed.readFiles, [harness.beforeUri]);
    assert.deepStrictEqual(harness.observed.reportInputs, [
      {
        beforeContent: "unit=before,,jp1admin,;",
        afterContent: "unit=after,,jp1admin,;",
      },
    ]);
    assert.deepStrictEqual(harness.observed.openedReports, [
      "rendered semantic diff",
    ]);
    assert.deepStrictEqual(harness.observed.reportSteps, [
      "build-data",
      "render",
      "display",
    ]);
    assert.deepStrictEqual(harness.observed.clipboardWrites, []);
  });

  test("passes the VS Code display language only to presentation rendering", async () => {
    const harness = new SemanticDiffCommandHarness({ language: "ja-JP" });

    await executeCompareSemanticDiffCommand(harness.deps);

    assert.deepStrictEqual(harness.observed.reportInputs, [
      {
        beforeContent: "unit=before,,jp1admin,;",
        afterContent: "unit=after,,jp1admin,;",
      },
    ]);
    assert.deepStrictEqual(harness.observed.renderedLanguages, ["ja-JP"]);
  });

  test("reports display failure without writing clipboard", async () => {
    const harness = new SemanticDiffCommandHarness({
      openReport: async () => {
        throw new Error("display failed");
      },
    });

    const result = await executeCompareSemanticDiffCommand(harness.deps);

    assert.strictEqual(result.ok, false);
    if (result.ok) {
      throw new Error("Expected display failure.");
    }
    assert.strictEqual(result.error.code, "display-failed");
    assert.deepStrictEqual(harness.observed.clipboardWrites, []);
    assert.deepStrictEqual(harness.observed.errorMessages, [
      "Semantic diff report could not be displayed.",
    ]);
  });

  test("maps before-definition picker failure to a host-safe result", async () => {
    const harness = new SemanticDiffCommandHarness({
      showOpenDialog: async () => {
        throw new Error("picker failed");
      },
    });

    const result = await executeCompareSemanticDiffCommand(harness.deps);

    assert.strictEqual(result.ok, false);
    if (result.ok) {
      throw new Error("Expected read failure.");
    }
    assert.strictEqual(result.error.code, "read-failed");
    assert.deepStrictEqual(harness.observed.errorMessages, [
      "Selected before definition could not be read.",
    ]);
  });

  test("maps before-definition file read failure to a host-safe result", async () => {
    const harness = new SemanticDiffCommandHarness({
      readFile: async () => {
        throw new Error("file read failed");
      },
    });

    const result = await executeCompareSemanticDiffCommand(harness.deps);

    assert.strictEqual(result.ok, false);
    if (result.ok) {
      throw new Error("Expected read failure.");
    }
    assert.strictEqual(result.error.code, "read-failed");
    assert.deepStrictEqual(harness.observed.errorMessages, [
      "Selected before definition could not be read.",
    ]);
  });

  test("distinguishes active-editor access failure from no active editor", async () => {
    const harness = new SemanticDiffCommandHarness({
      getActiveEditor: () => {
        throw new Error("editor access failed");
      },
    });

    const result = await executeCompareSemanticDiffCommand(harness.deps);

    assert.strictEqual(result.ok, false);
    if (result.ok) {
      throw new Error("Expected active-editor failure.");
    }
    assert.strictEqual(result.error.code, "active-editor-failed");
    assert.deepStrictEqual(harness.observed.errorMessages, [
      "The active JP1/AJS definition could not be accessed.",
    ]);
    assert.strictEqual(harness.observed.openDialogCount, 0);
  });

  test("maps active-definition read failure without exposing the host error", async () => {
    const harness = new SemanticDiffCommandHarness({
      getActiveEditor: () =>
        ({
          document: {
            getText: () => {
              throw new Error("secret host failure");
            },
          },
        }) as unknown as vscode.TextEditor,
    });

    const result = await executeCompareSemanticDiffCommand(harness.deps);

    assert.strictEqual(result.ok, false);
    if (result.ok) {
      throw new Error("Expected active-definition read failure.");
    }
    assert.strictEqual(result.error.code, "read-failed");
    assert.deepStrictEqual(harness.observed.errorMessages, [
      "Active JP1/AJS definition could not be read.",
    ]);
    assert.ok(
      harness.observed.errorMessages.every(
        (message) => !message.includes("secret host failure"),
      ),
    );
  });

  test("maps unexpected application failures to the existing parse error", async () => {
    const harness = new SemanticDiffCommandHarness({
      buildSemanticDiffReportData: () => {
        throw new Error("parser internals");
      },
    });

    const result = await executeCompareSemanticDiffCommand(harness.deps);

    assert.strictEqual(result.ok, false);
    if (result.ok) {
      throw new Error("Expected parse failure.");
    }
    assert.strictEqual(result.error.code, "parse-failed");
    assert.deepStrictEqual(harness.observed.errorMessages, [
      "Semantic diff could not parse one or both JP1/AJS definitions.",
    ]);
  });

  test("maps report rendering failure without leaving a report to display", async () => {
    const harness = new SemanticDiffCommandHarness({
      renderSemanticDiffMarkdown: () => {
        throw new Error("render internals");
      },
    });

    const result = await executeCompareSemanticDiffCommand(harness.deps);

    assert.strictEqual(result.ok, false);
    if (result.ok) {
      throw new Error("Expected render failure.");
    }
    assert.strictEqual(result.error.code, "render-failed");
    assert.deepStrictEqual(harness.observed.errorMessages, [
      "Semantic diff report could not be rendered.",
    ]);
    assert.deepStrictEqual(harness.observed.openedReports, []);
  });

  test("keeps the command result when error notification itself fails", async () => {
    const harness = new SemanticDiffCommandHarness({
      showErrorMessage: async () => {
        throw new Error("notification failed");
      },
      openReport: async () => {
        throw new Error("display failed");
      },
    });

    const result = await executeCompareSemanticDiffCommand(harness.deps);

    assert.strictEqual(result.ok, false);
    if (result.ok) {
      throw new Error("Expected display failure.");
    }
    assert.strictEqual(result.error.code, "display-failed");
  });

  test("returns cancelled when the before definition picker is cancelled", async () => {
    const harness = new SemanticDiffCommandHarness({
      openDialogResult: [],
    });

    const result = await executeCompareSemanticDiffCommand(harness.deps);

    assert.strictEqual(result.ok, false);
    if (result.ok) {
      throw new Error("Expected cancelled result.");
    }
    assert.strictEqual(result.error.code, "cancelled");
    assert.deepStrictEqual(harness.observed.reportInputs, []);
  });

  test("reports parse failure without exposing definition contents", async () => {
    const harness = new SemanticDiffCommandHarness({
      beforeContent: "parse-error secret-content",
    });

    const result = await executeCompareSemanticDiffCommand(harness.deps);

    assert.strictEqual(result.ok, false);
    if (result.ok) {
      throw new Error("Expected parse failure.");
    }
    assert.strictEqual(result.error.code, "parse-failed");
    assert.deepStrictEqual(harness.observed.errorMessages, [
      "Semantic diff could not parse one or both JP1/AJS definitions.",
    ]);
    assert.ok(!harness.observed.errorMessages[0].includes("secret-content"));
    assert.deepStrictEqual(harness.observed.renderedResults, []);
    assert.deepStrictEqual(harness.observed.clipboardWrites, []);
  });

  test("reports missing active editor before opening before file picker", async () => {
    const harness = new SemanticDiffCommandHarness({
      getActiveEditor: () => undefined,
    });

    const result = await executeCompareSemanticDiffCommand(harness.deps);

    assert.strictEqual(result.ok, false);
    if (result.ok) {
      throw new Error("Expected no active editor result.");
    }
    assert.strictEqual(result.error.code, "no-active-editor");
    assert.strictEqual(harness.observed.openDialogCount, 0);
    assert.deepStrictEqual(harness.observed.errorMessages, [
      "Open a JP1/AJS definition before running semantic diff.",
    ]);
  });
});
