import {
  getSmoothStepPath,
  Position,
  type Edge,
  type Node,
} from "@xyflow/react";
import type { FlowNodeData } from "./flowNodePresentationModel";

export type FlowSvgExport = Readonly<{
  svg: string;
  width: number;
  height: number;
}>;

export type FlowSvgExportResult =
  | Readonly<{ status: "available"; image: FlowSvgExport }>
  | Readonly<{
      status: "unavailable";
      reason: "empty-graph" | "invalid-geometry";
    }>;

type FlowNode = Node<FlowNodeData>;
type FlowEdge = Edge;

type PositionedNode = Readonly<{
  node: FlowNode;
  x: number;
  y: number;
  width: number;
  height: number;
}>;

type PositionedPanel = Readonly<{
  node: FlowNode;
  x: number;
  y: number;
  width: number;
  height: number;
}>;

type FlowBounds = Readonly<{
  left: number;
  top: number;
  width: number;
  height: number;
}>;

type RectangleExtents = Readonly<{
  left: number;
  top: number;
  right: number;
  bottom: number;
}>;

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const FLOW_SVG_FONT_FAMILY =
  "system-ui, 'Noto Sans CJK JP', 'Hiragino Kaku Gothic ProN', 'Yu Gothic UI', 'Yu Gothic', Meiryo, sans-serif";
const VIEWBOX_PADDING = 36;
const NODE_HEADER_HEIGHT = 30;
const NODE_COLORS = {
  job: { header: "#e9edf2", border: "#67727e", badge: "#536273" },
  jobnet: { header: "#dceaff", border: "#386ca8", badge: "#315f91" },
  jobgroup: { header: "#fff0cf", border: "#a86500", badge: "#805000" },
  condition: { header: "#dff3fa", border: "#087eaa", badge: "#086483" },
} as const;
const NODE_COLORS_BY_TYPE: Record<
  string,
  (typeof NODE_COLORS)[keyof typeof NODE_COLORS]
> = {
  jobnet: NODE_COLORS.jobnet,
  jobgroup: NODE_COLORS.jobgroup,
  condition: NODE_COLORS.condition,
};

const XML_WHITESPACE_CODE_POINTS = new Set([0x9, 0xa, 0xd]);

const isBmpXmlCodePoint = (codePoint: number): boolean =>
  (codePoint >= 0x20 && codePoint <= 0xd7ff) ||
  (codePoint >= 0xe000 && codePoint <= 0xfffd);

const isXmlCodePoint = (codePoint: number): boolean =>
  XML_WHITESPACE_CODE_POINTS.has(codePoint) ||
  isBmpXmlCodePoint(codePoint) ||
  (codePoint >= 0x10000 && codePoint <= 0x10ffff);

const escapeXml = (value: string): string =>
  Array.from(value)
    .filter((character) => isXmlCodePoint(character.codePointAt(0) ?? 0))
    .join("")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const formatNumber = (value: number): string =>
  Number(value.toFixed(2)).toString();

const isPositiveFinite = (value: number | undefined): value is number =>
  value !== undefined && Number.isFinite(value) && value > 0;

const finiteNodePosition = (node: FlowNode) => {
  const { x, y } = node.position;
  return Number.isFinite(x) && Number.isFinite(y) ? { x, y } : undefined;
};

const positiveNodeDimensions = (node: FlowNode) => {
  const width = node.width ?? node.initialWidth;
  const height = node.height ?? node.initialHeight;
  if (!isPositiveFinite(width) || !isPositiveFinite(height)) return undefined;
  return { width, height };
};

const positionedNode = (node: FlowNode): PositionedNode | undefined => {
  const hasUnitIdentity = node.data.unitId === node.id && node.id.length > 0;
  const position = finiteNodePosition(node);
  const dimensions = positiveNodeDimensions(node);
  if (!hasUnitIdentity || !position || !dimensions) return undefined;
  return { node, ...position, ...dimensions };
};

export const isPanelBoundsNode = (node: FlowNode): boolean =>
  node.type === "group" && node.data.unitId === undefined;

type BoundedText = Readonly<{ value: string; textLength?: number }>;

