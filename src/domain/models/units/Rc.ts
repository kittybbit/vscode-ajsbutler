import { ParamFactory } from "../parameters/ParameterFactory";
import { UnitEntity } from "./UnitEntities";

export class Rc extends UnitEntity {
    // [cond={and|or};]
    get cond() { return ParamFactory.cond(this, 'and'); }
    // [mcs={m|w|s};]
    get mcs() { return ParamFactory.mcs(this, 'm'); }
    // [cgs={y|n};]
    get cgs() { return ParamFactory.cgs(this, 'y'); }
    // [ab={exec|hold|stop};]
    get ab() { return ParamFactory.ab(this, 'exec'); }
}