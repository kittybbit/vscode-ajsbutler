import type * as vscode from "vscode";
import type {
  SemanticDiffExplorerActionIdAllocator,
  SemanticDiffExplorerSessionId,
  SemanticDiffExplorerSessionIdAllocator,
} from "../../../../application/semantic-diff/semanticDiffExplorer";
import type { SemanticDiffOutputContext } from "../../../../application/semantic-diff/semanticDiffDto";
import type {
  SemanticDiffOutputDocument,
  SemanticDiffOutputModeItem,
} from "../../../semantic-diff/semanticDiffOutput";
import type { SemanticDiffFlowActionRequest } from "../flow/semanticDiffExplorerFlowTypes";
import type {
  SemanticDiffExplorerActionRegistry,
  SemanticDiffExplorerContextRegistry,
} from "./semanticDiffExplorerRegistry";
import type { presentSemanticDiffOutput } from "../../../semantic-diff/semanticDiffOutput";
import type { SemanticDiffScheduleImpact } from "../../../../application/semantic-diff/semanticDiffScheduleImpact";
import type { ScheduleImpactCalendarSessionRegistry } from "../calendar/scheduleImpactCalendarSessionRegistry";
import type { ScheduleImpactCalendarPanelHandle } from "../calendar/scheduleImpactCalendarPanel";

export type SemanticDiffScheduleImpactLookup = Readonly<{
  resolve(
    context: SemanticDiffOutputContext,
  ): SemanticDiffScheduleImpact | undefined;
}>;

/** The host-only handle intentionally does not expose the application session. */
export type SemanticDiffExplorerSessionHandle = Readonly<{
  sessionId: SemanticDiffExplorerSessionId;
  panel: vscode.WebviewPanel;
  dispose(): void;
}>;

export type SemanticDiffExplorerPanelDeps = Readonly<{
  extensionContext: vscode.ExtensionContext;
  createWebviewPanel?: typeof vscode.window.createWebviewPanel;
  showQuickPick: (
    items: readonly SemanticDiffOutputModeItem[],
    options?: vscode.QuickPickOptions,
  ) => Thenable<SemanticDiffOutputModeItem | undefined>;
  openReport: (document: SemanticDiffOutputDocument) => Thenable<unknown>;
  presentOutput?: typeof presentSemanticDiffOutput;
  language?: string;
  sourceLifetimeRelease?: () => void;
  openTextDocument?: (uri: vscode.Uri) => Thenable<vscode.TextDocument>;
  showTextDocument?: (
    document: vscode.TextDocument,
    options?: vscode.TextDocumentShowOptions,
  ) => Thenable<vscode.TextEditor>;
  contextRegistry?: SemanticDiffExplorerContextRegistry;
  actionRegistry?: SemanticDiffExplorerActionRegistry;
  sessionIdAllocator: SemanticDiffExplorerSessionIdAllocator;
  actionIdAllocator: SemanticDiffExplorerActionIdAllocator;
  /** Host-owned Flow adapter; viewer transport remains unchanged. */
  flowAction?: (
    request: SemanticDiffFlowActionRequest,
    context: SemanticDiffOutputContext,
    isCurrent: () => boolean,
  ) => Promise<
    | Readonly<{ ok: true }>
    | Readonly<{
        ok: false;
        code: "flow-not-ready" | "flow-target-missing";
        targetId?: string;
      }>
  >;
  disposeFlowSession?: (sessionId: SemanticDiffExplorerSessionId) => void;
  /** Host-private calendar sidecar lookup. The context object is the key. */
  scheduleImpactSidecarRegistry?: SemanticDiffScheduleImpactLookup;
  calendarSessionRegistry?: ScheduleImpactCalendarSessionRegistry;
  openScheduleImpactCalendarPanel?: (
    input: Readonly<{
      parentSessionId: string;
      context: SemanticDiffOutputContext;
      sidecar: SemanticDiffScheduleImpact;
      displayLanguage?: string;
    }>,
  ) => ScheduleImpactCalendarPanelHandle;
}>;
