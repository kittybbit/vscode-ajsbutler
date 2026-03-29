import { paramDefinitionLang } from "../../domain/services/i18n/nls";
import { isParamSymbol } from "../../domain/values/AjsType";

export type ParameterHoverDto = {
  symbol: string;
  syntax: string;
};

export const findParameterHover = (
  word: string,
  language: string,
): ParameterHoverDto | undefined => {
  if (!isParamSymbol(word)) {
    return undefined;
  }

  const definition = paramDefinitionLang(language)[word];
  if (!definition) {
    return undefined;
  }

  return {
    symbol: word,
    syntax: definition.syntax,
  };
};
