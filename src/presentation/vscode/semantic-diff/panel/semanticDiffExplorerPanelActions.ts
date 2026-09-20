import {
  createSemanticDiffExplorerActionResultMessage,
  createSemanticDiffExplorerError,
  type SemanticDiffExplorerActionOutcome,
  type SemanticDiffExplorerHostMessage,
  type SemanticDiffExplorerRequest,
} from "../../../../application/semantic-diff/semanticDiffExplorerMessages";
import type {
  SemanticDiffExplorerSession,
  SemanticDiffExplorerSessionId,
} from "../../../../application/semantic-diff/semanticDiffExplorer";
import type {
  SemanticDiffChange,
  SemanticDiffConfirmationRequiredItem,
  SemanticDiffOutputContext,
  SemanticDiffSide,
  SemanticDiffUnsupportedItem,
} from "../../../../application/semantic-diff/semanticDiffDto";
import { recordAtSourceOccurrence } from "../../../../application/semantic-diff/semanticDiffRecordOccurrence";
import { executeSemanticDiffExplorerReportAction } from "../report/semanticDiffExplorerReportAction";
import { executeSemanticDiffExplorerSourceAction } from "../source/semanticDiffExplorerSourceAction";
import type { SemanticDiffFlowActionRequest } from "../flow/semanticDiffExplorerFlowTypes";
import type {
  SemanticDiffExplorerActionRegistry,
  SemanticDiffSourceCaptureEntry,
} from "./semanticDiffExplorerRegistry";
import type { SemanticDiffExplorerPanelDeps } from "./semanticDiffExplorerPanelTypes";

type ActionRequest = Extract<SemanticDiffExplorerRequest, { type: "action" }>;
type ActionMetadata = NonNullable<
  ReturnType<SemanticDiffExplorerActionRegistry["metadata"]>
>;

type PanelActionOptions = Readonly<{
  session: SemanticDiffExplorerSession;
  context: SemanticDiffOutputContext;
  actionRegistry: SemanticDiffExplorerActionRegistry;
  sourceCapture: SemanticDiffSourceCaptureEntry | undefined;
  deps: SemanticDiffExplorerPanelDeps;
  post(
    message: SemanticDiffExplorerHostMessage,
    expectedEpoch: number,
  ): Promise<void>;
  isCurrent(epoch: number): boolean;
  calendarActionId?: import("../../../../application/semantic-diff/semanticDiffExplorer").SemanticDiffExplorerActionId;
  openScheduleImpactCalendarPanel?: (
    input: Readonly<{
      parentSessionId: string;
      context: SemanticDiffOutputContext;
      sidecar: import("../../../../application/semantic-diff/semanticDiffScheduleImpact").SemanticDiffScheduleImpact;
      displayLanguage?: string;
    }>,
  ) => import("../calendar/scheduleImpactCalendarPanel").ScheduleImpactCalendarPanelHandle;
}>;

type ActionExecution = Readonly<{
  request: ActionRequest;
  metadata: ActionMetadata;
  epoch: number;
  options: PanelActionOptions;
}>;

const actionOutcome = (
  options: Readonly<{
    kind: SemanticDiffExplorerActionOutcome["kind"];
    status: SemanticDiffExplorerActionOutcome["status"];
    side: SemanticDiffSide | null;
    targetId: string | null;
  }>,
): SemanticDiffExplorerActionOutcome => options;

const postActionError = (
  options: Readonly<{
    request: ActionRequest;
    sessionId: SemanticDiffExplorerSessionId;
    error: Parameters<typeof createSemanticDiffExplorerError>[0];
    detail?: Parameters<typeof createSemanticDiffExplorerError>[1];
  }>,
) =>
  createSemanticDiffExplorerActionResultMessage(
    options.sessionId,
    options.request.requestId,
    options.request.actionId,
    null,
    createSemanticDiffExplorerError(options.error, options.detail),
  );

const postActionResult = (
  request: ActionRequest,
  sessionId: SemanticDiffExplorerSessionId,
  outcome: SemanticDiffExplorerActionOutcome | null,
) =>
  createSemanticDiffExplorerActionResultMessage(
    sessionId,
    request.requestId,
    request.actionId,
    outcome,
  );

