import { ParamFactory } from "../parameters/ParameterFactory";
import { PrioritizableWaitableUnitEntity } from "./unitCapabilityEntities";

export class Qj extends PrioritizableWaitableUnitEntity {
  // [qu="queue-name";]
  get qu() {
    return ParamFactory.qu(this);
  }
  // [qm="queue-name";]
  get qm() {
    return ParamFactory.qm(this);
  }
  // [req="job-name";]
  get req() {
    return ParamFactory.req(this);
  }
  // [sc="script-file-name";]
  get sc() {
    return ParamFactory.sc(this);
  }
  // [prm="parameter";]
  get prm() {
    return ParamFactory.prm(this);
  }
  // [fd=time-required-for-execution;]
  get fd() {
    return ParamFactory.fd(this);
  }
  // [jd={nm|ab|cod};]
  get jd() {
    return ParamFactory.jd(this);
  }
  // [wth=n;]
  get wth() {
    return ParamFactory.wth(this);
  }
  // [tho=n;]
  get tho() {
    return ParamFactory.tho(this);
  }
  // [abr={y|n};]
  get abr() {
    return ParamFactory.abr(this);
  }
  // [rjs=lower-limit-of-return-codes-to-be-retried-automatically;]
  get rjs() {
    return ParamFactory.rjs(this);
  }
  // [rje=upper-limit-of-return-codes-to-be-retried-automatically;]
  get rje() {
    return ParamFactory.rje(this);
  }
  // [rec=maximum-number-of-retry-executions;]
  get rec() {
    return ParamFactory.rec(this);
  }
  // [rei=retry-interval;]
  get rei() {
    return ParamFactory.rei(this);
  }
  // [ts1="transfer-source-file-name-1";]
  get ts1() {
    return ParamFactory.ts1(this);
  }
  // [td1="transfer-destination-file-name-1";]
  get td1() {
    return ParamFactory.td1(this);
  }
  // [ts2="transfer-source-file-name-2";]
  get ts2() {
    return ParamFactory.ts2(this);
  }
  // [td2="transfer-destination-file-name-2";]
  get td2() {
    return ParamFactory.td2(this);
  }
  // [ts3="transfer-source-file-name-3";]
  get ts3() {
    return ParamFactory.ts3(this);
  }
  // [td3="transfer-destination-file-name-3";]
  get td3() {
    return ParamFactory.td3(this);
  }
  // [ts4="transfer-source-file-name-4";]
  get ts4() {
    return ParamFactory.ts4(this);
  }
  // [td4="transfer-destination-file-name-4";]
  get td4() {
    return ParamFactory.td4(this);
  }
  // [ha={y|n};]
  get ha() {
    return ParamFactory.ha(this);
  }
  // [eu={ent|def};]
  get eu() {
    return ParamFactory.eu(this);
  }
}
export class Rq extends Qj {}
