import type {
  AjsDocument,
  AjsGroupType,
  AjsParameter,
  AjsRelation,
  AjsUnit,
  AjsUnitType,
} from "../../domain/models/ajs/AjsDocument";
import { isTySymbol } from "../../domain/values/AjsType";

export type FlowGraphParameterDto = AjsParameter;
export type FlowGraphRelationDto = AjsRelation;

export type FlowGraphUnitDto = {
  id: string;
  name: string;
  unitAttribute: string;
  permission?: string;
  jp1Username?: string;
  jp1ResourceGroup?: string;
  unitType: AjsUnitType;
  groupType?: AjsGroupType;
  comment?: string;
  absolutePath: string;
  depth: number;
  parentId?: string;
  isRoot: boolean;
  isRecovery?: boolean;
  isRootJobnet: boolean;
  hasSchedule: boolean;
  hasWaitedFor: boolean;
  layout: { h: number; v: number };
  parameters: FlowGraphParameterDto[];
  relations: FlowGraphRelationDto[];
  children: FlowGraphUnitDto[];
};

export type FlowGraphDocumentDto = { rootUnits: FlowGraphUnitDto[] };

export type FlowGraphDocumentIssueCode =
  | "invalid_document"
  | "invalid_unit"
  | "invalid_layout"
  | "duplicate_unit_id"
  | "duplicate_absolute_path"
  | "inconsistent_parent"
  | "parent_cycle"
  | "invalid_relation";

export type FlowGraphDocumentIssue = {
  code: FlowGraphDocumentIssueCode;
  message: string;
  unitPath?: string;
};

export type FlowGraphDocumentIndex = {
  unitById: ReadonlyMap<string, FlowGraphUnitDto>;
  unitByAbsolutePath: ReadonlyMap<string, FlowGraphUnitDto>;
};

export type FlowGraphDocumentValidationResult =
  | {
      status: "available";
      document: FlowGraphDocumentDto;
      index: FlowGraphDocumentIndex;
      issues: FlowGraphDocumentIssue[];
    }
  | { status: "unavailable"; issues: FlowGraphDocumentIssue[] };

export type ValidatedFlowGraphDocument = Extract<
  FlowGraphDocumentValidationResult,
  { status: "available" }
>;

const copyParameter = (parameter: AjsParameter): FlowGraphParameterDto => ({
  ...parameter,
});

