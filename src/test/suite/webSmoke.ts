import * as vscode from "vscode";
import {
  executeCompareSemanticDiffCommand,
  type SemanticDiffCommandDeps,
} from "../../presentation/vscode/commands/semanticDiffCommand";
import type { SemanticDiffSourceCapture } from "../../application/semantic-diff/semanticDiffSourceCapture";
import type { SemanticDiffOutputContext } from "../../application/semantic-diff/buildSemanticDiffOutputContext";
import type { SemanticDiffExplorerSessionHandle } from "../../presentation/vscode/semantic-diff/panel/semanticDiffExplorerPanel";
import {
  collectUniqueAjsUnits,
  createAjsDocumentIndex,
} from "../../domain/models/ajs/AjsDocumentIndex";
import type { AjsDocument, AjsUnit } from "../../domain/models/ajs/AjsDocument";
import { createSemanticDiffFlowSourceHost } from "../../presentation/vscode/semantic-diff/flow/semanticDiffFlowSourceHost";
import type { SemanticDiffSourceCaptureEntry } from "../../presentation/vscode/semantic-diff/source/semanticDiffExplorerSourceTypes";
import type { SemanticDiffFlowPanel } from "../../presentation/vscode/semantic-diff/flow/semanticDiffExplorerFlow";

const LANGUAGE_ID = "jp1ajs";

const reportWebScenario = (message: string): void => {
  globalThis.console.log(message);
};

const activateExtension = async () => {
  const extension = vscode.extensions.getExtension(
    "kittybbit.vscode-ajsbutler",
  );
  if (!extension) {
    throw new Error("Extension not found");
  }
  await extension?.activate();
};

