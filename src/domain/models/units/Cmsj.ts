import { ParamFactory } from "../parameters/ParameterFactory";
import { WaitableUnitEntity } from "./unitCapabilityEntities";

export class Cmsj extends WaitableUnitEntity {
  // [cmsts={un|no|wa|mi|ma|cr|re|te|di};]
  get cmsts() {
    return ParamFactory.cmsts(this);
  }
  // [cmaif="additional-information";]
  get cmaif() {
    return ParamFactory.cmaif(this);
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
export class Rcmsj extends Cmsj {}
