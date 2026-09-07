import { isTySymbol } from "../../domain/values/AjsType";
import type {
  FlowGraphDocumentIssue,
  FlowGraphRelationDto,
  FlowGraphUnitDto,
} from "./flowGraphDocument";

export type PendingRelation = {
  owner: FlowGraphUnitDto;
  relation: FlowGraphRelationDto;
};

export type ValidationState = {
  fatal: boolean;
  issues: FlowGraphDocumentIssue[];
  unitById: Map<string, FlowGraphUnitDto>;
  unitByAbsolutePath: Map<string, FlowGraphUnitDto>;
  pendingRelations: PendingRelation[];
  visiting: WeakSet<object>;
  visited: WeakSet<object>;
};

export type ValidatedUnitRecord = Record<string, unknown> & {
  id: string;
  name: string;
  unitAttribute: string;
  unitType: string;
  groupType?: "n" | "p";
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
  parameters: unknown[];
  children: unknown[];
  layout: Record<string, unknown>;
  relations: unknown;
};

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const isOptionalString = (value: unknown): value is string | undefined =>
  value === undefined || typeof value === "string";

export const isOptionalBoolean = (
  value: unknown,
): value is boolean | undefined =>
  value === undefined || typeof value === "boolean";

export const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

export const allChecksPass = (checks: readonly (() => boolean)[]): boolean =>
  checks.every((check) => check());

const isParameter = (value: unknown): boolean =>
  isRecord(value) &&
  allChecksPass([
    () => typeof value.key === "string",
    () => typeof value.value === "string",
    () =>
      ["position", "line", "column", "length"].every(
        (key) => value[key] === undefined || isFiniteNumber(value[key]),
      ),
  ]);

export const hasValidUnitFields = (
  value: Record<string, unknown>,
): value is ValidatedUnitRecord =>
  allChecksPass([
    () => typeof value.id === "string" && value.id.length > 0,
    () => typeof value.name === "string",
    () => typeof value.unitAttribute === "string",
    () => typeof value.unitType === "string" && isTySymbol(value.unitType),
    () =>
      value.groupType === undefined ||
      value.groupType === "n" ||
      value.groupType === "p",
    () =>
      typeof value.absolutePath === "string" && value.absolutePath.length > 0,
    () =>
      typeof value.depth === "number" &&
      Number.isInteger(value.depth) &&
      value.depth >= 0,
    () => typeof value.isRoot === "boolean",
    () => typeof value.isRootJobnet === "boolean",
    () => typeof value.hasSchedule === "boolean",
    () => typeof value.hasWaitedFor === "boolean",
    () => isOptionalString(value.permission),
    () => isOptionalString(value.jp1Username),
    () => isOptionalString(value.jp1ResourceGroup),
    () => isOptionalString(value.comment),
    () => isOptionalString(value.parentId),
    () => isOptionalBoolean(value.isRecovery),
    () =>
      Array.isArray(value.parameters) && value.parameters.every(isParameter),
    () => Array.isArray(value.children),
  ]);

export const addFatalIssue = (
  state: ValidationState,
  issue: FlowGraphDocumentIssue,
): void => {
  state.fatal = true;
  state.issues.push(issue);
};

const invalidRelationIssue = (
  owner: FlowGraphUnitDto,
): FlowGraphDocumentIssue => ({
  code: "invalid_relation",
  message: "A malformed relation was omitted.",
  unitPath: owner.absolutePath,
});

const parseRelationRecord = (
  candidate: Record<string, unknown>,
): FlowGraphRelationDto | undefined => {
  const valid = allChecksPass([
    () => typeof candidate.sourceUnitId === "string",
    () => typeof candidate.targetUnitId === "string",
    () => candidate.type === "seq" || candidate.type === "con",
  ]);
  return valid
    ? {
        sourceUnitId: candidate.sourceUnitId as string,
        targetUnitId: candidate.targetUnitId as string,
        type: candidate.type as "seq" | "con",
      }
    : undefined;
};

const parseRelation = (candidate: unknown): FlowGraphRelationDto | undefined =>
  isRecord(candidate) ? parseRelationRecord(candidate) : undefined;

const appendRelation = (
  candidate: unknown,
  owner: FlowGraphUnitDto,
  state: ValidationState,
): void => {
  const relation = parseRelation(candidate);
  if (relation) {
    state.pendingRelations.push({ owner, relation });
    return;
  }
  state.issues.push(invalidRelationIssue(owner));
};

export const readRelations = (
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
  value.forEach((candidate) => appendRelation(candidate, owner, state));
};

export const createValidationState = (): ValidationState => ({
  fatal: false,
  issues: [],
  unitById: new Map(),
  unitByAbsolutePath: new Map(),
  pendingRelations: [],
  visiting: new WeakSet(),
  visited: new WeakSet(),
});

export const isFlowDocumentRoot = (
  value: unknown,
): value is { rootUnits: unknown[]; semanticDiffOverlay?: unknown } =>
  isRecord(value) && Array.isArray(value.rootUnits);
