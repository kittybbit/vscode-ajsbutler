import type {
  CommandBuilderValues,
  UnitDefinitionCommandBuilderChoiceDto,
  UnitDefinitionCommandBuilderDto,
  UnitDefinitionCommandBuilderFieldDto,
} from "./commandBuilderTypes";

type TextCommandBuilderFieldDto = Extract<
  UnitDefinitionCommandBuilderFieldDto,
  { kind: "text" }
>;
type CheckboxCommandBuilderFieldDto = Extract<
  UnitDefinitionCommandBuilderFieldDto,
  { kind: "checkbox" }
>;
type SelectCommandBuilderFieldDto = Extract<
  UnitDefinitionCommandBuilderFieldDto,
  { kind: "select" }
>;
type CommandTokenBuildContext = {
  builder: UnitDefinitionCommandBuilderDto;
  values: CommandBuilderValues;
};

const formatArgument = (argument: string): string =>
  /\s|"/.test(argument) ? `"${argument.replaceAll('"', '\\"')}"` : argument;

const fieldValue = (
  field: UnitDefinitionCommandBuilderFieldDto,
  values: CommandBuilderValues,
): string | boolean => values[field.id] ?? field.defaultValue;

const isTextField = (
  field: UnitDefinitionCommandBuilderFieldDto | undefined,
): field is TextCommandBuilderFieldDto => field?.kind === "text";

const findArgumentTextField = (
  argumentFieldId: string,
  builder: UnitDefinitionCommandBuilderDto,
): TextCommandBuilderFieldDto | undefined => {
  const field = builder.fields.find(({ id }) => id === argumentFieldId);
  return isTextField(field) ? field : undefined;
};

const trimmedTextFieldValue = (
  field: TextCommandBuilderFieldDto | undefined,
  values: CommandBuilderValues,
): string => {
  if (!field) return "";

  const value = fieldValue(field, values);
  return typeof value === "string" ? value.trim() : "";
};

const argumentValue = (
  argumentFieldId: string,
  builder: UnitDefinitionCommandBuilderDto,
  values: CommandBuilderValues,
): string =>
  trimmedTextFieldValue(
    findArgumentTextField(argumentFieldId, builder),
    values,
  );

const checkboxFieldTokens = (
  field: CheckboxCommandBuilderFieldDto,
  value: string | boolean,
): string[] => (value === true ? [field.option] : []);

const fieldOptionTokens = (option: string | undefined): string[] =>
  option ? [option] : [];

const isIndependentTextArgument = (
  field: TextCommandBuilderFieldDto,
  argument: string,
): boolean => field.usage === "independent" && Boolean(argument);

const independentTextFieldTokens = (
  field: TextCommandBuilderFieldDto,
  value: string | boolean,
): string[] => {
  const argument = typeof value === "string" ? value.trim() : "";
  if (!isIndependentTextArgument(field, argument)) return [];

  return [...fieldOptionTokens(field.option), formatArgument(argument)];
};

const selectChoiceArgumentTokens = (
  choice: UnitDefinitionCommandBuilderChoiceDto,
  builder: UnitDefinitionCommandBuilderDto,
  values: CommandBuilderValues,
): string[] => {
  if (!choice.argumentFieldId) return [];

  const argument = argumentValue(choice.argumentFieldId, builder, values);
  return argument ? [formatArgument(argument)] : [];
};

const selectFieldTokens = (
  field: SelectCommandBuilderFieldDto,
  value: string | boolean,
  context: CommandTokenBuildContext,
): string[] => {
  if (typeof value !== "string") return [];

  const choice = field.choices.find((candidate) => candidate.value === value);
  return choice
    ? [
        ...choice.tokens,
        ...selectChoiceArgumentTokens(choice, context.builder, context.values),
      ]
    : [];
};

const commandFieldTokens = (
  field: UnitDefinitionCommandBuilderFieldDto,
  context: CommandTokenBuildContext,
): string[] => {
  const value = fieldValue(field, context.values);

  switch (field.kind) {
    case "checkbox":
      return checkboxFieldTokens(field, value);
    case "text":
      return independentTextFieldTokens(field, value);
    case "select":
      return selectFieldTokens(field, value, context);
  }
};

export const buildCommandLine = (
  builder: UnitDefinitionCommandBuilderDto,
  values: CommandBuilderValues = {},
): string =>
  [
    builder.commandName,
    ...builder.fields.flatMap((field) =>
      commandFieldTokens(field, { builder, values }),
    ),
    formatArgument(builder.target.value),
  ].join(" ");
