import * as assert from "assert";
import { buildSemanticDiffOutputContext } from "../../application/semantic-diff/buildSemanticDiffOutputContext";
import { createSemanticDiffExplorerSession } from "../../application/semantic-diff/semanticDiffExplorer";
import type { SemanticDiffResult } from "../../application/semantic-diff/semanticDiffDto";
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

suite("Semantic diff Explorer host registries", () => {
  test("uses context identity and exact-owner unregister", () => {
    const context = emptyContext();
    const sameFacts = emptyContext();
    const session = createSemanticDiffExplorerSession(context);
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
    const session = createSemanticDiffExplorerSession(context);
    const outputActionId = "sde-action-900000002" as never;
    const registry = new SemanticDiffExplorerActionRegistry();
    registry.register(session, outputActionId);
    assert.strictEqual(registry.has(outputActionId, session.sessionId), true);
    registry.remove(session.sessionId);
    assert.strictEqual(registry.has(outputActionId, session.sessionId), false);
  });
});
