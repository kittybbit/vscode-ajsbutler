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
      if (effectiveJobEndJudgment === DEFAULTS.Jd) {
        return [];
      }

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
  ];
};
