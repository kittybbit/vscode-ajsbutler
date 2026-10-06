import type {
  FlowGraphParameterDto,
  FlowGraphRelationDto,
} from "../../application/flow-graph/flowGraphDocument";
import type {
  AjsNormalizationWarning,
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
