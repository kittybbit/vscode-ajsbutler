import type { AriaLabelConfig } from "@xyflow/react";
import {
  formatUnitInformationMessage,
  unitInformationMessage,
} from "../unitInformationLocalization";

export type FlowSpatialDirection = "left" | "right" | "up" | "down";

export const flowSpatialDirectionLabel = (
  direction: FlowSpatialDirection,
  language = "en",
): string =>
  formatUnitInformationMessage(`a11y.direction.${direction}`, language);

export const flowAriaLabelConfig = (
  language = "en",
): Partial<AriaLabelConfig> => ({
  "node.a11yDescription.default": unitInformationMessage(
    "a11y.flow.reactFlow.node",
    language,
  ),
  "node.a11yDescription.keyboardDisabled": unitInformationMessage(
    "a11y.flow.reactFlow.nodeKeyboardDisabled",
    language,
  ),
  "node.a11yDescription.ariaLiveMessage": ({ direction, x, y }) =>
    formatUnitInformationMessage("a11y.flow.reactFlow.moved", language, {
      direction: flowSpatialDirectionLabel(
        direction as FlowSpatialDirection,
        language,
      ),
      x,
      y,
    }),
  "edge.a11yDescription.default": unitInformationMessage(
    "a11y.flow.reactFlow.edge",
    language,
  ),
  "controls.ariaLabel": unitInformationMessage(
    "a11y.flow.reactFlow.controls",
    language,
  ),
  "controls.zoomIn.ariaLabel": unitInformationMessage(
    "a11y.flow.reactFlow.zoomIn",
    language,
  ),
  "controls.zoomOut.ariaLabel": unitInformationMessage(
    "a11y.flow.reactFlow.zoomOut",
    language,
  ),
  "controls.fitView.ariaLabel": unitInformationMessage(
    "a11y.flow.reactFlow.fitView",
    language,
  ),
  "controls.interactive.ariaLabel": unitInformationMessage(
    "a11y.flow.reactFlow.interactive",
    language,
  ),
  "minimap.ariaLabel": unitInformationMessage(
    "a11y.flow.reactFlow.minimap",
    language,
  ),
});
