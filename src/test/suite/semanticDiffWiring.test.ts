import * as assert from "assert";
import * as vscode from "vscode";
import {
  createSemanticDiffCaptureScopeIdAllocator,
  createSemanticDiffSourceHandleIdAllocator,
  createSemanticDiffSourceIndexIdAllocator,
} from "../../application/parsing/AjsParserWithSourceIndexPort";
import { createBeginSemanticDiffSourceCapture } from "../../application/semantic-diff/semanticDiffSourceCapture";
import type {
  SemanticDiffOutputContext,
  SemanticDiffResult,
} from "../../application/semantic-diff/semanticDiffDto";
import { AntlrAjsParser } from "../../infrastructure/parser/AntlrAjsParser";
import { createSourceCaptureRegistrar } from "../../bootstrap/extension/semanticDiffWiring";
import { SemanticDiffExplorerContextRegistry } from "../../presentation/vscode/semantic-diff/semanticDiffExplorerRegistry";

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
    registry.unregisterSourceCapture(context);
    release();
    assert.strictEqual(registry.sourceCapture(context), undefined);
  });
});
