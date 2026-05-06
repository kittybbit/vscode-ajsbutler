import { parseAjs } from "../../domain/services/parser/AjsParser";
import { DEFAULTS } from "../../domain/models/parameters/Defaults";
import type { Unit, UnitParameter } from "../../domain/values/Unit";

export type SyntaxDiagnosticDto = {
  line: number;
  column: number;
  length: number;
  message: string;
  severity: "error";
};

const jobEndJudgmentDiagnosticTargetTypes = new Set([
  "j",
  "rj",
  "pj",
  "rp",
  "cj",
  "rcj",
]);
const jobEndJudgmentRetryParameterKeys = ["rjs", "rje", "rec", "rei"];
const fileMonitoringDiagnosticTargetTypes = new Set(["flwj", "rflwj"]);
const eventSendingDiagnosticTargetTypes = new Set(["evsj", "revsj"]);
const eventReceivingDiagnosticTargetTypes = new Set(["evwj", "revwj"]);

const flattenUnits = (units: Unit[]): Unit[] =>
  units.reduce<Unit[]>(
    (allUnits, unit) => [...allUnits, unit, ...flattenUnits(unit.children)],
    [],
  );

const findParameter = (unit: Unit, key: string): UnitParameter | undefined =>
  unit.parameters.find((parameter) => parameter.key === key);

const buildDiagnostic = (
  parameter: UnitParameter,
  message: string,
): SyntaxDiagnosticDto => ({
  line: parameter.line ?? 1,
  column: parameter.column ?? 0,
  length: parameter.length ?? parameter.key.length,
  message,
  severity: "error" as const,
});

const parseExplicitDecimalInRange = (
  parameter: UnitParameter | undefined,
  minimum: number,
  maximum: number,
): number | undefined => {
  const rawValue = parameter?.value;
  if (!rawValue || !/^\d+$/.test(rawValue)) {
    return undefined;
  }

  const numericValue = Number(rawValue);
  return numericValue >= minimum && numericValue <= maximum
    ? numericValue
    : undefined;
};

const parseExplicitHexadecimalInRange = (
  parameter: UnitParameter | undefined,
  minimum: number,
  maximum: number,
): number | undefined => {
  const rawValue = parameter?.value;
  if (!rawValue || !/^[0-9a-fA-F]{1,8}$/.test(rawValue)) {
    return undefined;
  }

  const numericValue = Number.parseInt(rawValue, 16);
  return numericValue >= minimum && numericValue <= maximum
    ? numericValue
    : undefined;
};

const buildJobEndJudgmentDiagnostics = (
  rootUnits: Unit[],
): SyntaxDiagnosticDto[] =>
  flattenUnits(rootUnits)
    .filter((unit) => {
      const unitType = findParameter(unit, "ty")?.value;
      return unitType
        ? jobEndJudgmentDiagnosticTargetTypes.has(unitType)
        : false;
    })
    .flatMap((unit) => {
      const diagnostics: SyntaxDiagnosticDto[] = [];
      const abrParameter = findParameter(unit, "abr");
      const effectiveJobEndJudgment =
        findParameter(unit, "jd")?.value ?? DEFAULTS.Jd;
      const effectiveAutomaticRetry = abrParameter?.value ?? DEFAULTS.Abr;

      if (effectiveJobEndJudgment !== DEFAULTS.Jd) {
        if (abrParameter?.value === "y") {
          diagnostics.push(
            buildDiagnostic(
              abrParameter,
              "Automatic retry (abr=y) requires end judgment (jd) to be cod.",
            ),
          );
        }

        for (const retryParameterKey of jobEndJudgmentRetryParameterKeys) {
          const retryParameter = findParameter(unit, retryParameterKey);
          if (!retryParameter) {
            continue;
          }

          diagnostics.push(
            buildDiagnostic(
              retryParameter,
              `Retry parameter (${retryParameterKey}) requires end judgment (jd) to be cod.`,
            ),
          );
        }

        return diagnostics;
      }

      if (effectiveAutomaticRetry === "y") {
        return diagnostics;
      }

      for (const retryParameterKey of jobEndJudgmentRetryParameterKeys) {
        const retryParameter = findParameter(unit, retryParameterKey);
        if (!retryParameter) {
          continue;
        }

        diagnostics.push(
          buildDiagnostic(
            retryParameter,
            `Retry parameter (${retryParameterKey}) requires automatic retry (abr) to be y.`,
          ),
        );
      }

      return diagnostics;
    });

const splitFileMonitoringConditions = (value: string): Set<string> =>
  new Set(value.split(":").filter((condition) => condition.length > 0));

