import {
  flattenAjsUnits,
  findAjsUnitAncestors,
  findAjsUnitParameters,
} from "../../domain/models/ajs/AjsDocument";
import type {
  FlowGraphParameterDto,
  FlowGraphRelationDto,
} from "../../application/flow-graph/flowGraphDocument";
import type {
  AjsNormalizationWarning,
  AjsDocument,
  AjsParameter,
  AjsRelation,
  AjsUnit,
  AjsUnitLayout,
} from "../../domain/models/ajs/AjsDocument";

const parameterProducer: AjsParameter = {
  key: "job-name",
  value: "nightly",
  position: 0,
  line: 1,
  column: 1,
  length: 7,
};

const relationProducer: AjsRelation = {
  sourceUnitId: "source",
  targetUnitId: "target",
  type: "seq",
};

const warningProducer: AjsNormalizationWarning = {
  code: "missing-parent",
  message: "Parent unit was not found.",
  unitPath: "/nightly/job",
};

const layoutProducer: AjsUnitLayout = { h: 0, v: 1 };

export const compileReadonlyLeafProducerContracts = () => {
  const parameterCopy: AjsParameter = { ...parameterProducer };
  const relationCopy: AjsRelation = { ...relationProducer };
  const warningCopy: AjsNormalizationWarning = { ...warningProducer };
  const layoutCopy: AjsUnitLayout = { ...layoutProducer };
  const parameters: AjsParameter[] = [parameterCopy];
  const mappedParameters: AjsParameter[] = parameters.map((parameter) => ({
    ...parameter,
  }));
  const warningBuffer: AjsNormalizationWarning[] = [];
  warningBuffer.push(warningCopy);
  const parameterValue: string = parameterCopy.value;
  const relationType: AjsRelation["type"] = relationCopy.type;
  const warningPath: string | undefined = warningCopy.unitPath;
  const horizontalLayout: number = layoutCopy.h;

  return {
    mappedParameters,
    relationCopy,
    warningBuffer,
    layoutCopy,
    parameterValue,
    relationType,
    warningPath,
    horizontalLayout,
  };
};

type ReadonlyLeafAssignmentInputs = {
  parameter: AjsParameter;
  relation: AjsRelation;
  warning: AjsNormalizationWarning;
  layout: AjsUnitLayout;
  unit: AjsUnit;
  flowParameter: FlowGraphParameterDto;
  flowRelation: FlowGraphRelationDto;
};

export const compileReadonlyLeafAssignmentErrors = ({
  parameter,
  relation,
  warning,
  layout,
  unit,
  flowParameter,
  flowRelation,
}: ReadonlyLeafAssignmentInputs): void => {
  // @ts-expect-error normalized parameter evidence is readonly
  parameter.key = "renamed";
  // @ts-expect-error normalized parameter evidence is readonly
  parameter.value = "changed";
  // @ts-expect-error optional normalized parameter positions are readonly
  parameter.position = 2;
  // @ts-expect-error optional normalized parameter positions are readonly
  parameter.line = 2;
  // @ts-expect-error optional normalized parameter positions are readonly
  parameter.column = 2;
  // @ts-expect-error optional normalized parameter positions are readonly
  parameter.length = 2;

  // @ts-expect-error normalized relation evidence is readonly
  relation.sourceUnitId = "other-source";
  // @ts-expect-error normalized relation evidence is readonly
  relation.targetUnitId = "other-target";
  // @ts-expect-error normalized relation evidence is readonly
  relation.type = "con";

  // @ts-expect-error normalization warning values are readonly
  warning.code = "changed-code";
  // @ts-expect-error normalization warning values are readonly
  warning.message = "changed message";
  // @ts-expect-error optional normalization warning paths are readonly
  warning.unitPath = "/other/path";

  // @ts-expect-error normalized layout values are readonly
  layout.h = 3;
  // @ts-expect-error normalized layout values are readonly
  layout.v = 4;

  // @ts-expect-error nested normalized parameter evidence is readonly
  unit.parameters[0].key = "nested-change";
  // @ts-expect-error nested normalized layout values are readonly
  unit.layout.h = 5;

  // Flow DTO leaf aliases retain the normalized readonly field contract.
  // @ts-expect-error aliased Flow parameter evidence is readonly
  flowParameter.value = "flow-change";
  // @ts-expect-error aliased Flow relation evidence is readonly
  flowRelation.type = "seq";
};

