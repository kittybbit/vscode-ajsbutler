import type { AjsParameter } from "../models/ajs/AjsDocument";
import {
  classifyScheduleCalendarDay,
  type ScheduleCalendarDayResult,
} from "./ScheduleCalendar";
import { formatScheduleDate, toUtcDate } from "./ScheduleDate";
import {
  substitutionState,
  type SubstitutionAssociation,
  type SubstitutionMode,
  type SubstitutionRuleState,
} from "./ScheduleSubstitutionAnalysis";
import type { CandidateProjectionInput } from "./ScheduleProjectionRules";
import type { ScheduleRuleInterpretation } from "./ScheduleInterpretation";

export type SubstitutionResolution = {
  candidates: string[];
  contextStatus?: "invalid" | "missing-context";
  contextEvidenceId?: string;
};

type SubstitutionContext = NonNullable<
  Parameters<typeof classifyScheduleCalendarDay>[0]
>;

type Classification =
  | "open"
  | "closed"
  | { status: "invalid" | "missing-context"; evidenceId: string };

type CandidateResolution = {
  candidate?: string;
  failure?: SubstitutionResolution;
};

type ShiftSearch = CandidateResolution;

export const updateSubstitutionContextState = (input: {
  association: SubstitutionAssociation;
  status: "invalid" | "missing-context";
  calendarRawParameters: AjsParameter[];
  states: Map<ScheduleRuleInterpretation, SubstitutionRuleState>;
}): void => {
  input.association.sh.forEach((substitutionRule) => {
    const current = input.states.get(substitutionRule.interpretationRule);
    if (!current || current.status !== "supported") {
      return;
    }
    input.states.set(
      substitutionRule.interpretationRule,
      substitutionState({
        status: input.status,
        reason: "closed-day-substitution",
        evidenceId: `schedule:sh:${input.status}:${substitutionRule.rule}`,
        rawParameters: [
          ...current.rawParameters,
          ...input.calendarRawParameters,
        ],
        rule: substitutionRule.rule,
      }),
    );
  });
};

const invalidAssociation = (association: SubstitutionAssociation): boolean => {
  const invalidMode = association.modeConflict || association.mode === "no";
  const invalidRules = association.invalidSh.length > 0;
  const invalidShiftDays =
    association.shiftDaysConflict || association.invalidShiftDays.length > 0;
  return invalidMode || invalidRules || invalidShiftDays;
};

type SubstitutionModeInput = Pick<
  CandidateProjectionInput,
  "association" | "fullyQualified" | "unresolvedWholeRule"
>;

const hasAssociationMode = (input: SubstitutionModeInput): boolean =>
  input.association?.mode !== undefined;

const hasForcedEmptySubstitution = (input: SubstitutionModeInput): boolean =>
  (input.association?.invalidSh.length ?? 0) !== 0 ||
  input.association?.mode === "no";

const isDirectSubstitutionProjection = (
  input: SubstitutionModeInput,
): boolean =>
  !hasForcedEmptySubstitution(input) &&
  (!hasAssociationMode(input) || !input.fullyQualified);

const isEmptySubstitutionProjection = (input: SubstitutionModeInput): boolean =>
  hasForcedEmptySubstitution(input) ||
  (hasAssociationMode(input) &&
    (invalidAssociation(input.association!) || input.unresolvedWholeRule));

const substitutionMode = (
  input: SubstitutionModeInput,
): "direct" | "empty" | "resolve" => {
  const direct = isDirectSubstitutionProjection(input);
  const empty = isEmptySubstitutionProjection(input);
  const key = `${direct}-${empty}`;
  return {
    "true-false": "direct",
    "true-true": "direct",
    "false-true": "empty",
    "false-false": "resolve",
  }[key] as "direct" | "empty" | "resolve";
};

const directResolution = (
  input: CandidateProjectionInput,
  mode: "direct" | "empty",
): ReturnType<typeof resolveSubstitutedCandidates> => ({
  candidates: mode === "empty" ? [] : input.candidates,
});

export const substitutionResolution = (
  input: CandidateProjectionInput,
): ReturnType<typeof resolveSubstitutedCandidates> => {
  const mode = substitutionMode(input);
  return mode === "resolve"
    ? resolveSubstitutedCandidates({
        candidates: input.candidates,
        association: input.association,
        calendarContext: input.calendarContext,
      })
    : directResolution(input, mode);
};

