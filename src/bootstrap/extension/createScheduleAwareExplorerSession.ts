import type * as vscode from "vscode";
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

const registerSidecar = (
  deps: ScheduleAwareExplorerSessionDeps,
  context: SemanticDiffOutputContext,
  sidecar: SemanticDiffScheduleImpact | undefined,
): void => {
  if (sidecar) deps.sidecarRegistry.register(context, sidecar);
};

const releaseSidecar = (
  deps: ScheduleAwareExplorerSessionDeps,
  context: SemanticDiffOutputContext,
  sidecar: SemanticDiffScheduleImpact | undefined,
): void => {
  if (sidecar) deps.sidecarRegistry.release(context);
};

const releaseParent = (
  deps: ScheduleAwareExplorerSessionDeps,
  getParentSessionId: () => string | undefined,
): void => {
  const parentSessionId = getParentSessionId();
  if (parentSessionId) deps.releaseCalendarParent?.(parentSessionId);
};

type ReleaseContext = Readonly<{
  deps: ScheduleAwareExplorerSessionDeps;
  context: SemanticDiffOutputContext;
  sidecar: SemanticDiffScheduleImpact | undefined;
  getParentSessionId: () => string | undefined;
}>;

const createReleaseOnce = ({
  deps,
  context,
  sidecar,
  getParentSessionId,
}: ReleaseContext): (() => void) => {
  let released = false;
  return (): void => {
    if (released) return;
    released = true;
    releaseSidecar(deps, context, sidecar);
    releaseParent(deps, getParentSessionId);
  };
};

const attachParentDisposal = (
  handle: SemanticDiffExplorerSessionHandle,
  release: () => void,
): vscode.Disposable => handle.panel.onDidDispose(release);

const disposeAfterListenerFailure = (
  handle: SemanticDiffExplorerSessionHandle,
): void => {
  try {
    handle.dispose();
  } catch {
    // Preserve the listener/registration error as the operation result.
  }
};

const decorateHandle = (
  handle: SemanticDiffExplorerSessionHandle,
  panelDispose: vscode.Disposable,
  release: () => void,
): SemanticDiffExplorerSessionHandle => ({
  ...handle,
  dispose: (): void => {
    try {
      handle.dispose();
    } finally {
      panelDispose.dispose();
      release();
    }
  },
});

const attachParentDisposalSafely = (
  handle: SemanticDiffExplorerSessionHandle,
  release: () => void,
): vscode.Disposable => {
  try {
    return attachParentDisposal(handle, release);
  } catch (error) {
    release();
    disposeAfterListenerFailure(handle);
    throw error;
  }
};

const openExplorerWithSidecar = async ({
  deps,
  context,
  sidecar,
  release,
  setParentSessionId,
}: Readonly<{
  deps: ScheduleAwareExplorerSessionDeps;
  context: SemanticDiffOutputContext;
  sidecar: SemanticDiffScheduleImpact | undefined;
  release: () => void;
  setParentSessionId: (sessionId: string) => void;
}>): Promise<SemanticDiffExplorerSessionHandle> => {
  const handle = await deps.openExplorer(context);
  setParentSessionId(handle.sessionId);
  if (!sidecar) return handle;
  const panelDispose = attachParentDisposalSafely(handle, release);
  return decorateHandle(handle, panelDispose, release);
};

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
    registerSidecar(deps, context, sidecar);

    let parentSessionId: string | undefined;
    const release = createReleaseOnce({
      deps,
      context,
      sidecar,
      getParentSessionId: () => parentSessionId,
    });

    try {
      // This is intentionally the sole parent open call for both impact states.
      return await openExplorerWithSidecar({
        deps,
        context,
        sidecar,
        release,
        setParentSessionId: (sessionId) => {
          parentSessionId = sessionId;
        },
      });
    } catch (error) {
      release();
      throw error;
    }
  };