type SemanticDiffRecord =
  | SemanticDiffChange
  | SemanticDiffConfirmationRequiredItem
  | SemanticDiffUnsupportedItem;

const recordCollection = (
  context: SemanticDiffOutputContext,
  kind: "change" | "confirmation" | "unsupported",
): readonly SemanticDiffRecord[] => {
  switch (kind) {
    case "change":
      return context.result.changes;
    case "confirmation":
      return context.result.confirmationRequired;
    case "unsupported":
      return context.result.unsupportedItems;
  }
};

const validRecordOccurrence = (
  occurrence: number | null,
): occurrence is number =>
  occurrence !== null && Number.isSafeInteger(occurrence) && occurrence >= 0;

const hasContextRecord = (
  options: Readonly<{
    context: SemanticDiffOutputContext;
    kind: "change" | "confirmation" | "unsupported" | null;
    id: string | null;
    occurrence: number | null;
  }>,
): boolean => {
  if (
    options.kind === null ||
    options.id === null ||
    !validRecordOccurrence(options.occurrence)
  ) {
    return false;
  }
  return (
    recordAtSourceOccurrence(
      recordCollection(options.context, options.kind),
      options.id,
      options.occurrence,
    ) !== undefined
  );
};

const sourceActionAvailable = (options: PanelActionOptions): boolean =>
  options.sourceCapture !== undefined &&
  options.deps.openTextDocument !== undefined &&
  options.deps.showTextDocument !== undefined;

const sourceErrorCode = (
  code: "stale-source" | "unavailable-target" | "source-lookup-failed",
): "stale-source" | "unavailable-target" | "source-lookup-failed" =>
  (
    ({
      "stale-source": "stale-source",
      "unavailable-target": "unavailable-target",
      "source-lookup-failed": "source-lookup-failed",
    }) as const
  )[code];

const sourceActionMessage = (
  execution: ActionExecution,
  result: Awaited<ReturnType<typeof executeSemanticDiffExplorerSourceAction>>,
): ReturnType<typeof postActionResult> => {
  const { request, metadata, options } = execution;
  if (!("code" in result)) {
    return postActionResult(
      request,
      options.session.sessionId,
      actionOutcome({
        kind: "source",
        status: "completed",
        side: metadata.side,
        targetId: metadata.targetId,
      }),
    );
  }
  return postActionError({
    request,
    sessionId: options.session.sessionId,
    error: sourceErrorCode(result.code),
    detail: { side: metadata.side, targetId: metadata.targetId },
  });
};

const postSourceAction = async (execution: ActionExecution): Promise<void> => {
  const { request, metadata, epoch, options } = execution;
  const { deps, post, sourceCapture } = options;
  if (!sourceActionAvailable(options)) {
    await post(
      postActionError({
        request,
        sessionId: options.session.sessionId,
        error: "source-lookup-failed",
        detail: { side: metadata.side, targetId: metadata.targetId },
      }),
      epoch,
    );
    return;
  }
  const result = await executeSemanticDiffExplorerSourceAction(
    {
      side: metadata.side,
      targetId: metadata.targetId,
      targetKind: metadata.targetKind,
      parameterKey: metadata.parameterKey,
    },
    {
      sourceCapture,
      openTextDocument: deps.openTextDocument,
      showTextDocument: deps.showTextDocument,
      isCurrent: () => options.isCurrent(epoch),
    },
  );
  if (!options.isCurrent(epoch)) return;
  await post(sourceActionMessage(execution, result), epoch);
};

const flowPreconditionMessage = (
  execution: ActionExecution,
): ReturnType<typeof postActionResult> | undefined => {
  const { request, metadata, options } = execution;
  const detail = { side: metadata.side, targetId: metadata.targetId };
  if (
    !hasContextRecord({
      context: options.context,
      kind: metadata.recordKind,
      id: metadata.recordId,
      occurrence: metadata.recordOccurrence,
    })
  ) {
    return postActionError({
      request,
      sessionId: options.session.sessionId,
      error: "record-not-found",
      detail,
    });
  }
  if (options.deps.flowAction === undefined) {
    return postActionResult(
      request,
      options.session.sessionId,
      actionOutcome({
        kind: "flow",
        status: "unavailable",
        side: metadata.side,
        targetId: metadata.targetId,
      }),
    );
  }
  return undefined;
};