const contextFailure = (
  classification: Exclude<Classification, "open" | "closed">,
): SubstitutionResolution => ({
  candidates: [],
  contextStatus: classification.status,
  contextEvidenceId: classification.evidenceId,
});

const classifyDate = (
  context: SubstitutionContext,
  date: Date,
): Classification => {
  const result: ScheduleCalendarDayResult = classifyScheduleCalendarDay(
    context,
    date,
  );
  return "evidenceId" in result
    ? { status: result.status, evidenceId: result.evidenceId }
    : result.status;
};

const shiftedDate = (input: {
  offset: number;
  baseDate: Date;
  mode: SubstitutionMode;
}): Date => {
  const direction = input.mode === "be" ? -1 : 1;
  return new Date(
    input.baseDate.getTime() + direction * input.offset * 86_400_000,
  );
};

const shiftResult = (input: {
  date: Date;
  classification: Classification;
}): ShiftSearch | undefined => {
  if (typeof input.classification !== "string") {
    return { failure: contextFailure(input.classification) };
  }
  if (input.classification !== "open") {
    return undefined;
  }
  return {
    candidate: formatScheduleDate(
      input.date.getUTCFullYear(),
      input.date.getUTCMonth() + 1,
      input.date.getUTCDate(),
    ),
  };
};

const continueShift = (
  state: ShiftSearch,
  next: ShiftSearch | undefined,
): ShiftSearch => {
  if (state.candidate !== undefined || state.failure !== undefined) {
    return state;
  }
  return next ?? state;
};

const shiftStep = (input: {
  state: ShiftSearch;
  offset: number;
  baseDate: Date;
  mode: SubstitutionMode;
  context: SubstitutionContext;
}): ShiftSearch => {
  const date = shiftedDate(input);
  const classification = classifyDate(input.context, date);
  return continueShift(input.state, shiftResult({ date, classification }));
};

const shiftedCandidate = (input: {
  baseDate: Date;
  mode: SubstitutionMode;
  shiftDays: number;
  context: SubstitutionContext;
}): ShiftSearch => {
  const offsets = Array.from(
    { length: input.shiftDays },
    (_, index) => index + 1,
  );
  return offsets.reduce<ShiftSearch>(
    (state, offset) => shiftStep({ ...input, state, offset }),
    {},
  );
};

type ClassifiedCandidateInput = {
  candidate: string;
  mode: SubstitutionMode;
  shiftDays: number;
  context: SubstitutionContext;
  baseDate: Date;
  classification: Classification;
  failure: SubstitutionResolution | undefined;
};

const cancelCandidate = (
  input: ClassifiedCandidateInput,
): CandidateResolution =>
  (input.failure ? { failure: input.failure } : undefined) ??
  (input.classification === "open" ? { candidate: input.candidate } : {});

const openOrShiftedCandidate = (
  input: ClassifiedCandidateInput,
): CandidateResolution =>
  (input.failure ? { failure: input.failure } : undefined) ??
  (input.classification === "open"
    ? { candidate: input.candidate }
    : shiftedCandidate({
        baseDate: input.baseDate,
        mode: input.mode,
        shiftDays: input.shiftDays,
        context: input.context,
      }));

const candidateHandlers: Record<
  SubstitutionMode,
  (input: ClassifiedCandidateInput) => CandidateResolution
> = {
  ca: cancelCandidate,
  be: openOrShiftedCandidate,
  af: openOrShiftedCandidate,
  no: cancelCandidate,
};

/** Resolve one candidate while preserving substitution order and stop rules. */

const resolveSubstitutionCandidate = (input: {
  candidate: string;
  mode: SubstitutionMode;
  shiftDays: number;
  context: SubstitutionContext;
}): CandidateResolution => {
  const baseDate = toUtcDate(input.candidate);
  if (!baseDate) {
    return {};
  }
  const classification = classifyDate(input.context, baseDate);
  const failure =
    typeof classification !== "string"
      ? contextFailure(classification)
      : undefined;
  return candidateHandlers[input.mode]({
    ...input,
    baseDate,
    classification,
    failure,
  });
};

type SubstitutionProjectionContext = NonNullable<
  Parameters<typeof resolveSubstitutionCandidate>[0]["context"]
>;

