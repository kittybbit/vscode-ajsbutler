import * as assert from "assert";
import * as fs from "fs";
import * as path from "path";
import { dependencyAllowlist } from "../fixtures/architecture/dependencyAllowlist";
import {
  architectureRuleIds,
  collectImportReferencesFromSource,
  collectProductionImportReferences,
  findArchitectureRuleViolations,
  findCurrentRuleViolations,
  formatViolation,
  getDependencyTarget,
  resolveImportPath,
  validateDependencyAllowlist,
  type ArchitectureRuleId,
  type DependencyAllowance,
  type RuleViolation,
} from "../support/architectureDependencyRules";

const repoRoot = path.resolve(__dirname, "../../..");

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

  test("collects all production roots in deterministic order", () => {
    const references = collectProductionImportReferences(repoRoot);
    const sortedReferences = [...references].sort((left, right) =>
      `${left.file}\0${left.specifier}\0${left.kind}`.localeCompare(
        `${right.file}\0${right.specifier}\0${right.kind}`,
      ),
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
      "shared",
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

  test("detects representative violations for the current rules", () => {
    const references = [
      ...collectImportReferencesFromSource(
        "src/domain/example.ts",
        'import * as vscode from "vscode";',
      ),
      ...collectImportReferencesFromSource(
        "src/application/example.ts",
        'import { Adapter } from "../infrastructure/Adapter";',
      ),
      ...collectImportReferencesFromSource(
        "src/presentation/example.ts",
        'import { AjsParser } from "@generate/parser/AjsParser";',
      ),
    ];

    assert.deepStrictEqual(
      findCurrentRuleViolations(references).map(({ file }) => file),
      [
        "src/domain/example.ts",
        "src/application/example.ts",
        "src/presentation/example.ts",
      ],
    );
  });

  test("keeps high-value layer boundaries free of forbidden imports", () => {
    const violations = findCurrentRuleViolations(
      collectProductionImportReferences(repoRoot),
    );

    assert.deepStrictEqual(violations.map(formatViolation), []);
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
        file: "src/shared/example.ts",
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

  test("matches every production violation to one exact owned allowance", () => {
    const violations = findArchitectureRuleViolations(
      collectProductionImportReferences(repoRoot),
    );
    const violationsByRule = violations.reduce<Record<string, number>>(
      (counts, { ruleId }) => ({
        ...counts,
        [ruleId]: (counts[ruleId] ?? 0) + 1,
      }),
      {},
    );

    assert.deepStrictEqual(violationsByRule, {
      [architectureRuleIds.nodeBuiltinBrowserBoundary]: 2,
      [architectureRuleIds.presentationDomainDependency]: 25,
    });
    assert.strictEqual(dependencyAllowlist.length, 27);
    assert.deepStrictEqual(
      validateDependencyAllowlist(violations, dependencyAllowlist),
      [],
    );
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

  test("rejects unexplained, stale, duplicate, incomplete, and wildcard entries", () => {
    const [violation] = findArchitectureRuleViolations(
      collectImportReferencesFromSource(
        "src/application/example.ts",
        'import "../infrastructure/parser/raw/AjsRawUnit";',
      ),
    );
    assert.ok(violation);
    const allowance = allowanceFor(violation);

    assertIssue(validateDependencyAllowlist([violation], []), "unexplained");
    assertIssue(validateDependencyAllowlist([], [allowance]), "stale");
    assertIssue(
      validateDependencyAllowlist([violation], [allowance, allowance]),
      "duplicate",
    );
    assertIssue(
      validateDependencyAllowlist(
        [violation],
        [
          {
            ...allowance,
            ownerFeature: "" as DependencyAllowance["ownerFeature"],
            removalCondition: "",
          },
        ],
      ),
      "missing",
    );
    assertIssue(
      validateDependencyAllowlist(
        [violation],
        [{ ...allowance, source: "src/application/*" }],
      ),
      "wildcards",
    );
    assertIssue(
      validateDependencyAllowlist(
        [violation],
        [{ ...allowance, kind: "import-type" }],
      ),
      "stale",
    );
  });
});

const allowanceFor = (violation: RuleViolation): DependencyAllowance => ({
  source: violation.file,
  target: getDependencyTarget(violation),
  kind: violation.kind,
  ruleId: violation.ruleId,
  ownerFeature: "isolate-parser-boundary",
  removalCondition: "Remove the exact dependency.",
});

const assertIssue = (issues: readonly string[], expected: string): void => {
  assert.ok(
    issues.some((issue) => issue.startsWith(expected)),
    `expected ${expected} issue, received:\n${issues.join("\n")}`,
  );
};
