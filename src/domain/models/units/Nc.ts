import { ParamFactory } from "../parameters/ParameterFactory";
import { WaitableUnitEntity } from "./unitCapabilityEntities";

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
}
