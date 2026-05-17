export const hasWildcard = (value: string): boolean => value.includes("*");

export const isExplicitMacroVariable = (value: string): boolean =>
  /^\?[^?\r\n]+\?$/.test(value);

export const parseHashEscapedQuotedStringLiteralContent = (
  value: string,
): string | undefined => {
  if (!value.startsWith('"') || !value.endsWith('"')) {
    return undefined;
  }

  let content = "";
  for (let index = 1; index < value.length - 1; index += 1) {
    const character = value[index];

    if (character === "#") {
      const escapedCharacter = value[index + 1];
      if (escapedCharacter !== '"' && escapedCharacter !== "#") {
        return undefined;
      }

      content += escapedCharacter;
      index += 1;
      continue;
    }

    if (character === '"') {
      return undefined;
    }

    content += character;
  }

  return content;
};

export const parseQuotedStringLiteralContent = (
  value: string,
): string | undefined => {
  const matched = /^"((?:\\.|[^"\\])*)"$/.exec(value);
  return matched?.[1];
};
