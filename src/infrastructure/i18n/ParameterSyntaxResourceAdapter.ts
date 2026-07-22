import type { ParameterSyntaxLookupPort } from "../../application/editor-feedback/ParameterSyntaxLookupPort";
import * as parameter from "@resource/i18n/parameter";

type ParameterSymbol = keyof typeof parameter.en;
type ParameterDefinition = (typeof parameter.en)[ParameterSymbol];
type LocalizedParameterDefinitions = Partial<
  Record<ParameterSymbol, ParameterDefinition>
>;

const localizedDefinitions = (
  language: string,
): LocalizedParameterDefinitions | undefined =>
  ({
    en: parameter.en,
    ja: parameter.ja,
  })[language];

const isParameterSymbol = (symbol: string): symbol is ParameterSymbol =>
  Object.hasOwn(parameter.en, symbol);

export class ParameterSyntaxResourceAdapter
  implements ParameterSyntaxLookupPort
{
  findSyntax(symbol: string, language: string): string | undefined {
    if (!isParameterSymbol(symbol)) {
      return undefined;
    }

    return (
      localizedDefinitions(language)?.[symbol]?.syntax ??
      parameter.en[symbol].syntax
    );
  }
}
