import { ParamFactory } from "../parameters/ParameterFactory";
import { UnitEntity } from "./UnitEntities";

export class Rc extends UnitEntity {
    // [cond={and|or};]
    get cond() { return ParamFactory.cond(this); }
    // [mcs={m|w|s};]
    get mcs() { return ParamFactory.mcs(this); }
    // [cgs={y|n};]
    get cgs() { return ParamFactory.cgs(this); }
    // [ab={exec|hold|stop};]
    get ab() { return ParamFactory.ab(this); }
}