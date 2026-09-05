import type { AjsParameter } from "../../models/ajs/AjsDocument";
import { interpretScheduleDateValue } from "../../models/parameters/scheduleDateInterpreter";
import {
  parseClosedDaySubstitutionValue,
  parseShiftDaysValue,
} from "../../models/parameters/scheduleRuleHelpers";
import type {
  SemanticDiffComparisonPeriod,
  SemanticDiffScheduleRun,
} from "../../models/semantic-diff/SemanticDiff";
import type {
  SemanticDiffScheduleInterpretation,
  SemanticDiffScheduleProjection,
  SemanticDiffScheduleProjectionInput,
  SemanticDiffScheduleRuleInterpretation,
} from "./semanticDiffScheduleTypes";
import {
  classifyScheduleCalendarDay,
  operationalMonthDate,
  operationalMonthLength,
  isFullyQualifiedRelativeScheduleDate,
  isSyntacticallyInvalidRelativeScheduleDate,
  relativeScheduleDateRequiresContext,
  resolveOperationalMonth,
  type SemanticDiffScheduleCalendarContext,
} from "./semanticDiffScheduleCalendarContext";

type ValidPeriod = { from: Date; to: Date };

type SubstitutionMode = "be" | "af" | "ca" | "no";

type ParsedSubstitutionRule = {
  interpretationRule: SemanticDiffScheduleRuleInterpretation;
  value: SubstitutionMode;
  rule: number;
};

type ParsedShiftDaysRule = {
  interpretationRule: SemanticDiffScheduleRuleInterpretation;
  value: number;
  rule: number;
  rawValue?: string;
};

type SubstitutionAssociation = {
  sh: ParsedSubstitutionRule[];
  invalidSh: SemanticDiffScheduleRuleInterpretation[];
  shd: ParsedShiftDaysRule[];
  invalidShiftDays: ParsedShiftDaysRule[];
  mode?: SubstitutionMode;
  modeConflict: boolean;
  shiftDays?: number;
  shiftDaysConflict: boolean;
};

type SubstitutionRuleState = {
  status: SemanticDiffScheduleRuleInterpretation["status"];
  reason?: SemanticDiffScheduleRuleInterpretation["reason"];
  evidenceId: string;
  rawParameters: AjsParameter[];
  rule?: number;
};

type SubstitutionResolution = {
  candidates: string[];
  contextStatus?: "invalid" | "missing-context";
  contextEvidenceId?: string;
};

type DateCandidateResult = {
  candidates: string[];
  invalid: boolean;
  deferred: boolean;
  contextInvalid?: boolean;
  contextMissing?: boolean;
  contextEvidenceId?: string;
};

const createGregorianDate = (
  year: number,
  monthIndex: number,
  day: number,
): Date => {
  const date = new Date(Date.UTC(1970, 0, 1));
  date.setUTCFullYear(year, monthIndex, day);
  return date;
};

const toUtcDate = (value: string): Date | undefined => {
  const matched = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!matched) {
    return undefined;
  }
  const year = Number(matched[1]);
  const month = Number(matched[2]);
  const day = Number(matched[3]);
  const date = createGregorianDate(year, month - 1, day);
  return date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
    ? date
    : undefined;
};

const daysInGregorianMonth = (
  year: number,
  month: number,
): number | undefined => {
  if (month < 1 || month > 12) {
    return undefined;
  }
  const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  return [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][
    month - 1
  ];
};

