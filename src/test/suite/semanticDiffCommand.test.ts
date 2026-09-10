import * as assert from "assert";
import * as vscode from "vscode";
import { createBuildSemanticDiffReportData } from "../../application/semantic-diff/buildSemanticDiffReportData";
import type { BuildSemanticDiffReportDataInput } from "../../application/semantic-diff/buildSemanticDiffReportData";
import {
  createBuildSemanticDiffPresentationArtifacts,
  type SemanticDiffPresentationArtifacts,
} from "../../application/semantic-diff/buildSemanticDiffPresentationArtifacts";
import {
  createSemanticDiffCaptureScopeIdAllocator,
  createSemanticDiffSourceHandleIdAllocator,
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
  MAX_SEMANTIC_DIFF_SOURCE_BYTES,
  type SemanticDiffCommandDeps,
} from "../../presentation/vscode/commands/semanticDiffCommand";
import { getSemanticDiffCommandLocalization } from "../../presentation/vscode/commands/semanticDiffCommandLocalization";
import {
  MAX_GIT_HEAD_SNAPSHOT_ENTRIES,
  VscodeGitHeadContentProvider,
} from "../../infrastructure/git/VscodeGitHeadContentProvider";

const createTestParser = (): AntlrAjsParser =>
  new AntlrAjsParser({
    sourceIndexIdAllocator: createSemanticDiffSourceIndexIdAllocator(),
  });

const createTestCaptureFactory = (parser: AjsParserWithSourceIndexPort) =>
  createBeginSemanticDiffSourceCapture(
    parser,
    createSemanticDiffCaptureScopeIdAllocator(),
  );

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
    this.beforeContent =
      overrides.beforeContent ?? "unit=before,,jp1admin,;{ty=g;}";
    this.afterContent =
      overrides.afterContent ?? "unit=after,,jp1admin,;{ty=g;}";
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
      sourceHandleIdAllocator: createSemanticDiffSourceHandleIdAllocator(),
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

