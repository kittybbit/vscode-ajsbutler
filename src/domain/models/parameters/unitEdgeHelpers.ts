import { AjsRelationType } from "../ajs/AjsDocument";

export type ParsedUnitEdge = {
  sourceName: string;
  targetName: string;
  relationType?: string;
};

type UnitEdgeParseOptions = {
  requireRelationType?: boolean;
};

const UNIT_EDGE_NAMES_PATTERN = /(?=.*f=([^,)\s]+))(?=.*t=([^,)\s]+))/;

const extractUnitEdgeNames = (
  value: string,
): Pick<ParsedUnitEdge, "sourceName" | "targetName"> | undefined => {
  const matched = UNIT_EDGE_NAMES_PATTERN.exec(value);
  return matched
    ? { sourceName: matched[1], targetName: matched[2] }
    : undefined;
};

const extractRelationType = (value: string): string | undefined => {
  const parts = value.split(",").map((part) => part.trim());
  return parts.length > 2 ? parts.at(-1)?.replace(/\)$/, "") : undefined;
};

const hasRequiredRelationType = (
  relationType: string | undefined,
  options: UnitEdgeParseOptions | undefined,
): boolean =>
  options?.requireRelationType !== true || relationType !== undefined;

const parseDefinedUnitEdge = (
  value: string,
  options: UnitEdgeParseOptions | undefined,
): ParsedUnitEdge | undefined => {
  const names = extractUnitEdgeNames(value);
  const relationType = extractRelationType(value);
  return names && hasRequiredRelationType(relationType, options)
    ? { ...names, relationType }
    : undefined;
};

export const parseUnitEdge = (
  value: string | undefined,
  options?: UnitEdgeParseOptions,
): ParsedUnitEdge | undefined =>
  value ? parseDefinedUnitEdge(value, options) : undefined;

export const normalizeAjsRelationType = (
  relationType: string | undefined,
): AjsRelationType => (relationType === "con" ? "con" : "seq");
