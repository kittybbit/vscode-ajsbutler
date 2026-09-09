import type {
  SemanticDiffLimitation,
  SemanticDiffRelationPair,
  SemanticDiffScheduleRunChange,
  SemanticDiffSide,
  SemanticDiffTarget,
} from "./semanticDiffDto";
import type { SemanticDiffExplorerLeaf } from "./semanticDiffExplorerDto";

export type PathPlacement = {
  segments: readonly string[];
  path: string | null;
  finalKind: "job-group" | "unit";
};

export const pathSegments = (path: string): string[] =>
  path.split("/").filter((segment) => segment.length > 0);

export const pathFromSegments = (segments: readonly string[]): string | null =>
  segments.length === 0 ? null : `/${segments.join("/")}`;

const commonSegments = (
  source: readonly string[],
  destination: readonly string[],
): string[] => {
  const limit = Math.min(source.length, destination.length);
  const indexes = Array.from({ length: limit }, (_, index) => index);
  const mismatch = indexes.find(
    (index) => source[index] !== destination[index],
  );
  return source.slice(0, mismatch ?? limit);
};

export const commonParentPath = (
  source: string,
  destination: string,
): string | null => {
  const sourceParent = pathSegments(source).slice(0, -1);
  const destinationParent = pathSegments(destination).slice(0, -1);
  return pathFromSegments(commonSegments(sourceParent, destinationParent));
};

const pathPlacement = (
  path: string,
  finalKind: PathPlacement["finalKind"],
): PathPlacement | null => {
  const segments = pathSegments(path);
  return segments.length === 0
    ? null
    : { segments, path: pathFromSegments(segments), finalKind };
};

const jobGroupPlacement = (
  target: SemanticDiffTarget & { kind: "job-group" },
): PathPlacement | null =>
  target.path === undefined || target.path.length === 0
    ? null
    : pathPlacement(target.path, "job-group");

const unitPlacement = (
  target: SemanticDiffTarget & { kind: "unit" | "jobnet" | "attribute" },
): PathPlacement | null => pathPlacement(target.unit.absolutePath, "unit");

const relationPlacement = (
  relationPair: SemanticDiffRelationPair | null,
  relationSide: SemanticDiffSide | null,
): PathPlacement | null => {
  const paths = relationPaths(relationPair, relationSide);
  const relationPath =
    paths === null ? null : commonParentPath(paths.source, paths.target);
  return relationPath === null
    ? null
    : pathPlacement(relationPath, "job-group");
};

const relationPaths = (
  relationPair: SemanticDiffRelationPair | null,
  relationSide: SemanticDiffSide | null,
): { source: string; target: string } | null => {
  const endpoint = relationEndpoint(relationPair, relationSide);
  const source = endpoint?.sourceUnitPath ?? null;
  const target = endpoint?.targetUnitPath ?? null;
  return source === null || target === null ? null : { source, target };
};

const relationEndpoint = (
  relationPair: SemanticDiffRelationPair | null,
  relationSide: SemanticDiffSide | null,
): SemanticDiffRelationPair["before"] => {
  if (
    relationPair === null ||
    relationSide === null ||
    (relationSide !== "before" && relationSide !== "after")
  ) {
    return null;
  }
  return relationPair[relationSide];
};

type TargetPlacement = (
  target: SemanticDiffTarget,
  relationPair: SemanticDiffRelationPair | null,
  relationSide: SemanticDiffSide | null,
) => PathPlacement | null;

const targetPlacements = new Map<string, TargetPlacement>([
  [
    "job-group",
    (target) =>
      jobGroupPlacement(target as SemanticDiffTarget & { kind: "job-group" }),
  ],
  [
    "unit",
    (target) => unitPlacement(target as SemanticDiffTarget & { kind: "unit" }),
  ],
  [
    "jobnet",
    (target) =>
      unitPlacement(target as SemanticDiffTarget & { kind: "jobnet" }),
  ],
  [
    "attribute",
    (target) =>
      unitPlacement(target as SemanticDiffTarget & { kind: "attribute" }),
  ],
  ["relation", (_target, pair, side) => relationPlacement(pair, side)],
]);

export const placementForTarget = (
  target: SemanticDiffTarget | null,
  relationPair: SemanticDiffRelationPair | null = null,
  relationSide: SemanticDiffSide | null = null,
): PathPlacement | null => {
  if (target === null) return null;
  return (
    targetPlacements.get(target.kind)?.(target, relationPair, relationSide) ??
    null
  );
};

export const placementForLimitation = (
  item: Pick<SemanticDiffLimitation, "unitPath">,
): PathPlacement | null =>
  item.unitPath === null || item.unitPath.length === 0
    ? null
    : pathPlacement(item.unitPath, "unit");

export const placementForSchedule = (
  item: SemanticDiffScheduleRunChange,
): PathPlacement | null =>
  item.unitPath.length === 0 ? null : pathPlacement(item.unitPath, "unit");

const leafPlacements = new Map<
  string,
  (leaf: SemanticDiffExplorerLeaf) => PathPlacement | null
>([
  [
    "change",
    (leaf) =>
      leaf.kind === "change"
        ? placementForTarget(
            leaf.target.value,
            leaf.relationPair,
            leaf.targetSide,
          )
        : null,
  ],
  [
    "confirmation",
    (leaf) =>
      leaf.kind === "confirmation"
        ? placementForTarget(
            leaf.target.value,
            leaf.detail.relationPair,
            leaf.targetSide,
          )
        : null,
  ],
  [
    "unsupported",
    (leaf) =>
      leaf.kind === "unsupported"
        ? placementForTarget(
            leaf.target.value,
            leaf.detail.relationPair,
            leaf.targetSide,
          )
        : null,
  ],
  [
    "limitation",
    (leaf) =>
      leaf.kind === "limitation" ? placementForLimitation(leaf) : null,
  ],
  [
    "schedule",
    (leaf) =>
      leaf.kind === "schedule" ? placementForSchedule(leaf.change) : null,
  ],
]);

export const placementForLeaf = (
  leaf: SemanticDiffExplorerLeaf,
): PathPlacement | null => {
  return leafPlacements.get(leaf.kind)?.(leaf) ?? null;
};
