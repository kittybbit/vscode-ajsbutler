import type { Eun } from "../parameters";

type WaitStateSource = Eun | string;

const resolveWaitStateValue = (
  waitedUnit: WaitStateSource,
): string | undefined =>
  typeof waitedUnit === "string" ? waitedUnit : waitedUnit.value();

export const resolveHasWaitedFor = (
  waitedUnits: WaitStateSource[] | undefined,
): boolean =>
  (waitedUnits ?? []).some((waitedUnit) => {
    const value = resolveWaitStateValue(waitedUnit);
    return value !== undefined && value.length > 0;
  });