const fitDisplayText = (
  value: string,
  availableWidth: number,
  fontSize: number,
): BoundedText => {
  const characters = Array.from(value);
  const maximumCharacterWidth = Math.ceil(fontSize);
  if (characters.length * maximumCharacterWidth <= availableWidth) {
    return { value };
  }

  const prefixWidth = Math.max(0, availableWidth - maximumCharacterWidth);
  const prefixCount = Math.floor(prefixWidth / maximumCharacterWidth);
  const prefix = characters.slice(0, prefixCount).join("").trimEnd();
  return { value: `${prefix}…`, textLength: availableWidth };
};

const textLengthAttributes = (text: BoundedText): string =>
  text.textLength === undefined
    ? ""
    : ` textLength="${formatNumber(text.textLength)}" lengthAdjust="spacingAndGlyphs"`;

const getNodeColor = (node: FlowNode) =>
  NODE_COLORS_BY_TYPE[node.type ?? ""] ?? NODE_COLORS.job;

const getDistinctComment = (node: FlowNode): string | undefined => {
  const comment = node.data.comment;
  return comment && comment !== node.data.label ? comment : undefined;
};

const renderRootBadge = (node: FlowNode, width: number): string =>
  node.data.isRootJobnet
    ? `<text x="${formatNumber(width - 12)}" y="20" text-anchor="end" font-size="9" font-weight="700" fill="#4c5661">ROOT</text>`
    : "";

const renderCommentLine = (
  comment: string | undefined,
  width: number,
): string => {
  if (!comment) return "";
  const text = fitDisplayText(comment, Math.max(width - 24, 1), 11);
  return `<text x="${formatNumber(width / 2)}" y="73" text-anchor="middle" font-size="11" fill="#586472"${textLengthAttributes(text)}>${escapeXml(text.value)}</text>`;
};

const renderNode = (positioned: PositionedNode, bounds: FlowBounds): string => {
  const { node, x, y, width, height } = positioned;
  const displayX = formatNumber(x - bounds.left);
  const displayY = formatNumber(y - bounds.top);
  const displayWidth = formatNumber(width);
  const displayHeight = formatNumber(height);
  const color = getNodeColor(node);
  const textWidth = Math.max(width - 24, 1);
  const label = fitDisplayText(node.data.label, textWidth, 13);
  const comment = getDistinctComment(node);
  const title = escapeXml(
    [node.data.label, comment].filter(Boolean).join("\n"),
  );
  const typeLabel = escapeXml(node.data.ty.toUpperCase());
  return `<g transform="translate(${displayX} ${displayY})"><title>${title}</title><rect width="${displayWidth}" height="${displayHeight}" rx="7" fill="#ffffff" stroke="${color.border}" stroke-width="1.5"/><path d="M 7 0 H ${formatNumber(width - 7)} Q ${displayWidth} 0 ${displayWidth} 7 V ${formatNumber(NODE_HEADER_HEIGHT)} H 0 V 7 Q 0 0 7 0 Z" fill="${color.header}"/><path d="M 0 ${formatNumber(NODE_HEADER_HEIGHT)} H ${displayWidth}" stroke="${color.border}" stroke-width="1.5"/><text x="10" y="20" font-size="12" font-weight="700" fill="${color.badge}">${typeLabel}</text>${renderRootBadge(node, width)}<text x="${formatNumber(width / 2)}" y="53" text-anchor="middle" font-size="13" fill="#222b35"${textLengthAttributes(label)}>${escapeXml(label.value)}</text>${renderCommentLine(comment, width)}</g>`;
};

const positionedPanel = (node: FlowNode): PositionedPanel | undefined => {
  const position = finiteNodePosition(node);
  const dimensions = positiveNodeDimensions(node);
  if (!position || !dimensions) return undefined;
  return { node, ...position, ...dimensions };
};

const renderPanel = (panel: PositionedPanel, bounds: FlowBounds): string =>
  `<rect x="${formatNumber(panel.x - bounds.left)}" y="${formatNumber(panel.y - bounds.top)}" width="${formatNumber(panel.width)}" height="${formatNumber(panel.height)}" rx="8" fill="#f7f9fb" stroke="#778594" stroke-width="1.5" stroke-dasharray="6 4"/>`;

