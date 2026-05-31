import { ParamFactory } from "../parameters/ParameterFactory";
import { PlatformExecutionWaitJobUnitEntity } from "./unitCapabilityEntities";

export class Pwlj extends PlatformExecutionWaitJobUnitEntity {
  // [pwlt={f|r|s};]
  get pwlt() {
    return ParamFactory.pwlt(this);
  }
  // [pwlf={m|r|f|p};]
  get pwlf() {
    return ParamFactory.pwlf(this);
  }
}
export class Rpwlj extends Pwlj {}
