import * as assert from "assert";
import * as vscode from "vscode";
import {
  createSemanticDiffCaptureScopeIdAllocator,
  createSemanticDiffSourceHandleIdAllocator,
  createSemanticDiffSourceIndexIdAllocator,
} from "../../application/parsing/AjsParserWithSourceIndexPort";
import type { SemanticDiffSourceCaptureFactory } from "../../application/semantic-diff/semanticDiffSourceCapture";
import type { BuildSemanticDiffReportData } from "../../application/semantic-diff/buildSemanticDiffReportData";
import { createBeginSemanticDiffSourceCapture } from "../../application/semantic-diff/semanticDiffSourceCapture";
import type {
  SemanticDiffOutputContext,
  SemanticDiffResult,
} from "../../application/semantic-diff/semanticDiffDto";
import { AntlrAjsParser } from "../../infrastructure/parser/AntlrAjsParser";
import {
  createSemanticDiffSubscriptions,
  createSourceCaptureRegistrar,
} from "../../bootstrap/extension/semanticDiffWiring";
import { SemanticDiffExplorerContextRegistry } from "../../presentation/vscode/semantic-diff/panel/semanticDiffExplorerRegistry";
import {
  createSemanticDiffExplorerActionIdAllocator,
  createSemanticDiffExplorerSessionIdAllocator,
} from "../../application/semantic-diff/semanticDiffExplorerDto";
import { VscodeGitHeadContentProvider } from "../../infrastructure/git/VscodeGitHeadContentProvider";
import { createSemanticDiffFlowSourceHost } from "../../presentation/vscode/semantic-diff/flow/semanticDiffFlowSourceHost";
import type { SemanticDiffFlowViewerBridge } from "../../bootstrap/extension/semanticDiffFlowViewerBridge";

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

suite("Semantic diff wiring", () => {
  test("registers the Git HEAD provider alongside the compare command", () => {
    const buildReport: BuildSemanticDiffReportData = () => ({
      ok: true,
      result: emptyResult(),
    });
    const beginCapture: SemanticDiffSourceCaptureFactory = () => {
      throw new Error("not called");
    };
    const subscriptions = createSemanticDiffSubscriptions({
      extensionContext: { subscriptions: [] } as vscode.ExtensionContext,
      buildSemanticDiffReportData: buildReport,
      beginSemanticDiffSourceCapture: beginCapture,
      sourceHandleIdAllocator: createSemanticDiffSourceHandleIdAllocator(),
      sessionIdAllocator: createSemanticDiffExplorerSessionIdAllocator(),
      actionIdAllocator: createSemanticDiffExplorerActionIdAllocator(),
      readGitHeadDefinition: async () => ({
        kind: "unavailable" as const,
        reason: "extension-missing" as const,
      }),
    });
    const provider = subscriptions.find(
      (subscription) => subscription instanceof VscodeGitHeadContentProvider,
    );
    assert.ok(provider);
    if (!(provider instanceof VscodeGitHeadContentProvider)) return;
    const reservation = provider.reserve("git-head-test");
    assert.strictEqual(reservation.kind, "reserved");
    if (reservation.kind === "reserved") reservation.reservation.release();
    subscriptions.forEach((subscription) => subscription.dispose());
  });

  test("registers the exact borrowed source entry through the bootstrap registrar", () => {
    const parser = new AntlrAjsParser({
      sourceIndexIdAllocator: createSemanticDiffSourceIndexIdAllocator(),
    });
    const beginCapture = createBeginSemanticDiffSourceCapture(
      parser,
      createSemanticDiffCaptureScopeIdAllocator(),
    );
    const beforeUri = vscode.Uri.parse("file:///wiring-before.ajs");
    const afterUri = vscode.Uri.parse("file:///wiring-after.ajs");
    const beforeUriString = beforeUri.toString();
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
        version: 2,
      },
    });
    capture.parser.parse("unit=before,,jp1admin,;{ty=g;}");
    capture.parser.parse("unit=after,,jp1admin,;{ty=g;}");
    const context: SemanticDiffOutputContext = {
      result: emptyResult(),
      summary: {} as never,
    };
    const binding = capture.bind(context);
    assert.strictEqual(binding.ok, true);
    if (!binding.ok) return;
    const release = (): void => capture.release();
    const entry = {
      binding,
      sources: {
        before: {
          side: "before" as const,
          sourceHandleId: binding.before.sourceHandleId,
          text: "unit=before,,jp1admin,;{ty=g;}",
          version: 1,
          uri: beforeUri,
        },
        after: {
          side: "after" as const,
          sourceHandleId: binding.after.sourceHandleId,
          text: "unit=after,,jp1admin,;{ty=g;}",
          version: 2,
          uri: afterUri,
        },
      },
      release,
    };
    const registry = new SemanticDiffExplorerContextRegistry();
    createSourceCaptureRegistrar(registry)(context, entry);

    assert.strictEqual(registry.sourceCapture(context)?.binding, binding);
    assert.strictEqual(
      registry.sourceCapture(context)?.sources.before.uri,
      beforeUri,
    );
    const sourceHost = createSemanticDiffFlowSourceHost({
      sourceCapture: (outputContext) => registry.sourceCapture(outputContext),
      getOpenTextDocuments: () => [],
      openFlow: async () => {
        throw new Error("Flow viewer is not registered.");
      },
    });
    assert.deepStrictEqual(sourceHost.getSourceSnapshot?.("before", context), {
      sourceHandleId: binding.before.sourceHandleId,
      version: 1,
      text: "unit=before,,jp1admin,;{ty=g;}",
      uri: beforeUriString,
    });
    registry.unregisterSourceCapture(context);
    release();
    assert.strictEqual(registry.sourceCapture(context), undefined);
  });

  test("keeps the flow bridge optional during subscription composition", () => {
    let openCalls = 0;
    const flowBridge: SemanticDiffFlowViewerBridge = {
      setFactory: () => undefined,
      onReady: () => undefined,
      onDocumentChanged: () => undefined,
      open: async () => {
        openCalls += 1;
        throw new Error("Flow should open only after a user action.");
      },
    };
    const subscriptions = createSemanticDiffSubscriptions({
      extensionContext: { subscriptions: [] } as vscode.ExtensionContext,
      buildSemanticDiffReportData: () => ({
        ok: true,
        result: emptyResult(),
      }),
      beginSemanticDiffSourceCapture: () => {
        throw new Error("not called");
      },
      sourceHandleIdAllocator: createSemanticDiffSourceHandleIdAllocator(),
      sessionIdAllocator: createSemanticDiffExplorerSessionIdAllocator(),
      actionIdAllocator: createSemanticDiffExplorerActionIdAllocator(),
      flowBridge,
    });

    assert.strictEqual(openCalls, 0);
    subscriptions.forEach((subscription) => subscription.dispose());
    assert.strictEqual(openCalls, 0);
  });
});
