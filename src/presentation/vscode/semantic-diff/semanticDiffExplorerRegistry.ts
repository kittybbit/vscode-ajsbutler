import type {
  SemanticDiffExplorerActionId,
  SemanticDiffExplorerActionLookup,
  SemanticDiffExplorerLeaf,
  SemanticDiffExplorerSession,
  SemanticDiffExplorerSessionId,
  SemanticDiffExplorerTreeNode,
} from "../../../application/semantic-diff/semanticDiffExplorer";
import type { SemanticDiffOutputContext } from "../../../application/semantic-diff/semanticDiffDto";

export type SemanticDiffExplorerActionMetadata = Readonly<{
  kind: "source" | "flow" | "output";
  side: "before" | "after" | null;
  targetId: string | null;
}>;

export type SemanticDiffExplorerContextEntry = Readonly<{
  context: SemanticDiffOutputContext;
  session: SemanticDiffExplorerSession;
  outputActionId: SemanticDiffExplorerActionId;
  dispose: () => void;
}>;

/**
 * Host-only ownership for context/session associations. A Map keyed by the
 * actual context object deliberately preserves identity and cannot be
 * addressed by a URI, result id, or serialized webview value.
 */
export class SemanticDiffExplorerContextRegistry {
  private readonly entries = new Map<
    SemanticDiffOutputContext,
    SemanticDiffExplorerContextEntry
  >();

  public register(entry: SemanticDiffExplorerContextEntry): void {
    this.entries.set(entry.context, entry);
  }

  public get(
    context: SemanticDiffOutputContext,
  ): SemanticDiffExplorerContextEntry | undefined {
    return this.entries.get(context);
  }

  public unregister(
    context: SemanticDiffOutputContext,
    expected?: SemanticDiffExplorerContextEntry,
  ): boolean {
    if (expected !== undefined && this.entries.get(context) !== expected) {
      return false;
    }
    return this.entries.delete(context);
  }

  public get size(): number {
    return this.entries.size;
  }

  public clear(): void {
    this.entries.clear();
  }
}

export const createSemanticDiffExplorerContextRegistry =
  (): SemanticDiffExplorerContextRegistry =>
    new SemanticDiffExplorerContextRegistry();

type ActionEntry = Readonly<{
  sessionId: SemanticDiffExplorerSessionId;
  metadata: SemanticDiffExplorerActionMetadata;
}>;

/** Host-only action membership and metadata. The collection is never exposed. */
export class SemanticDiffExplorerActionRegistry {
  private readonly actions = new Map<
    SemanticDiffExplorerActionId,
    ActionEntry
  >();

  public register(
    session: SemanticDiffExplorerSession,
    outputActionId: SemanticDiffExplorerActionId,
  ): void {
    this.walkLeaves(session.viewModel.tree, session.sessionId);
    this.walkLeaves(session.allViewModel.tree, session.sessionId);
    this.actions.set(outputActionId, {
      sessionId: session.sessionId,
      metadata: { kind: "output", side: null, targetId: null },
    });
  }

  public remove(sessionId: SemanticDiffExplorerSessionId): void {
    for (const [actionId, entry] of this.actions) {
      if (entry.sessionId === sessionId) this.actions.delete(actionId);
    }
  }

  public has(
    actionId: unknown,
    sessionId: SemanticDiffExplorerSessionId,
  ): actionId is SemanticDiffExplorerActionId {
    const entry = this.actions.get(actionId as SemanticDiffExplorerActionId);
    return entry?.sessionId === sessionId;
  }

  public metadata(
    actionId: SemanticDiffExplorerActionId,
    sessionId: SemanticDiffExplorerSessionId,
  ): SemanticDiffExplorerActionMetadata | undefined {
    const entry = this.actions.get(actionId);
    return entry?.sessionId === sessionId ? entry.metadata : undefined;
  }

  public lookup(
    session: SemanticDiffExplorerSession,
    outputActionId: SemanticDiffExplorerActionId,
  ): SemanticDiffExplorerActionLookup {
    this.register(session, outputActionId);
    const ids = session.actionIds
      .toArray()
      .filter((id) => this.actions.has(id));
    ids.push(outputActionId);
    const membership = new Set(ids);
    return {
      size: membership.size,
      has: (value: unknown): value is SemanticDiffExplorerActionId =>
        typeof value === "string" &&
        membership.has(value as SemanticDiffExplorerActionId),
      toArray: () => Object.freeze([...membership]),
    };
  }

  public get size(): number {
    return this.actions.size;
  }

  private walkLeaves(
    node: SemanticDiffExplorerTreeNode,
    sessionId: SemanticDiffExplorerSessionId,
  ): void {
    node.leaves.forEach((leaf) => {
      this.addLeafActions(leaf, sessionId);
    });
    node.children.forEach((child) => this.walkLeaves(child, sessionId));
  }

  private addLeafActions(
    leaf: SemanticDiffExplorerLeaf,
    sessionId: SemanticDiffExplorerSessionId,
  ): void {
    const targetId = this.targetIdForLeaf(leaf);
    const side = this.sideForLeaf(leaf);
    for (const [kind, action] of [
      ["source", leaf.actions.source],
      ["flow", leaf.actions.flow],
    ] as const) {
      if (action.actionId !== null) {
        this.actions.set(action.actionId, {
          sessionId,
          metadata: { kind, side, targetId },
        });
      }
    }
  }

  private sideForLeaf(
    leaf: SemanticDiffExplorerLeaf,
  ): "before" | "after" | null {
    return leaf.kind === "schedule" ? null : leaf.targetSide;
  }

  private targetIdForLeaf(leaf: SemanticDiffExplorerLeaf): string | null {
    const target =
      leaf.kind === "limitation" || leaf.kind === "schedule"
        ? null
        : leaf.target.value;
    if (!target) return null;
    switch (target.kind) {
      case "unit":
      case "jobnet":
      case "attribute":
        return target.unit.id;
      default:
        return null;
    }
  }
}

export const createSemanticDiffExplorerActionRegistry =
  (): SemanticDiffExplorerActionRegistry =>
    new SemanticDiffExplorerActionRegistry();
