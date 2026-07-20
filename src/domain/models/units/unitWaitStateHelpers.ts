import type { Eun } from "../parameters";
import { resolveAjsUnitHasWaitedFor } from "../ajs/AjsUnitState";

type WaitStateSource = Eun | string;

export interface WaitableUnit {
  readonly eun: Eun[] | undefined;
  readonly hasWaitedFor: boolean;
}

type WaitableUnitLike = {
  eun: WaitStateSource[] | undefined;
};

const resolveWaitStateValue = (
  waitedUnit: WaitStateSource,
): string | undefined =>
  typeof waitedUnit === "string" ? waitedUnit : waitedUnit.value();

export const resolveHasWaitedFor = (
  waitedUnits: WaitStateSource[] | undefined,
): boolean =>
  (waitedUnits ?? []).some((waitedUnit) => {
    const value = resolveWaitStateValue(waitedUnit);
    return resolveAjsUnitHasWaitedFor(
      value === undefined ? undefined : [value],
    );
  });

export const resolveUnitHasWaitedFor = (unit: WaitableUnitLike): boolean =>
  resolveHasWaitedFor(unit.eun);