const createWorkflowHarness = (
  overrides: Partial<SemanticDiffCommandDeps> = {},
): {
  deps: SemanticDiffCommandDeps;
  beforeUri: vscode.Uri;
  afterUri: vscode.Uri;
} => {
  const beforeUri = vscode.Uri.parse("file:///workflow-before.ajs");
  const afterUri = vscode.Uri.parse("file:///workflow-after.ajs");
  const parser = createTestParser();
  const handle = {
    sessionId: "sde-workflow-harness" as never,
    panel: {} as vscode.WebviewPanel,
    dispose: () => undefined,
  };
  const beginCapture = createTestCaptureFactory(parser);
  const artifactsBuilder = createBuildSemanticDiffPresentationArtifacts(parser);
  const contextRegistry = new SemanticDiffExplorerContextRegistry();
  const deps: SemanticDiffCommandDeps = {
    getActiveEditor: () =>
      ({
        document: {
          uri: afterUri,
          version: 1,
          getText: () => "unit=after,,jp1admin,;{ty=g;}",
        },
      }) as unknown as vscode.TextEditor,
    showQuickPick: async () => undefined,
    showWorkflowQuickPick: async (items) => items[0],
    showOpenDialog: async () => [beforeUri],
    openTextDocument: async () =>
      ({
        uri: beforeUri,
        version: 1,
        getText: () => "unit=before,,jp1admin,;{ty=g;}",
      }) as unknown as vscode.TextDocument,
    readFile: async () => new TextEncoder().encode("unused"),
    showErrorMessage: async () => undefined,
    openReport: async () => undefined,
    buildSemanticDiffReportData: () => ({ ok: true, result: emptyResult() }),
    buildSemanticDiffPresentationArtifacts: (input, scopedParser) =>
      artifactsBuilder(input, scopedParser),
    beginSemanticDiffSourceCapture: (input) => beginCapture(input),
    sourceHandleIdAllocator: createSemanticDiffSourceHandleIdAllocator(),
    registerSemanticDiffSourceCapture: (context, entry) => {
      contextRegistry.registerSourceCapture(context, entry);
    },
    unregisterSemanticDiffSourceCapture: (context) => {
      contextRegistry.unregisterSourceCapture(context);
    },
    openScheduleAwareExplorerSession: async () => handle,
    ...overrides,
  };
  return { deps, beforeUri, afterUri };
};

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
        beforeContent: "unit=before,,jp1admin,;{ty=g;}",
        afterContent: "unit=after,,jp1admin,;{ty=g;}",
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
      source: "file",
      period: "not-requested",
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
    const concreteBegin = createTestCaptureFactory(createTestParser());
    const contextRegistry = new SemanticDiffExplorerContextRegistry();
    let registeredContext: SemanticDiffOutputContext | undefined;
    let registeredRelease: (() => void) | undefined;
    let registeredSources:
      | Parameters<
          NonNullable<
            SemanticDiffCommandDeps["registerSemanticDiffSourceCapture"]
          >
        >[1]["sources"]
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
      buildSemanticDiffReportData:
        createBuildSemanticDiffReportData(createTestParser()),
      registerSemanticDiffSourceCapture: (context, entry) => {
        registeredContext = context;
        registeredSources = entry.sources;
        registeredRelease = entry.release;
        contextRegistry.registerSourceCapture(context, entry);
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
      source: "file",
      period: "not-requested",
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
            getText: () => "unit=after,,jp1admin,;{ty=g;}",
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
    const concreteBegin = createTestCaptureFactory(createTestParser());
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
      buildSemanticDiffReportData:
        createBuildSemanticDiffReportData(createTestParser()),
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
        beforeContent: "unit=before,,jp1admin,;{ty=g;}",
        afterContent: "unit=after,,jp1admin,;{ty=g;}",
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
    const beginCapture = createTestCaptureFactory(enrichedParser);

    const result = await executeCompareSemanticDiffCommand({
      ...harness.deps,
      getActiveEditor: () =>
        ({
          document: {
            uri: vscode.Uri.parse("untitled:after.ajs"),
            getText: () => "unit=after,,jp1admin,;{ty=g;}",
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
    const beginCapture = createTestCaptureFactory(enrichedParser);

    const result = await executeCompareSemanticDiffCommand({
      ...harness.deps,
      getActiveEditor: () =>
        ({
          document: {
            uri: vscode.Uri.parse("untitled:after.ajs"),
            version: 1,
            getText: () => "unit=after,,jp1admin,;{ty=g;}",
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
      registerSemanticDiffSourceCapture: (context, entry) => {
        lifecycle.push("register");
        registeredContexts.add(context);
        contextRegistry.registerSourceCapture(context, entry);
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

  test("runs the file workflow with one snapshot, capture, and Explorer handoff", async () => {
    const beforeUri = vscode.Uri.parse("file:///before-workflow.ajs");
    const afterUri = vscode.Uri.parse("file:///after-workflow.ajs");
    const beforeDocument = {
      uri: beforeUri,
      version: 3,
      getText: () => "unit=before,,jp1admin,;{ty=g;}",
    } as unknown as vscode.TextDocument;
    let afterTextReads = 0;
    let beforeTextReads = 0;
    let callbackCount = 0;
    let callbackParser: unknown;
    const quickPicks: string[] = [];
    const quickPickTitles: string[] = [];
    const contexts: unknown[] = [];
    const registry = new SemanticDiffExplorerContextRegistry();
    const parser = createTestParser();
    const beginCapture = createTestCaptureFactory(parser);
    const artifactsBuilder =
      createBuildSemanticDiffPresentationArtifacts(parser);
    const handle = {
      sessionId: "sde-workflow-file" as never,
      panel: {} as vscode.WebviewPanel,
      dispose: () => undefined,
    };
    const deps: SemanticDiffCommandDeps = {
      getActiveEditor: () =>
        ({
          document: {
            uri: afterUri,
            version: 9,
            getText: () => {
              afterTextReads += 1;
              return "unit=after,,jp1admin,;{ty=g;}";
            },
          },
        }) as unknown as vscode.TextEditor,
      showQuickPick: async () => undefined,
      showWorkflowQuickPick: async (items, options) => {
        quickPicks.push(items.map((item) => item.label).join("|"));
        quickPickTitles.push(options?.title ?? "");
        return items[0];
      },
      showOpenDialog: async () => [beforeUri],
      openTextDocument: async () =>
        ({
          ...beforeDocument,
          getText: () => {
            beforeTextReads += 1;
            return beforeDocument.getText();
          },
        }) as unknown as vscode.TextDocument,
      readFile: async () => new TextEncoder().encode("unused"),
      showErrorMessage: async () => undefined,
      showInputBox: async () => undefined,
      openReport: async () => undefined,
      buildSemanticDiffReportData: () => {
        throw new Error("legacy report builder must not run");
      },
      buildSemanticDiffPresentationArtifacts: (input, scopedParser) => {
        callbackCount += 1;
        callbackParser = scopedParser;
        return artifactsBuilder(input, scopedParser);
      },
      beginSemanticDiffSourceCapture: (input) => beginCapture(input),
      sourceHandleIdAllocator: createSemanticDiffSourceHandleIdAllocator(),
      registerSemanticDiffSourceCapture: (context, entry) => {
        contexts.push(context);
        registry.registerSourceCapture(context, entry);
      },
      unregisterSemanticDiffSourceCapture: (context) => {
        registry.unregisterSourceCapture(context);
      },
      openScheduleAwareExplorerSession: async (artifacts) => {
        assert.strictEqual(artifacts.context, contexts[0]);
        return handle;
      },
    };

    const result = await executeCompareSemanticDiffCommand(deps);

    assert.deepStrictEqual(result, {
      ok: true,
      action: "explorer-opened",
      sessionId: "sde-workflow-file",
      source: "file",
      period: "not-requested",
    });
    assert.deepStrictEqual(quickPicks, [
      "Select Definition File|Git HEAD",
      "No schedule period|Specify schedule period",
    ]);
    assert.deepStrictEqual(quickPickTitles, [
      "Compare Definition",
      "Compare Definition",
    ]);
    assert.strictEqual(afterTextReads, 1);
    assert.strictEqual(beforeTextReads, 1);
    assert.strictEqual(callbackCount, 1);
    assert.ok(callbackParser);
    assert.ok(contexts[0]);
    assert.ok(registry.sourceCapture(contexts[0] as SemanticDiffOutputContext));
  });

  test("forwards the exact selected half-open period and keeps date prompts localized", async () => {
    const beforeUri = vscode.Uri.parse("file:///before-period.ajs");
    const afterUri = vscode.Uri.parse("file:///after-period.ajs");
    const periodInputs: string[] = [];
    const periodTitles: string[] = [];
    const artifactInputs: unknown[] = [];
    const parser = createTestParser();
    const beginCapture = createTestCaptureFactory(parser);
    const artifactsBuilder =
      createBuildSemanticDiffPresentationArtifacts(parser);
    const contextRegistry = new SemanticDiffExplorerContextRegistry();
    const handle = {
      sessionId: "sde-workflow-period" as never,
      panel: {} as vscode.WebviewPanel,
      dispose: () => undefined,
    };
    const deps: SemanticDiffCommandDeps = {
      getActiveEditor: () =>
        ({
          document: {
            uri: afterUri,
            version: 1,
            getText: () => "unit=after,,jp1admin,;{ty=g;}",
          },
        }) as unknown as vscode.TextEditor,
      showQuickPick: async () => undefined,
      showWorkflowQuickPick: async (items) =>
        items.find(
          (item) =>
            item.workflowKind === "specify-period" &&
            item.label === "Specify schedule period",
        ) ?? items[0],
      showOpenDialog: async () => [beforeUri],
      openTextDocument: async () =>
        ({
          uri: beforeUri,
          version: 1,
          getText: () => "unit=before,,jp1admin,;{ty=g;}",
        }) as unknown as vscode.TextDocument,
      readFile: async () => new TextEncoder().encode("unused"),
      showErrorMessage: async () => undefined,
      showInputBox: async (options) => {
        periodTitles.push(options.title ?? "");
        periodInputs.push(options.prompt ?? "");
        return periodInputs.length === 1 ? "2024-02-29" : "2024-03-01";
      },
      openReport: async () => undefined,
      buildSemanticDiffReportData: () => {
        throw new Error("legacy report builder must not run");
      },
      buildSemanticDiffPresentationArtifacts: (input, scopedParser) => {
        artifactInputs.push(input);
        return artifactsBuilder(input, scopedParser);
      },
      beginSemanticDiffSourceCapture: (input) => beginCapture(input),
      sourceHandleIdAllocator: createSemanticDiffSourceHandleIdAllocator(),
      registerSemanticDiffSourceCapture: (context, entry) => {
        contextRegistry.registerSourceCapture(context, entry);
      },
      unregisterSemanticDiffSourceCapture: (context) => {
        contextRegistry.unregisterSourceCapture(context);
      },
      openScheduleAwareExplorerSession: async (artifacts) => {
        assert.ok(contextRegistry.sourceCapture(artifacts.context));
        return handle;
      },
      language: "en-US",
    };

    const result = await executeCompareSemanticDiffCommand(deps);

    assert.strictEqual(result.ok, true);
    assert.deepStrictEqual(periodInputs, [
      "From date (YYYY-MM-DD)",
      "To date (YYYY-MM-DD)",
    ]);
    assert.deepStrictEqual(periodTitles, [
      "Compare Definition",
      "Compare Definition",
    ]);
    assert.deepStrictEqual(artifactInputs[0], {
      beforeContent: "unit=before,,jp1admin,;{ty=g;}",
      afterContent: "unit=after,,jp1admin,;{ty=g;}",
      options: {
        scheduleComparisonPeriod: { from: "2024-02-29", to: "2024-03-01" },
      },
    });
  });

  test("identifies the affected side for workflow parser failures", async () => {
    const beforeUri = vscode.Uri.parse("file:///before-parse-failure.ajs");
    const afterUri = vscode.Uri.parse("file:///after-parse-failure.ajs");
    const parser = createTestParser();
    const beginCapture = createTestCaptureFactory(parser);
    const sourceHandleIds = createSemanticDiffSourceHandleIdAllocator();
    const capture = beginCapture({
      before: {
        side: "before",
        sourceHandleId: sourceHandleIds(),
        text: "unit=before,,jp1admin,;{ty=g;}",
        version: 1,
      },
      after: {
        side: "after",
        sourceHandleId: sourceHandleIds(),
        text: "unit=after,,jp1admin,;{ty=g;}",
        version: 1,
      },
    });
    let releaseCount = 0;
    let openCount = 0;
    const deps: SemanticDiffCommandDeps = {
      getActiveEditor: () =>
        ({
          document: {
            uri: afterUri,
            version: 1,
            getText: () => "unit=after,,jp1admin,;{ty=g;}",
          },
        }) as unknown as vscode.TextEditor,
      showQuickPick: async () => undefined,
      showWorkflowQuickPick: async (items) => items[0],
      showOpenDialog: async () => [beforeUri],
      openTextDocument: async () =>
        ({
          uri: beforeUri,
          version: 1,
          getText: () => "unit=before,,jp1admin,;{ty=g;}",
        }) as unknown as vscode.TextDocument,
      readFile: async () => new TextEncoder().encode("unused"),
      showErrorMessage: async () => undefined,
      openReport: async () => undefined,
      buildSemanticDiffReportData: () => ({ ok: true, result: emptyResult() }),
      buildSemanticDiffPresentationArtifacts: () => ({
        ok: false,
        errors: {
          before: [{ line: 1, column: 1, message: "invalid before" }],
          after: [],
        },
      }),
      beginSemanticDiffSourceCapture: () => ({
        ...capture,
        release: () => {
          releaseCount += 1;
          capture.release();
        },
      }),
      sourceHandleIdAllocator: createSemanticDiffSourceHandleIdAllocator(),
      openScheduleAwareExplorerSession: async () => {
        openCount += 1;
        throw new Error("Explorer must not open after parser failure.");
      },
    };

    const result = await executeCompareSemanticDiffCommand(deps);

    assert.deepStrictEqual(result, {
      ok: false,
      error: {
        code: "parse-failed",
        message: "The before definition could not be parsed.",
      },
    });
    assert.strictEqual(releaseCount, 1);
    assert.strictEqual(openCount, 0);
  });

  test("localizes workflow labels and falls back to English", () => {
    assert.strictEqual(
      getSemanticDiffCommandLocalization("ja-JP").selectDefinitionFile,
      "定義ファイルを選択",
    );
    assert.strictEqual(
      getSemanticDiffCommandLocalization("ja-JP").sourcePickerTitle,
      "定義を比較",
    );
    assert.strictEqual(
      getSemanticDiffCommandLocalization("ja-JP").fromDateTitle,
      "定義を比較",
    );
    assert.strictEqual(
      getSemanticDiffCommandLocalization("fr-FR").selectDefinitionFile,
      "Select Definition File",
    );
  });

  test("rejects non-text or oversized after snapshots before source selection", async () => {
    const afterUri = vscode.Uri.parse("file:///after-safety.ajs");
    const cases = [
      {
        text: "unit=after,,jp1admin,;{ty=g;}\u0000",
        code: "after-non-text" as const,
        message: "The active JP1/AJS definition is not text.",
      },
      {
        text: "x".repeat(MAX_SEMANTIC_DIFF_SOURCE_BYTES + 1),
        code: "after-too-large" as const,
        message: "The active JP1/AJS definition exceeds the 8 MiB limit.",
      },
    ];

    for (const testCase of cases) {
      let sourceSelectionCount = 0;
      let callbackCount = 0;
      const deps: SemanticDiffCommandDeps = {
        getActiveEditor: () =>
          ({
            document: {
              uri: afterUri,
              version: 1,
              getText: () => testCase.text,
            },
          }) as unknown as vscode.TextEditor,
        showQuickPick: async () => undefined,
        showWorkflowQuickPick: async () => {
          sourceSelectionCount += 1;
          return undefined;
        },
        showOpenDialog: async () => [],
        openTextDocument: async () => {
          throw new Error("before file must not open");
        },
        readFile: async () => new TextEncoder().encode("unused"),
        showErrorMessage: async () => undefined,
        openReport: async () => undefined,
        buildSemanticDiffReportData: () => ({
          ok: true,
          result: emptyResult(),
        }),
        buildSemanticDiffPresentationArtifacts: () => {
          callbackCount += 1;
          throw new Error("artifact callback must not run");
        },
        beginSemanticDiffSourceCapture: () => {
          throw new Error("capture must not begin");
        },
        sourceHandleIdAllocator: createSemanticDiffSourceHandleIdAllocator(),
        openScheduleAwareExplorerSession: async () => {
          throw new Error("Explorer must not open");
        },
      };

      const result = await executeCompareSemanticDiffCommand(deps);

      assert.deepStrictEqual(result, {
        ok: false,
        error: { code: testCase.code, message: testCase.message },
      });
      assert.strictEqual(sourceSelectionCount, 0);
      assert.strictEqual(callbackCount, 0);
    }
  });

  test("cancelling source or file selection is silent and leaves no session", async () => {
    const sourceHarness = createWorkflowHarness({
      showWorkflowQuickPick: async () => undefined,
    });
    const sourceResult = await executeCompareSemanticDiffCommand(
      sourceHarness.deps,
    );
    assert.deepStrictEqual(sourceResult, {
      ok: false,
      error: {
        code: "cancelled",
        message: "Semantic diff was cancelled.",
      },
    });

    let captureCount = 0;
    const fileHarness = createWorkflowHarness({
      showWorkflowQuickPick: async (items) => items[0],
      showOpenDialog: async () => undefined,
      beginSemanticDiffSourceCapture: () => {
        captureCount += 1;
        throw new Error("capture must not begin");
      },
    });
    const fileResult = await executeCompareSemanticDiffCommand(
      fileHarness.deps,
    );
    assert.deepStrictEqual(fileResult, {
      ok: false,
      error: {
        code: "cancelled",
        message: "Semantic diff was cancelled.",
      },
    });
    assert.strictEqual(captureCount, 0);
  });

  test("maps file open and read failures to the stable before-file outcome", async () => {
    const cases: Partial<SemanticDiffCommandDeps>[] = [
      {
        showOpenDialog: async () => {
          throw new Error("file picker failed");
        },
      },
      {
        openTextDocument: async () => {
          throw new Error("document open failed");
        },
      },
      {
        openTextDocument: async () =>
          ({
            getText: () => {
              throw new Error("document read failed");
            },
          }) as unknown as vscode.TextDocument,
      },
    ];

    for (const overrides of cases) {
      const harness = createWorkflowHarness(overrides);
      const result = await executeCompareSemanticDiffCommand(harness.deps);
      assert.deepStrictEqual(result, {
        ok: false,
        error: {
          code: "before-file-read-failed",
          message: "The selected before definition could not be read.",
        },
      });
    }
  });

  test("rejects non-text or oversized before snapshots before capture", async () => {
    const cases = [
      {
        text: "unit=before,,jp1admin,;{ty=g;}\u0000",
        code: "before-file-non-text" as const,
        message: "The selected before definition is not text.",
      },
      {
        text: "x".repeat(MAX_SEMANTIC_DIFF_SOURCE_BYTES + 1),
        code: "before-file-too-large" as const,
        message: "The selected before definition exceeds the 8 MiB limit.",
      },
    ];
    for (const testCase of cases) {
      let captureCount = 0;
      const harness = createWorkflowHarness({
        openTextDocument: async () =>
          ({
            uri: harness.beforeUri,
            version: 1,
            getText: () => testCase.text,
          }) as unknown as vscode.TextDocument,
        beginSemanticDiffSourceCapture: () => {
          captureCount += 1;
          throw new Error("capture must not begin");
        },
      });
      const result = await executeCompareSemanticDiffCommand(harness.deps);
      assert.deepStrictEqual(result, {
        ok: false,
        error: { code: testCase.code, message: testCase.message },
      });
      assert.strictEqual(captureCount, 0);
    }
  });

  test("maps source and period host picker exceptions to comparison failure", async () => {
    const sourceErrorMessages: string[] = [];
    const sourceHarness = createWorkflowHarness({
      showWorkflowQuickPick: async () => {
        throw new Error("source picker failed");
      },
      showErrorMessage: async (message) => {
        sourceErrorMessages.push(message);
        return undefined;
      },
    });
    const sourceResult = await executeCompareSemanticDiffCommand(
      sourceHarness.deps,
    );
    assert.deepStrictEqual(sourceResult, {
      ok: false,
      error: {
        code: "comparison-failed",
        message: "Semantic diff comparison could not be completed.",
      },
    });
    assert.deepStrictEqual(sourceErrorMessages, [
      "Semantic diff comparison could not be completed.",
    ]);

    let pickerCall = 0;
    const periodHarness = createWorkflowHarness({
      showWorkflowQuickPick: async (items) => {
        pickerCall += 1;
        if (pickerCall === 1) return items[0];
        throw new Error("period picker failed");
      },
    });
    const periodResult = await executeCompareSemanticDiffCommand(
      periodHarness.deps,
    );
    assert.deepStrictEqual(periodResult, {
      ok: false,
      error: {
        code: "comparison-failed",
        message: "Semantic diff comparison could not be completed.",
      },
    });

    let inputPickerCall = 0;
    const inputHarness = createWorkflowHarness({
      showWorkflowQuickPick: async (items) => {
        inputPickerCall += 1;
        return inputPickerCall === 1 ? items[0] : items[1];
      },
      showInputBox: async () => {
        throw new Error("date input failed");
      },
    });
    const inputResult = await executeCompareSemanticDiffCommand(
      inputHarness.deps,
    );
    assert.deepStrictEqual(inputResult, {
      ok: false,
      error: {
        code: "comparison-failed",
        message: "Semantic diff comparison could not be completed.",
      },
    });
  });

  test("validates dates in place and cancels without starting capture", async () => {
    const validationMessages: string[] = [];
    let pickerCall = 0;
    const harness = createWorkflowHarness({
      showWorkflowQuickPick: async (items) => {
        pickerCall += 1;
        return pickerCall === 1 ? items[0] : items[1];
      },
      showInputBox: async (options) => {
        if (options.validateInput) {
          const validation = options.validateInput(
            validationMessages.length === 0 ? "2024-02-30" : "2024-02-28",
          );
          validationMessages.push(
            typeof validation === "string"
              ? validation
              : validation &&
                  typeof validation === "object" &&
                  "message" in validation
                ? String(validation.message)
                : "valid",
          );
        }
        return validationMessages.length === 1 ? "2024-02-29" : "2024-03-01";
      },
    });
    const result = await executeCompareSemanticDiffCommand(harness.deps);
    assert.strictEqual(result.ok, true);
    assert.deepStrictEqual(validationMessages, [
      "Enter a real date in YYYY-MM-DD format.",
      "The end date must be after the start date.",
    ]);

    let captureCount = 0;
    let cancelPickerCall = 0;
    const cancelled = createWorkflowHarness({
      showWorkflowQuickPick: async (items) => {
        cancelPickerCall += 1;
        return cancelPickerCall === 1 ? items[0] : items[1];
      },
      showInputBox: async () => undefined,
      beginSemanticDiffSourceCapture: () => {
        captureCount += 1;
        throw new Error("capture must not begin");
      },
    });
    const cancelledResult = await executeCompareSemanticDiffCommand(
      cancelled.deps,
    );
    assert.deepStrictEqual(cancelledResult, {
      ok: false,
      error: {
        code: "cancelled",
        message: "Semantic diff was cancelled.",
      },
    });
    assert.strictEqual(captureCount, 0);
  });

  test("captures before callback, binds exact args, and opens once", async () => {
    const events: string[] = [];
    const harness = createWorkflowHarness();
    const baseBegin = harness.deps.beginSemanticDiffSourceCapture!;
    const baseBuild = harness.deps.buildSemanticDiffPresentationArtifacts!;
    const registry = new SemanticDiffExplorerContextRegistry();
    let captureParser: unknown;
    harness.deps.beginSemanticDiffSourceCapture = (input) => {
      events.push("capture");
      const capture = baseBegin(input);
      captureParser = capture.parser;
      return capture;
    };
    harness.deps.buildSemanticDiffPresentationArtifacts = (input, parser) => {
      events.push("callback");
      assert.strictEqual(parser, captureParser);
      return baseBuild(input, parser);
    };
    harness.deps.registerSemanticDiffSourceCapture = (context, entry) => {
      events.push("register");
      registry.registerSourceCapture(context, entry);
    };
    harness.deps.openScheduleAwareExplorerSession = async (artifacts) => {
      events.push("open");
      assert.strictEqual(
        registry.sourceCapture(artifacts.context) !== undefined,
        true,
      );
      return {
        sessionId: "sde-ordered" as never,
        panel: {} as vscode.WebviewPanel,
        dispose: () => undefined,
      };
    };

    const result = await executeCompareSemanticDiffCommand(harness.deps);
    assert.strictEqual(result.ok, true);
    assert.deepStrictEqual(events, ["capture", "callback", "register", "open"]);
  });

  test("rolls back registration and opener failures in order with one notification", async () => {
    const registrationEvents: string[] = [];
    const registrationHarness = createWorkflowHarness();
    const baseBegin = registrationHarness.deps.beginSemanticDiffSourceCapture!;
    registrationHarness.deps.beginSemanticDiffSourceCapture = (input) => {
      const capture = baseBegin(input);
      return {
        ...capture,
        release: () => {
          registrationEvents.push("release");
          capture.release();
        },
      };
    };
    registrationHarness.deps.registerSemanticDiffSourceCapture = () => {
      registrationEvents.push("register");
      throw new Error("registration failed");
    };
    registrationHarness.deps.unregisterSemanticDiffSourceCapture = () => {
      registrationEvents.push("unregister");
    };
    const registrationResult = await executeCompareSemanticDiffCommand(
      registrationHarness.deps,
    );
    assert.strictEqual(registrationResult.ok, false);
    if (registrationResult.ok)
      throw new Error("Expected registration failure.");
    assert.strictEqual(registrationResult.error.code, "source-capture-failed");
    assert.deepStrictEqual(registrationEvents, [
      "register",
      "unregister",
      "release",
    ]);

    const openerEvents: string[] = [];
    const openerErrors: string[] = [];
    const openerHarness = createWorkflowHarness();
    const openerBaseBegin = openerHarness.deps.beginSemanticDiffSourceCapture!;
    const openerRegistry = new SemanticDiffExplorerContextRegistry();
    let registeredContext: SemanticDiffOutputContext | undefined;
    openerHarness.deps.beginSemanticDiffSourceCapture = (input) => {
      const capture = openerBaseBegin(input);
      return {
        ...capture,
        release: () => {
          openerEvents.push("release");
          capture.release();
        },
      };
    };
    openerHarness.deps.registerSemanticDiffSourceCapture = (context, entry) => {
      openerEvents.push("register");
      registeredContext = context;
      openerRegistry.registerSourceCapture(context, entry);
    };
    openerHarness.deps.unregisterSemanticDiffSourceCapture = (context) => {
      openerEvents.push("unregister");
      openerRegistry.unregisterSourceCapture(context);
      throw new Error("unregister failed");
    };
    openerHarness.deps.openScheduleAwareExplorerSession = async () => {
      openerEvents.push("open");
      throw new Error("opener failed");
    };
    openerHarness.deps.showErrorMessage = async (message) => {
      openerErrors.push(message);
      return undefined;
    };
    const openerResult = await executeCompareSemanticDiffCommand(
      openerHarness.deps,
    );
    assert.deepStrictEqual(openerResult, {
      ok: false,
      error: {
        code: "explorer-open-failed",
        message: "Semantic diff Explorer could not be opened.",
      },
    });
    assert.deepStrictEqual(openerEvents, [
      "register",
      "open",
      "unregister",
      "release",
    ]);
    assert.deepStrictEqual(openerErrors, [
      "Semantic diff Explorer could not be opened.",
    ]);
    assert.ok(registeredContext);
    assert.strictEqual(
      openerRegistry.sourceCapture(registeredContext),
      undefined,
    );
  });

  test("rejects a stale capture without creating a partial Explorer session", async () => {
    const harness = createWorkflowHarness();
    const baseBegin = harness.deps.beginSemanticDiffSourceCapture!;
    let releaseCount = 0;
    let registerCount = 0;
    let openCount = 0;
    harness.deps.beginSemanticDiffSourceCapture = (input) => {
      const capture = baseBegin(input);
      return {
        ...capture,
        bind: () => ({ ok: false as const, code: "capture-released" as const }),
        release: () => {
          releaseCount += 1;
          capture.release();
        },
      };
    };
    harness.deps.registerSemanticDiffSourceCapture = () => {
      registerCount += 1;
    };
    harness.deps.openScheduleAwareExplorerSession = async () => {
      openCount += 1;
      throw new Error("stale capture must not open Explorer");
    };

    const result = await executeCompareSemanticDiffCommand(harness.deps);

    assert.deepStrictEqual(result, {
      ok: false,
      error: {
        code: "source-capture-failed",
        message: "Semantic diff source capture could not be established.",
      },
    });
    assert.strictEqual(releaseCount, 1);
    assert.strictEqual(registerCount, 0);
    assert.strictEqual(openCount, 0);
  });

  test("cancelling period selection performs no capture or downstream work", async () => {
    const beforeUri = vscode.Uri.parse("file:///before-cancel.ajs");
    let captureCount = 0;
    let callbackCount = 0;
    let openCount = 0;
    const deps: SemanticDiffCommandDeps = {
      getActiveEditor: () =>
        ({
          document: {
            uri: vscode.Uri.parse("file:///after-cancel.ajs"),
            version: 1,
            getText: () => "unit=after,,jp1admin,;{ty=g;}",
          },
        }) as unknown as vscode.TextEditor,
      showQuickPick: async () => undefined,
      showWorkflowQuickPick: async (items) =>
        items[0]?.workflowKind === "file" ? items[0] : undefined,
      showOpenDialog: async () => [beforeUri],
      openTextDocument: async () =>
        ({
          uri: beforeUri,
          version: 1,
          getText: () => "unit=before,,jp1admin,;{ty=g;}",
        }) as unknown as vscode.TextDocument,
      readFile: async () => new TextEncoder().encode("unused"),
      showErrorMessage: async () => undefined,
      openReport: async () => undefined,
      buildSemanticDiffReportData: () => ({ ok: true, result: emptyResult() }),
      buildSemanticDiffPresentationArtifacts: () => {
        callbackCount += 1;
        return {
          context: { result: emptyResult(), summary: {} as never },
          scheduleImpact: { kind: "unavailable", reason: "not-requested" },
        } as SemanticDiffPresentationArtifacts;
      },
      beginSemanticDiffSourceCapture: () => {
        captureCount += 1;
        throw new Error("capture must not begin");
      },
      sourceHandleIdAllocator: createSemanticDiffSourceHandleIdAllocator(),
      openScheduleAwareExplorerSession: async () => {
        openCount += 1;
        throw new Error("Explorer must not open");
      },
      language: "ja-JP",
    };
    let quickPickCall = 0;
    deps.showWorkflowQuickPick = async (items) => {
      quickPickCall += 1;
      return quickPickCall === 1 ? items[0] : undefined;
    };

    const result = await executeCompareSemanticDiffCommand(deps);

    assert.deepStrictEqual(result, {
      ok: false,
      error: {
        code: "cancelled",
        message: "セマンティック差分をキャンセルしました。",
      },
    });
    assert.strictEqual(captureCount, 0);
    assert.strictEqual(callbackCount, 0);
    assert.strictEqual(openCount, 0);
  });

  test("compares Git HEAD through an opaque provider snapshot", async () => {
    const harness = createWorkflowHarness();
    const provider = new VscodeGitHeadContentProvider();
    const headContent = "unit=head,,jp1admin,;{ty=g;}";
    let receivedBeforeUri: vscode.Uri | undefined;
    let callbackInput:
      | { beforeContent: string; afterContent: string }
      | undefined;
    const result = await executeCompareSemanticDiffCommand({
      ...harness.deps,
      showWorkflowQuickPick: async (items) =>
        items.find((item) => item.workflowKind === "git-head") ?? items[0],
      readGitHeadDefinition: async () => ({
        kind: "ready" as const,
        content: headContent,
        ref: "HEAD" as const,
      }),
      gitHeadSnapshotProvider: provider,
      buildSemanticDiffPresentationArtifacts: (input, scopedParser) => {
        callbackInput = input;
        return createBuildSemanticDiffPresentationArtifacts(createTestParser())(
          input,
          scopedParser,
        );
      },
      registerSemanticDiffSourceCapture: (context, entry) => {
        receivedBeforeUri = entry.sources.before.uri;
        harness.deps.registerSemanticDiffSourceCapture?.(context, entry);
      },
    });

    assert.deepStrictEqual(result, {
      ok: true,
      action: "explorer-opened",
      sessionId: "sde-workflow-harness",
      source: "git-head",
      period: "not-requested",
    });
    assert.strictEqual(callbackInput?.beforeContent, headContent);
    assert.strictEqual(receivedBeforeUri?.scheme, "ajsbutler-git-head");
    assert.strictEqual(
      provider.provideTextDocumentContent(receivedBeforeUri!),
      headContent,
    );
  });

  test("keeps file comparison available when Git HEAD is unavailable", async () => {
    const harness = createWorkflowHarness();
    let callbackCount = 0;
    let openCount = 0;
    const result = await executeCompareSemanticDiffCommand({
      ...harness.deps,
      showWorkflowQuickPick: async (items) =>
        items.find((item) => item.workflowKind === "file") ?? items[0],
      readGitHeadDefinition: async () => ({
        kind: "unavailable" as const,
        reason: "extension-missing" as const,
      }),
      buildSemanticDiffPresentationArtifacts: (input, scopedParser) => {
        callbackCount += 1;
        return createBuildSemanticDiffPresentationArtifacts(createTestParser())(
          input,
          scopedParser,
        );
      },
      openScheduleAwareExplorerSession: async (artifacts) => {
        openCount += 1;
        return harness.deps.openScheduleAwareExplorerSession!(artifacts);
      },
    });

    assert.deepStrictEqual(result, {
      ok: true,
      action: "explorer-opened",
      sessionId: "sde-workflow-harness",
      source: "file",
      period: "not-requested",
    });
    assert.strictEqual(callbackCount, 1);
    assert.strictEqual(openCount, 1);
  });

  test("returns a localized stable reason for Git HEAD failure", async () => {
    const harness = createWorkflowHarness();
    const provider = new VscodeGitHeadContentProvider();
    let callbackCount = 0;
    const result = await executeCompareSemanticDiffCommand({
      ...harness.deps,
      language: "ja-JP",
      showWorkflowQuickPick: async (items) =>
        items.find((item) => item.workflowKind === "git-head") ?? items[0],
      readGitHeadDefinition: async () => ({
        kind: "unavailable" as const,
        reason: "head-source-missing" as const,
      }),
      gitHeadSnapshotProvider: provider,
      buildSemanticDiffPresentationArtifacts: () => {
        callbackCount += 1;
        throw new Error("must not build after Git failure");
      },
    });

    assert.deepStrictEqual(result, {
      ok: false,
      error: {
        code: "git-head-unavailable",
        reason: "head-source-missing",
        message: "Git HEAD に定義が見つかりません。",
      },
    });
    assert.strictEqual(callbackCount, 0);
  });

  test("releases Git reservations when capture setup is unavailable", async () => {
    const harness = createWorkflowHarness();
    const provider = new VscodeGitHeadContentProvider();
    const deps: SemanticDiffCommandDeps = {
      ...harness.deps,
      showWorkflowQuickPick: async (items) =>
        items.find((item) => item.workflowKind === "git-head") ?? items[0],
      readGitHeadDefinition: async () => ({
        kind: "ready" as const,
        content: "unit=head,,jp1admin,;{ty=g;}",
        ref: "HEAD" as const,
      }),
      gitHeadSnapshotProvider: provider,
      beginSemanticDiffSourceCapture: undefined,
    };

    const first = await executeCompareSemanticDiffCommand(deps);
    const second = await executeCompareSemanticDiffCommand(deps);
    for (const result of [first, second]) {
      assert.deepStrictEqual(result, {
        ok: false,
        error: {
          code: "source-capture-failed",
          message: "Semantic diff source capture could not be established.",
        },
      });
    }
    assert.strictEqual(provider.size, 0);
  });

  test("fails before capture when the Git snapshot provider is at capacity", async () => {
    const harness = createWorkflowHarness();
    const provider = new VscodeGitHeadContentProvider();
    const reservations = Array.from(
      { length: MAX_GIT_HEAD_SNAPSHOT_ENTRIES },
      (_, index) => provider.reserve(`occupied-${index}`),
    );
    let captureCount = 0;
    const result = await executeCompareSemanticDiffCommand({
      ...harness.deps,
      showWorkflowQuickPick: async (items) =>
        items.find((item) => item.workflowKind === "git-head") ?? items[0],
      readGitHeadDefinition: async () => ({
        kind: "ready" as const,
        content: "unit=head,,jp1admin,;{ty=g;}",
        ref: "HEAD" as const,
      }),
      gitHeadSnapshotProvider: provider,
      beginSemanticDiffSourceCapture: () => {
        captureCount += 1;
        throw new Error("capture must not begin at capacity");
      },
    });

    assert.deepStrictEqual(result, {
      ok: false,
      error: {
        code: "explorer-open-failed",
        message: "Git HEAD source snapshots are temporarily full.",
      },
    });
    assert.strictEqual(captureCount, 0);
    assert.strictEqual(provider.size, MAX_GIT_HEAD_SNAPSHOT_ENTRIES);
    reservations.forEach((entry) => {
      if (entry.kind === "reserved") entry.reservation.release();
    });
  });
});
