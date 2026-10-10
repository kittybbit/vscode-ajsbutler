import * as assert from "assert";
import * as fs from "fs";
import * as path from "path";
import {
  architectureRuleIds,
  findArchitectureRuleViolations,
  findCompositionRootViolations,
  findParserPortBoundaryViolations,
  findTelemetryBoundaryViolations,
  formatViolation,
  type ArchitectureRuleId,
} from "../support/architectureDependencyRules";
import {
  collectImportReferencesFromSource,
  collectImportedConstructionReferencesFromSource,
} from "../support/architectureSourceAnalysis";
import {
  collectProductionApplicationFactoryDefinitions,
  collectProductionConstructionReferences,
  collectProductionImportReferences,
  collectProductionSourceFiles,
} from "../support/architectureRepositoryCollection";

const repoRoot = path.resolve(__dirname, "../../..");

suite("Architecture dependency rules", () => {
  test("keeps editor-feedback application independent from localization implementations", () => {
    const forbiddenReferences = collectProductionImportReferences(repoRoot)
      .filter(({ file }) => file.startsWith("src/application/editor-feedback/"))
      .filter(
        ({ resolvedPath, specifier }) =>
          resolvedPath?.startsWith("src/domain/services/i18n/") ||
          resolvedPath?.startsWith("src/resource/") ||
          specifier === "vscode",
      )
      .map(({ file, specifier }) => ({ file, specifier }));

    assert.deepStrictEqual(forbiddenReferences, []);
  });

  test("keeps every production dependency rule at zero violations", () => {
    const violations = findArchitectureRuleViolations(
      collectProductionImportReferences(repoRoot),
    );

    assert.deepStrictEqual(violations.map(formatViolation), []);
  });

  test("preserves formatted violation messages and multiple-rule order", () => {
    const references = collectImportReferencesFromSource(
      "src/presentation/vscode/example.ts",
      'import { Adapter } from "../../infrastructure/example/Adapter";',
    );
    const violations = findArchitectureRuleViolations(references);

    assert.deepStrictEqual(
      violations.map(({ ruleId }) => ruleId),
      [
        architectureRuleIds.presentationOuterImplementation,
        architectureRuleIds.concreteInfrastructureOutsideComposition,
      ],
    );
    assert.deepStrictEqual(violations.map(formatViolation), [
      "src/presentation/vscode/example.ts imports ../../infrastructure/example/Adapter [presentation-outer-implementation] (presentation must not import infrastructure or bootstrap)",
      "src/presentation/vscode/example.ts imports ../../infrastructure/example/Adapter [concrete-infrastructure-outside-composition] (concrete infrastructure must be referenced only by infrastructure or bootstrap)",
    ]);
  });

  test("keeps the application parser port at the normalized adapter", () => {
    assert.deepStrictEqual(
      findParserPortBoundaryViolations(
        collectProductionImportReferences(repoRoot),
      ),
      [],
    );
  });

  test("rejects parser raw-seam port imports in every import form", () => {
    const fixtures = [
      {
        file: "src/infrastructure/parser/SyntaxErrorListener.ts",
        source:
          'import { AjsParserError } from "../../application/parsing/AjsParserPort";',
      },
      {
        file: "src/infrastructure/parser/AntlrRawAjsParser.ts",
        source:
          'import type { AjsParserError } from "../../application/parsing/AjsParserPort";',
      },
      {
        file: "src/infrastructure/parser/AntlrRawAjsParser.ts",
        source:
          'import { type ParseAjsResult } from "../../application/parsing/AjsParserPort";',
      },
    ];

    fixtures.forEach(({ file, source }) => {
      assert.deepStrictEqual(
        findParserPortBoundaryViolations(
          collectImportReferencesFromSource(file, source),
        ).map(({ file: violationFile, kind, specifier }) => ({
          file: violationFile,
          kind,
          specifier,
        })),
        [
          {
            file,
            kind: source.includes("import type") ? "import-type" : "import",
            specifier: "../../application/parsing/AjsParserPort",
          },
        ],
      );
    });
  });

  test("allows parser port imports only in the normalized adapter", () => {
    const fixtures = [
      'import { AjsParserPort, ParseAjsResult } from "../../application/parsing/AjsParserPort";',
      'import type { AjsParserPort, ParseAjsResult } from "../../application/parsing/AjsParserPort";',
      'import { type AjsParserPort, type ParseAjsResult } from "../../application/parsing/AjsParserPort";',
    ];

    fixtures.forEach((source) => {
      assert.deepStrictEqual(
        findParserPortBoundaryViolations(
          collectImportReferencesFromSource(
            "src/infrastructure/parser/AntlrAjsParser.ts",
            source,
          ),
        ),
        [],
      );
    });
  });

  test("rejects internal telemetry imports from outer callers in every import form", () => {
    const internalNames = [
      "telemetryEvents",
      "TelemetryEventDefinition",
      "TelemetryPropertyInput",
      "createTelemetryEvent",
      "allowTelemetryProperties",
    ];
    const moduleSpecifier = "../../application/telemetry/telemetryEvent";
    const fixtures = internalNames.flatMap((name) => [
      {
        file: "src/bootstrap/extension/example.ts",
        source: `import { ${name} } from "${moduleSpecifier}";`,
      },
      {
        file: "src/presentation/vscode/example.ts",
        source: `import type { ${name} } from "${moduleSpecifier}";`,
      },
      {
        file: "src/presentation/vscode/example.ts",
        source: `import { type ${name} } from "${moduleSpecifier}";`,
      },
    ]);

    fixtures.forEach(({ file, source }) => {
      assert.strictEqual(
        findTelemetryBoundaryViolations(
          collectImportReferencesFromSource(file, source),
        ).length,
        1,
        `${file} must reject ${source}`,
      );
    });
  });

  test("allows the public telemetry port and named builders", () => {
    const fixtures = [
      {
        file: "src/bootstrap/extension/example.ts",
        source:
          'import type { TelemetryPort, ValidatedTelemetryEvent } from "../../application/telemetry/TelemetryPort";',
      },
      {
        file: "src/presentation/vscode/example.ts",
        source:
          'import { type ValidatedTelemetryEvent } from "../../application/telemetry/TelemetryPort";',
      },
      {
        file: "src/presentation/vscode/example.ts",
        source:
          'import { createLegacyWebviewOperationEvent } from "../../application/telemetry/viewerActionTelemetry";',
      },
    ];

    fixtures.forEach(({ file, source }) => {
      assert.deepStrictEqual(
        findTelemetryBoundaryViolations(
          collectImportReferencesFromSource(file, source),
        ),
        [],
      );
    });

    assert.deepStrictEqual(
      findTelemetryBoundaryViolations(
        collectProductionImportReferences(repoRoot),
      ),
      [],
    );
  });

  test("keeps raw telemetry reporting calls out of production sources", () => {
    const rawReportingCallers = collectProductionSourceFiles(repoRoot)
      .filter((filePath) =>
        /\btrackEvent\s*(?:\(|:)/u.test(fs.readFileSync(filePath, "utf8")),
      )
      .map((filePath) => path.relative(repoRoot, filePath))
      .sort();

    assert.deepStrictEqual(rawReportingCallers, []);
  });

  test("detects every architecture rule family with in-memory fixtures", () => {
    const stableRuleIds = Object.values(architectureRuleIds);
    assert.strictEqual(stableRuleIds.length, 12);
    assert.strictEqual(new Set(stableRuleIds).size, stableRuleIds.length);

    const fixtures: ReadonlyArray<{
      ruleId: ArchitectureRuleId;
      file: string;
      source: string;
    }> = [
      {
        ruleId: architectureRuleIds.domainOuterDependency,
        file: "src/domain/example.ts",
        source: 'import "../presentation/example";',
      },
      {
        ruleId: architectureRuleIds.applicationOuterDependency,
        file: "src/application/example.ts",
        source: 'import "../infrastructure/example";',
      },
      {
        ruleId: architectureRuleIds.presentationOuterImplementation,
        file: "src/presentation/example.ts",
        source: 'import "../infrastructure/example";',
      },
      {
        ruleId: architectureRuleIds.infrastructureOuterDependency,
        file: "src/infrastructure/example.ts",
        source: 'import "../presentation/example";',
      },
      {
        ruleId: architectureRuleIds.concreteInfrastructureOutsideComposition,
        file: "src/resource/example.ts",
        source: 'import "../infrastructure/example";',
      },
      {
        ruleId: architectureRuleIds.generatedParserOutsideInfrastructure,
        file: "src/application/example.ts",
        source: 'import "@generate/parser/AjsParser";',
      },
      {
        ruleId: architectureRuleIds.rawUnitOutsideParserNormalizer,
        file: "src/application/example.ts",
        source: 'import "../infrastructure/parser/raw/AjsRawUnit";',
      },
      {
        ruleId: architectureRuleIds.legacyWrapperDependency,
        file: "src/domain/example.ts",
        source: 'import "./models/units/UnitEntity";',
      },
      {
        ruleId: architectureRuleIds.presentationDomainDependency,
        file: "src/presentation/example.ts",
        source: 'import "../domain/example";',
      },
      {
        ruleId: architectureRuleIds.hostFrameworkOutsidePresentation,
        file: "src/application/example.ts",
        source: 'import "react";',
      },
      {
        ruleId: architectureRuleIds.nodeBuiltinBrowserBoundary,
        file: "src/presentation/vscode/example.ts",
        source: 'import "os";',
      },
      {
        ruleId: architectureRuleIds.telemetrySdkOutsideAdapter,
        file: "src/bootstrap/example.ts",
        source: 'import "@vscode/extension-telemetry";',
      },
    ];

    fixtures.forEach(({ ruleId, file, source }) => {
      const violations = findArchitectureRuleViolations(
        collectImportReferencesFromSource(file, source),
      );
      assert.ok(
        violations.some((violation) => violation.ruleId === ruleId),
        `${ruleId} must detect its representative violation`,
      );
    });
  });

  test("reports retired wrapper dependencies as permanent violations", () => {
    const [violation] = findArchitectureRuleViolations(
      collectImportReferencesFromSource(
        "src/domain/example.ts",
        'import "./models/units/UnitEntity";',
      ),
    );

    assert.ok(violation);
    assert.strictEqual(
      violation.rule,
      "retired unit wrapper dependencies are forbidden and must not be reintroduced",
    );
  });

  test("keeps application factory calls and concrete adapter construction in bootstrap", () => {
    const references = collectProductionConstructionReferences(repoRoot);
    const applicationFactories =
      collectProductionApplicationFactoryDefinitions(repoRoot);
    const applicationFactoryKeys = new Set(
      applicationFactories.map(({ file, symbol }) => `${file}:${symbol}`),
    );
    const applicationFactoryCalls = references
      .filter(({ target, symbol }) =>
        applicationFactoryKeys.has(`${target}:${symbol}`),
      )
      .filter(({ file }) => !file.startsWith("src/application/"));
    const infrastructureConstruction = references.filter(
      ({ kind, target, file }) =>
        kind === "new" &&
        target.startsWith("src/infrastructure/") &&
        !file.startsWith("src/infrastructure/"),
    );

    assert.ok(applicationFactoryCalls.length > 0);
    assert.ok(infrastructureConstruction.length > 0);
    assert.ok(
      applicationFactoryCalls.every(({ file }) =>
        file.startsWith("src/bootstrap/extension/"),
      ),
    );
    assert.ok(
      infrastructureConstruction.every(({ file }) =>
        file.startsWith("src/bootstrap/extension/"),
      ),
    );
    assert.deepStrictEqual(
      findCompositionRootViolations(references, applicationFactories),
      [],
    );
  });

  test("rejects application factories and concrete adapters outside bootstrap", () => {
    const references = collectImportedConstructionReferencesFromSource(
      "src/presentation/example.ts",
      `
        import { assemble } from "../application/example";
        import { Adapter } from "../infrastructure/Adapter";
        assemble();
        new Adapter();
      `,
    );

    assert.deepStrictEqual(
      findCompositionRootViolations(references, [
        { file: "src/application/example", symbol: "assemble" },
      ]).map(({ reason }) => reason),
      [
        "application-factory-outside-bootstrap",
        "infrastructure-construction-outside-bootstrap",
      ],
    );
  });

  test("rejects allocator construction outside bootstrap", () => {
    const references = collectImportedConstructionReferencesFromSource(
      "src/presentation/example.ts",
      `import { createSemanticDiffActionIdAllocator } from "../application/ids"; createSemanticDiffActionIdAllocator();`,
    );

    assert.deepStrictEqual(
      findCompositionRootViolations(references, []).map(({ reason }) => reason),
      ["allocator-construction-outside-bootstrap"],
    );
  });

  test("keeps production allocator construction in bootstrap", () => {
    const violations = findCompositionRootViolations(
      collectProductionConstructionReferences(repoRoot),
      collectProductionApplicationFactoryDefinitions(repoRoot),
    ).filter(
      ({ reason }) => reason === "allocator-construction-outside-bootstrap",
    );

    assert.deepStrictEqual(violations, []);
  });

  test("keeps raw parser test access confined to the exact approved suites", () => {
    const suiteDirectory = path.join(repoRoot, "src/test/suite");
    const rawHelperImporters = fs
      .readdirSync(suiteDirectory)
      .filter((file) => file.endsWith(".test.ts"))
      .filter((file) =>
        /import\s*\{\s*parseRawAjsForTest\s*\}\s*from\s*"\.\.\/support\/parseAjs";/u.test(
          fs.readFileSync(path.join(suiteDirectory, file), "utf8"),
        ),
      )
      .sort();

    assert.deepStrictEqual(rawHelperImporters, [
      "normalizeAjsDocument.test.ts",
      "normalizeRelations.test.ts",
      "normalizeUnit.test.ts",
      "normalizeUnitBuilder.test.ts",
      "normalizeUnitTree.test.ts",
      "unitParameterLookupHelpers.test.ts",
    ]);
  });
});
