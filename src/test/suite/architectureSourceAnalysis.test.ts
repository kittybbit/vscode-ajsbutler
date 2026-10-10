import * as assert from "assert";
import * as path from "path";
import {
  collectFunctionFactoryDefinitionsFromSource,
  collectImportReferencesFromSource,
  collectImportedConstructionReferencesFromSource,
  resolveImportPath,
} from "../support/architectureSourceAnalysis";
import { collectProductionImportReferences } from "../support/architectureRepositoryCollection";

const repoRoot = path.resolve(__dirname, "../../..");

suite("Architecture source analysis", () => {
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
          target: "src/application/second",
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
});
