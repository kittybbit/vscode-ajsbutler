import { G } from "../../domain/models/units/G";
import { N } from "../../domain/models/units/N";
import { UnitEntity } from "../../domain/models/units/UnitEntities";
import {
  buildFlowGraphFromInput,
  FlowGraphDto,
  FlowGraphEdgeDto,
  FlowGraphInput,
  FlowGraphInputNode,
} from "./buildFlowGraphCore";

const toInputNode = (unitEntity: UnitEntity): FlowGraphInputNode => ({
  id: unitEntity.id,
  label: unitEntity.name,
  absolutePath: unitEntity.absolutePath,
  ty: unitEntity.ty.value(),
  gty:
    unitEntity.ty.value() === "g"
      ? ((unitEntity as G).gty?.value() as "n" | "p" | undefined)
      : undefined,
  comment: unitEntity.cm?.value(),
  depth: unitEntity.depth,
  h: unitEntity.hv.h,
  v: unitEntity.hv.v,
  isRootJobnet:
    unitEntity.ty.value() === "n" ? (unitEntity as N).isRootJobnet : false,
  hasSchedule:
    unitEntity.ty.value() === "n" ? (unitEntity as N).hasSchedule : false,
  hasWaitedFor:
    "hasWaitedFor" in unitEntity && (unitEntity.hasWaitedFor as boolean),
});

const toEdgeDtos = (unitEntity: UnitEntity): FlowGraphEdgeDto[] =>
  unitEntity.children
    .filter((child) => child.nextUnits.length > 0)
    .flatMap((source) =>
      source.nextUnits
        .filter((target) => target.unitEntity !== undefined)
        .map((target) => ({
          source: source.id,
          target: target.unitEntity!.id,
          type: target.relationType === "con" ? "con" : "seq",
        })),
    );

const toInput = (unitEntity: UnitEntity): FlowGraphInput => {
  const conditionUnit = unitEntity.children.find(
    (child) => child.ty.value() === "rc",
  );
  return {
    currentNode: toInputNode(unitEntity),
    ancestorNodes: unitEntity.ancestors.map(toInputNode),
    childNodes: unitEntity.children
      .filter((child) => child.ty.value() !== "rc")
      .map(toInputNode),
    conditionNode: conditionUnit ? toInputNode(conditionUnit) : undefined,
    edges: toEdgeDtos(unitEntity),
  };
};

export const buildFlowGraph = (unitEntity: UnitEntity): FlowGraphDto =>
  buildFlowGraphFromInput(toInput(unitEntity));
