import type { AjsParameter } from "../../models/ajs/AjsDocument";
import {
  isFullyQualifiedRelativeScheduleDate,
  isSyntacticallyInvalidRelativeScheduleDate,
  relativeScheduleDateRequiresContext,
  type SemanticDiffScheduleCalendarContext,
} from "./semanticDiffScheduleCalendarContext";
import { scheduleDateCandidates } from "./semanticDiffScheduleDateCandidates";
import type {
  ScheduleDateCandidateResult,
  ValidSchedulePeriod,
} from "./semanticDiffScheduleCandidateTypes";
import { toUtcDate } from "../../schedule/ScheduleDate";
import type { SemanticDiffScheduleRun } from "../../models/semantic-diff/SemanticDiff";
import type { ScheduleRuleInterpretation } from "../../schedule/ScheduleInterpretation";
import {
  resolveSubstitutionCandidate,
  type SubstitutionAssociation,
  type SubstitutionMode,
  type SubstitutionResolution,
} from "./semanticDiffScheduleSubstitutionAnalysis";

type SubstitutionContext = NonNullable<
  Parameters<typeof resolveSubstitutionCandidate>[0]["context"]
>;

type ResolutionSetup =
  | { kind: "skip"; resolution: SubstitutionResolution }
  | {
      kind: "ready";
      context: SubstitutionContext;
      mode: SubstitutionMode;
      shiftDays: number;
    };

type CandidateResolution = ReturnType<typeof resolveSubstitutionCandidate>;

export type DatePreflight =
  | { kind: "return"; rule: ScheduleRuleInterpretation }
  | {
      kind: "project";
      candidates: string[];
      startTime: SupportedStartTimeRule;
    };

type SupportedStartTimeRule = ScheduleRuleInterpretation & {
  startTime: NonNullable<ScheduleRuleInterpretation["startTime"]>;
};

const cloneRule = (
  rule: ScheduleRuleInterpretation,
  patch: Partial<ScheduleRuleInterpretation>,
): ScheduleRuleInterpretation => ({ ...rule, ...patch });

export const scheduleRuleEvidenceId = (input: {
  rule: ScheduleRuleInterpretation;
  kind: "projected" | "invalid" | "missing-start-time";
  runs?: SemanticDiffScheduleRun[];
}): string => {
  const generated = {
    projected: `schedule:sd:${input.runs?.length === 0 ? "no-runs" : "supported"}:${input.rule.rule ?? 1}`,
    invalid: `schedule:sd:invalid-calendar-day:${input.rule.rule ?? input.rule.parameter.value}`,
    "missing-start-time": `schedule:sd:missing-start-time:${input.rule.rule ?? 1}`,
  }[input.kind];
  return input.rule.evidence.id.startsWith("JP1-PARAM-SCHEDULE-")
    ? input.rule.evidence.id
    : generated;
};

const startTimeParameter = (
  startTime: ScheduleRuleInterpretation | undefined,
): AjsParameter[] => (startTime?.parameter ? [startTime.parameter] : []);

const calendarRule = (input: {
  rule: ScheduleRuleInterpretation;
  startTime: ScheduleRuleInterpretation | undefined;
  status: ScheduleRuleInterpretation["status"];
  reason: ScheduleRuleInterpretation["reason"];
  evidenceId: string;
  calendarContext?: SemanticDiffScheduleCalendarContext;
}): ScheduleRuleInterpretation =>
  cloneRule(input.rule, {
    status: input.status,
    reason: input.reason,
    evidence: {
      id: input.evidenceId,
      rawParameters: input.calendarContext
        ? [input.rule.parameter, ...input.calendarContext.rawParameters]
        : [input.rule.parameter, ...startTimeParameter(input.startTime)],
      rule: input.rule.rule,
    },
  });

type RelativeDateMode = "none" | "invalid" | "unqualified" | "qualified";

const relativeDateMode = (
  date: ScheduleRuleInterpretation["date"],
): RelativeDateMode => {
  const facts =
    date === undefined
      ? { exists: false, requires: false, invalid: false, qualified: false }
      : {
          exists: true,
          requires: relativeScheduleDateRequiresContext(date),
          invalid: isSyntacticallyInvalidRelativeScheduleDate(date),
          qualified: isFullyQualifiedRelativeScheduleDate(date),
        };
  return (
    {
      "false-false-false-false": "none",
      "true-false-false-false": "none",
      "true-true-true-false": "invalid",
      "true-true-false-true": "qualified",
      "true-true-false-false": "unqualified",
    } as Record<string, RelativeDateMode>
  )[`${facts.exists}-${facts.requires}-${facts.invalid}-${facts.qualified}`];
};

