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

const flattenUnits = (units: Unit[]): Unit[] =>
  units.reduce<Unit[]>(
    (allUnits, unit) => [...allUnits, unit, ...flattenUnits(unit.children)],
    [],
  );

const findParameter = (unit: Unit, key: string): UnitParameter | undefined =>
  unit.parameters.find((parameter) => parameter.key === key);

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
      const abrParameter = findParameter(unit, "abr");
      if (abrParameter?.value !== "y") {
        return [];
      }

      const effectiveJobEndJudgment =
        findParameter(unit, "jd")?.value ?? DEFAULTS.Jd;
      if (effectiveJobEndJudgment === DEFAULTS.Jd) {
        return [];
      }

      return [
        {
          line: abrParameter.line ?? 1,
          column: abrParameter.column ?? 0,
          length: abrParameter.length ?? abrParameter.key.length,
          message:
            "Automatic retry (abr=y) requires end judgment (jd) to be cod.",
          severity: "error" as const,
        },
      ];
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
  ];
};
