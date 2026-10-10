import * as fs from "fs";
import * as path from "path";
import {
  collectFunctionFactoryDefinitionsFromSource,
  collectImportReferencesFromSource,
  collectImportedConstructionReferencesFromSource,
  withoutSourceExtension,
  type FunctionFactoryDefinition,
  type ImportReference,
  type ImportedConstructionReference,
} from "./architectureSourceAnalysis";

const productionSourceDirs = [
  "domain",
  "application",
  "infrastructure",
  "presentation",
  "bootstrap",
  "resource",
] as const;

const sourceExtensions = new Set([".ts", ".tsx"]);

const normalizePath = (filePath: string): string =>
  filePath.split(path.sep).join("/");

const toRelativePath = (repoRoot: string, filePath: string): string =>
  normalizePath(path.relative(repoRoot, filePath));

const walkSourceFiles = (directory: string): string[] =>
  fs
    .readdirSync(directory, { withFileTypes: true })
    .sort((left, right) => left.name.localeCompare(right.name))
    .flatMap((entry) => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        return walkSourceFiles(entryPath);
      }
      return sourceExtensions.has(path.extname(entry.name)) ? [entryPath] : [];
    });

const compareImportReferences = (
  left: ImportReference,
  right: ImportReference,
): number =>
  left.file.localeCompare(right.file) ||
  left.specifier.localeCompare(right.specifier) ||
  left.kind.localeCompare(right.kind);

export const collectProductionSourceFiles = (repoRoot: string): string[] => {
  const srcRoot = path.join(repoRoot, "src");
  return productionSourceDirs
    .flatMap((directory) => walkSourceFiles(path.join(srcRoot, directory)))
    .concat(path.join(srcRoot, "extension.ts"));
};

export const collectProductionImportReferences = (
  repoRoot: string,
): ImportReference[] =>
  collectProductionSourceFiles(repoRoot)
    .flatMap((filePath) => {
      const file = toRelativePath(repoRoot, filePath);
      return collectImportReferencesFromSource(
        file,
        fs.readFileSync(filePath, "utf8"),
      );
    })
    .sort(compareImportReferences);

const compareConstructionReferences = (
  left: ImportedConstructionReference,
  right: ImportedConstructionReference,
): number =>
  left.file.localeCompare(right.file) ||
  left.target.localeCompare(right.target) ||
  left.symbol.localeCompare(right.symbol) ||
  left.kind.localeCompare(right.kind);

export const collectProductionConstructionReferences = (
  repoRoot: string,
): ImportedConstructionReference[] => {
  const productionFiles = collectProductionSourceFiles(repoRoot);
  const sourceFiles = new Map<string, string>();
  productionFiles.forEach((filePath) => {
    const file = toRelativePath(repoRoot, filePath);
    const source = fs.readFileSync(filePath, "utf8");
    sourceFiles.set(file, source);
    sourceFiles.set(withoutSourceExtension(file), source);
  });

  return productionFiles
    .flatMap((filePath) => {
      const file = toRelativePath(repoRoot, filePath);
      return collectImportedConstructionReferencesFromSource(
        file,
        sourceFiles.get(file) as string,
        sourceFiles,
      );
    })
    .sort(compareConstructionReferences);
};

export const collectProductionApplicationFactoryDefinitions = (
  repoRoot: string,
): FunctionFactoryDefinition[] =>
  collectProductionSourceFiles(repoRoot)
    .filter((filePath) =>
      toRelativePath(repoRoot, filePath).startsWith("src/application/"),
    )
    .flatMap((filePath) => {
      const file = toRelativePath(repoRoot, filePath);
      return collectFunctionFactoryDefinitionsFromSource(
        file,
        fs.readFileSync(filePath, "utf8"),
      );
    })
    .sort(
      (left, right) =>
        left.file.localeCompare(right.file) ||
        left.symbol.localeCompare(right.symbol),
    );
