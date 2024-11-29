import { ParamFactory } from "../parameters/ParameterFactory";
import { N, Rn } from "./N";
import { UnitEntity } from "./UnitEntities";

export class J extends UnitEntity {
    // [te="command-text";]
    get te() { return ParamFactory.te(this); }
    // [sc="script-file-name";]
    get sc() { return ParamFactory.sc(this); }
    // [prm="parameter";]
    get prm() { return ParamFactory.prm(this); }
    // [wkp="work-path-name";]
    get wkp() { return ParamFactory.wkp(this); }
    // [ev="environmental-variable-file-name";]
    get ev() { return ParamFactory.ev(this); }
    // [env="environment-variable";]...
    get env() { return ParamFactory.env(this); }
    // [si="standard-input-file-name";]
    get si() { return ParamFactory.si(this); }
    // [so="standard-output-file-name";]
    get so() { return ParamFactory.so(this); }
    // [se="standard-error-output-file-name";]
    get se() { return ParamFactory.se(this); }
    // [soa={new|add};]
    get soa() { return ParamFactory.soa(this); }
    // [sea={new|add};]
    get sea() { return ParamFactory.sea(this); }
    // [etm=n;]
    get etm() { return ParamFactory.etm(this); }
    // [fd=time-required-for-execution;]
    get fd() { return ParamFactory.fd(this); }
    // [pr=n;]
    get pr() { return ParamFactory.pr(this); }
    // [ni=n;]
    get ni() { return ParamFactory.ni(this); }
    // [ex="execution-agent-name";]
    get ex() { return ParamFactory.ex(this); }
    // [un="target-user-name";]
    get un() { return ParamFactory.un(this); }
    // [jd={nm|ab|cod|mdf|exf};]
    get jd() { return ParamFactory.jd(this); }
    // [wth=n;]
    get wth() { return ParamFactory.wth(this); }
    // [tho=n;]
    get tho() { return ParamFactory.tho(this); }
    // [jdf="end-judgment-file-name";]
    get jdf() { return ParamFactory.jdf(this); }
    // [abr={y|n};]
    get abr() { return ParamFactory.abr(this); }
    // [rjs=lower-limit-of-return-codes-to-be-retried-automatically;]
    get rjs() { return ParamFactory.rjs(this); }
    // [rje=upper-limit-of-return-codes-to-be-retried-automatically;]
    get rje() { return ParamFactory.rje(this); }
    // [rec=maximum-number-of-retry-executions;]
    get rec() { return ParamFactory.rec(this); }
    // [rei=retry-interval;]
    get rei() { return ParamFactory.rei(this); }
    // [ts1="transfer-source-file-name-1";]
    get ts1() { return ParamFactory.ts1(this); }
    // [td1="transfer-destination-file-name-1";]
    get td1() { return ParamFactory.td1(this); }
    // [top1={sav|del};]
    get top1() { return ParamFactory.top1(this); }
    // [ts2="transfer-source-file-name-2";]
    get ts2() { return ParamFactory.ts2(this); }
    // [td2="transfer-destination-file-name-2";]
    get td2() { return ParamFactory.td2(this); }
    // [top2={sav|del};]
    get top2() { return ParamFactory.top2(this); }
    // [ts3="transfer-source-file-name-3";]
    get ts3() { return ParamFactory.ts3(this) }
    // [td3="transfer-destination-file-name-3";]
    get td3() { return ParamFactory.td3(this) }
    // [top3={sav|del};]
    get top3() { return ParamFactory.top3(this); }
    // [ts4="transfer-source-file-name-4";]
    get ts4() { return ParamFactory.ts4(this); }
    // [td4="transfer-destination-file-name-4";]
    get td4() { return ParamFactory.td4(this); }
    // [top4={sav|del};]
    get top4() { return ParamFactory.top4(this); }
    // [ha={y|n};]
    get ha() { return ParamFactory.ha(this); }
    // [eu={ent|def};]
    get eu() { return ParamFactory.eu(this); }
    // [jty={q|n};]
    get jty() { return ParamFactory.jty(this); }
    // [mm={and|or};]
    get mm() { return ParamFactory.mm(this); }
    // [nmg={y|n};]
    get nmg() { return ParamFactory.nmg(this); }
    // [eun=name-of-the-unit-whose-end-is-being-waited-for;]
    get eun() { return ParamFactory.eun(this); }
    // [ega={exec|execdeffer|none};]
    get ega() { return ParamFactory.ega(this); }
    // [uem={y|n};]
    get uem() { return ParamFactory.uem(this); }

    get priority(): number {
        const pr = this.pr;
        const ni = this.ni;
        if (pr && ni && !pr.inherited && !ni.inherited) {
            return pr.position > ni.position ? Number(pr.value()) : ni.priority
        } else if (pr && !pr.inherited) {
            return Number(pr.value())
        } else if (ni && !ni.inherited) {
            return ni.priority
        }

        switch (this.parent && this.parent.ty.value()) {
            case 'n':
            case 'rn':
                return (this.parent as N | Rn).priority;
        }
        return 1;
    }

    /** Whether this jobnet have a unit whose end is being waited for. */
    get hasWaitedFor() {
        return this.eun && this.eun.length > 0;
    }
}
export class Rj extends J { }
export class Pj extends J { }
export class Rp extends J { }