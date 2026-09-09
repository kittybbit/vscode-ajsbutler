import type * as vscode from "vscode";
import {
  createSemanticDiffExplorerError,
  createSemanticDiffExplorerFailureMessage,
  serializeSemanticDiffExplorerMessage,
  type SemanticDiffExplorerHostMessage,
} from "../../../../application/semantic-diff/semanticDiffExplorerMessages";
import type {
  SemanticDiffExplorerActionLookup,
  SemanticDiffExplorerSession,
  SemanticDiffExplorerSessionId,
} from "../../../../application/semantic-diff/semanticDiffExplorer";
import type { SemanticDiffExplorerActionId } from "../../../../application/semantic-diff/semanticDiffExplorer";

type PanelTransportOptions = Readonly<{
  panel: vscode.WebviewPanel;
  session: SemanticDiffExplorerSession;
  actionIds: SemanticDiffExplorerActionLookup;
  isDisposed: () => boolean;
  disposeEpoch: () => number;
}>;

const isThenableBoolean = (value: unknown): value is Thenable<boolean> =>
  typeof value === "object" && value !== null && "then" in value;

const postJson = async (
  panel: vscode.WebviewPanel,
  value: Record<string, unknown>,
): Promise<void> => {
  const posted = panel.webview.postMessage(value);
  if (isThenableBoolean(posted) && (await posted) === false) {
    throw new Error("Explorer message could not be posted.");
  }
};

const postPayloadFailure = async (
  panel: vscode.WebviewPanel,
): Promise<void> => {
  const fallback = serializeSemanticDiffExplorerMessage(
    createSemanticDiffExplorerFailureMessage(
      null,
      null,
      null,
      createSemanticDiffExplorerError("payload-too-large"),
    ),
  );
  if (!("error" in fallback)) {
    await postJson(panel, JSON.parse(fallback.json) as Record<string, unknown>);
  }
};

const postSerializedMessage = async (
  serialized: ReturnType<typeof serializeSemanticDiffExplorerMessage>,
  options: PanelTransportOptions,
): Promise<void> => {
  if ("error" in serialized) {
    await postSerializedError(serialized.error.code, options);
  } else {
    await postJson(
      options.panel,
      JSON.parse(serialized.json) as Record<string, unknown>,
    );
  }
};

const postSerializedError = async (
  code: string,
  options: PanelTransportOptions,
): Promise<void> => {
  if (code === "payload-too-large") {
    await postPayloadFailure(options.panel);
  } else {
    throw new Error(`Explorer message rejected: ${code}`);
  }
};

export const postSemanticDiffExplorerMessage = async (
  message: SemanticDiffExplorerHostMessage,
  options: PanelTransportOptions,
  expectedEpoch = options.disposeEpoch(),
): Promise<void> => {
  const current =
    !options.isDisposed() && expectedEpoch === options.disposeEpoch();
  if (!current) {
    return;
  }
  const serialized = serializeSemanticDiffExplorerMessage(message, {
    expectedSessionId: options.session.sessionId,
    actionIds: options.actionIds,
  });
  await postSerializedMessage(serialized, options);
};

export type SemanticDiffExplorerPanelTransport = Readonly<{
  post(
    message: SemanticDiffExplorerHostMessage,
    expectedEpoch?: number,
  ): Promise<void>;
  sessionId: SemanticDiffExplorerSessionId;
  actionIds: SemanticDiffExplorerActionLookup;
  outputActionId: SemanticDiffExplorerActionId;
}>;
