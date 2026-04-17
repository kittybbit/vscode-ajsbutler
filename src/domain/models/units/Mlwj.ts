import { ParamFactory } from "../parameters/ParameterFactory";
import { WaitableUnitEntity } from "./unitCapabilityEntities";

export class Mlwj extends WaitableUnitEntity {
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
export class Rmlwj extends Mlwj {}