type ResolutionSetup =
  | { kind: "skip"; resolution: SubstitutionResolution }
  | {
      kind: "ready";
      context: SubstitutionProjectionContext;
      mode: SubstitutionMode;
      shiftDays: number;
    };

type SubstitutionCandidateResolution = ReturnType<
  typeof resolveSubstitutionCandidate
>;

const isInvalidSubstitutionAssociation = (
  association: SubstitutionAssociation,
): boolean =>
  association.modeConflict ||
  association.invalidSh.length > 0 ||
  association.shiftDaysConflict ||
  association.invalidShiftDays.length > 0;

const noSubstitutionMode = (
  association: SubstitutionAssociation | undefined,
): boolean =>
  association === undefined ||
  association.mode === undefined ||
  association.mode === "no";

const unsupportedContextResolution = (
  context: SubstitutionProjectionContext,
): SubstitutionResolution | undefined =>
  context.status === "supported"
    ? undefined
    : {
        candidates: [],
        contextStatus: context.status,
        contextEvidenceId: context.evidenceId,
      };

const setupResolution = (input: {
  association: SubstitutionAssociation | undefined;
  calendarContext: SubstitutionProjectionContext | undefined;
}): SubstitutionResolution | undefined => {
  const association = input.association;
  const context = input.calendarContext;
  const resolutions = [
    {
      when: noSubstitutionMode(association),
      resolution: { candidates: [] },
    },
    {
      when:
        association !== undefined &&
        isInvalidSubstitutionAssociation(association),
      resolution: { candidates: [] },
    },
    {
      when: context === undefined,
      resolution: { candidates: [], contextStatus: "missing-context" as const },
    },
    {
      when: context !== undefined && context.status !== "supported",
      resolution: unsupportedContextResolution(context!),
    },
  ];
  return resolutions.find((candidate) => candidate.when)?.resolution;
};

const substitutionSetup = (input: {
  association: SubstitutionAssociation | undefined;
  calendarContext: SubstitutionProjectionContext | undefined;
}): ResolutionSetup => {
  const association = input.association;
  const resolution = setupResolution(input);
  return resolution
    ? { kind: "skip", resolution }
    : {
        kind: "ready",
        context: input.calendarContext!,
        mode: association!.mode!,
        shiftDays: association!.shiftDays ?? 2,
      };
};

type CandidateAccumulator = {
  candidates: string[];
  failure?: SubstitutionResolution;
};

const resolveCandidateList = (input: {
  candidates: string[];
  mode: SubstitutionMode;
  shiftDays: number;
  context: SubstitutionProjectionContext;
}): CandidateAccumulator =>
  input.candidates.reduce<CandidateAccumulator>(
    (state, candidate) => appendCandidate({ state, input, candidate }),
    { candidates: [] },
  );

const appendCandidate = (input: {
  state: CandidateAccumulator;
  candidate: string;
  input: {
    candidates: string[];
    mode: SubstitutionMode;
    shiftDays: number;
    context: SubstitutionProjectionContext;
  };
}): CandidateAccumulator => {
  const result = resolveSubstitutionCandidate({
    ...input.input,
    candidate: input.candidate,
  });
  return input.state.failure
    ? input.state
    : candidateAccumulator({ state: input.state, result });
};

const candidateAccumulator = (input: {
  state: CandidateAccumulator;
  result: SubstitutionCandidateResolution;
}): CandidateAccumulator => {
  const candidates =
    input.result.candidate === undefined
      ? input.state.candidates
      : [...input.state.candidates, input.result.candidate];
  return input.result.failure
    ? { candidates: [], failure: input.result.failure }
    : { candidates };
};

/** Resolve closed-day substitution without changing candidate order or bounds. */

export const resolveSubstitutedCandidates = (input: {
  candidates: string[];
  association: SubstitutionAssociation | undefined;
  calendarContext: SubstitutionProjectionContext | undefined;
}): SubstitutionResolution => {
  const setup = substitutionSetup(input);
  if (setup.kind === "skip") {
    return setup.resolution;
  }
  const result = resolveCandidateList({
    candidates: input.candidates,
    mode: setup.mode,
    shiftDays: setup.shiftDays,
    context: setup.context,
  });
  return result.failure ?? { candidates: result.candidates };
};

/** Project one interpreted unit over a schedule-owned half-open period. */
