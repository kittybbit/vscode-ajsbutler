import * as assert from "assert";
import * as vscode from "vscode";
import {
  SEMANTIC_DIFF_REPORT_SCHEME,
  SemanticDiffReportDocumentProvider,
  type SemanticDiffReportDocumentDeps,
} from "../../presentation/vscode/semantic-diff/semanticDiffReportDocument";
import type { SemanticDiffOutputDocument } from "../../presentation/semantic-diff/semanticDiffOutput";

type ReportDocumentObservations = {
  openedDocuments: vscode.Uri[];
  shownDocuments: vscode.Uri[];
  clipboardWrites: string[];
  informationMessages: string[];
  errorMessages: string[];
  saveDialogOptions: vscode.SaveDialogOptions[];
  savedUris: vscode.Uri[];
  savedContents: string[];
};

class SemanticDiffReportDocumentHarness {
  readonly observed: ReportDocumentObservations = {
    openedDocuments: [],
    shownDocuments: [],
    clipboardWrites: [],
    informationMessages: [],
    errorMessages: [],
    saveDialogOptions: [],
    savedUris: [],
    savedContents: [],
  };

  activeUri: vscode.Uri | undefined;
  readonly provider: SemanticDiffReportDocumentProvider;

  constructor(
    overrides: Partial<SemanticDiffReportDocumentDeps> = {},
    limit = 32,
  ) {
    this.provider = new SemanticDiffReportDocumentProvider(
      {
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
        showSaveDialog: async (options) => {
          this.observed.saveDialogOptions.push(options);
          return vscode.Uri.parse("file:///tmp/semantic-diff-output");
        },
        writeFile: async (uri, content) => {
          this.observed.savedUris.push(uri);
          this.observed.savedContents.push(new TextDecoder().decode(content));
        },
        ...overrides,
      },
      limit,
    );
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

  test("keeps JSON separate from Markdown copy and preserves metadata", async () => {
    const harness = new SemanticDiffReportDocumentHarness();

    const uri = await harness.provider.openReport(
      output("json", '{"ok":true}'),
    );

    assert.strictEqual(uri.path, "/semantic-diff-1.json");
    assert.strictEqual(
      harness.provider.provideTextDocumentContent(uri),
      '{"ok":true}',
    );
    assert.strictEqual(await harness.provider.copyReport(uri), false);
    assert.deepStrictEqual(harness.observed.clipboardWrites, []);
  });

  test("saves the selected output with its suggested file name", async () => {
    const harness = new SemanticDiffReportDocumentHarness();

    const uri = await harness.provider.openReport(
      output("audit", "audit content"),
    );
    const saved = await harness.provider.saveReport(uri);

    assert.strictEqual(saved, true);
    assert.strictEqual(
      harness.observed.saveDialogOptions[0]?.defaultUri?.path,
      "/semantic-diff-audit.md",
    );
    assert.deepStrictEqual(harness.observed.savedContents, ["audit content"]);
  });

  test("treats save cancellation as a no-op", async () => {
    const harness = new SemanticDiffReportDocumentHarness({
      showSaveDialog: async () => undefined,
    });
    const uri = await harness.provider.openReport(output("summary"));

    assert.strictEqual(await harness.provider.saveReport(uri), false);
    assert.deepStrictEqual(harness.observed.errorMessages, []);
    assert.deepStrictEqual(harness.observed.savedContents, []);
  });

  test("evicts only the least recently used inactive report at the limit", async () => {
    const harness = new SemanticDiffReportDocumentHarness({}, 2);
    const first = await harness.provider.openReport(output("full", "first"));
    const second = await harness.provider.openReport(output("full", "second"));
    await harness.provider.provideTextDocumentContent(first);
    const third = await harness.provider.openReport(output("full", "third"));

    assert.strictEqual(
      harness.provider.provideTextDocumentContent(first),
      "first",
    );
    assert.strictEqual(harness.provider.provideTextDocumentContent(second), "");
    assert.strictEqual(
      harness.provider.provideTextDocumentContent(third),
      "third",
    );
  });

  test("uses an injected cache limit and does not evict on failed open", async () => {
    let failNext = false;
    const harness = new SemanticDiffReportDocumentHarness({
      openTextDocument: async (uri) => {
        if (failNext) {
          failNext = false;
          throw new Error("open failed");
        }
        return { uri } as vscode.TextDocument;
      },
    });
    const first = await harness.provider.openReport(output("full", "first"));
    failNext = true;
    await assert.rejects(() =>
      harness.provider.openReport(output("full", "failed")),
    );

    assert.strictEqual(
      harness.provider.provideTextDocumentContent(first),
      "first",
    );
  });

  test("rolls back when showing the document fails", async () => {
    const harness = new SemanticDiffReportDocumentHarness({
      showTextDocument: async () => {
        throw new Error("show failed");
      },
    });

    await assert.rejects(() =>
      harness.provider.openReport(output("full", "not committed")),
    );
    const failedUri = harness.observed.openedDocuments[0]!;

    assert.strictEqual(
      harness.provider.provideTextDocumentContent(failedUri),
      "",
    );
  });

  test("retains open content when save host operations fail", async () => {
    const harness = new SemanticDiffReportDocumentHarness({
      showSaveDialog: async () => {
        throw new Error("save dialog failed");
      },
    });
    const uri = await harness.provider.openReport(
      output("json", "json content"),
    );

    assert.strictEqual(await harness.provider.saveReport(uri), false);
    assert.strictEqual(
      harness.provider.provideTextDocumentContent(uri),
      "json content",
    );

    const writeFailure = new SemanticDiffReportDocumentHarness({
      writeFile: async () => {
        throw new Error("write failed");
      },
    });
    const writeUri = await writeFailure.provider.openReport(
      output("summary", "summary content"),
    );
    assert.strictEqual(await writeFailure.provider.saveReport(writeUri), false);
    assert.strictEqual(
      writeFailure.provider.provideTextDocumentContent(writeUri),
      "summary content",
    );
  });

  test("enforces the default thirty-two document cache at commit time", async () => {
    const harness = new SemanticDiffReportDocumentHarness();
    const uris: vscode.Uri[] = [];
    for (let index = 0; index < 33; index += 1) {
      uris.push(
        await harness.provider.openReport(output("full", `report-${index}`)),
      );
    }

    assert.strictEqual(
      harness.provider.provideTextDocumentContent(uris[0]),
      "",
    );
    assert.strictEqual(
      harness.provider.provideTextDocumentContent(uris[1]),
      "report-1",
    );
    assert.strictEqual(
      harness.provider.provideTextDocumentContent(uris[32]),
      "report-32",
    );
  });

  test("enforces explicit cache limits at 31, 32, and 33", async () => {
    for (const limit of [31, 32, 33]) {
      const harness = new SemanticDiffReportDocumentHarness({}, limit);
      const uris: vscode.Uri[] = [];
      for (let index = 0; index < limit; index += 1) {
        uris.push(
          await harness.provider.openReport(output("full", `report-${index}`)),
        );
      }

      const overflow = await harness.provider.openReport(
        output("full", "overflow"),
      );
      assert.strictEqual(
        harness.provider.provideTextDocumentContent(uris[0]),
        "",
      );
      assert.strictEqual(
        harness.provider.provideTextDocumentContent(uris[1]),
        "report-1",
      );
      assert.strictEqual(
        harness.provider.provideTextDocumentContent(overflow),
        "overflow",
      );
    }
  });

  test("breaks equal-recency eviction ties by creation sequence", async () => {
    const harness = new SemanticDiffReportDocumentHarness({}, 2);
    const first = await harness.provider.openReport(output("full", "first"));
    const second = await harness.provider.openReport(output("full", "second"));
    const internals = harness.provider as unknown as {
      reports: Map<
        string,
        { lastAccessSequence: number; creationSequence: number }
      >;
    };
    const firstEntry = internals.reports.get(first.toString());
    const secondEntry = internals.reports.get(second.toString());
    assert.ok(firstEntry);
    assert.ok(secondEntry);
    secondEntry.lastAccessSequence = firstEntry.lastAccessSequence;

    const third = await harness.provider.openReport(output("full", "third"));

    assert.strictEqual(harness.provider.provideTextDocumentContent(first), "");
    assert.strictEqual(
      harness.provider.provideTextDocumentContent(second),
      "second",
    );
    assert.strictEqual(
      harness.provider.provideTextDocumentContent(third),
      "third",
    );
  });

  test("serializes two concurrent successful opens by creation order", async () => {
    const resolvers: Array<(document: vscode.TextDocument) => void> = [];
    const harness = new SemanticDiffReportDocumentHarness(
      {
        openTextDocument: (uri) =>
          new Promise<vscode.TextDocument>((resolve) => {
            harness.observed.openedDocuments.push(uri);
            resolvers.push(resolve);
          }),
      },
      1,
    );
    const firstPromise = harness.provider.openReport(output("full", "first"));
    const secondPromise = harness.provider.openReport(output("full", "second"));

    assert.strictEqual(resolvers.length, 2);
    resolvers[1]!({
      uri: harness.observed.openedDocuments[1],
    } as vscode.TextDocument);
    await Promise.resolve();
    resolvers[0]!({
      uri: harness.observed.openedDocuments[0],
    } as vscode.TextDocument);
    const [first, second] = await Promise.all([firstPromise, secondPromise]);

    assert.notStrictEqual(first.toString(), second.toString());
    assert.strictEqual(harness.provider.provideTextDocumentContent(first), "");
    assert.strictEqual(
      harness.provider.provideTextDocumentContent(second),
      "second",
    );
  });

  test("rolls back only the failed concurrent open and commits the other URI", async () => {
    let openCount = 0;
    const resolvers: Array<(document: vscode.TextDocument) => void> = [];
    const harness = new SemanticDiffReportDocumentHarness({
      openTextDocument: (uri) =>
        new Promise<vscode.TextDocument>((resolve, reject) => {
          openCount += 1;
          if (openCount === 2) {
            reject(new Error("second open failed"));
            return;
          }
          harness.observed.openedDocuments.push(uri);
          resolvers.push(resolve);
        }),
    });
    const firstPromise = harness.provider.openReport(output("full", "first"));
    const secondPromise = harness.provider.openReport(output("full", "second"));
    await assert.rejects(secondPromise);
    resolvers[0]!({
      uri: harness.observed.openedDocuments[0],
    } as vscode.TextDocument);
    const first = await firstPromise;

    assert.strictEqual(
      harness.provider.provideTextDocumentContent(first),
      "first",
    );
    assert.strictEqual(harness.observed.openedDocuments.length, 1);
  });

  test("does not show a stale document when disposed during openTextDocument", async () => {
    let resolveOpen!: (document: vscode.TextDocument) => void;
    let showCount = 0;
    const harness = new SemanticDiffReportDocumentHarness({
      openTextDocument: (uri) =>
        new Promise<vscode.TextDocument>((resolve) => {
          harness.observed.openedDocuments.push(uri);
          resolveOpen = resolve;
        }),
      showTextDocument: async () => {
        showCount += 1;
        throw new Error("stale show");
      },
    });
    const opening = harness.provider.openReport(output("full", "late"));
    await Promise.resolve();
    const uri = harness.observed.openedDocuments[0]!;

    harness.provider.dispose();
    resolveOpen({ uri } as vscode.TextDocument);

    await assert.rejects(opening);
    assert.strictEqual(showCount, 0);
    assert.strictEqual(harness.provider.provideTextDocumentContent(uri), "");
  });

  test("disposal invalidates in-flight completion and is idempotent", async () => {
    let resolveShow!: (editor: vscode.TextEditor) => void;
    const harness = new SemanticDiffReportDocumentHarness({
      showTextDocument: async () =>
        new Promise<vscode.TextEditor>((resolve) => {
          resolveShow = resolve;
        }),
    });
    const opening = harness.provider.openReport(output("full", "late"));
    await Promise.resolve();
    const uri = harness.observed.openedDocuments[0]!;
    harness.provider.dispose();
    harness.provider.dispose();
    resolveShow({ document: { uri } } as vscode.TextEditor);

    await assert.rejects(opening);
    assert.strictEqual(harness.provider.provideTextDocumentContent(uri), "");
    assert.strictEqual(await harness.provider.copyReport(uri), false);
    assert.strictEqual(await harness.provider.saveReport(uri), false);
  });
});

const output = (
  mode: SemanticDiffOutputDocument["mode"],
  content = `${mode} report`,
): SemanticDiffOutputDocument => ({
  mode,
  languageId: mode === "json" ? "json" : "markdown",
  extension: mode === "json" ? ".json" : ".md",
  mediaType:
    mode === "json"
      ? "application/json; charset=utf-8"
      : "text/markdown; charset=utf-8",
  content,
});
