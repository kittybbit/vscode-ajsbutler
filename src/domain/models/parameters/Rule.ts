import Day from "./Day";
import Parameter from "./Parameter";
import { ParamInternal } from "./parameter.types";

interface Rule {
  get rule(): number;
}
export default Rule;

export class Cftd extends Parameter implements Rule {
  /**
   * [N,]{no|be|af|db|da}[,n[,N]]    ((\d{1,3}),)?(no|be|af|db|da)((,(\d{1,2}))(,(\d{1,2}))?)?
   */
  #pattern = /^((\d{1,3}),)?(no|be|af|db|da)((,(\d{1,2}))(,(\d{1,2}))?)?/;
  #_re;
  #_rule = -1;
  #_type;
  #_scheduleByDaysFromStart;
  #_maxShiftableDays;

  constructor(arg: ParamInternal) {
    super(arg);
    this.#_re = this.#pattern.exec(this.value() ?? "");
    const re = this.#_re;
    if (re) {
      this.#_rule = Number(re[2]);
      this.#_type = re[3] ?? "no";
      this.#_scheduleByDaysFromStart = re[6];
      this.#_maxShiftableDays = re[8];
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

export class Cy extends Parameter implements Rule {
  /**
   * [N,](n,{y|m|w|d})    ((\d{1,3}),)?\(((\d{1,3}),([ymwd]))\)
   */
  #pattern = /^((\d{1,3}),)?\(((\d{1,3}),([ymwd]))\)/;
  _re;
  _rule;
  _cycle;

  constructor(arg: ParamInternal) {
    super(arg);
    this._re = this.#pattern.exec(this.value() ?? "");
    const re = this._re;
    if (re) {
      this._rule = Number(re[2]);
      this._cycle = re[3];
    }
  }

  get rule() {
    return this._rule ?? 1;
  }

  get cycle() {
    return this._cycle;
  }
}

export class Ln extends Parameter implements Rule {
  /**
   * [N,] n       ((\d{1,3}),)?(\d{1,3})
   */
  #pattern = /^((\d{1,3}),)?(\d{1,3})/;
  _re;
  _rule;
  _parentRule;

  constructor(arg: ParamInternal) {
    super(arg);
    this._re = this.#pattern.exec(this.value() ?? "");
    const re = this._re;
    if (re) {
      this._rule = Number(re[2]);
      this._parentRule = re[3];
    }
  }

  get rule() {
    return this._rule ?? 1;
  }

  get parentRule() {
    return this._parentRule;
  }
}

export class Sd extends Day implements Rule {
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
export class Sh extends Parameter implements Rule {
  /**
   * [N,]{be|af|ca|no}      ((\d{1,3}),)?(be|af|ca|no)
   */
  #pattern = /^((\d{1,3}),)?(be|af|ca|no)/;
  _re;
  _rule;
  _substitute;

  constructor(arg: ParamInternal) {
    super(arg);
    this._re = this.#pattern.exec(this.value() ?? "");
    const re = this._re;
    if (re) {
      this._rule = Number(re[2]);
      this._substitute = re[3];
    }
  }

  get rule() {
    return this._rule ?? 1;
  }

  get substitute() {
    return this._substitute;
  }
}

export class Shd extends Parameter implements Rule {
  /**
   * [N,] n       ((\d{1,3}),)?(\d{1,3})
   */
  #pattern = /^((\d{1,3}),)?(\d{1,3})/;
  _re;
  _rule;
  _shiftDays;

  constructor(arg: ParamInternal) {
    super(arg);
    this._re = this.#pattern.exec(this.value() ?? "");
    const re = this._re;
    if (re) {
      this._rule = Number(re[2]);
      this._shiftDays = re[3];
    }
  }

  get rule() {
    return this._rule ?? 1;
  }

  get shiftDays() {
    return this._shiftDays ?? "2";
  }
}

export class Wc extends Parameter implements Rule {
  /**
   * [N,] {no|N|un}       ((\d{1,3}),)?(.+)
   */
  #pattern = /^((\d{1,3}),)?(.+)/;
  _re;
  _rule;
  _numberOfTimes;

  constructor(arg: ParamInternal) {
    super(arg);
    this._re = this.#pattern.exec(this.value() ?? "");
    const re = this._re;
    if (re) {
      this._rule = Number(re[2]);
      this._numberOfTimes = re[3];
    }
  }

  get rule() {
    return this._rule ?? 1;
  }

  get numberOfTimes() {
    return this._numberOfTimes ?? "1";
  }
}
