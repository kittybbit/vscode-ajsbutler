import { ParamFactory } from "../parameters/ParameterFactory";
import { WaitableUnitEntity } from "./unitCapabilityEntities";

export class Pwlj extends WaitableUnitEntity {
  // [pwlt={f|r|s};]
  get pwlt() {
    return ParamFactory.pwlt(this);
  }
  // [pwlf={m|r|f|p};]
  get pwlf() {
    return ParamFactory.pwlf(this);
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
export class Rpwlj extends Pwlj {}
