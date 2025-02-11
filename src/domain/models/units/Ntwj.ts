import { ParamFactory } from "../parameters/ParameterFactory";
import { UnitEntity } from "./UnitEntities";

export class Ntwj extends UnitEntity {
  // [ntlgt={sys|sec|app|dns|dir|frs|oth};]
  get ntlgt() {
    return ParamFactory.ntlgt(this);
  }
  // [ntolg="any-log-type";]
  get ntolg() {
    return ParamFactory.ntolg(this);
  }
  // [ntevt=[v[: i[: w[: e[: s[: c[: f]]]]]]];]
  get ntevt() {
    return ParamFactory.ntevt(this);
  }
  // [ntnsr={y|n};]
  get ntnsr() {
    return ParamFactory.ntnsr(this);
  }
  // [ntsrc="source";]
  get ntsrc() {
    return ParamFactory.ntsrc(this);
  }
  // [ntncl={y|n};]
  get ntncl() {
    return ParamFactory.ntncl(this);
  }
  // [ntcls="class";]
  get ntcls() {
    return ParamFactory.ntcls(this);
  }
  // [ntnei={y|n};]
  get ntnei() {
    return ParamFactory.ntnei(this);
  }
  // [nteid=event-ID;]
  get nteid() {
    return ParamFactory.nteid(this);
  }
  // [ntdis="explanation";]
  get ntdis() {
    return ParamFactory.ntdis(this);
  }
  // [jpoif=macro-variable-name:passing-information-name;]
  get jpoif() {
    return ParamFactory.jpoif(this);
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
  // [ets={kl|nr|wr|an};]
  get ets() {
    return ParamFactory.ets(this);
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
export class Rntwj extends Ntwj {}
