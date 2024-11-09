import { ParamFactory } from "../parameters/ParameterFactory";
import { UnitEntity } from "./UnitEntities";

export class Pwrj extends UnitEntity {
    // [pwrh="target-host-name";] 
    get pwrh() { return ParamFactory.pwrh(this); }
    // [pwrf={o|m|r|f|p|s};] 
    get pwrf() { return ParamFactory.pwrf(this); }
    // [pwrn={n|a|c:[mm/dd.]hh:mm};] 
    get pwrn() { return ParamFactory.pwrn(this); }
    // [pwrr={y|n};] 
    get pwrr() { return ParamFactory.pwrr(this); }
    // [pwrw={y|n};] 
    get pwrw() { return ParamFactory.pwrw(this); }
    // [pwrp={p|u};] 
    get pwrp() { return ParamFactory.pwrp(this); }
    // [pfm={u|p};] 
    get pfm() { return ParamFactory.pfm(this, 'p'); }
    // [etm=n;] 
    get etm() { return ParamFactory.etm(this); }
    // [fd=time-required-for-execution;] 
    get fd() { return ParamFactory.fd(this); }
    // [ex="execution-agent-name";] 
    get ex() { return ParamFactory.ex(this); }
    // [ha={y|n};] 
    get ha() { return ParamFactory.ha(this, 'n'); }
    // [eu={ent|def};] 
    get eu() { return ParamFactory.eu(this, 'ent'); }
    // [jty={q|n};] 
    get jty() { return ParamFactory.jty(this, 'q'); }
    // [mm={and|or};] 
    get mm() { return ParamFactory.mm(this, 'and'); }
    // [nmg={y|n};] 
    get nmg() { return ParamFactory.nmg(this, 'n'); }
    // [eun=name-of-the-unit-whose-end-is-being-waited-for;] 
    get eun() { return ParamFactory.eun(this); }
    // [ega={exec|execdeffer|none};] 
    get ega() { return ParamFactory.ega(this, 'none'); }
    // [uem={y|n};] 
    get uem() { return ParamFactory.uem(this, 'n'); }

    /** Whether this jobnet have a unit whose end is being waited for. */
    get hasWaitedFor() {
        return this.eun && this.eun.length > 0;
    }
}
export class Rpwrj extends Pwrj { }