import type {
  AjsDocument,
  AjsParameter,
  AjsUnit,
} from "../../models/ajs/AjsDocument";
import {
  ancestorsOf,
  createScheduleCalendarContextIndex,
} from "./semanticDiffScheduleCalendarIndex";
import {
  type ScheduleCalendarSourceResolution,
  resolveScheduleCalendarSource,
} from "./semanticDiffScheduleCalendarSelectors";
import { resolveScheduleCalendarBaseContext } from "./semanticDiffScheduleOperationalMonth";
import type {
  SemanticDiffScheduleCalendarContext,
  SemanticDiffScheduleCalendarContextIndex,
  SemanticDiffScheduleCalendarSelection,
} from "./semanticDiffScheduleCalendarTypes";
import { createScheduleCalendarContext } from "./semanticDiffScheduleCalendarTypes";

export type {
  SemanticDiffScheduleBaseDay,
  SemanticDiffScheduleCalendarContext,
  SemanticDiffScheduleCalendarContextIndex,
  SemanticDiffScheduleCalendarContextStatus,
  SemanticDiffScheduleCalendarDayClassification,
  SemanticDiffScheduleCalendarDayResult,
  SemanticDiffScheduleCalendarSelection,
} from "./semanticDiffScheduleCalendarTypes";
export { createScheduleCalendarContextIndex } from "./semanticDiffScheduleCalendarIndex";
export { classifyScheduleCalendarDay } from "./semanticDiffScheduleCalendarSelectors";
export {
  isWithinOperationalMonth,
  operationalMonthDate,
  operationalMonthLength,
  resolveOperationalMonth,
  type SemanticDiffOperationalMonth,
} from "./semanticDiffScheduleOperationalMonth";
export {
  isFullyQualifiedRelativeScheduleDate,
  isSyntacticallyInvalidRelativeScheduleDate,
  relativeScheduleDateRequiresContext,
} from "./semanticDiffScheduleRelativeDate";

const invalidHierarchyContext = (
  selection: SemanticDiffScheduleCalendarSelection,
  rawParameters: AjsParameter[],
): SemanticDiffScheduleCalendarContext =>
  createScheduleCalendarContext({
    status: "invalid",
    selection,
    rawParameters,
    evidenceId: "schedule:calendar:invalid-base-or-conflict:hierarchy",
  });

type SourceFailure = Extract<
  ScheduleCalendarSourceResolution,
  { status: "invalid" | "missing-context" }
>;

const sourceFailureContext = (
  source: SourceFailure,
): SemanticDiffScheduleCalendarContext =>
  createScheduleCalendarContext({
    status: source.status,
    selection: source.selection,
    rawParameters: source.rawParameters,
    evidenceId: source.evidenceId,
  });

/** Resolve a jobnet's definition-backed calendar/base context. */
export const resolveScheduleCalendarContext = (
  document: AjsDocument,
  unit: AjsUnit,
  index: SemanticDiffScheduleCalendarContextIndex = createScheduleCalendarContextIndex(
    document,
  ),
): SemanticDiffScheduleCalendarContext => {
  const ancestorResult = ancestorsOf(unit, index);
  const source = resolveScheduleCalendarSource({
    unit,
    index,
    ancestorResult,
  });
  if (source.status !== "supported") {
    return sourceFailureContext(source);
  }
  const sourceAncestors = ancestorsOf(source.sourceGroup, index);
  if (sourceAncestors.status === "invalid") {
    return invalidHierarchyContext(source.selection, source.rawParameters);
  }
  const groups = [
    source.sourceGroup,
    ...sourceAncestors.ancestors.filter(
      (ancestor) => ancestor.unitType === "g",
    ),
  ];
  return resolveScheduleCalendarBaseContext({
    groups,
    sourceGroup: source.sourceGroup,
    selection: source.selection,
    rawSelector: source.rawParameters,
  });
};
