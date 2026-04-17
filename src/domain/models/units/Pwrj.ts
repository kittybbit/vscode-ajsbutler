import { ParamFactory } from "../parameters/ParameterFactory";
import { WaitableUnitEntity } from "./unitCapabilityEntities";

export class Pwrj extends WaitableUnitEntity {
  // [pwrh="target-host-name";]
  get pwrh() {
    return ParamFactory.pwrh(this);
  }
  // [pwrf={o|m|r|f|p|s};]
  get pwrf() {
    return ParamFactory.pwrf(this);
  }
  // [pwrn={n|a|c:[mm/dd.]hh:mm};]
  get pwrn() {
    return ParamFactory.pwrn(this);
  }
  // [pwrr={y|n};]
  get pwrr() {
    return ParamFactory.pwrr(this);
  }
  // [pwrw={y|n};]
  get pwrw() {
    return ParamFactory.pwrw(this);
  }
  // [pwrp={p|u};]
  get pwrp() {
    return ParamFactory.pwrp(this);
  }
  // [pfm={u|p};]
  get pfm() {
    return ParamFactory.pfm(this);
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
}
export class Rpwrj extends Pwrj {}
