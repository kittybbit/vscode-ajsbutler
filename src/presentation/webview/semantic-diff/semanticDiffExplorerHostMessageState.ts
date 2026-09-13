import { useEffect, type MutableRefObject } from "react";
import {
  createSemanticDiffExplorerReadyRequest,
  parseSemanticDiffExplorerHostMessage,
  type SemanticDiffExplorerHostMessage,
} from "../../../application/semantic-diff/semanticDiffExplorerMessages";
import type {
  SemanticDiffExplorerActionId,
  SemanticDiffExplorerSessionId,
} from "../../../application/semantic-diff/semanticDiffExplorer";
import type { SemanticDiffExplorerLabels } from "./semanticDiffExplorerLocalization";
import type { ExplorerHostState } from "./semanticDiffExplorerHostState";

export type HostMessageResult = Readonly<{
  state: ExplorerHostState | undefined;
  announcement: string | undefined;
  failure: string | undefined;
  closedSessionId: SemanticDiffExplorerSessionId | undefined;
}>;

type HostMessageRefs = Readonly<{
  state: MutableRefObject<ExplorerHostState | undefined>;
  initialSessionId: MutableRefObject<SemanticDiffExplorerSessionId | undefined>;
  closedSessionId: MutableRefObject<SemanticDiffExplorerSessionId | undefined>;
  outputActionId: MutableRefObject<SemanticDiffExplorerActionId | undefined>;
  calendarActionId: MutableRefObject<SemanticDiffExplorerActionId | undefined>;
  readySent: MutableRefObject<boolean>;
  requestId: MutableRefObject<number>;
  pendingActions: MutableRefObject<Map<number, HTMLElement>>;
}>;

type HostMessageSetters = Readonly<{
  setState: (state: ExplorerHostState | undefined) => void;
  setAnnouncement: (value: string) => void;
  setFailure: (value: string | undefined) => void;
}>;

const actionLabel = (
  message: Extract<SemanticDiffExplorerHostMessage, { type: "action-result" }>,
  labels: SemanticDiffExplorerLabels,
): string => {
  const labelsByKind = {
    output: labels.output,
    source: labels.source,
    flow: labels.flow,
  } as const;
  const label = message.payload
    ? labelsByKind[message.payload.kind]
    : labels.flow;
  return message.payload?.status === "completed"
    ? labels.actionCompleted(label)
    : labels.actionUnavailable(label);
};

const failureLabel = (
  message: Extract<
    SemanticDiffExplorerHostMessage,
    { type: "failure" } | { type: "action-result" }
  >,
  labels: SemanticDiffExplorerLabels,
): string =>
  message.type === "failure"
    ? labels.error(message.error.code)
    : labels.error(message.error?.code ?? "Action failed");

const reduceSession = (
  message: Extract<SemanticDiffExplorerHostMessage, { type: "session" }>,
): HostMessageResult => ({
  state: { sessionId: message.sessionId, viewModel: message.payload },
  announcement: undefined,
  failure: undefined,
  closedSessionId: undefined,
});
const reduceClose = (
  message: Extract<SemanticDiffExplorerHostMessage, { type: "close" }>,
): HostMessageResult => ({
  state: undefined,
  announcement: undefined,
  failure: undefined,
  closedSessionId: message.sessionId,
});
const actionFailed = (
  message: Extract<
    SemanticDiffExplorerHostMessage,
    { type: "action-result" } | { type: "failure" }
  >,
): boolean => message.type === "failure" || !message.ok;
const actionAnnouncement = (
  message: Extract<
    SemanticDiffExplorerHostMessage,
    { type: "action-result" } | { type: "failure" }
  >,
  labels: SemanticDiffExplorerLabels,
  failed: boolean,
): string => {
  if (failed) return failureLabel(message, labels);
  return actionLabel(
    message as Extract<
      SemanticDiffExplorerHostMessage,
      { type: "action-result" }
    >,
    labels,
  );
};
const reduceAction = (
  message: Extract<
    SemanticDiffExplorerHostMessage,
    { type: "action-result" } | { type: "failure" }
  >,
  state: ExplorerHostState | undefined,
  labels: SemanticDiffExplorerLabels,
): HostMessageResult => {
  const failed = actionFailed(message);
  const announcement = actionAnnouncement(message, labels, failed);
  return {
    state,
    announcement,
    failure: failed && !state ? announcement : undefined,
    closedSessionId: undefined,
  };
};

