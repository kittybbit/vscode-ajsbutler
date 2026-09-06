import type { AjsDocument, AjsUnit } from "../../models/ajs/AjsDocument";
import type { SemanticDiffScheduleCalendarContextIndex } from "./semanticDiffScheduleCalendarTypes";

const appendChildren = (pending: AjsUnit[], unit: AjsUnit): void => {
  [...unit.children].reverse().forEach((child) => pending.push(child));
};

const visitUnit = (
  units: AjsUnit[],
  visited: Set<AjsUnit>,
  unit: AjsUnit,
): boolean => {
  if (visited.has(unit)) {
    return false;
  }
  visited.add(unit);
  units.push(unit);
  return true;
};

const processPendingUnit = (
  pending: AjsUnit[],
  units: AjsUnit[],
  visited: Set<AjsUnit>,
): void => {
  const unit = pending.pop() as AjsUnit;
  if (visitUnit(units, visited, unit)) {
    appendChildren(pending, unit);
  }
};

const collectUnits = (document: AjsDocument): AjsUnit[] => {
  const units: AjsUnit[] = [];
  const pending = [...document.rootUnits].reverse();
  const visited = new Set<AjsUnit>();
  while (pending.length > 0) {
    processPendingUnit(pending, units, visited);
  }
  return units;
};

const appendUnit = (
  index: Map<string, AjsUnit[]>,
  key: string,
  unit: AjsUnit,
): Map<string, AjsUnit[]> => {
  const matches = index.get(key) ?? [];
  matches.push(unit);
  index.set(key, matches);
  return index;
};

const indexUnits = (
  units: AjsUnit[],
  key: (unit: AjsUnit) => string,
): Map<string, AjsUnit[]> =>
  units.reduce(
    (index, unit) => appendUnit(index, key(unit), unit),
    new Map<string, AjsUnit[]>(),
  );

export const createScheduleCalendarContextIndex = (
  document: AjsDocument,
): SemanticDiffScheduleCalendarContextIndex => {
  const units = collectUnits(document);
  const byId = indexUnits(units, (unit) => unit.id);
  const byPath = indexUnits(units, (unit) => unit.absolutePath);
  return {
    byId,
    byPath,
    duplicatePath: [...byPath.values()].some((matches) => matches.length > 1),
  };
};

export type AncestorResult =
  | { status: "supported"; ancestors: AjsUnit[] }
  | { status: "invalid" };

type AncestorLookup = {
  parentId: string;
  index: SemanticDiffScheduleCalendarContextIndex;
  seenIds: Set<string>;
  seenPaths: Set<string>;
};

type AncestorStep =
  | { status: "supported"; parent: AjsUnit }
  | { status: "invalid" };

const uniqueParent = (
  parentId: string,
  index: SemanticDiffScheduleCalendarContextIndex,
): AjsUnit | undefined => {
  const matches = index.byId.get(parentId) ?? [];
  return matches.length === 1 ? matches[0] : undefined;
};

const isSeenAncestor = (lookup: AncestorLookup, parent: AjsUnit): boolean =>
  lookup.seenIds.has(parent.id) || lookup.seenPaths.has(parent.absolutePath);

const nextAncestor = (lookup: AncestorLookup): AncestorStep => {
  const parent = uniqueParent(lookup.parentId, lookup.index);
  return parent && !isSeenAncestor(lookup, parent)
    ? { status: "supported", parent }
    : { status: "invalid" };
};

type AncestorState = {
  parentId: string | undefined;
  ancestors: AjsUnit[];
  seenIds: Set<string>;
  seenPaths: Set<string>;
};

const advanceAncestor = (
  state: AncestorState,
  index: SemanticDiffScheduleCalendarContextIndex,
): AncestorState & { invalid?: boolean } => {
  if (state.parentId === undefined) {
    return state;
  }
  const step = nextAncestor({
    parentId: state.parentId,
    index,
    seenIds: state.seenIds,
    seenPaths: state.seenPaths,
  });
  if (step.status === "invalid") {
    return { ...state, invalid: true };
  }
  state.seenIds.add(step.parent.id);
  state.seenPaths.add(step.parent.absolutePath);
  state.ancestors.push(step.parent);
  return { ...state, parentId: step.parent.parentId };
};

const hasPendingAncestor = (state: AncestorState & { invalid?: boolean }) =>
  state.parentId !== undefined && !state.invalid;

const collectAncestorState = (
  state: AncestorState & { invalid?: boolean },
  index: SemanticDiffScheduleCalendarContextIndex,
): AncestorState & { invalid?: boolean } => {
  while (hasPendingAncestor(state)) {
    state = advanceAncestor(state, index);
  }
  return state;
};

export const ancestorsOf = (
  unit: AjsUnit,
  index: SemanticDiffScheduleCalendarContextIndex,
): AncestorResult => {
  let state: AncestorState & { invalid?: boolean } = {
    parentId: unit.parentId,
    ancestors: [],
    seenIds: new Set<string>(),
    seenPaths: new Set<string>(),
  };
  state = collectAncestorState(state, index);
  return state.invalid
    ? { status: "invalid" }
    : { status: "supported", ancestors: state.ancestors };
};
