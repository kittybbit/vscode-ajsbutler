import * as assert from "assert";
import * as fs from "fs";
import * as path from "path";
import {
  architectureRuleIds,
  collectFunctionFactoryDefinitionsFromSource,
  collectImportReferencesFromSource,
  collectImportedConstructionReferencesFromSource,
  collectProductionApplicationFactoryDefinitions,
  collectProductionConstructionReferences,
  collectProductionImportReferences,
  collectProductionSourceFiles,
  findArchitectureRuleViolations,
  findCompositionRootViolations,
  findParserPortBoundaryViolations,
  findTelemetryBoundaryViolations,
  formatViolation,
  resolveImportPath,
  type ArchitectureRuleId,
} from "../support/architectureDependencyRules";

const repoRoot = path.resolve(__dirname, "../../..");

const semanticDiffAdapterRoot = path.join(
  repoRoot,
  "src/presentation/vscode/semantic-diff",
);
const semanticDiffCategories = ["panel", "flow", "report", "source"] as const;
const semanticDiffRootFacades = [
  "semanticDiffExplorerFlow.ts",
  "semanticDiffExplorerPanel.ts",
  "semanticDiffExplorerRegistry.ts",
];
const movedSemanticDiffModules = [
  "semanticDiffExplorerPanelActions",
  "semanticDiffExplorerPanelHtml",
  "semanticDiffExplorerPanelInstall",
  "semanticDiffExplorerPanelLifecycle",
  "semanticDiffExplorerPanelRequests",
  "semanticDiffExplorerPanelTransport",
  "semanticDiffExplorerFlowAction",
  "semanticDiffExplorerFlowActionPreparation",
  "semanticDiffExplorerFlowOverlayRegistry",
  "semanticDiffExplorerFlowTargets",
  "semanticDiffExplorerReportAction",
  "semanticDiffExplorerReportActionRunner",
  "semanticDiffExplorerSourceAction",
  "semanticDiffExplorerSourceActionRunner",
  "semanticDiffReportDocument",
] as const;

const sourceFilesUnder = (directory: string): string[] =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return sourceFilesUnder(entryPath);
    return entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")
      ? [entryPath]
      : [];
  });

const resolveSemanticDiffModule = (
  modulePath: string,
  modules: ReadonlyMap<string, string>,
): string | undefined =>
  [modulePath, `${modulePath}.ts`, `${modulePath}.tsx`]
    .map((candidate) => modules.get(candidate))
    .find((candidate): candidate is string => candidate !== undefined);

const findSemanticDiffAdapterCycles = (): string[][] => {
  const sourceFiles = semanticDiffCategories.flatMap((category) =>
    sourceFilesUnder(path.join(semanticDiffAdapterRoot, category)),
  );
  const modules = new Map<string, string>();
  sourceFiles.forEach((filePath) => {
    const relative = path
      .relative(repoRoot, filePath)
      .split(path.sep)
      .join("/");
    modules.set(relative, relative);
    modules.set(relative.replace(/\.tsx?$/u, ""), relative);
  });
  const graph = new Map<string, string[]>();
  sourceFiles.forEach((filePath) => {
    const file = path.relative(repoRoot, filePath).split(path.sep).join("/");
    const edges = collectImportReferencesFromSource(
      file,
      fs.readFileSync(filePath, "utf8"),
    )
      .map(({ resolvedPath }) =>
        resolvedPath === undefined
          ? undefined
          : resolveSemanticDiffModule(resolvedPath, modules),
      )
      .filter((target): target is string => target !== undefined);
    graph.set(file, edges);
  });
  const visited = new Set<string>();
  const visiting = new Set<string>();
  const cycles: string[][] = [];
  const visit = (node: string, stack: string[]): void => {
    if (visiting.has(node)) {
      cycles.push([...stack.slice(stack.indexOf(node)), node]);
      return;
    }
    if (visited.has(node)) return;
    visiting.add(node);
    graph.get(node)?.forEach((target) => visit(target, [...stack, node]));
    visiting.delete(node);
    visited.add(node);
  };
  graph.forEach((_, node) => visit(node, []));
  return cycles;
};

