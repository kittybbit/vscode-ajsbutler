import type { SemanticDiffPresentationArtifacts } from "../../application/semantic-diff/buildSemanticDiffPresentationArtifacts";
import type { SemanticDiffOutputContext } from "../../application/semantic-diff/semanticDiffDto";
import type { SemanticDiffScheduleImpact } from "../../application/semantic-diff/semanticDiffScheduleImpact";
import type { SemanticDiffExplorerSessionHandle } from "../../presentation/vscode/semantic-diff/panel/semanticDiffExplorerPanelTypes";
import type { ScheduleImpactSidecarRegistry } from "./scheduleImpactSidecarRegistry";

export type OpenSemanticDiffExplorer = (
  context: SemanticDiffOutputContext,
) => Promise<SemanticDiffExplorerSessionHandle>;

export type ScheduleAwareExplorerSessionDeps = Readonly<{
  openExplorer: OpenSemanticDiffExplorer;
  sidecarRegistry: ScheduleImpactSidecarRegistry;
  releaseCalendarParent?: (parentSessionId: string) => void;
}>;

const availableSidecar = (
  artifacts: SemanticDiffPresentationArtifacts,
): SemanticDiffScheduleImpact | undefined =>
  artifacts.scheduleImpact.kind === "available"
    ? artifacts.scheduleImpact.sidecar
    : undefined;

/**
 * Composes the existing Explorer opener with the calendar sidecar lifetime.
 * The sidecar is registered before opening the parent and is released on any
 * failure or on the parent's actual disposal.  The returned handle retains
 * the normal Explorer handle shape; no calendar action is exposed here.
 */
export const createScheduleAwareExplorerSession =
  (
    deps: ScheduleAwareExplorerSessionDeps,
  ): ((
    artifacts: SemanticDiffPresentationArtifacts,
  ) => Promise<SemanticDiffExplorerSessionHandle>) =>
  async (artifacts) => {
    const sidecar = availableSidecar(artifacts);
    const context = artifacts.context;
    if (sidecar) {
      deps.sidecarRegistry.register(context, sidecar);
    }

    let handle: SemanticDiffExplorerSessionHandle | undefined;
    let parentSessionId: string | undefined;
    let released = false;
    const release = (): void => {
      if (released) return;
      released = true;
      if (sidecar) deps.sidecarRegistry.release(context);
      if (parentSessionId) deps.releaseCalendarParent?.(parentSessionId);
    };

    try {
      // This is intentionally the sole parent open call for both impact states.
      handle = await deps.openExplorer(context);
      parentSessionId = handle.sessionId;
      if (!sidecar) return handle;

      let panelDispose: { dispose(): void } | undefined;
      try {
        panelDispose = handle.panel.onDidDispose(release);
      } catch (error) {
        release();
        try {
          handle.dispose();
        } catch {
          // Preserve the listener/registration error as the operation result.
        }
        throw error;
      }

      return {
        ...handle,
        dispose: (): void => {
          try {
            handle?.dispose();
          } finally {
            panelDispose?.dispose();
            release();
          }
        },
      };
    } catch (error) {
      release();
      throw error;
    }
  };