const formatDate = (year: number, month: number, day: number): string =>
  `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

const relativeDateCandidates = (
  parsed: NonNullable<ReturnType<typeof interpretScheduleDateValue>>,
  context: SemanticDiffScheduleCalendarContext,
): DateCandidateResult => {
  if (parsed.year === undefined || parsed.month === undefined) {
    return { candidates: [], invalid: false, deferred: true };
  }
  if (parsed.month < 1 || parsed.month > 12) {
    return { candidates: [], invalid: true, deferred: false };
  }
  const operationalMonth = resolveOperationalMonth(
    context,
    parsed.year,
    parsed.month,
  );
  if (!operationalMonth) {
    return {
      candidates: [],
      invalid: true,
      deferred: false,
      contextInvalid: true,
    };
  }
  const length = operationalMonthLength(operationalMonth);
  const classify = (
    offset: number,
  ):
    | "open"
    | "closed"
    | { status: "missing-context" | "invalid"; evidenceId: string } => {
    const result = classifyScheduleCalendarDay(
      context,
      operationalMonthDate(operationalMonth, offset),
    );
    return "evidenceId" in result
      ? { status: result.status, evidenceId: result.evidenceId }
      : result.status;
  };
  if (parsed.day.kind === "open" || parsed.day.kind === "closed") {
    const kind = parsed.day.kind;
    const count = parsed.day.value;
    const countOffsets = Array.from({ length }, (_, offset) => offset);
    const found = (() => {
      let qualifying = 0;
      for (const offset of countOffsets) {
        const classification = classify(offset);
        if (typeof classification !== "string") {
          return classification.status === "invalid"
            ? {
                candidates: [],
                invalid: true,
                deferred: false,
                contextInvalid: true,
                contextEvidenceId: classification.evidenceId,
              }
            : {
                candidates: [],
                invalid: false,
                deferred: false,
                contextMissing: true,
                contextEvidenceId: classification.evidenceId,
              };
        }
        if (classification === kind) {
          qualifying += 1;
          if (qualifying === count) {
            const date = operationalMonthDate(operationalMonth, offset);
            return {
              candidates: [
                formatDate(
                  date.getUTCFullYear(),
                  date.getUTCMonth() + 1,
                  date.getUTCDate(),
                ),
              ],
              invalid: false,
              deferred: false,
            };
          }
        }
      }
      return { candidates: [], invalid: false, deferred: false };
    })();
    return found;
  }
  if (
    parsed.day.kind === "backward" &&
    (parsed.day.prefix === "*" || parsed.day.prefix === "@")
  ) {
    const kind = parsed.day.prefix === "*" ? "open" : "closed";
    const targetOffset = parsed.day.offset ?? 0;
    let qualifying = 0;
    for (let offset = length - 1; offset >= 0; offset -= 1) {
      const classification = classify(offset);
      if (typeof classification !== "string") {
        return classification.status === "invalid"
          ? {
              candidates: [],
              invalid: true,
              deferred: false,
              contextInvalid: true,
              contextEvidenceId: classification.evidenceId,
            }
          : {
              candidates: [],
              invalid: false,
              deferred: false,
              contextMissing: true,
              contextEvidenceId: classification.evidenceId,
            };
      }
      if (classification === kind) {
        if (qualifying === targetOffset) {
          const date = operationalMonthDate(operationalMonth, offset);
          return {
            candidates: [
              formatDate(
                date.getUTCFullYear(),
                date.getUTCMonth() + 1,
                date.getUTCDate(),
              ),
            ],
            invalid: false,
            deferred: false,
          };
        }
        qualifying += 1;
      }
    }
    return { candidates: [], invalid: false, deferred: false };
  }
  if (parsed.day.kind === "relative") {
    const offset = parsed.day.value - 1;
    return offset < 0 || offset >= length
      ? { candidates: [], invalid: true, deferred: false }
      : {
          candidates: [
            formatDate(
              operationalMonthDate(operationalMonth, offset).getUTCFullYear(),
              operationalMonthDate(operationalMonth, offset).getUTCMonth() + 1,
              operationalMonthDate(operationalMonth, offset).getUTCDate(),
            ),
          ],
          invalid: false,
          deferred: false,
        };
  }
  if (parsed.day.kind === "backward" && parsed.day.prefix === "+") {
    const offset = parsed.day.offset ?? 0;
    return offset < 0 || offset >= length
      ? { candidates: [], invalid: true, deferred: false }
      : {
          candidates: [
            formatDate(
              operationalMonthDate(
                operationalMonth,
                length - 1 - offset,
              ).getUTCFullYear(),
              operationalMonthDate(
                operationalMonth,
                length - 1 - offset,
              ).getUTCMonth() + 1,
              operationalMonthDate(
                operationalMonth,
                length - 1 - offset,
              ).getUTCDate(),
            ),
          ],
          invalid: false,
          deferred: false,
        };
  }
  if (parsed.day.kind === "weekday" && parsed.day.prefix === "+") {
    const weekday = ["su", "mo", "tu", "we", "th", "fr", "sa"].indexOf(
      parsed.day.weekday,
    );
    const matchingDates = Array.from({ length }, (_, offset) =>
      operationalMonthDate(operationalMonth, offset),
    ).filter((date) => date.getUTCDay() === weekday);
    if (parsed.day.occurrence === "b") {
      const date = matchingDates.at(-1);
      return date
        ? {
            candidates: [
              formatDate(
                date.getUTCFullYear(),
                date.getUTCMonth() + 1,
                date.getUTCDate(),
              ),
            ],
            invalid: false,
            deferred: false,
          }
        : { candidates: [], invalid: false, deferred: false };
    }
    const occurrence = parsed.day.occurrence ?? 1;
    if (occurrence < 1 || occurrence > 5) {
      return { candidates: [], invalid: true, deferred: false };
    }
    const date = matchingDates[occurrence - 1];
    return date
      ? {
          candidates: [
            formatDate(
              date.getUTCFullYear(),
              date.getUTCMonth() + 1,
              date.getUTCDate(),
            ),
          ],
          invalid: false,
          deferred: false,
        }
      : { candidates: [], invalid: false, deferred: false };
  }
  return { candidates: [], invalid: false, deferred: true };
};

const dateCandidates = (
  parameter: AjsParameter,
  period: ValidPeriod,
  calendarContext?: SemanticDiffScheduleCalendarContext,
): DateCandidateResult => {
  const parsed = interpretScheduleDateValue(parameter.value);
  if (!parsed) {
    return { candidates: [], invalid: true, deferred: false };
  }

  if (relativeScheduleDateRequiresContext(parsed)) {
    return calendarContext
      ? relativeDateCandidates(parsed, calendarContext)
      : { candidates: [], invalid: false, deferred: true };
  }

  if (
    parsed.year !== undefined &&
    parsed.month !== undefined &&
    parsed.day.kind === "backward" &&
    parsed.day.prefix === undefined
  ) {
    const days = daysInGregorianMonth(parsed.year, parsed.month);
    const offset = parsed.day.offset ?? 0;
    if (days === undefined || offset < 0 || offset >= days) {
      return { candidates: [], invalid: true, deferred: false };
    }
    return {
      candidates: [formatDate(parsed.year, parsed.month, days - offset)],
      invalid: false,
      deferred: false,
    };
  }

  if (
    parsed.year !== undefined &&
    parsed.month !== undefined &&
    parsed.day.kind === "weekday" &&
    parsed.day.prefix === ""
  ) {
    const days = daysInGregorianMonth(parsed.year, parsed.month);
    if (days === undefined) {
      return { candidates: [], invalid: true, deferred: false };
    }
    const weekday = ["su", "mo", "tu", "we", "th", "fr", "sa"].indexOf(
      parsed.day.weekday,
    );
    const firstWeekday = createGregorianDate(
      parsed.year,
      parsed.month - 1,
      1,
    ).getUTCDay();
    if (parsed.day.occurrence === "b") {
      const lastWeekday = createGregorianDate(
        parsed.year,
        parsed.month - 1,
        days,
      ).getUTCDay();
      const day = days - ((lastWeekday - weekday + 7) % 7);
      return {
        candidates: [formatDate(parsed.year, parsed.month, day)],
        invalid: false,
        deferred: false,
      };
    }
    const occurrence = parsed.day.occurrence ?? 1;
    if (occurrence < 1 || occurrence > 5) {
      return { candidates: [], invalid: true, deferred: false };
    }
    const day = 1 + ((weekday - firstWeekday + 7) % 7) + (occurrence - 1) * 7;
    return day > days
      ? { candidates: [], invalid: false, deferred: false }
      : {
          candidates: [formatDate(parsed.year, parsed.month, day)],
          invalid: false,
          deferred: false,
        };
  }

  if (parsed.day.kind !== "calendar") {
    return { candidates: [], invalid: false, deferred: true };
  }
  const day = String(parsed.day.value).padStart(2, "0");
  if (parsed.year !== undefined && parsed.month !== undefined) {
    return {
      candidates: [
        `${String(parsed.year).padStart(4, "0")}-${String(parsed.month).padStart(2, "0")}-${day}`,
      ],
      invalid: false,
      deferred: false,
    };
  }
  const years = Array.from(
    { length: period.to.getUTCFullYear() - period.from.getUTCFullYear() + 1 },
    (_, index) => period.from.getUTCFullYear() + index,
  );
  if (parsed.month !== undefined) {
    return {
      candidates: years.map(
        (year) => `${year}-${String(parsed.month).padStart(2, "0")}-${day}`,
      ),
      invalid: false,
      deferred: false,
    };
  }
  return {
    candidates: years.flatMap((year) =>
      Array.from(
        { length: 12 },
        (_, index) => `${year}-${String(index + 1).padStart(2, "0")}-${day}`,
      ),
    ),
    invalid: false,
    deferred: false,
  };
};

const resolveSubstitutedCandidates = (
  candidates: string[],
  association: SubstitutionAssociation | undefined,
  calendarContext: SemanticDiffScheduleCalendarContext | undefined,
): SubstitutionResolution => {
  if (!association || !association.mode || association.mode === "no") {
    return { candidates: [] };
  }
  if (
    association.modeConflict ||
    association.invalidSh.length > 0 ||
    association.shiftDaysConflict ||
    association.invalidShiftDays.length > 0
  ) {
    return { candidates: [] };
  }
  if (!calendarContext) {
    return { candidates: [], contextStatus: "missing-context" };
  }
  if (calendarContext.status !== "supported") {
    return {
      candidates: [],
      contextStatus: calendarContext.status,
      contextEvidenceId: calendarContext.evidenceId,
    };
  }
  const shiftDays = association.shiftDays ?? 2;
  const resolved: string[] = [];
  const classify = (
    date: Date,
  ):
    | "open"
    | "closed"
    | { status: "invalid" | "missing-context"; evidenceId: string } => {
    const result = classifyScheduleCalendarDay(calendarContext, date);
    return "evidenceId" in result
      ? { status: result.status, evidenceId: result.evidenceId }
      : result.status;
  };
  for (const candidate of candidates) {
    const baseDate = toUtcDate(candidate);
    if (!baseDate) {
      continue;
    }
    const baseClassification = classify(baseDate);
    if (typeof baseClassification === "string") {
      if (association.mode === "ca") {
        if (baseClassification === "open") {
          resolved.push(candidate);
        }
        continue;
      }
      if (baseClassification === "open") {
        resolved.push(candidate);
        continue;
      }
      for (let offset = 1; offset <= shiftDays; offset += 1) {
        const direction = association.mode === "be" ? -1 : 1;
        const shiftedDate = addUtcDays(baseDate, direction * offset);
        const shiftedClassification = classify(shiftedDate);
        if (typeof shiftedClassification !== "string") {
          return {
            candidates: [],
            contextStatus:
              shiftedClassification.status === "invalid"
                ? "invalid"
                : "missing-context",
            contextEvidenceId: shiftedClassification.evidenceId,
          };
        }
        if (shiftedClassification === "open") {
          resolved.push(
            formatDate(
              shiftedDate.getUTCFullYear(),
              shiftedDate.getUTCMonth() + 1,
              shiftedDate.getUTCDate(),
            ),
          );
          break;
        }
      }
      continue;
    }
    return {
      candidates: [],
      contextStatus:
        baseClassification.status === "invalid" ? "invalid" : "missing-context",
      contextEvidenceId: baseClassification.evidenceId,
    };
  }
  return { candidates: resolved };
};

const parsePeriod = (
  period: SemanticDiffComparisonPeriod,
): ValidPeriod | undefined => {
  const from = toUtcDate(period.from);
  const to = toUtcDate(period.to);
  return from && to && from < to ? { from, to } : undefined;
};

const addUtcDays = (date: Date, days: number): Date =>
  new Date(date.getTime() + days * 86_400_000);

const substitutionState = (input: {
  status: SubstitutionRuleState["status"];
  reason?: SubstitutionRuleState["reason"];
  evidenceId: string;
  rawParameters: AjsParameter[];
  rule?: number;
}): SubstitutionRuleState => ({
  status: input.status,
  ...(input.reason === undefined ? {} : { reason: input.reason }),
  evidenceId: input.evidenceId,
  rawParameters: [...input.rawParameters],
  ...(input.rule === undefined ? {} : { rule: input.rule }),
});

const createSubstitutionAnalysis = (
  interpretation: SemanticDiffScheduleInterpretation,
): {
  associations: Map<number, SubstitutionAssociation>;
  states: Map<SemanticDiffScheduleRuleInterpretation, SubstitutionRuleState>;
  fullyQualifiedDateRules: Set<number>;
} => {
  const associations = new Map<number, SubstitutionAssociation>();
  const states = new Map<
    SemanticDiffScheduleRuleInterpretation,
    SubstitutionRuleState
  >();
  const associationFor = (rule: number): SubstitutionAssociation => {
    const existing = associations.get(rule);
    if (existing) {
      return existing;
    }
    const created: SubstitutionAssociation = {
      sh: [],
      invalidSh: [],
      shd: [],
      invalidShiftDays: [],
      modeConflict: false,
      shiftDaysConflict: false,
    };
    associations.set(rule, created);
    return created;
  };

  interpretation.rules.forEach((rule) => {
    if (rule.parameter.key === "sh") {
      const parsed = parseClosedDaySubstitutionValue(rule.parameter.value);
      if (!parsed) {
        const rawRule = /^(\d{1,3}),/.exec(rule.parameter.value)?.[1];
        associationFor(
          rawRule === undefined ? 1 : Number(rawRule),
        ).invalidSh.push(rule);
        states.set(
          rule,
          substitutionState({
            status: "invalid",
            reason: "closed-day-substitution",
            evidenceId: `schedule:sh:invalid:${rule.parameter.value}`,
            rawParameters: [rule.parameter],
          }),
        );
        return;
      }
      associationFor(parsed.rule).sh.push({
        interpretationRule: rule,
        value: parsed.value as SubstitutionMode,
        rule: parsed.rule,
      });
    }
    if (rule.parameter.key === "shd") {
      const parsed = parseShiftDaysValue(rule.parameter.value);
      if (!parsed) {
        const rawRule = /^(\d{1,3}),/.exec(rule.parameter.value)?.[1];
        associationFor(
          rawRule === undefined ? 1 : Number(rawRule),
        ).invalidShiftDays.push({
          interpretationRule: rule,
          value: Number.NaN,
          rule: rawRule === undefined ? 1 : Number(rawRule),
          ...(rawRule === undefined ? { rawValue: rule.parameter.value } : {}),
        });
        states.set(
          rule,
          substitutionState({
            status: "invalid",
            reason: "shift-days",
            evidenceId: `schedule:shd:invalid:${rule.parameter.value}`,
            rawParameters: [rule.parameter],
          }),
        );
        return;
      }
      const value = Number(parsed.value);
      const association = associationFor(parsed.rule);
      const parsedRule: ParsedShiftDaysRule = {
        interpretationRule: rule,
        value,
        rule: parsed.rule,
      };
      if (value < 1 || value > 31) {
        association.invalidShiftDays.push(parsedRule);
        states.set(
          rule,
          substitutionState({
            status: "invalid",
            reason: "shift-days",
            evidenceId: `schedule:shd:invalid:${parsed.rule}`,
            rawParameters: [rule.parameter],
            rule: parsed.rule,
          }),
        );
        return;
      }
      association.shd.push(parsedRule);
    }
  });

  const dateRules = new Set(
    interpretation.scheduleDateRules
      .map((rule) => rule.rule)
      .filter((rule): rule is number => rule !== undefined),
  );
  const fullyQualifiedDateRules = new Set(
    interpretation.scheduleDateRules
      .filter(
        (rule) =>
          rule.date?.year !== undefined && rule.date.month !== undefined,
      )
      .map((rule) => rule.rule)
      .filter((rule): rule is number => rule !== undefined),
  );
  associations.forEach((association, ruleNumber) => {
    const modeValues = new Set(association.sh.map((rule) => rule.value));
    association.modeConflict = modeValues.size > 1;
    association.mode = modeValues.values().next().value as
      | SubstitutionMode
      | undefined;
    const shiftValues = new Set(association.shd.map((rule) => rule.value));
    association.shiftDaysConflict = shiftValues.size > 1;
    association.shiftDays = shiftValues.values().next().value;
    const rawParameters = [
      ...association.sh.map((rule) => rule.interpretationRule.parameter),
      ...association.invalidSh.map((rule) => rule.parameter),
      ...association.shd.map((rule) => rule.interpretationRule.parameter),
      ...association.invalidShiftDays.map(
        (rule) => rule.interpretationRule.parameter,
      ),
    ];
    association.sh.forEach((rule) => {
      const invalid =
        association.modeConflict ||
        association.invalidSh.length > 0 ||
        (association.mode !== "no" && !dateRules.has(ruleNumber));
      const unsupportedUnqualifiedDate =
        !invalid &&
        association.mode !== "no" &&
        !fullyQualifiedDateRules.has(ruleNumber);
      const status = invalid
        ? "invalid"
        : association.mode === "no"
          ? "missing-context"
          : unsupportedUnqualifiedDate
            ? "unsupported"
            : "supported";
      states.set(
        rule.interpretationRule,
        substitutionState({
          status,
          ...(status !== "supported"
            ? { reason: "closed-day-substitution" as const }
            : {}),
          evidenceId:
            status === "invalid"
              ? `schedule:sh:invalid:${ruleNumber}`
              : status === "missing-context"
                ? `schedule:sh:missing-context:${ruleNumber}`
                : status === "unsupported"
                  ? `schedule:sh:unsupported:${ruleNumber}`
                  : "JP1-PARAM-SCHEDULE-SHIFT-001",
          rawParameters,
          rule: ruleNumber,
        }),
      );
    });
    association.shd.forEach((rule) => {
      const invalid =
        association.shiftDaysConflict || association.sh.length === 0;
      const unsupportedUnqualifiedDate =
        !invalid &&
        association.mode !== "no" &&
        !fullyQualifiedDateRules.has(ruleNumber);
      const status = invalid
        ? "invalid"
        : unsupportedUnqualifiedDate
          ? "unsupported"
          : "supported";
      states.set(
        rule.interpretationRule,
        substitutionState({
          status,
          ...(status !== "supported" ? { reason: "shift-days" as const } : {}),
          evidenceId:
            status === "invalid"
              ? `schedule:shd:invalid:${ruleNumber}`
              : status === "unsupported"
                ? `schedule:shd:unsupported:${ruleNumber}`
                : "JP1-PARAM-SCHEDULE-SHIFT-001",
          rawParameters,
          rule: ruleNumber,
        }),
      );
    });
    association.invalidShiftDays.forEach((rule) => {
      states.set(
        rule.interpretationRule,
        substitutionState({
          status: "invalid",
          reason: "shift-days",
          evidenceId: `schedule:shd:invalid:${rule.rawValue ?? ruleNumber}`,
          rawParameters,
          rule: ruleNumber,
        }),
      );
    });
  });

  return { associations, states, fullyQualifiedDateRules };
};

const projectedDateEvidenceId = (
  rule: SemanticDiffScheduleRuleInterpretation,
  runs: SemanticDiffScheduleRun[],
): string => {
  if (rule.evidence.id.startsWith("JP1-PARAM-SCHEDULE-")) {
    return rule.evidence.id;
  }
  return `schedule:sd:${runs.length === 0 ? "no-runs" : "supported"}:${rule.rule ?? 1}`;
};

const invalidDateEvidenceId = (
  rule: SemanticDiffScheduleRuleInterpretation,
): string =>
  rule.evidence.id.startsWith("JP1-PARAM-SCHEDULE-")
    ? rule.evidence.id
    : `schedule:sd:invalid-calendar-day:${rule.rule ?? rule.parameter.value}`;

const isWithin = (date: Date, period: ValidPeriod): boolean =>
  date >= period.from && date < period.to;

const statusForRules = (
  rules: SemanticDiffScheduleRuleInterpretation[],
  hasRuleZeroUndefined: boolean,
): "complete" | "partial" | "none" => {
  if (hasRuleZeroUndefined) {
    return "complete";
  }
  const scheduleDateRules = rules.filter((rule) => rule.parameter.key === "sd");
  if (scheduleDateRules.length === 0) {
    return "none";
  }
  if (
    rules.every(
      (rule) => rule.status === "supported" || rule.status === "no-runs",
    )
  ) {
    return "complete";
  }
  return scheduleDateRules.some(
    (rule) => rule.status === "supported" || rule.status === "no-runs",
  )
    ? "partial"
    : "none";
};

const cloneRule = (
  rule: SemanticDiffScheduleRuleInterpretation,
  patch: Partial<SemanticDiffScheduleRuleInterpretation>,
): SemanticDiffScheduleRuleInterpretation => ({ ...rule, ...patch });

const effectiveScheduleRuleNumber = (
  rule: SemanticDiffScheduleRuleInterpretation,
): number =>
  rule.rule ?? Number(/^(\d{1,3}),/.exec(rule.parameter.value)?.[1] ?? "1");

/** Project one interpreted unit over a validated, half-open period. */
export function projectScheduleRuns(
  input: SemanticDiffScheduleProjectionInput,
): SemanticDiffScheduleProjection;
export function projectScheduleRuns(
  interpretation: SemanticDiffScheduleInterpretation,
  period: SemanticDiffComparisonPeriod,
): SemanticDiffScheduleProjection;
export function projectScheduleRuns(
  inputOrInterpretation:
    | SemanticDiffScheduleProjectionInput
    | SemanticDiffScheduleInterpretation,
  periodInput?: SemanticDiffComparisonPeriod,
): SemanticDiffScheduleProjection {
  const interpretation =
    "interpretation" in inputOrInterpretation
      ? inputOrInterpretation.interpretation
      : inputOrInterpretation;
  const period =
    "interpretation" in inputOrInterpretation
      ? inputOrInterpretation.period
      : periodInput;
  const calendarContext =
    "interpretation" in inputOrInterpretation
      ? inputOrInterpretation.calendarContext
      : undefined;
  if (!period) {
    return {
      unit: interpretation.unit,
      status: "invalid",
      completeness: "none",
      runs: [],
      rules: interpretation.rules,
      evidence: interpretation.rules.map((rule) => rule.evidence),
    };
  }
  const parsedPeriod = parsePeriod(period);
  if (!parsedPeriod) {
    return {
      unit: interpretation.unit,
      status: "invalid",
      completeness: "none",
      runs: [],
      rules: interpretation.rules,
      evidence: interpretation.rules.map((rule) => rule.evidence),
    };
  }
  if (interpretation.hasRuleZeroUndefined) {
    return {
      unit: interpretation.unit,
      status: "no-runs",
      completeness: "complete",
      runs: [],
      rules: interpretation.rules,
      evidence: interpretation.rules.map((rule) => rule.evidence),
    };
  }

  const startTimes = new Map<number, SemanticDiffScheduleRuleInterpretation>();
  interpretation.startTimeRules.forEach((rule) => {
    // The first definition remains effective.  Keep an invalid first value in
    // the map as well, so a later duplicate cannot silently become effective.
    if (rule.rule !== undefined && !startTimes.has(rule.rule)) {
      startTimes.set(rule.rule, rule);
    }
  });
  const { associations, states, fullyQualifiedDateRules } =
    createSubstitutionAnalysis(interpretation);
  const hasSubstitution = [...associations.entries()].some(
    ([ruleNumber, association]) =>
      fullyQualifiedDateRules.has(ruleNumber) &&
      association.sh.some((rule) => rule.value !== "no"),
  );
  const candidatePeriod = hasSubstitution
    ? {
        from: addUtcDays(parsedPeriod.from, -31),
        to: addUtcDays(parsedPeriod.to, 31),
      }
    : parsedPeriod;
  const unresolvedWholeRules = new Set(
    interpretation.rules
      .filter(
        (rule) => rule.parameter.key === "cy" || rule.parameter.key === "cftd",
      )
      .map(effectiveScheduleRuleNumber),
  );
  const projectedRuleRuns: SemanticDiffScheduleRun[][] = [];
  const updateSubstitutionContextState = (
    association: SubstitutionAssociation,
    status: "invalid" | "missing-context",
    calendarRawParameters: AjsParameter[],
  ): void => {
    association.sh.forEach((substitutionRule) => {
      const current = states.get(substitutionRule.interpretationRule);
      if (!current || current.status !== "supported") {
        return;
      }
      states.set(
        substitutionRule.interpretationRule,
        substitutionState({
          status,
          reason: "closed-day-substitution",
          evidenceId: `schedule:sh:${status}:${substitutionRule.rule}`,
          rawParameters: [...current.rawParameters, ...calendarRawParameters],
          rule: substitutionRule.rule,
        }),
      );
    });
  };
  const projectedRules = interpretation.rules.map((rule, ruleIndex) => {
    if (rule.parameter.key === "jc" && calendarContext) {
      const selection = calendarContext.selection;
      return cloneRule(rule, {
        status: selection.status,
        reason:
          selection.status === "supported" ? undefined : "calendar-selection",
        evidence: {
          id: selection.evidenceId,
          rawParameters: [...selection.rawParameters],
          rule: rule.rule,
        },
      });
    }
    const substitution = states.get(rule);
    if (substitution) {
      return cloneRule(rule, {
        status: substitution.status,
        reason: substitution.reason,
        evidence: {
          id: substitution.evidenceId,
          rawParameters: [...substitution.rawParameters],
          rule: substitution.rule,
        },
      });
    }
    if (rule.parameter.key !== "sd" || !rule.date) {
      return rule;
    }
    const startTime = startTimes.get(rule.rule ?? 1);
    if (relativeScheduleDateRequiresContext(rule.date)) {
      if (isSyntacticallyInvalidRelativeScheduleDate(rule.date)) {
        return cloneRule(rule, {
          status: "invalid",
          reason: "invalid-calendar-day",
          evidence: {
            id: invalidDateEvidenceId(rule),
            rawParameters: [
              rule.parameter,
              ...(startTime?.parameter ? [startTime.parameter] : []),
            ],
            rule: rule.rule,
          },
        });
      }
      // Omitted year/month relative forms are not promoted by this slice.
      if (!isFullyQualifiedRelativeScheduleDate(rule.date)) {
        return rule;
      }
      if (!calendarContext) {
        return rule;
      }
      if (calendarContext.status !== "supported") {
        return cloneRule(rule, {
          status: calendarContext.status,
          reason: "calendar-selection",
          evidence: {
            id: calendarContext.evidenceId,
            rawParameters: [rule.parameter, ...calendarContext.rawParameters],
            rule: rule.rule,
          },
        });
      }
    } else if (rule.status !== "supported") {
      return rule;
    }
    const candidateResult = dateCandidates(
      rule.parameter,
      candidatePeriod,
      calendarContext,
    );
    const candidates = candidateResult.candidates;
    if (candidateResult.deferred) {
      return rule;
    }
    if (candidateResult.contextInvalid) {
      return cloneRule(rule, {
        status: "invalid",
        reason: "calendar-selection",
        evidence: {
          id:
            candidateResult.contextEvidenceId ??
            "schedule:calendar:invalid-base-or-conflict:sdd",
          rawParameters: [
            rule.parameter,
            ...(calendarContext?.rawParameters ?? []),
          ],
          rule: rule.rule,
        },
      });
    }
    if (candidateResult.contextMissing) {
      return cloneRule(rule, {
        status: "missing-context",
        reason: "calendar-selection",
        evidence: {
          id:
            candidateResult.contextEvidenceId ??
            "schedule:calendar:missing-context:calendar",
          rawParameters: [
            rule.parameter,
            ...(calendarContext?.rawParameters ?? []),
          ],
          rule: rule.rule,
        },
      });
    }
    if (
      candidateResult.invalid ||
      (candidates.length > 0 &&
        candidates.every((candidate) => !toUtcDate(candidate)))
    ) {
      return cloneRule(rule, {
        status: "invalid",
        reason: "invalid-calendar-day",
        evidence: {
          id: invalidDateEvidenceId(rule),
          rawParameters: [
            rule.parameter,
            ...(startTime?.parameter ? [startTime.parameter] : []),
          ],
          rule: rule.rule,
        },
      });
    }
    if (!startTime) {
      return cloneRule(rule, {
        status: "missing-context",
        reason: "missing-start-time",
        evidence: {
          id: rule.evidence.id.startsWith("JP1-PARAM-SCHEDULE-")
            ? rule.evidence.id
            : `schedule:sd:missing-start-time:${rule.rule ?? 1}`,
          rawParameters: [
            rule.parameter,
            ...(startTime?.parameter ? [startTime.parameter] : []),
          ],
          rule: rule.rule,
        },
      });
    }
    if (startTime.status !== "supported" || !startTime.startTime) {
      // The date is independently valid; retain its domain evidence and let
      // the invalid start-time rule carry the legacy unsupported item.
      return rule;
    }
    const association = associations.get(rule.rule ?? 1);
    let projectedCandidates = candidates;
    if (association?.invalidSh.length) {
      projectedCandidates = [];
    } else if (association?.mode === "no") {
      projectedCandidates = [];
    } else if (association?.mode) {
      const fullyQualifiedDate =
        rule.date?.year !== undefined && rule.date.month !== undefined;
      if (!fullyQualifiedDate) {
        // The legacy MM/DD and DD forms remain direct-date compatibility
        // behavior, but closed-day substitution is only defined for fully
        // qualified Gregorian schedule dates in this slice.
        projectedCandidates = candidates;
      } else if (unresolvedWholeRules.has(rule.rule ?? 1)) {
        projectedCandidates = [];
      } else {
        const substitutionResult = resolveSubstitutedCandidates(
          candidates,
          association,
          calendarContext,
        );
        if (substitutionResult.contextStatus) {
          updateSubstitutionContextState(
            association,
            substitutionResult.contextStatus,
            calendarContext?.rawParameters ?? [],
          );
        }
        projectedCandidates = substitutionResult.candidates;
      }
    }
    const runs = projectedCandidates
      .map((candidate) => ({ date: candidate, parsed: toUtcDate(candidate) }))
      .filter(
        (candidate): candidate is { date: string; parsed: Date } =>
          candidate.parsed !== undefined &&
          isWithin(candidate.parsed, parsedPeriod),
      )
      .map(({ date }) => ({
        unitPath: interpretation.unit.absolutePath,
        unitName: interpretation.unit.name,
        rule: rule.rule ?? 1,
        date,
        time: startTime.startTime!.value,
      }));
    projectedRuleRuns[ruleIndex] = runs;
    return cloneRule(rule, {
      status: runs.length === 0 ? "no-runs" : "supported",
      reason: undefined,
      evidence: {
        id: projectedDateEvidenceId(rule, runs),
        rawParameters: [
          rule.parameter,
          startTime.parameter,
          ...(relativeScheduleDateRequiresContext(rule.date)
            ? (calendarContext?.rawParameters ?? [])
            : []),
          ...(association
            ? [
                ...(calendarContext?.rawParameters ?? []),
                ...association.sh.map(
                  (substitutionRule) =>
                    substitutionRule.interpretationRule.parameter,
                ),
                ...association.invalidSh.map(
                  (invalidRule) => invalidRule.parameter,
                ),
                ...association.shd.map(
                  (shiftRule) => shiftRule.interpretationRule.parameter,
                ),
                ...association.invalidShiftDays.map(
                  (shiftRule) => shiftRule.interpretationRule.parameter,
                ),
              ]
            : []),
        ],
        rule: rule.rule,
      },
    });
  });

  const runs: SemanticDiffScheduleRun[] = [];
  projectedRuleRuns.forEach((ruleRuns) => runs.push(...ruleRuns));
  const completeness = statusForRules(projectedRules, false);
  const status =
    completeness === "complete"
      ? runs.length === 0
        ? "no-runs"
        : "supported"
      : completeness === "partial"
        ? "supported"
        : projectedRules.some((rule) => rule.status === "invalid")
          ? "invalid"
          : projectedRules.some((rule) => rule.status === "missing-context")
            ? "missing-context"
            : "unsupported";
  return {
    unit: interpretation.unit,
    status,
    completeness,
    runs,
    rules: projectedRules,
    evidence: projectedRules.map((rule) => rule.evidence),
  };
}
