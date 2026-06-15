// internationalization
import * as message from "@resource/i18n/message";
import * as ty from "@resource/i18n/ty";
import * as parameter from "@resource/i18n/parameter";
import * as ajscolumn from "@resource/i18n/ajscolumn";
import { isTySymbol } from "../../values/AjsType";

/** Literal type */
export type LocaleKeyType = keyof typeof message.en;
type LocaleEntry = {
  [lang: string]: string;
};
const withLocaleFallback = <T extends Record<string, unknown>>(
  fallback: T,
  localized: Partial<T> | undefined,
): T => ({
  ...fallback,
  ...localized,
});

const localeTable = (language: string): LocaleEntry => {
  return withLocaleFallback(
    message.en,
    { en: message.en, ja: message.ja }[language],
  );
};

/** Return message or key string if key is not present. */
export const localeString = (key: string, language: string = "en"): string =>
  localeTable(language)[key] || key;
/** Return message. */
export const localeMap = (
  key: LocaleKeyType,
  language: string = "en",
): string => localeString(key, language);

// ty name
export const tyDefinitionLang = (language: string): typeof ty.en => {
  return withLocaleFallback(ty.en, { en: ty.en, ja: ty.ja }[language]);
};

export const unitTypeLabel = (
  unitType: string,
  language: string = "en",
  groupType?: string,
): string => {
  if (!isTySymbol(unitType)) {
    return unitType;
  }

  const definitions = tyDefinitionLang(language);
  if (unitType === "g" && (groupType === "n" || groupType === "p")) {
    return definitions.g.gty[groupType];
  }

  return definitions[unitType].name;
};

// parameter
export const paramDefinitionLang = (language: string): typeof parameter.en => {
  return withLocaleFallback(
    parameter.en,
    {
      en: parameter.en,
      ja: parameter.ja as Partial<typeof parameter.en>,
    }[language],
  );
};

// column titles
export const ajsTableColumnHeaderLang = (
  language: string,
): typeof ajscolumn.en => {
  return withLocaleFallback(
    ajscolumn.en,
    {
      en: ajscolumn.en,
      ja: ajscolumn.ja,
    }[language],
  );
};

type AjsTableColumnLabelKey = keyof typeof ajscolumn.en;
type AjsTableColumnGroupNumbers = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
];
export type AjsTableColumnGroupNumber = AjsTableColumnGroupNumbers[number];
export type AjsTableColumnSubgroupLabels = {
  label: string;
  column: (column: number) => string;
};
export type AjsTableColumnGroupLabels = {
  label: string;
  column: (column: number) => string;
  subgroup: (subgroup: number) => AjsTableColumnSubgroupLabels;
};
export type AjsTableColumnLabelAccessor = {
  group: (group: AjsTableColumnGroupNumber) => AjsTableColumnGroupLabels;
};

export const ajsTableColumnLabels = (
  language: string,
): AjsTableColumnLabelAccessor => {
  const labels = ajsTableColumnHeaderLang(language);

  return {
    group: (group) => ({
      label: labels[`group${group}` as AjsTableColumnLabelKey],
      column: (column) =>
        labels[`group${group}.col${column}` as AjsTableColumnLabelKey],
      subgroup: (subgroup) => ({
        label:
          labels[`group${group}.group${subgroup}` as AjsTableColumnLabelKey],
        column: (column) =>
          labels[
            `group${group}.group${subgroup}.col${column}` as AjsTableColumnLabelKey
          ],
      }),
    }),
  };
};
