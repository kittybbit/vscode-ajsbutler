import { ParamFactory } from "../parameters/ParameterFactory";
import { PlatformExecutionWaitJobUnitEntity } from "./unitCapabilityEntities";

export class Evsj extends PlatformExecutionWaitJobUnitEntity {
  // [evsid=event-ID;]
  get evsid() {
    return ParamFactory.evsid(this);
  }
  // [evhst="event-destination-host-name";]
  get evhst() {
    return ParamFactory.evhst(this);
  }
  // [evsms="message";]
  get evsms() {
    return ParamFactory.evsms(this);
  }
  // [evssv={em|al|cr|er|wr|no|in|db};]
  get evssv() {
    return ParamFactory.evssv(this);
  }
  // [evsfr=extended-attribute-name:"value";]
  get evsfr() {
    return ParamFactory.evsfr(this);
  }
  // [evsrt={y|n};]
  get evsrt() {
    return ParamFactory.evsrt(this);
  }
  // [evspl=check-interval;]
  get evspl() {
    return ParamFactory.evspl(this);
  }
  // [evsrc=check-count;]
  get evsrc() {
    return ParamFactory.evsrc(this);
  }
}
export class Revsj extends Evsj {}
