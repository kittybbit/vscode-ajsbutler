import { ParamFactory } from "../parameters/ParameterFactory";
import { PlatformExecutionWaitJobUnitEntity } from "./unitCapabilityEntities";

export class Cmsj extends PlatformExecutionWaitJobUnitEntity {
  // [cmsts={un|no|wa|mi|ma|cr|re|te|di};]
  get cmsts() {
    return ParamFactory.cmsts(this);
  }
  // [cmaif="additional-information";]
  get cmaif() {
    return ParamFactory.cmaif(this);
  }
}
export class Rcmsj extends Cmsj {}
