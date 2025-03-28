import { ParamFactory } from "../parameters/ParameterFactory";
import { UnitEntity } from "./UnitEntities";

export class Mqwj extends UnitEntity {
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
export class Rmqwj extends Mqwj {}
