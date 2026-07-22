export type ParameterSyntaxLookupPort = {
  findSyntax: (symbol: string, language: string) => string | undefined;
};
