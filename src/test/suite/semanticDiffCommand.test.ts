import * as assert from "assert";
import * as vscode from "vscode";
import type { BuildSemanticDiffReportInput } from "../../application/semantic-diff/buildSemanticDiffReport";
import {
  COMPARE_SEMANTIC_DIFF_COMMAND,
  executeCompareSemanticDiffCommand,
  type SemanticDiffCommandDeps,
} from "../../presentation/vscode/commands/semanticDiffCommand";

type SemanticDiffCommandObservations = {
  openDialogCount: number;
  saveDialogCount: number;
  readFiles: vscode.Uri[];
  writtenFiles: Array<{ uri: vscode.Uri; content: string }>;
  clipboardWrites: string[];
  informationMessages: Array<{ message: string; items: string[] }>;
  errorMessages: string[];
  reportInputs: BuildSemanticDiffReportInput[];
};

class SemanticDiffCommandHarness {
  readonly observed: SemanticDiffCommandObservations = {
    openDialogCount: 0,
    saveDialogCount: 0,
    readFiles: [],
    writtenFiles: [],
    clipboardWrites: [],
    informationMessages: [],
    errorMessages: [],
    reportInputs: [],
  };

  readonly beforeUri = vscode.Uri.parse("untitled:before.ajs");
  readonly saveUri = vscode.Uri.parse("untitled:semantic-diff.md");
  readonly deps: SemanticDiffCommandDeps;

  private readonly encoder = new TextEncoder();
  private readonly decoder = new TextDecoder("utf-8");
  private readonly beforeContent: string;
  private readonly afterContent: string;
  private readonly informationResponses: Array<string | undefined>;

  constructor(
    overrides: Partial<SemanticDiffCommandDeps> & {
      beforeContent?: string;
      afterContent?: string;
      informationResponses?: Array<string | undefined>;
      openDialogResult?: vscode.Uri[];
      saveDialogResult?: vscode.Uri;
    } = {},
  ) {
    this.beforeContent = overrides.beforeContent ?? "unit=before,,jp1admin,;";
    this.afterContent = overrides.afterContent ?? "unit=after,,jp1admin,;";
    this.informationResponses = [...(overrides.informationResponses ?? [])];
    const openDialogResult = overrides.openDialogResult ?? [this.beforeUri];
    const saveDialogResult = overrides.saveDialogResult ?? this.saveUri;

    this.deps = {
      getActiveEditor: () =>
        ({
          document: { getText: () => this.afterContent },
        }) as vscode.TextEditor,
      showOpenDialog: async () => {
        this.observed.openDialogCount += 1;
        return openDialogResult;
      },
      showSaveDialog: async () => {
        this.observed.saveDialogCount += 1;
        return saveDialogResult;
      },
      showInformationMessage: async (message, ...items) => {
        this.observed.informationMessages.push({ message, items });
        return this.informationResponses.shift();
      },
      showErrorMessage: async (message) => {
        this.observed.errorMessages.push(message);
        return undefined;
      },
      readFile: async (uri) => {
        this.observed.readFiles.push(uri);
        return this.encoder.encode(this.beforeContent);
      },
      writeFile: async (uri, content) => {
        this.observed.writtenFiles.push({
          uri,
          content: this.decoder.decode(content),
        });
      },
      writeClipboard: async (text) => {
        this.observed.clipboardWrites.push(text);
      },
      buildSemanticDiffReport: (input) => this.buildSemanticDiffReport(input),
      ...overrides,
    };
  }

  private buildSemanticDiffReport(input: BuildSemanticDiffReportInput) {
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
          report: "rendered semantic diff",
        };
  }
}

suite("Semantic diff command", () => {
  test("uses the contributed command id", () => {
    assert.strictEqual(
      COMPARE_SEMANTIC_DIFF_COMMAND,
      "ajsbutler.compareSemanticDiff",
    );
  });

  test("reads selected before definition and copies generated report", async () => {
    const harness = new SemanticDiffCommandHarness();

    const result = await executeCompareSemanticDiffCommand(harness.deps);

    assert.strictEqual(result.ok, true);
    assert.deepStrictEqual(harness.observed.readFiles, [harness.beforeUri]);
    assert.deepStrictEqual(harness.observed.reportInputs, [
      {
        beforeContent: "unit=before,,jp1admin,;",
        afterContent: "unit=after,,jp1admin,;",
      },
    ]);
    assert.deepStrictEqual(harness.observed.clipboardWrites, [
      "rendered semantic diff",
    ]);
    assert.deepStrictEqual(harness.observed.informationMessages, [
      {
        message: "Semantic diff report copied to clipboard.",
        items: ["Save"],
      },
    ]);
    assert.deepStrictEqual(harness.observed.writtenFiles, []);
  });

  test("saves copied report when requested", async () => {
    const harness = new SemanticDiffCommandHarness({
      informationResponses: ["Save"],
    });

    const result = await executeCompareSemanticDiffCommand(harness.deps);

    assert.strictEqual(result.ok, true);
    assert.deepStrictEqual(harness.observed.writtenFiles, [
      { uri: harness.saveUri, content: "rendered semantic diff" },
    ]);
    assert.deepStrictEqual(
      harness.observed.informationMessages.map(({ message }) => message),
      [
        "Semantic diff report copied to clipboard.",
        "Semantic diff report saved.",
      ],
    );
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
