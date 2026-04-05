export type UnitLayout = {
  h: number;
  v: number;
};

const DEFAULT_LAYOUT: UnitLayout = { h: 0, v: 0 };

export const resolveUnitLayout = (
  unitName: string,
  layoutValues: string[],
): UnitLayout => {
  const layoutParameter = layoutValues.find(
    (value) => value.split(",")[0]?.trim() === unitName,
  );
  const hv = layoutParameter?.match(/\+(\d+)\+(\d+)/);

  return hv ? { h: Number(hv[1]), v: Number(hv[2]) } : DEFAULT_LAYOUT;
};