const relativeDateContextOutcome = (input: {
  rule: ScheduleRuleInterpretation;
  calendarContext: SemanticDiffScheduleCalendarContext | undefined;
}): ScheduleRuleInterpretation | undefined => {
  const context = input.calendarContext;
  const handlers: Record<
    SemanticDiffScheduleCalendarContext["status"],
    () => ScheduleRuleInterpretation | undefined
  > = {
    supported: () => undefined,
    invalid: () =>
      calendarRule({
        rule: input.rule,
        startTime: undefined,
        status: "invalid",
        reason: "calendar-selection",
        evidenceId: context!.evidenceId,
        calendarContext: context,
      }),
    "missing-context": () =>
      calendarRule({
        rule: input.rule,
        startTime: undefined,
        status: "missing-context",
        reason: "calendar-selection",
        evidenceId: context!.evidenceId,
        calendarContext: context,
      }),
  };
  return context ? handlers[context.status]() : input.rule;
};

const relativeDateOutcome = (input: {
  rule: ScheduleRuleInterpretation;
  startTime: ScheduleRuleInterpretation | undefined;
  calendarContext: SemanticDiffScheduleCalendarContext | undefined;
}): ScheduleRuleInterpretation | undefined => {
  const handlers: Record<
    RelativeDateMode,
    () => ScheduleRuleInterpretation | undefined
  > = {
    none: () => undefined,
    invalid: () =>
      calendarRule({
        ...input,
        status: "invalid",
        reason: "invalid-calendar-day",
        evidenceId: scheduleRuleEvidenceId({
          rule: input.rule,
          kind: "invalid",
        }),
      }),
    unqualified: () => input.rule,
    qualified: () => relativeDateContextOutcome(input),
  };
  return handlers[relativeDateMode(input.rule.date)]();
};

const unsupportedDateOutcome = (input: {
  rule: ScheduleRuleInterpretation;
}): ScheduleRuleInterpretation | undefined =>
  input.rule.date &&
  input.rule.status !== "supported" &&
  relativeDateMode(input.rule.date) === "none"
    ? input.rule
    : undefined;

const contextFailureDetails = (
  candidateResult: ScheduleDateCandidateResult,
): { status?: "invalid" | "missing-context"; evidenceId?: string } => {
  const key = [
    candidateResult.contextInvalid ?? false,
    candidateResult.contextMissing ?? false,
  ]
    .map(String)
    .join("-") as "true-false" | "false-true" | "false-false";
  return (
    {
      "true-false": {
        status: "invalid",
        evidenceId: "schedule:calendar:invalid-base-or-conflict:sdd",
      },
      "false-true": {
        status: "missing-context",
        evidenceId: "schedule:calendar:missing-context:calendar",
      },
      "false-false": {},
    } as const
  )[key];
};

const contextFailureRule = (input: {
  rule: ScheduleRuleInterpretation;
  contextParameters: AjsParameter[];
  candidateResult: ScheduleDateCandidateResult;
}): ScheduleRuleInterpretation | undefined => {
  const details = contextFailureDetails(input.candidateResult);
  const status = details.status;
  const evidenceId =
    input.candidateResult.contextEvidenceId ?? details.evidenceId;
  return status
    ? cloneRule(input.rule, {
        status,
        reason: "calendar-selection",
        evidence: {
          id: evidenceId!,
          rawParameters: input.contextParameters,
          rule: input.rule.rule,
        },
      })
    : undefined;
};

const invalidCandidateRule = (input: {
  rule: ScheduleRuleInterpretation;
  startTime: ScheduleRuleInterpretation | undefined;
  candidateResult: ScheduleDateCandidateResult;
}): ScheduleRuleInterpretation | undefined =>
  input.candidateResult.invalid ||
  (input.candidateResult.candidates.length > 0 &&
    input.candidateResult.candidates.every(
      (candidate) => !toUtcDate(candidate),
    ))
    ? cloneRule(input.rule, {
        status: "invalid",
        reason: "invalid-calendar-day",
        evidence: {
          id: scheduleRuleEvidenceId({ rule: input.rule, kind: "invalid" }),
          rawParameters: [
            input.rule.parameter,
            ...startTimeParameter(input.startTime),
          ],
          rule: input.rule.rule,
        },
      })
    : undefined;

type StartTimeDecision = {
  failure?: ScheduleRuleInterpretation;
  supported?: SupportedStartTimeRule;
};

