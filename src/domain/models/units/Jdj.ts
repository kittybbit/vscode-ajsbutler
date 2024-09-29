import { ParamFactory } from "../parameters/ParameterFactory";
import { UnitEntity } from "./UnitEntities";

export class Jdj extends UnitEntity {
    // [ej={gt|ge|lt|le|eq|ne|ri|ro|ef|nf|vgt|vge|vlt|vle|veq|vne|vri|vro|sce|spe|sne|spn|snn|snl};]
    get ej() { return ParamFactory.ej(this, 'gt'); }
    // [ejc=judgment-return-code;]
    get ejc() { return ParamFactory.ejc(this, '0'); }
    // [ejl=lower-limit-of-judgment-return-codes;]
    get ejl() { return ParamFactory.ejl(this); }
    // [ejh=upper-limit-of-judgment-return-codes;]
    get ejh() { return ParamFactory.ejh(this); }
    // [ejf="end-judgment-file-name";]
    get ejf() { return ParamFactory.ejf(this); }
    // [ejv=variable-name;]
    get ejv() { return ParamFactory.ejv(this); }
    // [ejt="judgment-value-for-variable (string)";]
    get ejt() { return ParamFactory.ejt(this); }
    // [eji=judgment-value-for-variable (numeric);]
    get eji() { return ParamFactory.eji(this, '0'); }
    // [ejs=lower-limit-judgment-value-for-variable_(numeric);]
    get ejs() { return ParamFactory.ejs(this); }
    // [ejg=upper-limit-judgment-value-for-variable_(numeric);]
    get ejg() { return ParamFactory.ejg(this); }
    // [ejm={gt|ge};]
    get ejm() { return ParamFactory.ejm(this, 'ge'); }
    // [eju={lt|le};]
    get eju() { return ParamFactory.eju(this, 'le'); }
    // [ha={y|n};]
    get ha() { return ParamFactory.ha(this, 'n'); }
}
export class Rjdj extends Jdj { }