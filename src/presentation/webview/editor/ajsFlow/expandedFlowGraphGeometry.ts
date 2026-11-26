import { FlowGraphPosition } from "./flowGraphPosition";
import {
  ExpandedNodeDecoration,
  FlowGraphBounds,
  FlowGraphMetrics,
  LayoutBox,
} from "./expandedFlowGraphTypes";

type PanelPadding = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

export const includeNodeBounds = (
  bounds: FlowGraphBounds,
  nodeBounds: {
    position: FlowGraphPosition;
    width: number;
    height: number;
  },
) => {
  const { position, width, height } = nodeBounds;
  bounds.minX = Math.min(bounds.minX, position.x);
  bounds.maxX = Math.max(bounds.maxX, position.x + width);
  bounds.minY = Math.min(bounds.minY, position.y);
  bounds.maxY = Math.max(bounds.maxY, position.y + height);
};

export const includeDecorationBounds = (
  bounds: FlowGraphBounds,
  position: FlowGraphPosition,
  decoration: ExpandedNodeDecoration,
) => {
  bounds.minX = Math.min(bounds.minX, position.x + decoration.panelOffsetXPx);
  bounds.maxX = Math.max(
    bounds.maxX,
    position.x + decoration.panelOffsetXPx + decoration.panelWidthPx,
  );
  bounds.minY = Math.min(bounds.minY, position.y + decoration.panelOffsetYPx);
  bounds.maxY = Math.max(
    bounds.maxY,
    position.y + decoration.panelOffsetYPx + decoration.panelHeightPx,
  );
};

export const toDecorationFromBounds = (
  position: FlowGraphPosition,
  bounds: FlowGraphBounds,
): ExpandedNodeDecoration => ({
  panelOffsetXPx: bounds.minX - position.x,
  panelOffsetYPx: bounds.minY - position.y,
  panelWidthPx: bounds.maxX - bounds.minX,
  panelHeightPx: bounds.maxY - bounds.minY,
});

const toFlowGraphBounds = (
  min: FlowGraphPosition,
  max: FlowGraphPosition,
): FlowGraphBounds => ({
  minX: min.x,
  maxX: max.x,
  minY: min.y,
  maxY: max.y,
});

const buildPaddedBounds = (
  origin: FlowGraphPosition,
  extent: FlowGraphPosition,
  padding: PanelPadding,
): FlowGraphBounds =>
  toFlowGraphBounds(
    {
      x: origin.x - padding.left,
      y: origin.y - padding.top,
    },
    {
      x: extent.x + padding.right,
      y: extent.y + padding.bottom,
    },
  );

const getUnitBasePadding = (metrics: FlowGraphMetrics): PanelPadding => ({
  left: metrics.width * 0.3,
  right: metrics.width * 0.3,
  top: metrics.height * 0.2,
  bottom: metrics.height * 0.35,
});

export const buildPanelBoundsFromSubtreeBounds = (
  bounds: FlowGraphBounds,
  basePx: number,
): FlowGraphBounds => ({
  minX: bounds.minX - basePx,
  maxX: bounds.maxX + basePx,
  minY: bounds.minY - basePx,
  maxY: bounds.maxY + basePx,
});

export const buildUnitBaseBounds = (
  position: FlowGraphPosition,
  metrics: FlowGraphMetrics,
): FlowGraphBounds =>
  buildPaddedBounds(
    position,
    {
      x: position.x + metrics.width,
      y: position.y + metrics.height,
    },
    getUnitBasePadding(metrics),
  );

const buildUnitDecorationBounds = (
  position: FlowGraphPosition,
  decoration: ExpandedNodeDecoration,
): FlowGraphBounds =>
  toFlowGraphBounds(
    {
      x: position.x + decoration.panelOffsetXPx,
      y: position.y + decoration.panelOffsetYPx,
    },
    {
      x: position.x + decoration.panelOffsetXPx + decoration.panelWidthPx,
      y: position.y + decoration.panelOffsetYPx + decoration.panelHeightPx,
    },
  );

export const buildUnitPanelBounds = (
  position: FlowGraphPosition,
  decoration: ExpandedNodeDecoration | undefined,
  metrics: FlowGraphMetrics,
): FlowGraphBounds =>
  decoration
    ? buildUnitDecorationBounds(position, decoration)
    : {
        minX: position.x,
        maxX: position.x + metrics.width,
        minY: position.y,
        maxY: position.y + metrics.height,
      };

const doHorizontalRangesOverlap = (
  left: Pick<FlowGraphBounds, "minX" | "maxX">,
  right: Pick<FlowGraphBounds, "minX" | "maxX">,
): boolean => left.minX < right.maxX && right.minX < left.maxX;

export const doBoundsOverlapHorizontally = (
  upperBounds: FlowGraphBounds,
  lowerBounds: FlowGraphBounds,
): boolean => doHorizontalRangesOverlap(upperBounds, lowerBounds);

export const doBoundsOverlap = (
  left: LayoutBox,
  right: LayoutBox,
  tolerance = 0,
): boolean =>
  Math.min(left.maxX, right.maxX) - Math.max(left.minX, right.minX) >
    tolerance &&
  Math.min(left.maxY, right.maxY) - Math.max(left.minY, right.minY) > tolerance;
