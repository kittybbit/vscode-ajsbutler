import { ParamFactory } from "../parameters/ParameterFactory";
import { UnitEntity } from "./UnitEntities";

export class Mlsj extends UnitEntity {
  // [mladr={to|cc|bcc}:"address";]
  get mladr() {
    return ParamFactory.mladr(this);
  }
  // [mlprf="profile-name";]
  get mlprf() {
    return ParamFactory.mlprf(this);
  }
  // [mlsbj="subject";]
  get mlsbj() {
    return ParamFactory.mlsbj(this);
  }
  // [mltxt="text";]
  get mltxt() {
    return ParamFactory.mltxt(this);
  }
  // [mlftx="text-file-name";]
  get mlftx() {
    return ParamFactory.mlftx(this);
  }
  // [mlatf="attached-file-name";]
  get mlatf() {
    return ParamFactory.mlatf(this);
  }
  // [mlafl="attached-file-list-name";]
  get mlafl() {
    return ParamFactory.mlafl(this);
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
export class Rmlsj extends Mlsj {}
