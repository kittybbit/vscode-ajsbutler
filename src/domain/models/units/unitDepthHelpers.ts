export const resolveUnitDepth = (absolutePath: string): number =>
  absolutePath.split("/").filter(Boolean).length - 1;
