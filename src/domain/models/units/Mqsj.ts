import { ParamFactory } from "../parameters/ParameterFactory";
import { WaitableUnitEntity } from "./unitCapabilityEntities";

export class Mqsj extends WaitableUnitEntity {
  // [mqque=queue-name;]
  get mqque() {
    return ParamFactory.mqque(this);
  }
  // [mqcor=correlation-ID;]
  get mqcor() {
    return ParamFactory.mqcor(this);
  }
  // [mqdsc=message-ID;]
  get mqdsc() {
    return ParamFactory.mqdsc(this);
  }
  // [mqprm={y|n};]
  get mqprm() {
    return ParamFactory.mqprm(this);
  }
  // [mqmgr=queue-manager-name;]
  get mqmgr() {
    return ParamFactory.mqmgr(this);
  }
  // [mqmdl=model-queue-name;]
  get mqmdl() {
    return ParamFactory.mqmdl(this);
  }
  // [mqpgm=related-queue-management-program-name;]
  get mqpgm() {
    return ParamFactory.mqpgm(this);
  }
  // [mqmfn=format-name;]
  get mqmfn() {
    return ParamFactory.mqmfn(this);
  }
  // [mqmdn="message-data-file-name";]
  get mqmdn() {
    return ParamFactory.mqmdn(this);
  }
  // [mqhld=hold-time;]
  get mqhld() {
    return ParamFactory.mqhld(this);
  }
  // [mqpri=priority:]
  get mqpri() {
    return ParamFactory.mqpri(this);
  }
  // [mqeqn=dead-letter-queue-name;]
  get mqeqn() {
    return ParamFactory.mqeqn(this);
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
export class Rmqsj extends Mqsj {}
