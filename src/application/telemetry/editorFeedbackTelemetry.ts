import type { SyntaxDiagnosticCategory } from "../editor-feedback/syntaxDiagnosticTypes";
import {
  createTelemetryEvent,
  telemetryEvents,
  telemetryPropertyKeys,
  type TelemetryEvent,
  type TelemetryEventDefinition,
} from "./telemetryEvent";
import type { TelemetryHost } from "./viewerTelemetry";

export type EditorDiagnosticsResult = "success" | "failed";
export type EditorDiagnosticsReportedResult = "reported";
export type EditorHoverAction = "requested" | "resolved";
export type EditorHoverResult = "success" | "matched" | "no_match" | "failed";
export type HoverTargetCategory = "parameter" | "none";

const hoverEvents: Record<EditorHoverAction, TelemetryEventDefinition> = {
  requested: telemetryEvents.editorHoverRequested,
  resolved: telemetryEvents.editorHoverResolved,
};

export const createDiagnosticsEvaluatedTelemetryEvent = ({
  host,
  result,
  durationBucket,
  diagnosticCountBucket,
  errorCode,
}: {
  host?: TelemetryHost;
  result: EditorDiagnosticsResult;
  durationBucket?: string;
  diagnosticCountBucket?: string;
  errorCode?: string;
}): TelemetryEvent =>
  createTelemetryEvent(telemetryEvents.editorDiagnosticsEvaluated, {
    [telemetryPropertyKeys.development]: DEVELOPMENT,
    [telemetryPropertyKeys.host]: host,
    [telemetryPropertyKeys.result]: result,
    [telemetryPropertyKeys.durationBucket]: durationBucket,
    [telemetryPropertyKeys.diagnosticCountBucket]: diagnosticCountBucket,
    [telemetryPropertyKeys.errorCode]: errorCode,
  });

export const createDiagnosticsReportedTelemetryEvent = ({
  host,
  result,
  diagnosticCategory,
  diagnosticCountBucket,
  diagnosticRuleId,
}: {
  host?: TelemetryHost;
  result: EditorDiagnosticsReportedResult;
  diagnosticCategory: SyntaxDiagnosticCategory;
  diagnosticCountBucket: string;
  diagnosticRuleId?: string;
}): TelemetryEvent =>
  createTelemetryEvent(telemetryEvents.editorDiagnosticsReported, {
    [telemetryPropertyKeys.development]: DEVELOPMENT,
    [telemetryPropertyKeys.host]: host,
    [telemetryPropertyKeys.result]: result,
    [telemetryPropertyKeys.diagnosticCategory]: diagnosticCategory,
    [telemetryPropertyKeys.diagnosticCountBucket]: diagnosticCountBucket,
    [telemetryPropertyKeys.diagnosticRuleId]: diagnosticRuleId,
  });

export const createHoverTelemetryEvent = ({
  action,
  host,
  result,
  durationBucket,
  hoverTargetCategory,
  errorCode,
}: {
  action: EditorHoverAction;
  host?: TelemetryHost;
  result: EditorHoverResult;
  durationBucket?: string;
  hoverTargetCategory?: HoverTargetCategory;
  errorCode?: string;
}): TelemetryEvent =>
  createTelemetryEvent(hoverEvents[action], {
    [telemetryPropertyKeys.development]: DEVELOPMENT,
    [telemetryPropertyKeys.host]: host,
    [telemetryPropertyKeys.result]: result,
    [telemetryPropertyKeys.durationBucket]: durationBucket,
    [telemetryPropertyKeys.hoverTargetCategory]: hoverTargetCategory,
    [telemetryPropertyKeys.errorCode]: errorCode,
  });
