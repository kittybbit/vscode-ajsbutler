import { ParamFactory } from "../parameters/ParameterFactory";
import { UnitEntity } from "./UnitEntities";

export class Evwj extends UnitEntity {
    // [evwid=event-ID;]
    get evwid() { return ParamFactory.evwid(this); }
    // [evusr="event-issue-source-user-name";]
    get evusr() { return ParamFactory.evusr(this); }
    // [evgrp="event-issue-source-group-name";]
    get evgrp() { return ParamFactory.evgrp(this); }
    // [evhst="event-issue-source-host-name";]
    get evhst() { return ParamFactory.evhst(this); }
    // [evipa=event-issue-source-IP-address;]
    get evipa() { return ParamFactory.evipa(this); }
    // [evwms="message";]
    get evwms() { return ParamFactory.evwms(this); }
    // [evdet="detailed-event-information";]
    get evdet() { return ParamFactory.evdet(this); }
    // [evwsv=em[:al[:cr[:er[:wr[:no[:in[:db]]]]]]];]
    get evwsv() { return ParamFactory.evwsv(this); }
    // [evwfr=optional-extended-attribute-name:"value";]
    get evwfr() { return ParamFactory.evwfr(this); }
    // [evtmc={n|a|n:"file-name"|a:"file-name"
    //      |d:"file-name"|b:"file-name"};]
    get evtmc() { return ParamFactory.evtmc(this, 'n'); }
    // [evuid=event-issue-source-user-ID;]
    get evuid() { return ParamFactory.evuid(this); }
    // [evgid=event-issue-source-group-ID;]
    get evgid() { return ParamFactory.evgid(this); }
    // [evpid=event-issue-source-process-ID;]
    get evpid() { return ParamFactory.evpid(this); }
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
    // [evesc={no|minutes};]
    get evesc() { return ParamFactory.evesc(this, 'no'); }
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
export class Revwj extends Evwj { }