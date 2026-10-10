import { ParamSymbol, TySymbol } from "../../values/AjsType";

export type AjsUnitType = TySymbol;
export type AjsGroupType = "n" | "p";
export type AjsRelationType = "seq" | "con";
export type AjsParameter = {
  readonly key: string;
  readonly value: string;
  readonly position?: number;
  readonly line?: number;
  readonly column?: number;
  readonly length?: number;
};

export type AjsRelation = {
  readonly sourceUnitId: string;
  readonly targetUnitId: string;
  readonly type: AjsRelationType;
};

export type AjsNormalizationWarning = {
  readonly code: string;
  readonly message: string;
  readonly unitPath?: string;
};

export type AjsUnitLayout = {
  readonly h: number;
  readonly v: number;
};

export type AjsUnit = {
  readonly id: string;
  readonly name: string;
  readonly unitAttribute: string;
  readonly permission?: string;
  readonly jp1Username?: string;
  readonly jp1ResourceGroup?: string;
  readonly unitType: AjsUnitType;
  readonly groupType?: AjsGroupType;
  readonly comment?: string;
  readonly absolutePath: string;
  readonly depth: number;
  readonly parentId?: string;
  readonly isRoot: boolean;
  readonly isRecovery?: boolean;
  readonly isRootJobnet: boolean;
  readonly hasSchedule: boolean;
  readonly hasWaitedFor: boolean;
  readonly layout: AjsUnitLayout;
  readonly parameters: readonly AjsParameter[];
  readonly relations: readonly AjsRelation[];
  readonly children: readonly AjsUnit[];
};

export type AjsDocument = {
  readonly rootUnits: readonly AjsUnit[];
  readonly warnings: readonly AjsNormalizationWarning[];
};

type AjsUnitTraversalFrame = {
  readonly units: readonly AjsUnit[];
  index: number;
  readonly owner?: AjsUnit;
};

type AjsUnitTraversalState = {
  readonly flattened: AjsUnit[];
  readonly ancestors: Set<AjsUnit>;
  readonly frames: AjsUnitTraversalFrame[];
};

const skippedAjsUnitTraversalStep = Symbol("skipped AJS unit traversal step");

const assertAjsUnitArray = (units: readonly AjsUnit[]): void => {
  if (!Array.isArray(units)) {
    throw new TypeError("AJS unit collection must be an array.");
  }
};

const releaseCompletedAjsUnitTraversalFrame = (
  state: AjsUnitTraversalState,
): boolean => {
  const frame = state.frames[state.frames.length - 1]!;
  if (frame.index < frame.units.length) {
    return false;
  }

  state.frames.pop();
  if (frame.owner !== undefined) {
    state.ancestors.delete(frame.owner);
  }
  return true;
};

const takeAjsUnitFromTraversalFrame = (
  frame: AjsUnitTraversalFrame,
): AjsUnit | typeof skippedAjsUnitTraversalStep => {
  const index = frame.index;
  frame.index += 1;
  return index in frame.units
    ? frame.units[index]!
    : skippedAjsUnitTraversalStep;
};

const assertNoAjsUnitAncestorCycle = (
  unit: AjsUnit,
  state: AjsUnitTraversalState,
): void => {
  if (state.ancestors.has(unit)) {
    throw new RangeError("AJS unit tree contains an ancestor cycle.");
  }
};

const nextAjsUnitTraversalStep = (
  state: AjsUnitTraversalState,
): AjsUnit | typeof skippedAjsUnitTraversalStep => {
  if (releaseCompletedAjsUnitTraversalFrame(state)) {
    return skippedAjsUnitTraversalStep;
  }

  const frame = state.frames[state.frames.length - 1]!;
  const unit = takeAjsUnitFromTraversalFrame(frame);
  if (unit !== skippedAjsUnitTraversalStep) {
    assertNoAjsUnitAncestorCycle(unit, state);
  }
  return unit;
};

