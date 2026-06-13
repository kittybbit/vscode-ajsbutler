import { AjsUnit } from "../../domain/models/ajs/AjsDocument";
import { buildAjsCommandBuilders } from "./buildAjsCommandBuilders";
import { buildCommandLine } from "./buildCommandLine";
import type { UnitDefinitionCommandDto } from "./commandBuilderTypes";

export { buildAjsCommandBuilders } from "./buildAjsCommandBuilders";
export { buildCommandLine } from "./buildCommandLine";
export type {
  CommandBuilderValues,
  LocalizedTextDto,
  UnitDefinitionCommandBuilderChoiceDto,
  UnitDefinitionCommandBuilderDto,
  UnitDefinitionCommandBuilderFieldDto,
  UnitDefinitionCommandDto,
} from "./commandBuilderTypes";

export const buildAjsCommands = (unit: AjsUnit): UnitDefinitionCommandDto[] =>
  buildAjsCommandBuilders(unit).map((builder) => ({
    id: builder.id,
    label: builder.commandName,
    value: buildCommandLine(builder),
  }));
