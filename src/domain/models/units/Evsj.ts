import { ParamFactory } from "../parameters/ParameterFactory";
import { UnitEntity } from "./UnitEntities";

export class Evsj extends UnitEntity {
    // [evsid=event-ID;] 
    get evsid() { return ParamFactory.evsid(this); }
    // [evhst="event-destination-host-name";] 
    get evhst() { return ParamFactory.evhst(this); }
    // [evsms="message";] 
    get evsms() { return ParamFactory.evsms(this); }
    // [evssv={em|al|cr|er|wr|no|in|db};] 
    get evssv() { return ParamFactory.evssv(this, 'no'); }
    // [evsfr=extended-attribute-name:"value";] 
    get evsfr() { return ParamFactory.evsfr(this); }
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
    // [evsrt={y|n};] 
    get evsrt() { return ParamFactory.evsrt(this, 'n'); }
    // [evspl=check-interval;] 
    get evspl() { return ParamFactory.evspl(this, '10'); }
    // [evsrc=check-count;] 
    get evsrc() { return ParamFactory.evsrc(this, '0'); }
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
export class Revsj extends Evsj { }