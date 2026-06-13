import { ParamFactory } from "../parameters/ParameterFactory";
import { PlatformExecutionWaitJobUnitEntity } from "./unitCapabilityEntities";

export class Mqsj extends PlatformExecutionWaitJobUnitEntity {
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
}
export class Rmqsj extends Mqsj {}
