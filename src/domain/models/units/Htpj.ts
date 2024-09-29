import { ParamFactory } from "../parameters/ParameterFactory";
import { UnitEntity } from "./UnitEntities";

export class Htpj extends UnitEntity {
    // htcfl="connection-configuration-file-name"; 
    get htcfl() { return ParamFactory.htcfl(this); }
    // [htknd={GET|POST|PUT|DELETE};] 
    get htknd() { return ParamFactory.htknd(this, 'GET'); }
    // [htexm={y|n};] 
    get htexm() { return ParamFactory.htexm(this, 'n'); }
    // [htrqf="transmission-information-file-name";] 
    get htrqf() { return ParamFactory.htrqf(this); }
    // [htrqu="transmission-information-file-name-(URL-parameter)";] 
    get htrqu() { return ParamFactory.htrqu(this); }
    // [htrqm="transmission-information-file-name-(message-body)";] 
    get htrqm() { return ParamFactory.htrqm(this); }
    // htstf="statuses-store-file-name"; 
    get htstf() { return ParamFactory.htstf(this); }
    // [htspt={diff|same};] 
    get htspt() { return ParamFactory.htspt(this, 'diff'); }
    // htrhf="received-header-store-file-name"; 
    get htrhf() { return ParamFactory.htrhf(this); }
    // [htrbf="received-body-store-file-name";] 
    get htrbf() { return ParamFactory.htrbf(this); }
    // [htcdm=return-code-1:HTTP-status-code-1,[HTTP-status-code-2...];] 
    get htcdm() { return ParamFactory.htcdm(this); }
    // [so="standard-output-file-name";] 
    get so() { return ParamFactory.so(this); }
    // [se="standard-error-output-file-name";] 
    get se() { return ParamFactory.se(this); }
    // [etm=n;] 
    get etm() { return ParamFactory.etm(this); }
    // [fd=time-required-for-execution;] 
    get fd() { return ParamFactory.fd(this); }
    // [pr=n;] 
    get pr() { return ParamFactory.pr(this, '1'); }
    // [ex="execution-agent-name";] 
    get ex() { return ParamFactory.ex(this); }
    // [un="target-user-name";] 
    get un() { return ParamFactory.un(this); }
    // [jd={nm|ab|cod|mdf|exf};] 
    get jd() { return ParamFactory.jd(this, 'cod'); }
    // [wth=n;] 
    get wth() { return ParamFactory.wth(this); }
    // [tho=n;] 
    get tho() { return ParamFactory.tho(this, '0'); }
    // [jdf="end-judgment-file-name";] 
    get jdf() { return ParamFactory.jdf(this); }
    // [abr={y|n};] 
    get abr() { return ParamFactory.abr(this, 'n'); }
    // [rjs=lower-limit-of-return-codes-to-be-retried-automatically;] 
    get rjs() { return ParamFactory.rjs(this); }
    // [rje=upper-limit-of-return-codes-to-be-retried-automatically;] 
    get rje() { return ParamFactory.rje(this); }
    // [rec=maximum-number-of-retry-executions;] 
    get rec() { return ParamFactory.rec(this, '1'); }
    // [rei=retry-interval;]  
    get rei() { return ParamFactory.rei(this, '1'); }
    // [ha={y|n};] 
    get ha() { return ParamFactory.ha(this, 'n'); }
    // [eu={ent|def};] 
    get eu() { return ParamFactory.eu(this, 'ent'); }
    // [mm={and|or};] 
    get mm() { return ParamFactory.mm(this, 'and'); }
    // [nmg={y|n};] 
    get nmg() { return ParamFactory.nmg(this, 'n'); }
    // [eun=name-of-the-unit-whose-end-is-being-waited-for;] 
    get eun() { return ParamFactory.eun(this); }
    // [ega={exec|execdeffer|none};] 
    get ega() { return ParamFactory.ega(this, 'none'); }
    // [uem={y|n};] 
    get uem() { return ParamFactory.uem(this, 'n'); }
}
export class Rhtpj extends Htpj { }