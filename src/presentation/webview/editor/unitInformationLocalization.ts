import * as columnResources from "../../../resource/i18n/ajscolumn";
import * as messageResources from "../../../resource/i18n/message";
import * as parameterResources from "../../../resource/i18n/parameter";
import * as unitTypeResources from "../../../resource/i18n/ty";

const withEnglishFallback = <T extends Record<string, unknown>>(
  english: T,
  localized: Partial<T> | undefined,
): T => ({ ...english, ...localized });

export type UnitInformationMessageKey = keyof typeof messageResources.en;

export const unitInformationMessage = (
  key: string,
  language: string = "en",
): string => {
  const messages: Record<string, string> = withEnglishFallback(
    messageResources.en,
    { en: messageResources.en, ja: messageResources.ja }[language],
  );
  return messages[key] || key;
};

type UnitTypeDefinitions = typeof unitTypeResources.en;
type UnitTypeKey = keyof UnitTypeDefinitions;
type GroupTypeLabelKey = keyof UnitTypeDefinitions["g"]["gty"];

const unitTypeDefinitions = (language: string): UnitTypeDefinitions =>
  withEnglishFallback(
    unitTypeResources.en,
    { en: unitTypeResources.en, ja: unitTypeResources.ja }[language],
  );

const isUnitTypeKey = (
  unitType: string,
  definitions: UnitTypeDefinitions,
): unitType is UnitTypeKey =>
  Object.prototype.hasOwnProperty.call(definitions, unitType);

const groupTypeLabelKey = (
  groupType: string | undefined,
): GroupTypeLabelKey | undefined =>
  groupType === "n" || groupType === "p" ? groupType : undefined;

export const unitInformationUnitTypeLabel = (
  unitType: string,
  language: string = "en",
  groupType?: string,
): string => {
  const definitions = unitTypeDefinitions(language);
  if (!isUnitTypeKey(unitType, definitions)) {
    return unitType;
  }
  if (unitType !== "g") {
    return definitions[unitType].name;
  }
  const labelKey = groupTypeLabelKey(groupType);
  return labelKey === undefined
    ? definitions.g.name
    : definitions.g.gty[labelKey];
};

export const unitInformationParameterDefinitions = (
  language: string,
): typeof parameterResources.en =>
  withEnglishFallback(
    parameterResources.en,
    {
      en: parameterResources.en,
      ja: parameterResources.ja as Partial<typeof parameterResources.en>,
    }[language],
  );

type UnitInformationColumnLabelKey = keyof typeof columnResources.en;
type UnitInformationColumnGroupNumbers = [
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
export type UnitInformationColumnGroupNumber =
  UnitInformationColumnGroupNumbers[number];
export type UnitInformationColumnSubgroupLabels = {
  label: string;
  column: (column: number) => string;
};
export type UnitInformationColumnGroupLabels = {
  label: string;
  column: (column: number) => string;
  subgroup: (subgroup: number) => UnitInformationColumnSubgroupLabels;
};
export type UnitInformationColumnLabels = {
  group: (
    group: UnitInformationColumnGroupNumber,
  ) => UnitInformationColumnGroupLabels;
};

export const unitInformationTableColumnLabels = (
  language: string,
): UnitInformationColumnLabels => {
  const labels = withEnglishFallback(
    columnResources.en,
    { en: columnResources.en, ja: columnResources.ja }[language],
  );
  return {
    group: (group) => ({
      label: labels[`group${group}` as UnitInformationColumnLabelKey],
      column: (column) =>
        labels[`group${group}.col${column}` as UnitInformationColumnLabelKey],
      subgroup: (subgroup) => ({
        label:
          labels[
            `group${group}.group${subgroup}` as UnitInformationColumnLabelKey
          ],
        column: (column) =>
          labels[
            `group${group}.group${subgroup}.col${column}` as UnitInformationColumnLabelKey
          ],
      }),
    }),
  };
};
