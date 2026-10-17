export type ViewerTelemetryKind = "table" | "flow" | "unknown";

export const resolveViewerTelemetryKind = (
  viewType: string,
): ViewerTelemetryKind => {
  if (viewType.endsWith(".tableViewer")) return "table";
  if (viewType.endsWith(".flowViewer")) return "flow";
  return "unknown";
};
