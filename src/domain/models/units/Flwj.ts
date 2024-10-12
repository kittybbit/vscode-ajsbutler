import { ParamFactory } from "../parameters/ParameterFactory";
import { UnitEntity } from "./UnitEntities";

export class Flwj extends UnitEntity {
    // [flwf="name-of-file-to-be-monitored";]
    get flwf() { return ParamFactory.flwf(this); }
    // [flwc=c[:d[:{s|m}]];]
    get flwc() { return ParamFactory.flwc(this, 'c'); }
    // [flwi=monitoring-interval;]
    get flwi() { return ParamFactory.flwi(this, '60'); }
    // [flco={y|n};] 
    get flco() { return ParamFactory.flco(this, 'n'); }
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
}
export class Rflwj extends Flwj { }