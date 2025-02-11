import { WeekSymbol } from "../../values/AjsType";
import { ParamFactory } from "../parameters/ParameterFactory";
import { UnitEntity } from "./UnitEntities";

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
    return ParamFactory.ncl(this, "n");
  }
  // [ncn=jobnet-connector-name;]
  get ncn() {
    return ParamFactory.ncn(this);
  }
  // [ncs={y|n};]
  get ncs() {
    return ParamFactory.ncs(this, "n");
  }
  // [ncex={y|n};]
  get ncex() {
    return ParamFactory.ncex(this, "n");
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
    return this.#judgeWeek("su");
  }

  get mo() {
    return this.#judgeWeek("mo");
  }

  get tu() {
    return this.#judgeWeek("tu");
  }

  get we() {
    return this.#judgeWeek("we");
  }

  get th() {
    return this.#judgeWeek("th");
  }

  get fr() {
    return this.#judgeWeek("fr");
  }

  get sa() {
    return this.#judgeWeek("sa");
  }

  isPlanning() {
    return this.gty?.value() === "p";
  }

  #judgeWeek = (week: WeekSymbol) => {
    if (this.op === undefined && this.cl === undefined) {
      return undefined;
    } else if (this.op && this.op.find((v) => v[week])) {
      return true;
    } else if (this.cl && this.cl.find((v) => v[week])) {
      return false;
    }
    return undefined;
  };
}