const appendAjsUnitTraversalStep = (
  unit: AjsUnit,
  state: AjsUnitTraversalState,
): void => {
  assertAjsUnitArray(unit.children);
  state.flattened.push(unit);
  state.ancestors.add(unit);
  state.frames.push({ units: unit.children, index: 0, owner: unit });
};

const advanceAjsUnitTraversal = (state: AjsUnitTraversalState): void => {
  const step = nextAjsUnitTraversalStep(state);
  if (step !== skippedAjsUnitTraversalStep) {
    appendAjsUnitTraversalStep(step, state);
  }
};

export const flattenAjsUnits = (units: readonly AjsUnit[]): AjsUnit[] => {
  assertAjsUnitArray(units);
  const state: AjsUnitTraversalState = {
    flattened: [],
    ancestors: new Set<AjsUnit>(),
    frames: [{ units, index: 0 }],
  };

  while (state.frames.length > 0) {
    advanceAjsUnitTraversal(state);
  }

  return state.flattened;
};

export const findAjsUnitById = (
  document: AjsDocument,
  unitId: string,
): AjsUnit | undefined =>
  flattenAjsUnits(document.rootUnits).find((unit) => unit.id === unitId);

export const findAjsUnitParameters = (
  unit: AjsUnit,
  key: string,
): AjsParameter[] =>
  unit.parameters.filter((parameter) => parameter.key === key);

// This helper intentionally preserves the first-hit behavior that existing
// application mappings already used for single-value fields. Callers that need
// repeated values or duplicate-aware interpretation must use
// `findAjsUnitParameters(...)` instead of this convenience accessor.
export const findAjsUnitParameter = (
  unit: AjsUnit,
  key: string,
): AjsParameter | undefined =>
  unit.parameters.find((parameter) => parameter.key === key);

export const findAjsUnitParameterValue = (
  unit: AjsUnit,
  key: ParamSymbol,
): string | undefined => findAjsUnitParameter(unit, key)?.value;

export const findAjsUnitParameterValues = (
  unit: AjsUnit,
  key: ParamSymbol,
): string[] =>
  findAjsUnitParameters(unit, key).map((parameter) => parameter.value);

export const findParentAjsUnit = (
  document: AjsDocument,
  unit: AjsUnit,
): AjsUnit | undefined =>
  unit.parentId ? findAjsUnitById(document, unit.parentId) : undefined;

export const findAjsUnitAncestors = (
  document: AjsDocument,
  unit: AjsUnit,
): AjsUnit[] => {
  const ancestors: AjsUnit[] = [];
  let current = findParentAjsUnit(document, unit);
  while (current) {
    ancestors.push(current);
    current = findParentAjsUnit(document, current);
  }
  return ancestors;
};

const hasAjsParameters = (parameters: readonly AjsParameter[]): boolean =>
  parameters.length > 0;

const findFirstAjsUnitParameters = (
  units: readonly AjsUnit[],
  key: ParamSymbol,
): AjsParameter[] | undefined =>
  units.map((unit) => findAjsUnitParameters(unit, key)).find(hasAjsParameters);

export const findInheritedAjsUnitParameters = (
  document: AjsDocument,
  unit: AjsUnit,
  key: ParamSymbol,
): AjsParameter[] | undefined =>
  findFirstAjsUnitParameters(findAjsUnitAncestors(document, unit), key);

export const findInheritedAjsUnitParameter = (
  document: AjsDocument,
  unit: AjsUnit,
  key: ParamSymbol,
): AjsParameter | undefined =>
  findInheritedAjsUnitParameters(document, unit, key)?.[0];

export const findInheritedAjsUnitParameterValue = (
  document: AjsDocument,
  unit: AjsUnit,
  key: ParamSymbol,
): string | undefined =>
  findInheritedAjsUnitParameter(document, unit, key)?.value;

export const findRootJobnet = (document: AjsDocument): AjsUnit | undefined =>
  flattenAjsUnits(document.rootUnits).find(
    (unit) => unit.unitType === "n" && unit.isRootJobnet,
  );
