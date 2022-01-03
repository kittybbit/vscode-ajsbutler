/** JP1/AJS3 unit definition parameter entities */
import { ParamsType, isTy, isWeek } from "../values/AjsType";
import { UnitEntity } from "./UnitEntities";

export type ParamBase = {
    'unit': UnitEntity;
    'parameter': ParamsType;
}

type ParamInternal = ParamBase
    & {
        'inherited': boolean; // whether inherited or not
        'rawValue'?: string; // actual value
        'defaultRawValue'?: string; // default value
        'position': number; // defined position
    }

export type Rule = Sd | St | Sy | Ey | Ln | Cy | Sh | Shd | Wt | Wc | Cftd;

export abstract class Parameter {
    #unit: UnitEntity;
    #parameter: ParamsType;
    #rawValue?: string;
    #defaultRawValue?: string;
    #inherited = false;
    #position: number;
    /**
     * constructor
     * @param {ParamInternal}
     */
    constructor(arg: ParamInternal) {
        this.#unit = arg.unit;
        this.#parameter = arg.parameter;
        this.#rawValue = arg.rawValue;
        this.#defaultRawValue = arg.defaultRawValue;
        this.#position = arg.position;
    }
    get rawValue(): string | undefined {
        return this.#rawValue;
    }
    get defaultRawValue(): string | undefined {
        return this.#defaultRawValue;
    }
    get unit(): UnitEntity {
        return this.#unit;
    }
    get parameter(): ParamsType {
        return this.#parameter;
    }
    get inherited(): boolean {
        return this.#inherited;
    }
    get isDefault(): boolean {
        return !this.#rawValue;
    }
    get position(): number {
        return this.#position;
    }
    value(): string | undefined {
        return this.#rawValue ?? this.#defaultRawValue;
    }
    prettyJSON() {
        return {
            param: this.parameter,
            value: this.value(),
            inherited: this.inherited,
            poisition: this.position,
        }
    }
}

