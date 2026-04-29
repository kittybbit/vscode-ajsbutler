import { ParamInternal } from "./parameter.types";
import Parameter from "./Parameter";
import ScheduleRule from "./ScheduleRule";
import {
  parseDelayTimeValue,
  parseStartTimeValue,
  parseWaitTimeValue,
  resolveEffectiveStartConditionMonitoringPair,
} from "./scheduleRuleHelpers";

type ParseTimeValue = (rawValue: string | undefined) =>
  | {
      rule: number;
      value: string;
    }
  | undefined;

abstract class Time extends Parameter implements ScheduleRule {
  #_rule = 1;
  #_time;

  constructor(arg: ParamInternal, parseTimeValue: ParseTimeValue) {
    super(arg);
    const parsed = parseTimeValue(this.value());
    if (parsed) {
      this.#_rule = parsed.rule;
      this.#_time = parsed.value;
    }
  }

  get rule() {
    return this.#_rule;
  }

  get time() {
    return this.#_time;
  }
}

export class Ey extends Time {
  constructor(arg: ParamInternal) {
    super(arg, parseDelayTimeValue);
  }

  get time() {
    return super.time;
  }
}

export class St extends Time {
  constructor(arg: ParamInternal) {
    super(arg, parseStartTimeValue);
  }

  get time() {
    return super.time ?? "+00:00";
  }
}

export class Sy extends Time {
  constructor(arg: ParamInternal) {
    super(arg, parseDelayTimeValue);
  }

  get time() {
    return super.time;
  }
}

export class Wt extends Time {
  constructor(arg: ParamInternal) {
    super(arg, parseWaitTimeValue);
  }

  effectiveTime(waitCountRawValue: string | undefined): string | undefined {
    return resolveEffectiveStartConditionMonitoringPair(
      waitCountRawValue,
      this.value(),
    ).time;
  }
}
