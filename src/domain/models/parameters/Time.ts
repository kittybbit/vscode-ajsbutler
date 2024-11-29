import { ParamInternal } from "./parameter.types";
import Parameter from "./Parameter";
import Rule from "./Rule";

abstract class Time extends Parameter implements Rule {
    /**
     * [N,]                   ((\d{1,3}),)?
     * {no|hh:mm|mmmm|un}     (no|([+]?)\d{2}:\d{2}|([MCU])?\d{1,4}|un)
     */
    #pattern = /^((\d{1,3}),)?(no|([+]?)\d{2}:\d{2}|([MCU])?\d{1,4}|un)?/;
    #_re;
    #_rule = -1;
    #_time;

    constructor(arg: ParamInternal) {
        super(arg);
        this.#_re = this.#pattern.exec(this.value() ?? '');
        const re = this.#_re;
        if (re) {
            this.#_rule = Number(re[2]);
            this.#_time = re[3];
        }
    }

    get rule() {
        return this.#_rule;
    }

    get time() {
        return this.#_time;
    }
}
export default Time;

export class Ey extends Time {
    get time() {
        return super.time;
    }
}

export class St extends Time {
    get time() {
        return super.time ?? '+00:00';
    }
}

export class Sy extends Time {
    get time() {
        return super.time;
    }
}

export class Wt extends Time { }
