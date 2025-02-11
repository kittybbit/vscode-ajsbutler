import { ParamFactory } from "../parameters/ParameterFactory";
import { UnitEntity } from "./UnitEntities";

export class Mssj extends UnitEntity {
  // [msqpt="queue-path-name";]
  get msqpt() {
    return ParamFactory.msqpt(this);
  }
  // [msqlb="queue-label-name";]
  get msqlb() {
    return ParamFactory.msqlb(this);
  }
  // [msrer=correlation-ID;]
  get msrer() {
    return ParamFactory.msrer(this);
  }
  // [mslmt={-2|-1|n};]
  get mslmt() {
    return ParamFactory.mslmt(this);
  }
  // [mshld={-1|n};]
  get mshld() {
    return ParamFactory.mshld(this);
  }
  // [msmod={h|r};]
  get msmod() {
    return ParamFactory.msmod(this);
  }
  // [mspri=priority;]
  get mspri() {
    return ParamFactory.mspri(this);
  }
  // [msjnl={y|n};]
  get msjnl() {
    return ParamFactory.msjnl(this);
  }
  // [msunr={y|n};]
  get msunr() {
    return ParamFactory.msunr(this);
  }
  // [mstfn="text-file-name";]
  get mstfn() {
    return ParamFactory.mstfn(this);
  }
  // [msttp=text-type;]
  get msttp() {
    return ParamFactory.msttp(this);
  }
  // [mslbl="message-label";]
  get mslbl() {
    return ParamFactory.mslbl(this);
  }
  // [msapl=application-information;]
  get msapl() {
    return ParamFactory.msapl(this);
  }
  // [etm=n;]
  get etm() {
    return ParamFactory.etm(this);
  }
  // [fd=time-required-for-execution;]
  get fd() {
    return ParamFactory.fd(this);
  }
  // [ex="execution-agent-name";]
  get ex() {
    return ParamFactory.ex(this);
  }
  // [ha={y|n};]
  get ha() {
    return ParamFactory.ha(this);
  }
  // [eu={ent|def};]
  get eu() {
    return ParamFactory.eu(this);
  }
  // [jty={q|n};]
  get jty() {
    return ParamFactory.jty(this);
  }
  // [mm={and|or};]
  get mm() {
    return ParamFactory.mm(this);
  }
  // [nmg={y|n};]
  get nmg() {
    return ParamFactory.nmg(this);
  }
  // [eun=name-of-the-unit-whose-end-is-being-waited-for;]
  get eun() {
    return ParamFactory.eun(this);
  }
  // [ega={exec|execdeffer|none};]
  get ega() {
    return ParamFactory.ega(this);
  }
  // [uem={y|n};]
  get uem() {
    return ParamFactory.uem(this);
  }

  /** Whether this jobnet have a unit whose end is being waited for. */
  get hasWaitedFor() {
    return this.eun && this.eun.length > 0;
  }
}
export class Rmssj extends Mssj {}