const buildFileMonitoringDiagnostics = (
  rootUnits: Unit[],
): SyntaxDiagnosticDto[] =>
  flattenUnits(rootUnits)
    .filter((unit) => {
      const unitType = findParameter(unit, "ty")?.value;
      return unitType
        ? fileMonitoringDiagnosticTargetTypes.has(unitType)
        : false;
    })
    .flatMap((unit) => {
      const diagnostics: SyntaxDiagnosticDto[] = [];
      const flwcParameter = findParameter(unit, "flwc");
      const flcoParameter = findParameter(unit, "flco");
      const effectiveFlwc = flwcParameter?.value ?? DEFAULTS.Flwc;
      const flwcConditions = splitFileMonitoringConditions(effectiveFlwc);

      if (flwcParameter && flwcConditions.has("s") && flwcConditions.has("m")) {
        diagnostics.push(
          buildDiagnostic(
            flwcParameter,
            "File monitoring condition (flwc) cannot specify both s and m.",
          ),
        );
      }

      if (flcoParameter && !flwcConditions.has("c")) {
        diagnostics.push(
          buildDiagnostic(
            flcoParameter,
            "File close option (flco) requires file creation monitoring (flwc=c).",
          ),
        );
      }

      return diagnostics;
    });

const buildEventSendingDiagnostics = (
  rootUnits: Unit[],
): SyntaxDiagnosticDto[] =>
  flattenUnits(rootUnits)
    .filter((unit) => {
      const unitType = findParameter(unit, "ty")?.value;
      return unitType ? eventSendingDiagnosticTargetTypes.has(unitType) : false;
    })
    .flatMap((unit) => {
      const diagnostics: SyntaxDiagnosticDto[] = [];
      const evsidParameter = findParameter(unit, "evsid");
      const evsrtParameter = findParameter(unit, "evsrt");
      const evhstParameter = findParameter(unit, "evhst");
      const evsplParameter = findParameter(unit, "evspl");
      const evsrcParameter = findParameter(unit, "evsrc");
      const effectiveEvsrt = evsrtParameter?.value ?? DEFAULTS.Evsrt;

      if (
        evsidParameter &&
        parseExplicitHexadecimalInRange(
          evsidParameter,
          0x00000000,
          0x00001fff,
        ) === undefined &&
        parseExplicitHexadecimalInRange(
          evsidParameter,
          0x7fff8000,
          0x7fffffff,
        ) === undefined
      ) {
        diagnostics.push(
          buildDiagnostic(
            evsidParameter,
            "Event ID (evsid) must be hexadecimal within 00000000-00001FFF or 7FFF8000-7FFFFFFF.",
          ),
        );
      }

      if (
        evsplParameter &&
        parseExplicitDecimalInRange(evsplParameter, 3, 600) === undefined
      ) {
        diagnostics.push(
          buildDiagnostic(
            evsplParameter,
            "Event arrival check interval (evspl) must be between 3 and 600.",
          ),
        );
      }

      if (
        evsrcParameter &&
        parseExplicitDecimalInRange(evsrcParameter, 0, 999) === undefined
      ) {
        diagnostics.push(
          buildDiagnostic(
            evsrcParameter,
            "Event arrival check count (evsrc) must be between 0 and 999.",
          ),
        );
      }

      if (evsrtParameter && effectiveEvsrt === "y" && !evhstParameter) {
        diagnostics.push(
          buildDiagnostic(
            evsrtParameter,
            "Event arrival check (evsrt=y) requires an event destination host (evhst).",
          ),
        );
      }

      return diagnostics;
    });

const isValidExplicitEventSearchCondition = (
  parameter: UnitParameter | undefined,
): boolean => {
  const rawValue = parameter?.value;
  if (!rawValue) {
    return false;
  }

  if (rawValue === "no") {
    return true;
  }

  return parseExplicitDecimalInRange(parameter, 1, 720) !== undefined;
};

const buildEventReceivingDiagnostics = (
  rootUnits: Unit[],
): SyntaxDiagnosticDto[] =>
  flattenUnits(rootUnits)
    .filter((unit) => {
      const unitType = findParameter(unit, "ty")?.value;
      return unitType
        ? eventReceivingDiagnosticTargetTypes.has(unitType)
        : false;
    })
    .flatMap((unit) => {
      const diagnostics: SyntaxDiagnosticDto[] = [];
      const evescParameter = findParameter(unit, "evesc");

      if (
        evescParameter &&
        !isValidExplicitEventSearchCondition(evescParameter)
      ) {
        diagnostics.push(
          buildDiagnostic(
            evescParameter,
            "Event search condition (evesc) must be no or between 1 and 720.",
          ),
        );
      }

      return diagnostics;
    });

export const buildSyntaxDiagnostics = (
  content: string,
): SyntaxDiagnosticDto[] => {
  const result = parseAjs(content);
  const syntaxDiagnostics = result.errors.map((error) => ({
    line: error.line,
    column: error.charPositionInLine,
    length: 1,
    message: error.msg,
    severity: "error" as const,
  }));
  if (syntaxDiagnostics.length > 0) {
    return syntaxDiagnostics;
  }

  return [
    ...syntaxDiagnostics,
    ...buildJobEndJudgmentDiagnostics(result.rootUnits),
    ...buildFileMonitoringDiagnostics(result.rootUnits),
    ...buildEventSendingDiagnostics(result.rootUnits),
    ...buildEventReceivingDiagnostics(result.rootUnits),
  ];
};