const flowActionMessage = (
  execution: ActionExecution,
  result:
    | {
        ok: true;
      }
    | {
        ok: false;
        code: "flow-not-ready" | "flow-target-missing";
        targetId?: string;
      },
): ReturnType<typeof postActionResult> => {
  const { request, metadata, options } = execution;
  if (!("code" in result)) {
    return postActionResult(
      request,
      options.session.sessionId,
      actionOutcome({
        kind: "flow",
        status: "completed",
        side: metadata.side,
        targetId: metadata.targetId,
      }),
    );
  }
  return postActionError({
    request,
    sessionId: options.session.sessionId,
    error: result.code,
    detail: {
      side: metadata.side,
      targetId: result.targetId ?? metadata.targetId,
    },
  });
};

const executeFlowAction = async (
  execution: ActionExecution,
): Promise<
  | {
      ok: true;
    }
  | {
      ok: false;
      code: "flow-not-ready" | "flow-target-missing";
      targetId?: string;
    }
  | undefined
> => {
  const { metadata, epoch, options } = execution;
  const flowAction = options.deps.flowAction;
  if (flowAction === undefined) return undefined;
  const flowResult = await flowAction(
    {
      sessionId: options.session.sessionId,
      disposeEpoch: epoch,
      side: metadata.side,
      targetId: metadata.targetId,
      targetKind: metadata.targetKind,
      recordId: metadata.recordId,
      recordKind: metadata.recordKind,
      recordOccurrence: metadata.recordOccurrence,
      recordTarget: metadata.recordTarget,
    } satisfies SemanticDiffFlowActionRequest,
    options.context,
    () => options.isCurrent(epoch),
  );
  return options.isCurrent(epoch) ? flowResult : undefined;
};

const postFlowAction = async (execution: ActionExecution): Promise<void> => {
  const { epoch, options } = execution;
  const preconditionMessage = flowPreconditionMessage(execution);
  if (preconditionMessage !== undefined) {
    await options.post(preconditionMessage, epoch);
    return;
  }
  const flowResult = await executeFlowAction(execution);
  if (flowResult === undefined) return;
  await options.post(flowActionMessage(execution, flowResult), epoch);
};

const postReportAction = async (execution: ActionExecution): Promise<void> => {
  const { request, epoch, options } = execution;
  const output = await executeSemanticDiffExplorerReportAction(
    options.session.context,
    {
      showQuickPick: (items, pickOptions) =>
        options.deps.showQuickPick(items, pickOptions),
      openReport: options.deps.openReport,
      presentOutput: options.deps.presentOutput,
      language: options.deps.language,
      isCurrent: () => options.isCurrent(epoch),
    },
  );
  if (!options.isCurrent(epoch)) return;
  await options.post(
    output.ok
      ? postActionResult(
          request,
          options.session.sessionId,
          actionOutcome({
            kind: "output",
            status: "completed",
            side: null,
            targetId: null,
          }),
        )
      : postActionError({
          request,
          sessionId: options.session.sessionId,
          error: "output-failed",
        }),
    epoch,
  );
};

const dispatchKnownAction = async (
  execution: ActionExecution,
): Promise<void> => {
  if (execution.metadata.kind === "source") {
    await postSourceAction(execution);
  } else if (execution.metadata.kind === "flow") {
    await postFlowAction(execution);
  } else {
    await postReportAction(execution);
  }
};

export const processSemanticDiffExplorerAction = async (
  request: ActionRequest,
  epoch: number,
  options: PanelActionOptions,
): Promise<void> => {
  if (!options.isCurrent(epoch)) return;
  const metadata = options.actionRegistry.metadata(
    request.actionId,
    options.session.sessionId,
  );
  if (metadata === undefined) {
    await options.post(
      postActionError({
        request,
        sessionId: options.session.sessionId,
        error: "unknown-action",
      }),
      epoch,
    );
    return;
  }
  await dispatchKnownAction({ request, metadata, epoch, options });
};
