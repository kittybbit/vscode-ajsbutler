import { ParamFactory } from "../parameters/ParameterFactory";
import { UnitEntity } from "./UnitEntity";
import {
  resolveUnitHasWaitedFor,
  type WaitableUnit,
} from "./unitWaitStateHelpers";

export class Nc extends UnitEntity implements WaitableUnit {
  // [ncr=connection-destination-root-jobnet-name;]
  get ncr() {
    return ParamFactory.ncr(this);
  }
  // [ncex={y|n};]
  get ncex() {
    return ParamFactory.ncex(this);
  }
  // [nchn="connection-host-name";]
  get nchn() {
    return ParamFactory.nchn(this);
  }
  // [ncsv=connection-service-name;]
  get ncsv() {
    return ParamFactory.ncsv(this);
  }
  // [mm={and|or};]
  get mm() {
    return ParamFactory.mm(this);
  }
  // [nmg={y|n};]
  get nmg() {
    return ParamFactory.nmg(this);
  }
  // [eun=name-of-the-unit-whose-end-is-being-waited-for;]
  get eun() {
    return ParamFactory.eun(this);
  }
  get hasWaitedFor() {
    return resolveUnitHasWaitedFor(this);
  }
  // [ega={exec|execdeffer|none};]
  get ega() {
    return ParamFactory.ega(this);
  }
  // [uem={y|n};]
  get uem() {
    return ParamFactory.uem(this);
  }
}
