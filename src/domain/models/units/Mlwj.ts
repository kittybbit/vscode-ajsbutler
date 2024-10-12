import { ParamFactory } from "../parameters/ParameterFactory";
import { UnitEntity } from "./UnitEntities";

export class Mlwj extends UnitEntity {
    // [pfm={u|p};] 
    get pfm() { return ParamFactory.pfm(this, 'p'); }
    // [mlprf="profile-name";] 
    get mlprf() { return ParamFactory.mlprf(this); }
    // [mladr="sender";] 
    get mladr() { return ParamFactory.mladr(this); }
    // [mlsbj="subject";] 
    get mlsbj() { return ParamFactory.mlsbj(this); }
    // [mltxt="text";] 
    get mltxt() { return ParamFactory.mltxt(this); }
    // [mlsav={y|n};] 
    get mlsav() { return ParamFactory.mlsav(this, 'y'); }
    // [mllst="received-email-list";] 
    get mllst() { return ParamFactory.mllst(this); }
    // [mlstx="name-of-text-file";] 
    get mlstx() { return ParamFactory.mlstx(this); }
    // [mlsfd="name-of-folder-to-save-attached-file";] 
    get mlsfd() { return ParamFactory.mlsfd(this); }
    // [mlafl="name-of-list-file";] 
    get mlafl() { return ParamFactory.mlafl(this); }
    // [jpoif=macro-variable-name:passing-information-name;] 
    get jpoif() { return ParamFactory.jpoif(this); }
    // [etm=n;] 
    get etm() { return ParamFactory.etm(this); }
    // [fd=time-required-for-execution;] 
    get fd() { return ParamFactory.fd(this); }
    // [ex="execution-agent-name";] 
    get ex() { return ParamFactory.ex(this); }
    // [ha={y|n};] 
    get ha() { return ParamFactory.ha(this, 'n'); }
    // [eu={ent|def};] 
    get eu() { return ParamFactory.eu(this, 'ent'); }
    // [ets={kl|nr|wr|an};] 
    get ets() { return ParamFactory.ets(this, 'kl'); }
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
export class Rmlwj extends Mlwj { }