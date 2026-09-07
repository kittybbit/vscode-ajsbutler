import type {
  SemanticDiffExplorerActionId,
  SemanticDiffExplorerActionLookup,
  SemanticDiffExplorerLeaf,
  SemanticDiffExplorerSession,
  SemanticDiffExplorerSessionId,
  SemanticDiffExplorerTreeNode,
} from "../../../application/semantic-diff/semanticDiffExplorer";
import type {
  SemanticDiffOutputContext,
  SemanticDiffTarget,
} from "../../../application/semantic-diff/semanticDiffDto";
import { parseSemanticDiffRecordOccurrence } from "../../../application/semantic-diff/semanticDiffRecordOccurrence";
import type {
  ImmutableSourceDescriptor,
  SemanticDiffSourceCaptureBinding,
} from "../../../application/semantic-diff/semanticDiffSourceCapture";
import {
  isSemanticDiffSourceCaptureBindingActive,
  registerSemanticDiffSourceCaptureScope,
} from "../../../application/semantic-diff/semanticDiffSourceCapture";

export type SemanticDiffExplorerActionMetadata = Readonly<{
  kind: "source" | "flow" | "output";
  side: "before" | "after" | null;
  targetId: string | null;
  recordId: string | null;
  recordKind: "change" | "confirmation" | "unsupported" | null;
  recordOccurrence: number | null;
  recordTarget: SemanticDiffTarget | null;
  targetKind: "unit" | "jobnet" | "attribute" | null;
  parameterKey: string | null;
}>;

export type SemanticDiffExplorerContextEntry = Readonly<{
  context: SemanticDiffOutputContext;
  session: SemanticDiffExplorerSession;
  outputActionId: SemanticDiffExplorerActionId;
  dispose: () => void;
}>;

export type SemanticDiffSourceHostDescriptor = ImmutableSourceDescriptor & {
  readonly uri: import("vscode").Uri;
};

export type SemanticDiffSourceCaptureEntry = Readonly<{
  binding: SemanticDiffSourceCaptureBinding;
  sources: Readonly<{
    before: SemanticDiffSourceHostDescriptor;
    after: SemanticDiffSourceHostDescriptor;
  }>;
  release: () => void;
}>;

const freezeSourceHostDescriptor = (
  descriptor: SemanticDiffSourceHostDescriptor,
): SemanticDiffSourceHostDescriptor => {
  const uri =
    typeof descriptor.uri.with === "function"
      ? descriptor.uri.with({})
      : descriptor.uri;
  return Object.freeze({
    side: descriptor.side,
    sourceHandleId: descriptor.sourceHandleId,
    text: descriptor.text,
    version: descriptor.version,
    uri: Object.freeze(uri),
  });
};

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
  private readonly sourceCaptures = new Map<
    SemanticDiffOutputContext,
    SemanticDiffSourceCaptureEntry
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

  public registerSourceCapture(
    context: SemanticDiffOutputContext,
    entry: SemanticDiffSourceCaptureEntry,
  ): void {
    if (!isSemanticDiffSourceCaptureBindingActive(entry.binding)) {
      throw new TypeError("Source capture scope is released or unknown.");
    }
    if (
      entry.binding.context !== context ||
      entry.binding.before.sourceHandleId !==
        entry.sources.before.sourceHandleId ||
      entry.binding.after.sourceHandleId !== entry.sources.after.sourceHandleId
    ) {
      throw new TypeError("Source capture is not bound to this context.");
    }
    const sources = Object.freeze({
      before: freezeSourceHostDescriptor(entry.sources.before),
      after: freezeSourceHostDescriptor(entry.sources.after),
    });
    registerSemanticDiffSourceCaptureScope(entry.binding);
    this.sourceCaptures.set(
      context,
      Object.freeze({
        binding: entry.binding,
        sources,
        release: entry.release,
      }),
    );
  }

  public sourceCapture(
    context: SemanticDiffOutputContext,
  ): SemanticDiffSourceCaptureEntry | undefined {
    const entry = this.sourceCaptures.get(context);
    if (entry === undefined) return undefined;
    if (!isSemanticDiffSourceCaptureBindingActive(entry.binding)) {
      this.sourceCaptures.delete(context);
      return undefined;
    }
    return entry;
  }

  public unregisterSourceCapture(context: SemanticDiffOutputContext): boolean {
    return this.sourceCaptures.delete(context);
  }

  public get size(): number {
    return this.entries.size;
  }

  public clear(): void {
    this.entries.clear();
    this.sourceCaptures.clear();
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
      metadata: {
        kind: "output",
        side: null,
        targetId: null,
        recordId: null,
        recordKind: null,
        recordOccurrence: null,
        recordTarget: null,
        targetKind: null,
        parameterKey: null,
      },
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
    const target =
      leaf.kind === "limitation" || leaf.kind === "schedule"
        ? null
        : leaf.target.value;
    const targetKind =
      target?.kind === "unit" ||
      target?.kind === "jobnet" ||
      target?.kind === "attribute"
        ? target.kind
        : null;
    const parameterKey =
      target?.kind === "attribute" ? target.parameterKey : null;
    for (const [kind, action] of [
      ["source", leaf.actions.source],
      ["flow", leaf.actions.flow],
    ] as const) {
      if (action.actionId !== null) {
        this.actions.set(action.actionId, {
          sessionId,
          metadata: {
            kind,
            side,
            targetId,
            recordId:
              leaf.kind === "limitation" || leaf.kind === "schedule"
                ? null
                : leaf.recordId,
            recordKind:
              leaf.kind === "change" ||
              leaf.kind === "confirmation" ||
              leaf.kind === "unsupported"
                ? leaf.kind
                : null,
            recordOccurrence:
              leaf.kind === "change" ||
              leaf.kind === "confirmation" ||
              leaf.kind === "unsupported"
                ? parseSemanticDiffRecordOccurrence(leaf.id)
                : null,
            recordTarget: target,
            targetKind,
            parameterKey,
          },
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