type ReadonlyDocumentAssignmentInputs = {
  document: AjsDocument;
  unit: AjsUnit;
  parameter: AjsParameter;
  relation: AjsRelation;
  warning: AjsNormalizationWarning;
};

export const compileReadonlyDocumentProducerContracts = ({
  document,
  unit,
  parameter,
  relation,
  warning,
}: ReadonlyDocumentAssignmentInputs) => {
  // Readonly model collections remain valid inputs to existing helpers.
  const flattened = flattenAjsUnits(document.rootUnits);
  const matchingParameters = findAjsUnitParameters(unit, parameter.key);
  const ancestors = findAjsUnitAncestors(document, unit);

  // These helpers return fresh, caller-owned arrays and retain their mutable
  // collection contract even though their model elements are readonly.
  flattened.push(unit);
  matchingParameters.push(parameter);
  ancestors.push(unit);

  return { flattened, matchingParameters, ancestors, relation, warning };
};

export const compileReadonlyDocumentAssignmentErrors = ({
  document,
  unit,
  parameter,
  relation,
  warning,
}: ReadonlyDocumentAssignmentInputs): void => {
  // @ts-expect-error normalized unit identity is readonly
  unit.id = "changed-id";
  // @ts-expect-error normalized unit name is readonly
  unit.name = "changed-name";
  // @ts-expect-error normalized unit attributes are readonly
  unit.unitAttribute = "changed-attributes";
  // @ts-expect-error optional permission is readonly
  unit.permission = "other";
  // @ts-expect-error optional JP1 username is readonly
  unit.jp1Username = "other";
  // @ts-expect-error optional JP1 resource group is readonly
  unit.jp1ResourceGroup = "other";
  // @ts-expect-error normalized unit type is readonly
  unit.unitType = "j";
  // @ts-expect-error optional group type is readonly
  unit.groupType = "p";
  // @ts-expect-error optional comment is readonly
  unit.comment = "changed-comment";
  // @ts-expect-error normalized absolute path is readonly
  unit.absolutePath = "/other";
  // @ts-expect-error normalized depth is readonly
  unit.depth = 2;
  // @ts-expect-error optional parent identity is readonly
  unit.parentId = "other-parent";
  // @ts-expect-error normalized root flag is readonly
  unit.isRoot = false;
  // @ts-expect-error optional recovery flag is readonly
  unit.isRecovery = true;
  // @ts-expect-error normalized root-jobnet flag is readonly
  unit.isRootJobnet = true;
  // @ts-expect-error normalized schedule flag is readonly
  unit.hasSchedule = true;
  // @ts-expect-error normalized waited-for flag is readonly
  unit.hasWaitedFor = true;
  // @ts-expect-error nested layout fields are readonly
  unit.layout = { h: 1, v: 2 };
  // @ts-expect-error nested parameter collection is readonly
  unit.parameters = [];
  // @ts-expect-error nested relation collection is readonly
  unit.relations = [];
  // @ts-expect-error nested child collection is readonly
  unit.children = [];

  // @ts-expect-error normalized document root collection is readonly
  document.rootUnits = [];
  // @ts-expect-error normalized warning collection is readonly
  document.warnings = [];

  // @ts-expect-error root collection cannot replace an element
  document.rootUnits[0] = unit;
  // @ts-expect-error root collection cannot append
  document.rootUnits.push(unit);
  // @ts-expect-error warning collection cannot append
  document.warnings.push(warning);
  // @ts-expect-error child collection cannot replace an element
  unit.children[0] = unit;
  // @ts-expect-error child collection cannot append
  unit.children.push(unit);
  // @ts-expect-error parameter collection cannot append
  unit.parameters.push(parameter);
  // @ts-expect-error relation collection cannot append
  unit.relations.push(relation);
  // @ts-expect-error nested parameter evidence remains readonly
  unit.parameters[0].value = "changed-value";
  // @ts-expect-error nested relation evidence remains readonly
  unit.relations[0].type = "con";
  // @ts-expect-error nested child unit identity remains readonly
  unit.children[0].id = "changed-child";
};
