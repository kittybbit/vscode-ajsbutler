export const flowNodeGeometryEm = {
  width: 10.5,
  height: 7.25,
} as const;

export const createFlowNodeGeometryPx = (basePx: number) => ({
  width: basePx * flowNodeGeometryEm.width,
  height: basePx * flowNodeGeometryEm.height,
});

export const flowNodeHandleTop = "50%";
