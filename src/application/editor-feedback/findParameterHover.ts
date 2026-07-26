import { isParamSymbol } from "../../domain/values/AjsType";
import type { ParameterSyntaxLookupPort } from "./ParameterSyntaxLookupPort";

export type ParameterHoverDto = {
  symbol: string;
  syntax: string;
};

export type FindParameterHover = (
  word: string,
  language: string,
) => ParameterHoverDto | undefined;

export const createFindParameterHover =
  (parameterSyntaxLookup: ParameterSyntaxLookupPort): FindParameterHover =>
  (word, language) => {
    if (!isParamSymbol(word)) {
      return undefined;
    }

    const syntax = parameterSyntaxLookup.findSyntax(word, language);
    if (!syntax) {
      return undefined;
    }

    return {
      symbol: word,
      syntax,
    };
  };
