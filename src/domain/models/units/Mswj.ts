import { ParamFactory } from "../parameters/ParameterFactory";
import { MacroPassingExecutionWaitJobUnitEntity } from "./unitCapabilityEntities";

export class Mswj extends MacroPassingExecutionWaitJobUnitEntity {
  // [msqpt="path-name";]
  get msqpt() {
    return ParamFactory.msqpt(this);
  }
  // [msrer=correlation-ID;]
  get msrer() {
    return ParamFactory.msrer(this);
  }
  // [mslbl="message-label";]
  get mslbl() {
    return ParamFactory.mslbl(this);
  }
  // [msapl=application-information;]
  get msapl() {
    return ParamFactory.msapl(this);
  }
  // [mssvf="message-storage-file-name";]
  get mssvf() {
    return ParamFactory.mssvf(this);
  }
}
export class Rmswj extends Mswj {}
