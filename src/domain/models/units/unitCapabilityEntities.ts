import { ParamFactory } from "../parameters/ParameterFactory";
import {
  resolveUnitPriority,
  type PrioritizableUnit,
} from "./unitPriorityHelpers";
import {
  resolveUnitHasWaitedFor,
  type WaitableUnit,
} from "./unitWaitStateHelpers";
import { UnitEntity } from "./UnitEntity";

export abstract class WaitableUnitEntity
  extends UnitEntity
  implements WaitableUnit
{
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

export abstract class PrioritizableWaitableUnitEntity
  extends WaitableUnitEntity
  implements PrioritizableUnit
{
  // [pr=n;]
  get pr() {
    return ParamFactory.pr(this);
  }

  // [ni=n;]
  get ni() {
    return ParamFactory.ni(this);
  }

  get priority(): number {
    return resolveUnitPriority(this);
  }
}

export abstract class ExecutionUserWaitableUnitEntity extends WaitableUnitEntity {
  // [ha={y|n};]
  get ha() {
    return ParamFactory.ha(this);
  }

  // [eu={ent|def};]
  get eu() {
    return ParamFactory.eu(this);
  }
}

export abstract class ExecutionWaitJobUnitEntity extends ExecutionUserWaitableUnitEntity {
  // [etm=n;]
  get etm() {
    return ParamFactory.etm(this);
  }

  // [fd=time-required-for-execution;]
  get fd() {
    return ParamFactory.fd(this);
  }

  // [ex="execution-agent-name";]
  get ex() {
    return ParamFactory.ex(this);
  }
}

export abstract class MacroPassingExecutionWaitJobUnitEntity extends ExecutionWaitJobUnitEntity {
  // [jpoif=macro-variable-name:passing-information-name;]
  get jpoif() {
    return ParamFactory.jpoif(this);
  }

  // [ets={kl|nr|wr|an};]
  get ets() {
    return ParamFactory.ets(this);
  }
}

export abstract class JobTypeExecutionWaitJobUnitEntity extends ExecutionWaitJobUnitEntity {
  // [jty={q|n};]
  get jty() {
    return ParamFactory.jty(this);
  }
}

export abstract class PlatformExecutionWaitJobUnitEntity extends JobTypeExecutionWaitJobUnitEntity {
  // [pfm={u|p};]
  get pfm() {
    return ParamFactory.pfm(this);
  }
}
