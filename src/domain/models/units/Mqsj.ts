import { ParamFactory } from "../parameters/ParameterFactory";
import { UnitEntity } from "./UnitEntities";

export class Mqsj extends UnitEntity {
    // [mqque=queue-name;] 
    get mqque() { return ParamFactory.mqque(this); }
    // [mqcor=correlation-ID;] 
    get mqcor() { return ParamFactory.mqcor(this); }
    // [mqdsc=message-ID;] 
    get mqdsc() { return ParamFactory.mqdsc(this); }
    // [mqprm={y|n};] 
    get mqprm() { return ParamFactory.mqprm(this); }
    // [mqmgr=queue-manager-name;] 
    get mqmgr() { return ParamFactory.mqmgr(this); }
    // [mqmdl=model-queue-name;] 
    get mqmdl() { return ParamFactory.mqmdl(this); }
    // [mqpgm=related-queue-management-program-name;] 
    get mqpgm() { return ParamFactory.mqpgm(this); }
    // [mqmfn=format-name;] 
    get mqmfn() { return ParamFactory.mqmfn(this); }
    // [mqmdn="message-data-file-name";] 
    get mqmdn() { return ParamFactory.mqmdn(this); }
    // [mqhld=hold-time;] 
    get mqhld() { return ParamFactory.mqhld(this); }
    // [mqpri=priority:] 
    get mqpri() { return ParamFactory.mqpri(this); }
    // [mqeqn=dead-letter-queue-name;] 
    get mqeqn() { return ParamFactory.mqeqn(this); }
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
}
export class Rmqsj extends Mqsj { }