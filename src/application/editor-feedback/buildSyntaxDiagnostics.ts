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

const findUnitsByTypes = (
  rootUnits: Unit[],
  targetTypes: Set<string>,
): Unit[] =>
  flattenUnits(rootUnits).filter((unit) => {
    const unitType = findParameter(unit, "ty")?.value;
    return unitType ? targetTypes.has(unitType) : false;
  });

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
  value: string | undefined,
  minimum: number,
  maximum: number,
): number | undefined => {
  if (!value || !/^[0-9a-fA-F]{1,8}$/.test(value)) {
    return undefined;
  }

  const numericValue = Number.parseInt(value, 16);
  return numericValue >= minimum && numericValue <= maximum
    ? numericValue
    : undefined;
};

const isValidExplicitColonSeparatedHexadecimalEventId = (
  parameter: UnitParameter | undefined,
): boolean => {
  const rawValue = parameter?.value;
  if (!rawValue) {
    return false;
  }

  const segments = rawValue.split(":");
  if (segments.length !== 2) {
    return false;
  }

  return segments.every(
    (segment) =>
      parseExplicitHexadecimalInRange(segment, 0x00000000, 0xffffffff) !==
      undefined,
  );
};

const isValidExplicitIpv4Address = (
  parameter: UnitParameter | undefined,
): boolean => {
  const rawValue = parameter?.value;
  if (!rawValue) {
    return false;
  }

  const octets = rawValue.split(".");
  if (octets.length !== 4) {
    return false;
  }

  return octets.every((octet) => {
    if (!/^\d+$/.test(octet)) {
      return false;
    }

    const numericValue = Number(octet);
    return numericValue >= 0 && numericValue <= 255;
  });
};

const buildJobEndJudgmentDiagnostics = (
  rootUnits: Unit[],
): SyntaxDiagnosticDto[] =>
  findUnitsByTypes(rootUnits, jobEndJudgmentDiagnosticTargetTypes).flatMap(
    (unit) => {
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
    },
  );

const splitFileMonitoringConditions = (value: string): Set<string> =>
  new Set(value.split(":").filter((condition) => condition.length > 0));

const buildFileMonitoringDiagnostics = (
  rootUnits: Unit[],
): SyntaxDiagnosticDto[] =>
  findUnitsByTypes(rootUnits, fileMonitoringDiagnosticTargetTypes).flatMap(
    (unit) => {
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
    },
  );

const buildEventSendingDiagnostics = (
  rootUnits: Unit[],
): SyntaxDiagnosticDto[] =>
  findUnitsByTypes(rootUnits, eventSendingDiagnosticTargetTypes).flatMap(
    (unit) => {
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
          evsidParameter.value,
          0x00000000,
          0x00001fff,
        ) === undefined &&
        parseExplicitHexadecimalInRange(
          evsidParameter.value,
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
    },
  );

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
  findUnitsByTypes(rootUnits, eventReceivingDiagnosticTargetTypes).flatMap(
    (unit) => {
      const diagnostics: SyntaxDiagnosticDto[] = [];
      const evwidParameter = findParameter(unit, "evwid");
      const evipaParameter = findParameter(unit, "evipa");
      const evescParameter = findParameter(unit, "evesc");

      if (
        evwidParameter &&
        !isValidExplicitColonSeparatedHexadecimalEventId(evwidParameter)
      ) {
        diagnostics.push(
          buildDiagnostic(
            evwidParameter,
            "Event ID (evwid) must be hexadecimal in 00000000:00000000-FFFFFFFF:FFFFFFFF format.",
          ),
        );
      }

      if (evipaParameter && !isValidExplicitIpv4Address(evipaParameter)) {
        diagnostics.push(
          buildDiagnostic(
            evipaParameter,
            "Event source IP address (evipa) must be a dotted-decimal IPv4 address between 0.0.0.0 and 255.255.255.255.",
          ),
        );
      }

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
    },
  );

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
