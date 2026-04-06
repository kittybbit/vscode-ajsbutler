import { WeekSymbol } from "../../values/AjsType";
import { ParamFactory } from "../parameters/ParameterFactory";
import { resolveConnectorControlDefaultRawValue } from "../parameters/parameterHelpers";
import { UnitEntity } from "./UnitEntity";
import {
  resolveGroupWeekState,
  resolveIsPlanning,
} from "./unitGroupStateHelpers";

/** job group */
export class G extends UnitEntity {
  // [op={yyyy/mm/dd|{su|mo|tu|we|th|fr|sa}};]
  get op() {
    return ParamFactory.op(this);
  }
  // [cl={yyyy/mm/dd|{su|mo|tu|we|th|fr|sa}};]
  get cl() {
    return ParamFactory.cl(this);
  }
  // [sdd={dd|{su|mo|tu|we|th|fr|sa}:n};]
  get sdd() {
    return ParamFactory.sdd(this);
  }
  // [md={th|ne};]
  get md() {
    return ParamFactory.md(this);
  }
  // [stt=hh:mm;]
  get stt() {
    return ParamFactory.stt(this);
  }
  // [gty={p|n};]
  get gty() {
    return ParamFactory.gty(this);
  }
  // [ncl={y|n};]
  get ncl() {
    return ParamFactory.ncl(this, this.#connectorControlDefault());
  }
  // [ncn=jobnet-connector-name;]
  get ncn() {
    return ParamFactory.ncn(this);
  }
  // [ncs={y|n};]
  get ncs() {
    return ParamFactory.ncs(this, this.#connectorControlDefault());
  }
  // [ncex={y|n};]
  get ncex() {
    return ParamFactory.ncex(this, this.#connectorControlDefault());
  }
  // [nchn="connection-host-name";]
  get nchn() {
    return ParamFactory.nchn(this);
  }
  // [ncsv=connection-service-name;]
  get ncsv() {
    return ParamFactory.ncsv(this);
  }

  get su() {
    return this.#resolveWeekState("su");
  }

  get mo() {
    return this.#resolveWeekState("mo");
  }

  get tu() {
    return this.#resolveWeekState("tu");
  }

  get we() {
    return this.#resolveWeekState("we");
  }

  get th() {
    return this.#resolveWeekState("th");
  }

  get fr() {
    return this.#resolveWeekState("fr");
  }

  get sa() {
    return this.#resolveWeekState("sa");
  }

  isPlanning() {
    return resolveIsPlanning(this.gty?.value());
  }

  #connectorControlDefault() {
    return resolveConnectorControlDefaultRawValue("always-disabled");
  }

  #resolveWeekState(week: WeekSymbol) {
    return resolveGroupWeekState(this.op, this.cl, week);
  }
}