type RenderEdgeInput = Readonly<{
  edge: FlowEdge;
  nodesById: ReadonlyMap<string, PositionedNode>;
  bounds: FlowBounds;
}>;

const conditionMarker = (edge: FlowEdge): string =>
  edge.markerStart !== undefined ? ' marker-start="url(#flow-arrow)"' : "";

const renderEdge = ({
  edge,
  nodesById,
  bounds,
}: RenderEdgeInput): string | undefined => {
  const source = nodesById.get(edge.source);
  const target = nodesById.get(edge.target);
  if (!source || !target) return undefined;
  const [path] = getSmoothStepPath({
    sourceX: source.x + source.width - bounds.left,
    sourceY: source.y + source.height / 2 - bounds.top,
    sourcePosition: Position.Right,
    targetX: target.x - bounds.left,
    targetY: target.y + target.height / 2 - bounds.top,
    targetPosition: Position.Left,
  });
  return `<path d="${escapeXml(path)}" fill="none" stroke="#566473" stroke-width="1.8" marker-end="url(#flow-arrow)"${conditionMarker(edge)}/>`;
};

type FlowSvgPreparation =
  | Readonly<{
      status: "unavailable";
      reason: "empty-graph" | "invalid-geometry";
    }>
  | Readonly<{
      status: "prepared";
      units: PositionedNode[];
      panels: PositionedPanel[];
      bounds: FlowBounds;
      edgeMarkup: string;
    }>;

const getUnitPositionFailure = (
  candidateCount: number,
  positionedCount: number,
): "empty-graph" | "invalid-geometry" | undefined => {
  if (candidateCount === 0) return "empty-graph";
  if (candidateCount !== positionedCount) return "invalid-geometry";
  return undefined;
};

const positionUnits = (nodes: readonly FlowNode[]) => {
  const candidates = nodes
    .filter((node) => !isPanelBoundsNode(node))
    .map(positionedNode);
  const units = candidates.filter(
    (node): node is PositionedNode => node !== undefined,
  );
  const reason = getUnitPositionFailure(candidates.length, units.length);
  return { units, reason };
};

const positionPanels = (nodes: readonly FlowNode[]) => {
  const candidates = nodes.filter(isPanelBoundsNode).map(positionedPanel);
  const panels = candidates.filter(
    (panel): panel is PositionedPanel => panel !== undefined,
  );
  return { panels, isValid: panels.length === candidates.length };
};

const getRectangleExtents = ({
  x,
  y,
  width,
  height,
}: PositionedNode | PositionedPanel): RectangleExtents => ({
  left: x,
  top: y,
  right: x + width,
  bottom: y + height,
});

const isValidRectangleExtents = (extents: RectangleExtents): boolean =>
  [extents.left, extents.top, extents.right, extents.bottom].every(
    Number.isFinite,
  ) &&
  extents.right > extents.left &&
  extents.bottom > extents.top;

const isValidFlowBounds = (bounds: FlowBounds): boolean =>
  [bounds.left, bounds.top, bounds.width, bounds.height].every(
    Number.isFinite,
  ) &&
  bounds.width > 0 &&
  bounds.height > 0;

const calculateBounds = (
  units: readonly PositionedNode[],
  panels: readonly PositionedPanel[],
): FlowBounds | undefined => {
  const rectangles = units.concat(panels);
  const extents = rectangles.reduce<RectangleExtents>(
    (bounds, rectangle) => {
      const next = getRectangleExtents(rectangle);
      return {
        left: Math.min(bounds.left, next.left),
        top: Math.min(bounds.top, next.top),
        right: Math.max(bounds.right, next.right),
        bottom: Math.max(bounds.bottom, next.bottom),
      };
    },
    {
      left: Number.POSITIVE_INFINITY,
      top: Number.POSITIVE_INFINITY,
      right: Number.NEGATIVE_INFINITY,
      bottom: Number.NEGATIVE_INFINITY,
    },
  );
  if (
    !rectangles.every((rectangle) =>
      isValidRectangleExtents(getRectangleExtents(rectangle)),
    )
  ) {
    return undefined;
  }
  const bounds = {
    left: extents.left - VIEWBOX_PADDING,
    top: extents.top - VIEWBOX_PADDING,
    width: Math.ceil(extents.right - extents.left + VIEWBOX_PADDING * 2),
    height: Math.ceil(extents.bottom - extents.top + VIEWBOX_PADDING * 2),
  };
  return isValidFlowBounds(bounds) ? bounds : undefined;
};

