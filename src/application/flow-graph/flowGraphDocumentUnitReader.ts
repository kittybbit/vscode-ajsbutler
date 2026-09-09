import type { FlowGraphUnitDto } from "./flowGraphDocument";
import {
  addFatalIssue,
  allChecksPass,
  hasValidUnitFields,
  isFiniteNumber,
  isRecord,
  readRelations,
  type ValidatedUnitRecord,
  type ValidationState,
} from "./flowGraphDocumentUnitValidation";

export type ReadUnitInput = {
  value: unknown;
  expectedParentId: string | undefined;
  expectedDepth: number;
  state: ValidationState;
};

type ParsedUnit = { unit: FlowGraphUnitDto; children: unknown[] };

const optionalUnitKeys = [
  "permission",
  "jp1Username",
  "jp1ResourceGroup",
  "groupType",
  "comment",
  "parentId",
  "isRecovery",
] as const;

const copyOptionalUnitProperties = (
  source: ValidatedUnitRecord,
  target: FlowGraphUnitDto,
): void => {
  optionalUnitKeys.forEach((key) => {
    const value = source[key];
    if (value !== undefined) {
      (target as unknown as Record<string, unknown>)[key] = value;
    }
  });
};

const buildUnit = (value: ValidatedUnitRecord): FlowGraphUnitDto => {
  const unit: FlowGraphUnitDto = {
    id: value.id,
    name: value.name,
    unitAttribute: value.unitAttribute,
    unitType: value.unitType as FlowGraphUnitDto["unitType"],
    absolutePath: value.absolutePath,
    depth: value.depth,
    isRoot: value.isRoot,
    isRootJobnet: value.isRootJobnet,
    hasSchedule: value.hasSchedule,
    hasWaitedFor: value.hasWaitedFor,
    layout: {
      h: value.layout.h as number,
      v: value.layout.v as number,
    },
    parameters: value.parameters.map((parameter) => ({
      ...(parameter as Record<string, unknown>),
    })) as FlowGraphUnitDto["parameters"],
    relations: [],
    children: [],
  };
  copyOptionalUnitProperties(value, unit);
  return unit;
};

const isValidLayout = (value: ValidatedUnitRecord): boolean =>
  isRecord(value.layout) &&
  allChecksPass([
    () => isFiniteNumber(value.layout.h),
    () => isFiniteNumber(value.layout.v),
  ]);

const hasExpectedHierarchy = (
  value: ValidatedUnitRecord,
  expectedParentId: string | undefined,
  expectedDepth: number,
): boolean =>
  allChecksPass([
    () => value.parentId === expectedParentId,
    () => value.depth === expectedDepth,
    () => value.isRoot === (expectedParentId === undefined),
  ]);

const addHierarchyIssue = ({
  value,
  expectedParentId,
  expectedDepth,
  unitPath,
  state,
}: {
  value: ValidatedUnitRecord;
  expectedParentId: string | undefined;
  expectedDepth: number;
  unitPath: string | undefined;
  state: ValidationState;
}): void => {
  if (!hasExpectedHierarchy(value, expectedParentId, expectedDepth)) {
    addFatalIssue(state, {
      code: "inconsistent_parent",
      message: "Flow-unit parent, depth, or root metadata is inconsistent.",
      unitPath,
    });
  }
};

const addDuplicateIssues = (
  value: ValidatedUnitRecord,
  unitPath: string | undefined,
  state: ValidationState,
): void => {
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
};

const registerUnit = (unit: FlowGraphUnitDto, state: ValidationState): void => {
  if (!state.unitById.has(unit.id)) state.unitById.set(unit.id, unit);
  if (!state.unitByAbsolutePath.has(unit.absolutePath)) {
    state.unitByAbsolutePath.set(unit.absolutePath, unit);
  }
};

const readValidatedUnit = (
  value: ValidatedUnitRecord,
  input: ReadUnitInput,
  unitPath: string | undefined,
): ParsedUnit | undefined => {
  const { state } = input;
  if (!isValidLayout(value)) {
    addFatalIssue(state, {
      code: "invalid_layout",
      message: "A flow unit contains invalid layout coordinates.",
      unitPath,
    });
    return undefined;
  }
  addHierarchyIssue({
    value,
    expectedParentId: input.expectedParentId,
    expectedDepth: input.expectedDepth,
    unitPath,
    state,
  });
  addDuplicateIssues(value, unitPath, state);
  const unit = buildUnit(value);
  registerUnit(unit, state);
  readRelations(value.relations, unit, state);
  return { unit, children: value.children };
};

const readUnitRecord = (
  value: unknown,
  state: ValidationState,
):
  | { record: ValidatedUnitRecord; unitPath: string | undefined }
  | undefined => {
  if (!isRecord(value)) return invalidUnitRecord(state);
  return readUnitRecordValue(value, state);
};

const invalidUnitRecord = (state: ValidationState): undefined => {
  addFatalIssue(state, {
    code: "invalid_unit",
    message: "A flow unit must be an object.",
  });
  return undefined;
};

const readUnitRecordValue = (
  value: Record<string, unknown>,
  state: ValidationState,
):
  | { record: ValidatedUnitRecord; unitPath: string | undefined }
  | undefined => {
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
  return { record: value, unitPath };
};

export const readUnit = (input: ReadUnitInput): ParsedUnit | undefined => {
  const parsed = readUnitRecord(input.value, input.state);
  return parsed
    ? readValidatedUnit(parsed.record, input, parsed.unitPath)
    : undefined;
};
