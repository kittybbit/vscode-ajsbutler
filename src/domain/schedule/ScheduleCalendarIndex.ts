import type { AjsParameter, AjsUnit } from "../models/ajs/AjsDocument";
import type {
  ScheduleCalendarContextIndex,
  ScheduleCalendarContextStatus,
  ScheduleCalendarSelection,
} from "./ScheduleCalendar";

export {
  collectUniqueAjsUnits as collectUnits,
  indexAjsUnits as indexUnits,
} from "../models/ajs/AjsDocumentIndex";

export type AncestorResult =
  | { status: "supported"; ancestors: AjsUnit[] }
  | { status: "invalid" };

type AncestorLookup = {
  parentId: string;
  index: ScheduleCalendarContextIndex;
  seenIds: Set<string>;
  seenPaths: Set<string>;
};

type AncestorStep =
  | { status: "supported"; parent: AjsUnit }
  | { status: "invalid" };

const uniqueParent = (
  parentId: string,
  index: ScheduleCalendarContextIndex,
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
  index: ScheduleCalendarContextIndex,
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
  index: ScheduleCalendarContextIndex,
): AncestorState & { invalid?: boolean } => {
  while (hasPendingAncestor(state)) {
    state = advanceAncestor(state, index);
  }
  return state;
};

export const ancestorsOf = (
  unit: AjsUnit,
  index: ScheduleCalendarContextIndex,
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

const selectionEvidence = (
  status: ScheduleCalendarContextStatus,
  value: string,
  rawParameters: AjsParameter[],
): ScheduleCalendarSelection => {
  const evidencePrefix = {
    supported: "schedule:jc:resolved",
    invalid: "schedule:jc:invalid",
    "missing-context": "schedule:jc:missing-context",
  }[status];
  return {
    status,
    evidenceId: `${evidencePrefix}:${value}`,
    rawParameters,
  };
};

export type ScheduleCalendarSourceResolution =
  | {
      status: "supported";
      selection: ScheduleCalendarSelection;
      rawParameters: AjsParameter[];
      sourceGroup: AjsUnit;
    }
  | {
      status: "invalid" | "missing-context";
      selection: ScheduleCalendarSelection;
      rawParameters: AjsParameter[];
      evidenceId: string;
    };

type SourceFailureInput = {
  status: "invalid" | "missing-context";
  value: string;
  rawParameters: AjsParameter[];
  evidenceId?: string;
};

const sourceFailure = (
  input: SourceFailureInput,
): ScheduleCalendarSourceResolution => {
  const selection = selectionEvidence(
    input.status,
    input.value,
    input.rawParameters,
  );
  return {
    status: input.status,
    selection,
    rawParameters: input.rawParameters,
    evidenceId: input.evidenceId ?? selection.evidenceId,
  };
};

const isUniqueCalendarGroup = (
  matches: readonly AjsUnit[],
): matches is readonly [AjsUnit] =>
  matches.length === 1 && matches[0].unitType === "g";

const resolveExplicitSource = (
  selector: AjsParameter,
  rawParameters: AjsParameter[],
  index: ScheduleCalendarContextIndex,
): ScheduleCalendarSourceResolution => {
  if (!selector.value.startsWith("/")) {
    return sourceFailure({
      status: "invalid",
      value: selector.value,
      rawParameters,
    });
  }
  const matches = index.byPath.get(selector.value) ?? [];
  if (!isUniqueCalendarGroup(matches)) {
    return sourceFailure({
      status: "missing-context",
      value: selector.value,
      rawParameters,
    });
  }
  const sourceGroup = matches[0];
  return {
    status: "supported",
    selection: selectionEvidence(
      "supported",
      sourceGroup.absolutePath,
      rawParameters,
    ),
    rawParameters,
    sourceGroup,
  };
};

const hierarchySourceFailure = (
  input: {
    index: ScheduleCalendarContextIndex;
    ancestorResult: AncestorResult;
  },
  value: string,
  rawParameters: AjsParameter[],
): ScheduleCalendarSourceResolution | undefined => {
  const invalidHierarchy =
    input.index.duplicatePath || input.ancestorResult.status === "invalid";
  return invalidHierarchy
    ? sourceFailure({
        status: "invalid",
        value,
        rawParameters,
        evidenceId: "schedule:calendar:invalid-base-or-conflict:hierarchy",
      })
    : undefined;
};

const duplicateSelectorFailure = (
  value: string,
  rawParameters: AjsParameter[],
): ScheduleCalendarSourceResolution =>
  sourceFailure({
    status: "invalid",
    value,
    rawParameters,
    evidenceId: "schedule:calendar:invalid-base-or-conflict:jc",
  });

const resolveContainingSource = (
  ancestors: AjsUnit[],
  rawParameters: AjsParameter[],
): ScheduleCalendarSourceResolution => {
  const containingGroup = ancestors.find(
    (ancestor) => ancestor.unitType === "g",
  );
  if (!containingGroup) {
    return sourceFailure({
      status: "missing-context",
      value: "",
      rawParameters,
      evidenceId: "schedule:calendar:missing-context:group",
    });
  }
  return {
    status: "supported",
    selection: selectionEvidence(
      "supported",
      containingGroup.absolutePath,
      rawParameters,
    ),
    rawParameters,
    sourceGroup: containingGroup,
  };
};

const supportedAncestors = (result: AncestorResult): AjsUnit[] =>
  result.status === "supported" ? result.ancestors : [];

const resolveSourceByParameters = (
  rawParameters: AjsParameter[],
  index: ScheduleCalendarContextIndex,
  ancestors: AjsUnit[],
): ScheduleCalendarSourceResolution => {
  const selectorValue = rawParameters[0]?.value ?? "";
  if (rawParameters.length > 1) {
    return duplicateSelectorFailure(selectorValue, rawParameters);
  }
  return rawParameters.length === 1
    ? resolveExplicitSource(
        rawParameters[0] as AjsParameter,
        rawParameters,
        index,
      )
    : resolveContainingSource(ancestors, rawParameters);
};

export const resolveScheduleCalendarSource = (input: {
  unit: AjsUnit;
  index: ScheduleCalendarContextIndex;
  ancestorResult: AncestorResult;
}): ScheduleCalendarSourceResolution => {
  const rawParameters = input.unit.parameters.filter(
    (parameter) => parameter.key === "jc",
  );
  const selectorValue = rawParameters[0]?.value ?? "";
  return (
    hierarchySourceFailure(input, selectorValue, rawParameters) ??
    resolveSourceByParameters(
      rawParameters,
      input.index,
      supportedAncestors(input.ancestorResult),
    )
  );
};
