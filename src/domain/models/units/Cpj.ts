import { ParamFactory } from "../parameters/ParameterFactory";
import { UnitEntity } from "./UnitEntities";

export class Cpj extends UnitEntity {
    // cty="AJSVAR"; 
    get cty() { return ParamFactory.cty(this); }
    // sc="$JP1AJS2_JPOEXEPATH$/jpqpinfoset"; 
    get sc() { return ParamFactory.sc(this); }
    // prm="-o output-variable-1 [-o output-variable-2...]"; 
    get prm() { return ParamFactory.prm(this); }
    // env="AJS2SO_GLOBMACFILE=?AJS2SO_GLOBMACFILE?"; 
    // env="AJS2SO_STDOUTFILE=?AJS2SO_STDOUTFILE?"; 
    // env="AJS2SO_RE_output-variable-1=regular-expression-1"; 
    // [env="AJS2SO_RE_output-variable-2=regular-expression-2";...] 
    get env() { return ParamFactory.env(this); }
    // [wth=n;] 
    get wth() { return ParamFactory.wth(this); }
    // [tho=n;] 
    get tho() { return ParamFactory.tho(this, '0'); }
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
export class Rcpj extends Cpj { }