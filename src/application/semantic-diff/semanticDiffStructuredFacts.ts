import type {
  SemanticDiffComparisonPeriod,
  SemanticDiffDetail,
  SemanticDiffRelationPair,
  SemanticDiffWarning,
} from "./semanticDiffDto";

export type SemanticDiffDetailOverrides = {
  unitPath?: string | null;
  parameterKey?: string | null;
  relationPair?: SemanticDiffRelationPair | null;
  scheduleRule?: number | null;
  period?: SemanticDiffComparisonPeriod | null;
  beforeValues?: string[];
  afterValues?: string[];
  rawValues?: string[];
  removedSources?: string[];
};

/** Build the fixed, exhaustive detail object used by all neutral records. */
export const createSemanticDiffDetail = (
  overrides: SemanticDiffDetailOverrides = {},
): SemanticDiffDetail => ({
  unitPath: overrides.unitPath ?? null,
  parameterKey: overrides.parameterKey ?? null,
  relationPair: overrides.relationPair ?? null,
  scheduleRule: overrides.scheduleRule ?? null,
  period: overrides.period ?? null,
  beforeValues: [...(overrides.beforeValues ?? [])],
  afterValues: [...(overrides.afterValues ?? [])],
  rawValues: [...(overrides.rawValues ?? [])],
  removedSources: [...(overrides.removedSources ?? [])],
});

export const createSemanticDiffWarning = ({
  code,
  detail,
  fallbackText,
}: {
  code: string;
  detail: SemanticDiffDetail;
  fallbackText?: string | null;
}): SemanticDiffWarning => ({
  code,
  detail,
  fallbackText: fallbackText ?? null,
});
