export const hasWildcard = (value: string): boolean => value.includes("*");

export const isExplicitMacroVariable = (value: string): boolean =>
  /^\?[^?\r\n]+\?$/.test(value);

export const parseQuotedStringLiteralContent = (
  value: string,
): string | undefined => {
  const matched = /^"((?:\\.|[^"\\])*)"$/.exec(value);
  return matched?.[1];
};

export const selectQuotedContentOrRawValue = (value: string): string =>
  value.length >= 2 && value.startsWith('"') && value.endsWith('"')
    ? value.slice(1, -1)
    : value;
