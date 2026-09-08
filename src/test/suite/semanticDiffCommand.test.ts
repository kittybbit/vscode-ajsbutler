import * as assert from "assert";
import * as vscode from "vscode";
import { createBuildSemanticDiffReportData } from "../../application/semantic-diff/buildSemanticDiffReportData";
import type { BuildSemanticDiffReportDataInput } from "../../application/semantic-diff/buildSemanticDiffReportData";
import {
  createSemanticDiffSourceIndexIdAllocator,
  type AjsParserWithSourceIndexPort,
} from "../../application/parsing/AjsParserWithSourceIndexPort";
import { createBeginSemanticDiffSourceCapture } from "../../application/semantic-diff/semanticDiffSourceCapture";
import type {
  SemanticDiffOutputContext,
  SemanticDiffResult,
} from "../../application/semantic-diff/semanticDiffDto";
import type { SemanticDiffOutputDocument } from "../../presentation/semantic-diff/semanticDiffOutput";
import { SemanticDiffExplorerContextRegistry } from "../../presentation/vscode/semantic-diff/semanticDiffExplorerRegistry";
import { AntlrAjsParser } from "../../infrastructure/parser/AntlrAjsParser";
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
  selectedModes: string[];
  presentedContexts: unknown[];
  builtContexts: unknown[];
  presentedModes: string[];
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
    selectedModes: [],
    presentedContexts: [],
    builtContexts: [],
    presentedModes: [],
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
      showQuickPick: async (items) => {
        this.observed.selectedModes.push(items[0]!.mode);
        return items[0];
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
        this.observed.openedReports.push(report.content);
      },
      buildSemanticDiffReportData: (input) =>
        this.buildSemanticDiffReportData(input),
      buildSemanticDiffOutputContext: (result) => {
        this.observed.reportSteps.push("build-context");
        const context = { result, summary: {} as never };
        this.observed.builtContexts.push(context);
        return context;
      },
      presentSemanticDiffOutput: (context, mode, language) => {
        this.observed.reportSteps.push("present");
        this.observed.presentedContexts.push(context);
        this.observed.presentedModes.push(mode);
        this.observed.renderedLanguages.push(language);
        return {
          mode,
          languageId: mode === "json" ? "json" : "markdown",
          extension: mode === "json" ? ".json" : ".md",
          mediaType:
            mode === "json"
              ? "application/json; charset=utf-8"
              : "text/markdown; charset=utf-8",
          content: "rendered semantic diff",
        } as SemanticDiffOutputDocument;
      },
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
      "build-context",
      "present",
      "display",
    ]);
    assert.deepStrictEqual(harness.observed.clipboardWrites, []);
  });

  test("opens the default Explorer with the retained context", async () => {
    const harness = new SemanticDiffCommandHarness();
    const contexts: unknown[] = [];
    const handle = {
      sessionId: "sde-session-700" as never,
      panel: {} as vscode.WebviewPanel,
      dispose: () => undefined,
    };

    const result = await executeCompareSemanticDiffCommand({
      ...harness.deps,
      openExplorer: async (context) => {
        contexts.push(context);
        return handle;
      },
    });

    assert.deepStrictEqual(result, {
      ok: true,
      sessionId: "sde-session-700",
      action: "explorer-opened",
    });
    assert.deepStrictEqual(contexts, harness.observed.builtContexts);
    assert.deepStrictEqual(harness.observed.selectedModes, []);
    assert.deepStrictEqual(harness.observed.openedReports, []);
    assert.deepStrictEqual(harness.observed.reportSteps, [
      "build-data",
      "build-context",
    ]);
  });

  test("projects exact application capture keys and retains host URIs", async () => {
    const beforeUri = vscode.Uri.parse("file:///before.ajs");
    const afterUri = vscode.Uri.parse("file:///after.ajs");
    const harness = new SemanticDiffCommandHarness({
      beforeContent: "unit=before,,jp1admin,;{ty=g;}",
      afterContent: "unit=after,,jp1admin,;{ty=g;}",
      openDialogResult: [beforeUri],
      getActiveEditor: () =>
        ({
          document: {
            uri: afterUri,
            version: 7,
            getText: () => "unit=after,,jp1admin,;{ty=g;}",
          },
        }) as unknown as vscode.TextEditor,
    });
    const captureInputs: unknown[] = [];
    const concreteBegin = createBeginSemanticDiffSourceCapture(
      new AntlrAjsParser(),
    );
    const contextRegistry = new SemanticDiffExplorerContextRegistry();
    let registeredContext: SemanticDiffOutputContext | undefined;
    let registeredRelease: (() => void) | undefined;
    let registeredSources:
      | Parameters<
          NonNullable<
            SemanticDiffCommandDeps["registerSemanticDiffSourceCapture"]
          >
        >[2]
      | undefined;
    const handle = {
      sessionId: "sde-session-concrete" as never,
      panel: {} as vscode.WebviewPanel,
      dispose: () => undefined,
    };

    const result = await executeCompareSemanticDiffCommand({
      ...harness.deps,
      beginSemanticDiffSourceCapture: (input) => {
        captureInputs.push(input);
        return concreteBegin(input);
      },
      buildSemanticDiffReportData: createBuildSemanticDiffReportData(
        new AntlrAjsParser(),
      ),
      registerSemanticDiffSourceCapture: (
        context,
        binding,
        sources,
        release,
      ) => {
        registeredContext = context;
        registeredSources = sources;
        registeredRelease = release;
        contextRegistry.registerSourceCapture(context, {
          binding,
          sources,
          release,
        });
      },
      unregisterSemanticDiffSourceCapture: (context) => {
        contextRegistry.unregisterSourceCapture(context);
      },
      openExplorer: async (context) => {
        assert.strictEqual(context, registeredContext);
        return handle;
      },
    });

    assert.deepStrictEqual(result, {
      ok: true,
      sessionId: "sde-session-concrete",
      action: "explorer-opened",
    });
    assert.strictEqual(captureInputs.length, 1);
    const captureInput = captureInputs[0] as {
      before: Record<string, unknown>;
      after: Record<string, unknown>;
    };
    assert.deepStrictEqual(Object.keys(captureInput.before).sort(), [
      "side",
      "sourceHandleId",
      "text",
      "version",
    ]);
    assert.deepStrictEqual(Object.keys(captureInput.after).sort(), [
      "side",
      "sourceHandleId",
      "text",
      "version",
    ]);
    assert.strictEqual("uri" in captureInput.before, false);
    assert.strictEqual("uri" in captureInput.after, false);
    assert.strictEqual(registeredSources?.before.uri, beforeUri);
    assert.strictEqual(registeredSources?.after.uri, afterUri);
    assert.strictEqual(
      registeredSources?.before.sourceHandleId,
      captureInput.before.sourceHandleId,
    );
    assert.strictEqual(
      registeredSources?.after.sourceHandleId,
      captureInput.after.sourceHandleId,
    );
    assert.ok(registeredContext);
    assert.ok(contextRegistry.sourceCapture(registeredContext));

    contextRegistry.unregisterSourceCapture(registeredContext);
    registeredRelease?.();
    assert.strictEqual(
      contextRegistry.sourceCapture(registeredContext),
      undefined,
    );
  });

  test("maps capture setup exceptions to display failure", async () => {
    const afterUri = vscode.Uri.parse("file:///after.ajs");
    const harness = new SemanticDiffCommandHarness({
      getActiveEditor: () =>
        ({
          document: {
            uri: afterUri,
            version: 1,
            getText: () => "unit=after,,jp1admin,;",
          },
        }) as unknown as vscode.TextEditor,
    });
    let openExplorerCount = 0;

    const result = await executeCompareSemanticDiffCommand({
      ...harness.deps,
      beginSemanticDiffSourceCapture: () => {
        throw new Error("capture setup failed");
      },
      openExplorer: async () => {
        openExplorerCount += 1;
        throw new Error("Explorer must not open after setup failure.");
      },
    });

    assert.deepStrictEqual(result, {
      ok: false,
      error: {
        code: "display-failed",
        message: "Semantic diff source capture could not be established.",
      },
    });
    assert.strictEqual(openExplorerCount, 0);
    assert.deepStrictEqual(harness.observed.errorMessages, [
      "Semantic diff source capture could not be established.",
    ]);
  });

  test("keeps concrete parser failures as parse failure", async () => {
    const afterUri = vscode.Uri.parse("file:///after.ajs");
    const harness = new SemanticDiffCommandHarness({
      beforeContent: "unit=before,,jp1admin,\n{ty=g;}\n",
      afterContent: "unit=after,,jp1admin,;{ty=g;}",
      getActiveEditor: () =>
        ({
          document: {
            uri: afterUri,
            version: 2,
            getText: () => "unit=after,,jp1admin,;{ty=g;}",
          },
        }) as unknown as vscode.TextEditor,
    });
    const concreteBegin = createBeginSemanticDiffSourceCapture(
      new AntlrAjsParser(),
    );
    let releaseCount = 0;

    const result = await executeCompareSemanticDiffCommand({
      ...harness.deps,
      beginSemanticDiffSourceCapture: (input) => {
        const capture = concreteBegin(input);
        return {
          ...capture,
          release: () => {
            releaseCount += 1;
            capture.release();
          },
        };
      },
      buildSemanticDiffReportData: createBuildSemanticDiffReportData(
        new AntlrAjsParser(),
      ),
      openExplorer: async () => {
        throw new Error("Explorer must not open after parser failure.");
      },
    });

    assert.deepStrictEqual(result, {
      ok: false,
      error: {
        code: "parse-failed",
        message:
          "Semantic diff could not parse one or both JP1/AJS definitions.",
      },
    });
    assert.strictEqual(releaseCount, 1);
    assert.deepStrictEqual(harness.observed.errorMessages, [
      "Semantic diff could not parse one or both JP1/AJS definitions.",
    ]);
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
    assert.deepStrictEqual(harness.observed.presentedModes, ["full"]);
  });

  test("cancels the common picker before reading or comparing inputs", async () => {
    const harness = new SemanticDiffCommandHarness({
      showQuickPick: async () => undefined,
    });

    const result = await executeCompareSemanticDiffCommand(harness.deps);

    assert.strictEqual(result.ok, false);
    if (result.ok) throw new Error("Expected picker cancellation.");
    assert.strictEqual(result.error.code, "cancelled");
    assert.strictEqual(harness.observed.openDialogCount, 0);
    assert.deepStrictEqual(harness.observed.reportInputs, []);
  });

  test("passes the selected JSON mode and one context to the dispatcher", async () => {
    const harness = new SemanticDiffCommandHarness({
      showQuickPick: async (items) =>
        items.find((item) => item.mode === "json"),
    });

    const result = await executeCompareSemanticDiffCommand(harness.deps);

    assert.strictEqual(result.ok, true);
    assert.deepStrictEqual(harness.observed.presentedModes, ["json"]);
    assert.strictEqual(harness.observed.presentedContexts.length, 1);
    assert.strictEqual(
      harness.observed.presentedContexts[0],
      harness.observed.builtContexts[0],
    );
  });

  test("maps picker host failure without reading or comparing inputs", async () => {
    const harness = new SemanticDiffCommandHarness({
      showQuickPick: async () => {
        throw new Error("picker failed");
      },
    });

    const result = await executeCompareSemanticDiffCommand(harness.deps);

    assert.strictEqual(result.ok, false);
    if (result.ok) throw new Error("Expected picker failure.");
    assert.strictEqual(result.error.code, "mode-picker-failed");
    assert.strictEqual(harness.observed.openDialogCount, 0);
    assert.deepStrictEqual(harness.observed.reportInputs, []);
    assert.deepStrictEqual(harness.observed.errorMessages, [
      "Semantic diff output mode could not be selected.",
    ]);
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

  test("maps a source-capture contract failure to display failure", async () => {
    const harness = new SemanticDiffCommandHarness();
    const sourceIndexIds = createSemanticDiffSourceIndexIdAllocator();
    let releaseCount = 0;
    const enrichedParser: AjsParserWithSourceIndexPort = {
      parseWithSourceIndex: () => ({
        ok: true,
        document: { rootUnits: [], warnings: [] },
        sourceIndex: {
          sourceIndexId: sourceIndexIds(),
          unitEntries: [],
        },
      }),
    };
    const beginCapture = createBeginSemanticDiffSourceCapture(enrichedParser);

    const result = await executeCompareSemanticDiffCommand({
      ...harness.deps,
      getActiveEditor: () =>
        ({
          document: {
            uri: vscode.Uri.parse("untitled:after.ajs"),
            getText: () => "unit=after,,jp1admin,;",
          },
        }) as unknown as vscode.TextEditor,
      beginSemanticDiffSourceCapture: (input) => {
        const capture = beginCapture(input);
        return {
          ...capture,
          release: () => {
            releaseCount += 1;
            capture.release();
          },
        };
      },
      buildSemanticDiffReportData: (_input, parser) => {
        parser?.parse("not-the-captured-before-source");
        return { ok: true, result: emptyResult() };
      },
      openExplorer: async () => {
        throw new Error("Explorer must not open after capture failure.");
      },
    });

    assert.deepStrictEqual(result, {
      ok: false,
      error: {
        code: "display-failed",
        message: "Semantic diff source capture could not be established.",
      },
    });
    assert.strictEqual(releaseCount, 1);
  });

  test("maps source-capture registration exceptions to display failure", async () => {
    const harness = new SemanticDiffCommandHarness();
    const sourceIndexIds = createSemanticDiffSourceIndexIdAllocator();
    const contextRegistry = new SemanticDiffExplorerContextRegistry();
    const registeredContexts = new Set<SemanticDiffOutputContext>();
    const lifecycle: string[] = [];
    let releaseCount = 0;
    let openExplorerCount = 0;
    const enrichedParser: AjsParserWithSourceIndexPort = {
      parseWithSourceIndex: (content) => ({
        ok: true,
        document: { rootUnits: [], warnings: [] },
        sourceIndex: {
          sourceIndexId: sourceIndexIds(),
          unitEntries: [
            {
              unitId: content,
              headerRange: {
                start: { line: 0, character: 0 },
                end: { line: 0, character: 1 },
              },
              nameRange: null,
              parameterOccurrences: [],
            },
          ],
        },
      }),
    };
    const beginCapture = createBeginSemanticDiffSourceCapture(enrichedParser);

    const result = await executeCompareSemanticDiffCommand({
      ...harness.deps,
      getActiveEditor: () =>
        ({
          document: {
            uri: vscode.Uri.parse("untitled:after.ajs"),
            version: 1,
            getText: () => "unit=after,,jp1admin,;",
          },
        }) as unknown as vscode.TextEditor,
      beginSemanticDiffSourceCapture: (input) => {
        const capture = beginCapture(input);
        return {
          ...capture,
          release: () => {
            lifecycle.push("release");
            releaseCount += 1;
            capture.release();
          },
        };
      },
      buildSemanticDiffReportData: (input, parser) => {
        parser?.parse(input.beforeContent);
        parser?.parse(input.afterContent);
        return { ok: true, result: emptyResult() };
      },
      registerSemanticDiffSourceCapture: (
        context,
        binding,
        sources,
        release,
      ) => {
        lifecycle.push("register");
        registeredContexts.add(context);
        contextRegistry.registerSourceCapture(context, {
          binding,
          sources,
          release,
        });
        throw new Error("registry is unavailable");
      },
      unregisterSemanticDiffSourceCapture: (context) => {
        lifecycle.push("unregister");
        contextRegistry.unregisterSourceCapture(context);
      },
      openExplorer: async () => {
        openExplorerCount += 1;
        throw new Error("Explorer must not open after registration failure.");
      },
    });

    assert.deepStrictEqual(result, {
      ok: false,
      error: {
        code: "display-failed",
        message: "Semantic diff source targets could not be registered.",
      },
    });
    assert.strictEqual(releaseCount, 1);
    assert.strictEqual(openExplorerCount, 0);
    assert.deepStrictEqual(lifecycle, ["register", "unregister", "release"]);
    for (const context of registeredContexts) {
      assert.strictEqual(contextRegistry.sourceCapture(context), undefined);
    }
  });

  test("maps Explorer-open exceptions to display failure", async () => {
    const harness = new SemanticDiffCommandHarness({
      openExplorer: async () => {
        throw new Error("panel creation failed");
      },
    });

    const result = await executeCompareSemanticDiffCommand(harness.deps);

    assert.deepStrictEqual(result, {
      ok: false,
      error: {
        code: "display-failed",
        message: "Semantic diff Explorer could not be opened.",
      },
    });
    assert.deepStrictEqual(harness.observed.errorMessages, [
      "Semantic diff Explorer could not be opened.",
    ]);
  });

  test("maps report rendering failure without leaving a report to display", async () => {
    const harness = new SemanticDiffCommandHarness({
      presentSemanticDiffOutput: () => {
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
