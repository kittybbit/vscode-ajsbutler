import * as assert from "assert";
import type { SyntaxDiagnosticDto } from "../../application/editor-feedback/syntaxDiagnosticTypes";

export type ExpectedSyntaxDiagnostic = Pick<
  SyntaxDiagnosticDto,
  "line" | "column" | "length" | "message"
>;

type ExpectedDiagnosticLocation = readonly [
  line: number,
  column: number,
  length: number,
];

export const expectedSyntaxDiagnostic = (
  [line, column, length]: ExpectedDiagnosticLocation,
  message: string,
): ExpectedSyntaxDiagnostic => ({
  line,
  column,
  length,
  message,
});

export const assertSyntaxDiagnostics = (
  actual: readonly SyntaxDiagnosticDto[],
  expected: readonly ExpectedSyntaxDiagnostic[],
): void => {
  assert.deepStrictEqual(
    actual.map(({ line, column, length, message }) => ({
      line,
      column,
      length,
      message,
    })),
    expected,
  );
  assert.deepStrictEqual(
    actual.map((diagnostic) => diagnostic.severity),
    expected.map(() => "error"),
  );
};

type UnitDefinitionFixture = {
  name: string;
  type: string;
  x?: number;
  parameters?: readonly string[];
};

export const buildRootUnitDefinition = (
  units: readonly UnitDefinitionFixture[],
  rootParameters: readonly string[] = [],
): string =>
  [
    "unit=root,,jp1admin,;",
    "{",
    "  ty=g;",
    ...rootParameters.map((parameter) => `  ${parameter}`),
    ...units.map(
      (unit, index) =>
        `  el=${unit.name},${unit.type},+${unit.x ?? index * 160}+0;`,
    ),
    ...units.flatMap((unit) => [
      `  unit=${unit.name},,jp1admin,;`,
      "  {",
      `    ty=${unit.type};`,
      ...(unit.parameters ?? []).map((parameter) => `    ${parameter}`),
      "  }",
    ]),
    "}",
    "",
  ].join("\n");
