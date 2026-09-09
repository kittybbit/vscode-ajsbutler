import { buildSemanticDiffFlowOverlay } from "../../../../application/flow-graph/buildSemanticDiffFlowOverlay";
import type { UnitListDocumentDto } from "../../../../application/unit-list/unitListDocument";
import type { SemanticDiffOutputContext } from "../../../../application/semantic-diff/semanticDiffDto";
import {
  createViewerDocumentChangedMessage,
  createViewerRevealUnitMessage,
} from "../../../webview/viewerHostMessages";
import type {
  SemanticDiffFlowActionRequest,
  SemanticDiffFlowActionResult,
  SemanticDiffFlowHost,
  SemanticDiffFlowPanel,
  FlowOverlayOwner,
  ReadyFlowTarget,
} from "./semanticDiffExplorerFlowTypes";
import { SemanticDiffFlowOverlayRegistry } from "./semanticDiffExplorerFlowOverlayRegistry";
import {
  openReadyFlowTarget,
  prepareFlowAction,
} from "./semanticDiffExplorerFlowActionPreparation";
export type {
  PreparedFlowAction,
  ReadyFlowTarget,
  ResolvedFlowTarget,
} from "./semanticDiffExplorerFlowTypes";

const notReady = (): Readonly<{
  ok: false;
  code: "flow-not-ready";
}> => ({ ok: false, code: "flow-not-ready" });

const isThenable = (
  value: void | Thenable<boolean>,
): value is Thenable<boolean> =>
  typeof value === "object" && value !== null && "then" in value;

const postMessage = async (
  panel: SemanticDiffFlowPanel,
  message: unknown,
): Promise<boolean> => {
  try {
    const posted = panel.postMessage(message);
    return isThenable(posted) ? await posted : true;
  } catch {
    return false;
  }
};

const postDocumentAndCheckFreshness = async ({
  panel,
  document,
  isFresh,
}: Readonly<{
  panel: SemanticDiffFlowPanel;
  document: UnitListDocumentDto;
  isFresh: () => boolean;
}>): Promise<boolean> =>
  (await postMessage(panel, createViewerDocumentChangedMessage(document))) &&
  isFresh();

const postFlowMessages = async ({
  panel,
  document,
  absolutePath,
  isFresh,
}: Readonly<{
  panel: SemanticDiffFlowPanel;
  document: UnitListDocumentDto;
  absolutePath: string;
  isFresh: () => boolean;
}>): Promise<boolean> => {
  if (!(await postDocumentAndCheckFreshness({ panel, document, isFresh }))) {
    return false;
  }
  if (
    !(await postMessage(panel, createViewerRevealUnitMessage(absolutePath)))
  ) {
    return false;
  }
  return isFresh();
};

const createOverlayDocument = ({
  context,
  request,
  document,
}: Readonly<{
  context: SemanticDiffOutputContext;
  request: SemanticDiffFlowActionRequest;
  document: UnitListDocumentDto;
}>): UnitListDocumentDto => ({
  ...document,
  semanticDiffOverlay: buildSemanticDiffFlowOverlay(
    context.result,
    request.side!,
    document,
  ),
});

const createFreshFlowOverlay = ({
  context,
  request,
  ready,
  isFresh,
}: Readonly<{
  context: SemanticDiffOutputContext;
  request: SemanticDiffFlowActionRequest;
  ready: ReadyFlowTarget;
  isFresh: () => boolean;
}>):
  | Readonly<{ owner: FlowOverlayOwner; document: UnitListDocumentDto }>
  | undefined => {
  if (!isFresh()) return undefined;
  const document = createOverlayDocument({
    context,
    request,
    document: ready.document,
  });
  return isFresh()
    ? {
        owner: Object.freeze({
          sessionId: request.sessionId,
          disposeEpoch: request.disposeEpoch ?? 0,
        }),
        document,
      }
    : undefined;
};

const applyFlowOverlay = async ({
  registry,
  request,
  ready,
  context,
  isFresh,
}: Readonly<{
  registry: SemanticDiffFlowOverlayRegistry;
  request: SemanticDiffFlowActionRequest;
  ready: ReadyFlowTarget;
  context: SemanticDiffOutputContext;
  isFresh: () => boolean;
}>): Promise<boolean> => {
  const overlay = createFreshFlowOverlay({
    context,
    request,
    ready,
    isFresh,
  });
  if (!overlay) return false;
  const operationId = registry.replace({
    flowUri: ready.panel.flowUri,
    panel: ready.panel,
    owner: overlay.owner,
    document: ready.document,
  });
  const posted = await postFlowMessages({
    panel: ready.panel,
    document: overlay.document,
    absolutePath: ready.targetUnit.absolutePath,
    isFresh,
  });
  if (posted) return true;
  registry.clear(ready.panel.flowUri, overlay.owner, operationId);
  return false;
};

const runReadyFlowAction = async ({
  registry,
  request,
  ready,
  context,
  isFresh,
}: Readonly<{
  registry: SemanticDiffFlowOverlayRegistry;
  request: SemanticDiffFlowActionRequest;
  ready: ReadyFlowTarget;
  context: SemanticDiffOutputContext;
  isFresh: () => boolean;
}>): Promise<SemanticDiffFlowActionResult> => {
  if (!isFresh()) return notReady();
  const applied = await applyFlowOverlay({
    registry,
    request,
    ready,
    context,
    isFresh,
  });
  return applied ? { ok: true } : notReady();
};

const runFlowAction = async ({
  host,
  registry,
  request,
  context,
  isCurrent,
}: Readonly<{
  host: SemanticDiffFlowHost;
  registry: SemanticDiffFlowOverlayRegistry;
  request: SemanticDiffFlowActionRequest;
  context: SemanticDiffOutputContext;
  isCurrent: () => boolean;
}>): Promise<SemanticDiffFlowActionResult> => {
  const prepared = prepareFlowAction({
    host,
    request,
    context,
    isCurrent,
  });
  if (!("target" in prepared)) return prepared;
  const ready = await openReadyFlowTarget({
    host,
    request,
    context,
    target: prepared.target,
    isFresh: prepared.isFresh,
  });
  if (!("panel" in ready)) return ready;
  return runReadyFlowAction({
    registry,
    request,
    ready,
    context,
    isFresh: prepared.isFresh,
  });
};

export const createSemanticDiffFlowAction =
  ({
    host,
    registry = new SemanticDiffFlowOverlayRegistry(),
  }: Readonly<{
    host: SemanticDiffFlowHost;
    registry?: SemanticDiffFlowOverlayRegistry;
  }>): ((
    request: SemanticDiffFlowActionRequest,
    context: SemanticDiffOutputContext,
    isCurrent: () => boolean,
  ) => Promise<SemanticDiffFlowActionResult>) =>
  (request, context, isCurrent) =>
    runFlowAction({
      host,
      registry,
      request,
      context,
      isCurrent,
    });
