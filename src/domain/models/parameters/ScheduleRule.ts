import Day from "./Day";
import Parameter from "./Parameter";
import { ParamInternal } from "./parameter.types";
import {
  parseClosedDaySubstitutionValue,
  parseCycleValue,
  parseParentScheduleRuleValue,
  parseScheduleByDaysFromStartValue,
  parseShiftDaysValue,
  parseWaitCountValue,
  resolveEffectiveStartConditionMonitoringPair,
} from "./scheduleRuleHelpers";

interface ScheduleRule {
  get rule(): number;
}
export default ScheduleRule;

type ParsedScheduleRuleValue<T> = {
  rule: number;
  value: T;
};

abstract class ParsedScheduleRuleParameter<T>
  extends Parameter
  implements ScheduleRule
{
  _rule;
  protected _parsedValue;

  constructor(
    arg: ParamInternal,
    parseValue: (rawValue: string) => ParsedScheduleRuleValue<T> | undefined,
  ) {
    super(arg);
    const parsed = parseValue(this.value());
    if (parsed) {
      this._rule = parsed.rule;
      this._parsedValue = parsed.value;
    }
  }

  get rule() {
    return this._rule ?? 1;
  }
}

const SCHEDULE_DATE_TYPE_BY_LITERAL: Record<string, string> = {
  en: "en",
  ud: "ud",
};

const SCHEDULE_DATE_TYPE_PREFIXES = ["+", "*", "@"] as const;

const resolveScheduleDateType = (day: string | undefined): string =>
  SCHEDULE_DATE_TYPE_BY_LITERAL[day ?? ""] ??
  SCHEDULE_DATE_TYPE_PREFIXES.find((prefix) => day?.startsWith(prefix)) ??
  "";

export class Cftd extends Parameter implements ScheduleRule {
  #_rule = 1;
  #_type = "no";
  #_scheduleByDaysFromStart;
  #_maxShiftableDays;

  constructor(arg: ParamInternal) {
    super(arg);
    const parsed = parseScheduleByDaysFromStartValue(this.value());
    if (parsed) {
      this.#_rule = parsed.rule;
      this.#_type = parsed.type;
      this.#_scheduleByDaysFromStart = parsed.scheduleByDaysFromStart;
      this.#_maxShiftableDays = parsed.maxShiftableDays;
    }
  }

  get rule() {
    return this.#_rule ?? 1;
  }

  get scheduleByDaysFromStart() {
    return this.#_type === "no"
      ? "no"
      : `${this.#_type},${this.#_scheduleByDaysFromStart ?? 1}`;
  }

  get maxShiftableDays() {
    if (this.#_type && ["no", "db", "da"].includes(this.#_type)) {
      return undefined;
    }
    return this.#_maxShiftableDays ?? "10";
  }
}

export class Cy extends ParsedScheduleRuleParameter<string> {
  constructor(arg: ParamInternal) {
    super(arg, (rawValue) => {
      const parsed = parseCycleValue(rawValue);
      return parsed
        ? { rule: parsed.rule, value: parsed.value.slice(1, -1) }
        : undefined;
    });
  }

  get cycle() {
    return this._parsedValue;
  }
}

export class Ln extends ParsedScheduleRuleParameter<string> {
  constructor(arg: ParamInternal) {
    super(arg, parseParentScheduleRuleValue);
  }

  get parentRule() {
    return this._parsedValue;
  }
}

export class Sd extends Day implements ScheduleRule {
  get rule() {
    return this._rule ?? 1;
  }

  get type() {
    return resolveScheduleDateType(this._day);
  }

  get yearMonth() {
    if (this._yearMonth) {
      return this._yearMonth.substring(0, this._yearMonth.length - 1);
    }
    return this._yearMonth;
  }

  get day() {
    if (this._day !== "en" && this._day !== "ud") {
      return this._day?.replace(/^[+*@]/, "");
    }
    return undefined;
  }
}
export class Sh extends ParsedScheduleRuleParameter<string> {
  constructor(arg: ParamInternal) {
    super(arg, parseClosedDaySubstitutionValue);
  }

  get substitute() {
    return this._parsedValue;
  }
}

export class Shd extends ParsedScheduleRuleParameter<string> {
  constructor(arg: ParamInternal) {
    super(arg, parseShiftDaysValue);
  }

  get shiftDays() {
    return this._parsedValue ?? "2";
  }
}

export class Wc extends ParsedScheduleRuleParameter<string> {
  constructor(arg: ParamInternal) {
    super(arg, parseWaitCountValue);
  }

  get numberOfTimes() {
    return this._parsedValue ?? "1";
  }

  effectiveNumberOfTimes(
    waitTimeRawValue: string | undefined,
  ): string | undefined {
    return resolveEffectiveStartConditionMonitoringPair(
      this.value(),
      waitTimeRawValue,
    ).numberOfTimes;
  }
}
