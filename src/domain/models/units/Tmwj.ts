import { ParamFactory } from "../parameters/ParameterFactory";
import { ExecutionWaitJobUnitEntity } from "./unitCapabilityEntities";

export class Tmwj extends ExecutionWaitJobUnitEntity {
  // [tmitv=wait-time;]
  get tmitv() {
    return ParamFactory.tmitv(this);
  }
  // [etn={y|n};]
  get etn() {
    return ParamFactory.etn(this);
  }
  // [jpoif=macro-variable-name:passing-information-name;]
  get jpoif() {
    return ParamFactory.jpoif(this);
  }
  // [ets={kl|nr|wr|an};]
  get ets() {
    return ParamFactory.ets(this);
  }
}
export class Rtmwj extends Tmwj {}
