import { Eun } from "../parameters";
import { resolveHasWaitedFor } from "./unitWaitStateHelpers";
import { UnitEntity } from "./UnitEntity";

export abstract class WaitableUnitEntity extends UnitEntity {
  abstract get eun(): Eun[] | undefined;

  /** Whether this unit has a predecessor end that it waits for. */
  get hasWaitedFor() {
    return resolveHasWaitedFor(this.eun);
  }
}
