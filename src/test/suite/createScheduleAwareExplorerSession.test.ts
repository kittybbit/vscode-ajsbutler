import * as assert from "assert";
import * as vscode from "vscode";
import { createScheduleAwareExplorerSession } from "../../bootstrap/extension/createScheduleAwareExplorerSession";
import { ScheduleImpactSidecarRegistry } from "../../bootstrap/extension/scheduleImpactSidecarRegistry";
import type { SemanticDiffPresentationArtifacts } from "../../application/semantic-diff/buildSemanticDiffPresentationArtifacts";
import type { SemanticDiffOutputContext } from "../../application/semantic-diff/semanticDiffDto";
import type { SemanticDiffScheduleImpact } from "../../application/semantic-diff/semanticDiffScheduleImpact";
import type { SemanticDiffExplorerSessionHandle } from "../../presentation/vscode/semantic-diff/panel/semanticDiffExplorerPanelTypes";

const context = (): SemanticDiffOutputContext => ({
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
  summary: {} as never,
});

const panel = () => {
  const listeners = new Set<() => void>();
  let disposed = false;
  return {
    onDidDispose(listener: () => void): vscode.Disposable {
      listeners.add(listener);
      return { dispose: () => listeners.delete(listener) };
    },
    dispose(): void {
      if (disposed) return;
      disposed = true;
      listeners.forEach((listener) => listener());
    },
  } as unknown as vscode.WebviewPanel;
};

const artifacts = (
  impact: SemanticDiffPresentationArtifacts["scheduleImpact"],
): SemanticDiffPresentationArtifacts => ({
  context: context(),
  scheduleImpact: impact,
});

suite("Schedule-aware Explorer session", () => {
  test("opens the normal Explorer once and releases available sidecars on parent disposal", async () => {
    const registry = new ScheduleImpactSidecarRegistry();
    const explorerPanel = panel();
    const releasedParents: string[] = [];
    const parent = {
      sessionId: "sde-session-1" as never,
      panel: explorerPanel,
      dispose: () => explorerPanel.dispose(),
    } as SemanticDiffExplorerSessionHandle;
    let opens = 0;
    const open = createScheduleAwareExplorerSession({
      sidecarRegistry: registry,
      releaseCalendarParent: (parentSessionId) =>
        releasedParents.push(parentSessionId),
      openExplorer: async (receivedContext) => {
        opens += 1;
        assert.strictEqual(receivedContext, artifactsValue.context);
        return parent;
      },
    });
    const artifactsValue = artifacts({
      kind: "available",
      sidecar: {} as SemanticDiffScheduleImpact,
    });
    const result = await open(artifactsValue);
    assert.strictEqual(opens, 1);
    assert.strictEqual(
      registry.resolve(artifactsValue.context),
      artifactsValue.scheduleImpact.kind === "available"
        ? artifactsValue.scheduleImpact.sidecar
        : undefined,
    );
    result.dispose();
    assert.strictEqual(registry.size, 0);
    assert.deepStrictEqual(releasedParents, ["sde-session-1"]);
  });

  test("still opens the normal Explorer for unavailable impact without registration", async () => {
    const registry = new ScheduleImpactSidecarRegistry();
    let opens = 0;
    const open = createScheduleAwareExplorerSession({
      sidecarRegistry: registry,
      openExplorer: async () => {
        opens += 1;
        return {
          sessionId: "sde-session-2" as never,
          panel: panel(),
          dispose() {},
        };
      },
    });
    await open(artifacts({ kind: "unavailable", reason: "not-requested" }));
    assert.strictEqual(opens, 1);
    assert.strictEqual(registry.size, 0);
  });

  test("registers before opening, rolls back failures, and releases only once", async () => {
    const successRegistry = new ScheduleImpactSidecarRegistry();
    const successContext = context();
    const successSidecar = {} as SemanticDiffScheduleImpact;
    const successPanel = panel();
    let successRegistrationVisible = false;
    let successReleases = 0;
    const successParent = {
      sessionId: "sde-session-success" as never,
      panel: successPanel,
      dispose: () => successPanel.dispose(),
    } as SemanticDiffExplorerSessionHandle;
    const successOpen = createScheduleAwareExplorerSession({
      sidecarRegistry: successRegistry,
      releaseCalendarParent: () => {
        successReleases += 1;
      },
      openExplorer: async (receivedContext) => {
        successRegistrationVisible =
          successRegistry.resolve(receivedContext) === successSidecar;
        return successParent;
      },
    });
    const success = await successOpen({
      context: successContext,
      scheduleImpact: { kind: "available", sidecar: successSidecar },
    });
    assert.strictEqual(successRegistrationVisible, true);
    successPanel.dispose();
    success.dispose();
    assert.strictEqual(successRegistry.size, 0);
    assert.strictEqual(successReleases, 1);

    const failureRegistry = new ScheduleImpactSidecarRegistry();
    const failureContext = context();
    const failureSidecar = {} as SemanticDiffScheduleImpact;
    let failureRegistrationVisible = false;
    const failureOpen = createScheduleAwareExplorerSession({
      sidecarRegistry: failureRegistry,
      openExplorer: async (receivedContext) => {
        failureRegistrationVisible =
          failureRegistry.resolve(receivedContext) === failureSidecar;
        throw new Error("WEB-10 open failure");
      },
    });
    await assert.rejects(
      failureOpen({
        context: failureContext,
        scheduleImpact: { kind: "available", sidecar: failureSidecar },
      }),
      /WEB-10 open failure/,
    );
    assert.strictEqual(failureRegistrationVisible, true);
    assert.strictEqual(failureRegistry.size, 0);
  });

  test("rolls back an available registration when Explorer creation fails", async () => {
    const registry = new ScheduleImpactSidecarRegistry();
    const open = createScheduleAwareExplorerSession({
      sidecarRegistry: registry,
      openExplorer: async () => {
        throw new Error("cancelled");
      },
    });
    const available = artifacts({
      kind: "available",
      sidecar: {} as SemanticDiffScheduleImpact,
    });
    await assert.rejects(open(available), /cancelled/);
    assert.strictEqual(registry.size, 0);
  });
});
