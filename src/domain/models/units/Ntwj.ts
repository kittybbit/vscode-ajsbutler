import { ParamFactory } from "../parameters/ParameterFactory";
import { MacroPassingExecutionWaitJobUnitEntity } from "./unitCapabilityEntities";

export class Ntwj extends MacroPassingExecutionWaitJobUnitEntity {
  // [ntlgt={sys|sec|app|dns|dir|frs|oth};]
  get ntlgt() {
    return ParamFactory.ntlgt(this);
  }
  // [ntolg="any-log-type";]
  get ntolg() {
    return ParamFactory.ntolg(this);
  }
  // [ntevt=[v[: i[: w[: e[: s[: c[: f]]]]]]];]
  get ntevt() {
    return ParamFactory.ntevt(this);
  }
  // [ntnsr={y|n};]
  get ntnsr() {
    return ParamFactory.ntnsr(this);
  }
  // [ntsrc="source";]
  get ntsrc() {
    return ParamFactory.ntsrc(this);
  }
  // [ntncl={y|n};]
  get ntncl() {
    return ParamFactory.ntncl(this);
  }
  // [ntcls="class";]
  get ntcls() {
    return ParamFactory.ntcls(this);
  }
  // [ntnei={y|n};]
  get ntnei() {
    return ParamFactory.ntnei(this);
  }
  // [nteid=event-ID;]
  get nteid() {
    return ParamFactory.nteid(this);
  }
  // [ntdis="explanation";]
  get ntdis() {
    return ParamFactory.ntdis(this);
  }
}
export class Rntwj extends Ntwj {}
