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
} from "./scheduleRuleHelpers";

interface ScheduleRule {
  get rule(): number;
}
export default ScheduleRule;

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

export class Cy extends Parameter implements ScheduleRule {
  _rule;
  _cycle;

  constructor(arg: ParamInternal) {
    super(arg);
    const parsed = parseCycleValue(this.value());
    if (parsed) {
      this._rule = parsed.rule;
      this._cycle = parsed.value.slice(1, -1);
    }
  }

  get rule() {
    return this._rule ?? 1;
  }

  get cycle() {
    return this._cycle;
  }
}

export class Ln extends Parameter implements ScheduleRule {
  _rule;
  _parentRule;

  constructor(arg: ParamInternal) {
    super(arg);
    const parsed = parseParentScheduleRuleValue(this.value());
    if (parsed) {
      this._rule = parsed.rule;
      this._parentRule = parsed.value;
    }
  }

  get rule() {
    return this._rule ?? 1;
  }

  get parentRule() {
    return this._parentRule;
  }
}

export class Sd extends Day implements ScheduleRule {
  get rule() {
    return this._rule ?? 1;
  }

  get type() {
    if (this._day === "en") {
      return "en";
    }
    if (this._day === "ud") {
      return "ud";
    }
    if (this._day?.startsWith("+")) {
      return "+";
    }
    if (this._day?.startsWith("*")) {
      return "*";
    }
    if (this._day?.startsWith("@")) {
      return "@";
    }
    return "";
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
export class Sh extends Parameter implements ScheduleRule {
  _rule;
  _substitute;

  constructor(arg: ParamInternal) {
    super(arg);
    const parsed = parseClosedDaySubstitutionValue(this.value());
    if (parsed) {
      this._rule = parsed.rule;
      this._substitute = parsed.value;
    }
  }

  get rule() {
    return this._rule ?? 1;
  }

  get substitute() {
    return this._substitute;
  }
}

export class Shd extends Parameter implements ScheduleRule {
  _rule;
  _shiftDays;

  constructor(arg: ParamInternal) {
    super(arg);
    const parsed = parseShiftDaysValue(this.value());
    if (parsed) {
      this._rule = parsed.rule;
      this._shiftDays = parsed.value;
    }
  }

  get rule() {
    return this._rule ?? 1;
  }

  get shiftDays() {
    return this._shiftDays ?? "2";
  }
}

export class Wc extends Parameter implements ScheduleRule {
  _rule;
  _numberOfTimes;

  constructor(arg: ParamInternal) {
    super(arg);
    const parsed = parseWaitCountValue(this.value());
    if (parsed) {
      this._rule = parsed.rule;
      this._numberOfTimes = parsed.value;
    }
  }

  get rule() {
    return this._rule ?? 1;
  }

  get numberOfTimes() {
    return this._numberOfTimes ?? "1";
  }
}
