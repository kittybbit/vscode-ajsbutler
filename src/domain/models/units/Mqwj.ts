import { ParamFactory } from "../parameters/ParameterFactory";
import { WaitableUnitEntity } from "./unitCapabilityEntities";

export class Mqwj extends WaitableUnitEntity {
  // [mqcor=correlation-ID;]
  get mqcor() {
    return ParamFactory.mqcor(this);
  }
  // [mqque=message-input-queue-name;]
  get mqque() {
    return ParamFactory.mqque(this);
  }
  // [mqdsc=message-ID;]
  get mqdsc() {
    return ParamFactory.mqdsc(this);
  }
  // [mqmdl=model-queue-name;]
  get mqmdl() {
    return ParamFactory.mqmdl(this);
  }
  // [mqsfn="message-storage-file-name";]
  get mqsfn() {
    return ParamFactory.mqsfn(this);
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
export class Rmqwj extends Mqwj {}
