import { ParamFactory } from "../parameters/ParameterFactory";
import { MacroPassingExecutionWaitJobUnitEntity } from "./unitCapabilityEntities";

export class Mlwj extends MacroPassingExecutionWaitJobUnitEntity {
  // [pfm={u|p};]
  get pfm() {
    return ParamFactory.pfm(this);
  }
  // [mlprf="profile-name";]
  get mlprf() {
    return ParamFactory.mlprf(this);
  }
  // [mladr="sender";]
  get mladr() {
    return ParamFactory.mladr(this);
  }
  // [mlsbj="subject";]
  get mlsbj() {
    return ParamFactory.mlsbj(this);
  }
  // [mltxt="text";]
  get mltxt() {
    return ParamFactory.mltxt(this);
  }
  // [mlsav={y|n};]
  get mlsav() {
    return ParamFactory.mlsav(this);
  }
  // [mllst="received-email-list";]
  get mllst() {
    return ParamFactory.mllst(this);
  }
  // [mlstx="name-of-text-file";]
  get mlstx() {
    return ParamFactory.mlstx(this);
  }
  // [mlsfd="name-of-folder-to-save-attached-file";]
  get mlsfd() {
    return ParamFactory.mlsfd(this);
  }
  // [mlafl="name-of-list-file";]
  get mlafl() {
    return ParamFactory.mlafl(this);
  }
}
export class Rmlwj extends Mlwj {}