const renderEdges = (
  edges: readonly FlowEdge[],
  units: readonly PositionedNode[],
  bounds: FlowBounds,
): string | undefined => {
  const nodesById = new Map(
    units.map((positioned) => [positioned.node.id, positioned]),
  );
  const markup = edges.map((edge) => renderEdge({ edge, nodesById, bounds }));
  return markup.some((edge) => edge === undefined)
    ? undefined
    : markup.join("");
};

type FlowSvgGeometry = Readonly<{
  panelsValid: boolean;
  bounds: FlowBounds | undefined;
  edgeMarkup: string | undefined;
}>;

const hasCompleteFlowGeometry = (input: FlowSvgGeometry): boolean =>
  input.panelsValid &&
  input.bounds !== undefined &&
  input.edgeMarkup !== undefined;

const getFlowSvgPreparationReason = (
  input: {
    unitReason: "empty-graph" | "invalid-geometry" | undefined;
  } & FlowSvgGeometry,
): "empty-graph" | "invalid-geometry" | undefined => {
  if (input.unitReason !== undefined) return input.unitReason;
  return hasCompleteFlowGeometry(input) ? undefined : "invalid-geometry";
};

const prepareFlowSvg = (
  nodes: readonly FlowNode[],
  edges: readonly FlowEdge[],
): FlowSvgPreparation => {
  const positionedUnits = positionUnits(nodes);
  const positionedPanels = positionPanels(nodes);
  const bounds = calculateBounds(
    positionedUnits.units,
    positionedPanels.panels,
  );
  const edgeMarkup = renderEdges(
    edges,
    positionedUnits.units,
    bounds ?? { left: 0, top: 0, width: 1, height: 1 },
  );
  const reason = getFlowSvgPreparationReason({
    unitReason: positionedUnits.reason,
    panelsValid: positionedPanels.isValid,
    bounds,
    edgeMarkup,
  });
  return reason === undefined
    ? {
        status: "prepared",
        units: positionedUnits.units,
        panels: positionedPanels.panels,
        bounds: bounds as FlowBounds,
        edgeMarkup: edgeMarkup as string,
      }
    : { status: "unavailable", reason };
};

const renderFlowSvg = ({
  units,
  panels,
  bounds,
  edgeMarkup,
}: Extract<FlowSvgPreparation, { status: "prepared" }>): string => {
  const panelMarkup = panels
    .map((panel) => renderPanel(panel, bounds))
    .join("");
  const unitMarkup = units.map((node) => renderNode(node, bounds)).join("");
  return `<svg xmlns="${SVG_NAMESPACE}" width="${bounds.width}" height="${bounds.height}" viewBox="0 0 ${bounds.width} ${bounds.height}" font-family="${FLOW_SVG_FONT_FAMILY}" role="img" aria-labelledby="flow-title flow-description"><title id="flow-title">JP1/AJS job flow</title><desc id="flow-description">The active job flow, with expanded nested jobnets.</desc><defs><marker id="flow-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#566473"/></marker></defs><rect width="100%" height="100%" fill="#ffffff"/>${panelMarkup}${edgeMarkup}${unitMarkup}</svg>`;
};

export const createFlowSvg = (
  nodes: readonly FlowNode[],
  edges: readonly FlowEdge[],
): FlowSvgExportResult => {
  try {
    const preparation = prepareFlowSvg(nodes, edges);
    if (preparation.status === "unavailable") return preparation;
    const { bounds } = preparation;
    return {
      status: "available",
      image: {
        svg: renderFlowSvg(preparation),
        width: bounds.width,
        height: bounds.height,
      },
    };
  } catch {
    return { status: "unavailable", reason: "invalid-geometry" };
  }
};
