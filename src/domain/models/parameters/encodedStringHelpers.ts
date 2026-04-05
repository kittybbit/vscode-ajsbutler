export const decodeEncodedString = (
  value: string | undefined,
): string | undefined =>
  value
    ?.replace(/^"(.*)"$/, "$1")
    .replace(/#"/g, '"')
    .replace(/##/g, "#");
