import {
  createTelemetryEvent,
  telemetryEvents,
  telemetryPropertyKeys,
  type TelemetryEvent,
  type TelemetryEventDefinition,
} from "./telemetryEvent";
import type { TelemetryHost } from "./viewerTelemetry";

export const viewerOperationIds = {
  copyCsv: "copy.csv",
  saveCsv: "save.csv",
  unitSelect: "unit.select",
  definitionOpen: "definition.open",
  flowScopeOpen: "flow.scope.open",
  flowNestedToggle: "flow.nested.toggle",
  flowRelationshipFocusToggle: "flow.relationship_focus.toggle",
  flowMiniMapToggle: "flow.minimap.toggle",
} as const;

type ViewerActionView = "table" | "flow";

const tableActionEvents: Record<string, TelemetryEventDefinition> = {
  [viewerOperationIds.copyCsv]: telemetryEvents.viewerTableCsvCopied,
  [viewerOperationIds.saveCsv]: telemetryEvents.viewerTableCsvSaved,
  [viewerOperationIds.unitSelect]: telemetryEvents.viewerTableUnitSelected,
  [viewerOperationIds.definitionOpen]:
    telemetryEvents.viewerTableDefinitionOpened,
};

const flowActionEvents: Record<string, TelemetryEventDefinition> = {
  [viewerOperationIds.unitSelect]: telemetryEvents.viewerFlowUnitSelected,
  [viewerOperationIds.definitionOpen]:
    telemetryEvents.viewerFlowDefinitionOpened,
  [viewerOperationIds.flowScopeOpen]: telemetryEvents.viewerFlowScopeOpened,
  [viewerOperationIds.flowNestedToggle]:
    telemetryEvents.viewerFlowNestedExpansionToggled,
  [viewerOperationIds.flowRelationshipFocusToggle]:
    telemetryEvents.viewerFlowRelationshipFocusToggled,
  [viewerOperationIds.flowMiniMapToggle]:
    telemetryEvents.viewerFlowMiniMapToggled,
};

export const createViewerActionEvent = ({
  viewType,
  operation,
  host,
  result = "success",
}: {
  viewType: string;
  operation: string;
  host?: TelemetryHost;
  result?: "success" | "failed" | "cancelled";
}): TelemetryEvent | undefined => {
  const view = resolveViewerActionView(viewType);
  const definition = findViewerActionDefinition(view, operation);
  if (!definition) {
    return undefined;
  }

  return createTelemetryEvent(definition, {
    [telemetryPropertyKeys.development]: DEVELOPMENT,
    [telemetryPropertyKeys.host]: host,
    [telemetryPropertyKeys.view]: view,
    [telemetryPropertyKeys.result]: result,
  });
};

export const createViewerNavigationActionEvent = ({
  viewType,
  targetView,
  host,
}: {
  viewType: string;
  targetView: "table" | "flow";
  host?: TelemetryHost;
}): TelemetryEvent | undefined => {
  const sourceView = resolveViewerActionView(viewType);
  const definition =
    sourceView === "table" && targetView === "flow"
      ? telemetryEvents.viewerTableNavigateToFlow
      : sourceView === "flow" && targetView === "table"
        ? telemetryEvents.viewerFlowNavigateToTable
        : undefined;
  if (!definition) {
    return undefined;
  }

  return createTelemetryEvent(definition, {
    [telemetryPropertyKeys.development]: DEVELOPMENT,
    [telemetryPropertyKeys.host]: host,
    [telemetryPropertyKeys.view]: sourceView,
    [telemetryPropertyKeys.result]: "success",
  });
};

const resolveViewerActionView = (
  viewType: string,
): ViewerActionView | undefined => {
  if (viewType.endsWith(".tableViewer")) {
    return "table";
  }
  if (viewType.endsWith(".flowViewer")) {
    return "flow";
  }

  return undefined;
};

const findViewerActionDefinition = (
  view: ViewerActionView | undefined,
  operation: string,
): TelemetryEventDefinition | undefined => {
  if (view === "table") {
    return tableActionEvents[operation];
  }
  if (view === "flow") {
    return flowActionEvents[operation];
  }

  return undefined;
};
