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
    get evssv() { return ParamFactory.evssv(this); }
    // [evsfr=extended-attribute-name:"value";] 
    get evsfr() { return ParamFactory.evsfr(this); }
    // [pfm={u|p};] 
    get pfm() { return ParamFactory.pfm(this); }
    // [etm=n;] 
    get etm() { return ParamFactory.etm(this); }
    // [fd=time-required-for-execution;] 
    get fd() { return ParamFactory.fd(this); }
    // [ex="execution-agent-name";] 
    get ex() { return ParamFactory.ex(this); }
    // [ha={y|n};] 
    get ha() { return ParamFactory.ha(this); }
    // [eu={ent|def};] 
    get eu() { return ParamFactory.eu(this); }
    // [evsrt={y|n};] 
    get evsrt() { return ParamFactory.evsrt(this); }
    // [evspl=check-interval;] 
    get evspl() { return ParamFactory.evspl(this); }
    // [evsrc=check-count;] 
    get evsrc() { return ParamFactory.evsrc(this); }
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

    /** Whether this jobnet have a unit whose end is being waited for. */
    get hasWaitedFor() {
        return this.eun && this.eun.length > 0;
    }
}
export class Revsj extends Evsj { }