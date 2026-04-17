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
