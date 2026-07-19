export const hasWildcard = (value: string): boolean => value.includes("*");

export const isExplicitMacroVariable = (value: string): boolean =>
  /^\?[^?\r\n]+\?$/.test(value);

const HASH_ESCAPED_CONTENT_PATTERN = /^(?:[^"#]|#["#])*#?$/;
const HASH_ESCAPED_CONTENT_ESCAPE_PATTERN = /#(["#])/g;
const HASH_ESCAPED_TRAILING_QUOTE_PATTERN = /#$/;

const parseHashEscapedContent = (value: string): string | undefined => {
  const content = value.slice(1, -1);
  return HASH_ESCAPED_CONTENT_PATTERN.test(content)
    ? content
        .replace(HASH_ESCAPED_CONTENT_ESCAPE_PATTERN, "$1")
        .replace(HASH_ESCAPED_TRAILING_QUOTE_PATTERN, '"')
    : undefined;
};

export const parseHashEscapedQuotedStringLiteralContent = (
  value: string,
): string | undefined =>
  value.startsWith('"') && value.endsWith('"')
    ? parseHashEscapedContent(value)
    : undefined;

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
