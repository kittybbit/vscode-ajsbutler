import * as assert from "assert";
import * as vscode from "vscode";
import {
  SEMANTIC_DIFF_REPORT_SCHEME,
  SemanticDiffReportDocumentProvider,
  type SemanticDiffReportDocumentDeps,
} from "../../presentation/vscode/semantic-diff/semanticDiffReportDocument";

type ReportDocumentObservations = {
  openedDocuments: vscode.Uri[];
  shownDocuments: vscode.Uri[];
  clipboardWrites: string[];
  informationMessages: string[];
  errorMessages: string[];
};

class SemanticDiffReportDocumentHarness {
  readonly observed: ReportDocumentObservations = {
    openedDocuments: [],
    shownDocuments: [],
    clipboardWrites: [],
    informationMessages: [],
    errorMessages: [],
  };

  activeUri: vscode.Uri | undefined;
  readonly provider: SemanticDiffReportDocumentProvider;

  constructor(overrides: Partial<SemanticDiffReportDocumentDeps> = {}) {
    this.provider = new SemanticDiffReportDocumentProvider({
      openTextDocument: async (uri) => {
        this.observed.openedDocuments.push(uri);
        return { uri } as vscode.TextDocument;
      },
      showTextDocument: async (document) => {
        this.observed.shownDocuments.push(document.uri);
        this.activeUri = document.uri;
        return {
          document,
        } as vscode.TextEditor;
      },
      getActiveEditor: () =>
        this.activeUri
          ? ({
              document: { uri: this.activeUri },
            } as vscode.TextEditor)
          : undefined,
      writeClipboard: async (text) => {
        this.observed.clipboardWrites.push(text);
      },
      showInformationMessage: async (message) => {
        this.observed.informationMessages.push(message);
        return undefined;
      },
      showErrorMessage: async (message) => {
        this.observed.errorMessages.push(message);
        return undefined;
      },
      createUri: (components) => vscode.Uri.from(components),
      ...overrides,
    });
  }
}

suite("Semantic diff report document", () => {
  test("opens report as a semantic diff Markdown document", async () => {
    const harness = new SemanticDiffReportDocumentHarness();

    await harness.provider.openReport("# Semantic Diff");

    assert.strictEqual(harness.observed.openedDocuments.length, 1);
    const [uri] = harness.observed.openedDocuments;
    assert.strictEqual(uri.scheme, SEMANTIC_DIFF_REPORT_SCHEME);
    assert.strictEqual(uri.path, "/semantic-diff-1.md");
    assert.deepStrictEqual(harness.observed.shownDocuments, [uri]);
    assert.strictEqual(
      harness.provider.provideTextDocumentContent(uri),
      "# Semantic Diff",
    );
  });

  test("copies the displayed report Markdown from active report editor", async () => {
    const harness = new SemanticDiffReportDocumentHarness();

    await harness.provider.openReport("# Semantic Diff");
    const copied = await harness.provider.copyReport();

    assert.strictEqual(copied, true);
    assert.deepStrictEqual(harness.observed.clipboardWrites, [
      "# Semantic Diff",
    ]);
    assert.deepStrictEqual(harness.observed.informationMessages, [
      "Semantic diff Markdown copied to clipboard.",
    ]);
  });

  test("copies an explicit report URI instead of a stale active editor", async () => {
    const harness = new SemanticDiffReportDocumentHarness();

    await harness.provider.openReport("first report");
    await harness.provider.openReport("second report");
    const firstReportUri = harness.observed.openedDocuments[0];
    const copied = await harness.provider.copyReport(firstReportUri);

    assert.strictEqual(copied, true);
    assert.deepStrictEqual(harness.observed.clipboardWrites, ["first report"]);
  });

  test("copies an empty displayed report as exact Markdown content", async () => {
    const harness = new SemanticDiffReportDocumentHarness();

    await harness.provider.openReport("");
    const copied = await harness.provider.copyReport();

    assert.strictEqual(copied, true);
    assert.deepStrictEqual(harness.observed.clipboardWrites, [""]);
  });

  test("reports copy failure without losing displayed report", async () => {
    const harness = new SemanticDiffReportDocumentHarness({
      writeClipboard: async () => {
        throw new Error("copy failed");
      },
    });

    await harness.provider.openReport("# Semantic Diff");
    const copied = await harness.provider.copyReport();
    const reportUri = harness.observed.openedDocuments[0];

    assert.strictEqual(copied, false);
    assert.strictEqual(
      harness.provider.provideTextDocumentContent(reportUri),
      "# Semantic Diff",
    );
    assert.deepStrictEqual(harness.observed.errorMessages, [
      "Semantic diff Markdown could not be copied.",
    ]);
  });

  test("shows an error when no semantic diff report is active", async () => {
    const harness = new SemanticDiffReportDocumentHarness();
    harness.activeUri = vscode.Uri.parse("untitled:not-a-report.md");

    const copied = await harness.provider.copyReport();

    assert.strictEqual(copied, false);
    assert.deepStrictEqual(harness.observed.clipboardWrites, []);
    assert.deepStrictEqual(harness.observed.errorMessages, [
      "Open a semantic diff report before copying Markdown.",
    ]);
  });
});
