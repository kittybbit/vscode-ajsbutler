import { EXTENSION_ID } from "../constant";

export const AJS_FLOW_VIEWER_NAME = "flowViewer";
export const AJS_FLOW_VIEWER_TYPE = `${EXTENSION_ID}.${AJS_FLOW_VIEWER_NAME}`;
export const AJS_FLOW_VIEWER_BUNDLE_SRC = "./out/flowViewer.js";

export const AJS_TABLE_VIEWER_NAME = "tableViewer";
export const AJS_TABLE_VIEWER_TYPE = `${EXTENSION_ID}.${AJS_TABLE_VIEWER_NAME}`;
export const AJS_TABLE_VIEWER_BUNDLE_SRC = "./out/tableViewer.js";

export const getViewerBundleSrc = (viewType: string): string => {
  switch (viewType) {
    case AJS_TABLE_VIEWER_TYPE:
      return AJS_TABLE_VIEWER_BUNDLE_SRC;
    case AJS_FLOW_VIEWER_TYPE:
      return AJS_FLOW_VIEWER_BUNDLE_SRC;
    default:
      throw new Error(`Unknown viewer bundle for view type: ${viewType}`);
  }
};