suite("Architecture dependency rules", () => {
  test("collects supported TypeScript dependency syntax", () => {
    const references = collectImportReferencesFromSource(
      "src/application/example.ts",
      `
        import value from "./value";
        import type { Input } from "./input";
        import "./sideEffect";
        export { output } from "./output";
        export type { Result } from "./result";
        const dynamicValue = import("@generate/parser/AjsParser");
        const commonJsValue = require("legacy-package");
        import equalsValue = require("./equalsValue");
      `,
    );

    assert.deepStrictEqual(
      references.map(({ kind, specifier }) => ({ kind, specifier })),
      [
        { kind: "import", specifier: "./value" },
        { kind: "import-type", specifier: "./input" },
        { kind: "import", specifier: "./sideEffect" },
        { kind: "export", specifier: "./output" },
        { kind: "export-type", specifier: "./result" },
        { kind: "dynamic-import", specifier: "@generate/parser/AjsParser" },
        { kind: "require", specifier: "legacy-package" },
        { kind: "import-equals", specifier: "./equalsValue" },
      ],
    );
  });

  test("resolves relative and repository-alias imports", () => {
    assert.strictEqual(
      resolveImportPath("src/application/example.ts", "../domain/value"),
      "src/domain/value",
    );
    assert.strictEqual(
      resolveImportPath(
        "src/infrastructure/parser/example.ts",
        "@generate/parser/AjsParser",
      ),
      "src/generate/parser/AjsParser",
    );
    assert.strictEqual(
      resolveImportPath(
        "src/presentation/example.ts",
        "@resource/i18n/message",
      ),
      "src/resource/i18n/message",
    );
    assert.strictEqual(
      resolveImportPath("src/application/example.ts", "vscode"),
      undefined,
    );
  });

  test("collects imported factory calls and concrete construction", () => {
    const references = collectImportedConstructionReferencesFromSource(
      "src/presentation/example.ts",
      `
        import { createUseCase as createFeature } from "../application/useCase";
        import { Adapter } from "../infrastructure/Adapter";
        import * as infrastructure from "../infrastructure/factories";
        import type { Port } from "../application/Port";

        createFeature();
        new Adapter();
        infrastructure.createAdapter();
      `,
    );

    assert.deepStrictEqual(references, [
      {
        file: "src/presentation/example.ts",
        target: "src/application/useCase",
        symbol: "createUseCase",
        kind: "call",
      },
      {
        file: "src/presentation/example.ts",
        target: "src/infrastructure/Adapter",
        symbol: "Adapter",
        kind: "new",
      },
      {
        file: "src/presentation/example.ts",
        target: "src/infrastructure/factories",
        symbol: "createAdapter",
        kind: "call",
      },
    ]);
  });

  test("resolves named and namespace construction through re-export chains", () => {
    const sourceFiles = new Map([
      [
        "src/application/factories.ts",
        "export const createFeature = () => () => undefined;",
      ],
      [
        "src/application/reexports.ts",
        'export { createFeature as createAlias } from "./factories";',
      ],
      ["src/application/index.ts", 'export * from "./reexports";'],
    ]);
    const namedReferences = collectImportedConstructionReferencesFromSource(
      "src/presentation/example.ts",
      `import { createAlias } from "../application/index"; createAlias();`,
      sourceFiles,
    );
    const namespaceReferences = collectImportedConstructionReferencesFromSource(
      "src/presentation/example.ts",
      `import * as application from "../application/index"; application.createAlias();`,
      sourceFiles,
    );

    assert.deepStrictEqual(namedReferences, [
      {
        file: "src/presentation/example.ts",
        target: "src/application/factories",
        symbol: "createFeature",
        kind: "call",
      },
    ]);
    assert.deepStrictEqual(namespaceReferences, [
      {
        file: "src/presentation/example.ts",
        target: "src/application/factories",
        symbol: "createFeature",
        kind: "call",
      },
    ]);
  });

  test("resolves cyclic re-exports without recursing indefinitely", () => {
    const sourceFiles = new Map([
      ["src/application/first.ts", 'export * from "./second";'],
      ["src/application/second.ts", 'export * from "./first";'],
    ]);

    assert.deepStrictEqual(
      collectImportedConstructionReferencesFromSource(
        "src/presentation/example.ts",
        `import { missing } from "../application/first"; missing();`,
        sourceFiles,
      ),
      [
        {
          file: "src/presentation/example.ts",
          target: "src/application/first",
          symbol: "missing",
          kind: "call",
        },
      ],
    );
  });

  test("detects exported function factories without relying on their names", () => {
    assert.deepStrictEqual(
      collectFunctionFactoryDefinitionsFromSource(
        "src/application/example.ts",
        `
          export const assemble = (port: unknown) => (input: unknown) => input;
          export function connect() {
            return () => undefined;
          }
          export const value = (input: unknown) => input;
          const internal = () => () => undefined;
        `,
      ),
      [
        { file: "src/application/example", symbol: "assemble" },
        { file: "src/application/example", symbol: "connect" },
      ],
    );
  });

  test("collects all production roots in deterministic order", () => {
    const references = collectProductionImportReferences(repoRoot);
    const sortedReferences = [...references].sort(
      (left, right) =>
        left.file.localeCompare(right.file) ||
        left.specifier.localeCompare(right.specifier) ||
        left.kind.localeCompare(right.kind),
    );

    assert.deepStrictEqual(references, sortedReferences);
    assert.ok(
      references.some(({ file }) => file === "src/extension.ts"),
      "extension.ts must be scanned",
    );
    [
      "application",
      "bootstrap",
      "domain",
      "infrastructure",
      "presentation",
      "resource",
    ].forEach((directory) => {
      assert.ok(
        references.some(({ file }) => file.startsWith(`src/${directory}/`)),
        `${directory} production sources must be scanned`,
      );
    });
    assert.ok(
      references.every(
        ({ file }) =>
          !file.startsWith("src/test/") && !file.startsWith("src/generate/"),
      ),
      "test and generated sources must not be dependency owners",
    );
  });

  test("keeps Semantic Diff adapter roots as the three public facades", () => {
    const rootFiles = fs
      .readdirSync(semanticDiffAdapterRoot, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith(".ts"))
      .map((entry) => entry.name)
      .sort();
    assert.deepStrictEqual(rootFiles, [...semanticDiffRootFacades].sort());
    semanticDiffRootFacades.forEach((file) => {
      const source = fs.readFileSync(
        path.join(semanticDiffAdapterRoot, file),
        "utf8",
      );
      assert.doesNotMatch(source, /^import\s/m);
      assert.match(source, /^export\s/m);
    });
    assert.ok(
      fs.existsSync(
        path.join(
          semanticDiffAdapterRoot,
          "panel/semanticDiffExplorerConstants.ts",
        ),
      ),
    );
    assert.match(
      fs.readFileSync(
        path.join(semanticDiffAdapterRoot, "semanticDiffExplorerPanel.ts"),
        "utf8",
      ),
      /semanticDiffExplorerConstants/,
    );
    assert.match(
      fs.readFileSync(
        path.join(
          semanticDiffAdapterRoot,
          "panel/semanticDiffExplorerPanelHtml.ts",
        ),
        "utf8",
      ),
      /semanticDiffExplorerConstants/,
    );
  });

  test("rejects direct imports of moved flat Semantic Diff implementations", () => {
    const imports = sourceFilesUnder(path.join(repoRoot, "src")).flatMap(
      (filePath) => {
        const file = path
          .relative(repoRoot, filePath)
          .split(path.sep)
          .join("/");
        return collectImportReferencesFromSource(
          file,
          fs.readFileSync(filePath, "utf8"),
        ).filter(({ specifier }) =>
          movedSemanticDiffModules.some((module) =>
            specifier.endsWith(`/semantic-diff/${module}`),
          ),
        );
      },
    );
    assert.deepStrictEqual(imports, []);
  });

  test("keeps Semantic Diff adapter category graph acyclic", () => {
    assert.deepStrictEqual(findSemanticDiffAdapterCycles(), []);
  });

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
