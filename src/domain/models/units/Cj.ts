import { ParamFactory } from "../parameters/ParameterFactory";
import { UnitEntity } from "./UnitEntities";

export class Cj extends UnitEntity {
    // [cty="custom-job-class-name";] 
    get cty() { return ParamFactory.cty(this); }
    // [te="command-text";] 
    get te() { return ParamFactory.te(this); }
    // [sc="script-file-name";] 
    get sc() { return ParamFactory.sc(this); }
    // [prm="parameter";] 
    get prm() { return ParamFactory.prm(this); }
    // [env="environment-variable";] 
    get env() { return ParamFactory.env(this); }
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
    // [ex="job-execution-agent-host-name";] 
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
    // [wkp="work-path-name";] 
    get wkp() { return ParamFactory.wkp(this); }
    // [ev="environmental-variable-file-name";] 
    get ev() { return ParamFactory.ev(this); }
    // [si="standard-input-file-name";] 
    get si() { return ParamFactory.si(this); }
    // [soa={new|add};] 
    get soa() { return ParamFactory.soa(this, 'new'); }
    // [sea={new|add};] 
    get sea() { return ParamFactory.sea(this, 'new'); }
    // [ts1="transfer-source-file-name-1";] 
    get ts1() { return ParamFactory.ts1(this); }
    // [td1="transfer-destination-file-name-1";] 
    get td1() { return ParamFactory.td1(this); }
    // [top1={sav|del};] 
    get top1() { return ParamFactory.top1(this, this.ts1 && this.td1 ? 'sav' : this.ts1 && !this.td1 ? 'del' : ''); }
    // [ts2="transfer-source-file-name-2";] 
    get ts2() { return ParamFactory.ts2(this); }
    // [td2="transfer-destination-file-name-2";] 
    get td2() { return ParamFactory.td2(this); }
    // [top2={sav|del};] 
    get top2() { return ParamFactory.top2(this, this.ts2 && this.td2 ? 'sav' : this.ts2 && !this.td2 ? 'del' : ''); }
    // [ts3="transfer-source-file-name-3";] 
    get ts3() { return ParamFactory.ts3(this); }
    // [td3="transfer-destination-file-name-3";] 
    get td3() { return ParamFactory.td3(this); }
    // [top3={sav|del};] 
    get top3() { return ParamFactory.top3(this, this.ts3 && this.td3 ? 'sav' : this.ts3 && !this.td3 ? 'del' : ''); }
    // [ts4="transfer-source-file-name-4";] 
    get ts4() { return ParamFactory.ts4(this); }
    // [td4="transfer-destination-file-name-4";] 
    get td4() { return ParamFactory.td4(this); }
    // [top4={sav|del};] 
    get top4() { return ParamFactory.top4(this, this.ts4 && this.td4 ? 'sav' : this.ts4 && !this.td4 ? 'del' : ''); }
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
export class Rcj extends Cj { }