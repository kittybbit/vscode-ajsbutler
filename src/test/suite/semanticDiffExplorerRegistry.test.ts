import * as assert from "assert";
import * as vscode from "vscode";
import { buildSemanticDiffOutputContext } from "../../application/semantic-diff/buildSemanticDiffOutputContext";
import {
  createSemanticDiffExplorerActionIdAllocator,
  createSemanticDiffExplorerSession,
  createSemanticDiffExplorerSessionIdAllocator,
} from "../../application/semantic-diff/semanticDiffExplorer";
import type { SemanticDiffResult } from "../../application/semantic-diff/semanticDiffDto";
import {
  beginSemanticDiffSourceCapture,
  type SemanticDiffSourceCaptureBinding,
} from "../../application/semantic-diff/semanticDiffSourceCapture";
import {
  createSemanticDiffCaptureScopeIdAllocator,
  createSemanticDiffSourceHandleIdAllocator,
  createSemanticDiffSourceIndexIdAllocator,
} from "../../application/parsing/AjsParserWithSourceIndexPort";
import {
  SemanticDiffExplorerActionRegistry,
  SemanticDiffExplorerContextRegistry,
} from "../../presentation/vscode/semantic-diff/semanticDiffExplorerRegistry";

const emptyContext = () =>
  buildSemanticDiffOutputContext({
    inputs: {
      before: { side: "before", unitIds: [], relations: [] },
      after: { side: "after", unitIds: [], relations: [] },
    },
    changes: [],
    identityDecisions: [],
    confirmationRequired: [],
    unsupportedItems: [],
    limitations: [],
  } satisfies SemanticDiffResult);
const scopeIds = createSemanticDiffCaptureScopeIdAllocator();

const createBoundSourceCapture = () => {
  const indexIds = createSemanticDiffSourceIndexIdAllocator();
  const handleIds = createSemanticDiffSourceHandleIdAllocator();
  const capture = beginSemanticDiffSourceCapture(
    {
      before: {
        side: "before",
        sourceHandleId: handleIds(),
        text: "before",
        version: 1,
      },
      after: {
        side: "after",
        sourceHandleId: handleIds(),
        text: "after",
        version: 2,
      },
    },
    {
      parseWithSourceIndex: (text) => ({
        ok: true,
        document: { rootUnits: [], warnings: [] },
        sourceIndex: {
          sourceIndexId: indexIds(),
          unitEntries: [
            {
              unitId: text,
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
    },
    scopeIds,
  );
  capture.parser.parse("before");
  capture.parser.parse("after");
  const context = emptyContext();
  const binding = capture.bind(context);
  if (!binding.ok) throw new Error("Expected source capture binding.");
  return { capture, context, binding };
};

const hostSources = (binding: SemanticDiffSourceCaptureBinding) => ({
  before: {
    side: "before" as const,
    sourceHandleId: binding.before.sourceHandleId,
    text: "before",
    version: 1,
    uri: vscode.Uri.parse("untitled:before.ajs"),
  },
  after: {
    side: "after" as const,
    sourceHandleId: binding.after.sourceHandleId,
    text: "after",
    version: 2,
    uri: vscode.Uri.parse("untitled:after.ajs"),
  },
});

suite("Semantic diff Explorer host registries", () => {
  test("uses context identity and exact-owner unregister", () => {
    const context = emptyContext();
    const sameFacts = emptyContext();
    const session = createSemanticDiffExplorerSession(context, {
      sessionIdAllocator: createSemanticDiffExplorerSessionIdAllocator(),
      actionIdAllocator: createSemanticDiffExplorerActionIdAllocator(),
    });
    let disposed = 0;
    const entry = {
      context,
      session,
      outputActionId: "sde-action-900000001" as never,
      dispose: () => {
        disposed += 1;
      },
    };
    const registry = new SemanticDiffExplorerContextRegistry();
    registry.register(entry);
    assert.strictEqual(registry.get(context), entry);
    assert.strictEqual(registry.get(sameFacts), undefined);
    assert.strictEqual(registry.unregister(sameFacts), false);
    assert.strictEqual(registry.unregister(context, { ...entry }), false);
    assert.strictEqual(registry.unregister(context, entry), true);
    assert.strictEqual(registry.size, 0);
    entry.dispose();
    assert.strictEqual(disposed, 1);
  });

  test("keeps action membership scoped to one session", () => {
    const context = emptyContext();
    const session = createSemanticDiffExplorerSession(context, {
      sessionIdAllocator: createSemanticDiffExplorerSessionIdAllocator(),
      actionIdAllocator: createSemanticDiffExplorerActionIdAllocator(),
    });
    const outputActionId = "sde-action-900000002" as never;
    const registry = new SemanticDiffExplorerActionRegistry();
    registry.register(session, outputActionId);
    assert.strictEqual(registry.has(outputActionId, session.sessionId), true);
    registry.remove(session.sessionId);
    assert.strictEqual(registry.has(outputActionId, session.sessionId), false);
  });

  test("retains immutable host source snapshots and invalidates direct releases", () => {
    const { capture, context, binding } = createBoundSourceCapture();
    const registry = new SemanticDiffExplorerContextRegistry();
    registry.registerSourceCapture(context, {
      binding,
      sources: hostSources(binding),
      release: capture.release,
    });

    const retained = registry.sourceCapture(context);
    assert.ok(retained);
    if (retained === undefined) throw new Error("Expected source capture.");
    assert.notStrictEqual(retained.sources.before, hostSources(binding).before);
    assert.ok(Object.isFrozen(retained));
    assert.ok(Object.isFrozen(retained.sources));
    assert.ok(Object.isFrozen(retained.sources.before));
    assert.ok(Object.isFrozen(retained.sources.before.uri));
    assert.strictEqual(retained.sources.before.text, "before");

    capture.release();
    assert.strictEqual(registry.sourceCapture(context), undefined);
    assert.throws(
      () =>
        registry.registerSourceCapture(context, {
          binding,
          sources: hostSources(binding),
          release: capture.release,
        }),
      /released or unknown/,
    );
  });
});
