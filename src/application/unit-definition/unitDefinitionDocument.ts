import type {
  UnitDefinitionCommandBuilderChoiceDto,
  UnitDefinitionCommandBuilderDto,
  UnitDefinitionCommandBuilderFieldDto,
  UnitDefinitionCommandDto,
} from "./buildAjsCommands";
import type { UnitDefinitionDialogDto } from "./buildUnitDefinition";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

const hasLocalizedText = (value: Record<string, unknown>): boolean =>
  typeof value.labelKey === "string";

const isCommand = (value: unknown): value is UnitDefinitionCommandDto =>
  isRecord(value) &&
  typeof value.id === "string" &&
  typeof value.label === "string" &&
  typeof value.value === "string";

const isChoice = (
  value: unknown,
): value is UnitDefinitionCommandBuilderChoiceDto =>
  isRecord(value) &&
  hasLocalizedText(value) &&
  typeof value.value === "string" &&
  isStringArray(value.tokens) &&
  (value.argumentFieldId === undefined ||
    typeof value.argumentFieldId === "string");

const hasFieldBase = (value: Record<string, unknown>): boolean =>
  hasLocalizedText(value) &&
  typeof value.id === "string" &&
  typeof value.descriptionKey === "string";

const isCommandBuilderField = (
  value: unknown,
): value is UnitDefinitionCommandBuilderFieldDto => {
  if (!isRecord(value) || !hasFieldBase(value)) {
    return false;
  }
  if (value.kind === "checkbox") {
    return (
      typeof value.option === "string" &&
      typeof value.defaultValue === "boolean"
    );
  }
  if (value.kind === "select") {
    return (
      typeof value.defaultValue === "string" &&
      Array.isArray(value.choices) &&
      value.choices.every(isChoice)
    );
  }
  return (
    value.kind === "text" &&
    (value.option === undefined || typeof value.option === "string") &&
    typeof value.defaultValue === "string" &&
    typeof value.placeholder === "string" &&
    (value.usage === "independent" || value.usage === "argument")
  );
};

const isCommandBuilder = (
  value: unknown,
): value is UnitDefinitionCommandBuilderDto => {
  if (!isRecord(value) || !hasLocalizedText(value)) {
    return false;
  }
  const manualUrl = value.manualUrl;
  const target = value.target;
  return (
    typeof value.id === "string" &&
    typeof value.commandName === "string" &&
    typeof value.descriptionKey === "string" &&
    isRecord(manualUrl) &&
    hasLocalizedText(manualUrl) &&
    isRecord(manualUrl.urlByLang) &&
    typeof manualUrl.urlByLang.en === "string" &&
    typeof manualUrl.urlByLang.ja === "string" &&
    isRecord(target) &&
    hasLocalizedText(target) &&
    typeof target.value === "string" &&
    Array.isArray(value.fields) &&
    value.fields.every(isCommandBuilderField)
  );
};

const isUnitDefinition = (value: unknown): value is UnitDefinitionDialogDto =>
  isRecord(value) &&
  typeof value.absolutePath === "string" &&
  typeof value.rawData === "string" &&
  Array.isArray(value.commands) &&
  value.commands.every(isCommand) &&
  Array.isArray(value.commandBuilders) &&
  value.commandBuilders.every(isCommandBuilder);

export const indexUnitDefinitionsByPath = (
  definitions: readonly UnitDefinitionDialogDto[],
): ReadonlyMap<string, UnitDefinitionDialogDto> =>
  new Map(
    definitions.map((definition) => [definition.absolutePath, definition]),
  );

export const toUnitDefinitionByPath = (
  document: unknown,
): ReadonlyMap<string, UnitDefinitionDialogDto> => {
  if (!isRecord(document) || !Array.isArray(document.unitDefinitions)) {
    return new Map();
  }
  return indexUnitDefinitionsByPath(
    document.unitDefinitions.filter(isUnitDefinition),
  );
};
