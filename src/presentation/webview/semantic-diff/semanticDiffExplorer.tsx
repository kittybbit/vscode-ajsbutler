import React, { useEffect, useRef, useState } from "react";
import {
  filterSemanticDiffExplorerViewModel,
  type SemanticDiffExplorerActionId,
  type SemanticDiffExplorerSessionId,
  type SemanticDiffExplorerViewModel,
} from "../../../application/semantic-diff/semanticDiffExplorer";
import {
  createSemanticDiffExplorerActionRequest,
  createSemanticDiffExplorerReadyRequest,
  parseSemanticDiffExplorerHostMessage,
  type SemanticDiffExplorerHostMessage,
} from "../../../application/semantic-diff/semanticDiffExplorerMessages";
import SemanticDiffExplorerView from "./semanticDiffExplorerView";
import { getSemanticDiffExplorerLabels } from "./semanticDiffExplorerLocalization";

type ExplorerHostState = Readonly<{
  sessionId: SemanticDiffExplorerSessionId;
  viewModel: SemanticDiffExplorerViewModel;
}>;

const readOutputActionId = (): SemanticDiffExplorerActionId | undefined => {
  const value = document.body.dataset.semanticDiffOutputActionId;
  return value ? (value as SemanticDiffExplorerActionId) : undefined;
};

const readSessionId = (): SemanticDiffExplorerSessionId | undefined => {
  const value = document.body.dataset.semanticDiffSessionId;
  return value ? (value as SemanticDiffExplorerSessionId) : undefined;
};

const post = (message: unknown): void => {
  try {
    window.vscode.postMessage(message);
  } catch {
    // The panel may be closing; the host owns the failure boundary.
  }
};

export const SemanticDiffExplorerApp = (): React.ReactElement => {
  const [state, setState] = useState<ExplorerHostState | undefined>();
  const [hostAnnouncement, setHostAnnouncement] = useState("");
  const [hostFailure, setHostFailure] = useState<string | undefined>();
  const [language] = useState(() => document.documentElement.lang || "en");
  const labels = getSemanticDiffExplorerLabels(language);
  const requestId = useRef(0);
  const readySent = useRef(false);
  const initialSessionId = useRef<SemanticDiffExplorerSessionId | undefined>(
    undefined,
  );
  const outputActionId = useRef<SemanticDiffExplorerActionId | undefined>(
    undefined,
  );
  const pendingActions = useRef(new Map<number, HTMLElement>());
  const stateRef = useRef<ExplorerHostState | undefined>(undefined);
  const closedSessionId = useRef<SemanticDiffExplorerSessionId | undefined>(
    undefined,
  );
  stateRef.current = state;

  useEffect(() => {
    outputActionId.current = readOutputActionId();
    initialSessionId.current = readSessionId();
    const onMessage = (event: MessageEvent): void => {
      const message = parseSemanticDiffExplorerHostMessage(event.data, {
        expectedSessionId:
          stateRef.current?.sessionId ?? initialSessionId.current,
      });
      if (!message) return;
      if (closedSessionId.current === message.sessionId) return;
      handleHostMessage(message);
    };
    window.addEventListener("message", onMessage);
    if (initialSessionId.current && !readySent.current) {
      readySent.current = true;
      requestId.current = 1;
      post(createSemanticDiffExplorerReadyRequest(initialSessionId.current, 1));
    }
    return () => window.removeEventListener("message", onMessage);
    // State is read from the ref above to avoid replacing the bridge listener.
  }, []);

  const handleHostMessage = (
    message: SemanticDiffExplorerHostMessage,
  ): void => {
    if (message.type === "session") {
      closedSessionId.current = undefined;
      setHostFailure(undefined);
      const next = { sessionId: message.sessionId, viewModel: message.payload };
      stateRef.current = next;
      setState(next);
      return;
    }
    if (message.type === "action-result" || message.type === "failure") {
      if (message.requestId !== null) {
        pendingActions.current.get(message.requestId)?.focus();
        pendingActions.current.delete(message.requestId);
      }
      if (message.type === "failure" || !message.ok) {
        const failureLabel =
          message.type === "failure"
            ? labels.error(message.error.code)
            : labels.error(message.error?.code ?? "Action failed");
        setHostAnnouncement(failureLabel);
        if (!stateRef.current) setHostFailure(failureLabel);
      } else if (message.payload) {
        const label =
          message.payload.kind === "output"
            ? labels.output
            : message.payload.kind === "source"
              ? labels.source
              : labels.flow;
        setHostAnnouncement(
          message.payload.status === "completed"
            ? labels.actionCompleted(label)
            : labels.actionUnavailable(label),
        );
      }
      return;
    }
    if (message.type === "close") {
      closedSessionId.current = message.sessionId;
      pendingActions.current.clear();
      stateRef.current = undefined;
      setState(undefined);
    }
  };

  const sendAction = (actionId: string, element?: HTMLElement): void => {
    const current = stateRef.current;
    if (!current) return;
    requestId.current += 1;
    const id = requestId.current;
    if (element) pendingActions.current.set(id, element);
    post(
      createSemanticDiffExplorerActionRequest(
        current.sessionId,
        id,
        actionId as SemanticDiffExplorerActionId,
      ),
    );
  };

  if (!state) {
    return (
      <main aria-labelledby="semantic-diff-explorer-title">
        <h1 id="semantic-diff-explorer-title">{labels.title}</h1>
        <p role="status" aria-live="polite">
          {hostFailure ?? labels.loading}
        </p>
        <div aria-live="polite" aria-atomic="true">
          {hostAnnouncement}
        </div>
      </main>
    );
  }

  return (
    <SemanticDiffExplorerView
      viewModel={state.viewModel}
      language={language}
      outputAction={
        outputActionId.current
          ? (element) => sendAction(outputActionId.current!, element)
          : undefined
      }
      action={(actionId, element) => sendAction(actionId, element)}
      hostAnnouncement={hostAnnouncement}
    />
  );
};

export const applyExplorerFilter = filterSemanticDiffExplorerViewModel;

export default SemanticDiffExplorerApp;
