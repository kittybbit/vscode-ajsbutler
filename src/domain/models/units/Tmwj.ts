import { ParamFactory } from "../parameters/ParameterFactory";
import { UnitEntity } from "./UnitEntity";
import {
  resolveUnitHasWaitedFor,
  type WaitableUnit,
} from "./unitWaitStateHelpers";

export class Tmwj extends UnitEntity implements WaitableUnit {
  // [tmitv=wait-time;]
  get tmitv() {
    return ParamFactory.tmitv(this);
  }
  // [etn={y|n};]
  get etn() {
    return ParamFactory.etn(this);
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
  get hasWaitedFor() {
    return resolveUnitHasWaitedFor(this);
  }
  // [ega={exec|execdeffer|none};]
  get ega() {
    return ParamFactory.ega(this);
  }
  // [uem={y|n};]
  get uem() {
    return ParamFactory.uem(this);
  }
}
export class Rtmwj extends Tmwj {}
