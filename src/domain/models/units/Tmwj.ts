import { ParamFactory } from "../parameters/ParameterFactory";
import { WaitableUnitEntity } from "./unitCapabilityEntities";

export class Tmwj extends WaitableUnitEntity {
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
}
export class Rtmwj extends Tmwj {}
