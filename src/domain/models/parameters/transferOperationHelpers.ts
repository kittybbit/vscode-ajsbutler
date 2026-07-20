type TopParameterIndex = 1 | 2 | 3 | 4;

type TopParameterSource = {
  [key in `ts${TopParameterIndex}`]?: unknown;
} & {
  [key in `td${TopParameterIndex}`]?: unknown;
};

type PresenceIndex = 0 | 1;

const TOP_DEFAULT_RAW_VALUE_BY_PRESENCE = [
  [undefined, undefined],
  ["del", "sav"],
] as const;

const toPresenceIndex = (value: unknown): PresenceIndex =>
  Number(Boolean(value)) as PresenceIndex;

export const resolveTopDefaultRawValue = (
  unit: TopParameterSource,
  index: TopParameterIndex,
): string | undefined =>
  TOP_DEFAULT_RAW_VALUE_BY_PRESENCE[toPresenceIndex(unit[`ts${index}`])][
    toPresenceIndex(unit[`td${index}`])
  ];