class PlainString extends Parameter { }
class EncordedString extends Parameter {
    override value(): string | undefined {
        return super.value()
            ?.replace(/^"(.*)"$/, '$1')
            .replace(/#"/g, '"')
            .replace(/##/g, '#');
    }
}
class Calendar extends Parameter {
    get su(): boolean {
        return "su" === this.value()?.split(':')[0];
    }
    get mo(): boolean {
        return "mo" === this.value()?.split(':')[0];
    }
    get tu(): boolean {
        return "tu" === this.value()?.split(':')[0];
    }
    get we(): boolean {
        return "we" === this.value()?.split(':')[0];
    }
    get th(): boolean {
        return "th" === this.value()?.split(':')[0];
    }
    get fr(): boolean {
        return "fr" === this.value()?.split(':')[0];
    }
    get sa(): boolean {
        return "sa" === this.value()?.split(':')[0];
    }
    get isWeek(): boolean {
        // op, cl, sdd
        const week = this.value()?.split(':')[0];
        return isWeek(week);
    }
    get weekOfTheMonth(): number | undefined {
        // sdd
        const week = this.value()?.split(':');
        return week && week.length === 2 ? Number(week[1]) : undefined;
    }
}
class Day extends Parameter {
    /**
     * [N,]                                      ((\d{1,3}),)?
     * {
     *   [                                       (
     *     [yyyy/]mm/                            (\d{4}\/)?\d{2}\/
     *   ]                                       )?
     *   {                                       (
     *     [+|*|@]dd                             ([+|*|@])?\d{2}
     *     |[+|*|@]b[-DD]                        ([+|*|@])?b(-\d{2})?
     *     |[+]{su|mo|tu|we|th|fr|sa} [:{n|b}]   [+]?(su|mo|tu|we|th|fr|sa)(:(\d|b))?
     *   }|en|ud                                 )
     * }
     */
    #pattern = /^((\d{1,3}),)?((\d{4}\/)?\d{2}\/)?(([+|*|@])?\d{2}|([+|*|@])?b(-\d{2})?|[+]?(su|mo|tu|we|th|fr|sa)(:(\d|b))?|en|ud)/;
    _re;
    _rule = -1;
    _yearMonth;
    _day;

    constructor(arg: ParamInternal) {
        super(arg);
        this._re = this.#pattern.exec(this.value() ?? '');
        const re = this._re;
        if (re) {
            this._rule = Number(re[2]);
            this._yearMonth = re[3];
            this._day = re[5];
        }
    }
}
abstract class Time extends Parameter {
    /**
     * [N,]                   ((\d{1,3}),)?
     * {no|hh:mm|mmmm|un}     (no|([+]?)\d{2}:\d{2}|([MCU])?\d{1,4}|un)
     */
    #pattern = /^((\d{1,3}),)?(no|([+]?)\d{2}:\d{2}|([MCU])?\d{1,4}|un)/;
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
export class Ab extends PlainString { }
export class Abr extends PlainString { }
export class Ar extends PlainString {
    #pattern = /\(f=(.+?),t=(.+?),(.+)\)/;
    get f(): string {
        const result = this.#pattern.exec(this.value() as string);
        if (result?.length === 4) {
            return result[1];
        } else {
            throw new Error(`unexpected format: ${this.value()}`);
        }
    }
    get t(): string | undefined {
        const result = this.#pattern.exec(this.value() as string);
        if (result?.length === 4) {
            return result[2];
        } else {
            throw new Error(`unexpected format: ${this.value()}`);
        }
    }
    get relationType(): string | undefined {
        const result = this.#pattern.exec(this.value() as string);
        if (result?.length === 4) {
            return result[3];
        } else {
            throw new Error(`unexpected format: ${this.value()}`);
        }
    }
}
export class Cd extends PlainString { }
export class Cftd extends Parameter {
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
        this.#_re = this.#pattern.exec(this.value() ?? '');
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
        return this.#_type === "no" ? "no" : `${this.#_type},${this.#_scheduleByDaysFromStart ?? 1}`;
    }

    get maxShiftableDays() {
        if (this.#_type && ["no", "db", "da"].includes(this.#_type)) {
            return undefined;
        }
        return this.#_maxShiftableDays ?? "10";
    }
}
export class Cgs extends PlainString { }
export class Cl extends Calendar { }
export class Cm extends EncordedString { }
export class Cmaif extends PlainString { }
export class Cmsts extends PlainString { }
export class Cond extends PlainString { }
export class Cty extends PlainString { }
export class Cy extends Parameter {
    /**
     * [N,](n,{y|m|w|d})    ((\d{1,3}),)?\(((\d{1,3}),([ymwd]))\)
     */
    #pattern = /^((\d{1,3}),)?\(((\d{1,3}),([ymwd]))\)/;
    _re;
    _rule;
    _cycle;

    constructor(arg: ParamInternal) {
        super(arg);
        this._re = this.#pattern.exec(this.value() ?? '');
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
export class Da extends EncordedString { }
export class De extends PlainString { }
export class Ed extends PlainString { }
export class Ega extends PlainString { }
export class Ej extends PlainString { }
export class Ejc extends PlainString { }
export class Ejf extends EncordedString { }
export class Ejg extends PlainString { }
export class Ejh extends PlainString { }
export class Eji extends PlainString { }
export class Ejl extends PlainString { }
export class Ejm extends PlainString { }
export class Ejn extends PlainString { }
export class Ejs extends PlainString { }
export class Ejt extends PlainString { }
export class Eju extends PlainString { }
export class Ejv extends PlainString { }
export class El extends PlainString {
    get name(): string | undefined {
        return this.value()?.split(',')[0];
    }
    get ty(): string | undefined {
        return this.value()?.split(',')[1];
    }
    get hv(): string | undefined {
        return this.value()?.split(',')[2];
    }
}
export class Env extends EncordedString { }
export class Etm extends PlainString { }
export class Etn extends PlainString { }
export class Ets extends PlainString { }
export class Eu extends PlainString { }
export class Eun extends PlainString { }
export class Ev extends EncordedString { }
export class Evdet extends EncordedString { }
export class Evesc extends PlainString { }
export class Evgid extends PlainString { }
export class Evgrp extends EncordedString { }
export class Evhst extends EncordedString { }
export class Evipa extends PlainString { }
export class Evpid extends PlainString { }
export class Evsfr extends EncordedString { }
export class Evsid extends PlainString { }
export class Evsms extends EncordedString { }
export class Evspl extends PlainString { }
export class Evsrc extends PlainString { }
export class Evsrt extends PlainString { }
export class Evssv extends PlainString { }
export class Evtmc extends PlainString { }
export class Evuid extends PlainString { }
export class Evusr extends EncordedString { }
export class Evwfr extends PlainString { }
export class Evwid extends PlainString { }
export class Evwms extends PlainString { }
export class Evwsv extends PlainString { }
export class Ex extends EncordedString { }
export class Ey extends Time {
    get rule() {
        return super.rule ?? 1;
    }

    get time() {
        return super.time;
    }
}
export class F extends PlainString { }
export class Fd extends PlainString { }
export class Flco extends PlainString { }
export class Flwc extends PlainString { }
export class Flwf extends EncordedString { }
export class Flwi extends PlainString { }
export class Fxg extends PlainString { }
export class Gty extends PlainString { }
export class Ha extends PlainString { }
export class Htcdm extends PlainString { }
export class Htcfl extends EncordedString { }
export class Htexm extends PlainString { }
export class Htknd extends PlainString { }
export class Htrbf extends EncordedString { }
export class Htrhf extends EncordedString { }
export class Htrqf extends EncordedString { }
export class Htrqm extends EncordedString { }
export class Htrqu extends EncordedString { }
export class Htspt extends PlainString { }
export class Htstf extends EncordedString { }
export class Jc extends PlainString { }
export class Jd extends PlainString { }
export class Jdf extends EncordedString { }
export class Jpoif extends PlainString { }
export class Jty extends PlainString { }
export class Lfcre extends PlainString { }
export class Lfdft extends PlainString { }
export class Lffnm extends PlainString { }
export class Lfhds extends PlainString { }
export class Lfmks extends PlainString { }
export class Lfmxl extends PlainString { }
export class Lfrft extends PlainString { }
export class Lfsiv extends PlainString { }
export class Lfsrc extends PlainString { }
export class Lftpd extends PlainString { }
export class Ln extends Parameter {
    /**
     * [N,] n       ((\d{1,3}),)?(\d{1,3})
     */
    #pattern = /^((\d{1,3}),)?(\d{1,3})/;
    _re;
    _rule;
    _parentRule;

    constructor(arg: ParamInternal) {
        super(arg);
        this._re = this.#pattern.exec(this.value() ?? '');
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
export class Mcs extends PlainString { }
export class Md extends PlainString { }
export class Mh extends EncordedString { }
export class Mladr extends EncordedString { }
export class Mlafl extends EncordedString { }
export class Mlatf extends PlainString { }
export class Mlftx extends PlainString { }
export class Mllst extends EncordedString { }
export class Mlprf extends EncordedString { }
export class Mlsav extends PlainString { }
export class Mlsbj extends EncordedString { }
export class Mlsfd extends EncordedString { }
export class Mlstx extends EncordedString { }
export class Mltxt extends EncordedString { }
export class Mm extends PlainString { }
export class Mp extends PlainString { }
export class Mqcor extends PlainString { }
export class Mqdsc extends PlainString { }
export class Mqeqn extends PlainString { }
export class Mqhld extends PlainString { }
export class Mqmdl extends PlainString { }
export class Mqmdn extends PlainString { }
export class Mqmfn extends PlainString { }
export class Mqmgr extends PlainString { }
export class Mqpgm extends PlainString { }
export class Mqpri extends PlainString { }
export class Mqprm extends PlainString { }
export class Mqque extends PlainString { }
export class Mqsfn extends PlainString { }
export class Ms extends PlainString { }
export class Msapl extends PlainString { }
export class Mshld extends PlainString { }
export class Msjnl extends PlainString { }
export class Mslbl extends PlainString { }
export class Mslmt extends PlainString { }
export class Msmod extends PlainString { }
export class Mspri extends PlainString { }
export class Msqlb extends PlainString { }
export class Msqpt extends PlainString { }
export class Msrer extends PlainString { }
export class Mssvf extends PlainString { }
export class Mstfn extends PlainString { }
export class Msttp extends PlainString { }
export class Msunr extends PlainString { }
export class Mu extends PlainString { }
export class Ncex extends PlainString { }
export class Nchn extends EncordedString { }
export class Ncl extends PlainString { }
export class Ncn extends PlainString { }
export class Ncr extends PlainString { }
export class Ncs extends PlainString { }
export class Ncsv extends PlainString { }
export class Ni extends PlainString {
    get priority(): number {
        const nice = Number(this.value());
        if (nice > 10) {
            return 5;
        } else if (nice > 0) {
            return 4;
        } else if (nice == 0) {
            return 3;
        } else if (nice > -11) {
            return 2;
        } else {
            return 1;
        }
    }
}
export class Nmg extends PlainString { }
export class Ntcls extends PlainString { }
export class Ntdis extends PlainString { }
export class Nteid extends PlainString { }
export class Ntevt extends PlainString { }
export class Ntlgt extends PlainString { }
export class Ntncl extends PlainString { }
export class Ntnei extends PlainString { }
export class Ntnsr extends PlainString { }
export class Ntolg extends PlainString { }
export class Ntsrc extends PlainString { }
export class Op extends Calendar { }
export class Pfm extends PlainString { }
export class Pr extends PlainString { }
export class Prm extends EncordedString { }
export class Pwlf extends PlainString { }
export class Pwlt extends PlainString { }
export class Pwrf extends PlainString { }
export class Pwrh extends PlainString { }
export class Pwrn extends PlainString { }
export class Pwrp extends PlainString { }
export class Pwrr extends PlainString { }
export class Pwrw extends PlainString { }
export class Qm extends EncordedString { }
export class Qu extends EncordedString { }
export class Rec extends PlainString { }
export class Rei extends PlainString { }
export class Req extends EncordedString { }
export class Rg extends PlainString { }
export class Rh extends EncordedString { }
export class Rje extends PlainString { }
export class Rjs extends PlainString { }
export class Sc extends EncordedString { }
export class Sd extends Day {

    get rule() {
        return this._rule ?? 1;
    }

    get type() {
        if (this._day === 'en') {
            return 'en';
        }
        if (this._day === 'ud') {
            return 'ud';
        }
        if (this._day?.startsWith('+')) {
            return '+';
        }
        if (this._day?.startsWith('*')) {
            return '*';
        }
        if (this._day?.startsWith('@')) {
            return '@';
        }
        return '';
    }

    get yearMonth() {
        if (this._yearMonth) {
            return this._yearMonth.substring(0, this._yearMonth.length - 1)
        }
        return this._yearMonth;
    }

    get day() {
        if (this._day !== 'en' && this._day !== 'ud') {
            return this._day?.replace(/[+*@]/, "");
        }
        return undefined;
    }
}
export class Sdd extends Calendar { }
export class Se extends EncordedString { }
export class Sea extends PlainString { }
export class Sh extends Parameter {
    /**
     * [N,]{be|af|ca|no}      ((\d{1,3}),)?(be|af|ca|no)
     */
    #pattern = /^((\d{1,3}),)?(be|af|ca|no)/;
    _re;
    _rule;
    _substitute;

    constructor(arg: ParamInternal) {
        super(arg);
        this._re = this.#pattern.exec(this.value() ?? '');
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
        // if (this._substitute === 'be') {
        //     return paramDefinition['sh']['be'];
        // }
        // if (this._substitute === 'af') {
        //     return paramDefinition['sh']['af'];
        // }
        // if (this._substitute === 'ca') {
        //     return paramDefinition['sh']['ca'];
        // }
        // if (this._substitute === 'no') {
        //     return paramDefinition['sh']['no'];
        // }
        return this._substitute;
    }
}
export class Shd extends Parameter {
    /**
     * [N,] n       ((\d{1,3}),)?(\d{1,3})
     */
    #pattern = /^((\d{1,3}),)?(\d{1,3})/;
    _re;
    _rule;
    _shiftDays;

    constructor(arg: ParamInternal) {
        super(arg);
        this._re = this.#pattern.exec(this.value() ?? '');
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
        return this._shiftDays ?? 2;
    }
}
export class Si extends EncordedString { }
export class So extends EncordedString { }
export class Soa extends PlainString { }
export class St extends Time {
    get rule() {
        return super.rule ?? 1;
    }

    get time() {
        return super.time ?? '+00:00';
    }
}
export class Stt extends PlainString { }
export class Sy extends Time {
    get rule() {
        return super.rule ?? 1;
    }

    get time() {
        return super.time;
    }
}
export class Sz extends PlainString { }
export class T extends PlainString { }
export class Td1 extends EncordedString { }
export class Td2 extends EncordedString { }
export class Td3 extends EncordedString { }
export class Td4 extends EncordedString { }
export class Te extends EncordedString { }
export class Tho extends PlainString { }
export class Tmitv extends PlainString { }
export class Top1 extends PlainString { }
export class Top2 extends PlainString { }
export class Top3 extends PlainString { }
export class Top4 extends PlainString { }
export class Ts1 extends EncordedString { }
export class Ts2 extends EncordedString { }
export class Ts3 extends EncordedString { }
export class Ts4 extends EncordedString { }
export class Ty extends PlainString {
    override value() {
        const ty = super.value();
        if (ty && isTy(ty)) {
            return ty;
        }
        throw new Error(`Unknown ty value. ${ty}`);
    }
}
export class Uem extends PlainString { }
export class Un extends EncordedString { }
export class Unit extends PlainString { }
export class Wc extends Parameter {
    /**
     * [N,] {no|N|un}       ((\d{1,3}),)?(.+)
     */
    #pattern = /^((\d{1,3}),)?(.+)/;
    _re;
    _rule;
    _numberOfTimes;

    constructor(arg: ParamInternal) {
        super(arg);
        this._re = this.#pattern.exec(this.value() ?? '');
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
        return this._numberOfTimes ?? 1;
    }
}
export class Wkp extends EncordedString { }
export class Wt extends Time { }
export class Wth extends PlainString { }
