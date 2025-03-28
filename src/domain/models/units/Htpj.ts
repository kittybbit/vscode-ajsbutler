import { ParamFactory } from "../parameters/ParameterFactory";
import { UnitEntity } from "./UnitEntities";

export class Htpj extends UnitEntity {
  // htcfl="connection-configuration-file-name";
  get htcfl() {
    return ParamFactory.htcfl(this);
  }
  // [htknd={GET|POST|PUT|DELETE};]
  get htknd() {
    return ParamFactory.htknd(this);
  }
  // [htexm={y|n};]
  get htexm() {
    return ParamFactory.htexm(this);
  }
  // [htrqf="transmission-information-file-name";]
  get htrqf() {
    return ParamFactory.htrqf(this);
  }
  // [htrqu="transmission-information-file-name-(URL-parameter)";]
  get htrqu() {
    return ParamFactory.htrqu(this);
  }
  // [htrqm="transmission-information-file-name-(message-body)";]
  get htrqm() {
    return ParamFactory.htrqm(this);
  }
  // htstf="statuses-store-file-name";
  get htstf() {
    return ParamFactory.htstf(this);
  }
  // [htspt={diff|same};]
  get htspt() {
    return ParamFactory.htspt(this);
  }
  // htrhf="received-header-store-file-name";
  get htrhf() {
    return ParamFactory.htrhf(this);
  }
  // [htrbf="received-body-store-file-name";]
  get htrbf() {
    return ParamFactory.htrbf(this);
  }
  // [htcdm=return-code-1:HTTP-status-code-1,[HTTP-status-code-2...];]
  get htcdm() {
    return ParamFactory.htcdm(this);
  }
  // [so="standard-output-file-name";]
  get so() {
    return ParamFactory.so(this);
  }
  // [se="standard-error-output-file-name";]
  get se() {
    return ParamFactory.se(this);
  }
  // [etm=n;]
  get etm() {
    return ParamFactory.etm(this);
  }
  // [fd=time-required-for-execution;]
  get fd() {
    return ParamFactory.fd(this);
  }
  // [pr=n;]
  get pr() {
    return ParamFactory.pr(this);
  }
  // [ex="execution-agent-name";]
  get ex() {
    return ParamFactory.ex(this);
  }
  // [un="target-user-name";]
  get un() {
    return ParamFactory.un(this);
  }
  // [jd={nm|ab|cod|mdf|exf};]
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
  // [jdf="end-judgment-file-name";]
  get jdf() {
    return ParamFactory.jdf(this);
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
  // [ha={y|n};]
  get ha() {
    return ParamFactory.ha(this);
  }
  // [eu={ent|def};]
  get eu() {
    return ParamFactory.eu(this);
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
export class Rhtpj extends Htpj {}
