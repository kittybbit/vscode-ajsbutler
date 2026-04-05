import type { Eun } from "../parameters";

export const resolveHasWaitedFor = (waitedUnits: Eun[] | undefined): boolean =>
  (waitedUnits?.length ?? 0) > 0;
