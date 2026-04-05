import { ParamFactory } from "../parameters/ParameterFactory";
import { WaitableUnitEntity } from "./WaitableUnitEntity";

export class Nc extends WaitableUnitEntity {
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
  // [ega={exec|execdeffer|none};]
  get ega() {
    return ParamFactory.ega(this);
  }
  // [uem={y|n};]
  get uem() {
    return ParamFactory.uem(this);
  }
}