const reduceSessionOrClose = (
  message: SemanticDiffExplorerHostMessage,
): HostMessageResult | undefined => {
  if (message.type === "session") return reduceSession(message);
  if (message.type === "close") return reduceClose(message);
  return undefined;
};
const reduceHostMessage = (
  message: SemanticDiffExplorerHostMessage,
  state: ExplorerHostState | undefined,
  labels: SemanticDiffExplorerLabels,
): HostMessageResult => {
  const structuralResult = reduceSessionOrClose(message);
  return (
    structuralResult ??
    reduceAction(
      message as Extract<
        SemanticDiffExplorerHostMessage,
        { type: "action-result" } | { type: "failure" }
      >,
      state,
      labels,
    )
  );
};

const post = (message: unknown): void => {
  try {
    window.vscode.postMessage(message);
  } catch {
    /* panel close owns the failure boundary */
  }
};

const handlePendingAction = (
  message: Extract<
    SemanticDiffExplorerHostMessage,
    { type: "action-result" } | { type: "failure" }
  >,
  pendingActions: Map<number, HTMLElement>,
): void => {
  if (message.requestId === null) return;
  pendingActions.get(message.requestId)?.focus();
  pendingActions.delete(message.requestId);
};

const applyMessageResult = (
  result: HostMessageResult,
  refs: HostMessageRefs,
  setters: HostMessageSetters,
): void => {
  refs.closedSessionId.current = result.closedSessionId;
  refs.state.current = result.state;
  setters.setState(result.state);
  if (result.announcement) setters.setAnnouncement(result.announcement);
  setters.setFailure(result.failure);
};
const handleAcceptedMessage = ({
  message,
  refs,
  setters,
  labels,
}: Readonly<{
  message: SemanticDiffExplorerHostMessage;
  refs: HostMessageRefs;
  setters: HostMessageSetters;
  labels: SemanticDiffExplorerLabels;
}>): void => {
  const result = reduceHostMessage(message, refs.state.current, labels);
  applyMessageResult(result, refs, setters);
  if (message.type === "action-result" || message.type === "failure")
    handlePendingAction(message, refs.pendingActions.current);
};

const createMessageHandler =
  (
    refs: HostMessageRefs,
    setters: HostMessageSetters,
    labels: SemanticDiffExplorerLabels,
  ): ((event: MessageEvent) => void) =>
  (event) => {
    const message = parseSemanticDiffExplorerHostMessage(event.data, {
      expectedSessionId:
        refs.state.current?.sessionId ?? refs.initialSessionId.current,
    });
    if (!message || refs.closedSessionId.current === message.sessionId) return;
    handleAcceptedMessage({ message, refs, setters, labels });
  };

export const useExplorerHostMessageListener = (
  refs: HostMessageRefs,
  setters: HostMessageSetters,
  labels: SemanticDiffExplorerLabels,
): void => {
  useEffect(() => {
    refs.outputActionId.current = document.body.dataset
      .semanticDiffOutputActionId as SemanticDiffExplorerActionId | undefined;
    refs.calendarActionId.current = document.body.dataset
      .semanticDiffCalendarActionId as SemanticDiffExplorerActionId | undefined;
    refs.initialSessionId.current = document.body.dataset
      .semanticDiffSessionId as SemanticDiffExplorerSessionId | undefined;
    const onMessage = createMessageHandler(refs, setters, labels);
    window.addEventListener("message", onMessage);
    if (refs.initialSessionId.current && !refs.readySent.current) {
      refs.readySent.current = true;
      refs.requestId.current = 1;
      post(
        createSemanticDiffExplorerReadyRequest(
          refs.initialSessionId.current,
          1,
        ),
      );
    }
    return () => window.removeEventListener("message", onMessage);
  }, [labels, refs, setters]);
};
