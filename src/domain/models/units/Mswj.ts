import { ParamFactory } from "../parameters/ParameterFactory";
import { UnitEntity } from "./UnitEntities";

export class Mswj extends UnitEntity {
    // [msqpt="path-name";] 
    get msqpt() { return ParamFactory.msqpt(this); }
    // [msrer=correlation-ID;] 
    get msrer() { return ParamFactory.msrer(this); }
    // [mslbl="message-label";] 
    get mslbl() { return ParamFactory.mslbl(this); }
    // [msapl=application-information;] 
    get msapl() { return ParamFactory.msapl(this); }
    // [mssvf="message-storage-file-name";] 
    get mssvf() { return ParamFactory.mssvf(this); }
    // [jpoif=macro-variable-name:passing-information-name;] 
    get jpoif() { return ParamFactory.jpoif(this); }
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
    // [ets={kl|nr|wr|an};] 
    get ets() { return ParamFactory.ets(this, 'kl'); }
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
export class Rmswj extends Mswj { }