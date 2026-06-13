import { ParamFactory } from "../parameters/ParameterFactory";
import { JobTypeExecutionWaitJobUnitEntity } from "./unitCapabilityEntities";

export class Mssj extends JobTypeExecutionWaitJobUnitEntity {
  // [msqpt="queue-path-name";]
  get msqpt() {
    return ParamFactory.msqpt(this);
  }
  // [msqlb="queue-label-name";]
  get msqlb() {
    return ParamFactory.msqlb(this);
  }
  // [msrer=correlation-ID;]
  get msrer() {
    return ParamFactory.msrer(this);
  }
  // [mslmt={-2|-1|n};]
  get mslmt() {
    return ParamFactory.mslmt(this);
  }
  // [mshld={-1|n};]
  get mshld() {
    return ParamFactory.mshld(this);
  }
  // [msmod={h|r};]
  get msmod() {
    return ParamFactory.msmod(this);
  }
  // [mspri=priority;]
  get mspri() {
    return ParamFactory.mspri(this);
  }
  // [msjnl={y|n};]
  get msjnl() {
    return ParamFactory.msjnl(this);
  }
  // [msunr={y|n};]
  get msunr() {
    return ParamFactory.msunr(this);
  }
  // [mstfn="text-file-name";]
  get mstfn() {
    return ParamFactory.mstfn(this);
  }
  // [msttp=text-type;]
  get msttp() {
    return ParamFactory.msttp(this);
  }
  // [mslbl="message-label";]
  get mslbl() {
    return ParamFactory.mslbl(this);
  }
  // [msapl=application-information;]
  get msapl() {
    return ParamFactory.msapl(this);
  }
}
export class Rmssj extends Mssj {}
