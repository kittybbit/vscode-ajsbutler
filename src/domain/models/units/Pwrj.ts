import { ParamFactory } from "../parameters/ParameterFactory";
import { PlatformExecutionWaitJobUnitEntity } from "./unitCapabilityEntities";

export class Pwrj extends PlatformExecutionWaitJobUnitEntity {
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
}
export class Rpwrj extends Pwrj {}
