import type {
  AjsDocument,
  AjsParameter,
  AjsRelation,
  AjsUnit,
} from "../../domain/models/ajs/AjsDocument";
import type {
  FlowGraphDocumentDto,
  FlowGraphUnitDto,
} from "./flowGraphDocument";

type OptionalUnitKey =
  | "permission"
  | "jp1Username"
  | "jp1ResourceGroup"
  | "groupType"
  | "comment"
  | "parentId"
  | "isRecovery";

const optionalUnitKeys: readonly OptionalUnitKey[] = [
  "permission",
  "jp1Username",
  "jp1ResourceGroup",
  "groupType",
  "comment",
  "parentId",
  "isRecovery",
];

const copyOptionalUnitProperty = (
  source: AjsUnit,
  target: FlowGraphUnitDto,
  key: OptionalUnitKey,
): void => {
  const value = source[key];
  if (value !== undefined) {
    (target as unknown as Record<string, unknown>)[key] = value;
  }
};

const copyParameter = (parameter: AjsParameter): AjsParameter => ({
  ...parameter,
});

const copyRelation = (relation: AjsRelation): AjsRelation => ({
  ...relation,
});

const toFlowGraphUnitWithoutChildren = (unit: AjsUnit): FlowGraphUnitDto => {
  const dto: FlowGraphUnitDto = {
    id: unit.id,
    name: unit.name,
    unitAttribute: unit.unitAttribute,
    unitType: unit.unitType,
    absolutePath: unit.absolutePath,
    depth: unit.depth,
    isRoot: unit.isRoot,
    isRootJobnet: unit.isRootJobnet,
    hasSchedule: unit.hasSchedule,
    hasWaitedFor: unit.hasWaitedFor,
    layout: { ...unit.layout },
    parameters: unit.parameters.map(copyParameter),
    relations: unit.relations.map(copyRelation),
    children: [],
  };
  optionalUnitKeys.forEach((key) => copyOptionalUnitProperty(unit, dto, key));
  return dto;
};

type PendingUnit = {
  source: AjsUnit;
  target: FlowGraphUnitDto;
};

const appendChildUnits = (
  pending: PendingUnit[],
  source: AjsUnit,
  target: FlowGraphUnitDto,
): void => {
  target.children = source.children.map(toFlowGraphUnitWithoutChildren);
  source.children
    .map((child, index) => ({
      source: child,
      target: target.children[index],
    }))
    .reverse()
    .forEach((child) => pending.push(child));
};

export const toFlowGraphUnitDto = (rootUnit: AjsUnit): FlowGraphUnitDto => {
  const rootDto = toFlowGraphUnitWithoutChildren(rootUnit);
  const pending: PendingUnit[] = [{ source: rootUnit, target: rootDto }];
  while (pending.length > 0) {
    const current = pending.pop() as PendingUnit;
    appendChildUnits(pending, current.source, current.target);
  }
  return rootDto;
};

export const toFlowGraphDocumentDto = (
  document: AjsDocument,
): FlowGraphDocumentDto => ({
  rootUnits: document.rootUnits.map(toFlowGraphUnitDto),
});