const waitFor = async (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const waitForCondition = async (
  condition: () => boolean,
  timeoutMs = 5000,
  intervalMs = 100,
): Promise<void> => {
  const deadline = Date.now() + timeoutMs;
  while (!condition()) {
    if (Date.now() >= deadline) {
      throw new Error("Timed out waiting for the expected VS Code Web state");
    }
    await waitFor(intervalMs);
  }
};

export async function run(): Promise<void> {
  await activateExtension();

  const web12Jobnet: AjsUnit = {
    id: "/web12/jobnet",
    name: "jobnet",
    unitAttribute: "jobnet,,jp1admin,",
    unitType: "n",
    absolutePath: "/web12/jobnet",
    depth: 1,
    parentId: "/web12",
    isRoot: false,
    isRootJobnet: true,
    hasSchedule: true,
    hasWaitedFor: false,
    layout: { h: 1, v: 1 },
    parameters: [],
    relations: [],
    children: [],
  };
  const web12Group: AjsUnit = {
    ...web12Jobnet,
    id: "/web12",
    name: "group",
    unitAttribute: "group,,jp1admin,",
    unitType: "g",
    absolutePath: "/web12",
    depth: 0,
    parentId: undefined,
    isRoot: true,
    isRootJobnet: false,
    hasSchedule: false,
    parameters: [{ key: "ty", value: "g" }],
    children: [web12Jobnet],
  };
  const web12Document: AjsDocument = {
    rootUnits: [web12Group],
    warnings: [],
  };
  const web12Units = collectUniqueAjsUnits(web12Document);
  const web12Index = createAjsDocumentIndex(web12Units);
  if (
    web12Units.length !== 2 ||
    web12Units[0] !== web12Group ||
    web12Units[1] !== web12Jobnet ||
    web12Index.byId.get("/web12/jobnet")?.[0] !== web12Jobnet ||
    web12Index.byPath.get("/web12")?.[0] !== web12Group
  ) {
    throw new Error("WEB-12 normalized document index failed");
  }
  reportWebScenario("WEB-12 passed: browser normalized document index");

  const web14Uri = vscode.Uri.parse("untitled:web-14-source");
  const web14Context = {} as SemanticDiffOutputContext;
  let web14Text = "ty=g;";
  let web14Version = 1;
  const web14Capture = {
    binding: {} as never,
    sources: {
      before: {
        side: "before" as const,
        sourceHandleId: "web-14-before",
        version: 1,
        text: "before text",
        uri: vscode.Uri.parse("untitled:web-14-before"),
      },
      after: {
        side: "after" as const,
        sourceHandleId: "web-14-after",
        version: 1,
        text: "ty=g;",
        uri: web14Uri,
      },
    },
    release: () => undefined,
  } as unknown as SemanticDiffSourceCaptureEntry;
  const web14Document = {
    uri: web14Uri,
    get version() {
      return web14Version;
    },
    getText: () => web14Text,
  } as vscode.TextDocument;
  let web14OpenedUri: vscode.Uri | undefined;
  const web14FlowPanel = {
    flowUri: web14Uri.toString(),
  } as SemanticDiffFlowPanel;
  const web14Host = createSemanticDiffFlowSourceHost({
    sourceCapture: () => web14Capture,
    getOpenTextDocuments: () => [web14Document],
    openFlow: async (uri) => {
      web14OpenedUri = uri;
      return web14FlowPanel;
    },
  });
  const web14Snapshot = web14Host.getSourceSnapshot?.("after", web14Context);
  if (
    !web14Snapshot ||
    !web14Host.isSourceCurrent?.("after", web14Context, web14Snapshot)
  ) {
    throw new Error("WEB-14 browser fresh flow source failed");
  }
  await web14Host.open("after", "/web14/job", web14Context);
  if (web14OpenedUri?.toString() !== web14Uri.toString()) {
    throw new Error("WEB-14 browser flow source URI translation failed");
  }
  web14Text = "ty=g; edited";
  web14Version += 1;
  if (web14Host.isSourceCurrent?.("after", web14Context, web14Snapshot)) {
    throw new Error("WEB-14 browser stale flow source was accepted");
  }
  reportWebScenario(
    "WEB-14 passed: browser fresh/stale source and captured URI opening",
  );

  web14Text = "ty=g;";
  web14Version = 9;
  const web15NullCapture = {
    ...web14Capture,
    sources: {
      ...web14Capture.sources,
      after: { ...web14Capture.sources.after, version: null },
    },
  } as SemanticDiffSourceCaptureEntry;
  const web15Host = createSemanticDiffFlowSourceHost({
    sourceCapture: () => web15NullCapture,
    getOpenTextDocuments: () => [web14Document],
    openFlow: async () => web14FlowPanel,
  });
  const web15Snapshot = web15Host.getSourceSnapshot?.("after", web14Context);
  if (
    !web15Snapshot ||
    !web15Host.isSourceCurrent?.("after", web14Context, web15Snapshot)
  ) {
    throw new Error("WEB-15 null-version source compatibility failed");
  }
  reportWebScenario("WEB-15 passed: browser null-version source compatibility");

  const commands = await vscode.commands.getCommands(true);
  for (const command of [
    "open.ajsbutler.tableViewer",
    "open.ajsbutler.flowViewer",
    "ajsbutler.importDefinitionViaWebApiBeta",
    "ajsbutler.compareSemanticDiff",
    "ajsbutler.copySemanticDiffMarkdown",
    "ajsbutler.saveSemanticDiffOutput",
  ]) {
    if (!commands.includes(command)) {
      throw new Error(`Expected command to be registered: ${command}`);
    }
  }

  let sourceReadCount = 0;
  let reportCount = 0;
  let sessionCount = 0;
  const web7Deps: SemanticDiffCommandDeps = {
    getActiveEditor: () => undefined,
    showQuickPick: async () => undefined,
    showOpenDialog: async () => {
      sourceReadCount += 1;
      return undefined;
    },
    showErrorMessage: async () => undefined,
    readFile: async () => {
      sourceReadCount += 1;
      return new Uint8Array();
    },
    openReport: async () => {
      reportCount += 1;
    },
    buildSemanticDiffReportData: () => {
      reportCount += 1;
      throw new Error("WEB-7 report build must not run");
    },
    sourceHandleIdAllocator: () => {
      sessionCount += 1;
      return "web-7-source" as never;
    },
  };
  const web7Result = await executeCompareSemanticDiffCommand(web7Deps);
  const web7GuardPassed =
    "error" in web7Result && web7Result.error.code === "no-active-editor";
  if (
    !web7GuardPassed ||
    sourceReadCount !== 0 ||
    reportCount !== 0 ||
    sessionCount !== 0
  ) {
    throw new Error(
      `WEB-7 no-active-editor guard failed: ${JSON.stringify({
        result: web7Result,
        sourceReadCount,
        reportCount,
        sessionCount,
      })}`,
    );
  }
  reportWebScenario(
    `WEB-7 passed: browser=1 sourceReads=${sourceReadCount} reports=${reportCount} sessions=${sessionCount}`,
  );

  const web8BeforeUri = vscode.Uri.parse("untitled:web-8-before");
  const web8AfterUri = vscode.Uri.parse("untitled:web-8-after");
  const web8Document = (uri: vscode.Uri, content: string) =>
    ({
      uri,
      version: 1,
      getText: () => content,
    }) as unknown as vscode.TextDocument;
  const web8AfterDocument = web8Document(web8AfterUri, "ty=g;\n");
  const web8BeforeDocument = web8Document(web8BeforeUri, "ty=g;\n");
  const web8Context = {
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
  } as unknown as SemanticDiffOutputContext;
  let web8Bindings = 0;
  let web8Registrations = 0;
  let web8Unregistrations = 0;
  let web8Releases = 0;
  let web8Opened = 0;
  let web8OpenShouldFail = false;
  const web8Capture = (): SemanticDiffSourceCapture => ({
    parser: {} as never,
    bind: () => {
      web8Bindings += 1;
      return {
        ok: true,
        context: web8Context,
        before: {
          sourceIndex: 0 as never,
          sourceHandleId: "web-8-before" as never,
        },
        after: {
          sourceIndex: 1 as never,
          sourceHandleId: "web-8-after" as never,
        },
      };
    },
    release: () => {
      web8Releases += 1;
    },
  });
  const web8Deps: SemanticDiffCommandDeps = {
    getActiveEditor: () =>
      ({ document: web8AfterDocument }) as unknown as vscode.TextEditor,
    showQuickPick: async () => undefined,
    showWorkflowQuickPick: async (items) => items[0],
    showOpenDialog: async () => [web8BeforeUri],
    showErrorMessage: async () => undefined,
    readFile: async () => new Uint8Array(),
    openTextDocument: async () => web8BeforeDocument,
    openReport: async () => undefined,
    buildSemanticDiffReportData: () => ({
      ok: true,
      result: web8Context.result,
    }),
    buildSemanticDiffOutputContext: () => web8Context,
    beginSemanticDiffSourceCapture: () => web8Capture(),
    sourceHandleIdAllocator: (() => {
      let next = 0;
      return () => `web-8-${next++}` as never;
    })(),
    registerSemanticDiffSourceCapture: () => {
      web8Registrations += 1;
    },
    unregisterSemanticDiffSourceCapture: () => {
      web8Unregistrations += 1;
    },
    openExplorer: async () => {
      if (web8OpenShouldFail) throw new Error("WEB-8 open failure");
      web8Opened += 1;
      return {
        sessionId: "web-8-session",
      } as SemanticDiffExplorerSessionHandle;
    },
  };
  const web8Result = await executeCompareSemanticDiffCommand(web8Deps);
  if (
    !(
      "ok" in web8Result &&
      web8Result.ok &&
      web8Result.action === "explorer-opened" &&
      web8Result.source === "file"
    ) ||
    web8Bindings !== 1 ||
    web8Registrations !== 1 ||
    web8Opened !== 1 ||
    web8Releases !== 0
  ) {
    throw new Error(
      `WEB-8 artifact/Explorer finalization failed: ${JSON.stringify({
        result: web8Result,
        bindings: web8Bindings,
        registrations: web8Registrations,
        opened: web8Opened,
        releases: web8Releases,
      })}`,
    );
  }
  web8OpenShouldFail = true;
  const web8RollbackResult = await executeCompareSemanticDiffCommand(web8Deps);
  if (
    !("error" in web8RollbackResult) ||
    web8RollbackResult.error.code !== "explorer-open-failed" ||
    web8Unregistrations !== 1 ||
    (web8Releases as number) !== 1
  ) {
    throw new Error(
      `WEB-8 Explorer cleanup failed: ${JSON.stringify({
        result: web8RollbackResult,
        unregistrations: web8Unregistrations,
        releases: web8Releases,
      })}`,
    );
  }
  reportWebScenario(
    `WEB-8 passed: bindings=${web8Bindings} registrations=${web8Registrations} opened=${web8Opened} rollbacks=${web8Releases}`,
  );

  const invalidDocument = await vscode.workspace.openTextDocument({
    language: LANGUAGE_ID,
    content: "unit=root,,jp1admin,;\n{\n  ty=g\n}\n",
  });
  await vscode.window.showTextDocument(invalidDocument);
  await waitFor(200);
  const diagnostics = vscode.languages.getDiagnostics(invalidDocument.uri);
  if (diagnostics.length === 0) {
    throw new Error("Expected diagnostics for invalid JP1/AJS document");
  }

  const hoverDocument = await vscode.workspace.openTextDocument({
    language: LANGUAGE_ID,
    content: "ty=g;\n",
  });
  await vscode.window.showTextDocument(hoverDocument);
  const hovers = (await vscode.commands.executeCommand(
    "vscode.executeHoverProvider",
    hoverDocument.uri,
    new vscode.Position(0, 0),
  )) as vscode.Hover[];
  if (hovers.length === 0) {
    throw new Error("Expected hover results for parameter symbol");
  }

  const previewDocument = await vscode.workspace.openTextDocument({
    language: LANGUAGE_ID,
    content: "unit=root,,jp1admin,;\n{\n  ty=n;\n}\n",
  });
  await vscode.window.showTextDocument(previewDocument);
  await vscode.commands.executeCommand("open.ajsbutler.tableViewer");
  await vscode.commands.executeCommand("open.ajsbutler.flowViewer");

  const expectedPanelTitle =
    previewDocument.uri.path.split("/").filter(Boolean).pop() ??
    previewDocument.uri.scheme;
  await waitForCondition(
    () =>
      vscode.window.tabGroups.activeTabGroup.activeTab?.label ===
      expectedPanelTitle,
  );
  const activeTab = vscode.window.tabGroups.activeTabGroup.activeTab;
  if (activeTab?.label !== expectedPanelTitle) {
    throw new Error(
      `Expected active viewer title ${expectedPanelTitle}, received ${activeTab?.label ?? "none"}`,
    );
  }
}
