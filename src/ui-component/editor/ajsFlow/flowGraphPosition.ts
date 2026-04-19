import { FlowGraphNodeDto } from "../../../application/flow-graph/buildFlowGraphCore";

export type FlowGraphPosition = {
  x: number;
  y: number;
};

type FlowGraphMetrics = {
  width: number;
  height: number;
  ancestorMarginX: number;
  marginX: number;
  marginY: number;
  offsetX: number;
  ancestorOffsetY: number;
  gridOffsetY: number;
};

export const createFlowGraphMetrics = (basePx: number): FlowGraphMetrics => {
  const width = basePx * 6;
  const height = basePx * 6;
  return {
    width,
    height,
    ancestorMarginX: width / 5,
    marginX: width / 4,
    marginY: height / 4,
    offsetX: width / 3,
    ancestorOffsetY: height / 2,
    gridOffsetY: height * 2,
  };
};

export const calculateFlowGraphNodePosition = (
  node: FlowGraphNodeDto,
  basePx: number,
): FlowGraphPosition => {
  const metrics = createFlowGraphMetrics(basePx);
  if (node.metadata.layout.kind === "ancestor") {
    return {
      x:
        metrics.offsetX +
        (metrics.width + metrics.ancestorMarginX) * node.metadata.layout.depth,
      y: metrics.ancestorOffsetY,
    };
  }

  const { h, v } = node.metadata.layout;
  return {
    x:
      metrics.offsetX +
      (metrics.width + metrics.marginX) * ((h - 80) / 160 - 1),
    y:
      metrics.gridOffsetY +
      (metrics.height + metrics.marginY) * ((v - 48) / 96),
  };
};

export const calculateNestedChildPosition = (
  parentPosition: FlowGraphPosition,
  h: number,
  v: number,
  basePx: number,
): FlowGraphPosition => {
  const metrics = createFlowGraphMetrics(basePx);
  return {
    x: parentPosition.x + (metrics.width + metrics.marginX) * ((h - 240) / 160),
    y:
      parentPosition.y +
      metrics.height * 2.5 +
      (metrics.height + metrics.marginY) * ((v - 144) / 96),
  };
};

export const calculateNestedConditionPosition = (
  parentPosition: FlowGraphPosition,
  basePx: number,
): FlowGraphPosition => {
  const metrics = createFlowGraphMetrics(basePx);
  return {
    x: parentPosition.x - metrics.width - metrics.marginX,
    y: parentPosition.y + metrics.height * 1.4,
  };
};
