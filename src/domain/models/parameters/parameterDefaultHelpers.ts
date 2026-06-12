import { DEFAULTS } from "./Defaults";

export type DefaultApplicationMode = "always" | "root-jobnet-only";
export type RootJobnetDefaultParameter = "rg" | "sd" | "ncl" | "ncs" | "ncex";
export type ConnectorControlDefaultParameter = "ncl" | "ncs" | "ncex";

const DEFAULT_RAW_VALUE_BY_PARAMETER: Record<
  RootJobnetDefaultParameter,
  string
> = {
  rg: DEFAULTS.Rg,
  sd: DEFAULTS.Sd,
  ncl: DEFAULTS.Ncl,
  ncs: DEFAULTS.Ncs,
  ncex: DEFAULTS.Ncex,
};

const resolveDefaultRawValue = (
  parameter: RootJobnetDefaultParameter,
): string => DEFAULT_RAW_VALUE_BY_PARAMETER[parameter];

const resolveDefaultForMode = {
  always: (defaultRawValue: string) => defaultRawValue,
  "root-jobnet-only": (defaultRawValue: string, isRootJobnet: boolean) =>
    isRootJobnet ? defaultRawValue : undefined,
} satisfies Record<
  DefaultApplicationMode,
  (defaultRawValue: string, isRootJobnet: boolean) => string | undefined
>;

const resolveScopedDefaultRawValue = (
  defaultRawValue: string,
  mode: DefaultApplicationMode,
  isRootJobnet: boolean,
): string | undefined =>
  resolveDefaultForMode[mode](defaultRawValue, isRootJobnet);

export const resolveRootJobnetDefaultRawValue = (
  parameter: RootJobnetDefaultParameter,
  isRootJobnet: boolean,
): string | undefined =>
  resolveScopedDefaultRawValue(
    resolveDefaultRawValue(parameter),
    "root-jobnet-only",
    isRootJobnet,
  );

export const resolveConnectorControlDefaultRawValue = (
  parameter: ConnectorControlDefaultParameter,
  mode: DefaultApplicationMode,
  isRootJobnet = true,
): string | undefined => {
  return resolveScopedDefaultRawValue(
    resolveDefaultRawValue(parameter),
    mode,
    isRootJobnet,
  );
};
