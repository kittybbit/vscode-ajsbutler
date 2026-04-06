import { ParamFactory } from "../parameters/ParameterFactory";
import { UnitEntity } from "./UnitEntity";
import {
  resolveUnitHasWaitedFor,
  type WaitableUnit,
} from "./unitWaitStateHelpers";

export class Flwj extends UnitEntity implements WaitableUnit {
  // [flwf="name-of-file-to-be-monitored";]
  get flwf() {
    return ParamFactory.flwf(this);
  }
  // [flwc=c[:d[:{s|m}]];]
  get flwc() {
    return ParamFactory.flwc(this);
  }
  // [flwi=monitoring-interval;]
  get flwi() {
    return ParamFactory.flwi(this);
  }
  // [flco={y|n};]
  get flco() {
    return ParamFactory.flco(this);
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
export class Rflwj extends Flwj {}