const copyRelation = (relation: AjsRelation): FlowGraphRelationDto => ({
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
  if (unit.permission !== undefined) dto.permission = unit.permission;
  if (unit.jp1Username !== undefined) dto.jp1Username = unit.jp1Username;
  if (unit.jp1ResourceGroup !== undefined) {
    dto.jp1ResourceGroup = unit.jp1ResourceGroup;
  }
  if (unit.groupType !== undefined) dto.groupType = unit.groupType;
  if (unit.comment !== undefined) dto.comment = unit.comment;
  if (unit.parentId !== undefined) dto.parentId = unit.parentId;
  if (unit.isRecovery !== undefined) dto.isRecovery = unit.isRecovery;
  return dto;
};

export const toFlowGraphUnitDto = (rootUnit: AjsUnit): FlowGraphUnitDto => {
  const rootDto = toFlowGraphUnitWithoutChildren(rootUnit);
  const pending: Array<{ source: AjsUnit; target: FlowGraphUnitDto }> = [
    { source: rootUnit, target: rootDto },
  ];
  while (pending.length > 0) {
    const current = pending.pop() as {
      source: AjsUnit;
      target: FlowGraphUnitDto;
    };
    current.target.children = current.source.children.map(
      toFlowGraphUnitWithoutChildren,
    );
    for (let index = current.source.children.length - 1; index >= 0; index--) {
      pending.push({
        source: current.source.children[index],
        target: current.target.children[index],
      });
    }
  }
  return rootDto;
};

export const toFlowGraphDocumentDto = (
  document: AjsDocument,
): FlowGraphDocumentDto => ({
  rootUnits: document.rootUnits.map(toFlowGraphUnitDto),
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isOptionalString = (value: unknown): value is string | undefined =>
  value === undefined || typeof value === "string";

const isOptionalBoolean = (value: unknown): value is boolean | undefined =>
  value === undefined || typeof value === "boolean";

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const isParameter = (value: unknown): value is FlowGraphParameterDto =>
  isRecord(value) &&
  typeof value.key === "string" &&
  typeof value.value === "string" &&
  ["position", "line", "column", "length"].every(
    (key) => value[key] === undefined || isFiniteNumber(value[key]),
  );

type PendingRelation = {
  owner: FlowGraphUnitDto;
  relation: FlowGraphRelationDto;
};

type ValidationState = {
  fatal: boolean;
  issues: FlowGraphDocumentIssue[];
  unitById: Map<string, FlowGraphUnitDto>;
  unitByAbsolutePath: Map<string, FlowGraphUnitDto>;
  pendingRelations: PendingRelation[];
  visiting: WeakSet<object>;
  visited: WeakSet<object>;
};

type ValidatedUnitRecord = Record<string, unknown> & {
  id: string;
  name: string;
  unitAttribute: string;
  unitType: AjsUnitType;
  groupType?: AjsGroupType;
  absolutePath: string;
  depth: number;
  parentId?: string;
  isRoot: boolean;
  isRootJobnet: boolean;
  hasSchedule: boolean;
  hasWaitedFor: boolean;
  permission?: string;
  jp1Username?: string;
  jp1ResourceGroup?: string;
  comment?: string;
  isRecovery?: boolean;
  parameters: FlowGraphParameterDto[];
  children: unknown[];
};

const hasValidUnitFields = (
  value: Record<string, unknown>,
): value is ValidatedUnitRecord =>
  typeof value.id === "string" &&
  value.id.length > 0 &&
  typeof value.name === "string" &&
  typeof value.unitAttribute === "string" &&
  typeof value.unitType === "string" &&
  isTySymbol(value.unitType) &&
  (value.groupType === undefined ||
    value.groupType === "n" ||
    value.groupType === "p") &&
  typeof value.absolutePath === "string" &&
  value.absolutePath.length > 0 &&
  typeof value.depth === "number" &&
  Number.isInteger(value.depth) &&
  value.depth >= 0 &&
  typeof value.isRoot === "boolean" &&
  typeof value.isRootJobnet === "boolean" &&
  typeof value.hasSchedule === "boolean" &&
  typeof value.hasWaitedFor === "boolean" &&
  isOptionalString(value.permission) &&
  isOptionalString(value.jp1Username) &&
  isOptionalString(value.jp1ResourceGroup) &&
  isOptionalString(value.comment) &&
  isOptionalString(value.parentId) &&
  isOptionalBoolean(value.isRecovery) &&
  Array.isArray(value.parameters) &&
  value.parameters.every(isParameter) &&
  Array.isArray(value.children);

const addFatalIssue = (
  state: ValidationState,
  issue: FlowGraphDocumentIssue,
): void => {
  state.fatal = true;
  state.issues.push(issue);
};

const readRelations = (
  value: unknown,
  owner: FlowGraphUnitDto,
  state: ValidationState,
): void => {
  if (!Array.isArray(value)) {
    state.issues.push({
      code: "invalid_relation",
      message: "Relations must be an array; invalid relations were omitted.",
      unitPath: owner.absolutePath,
    });
    return;
  }
  value.forEach((candidate) => {
    if (
      !isRecord(candidate) ||
      typeof candidate.sourceUnitId !== "string" ||
      typeof candidate.targetUnitId !== "string" ||
      (candidate.type !== "seq" && candidate.type !== "con")
    ) {
      state.issues.push({
        code: "invalid_relation",
        message: "A malformed relation was omitted.",
        unitPath: owner.absolutePath,
      });
      return;
    }
    state.pendingRelations.push({
      owner,
      relation: {
        sourceUnitId: candidate.sourceUnitId,
        targetUnitId: candidate.targetUnitId,
        type: candidate.type,
      },
    });
  });
};

const readUnit = (
  value: unknown,
  expectedParentId: string | undefined,
  expectedDepth: number,
  state: ValidationState,
): { unit: FlowGraphUnitDto; children: unknown[] } | undefined => {
  if (!isRecord(value)) {
    addFatalIssue(state, {
      code: "invalid_unit",
      message: "A flow unit must be an object.",
    });
    return undefined;
  }
  const unitPath =
    typeof value.absolutePath === "string" ? value.absolutePath : undefined;
  if (!hasValidUnitFields(value)) {
    addFatalIssue(state, {
      code: "invalid_unit",
      message: "A flow unit contains invalid fields.",
      unitPath,
    });
    return undefined;
  }
  if (
    !isRecord(value.layout) ||
    !isFiniteNumber(value.layout.h) ||
    !isFiniteNumber(value.layout.v)
  ) {
    addFatalIssue(state, {
      code: "invalid_layout",
      message: "A flow unit contains invalid layout coordinates.",
      unitPath,
    });
    return undefined;
  }
  if (
    value.parentId !== expectedParentId ||
    value.depth !== expectedDepth ||
    value.isRoot !== (expectedParentId === undefined)
  ) {
    addFatalIssue(state, {
      code: "inconsistent_parent",
      message: "Flow-unit parent, depth, or root metadata is inconsistent.",
      unitPath,
    });
  }
  if (state.unitById.has(value.id)) {
    addFatalIssue(state, {
      code: "duplicate_unit_id",
      message: `Duplicate flow-unit id: ${value.id}`,
      unitPath,
    });
  }
  if (state.unitByAbsolutePath.has(value.absolutePath)) {
    addFatalIssue(state, {
      code: "duplicate_absolute_path",
      message: `Duplicate flow-unit absolute path: ${value.absolutePath}`,
      unitPath,
    });
  }

  const unit: FlowGraphUnitDto = {
    id: value.id,
    name: value.name,
    unitAttribute: value.unitAttribute,
    unitType: value.unitType,
    absolutePath: value.absolutePath,
    depth: value.depth,
    isRoot: value.isRoot,
    isRootJobnet: value.isRootJobnet,
    hasSchedule: value.hasSchedule,
    hasWaitedFor: value.hasWaitedFor,
    layout: { h: value.layout.h, v: value.layout.v },
    parameters: value.parameters.map((parameter) => ({ ...parameter })),
    relations: [],
    children: [],
  };
  if (value.permission !== undefined) unit.permission = value.permission;
  if (value.jp1Username !== undefined) unit.jp1Username = value.jp1Username;
  if (value.jp1ResourceGroup !== undefined) {
    unit.jp1ResourceGroup = value.jp1ResourceGroup;
  }
  if (value.groupType !== undefined) unit.groupType = value.groupType;
  if (value.comment !== undefined) unit.comment = value.comment;
  if (value.parentId !== undefined) unit.parentId = value.parentId;
  if (value.isRecovery !== undefined) unit.isRecovery = value.isRecovery;

  if (!state.unitById.has(unit.id)) state.unitById.set(unit.id, unit);
  if (!state.unitByAbsolutePath.has(unit.absolutePath)) {
    state.unitByAbsolutePath.set(unit.absolutePath, unit);
  }
  readRelations(value.relations, unit, state);
  return { unit, children: value.children };
};

type ValidationFrame =
  | {
      phase: "enter";
      value: unknown;
      expectedParentId: string | undefined;
      expectedDepth: number;
      target: FlowGraphUnitDto[];
    }
  | { phase: "exit"; value: object };

const readRootUnits = (
  values: unknown[],
  state: ValidationState,
): FlowGraphUnitDto[] => {
  const rootUnits: FlowGraphUnitDto[] = [];
  const pending: ValidationFrame[] = values
    .map<ValidationFrame>((value) => ({
      phase: "enter",
      value,
      expectedParentId: undefined,
      expectedDepth: 0,
      target: rootUnits,
    }))
    .reverse();

  while (pending.length > 0) {
    const frame = pending.pop() as ValidationFrame;
    if (frame.phase === "exit") {
      state.visiting.delete(frame.value);
      state.visited.add(frame.value);
      continue;
    }
    if (isRecord(frame.value)) {
      if (state.visiting.has(frame.value) || state.visited.has(frame.value)) {
        addFatalIssue(state, {
          code: "parent_cycle",
          message: "A repeated or cyclic flow-unit object was found.",
        });
        continue;
      }
      state.visiting.add(frame.value);
    }

    const parsed = readUnit(
      frame.value,
      frame.expectedParentId,
      frame.expectedDepth,
      state,
    );
    if (!parsed) {
      if (isRecord(frame.value)) {
        state.visiting.delete(frame.value);
        state.visited.add(frame.value);
      }
      continue;
    }

    frame.target.push(parsed.unit);
    pending.push({ phase: "exit", value: frame.value as object });
    for (let index = parsed.children.length - 1; index >= 0; index--) {
      pending.push({
        phase: "enter",
        value: parsed.children[index],
        expectedParentId: parsed.unit.id,
        expectedDepth: parsed.unit.depth + 1,
        target: parsed.unit.children,
      });
    }
  }
  return rootUnits;
};

export const validateFlowGraphDocument = (
  value: unknown,
): FlowGraphDocumentValidationResult => {
  if (!isRecord(value) || !Array.isArray(value.rootUnits)) {
    return {
      status: "unavailable",
      issues: [
        {
          code: "invalid_document",
          message: "A flow document must contain a rootUnits array.",
        },
      ],
    };
  }
  const state: ValidationState = {
    fatal: false,
    issues: [],
    unitById: new Map(),
    unitByAbsolutePath: new Map(),
    pendingRelations: [],
    visiting: new WeakSet(),
    visited: new WeakSet(),
  };
  const rootUnits = readRootUnits(value.rootUnits, state);
  if (state.fatal) {
    const unavailable: FlowGraphDocumentValidationResult = {
      status: "unavailable",
      issues: state.issues,
    };
    return unavailable;
  }

  const directChildIdsByOwner = new Map<
    FlowGraphUnitDto,
    ReadonlySet<string>
  >();
  state.pendingRelations.forEach(({ owner, relation }) => {
    let directChildIds = directChildIdsByOwner.get(owner);
    if (!directChildIds) {
      directChildIds = new Set(owner.children.map((child) => child.id));
      directChildIdsByOwner.set(owner, directChildIds);
    }
    if (
      !state.unitById.has(relation.sourceUnitId) ||
      !state.unitById.has(relation.targetUnitId) ||
      !directChildIds.has(relation.sourceUnitId) ||
      !directChildIds.has(relation.targetUnitId)
    ) {
      state.issues.push({
        code: "invalid_relation",
        message: "A relation outside its owning flow scope was omitted.",
        unitPath: owner.absolutePath,
      });
      return;
    }
    owner.relations.push(relation);
  });

  const available: FlowGraphDocumentValidationResult = {
    status: "available",
    document: { rootUnits },
    index: {
      unitById: state.unitById,
      unitByAbsolutePath: state.unitByAbsolutePath,
    },
    issues: state.issues,
  };
  return available;
};
