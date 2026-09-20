export const formatLocalizedDateRange = (
  from: string,
  to: string,
  language?: string,
): string =>
  (language ?? "").toLowerCase().startsWith("ja")
    ? `${from}〜${to}`
    : `${from} – ${to}`;

export default formatLocalizedDateRange;
