import {
  AjsDocument,
  AjsUnit,
  flattenAjsUnits,
} from "../../domain/models/ajs/AjsDocument";
import {
  buildAjsCommands,
  buildAjsCommandBuilders,
  UnitDefinitionCommandBuilderDto,
  UnitDefinitionCommandDto,
} from "./buildAjsCommands";

export type {
  UnitDefinitionCommandBuilderDto,
  UnitDefinitionCommandDto,
} from "./buildAjsCommands";

export type UnitDefinitionDialogDto = {
  absolutePath: string;
  rawData: string;
  commands: UnitDefinitionCommandDto[];
  commandBuilders: UnitDefinitionCommandBuilderDto[];
};

export const buildUnitDefinition = (
  unit: AjsUnit,
): UnitDefinitionDialogDto => ({
  absolutePath: unit.absolutePath,
  rawData: unit.parameters
    .map((parameter) => `${parameter.key}=${parameter.value}`)
    .join("\n"),
  commands: buildAjsCommands(unit),
  commandBuilders: buildAjsCommandBuilders(unit),
});

export const buildUnitDefinitions = (
  document: AjsDocument,
): UnitDefinitionDialogDto[] =>
  flattenAjsUnits(document.rootUnits).map(buildUnitDefinition);

export const buildUnitDefinitionByPath = (
  document: AjsDocument,
): ReadonlyMap<string, UnitDefinitionDialogDto> =>
  new Map(
    buildUnitDefinitions(document).map((definition) => [
      definition.absolutePath,
      definition,
    ]),
  );
