import { ParamFactory } from "../parameters/ParameterFactory";
import { MacroPassingExecutionWaitJobUnitEntity } from "./unitCapabilityEntities";

export class Mqwj extends MacroPassingExecutionWaitJobUnitEntity {
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
}
export class Rmqwj extends Mqwj {}
