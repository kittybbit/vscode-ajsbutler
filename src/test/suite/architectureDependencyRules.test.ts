import * as assert from "assert";
import * as fs from "fs";
import * as path from "path";

type ImportReference = {
  file: string;
  specifier: string;
};

type RuleViolation = ImportReference & {
  rule: string;
};

const repoRoot = path.resolve(__dirname, "../../..");
const srcRoot = path.join(repoRoot, "src");

const productionSourceDirs = ["domain", "application", "presentation"].map(
  (directory) => path.join(srcRoot, directory),
);

const sourceExtensions = new Set([".ts", ".tsx"]);

const importPattern =
  /\b(?:import|export)\s+(?:type\s+)?(?:[^'"]*?\s+from\s+)?["']([^"']+)["']/g;

const toRelativePath = (filePath: string): string =>
  path.relative(repoRoot, filePath).split(path.sep).join("/");

const walkSourceFiles = (directory: string): string[] => {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      return walkSourceFiles(entryPath);
    }
    return sourceExtensions.has(path.extname(entry.name)) ? [entryPath] : [];
  });
};

const readImportReferences = (filePath: string): ImportReference[] => {
  const source = fs.readFileSync(filePath, "utf8");
  return [...source.matchAll(importPattern)].map((match) => ({
    file: toRelativePath(filePath),
    specifier: match[1],
  }));
};

const resolveImportPath = (reference: ImportReference): string | undefined => {
  if (!reference.specifier.startsWith(".")) {
    return undefined;
  }
  return toRelativePath(
    path.resolve(repoRoot, path.dirname(reference.file), reference.specifier),
  );
};

const startsWithAny = (value: string, prefixes: readonly string[]): boolean =>
  prefixes.some((prefix) => value === prefix || value.startsWith(`${prefix}/`));

const isForbiddenDomainImport = (reference: ImportReference): boolean => {
  const resolvedPath = resolveImportPath(reference) ?? reference.specifier;
  return (
    reference.specifier === "vscode" ||
    reference.specifier === "react" ||
    reference.specifier.startsWith("@mui/") ||
    reference.specifier.startsWith("@xyflow/") ||
    startsWithAny(resolvedPath, [
      "src/presentation/webview",
      "src/generate/parser",
    ])
  );
};

const isApplicationBoundaryImport = (reference: ImportReference): boolean => {
  const resolvedPath = resolveImportPath(reference);
  return resolvedPath
    ? startsWithAny(resolvedPath, ["src/presentation", "src/infrastructure"])
    : false;
};

const isPresentationParserImport = (reference: ImportReference): boolean => {
  const resolvedPath = resolveImportPath(reference) ?? reference.specifier;
  return startsWithAny(resolvedPath, ["src/generate/parser"]);
};

const formatViolation = ({ file, specifier, rule }: RuleViolation): string =>
  `${file} imports ${specifier} (${rule})`;

const collectImportReferences = (): ImportReference[] =>
  productionSourceDirs.flatMap(walkSourceFiles).flatMap(readImportReferences);

suite("Architecture dependency rules", () => {
  test("keeps high-value layer boundaries free of forbidden imports", () => {
    const violations = collectImportReferences().flatMap((reference) => {
      const violationsForReference: RuleViolation[] = [];
      if (
        reference.file.startsWith("src/domain/") &&
        isForbiddenDomainImport(reference)
      ) {
        violationsForReference.push({
          ...reference,
          rule: "domain must not import presentation/webview, parser, vscode, React, MUI, or XyFlow",
        });
      }
      if (
        reference.file.startsWith("src/application/") &&
        isApplicationBoundaryImport(reference)
      ) {
        violationsForReference.push({
          ...reference,
          rule: "application must not import presentation or infrastructure",
        });
      }
      if (
        reference.file.startsWith("src/presentation/") &&
        isPresentationParserImport(reference)
      ) {
        violationsForReference.push({
          ...reference,
          rule: "presentation must not import generated parser modules directly",
        });
      }
      return violationsForReference;
    });

    assert.deepStrictEqual(violations.map(formatViolation), []);
  });
});