const startTimeDecision = (input: {
  rule: ScheduleRuleInterpretation;
  startTime: ScheduleRuleInterpretation | undefined;
}): StartTimeDecision => {
  const key = startTimeKind(input.startTime);
  const decisions: Record<string, StartTimeDecision> = {
    missing: {
      failure: cloneRule(input.rule, {
        status: "missing-context",
        reason: "missing-start-time",
        evidence: {
          id: scheduleRuleEvidenceId({
            rule: input.rule,
            kind: "missing-start-time",
          }),
          rawParameters: [
            input.rule.parameter,
            ...startTimeParameter(input.startTime),
          ],
          rule: input.rule.rule,
        },
      }),
    },
    unsupported: { failure: input.rule },
    supported: {
      supported: input.startTime as SupportedStartTimeRule,
    },
  };
  return decisions[key];
};

const startTimeKind = (
  startTime: ScheduleRuleInterpretation | undefined,
): "missing" | "unsupported" | "supported" => {
  if (startTime === undefined) {
    return "missing";
  }
  if (supportedStartTime(startTime)) {
    return "supported";
  }
  return "unsupported";
};

const supportedStartTime = (startTime: ScheduleRuleInterpretation): boolean =>
  startTime.status === "supported" && startTime.startTime !== undefined;

const candidatePreflight = (input: {
  rule: ScheduleRuleInterpretation;
  startTime: ScheduleRuleInterpretation | undefined;
  calendarContext: SemanticDiffScheduleCalendarContext | undefined;
  candidatePeriod: ValidSchedulePeriod;
}): DatePreflight => {
  const candidateResult = scheduleDateCandidates({
    parameter: input.rule.parameter,
    period: input.candidatePeriod,
    calendarContext: input.calendarContext,
  });
  const candidateFailure = candidateResult.deferred
    ? undefined
    : candidateFailureRule({ ...input, candidateResult });
  const startDecision = startTimeDecision(input);
  const startFailure = preflightStartFailure({
    candidateResult,
    candidateFailure,
    startFailure: startDecision.failure,
  });
  const returnedRule = preflightReturnedRule({
    rule: input.rule,
    candidateResult,
    candidateFailure,
    startFailure,
  });
  return returnedRule
    ? { kind: "return", rule: returnedRule }
    : {
        kind: "project",
        candidates: candidateResult.candidates,
        startTime: startDecision.supported!,
      };
};

const candidateFailureRule = (input: {
  rule: ScheduleRuleInterpretation;
  startTime: ScheduleRuleInterpretation | undefined;
  calendarContext: SemanticDiffScheduleCalendarContext | undefined;
  candidateResult: ScheduleDateCandidateResult;
}): ScheduleRuleInterpretation | undefined => {
  const contextParameters = [
    input.rule.parameter,
    ...(input.calendarContext?.rawParameters ?? []),
  ];
  return (
    contextFailureRule({ ...input, contextParameters }) ??
    invalidCandidateRule(input)
  );
};

const preflightStartFailure = (input: {
  candidateResult: ScheduleDateCandidateResult;
  candidateFailure: ScheduleRuleInterpretation | undefined;
  startFailure: ScheduleRuleInterpretation | undefined;
}): ScheduleRuleInterpretation | undefined => {
  if (input.candidateResult.deferred || input.candidateFailure !== undefined) {
    return undefined;
  }
  return input.startFailure;
};

const preflightReturnedRule = (input: {
  rule: ScheduleRuleInterpretation;
  candidateResult: ScheduleDateCandidateResult;
  candidateFailure: ScheduleRuleInterpretation | undefined;
  startFailure: ScheduleRuleInterpretation | undefined;
}): ScheduleRuleInterpretation | undefined =>
  input.candidateResult.deferred
    ? input.rule
    : (input.candidateFailure ?? input.startFailure);

export const datePreflight = (input: {
  rule: ScheduleRuleInterpretation;
  startTime: ScheduleRuleInterpretation | undefined;
  calendarContext: SemanticDiffScheduleCalendarContext | undefined;
  candidatePeriod: ValidSchedulePeriod;
}): DatePreflight => {
  const preparedRule =
    relativeDateOutcome(input) ?? unsupportedDateOutcome(input);
  return preparedRule
    ? { kind: "return", rule: preparedRule }
    : candidatePreflight(input);
};

const invalidAssociation = (association: SubstitutionAssociation): boolean =>
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
  context: SubstitutionContext,
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
  calendarContext: SubstitutionContext | undefined;
}): SubstitutionResolution | undefined => {
  const association = input.association;
  const context = input.calendarContext;
  const resolutions = [
    {
      when: noSubstitutionMode(association),
      resolution: { candidates: [] },
    },
    {
      when: association !== undefined && invalidAssociation(association),
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
  calendarContext: SubstitutionContext | undefined;
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
  context: SubstitutionContext;
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
    context: SubstitutionContext;
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
  result: CandidateResolution;
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
  calendarContext: SubstitutionContext | undefined;
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
