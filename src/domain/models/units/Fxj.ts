import { ParamFactory } from "../parameters/ParameterFactory";
import { UnitEntity } from "./UnitEntities";

export class Fxj extends UnitEntity {
    // [ex="relay-agent-name";] 
    get ex() { return ParamFactory.ex(this); }
    // da="destination-or-broadcast-agent"; 
    get da() { return ParamFactory.da(this); }
    // [fxg={none|sync|async};] 
    get fxg() { return ParamFactory.fxg(this); }
    // sc="name-of-the-file-to-be-executed-on-the-agent-host"; 
    get sc() { return ParamFactory.sc(this); }
    // [prm="parameter";] 
    get prm() { return ParamFactory.prm(this); }
    // [env="environment-variable";]... 
    get env() { return ParamFactory.env(this); }
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
    // [ha={y|n};] 
    get ha() { return ParamFactory.ha(this); }
    // [eu={ent|def};] 
    get eu() { return ParamFactory.eu(this); }
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

    /** Whether this jobnet have a unit whose end is being waited for. */
    get hasWaitedFor() {
        return this.eun && this.eun.length > 0;
    }
}
export class Rfxj extends Fxj { }