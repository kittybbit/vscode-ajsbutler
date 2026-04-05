import { AjsRelationType } from "../ajs/AjsDocument";

export type ParsedUnitEdge = {
  sourceName: string;
  targetName: string;
  relationType?: string;
};

export const parseUnitEdge = (
  value: string | undefined,
  options?: { requireRelationType?: boolean },
): ParsedUnitEdge | undefined => {
  if (!value) {
    return undefined;
  }

  const sourceName = value.match(/f=([^,)\s]+)/)?.[1];
  const targetName = value.match(/t=([^,)\s]+)/)?.[1];
  if (!sourceName || !targetName) {
    return undefined;
  }

  const parts = value.split(",").map((part) => part.trim());
  const relationType =
    parts.length > 2 ? parts.at(-1)?.replace(/\)$/, "") : undefined;
  if (options?.requireRelationType && !relationType) {
    return undefined;
  }

  return {
    sourceName,
    targetName,
    relationType,
  };
};

export const normalizeAjsRelationType = (
  relationType: string | undefined,
): AjsRelationType => (relationType === "con" ? "con" : "seq");
