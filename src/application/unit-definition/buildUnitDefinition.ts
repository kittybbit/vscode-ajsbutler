import { AjsUnit } from "../../domain/models/ajs/AjsDocument";

export type UnitDefinitionCommandDto = {
  id: string;
  label: string;
  value: string;
};

export type UnitDefinitionDialogDto = {
  absolutePath: string;
  rawData: string;
  commands: UnitDefinitionCommandDto[];
};

export const buildUnitDefinition = (
  unit: AjsUnit,
): UnitDefinitionDialogDto => ({
  absolutePath: unit.absolutePath,
  rawData: unit.parameters
    .map((parameter) => `${parameter.key}=${parameter.value}`)
    .join("\n"),
  commands: [
    {
      id: "ajsshow",
      label: "ajsshow",
      value: `ajsshow -R ${unit.absolutePath}`,
    },
    {
      id: "ajsprint",
      label: "ajsprint",
      value: `ajsprint -a -R ${unit.absolutePath}`,
    },
  ],
});
