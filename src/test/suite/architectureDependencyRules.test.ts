import * as assert from "assert";
import * as path from "path";
import {
  collectImportReferencesFromSource,
  collectProductionImportReferences,
  findCurrentRuleViolations,
  formatViolation,
  resolveImportPath,
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
});
