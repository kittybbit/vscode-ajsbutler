import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import { createSemanticDiffExplorerActionRequest } from "../../../application/semantic-diff/semanticDiffExplorerMessages";
import type {
  SemanticDiffExplorerActionId,
  SemanticDiffExplorerSessionId,
  SemanticDiffExplorerViewModel,
} from "../../../application/semantic-diff/semanticDiffExplorer";
import { getSemanticDiffExplorerLabels } from "./semanticDiffExplorerLocalization";
import { useExplorerHostMessageListener } from "./semanticDiffExplorerHostMessageState";

export type ExplorerHostState = Readonly<{
  sessionId: SemanticDiffExplorerSessionId;
  viewModel: SemanticDiffExplorerViewModel;
}>;

type ExplorerBridge = Readonly<{
  state: ExplorerHostState | undefined;
  hostAnnouncement: string;
  hostFailure: string | undefined;
  language: string;
  outputActionId: SemanticDiffExplorerActionId | undefined;
  sendAction: (actionId: string, element?: HTMLElement) => void;
}>;

type ExplorerRefs = Parameters<typeof useExplorerHostMessageListener>[0];
type ExplorerSetters = Parameters<typeof useExplorerHostMessageListener>[1];

const readLanguage = (): string => document.documentElement.lang || "en";

const useExplorerHostRefs = (): Readonly<{
  refs: ExplorerRefs;
  stateRef: MutableRefObject<ExplorerHostState | undefined>;
  requestId: MutableRefObject<number>;
  pendingActions: MutableRefObject<Map<number, HTMLElement>>;
}> => {
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
  const refs: ExplorerRefs = useMemo(
    () => ({
      state: stateRef,
      initialSessionId,
      closedSessionId,
      outputActionId,
      readySent,
      requestId,
      pendingActions,
    }),
    [],
  );
  return { refs, stateRef, requestId, pendingActions };
};

const recordPendingAction = (
  pendingActions: MutableRefObject<Map<number, HTMLElement>>,
  id: number,
  element?: HTMLElement,
): void => {
  if (element) pendingActions.current.set(id, element);
};
const postExplorerAction = (
  sessionId: SemanticDiffExplorerSessionId,
  id: number,
  actionId: string,
): void => {
  try {
    window.vscode.postMessage(
      createSemanticDiffExplorerActionRequest(
        sessionId,
        id,
        actionId as SemanticDiffExplorerActionId,
      ),
    );
  } catch {
    // The panel may be closing; the host owns the failure boundary.
  }
};
const sendExplorerAction = ({
  actionId,
  element,
  stateRef,
  requestId,
  pendingActions,
}: Readonly<{
  actionId: string;
  element?: HTMLElement;
  stateRef: MutableRefObject<ExplorerHostState | undefined>;
  requestId: MutableRefObject<number>;
  pendingActions: MutableRefObject<Map<number, HTMLElement>>;
}>): void => {
  const current = stateRef.current;
  if (!current) return;
  requestId.current += 1;
  const id = requestId.current;
  recordPendingAction(pendingActions, id, element);
  postExplorerAction(current.sessionId, id, actionId);
};

const useExplorerSendAction = ({
  stateRef,
  requestId,
  pendingActions,
}: Readonly<{
  stateRef: MutableRefObject<ExplorerHostState | undefined>;
  requestId: MutableRefObject<number>;
  pendingActions: MutableRefObject<Map<number, HTMLElement>>;
}>): ((actionId: string, element?: HTMLElement) => void) =>
  useCallback(
    (actionId, element) =>
      sendExplorerAction({
        actionId,
        element,
        stateRef,
        requestId,
        pendingActions,
      }),
    [],
  );

export const useSemanticDiffExplorerHost = (): ExplorerBridge => {
  const [state, setState] = useState<ExplorerHostState | undefined>();
  const [hostAnnouncement, setHostAnnouncement] = useState("");
  const [hostFailure, setHostFailure] = useState<string | undefined>();
  const [language] = useState(readLanguage);
  const labels = useMemo(
    () => getSemanticDiffExplorerLabels(language),
    [language],
  );
  const hostRefs = useExplorerHostRefs();
  hostRefs.stateRef.current = state;
  const setters: ExplorerSetters = useMemo(
    () => ({
      setState,
      setAnnouncement: setHostAnnouncement,
      setFailure: setHostFailure,
    }),
    [],
  );
  useExplorerHostMessageListener(hostRefs.refs, setters, labels);
  const sendAction = useExplorerSendAction(hostRefs);

  return {
    state,
    hostAnnouncement,
    hostFailure,
    language,
    outputActionId: hostRefs.refs.outputActionId.current,
    sendAction,
  };
};
