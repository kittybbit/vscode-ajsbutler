import { ParamFactory } from "../parameters/ParameterFactory";
import { UnitEntity } from "./UnitEntities";

export class Mg extends UnitEntity {
    // [mh="manager-host-name";]
    get mh() { return ParamFactory.mh(this); }
    // [mu=manager-unit-name;]
    get mu() { return ParamFactory.mu(this); }
}
export class Mn extends Mg { }
