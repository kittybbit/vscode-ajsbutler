import * as fs from "fs";
import * as path from "path";
import * as ts from "typescript";

export type ImportReferenceKind =
  | "import"
  | "import-type"
  | "export"
  | "export-type"
  | "dynamic-import"
  | "require"
  | "import-equals";

export type ImportReference = {
  file: string;
  specifier: string;
  resolvedPath?: string;
  kind: ImportReferenceKind;
};

export type RuleViolation = ImportReference & {
  rule: string;
};

const productionSourceDirs = [
  "domain",
  "application",
  "infrastructure",
  "presentation",
  "bootstrap",
  "shared",
  "resource",
] as const;

const sourceExtensions = new Set([".ts", ".tsx"]);

const repositoryAliases = [
  ["@generate/", "src/generate/"],
  ["@resource/", "src/resource/"],
] as const;

const normalizePath = (filePath: string): string =>
  filePath.split(path.sep).join("/");

const toRelativePath = (repoRoot: string, filePath: string): string =>
  normalizePath(path.relative(repoRoot, filePath));

const readStringArgument = (
  expression: ts.Expression | undefined,
): string | undefined =>
  expression && ts.isStringLiteralLike(expression)
    ? expression.text
    : undefined;

const readCallReference = (
  node: ts.CallExpression,
): Pick<ImportReference, "kind" | "specifier"> | undefined => {
  const specifier = readStringArgument(node.arguments[0]);
  if (!specifier) {
    return undefined;
  }
  if (node.expression.kind === ts.SyntaxKind.ImportKeyword) {
    return { kind: "dynamic-import", specifier };
  }
  return ts.isIdentifier(node.expression) && node.expression.text === "require"
    ? { kind: "require", specifier }
    : undefined;
};

const readImportEqualsReference = (
  node: ts.ImportEqualsDeclaration,
): string | undefined => {
  const moduleReference = node.moduleReference;
  return ts.isExternalModuleReference(moduleReference)
    ? readStringArgument(moduleReference.expression)
    : undefined;
};

export const resolveImportPath = (
  file: string,
  specifier: string,
): string | undefined => {
  if (specifier.startsWith(".")) {
    return path.posix.normalize(
      path.posix.join(path.posix.dirname(file), specifier),
    );
  }

  const alias = repositoryAliases.find(([prefix]) =>
    specifier.startsWith(prefix),
  );
  return alias ? `${alias[1]}${specifier.slice(alias[0].length)}` : undefined;
};

const toImportReference = (
  file: string,
  specifier: string,
  kind: ImportReferenceKind,
): ImportReference => ({
  file,
  specifier,
  resolvedPath: resolveImportPath(file, specifier),
  kind,
});

export const collectImportReferencesFromSource = (
  file: string,
  source: string,
): ImportReference[] => {
  const scriptKind = file.endsWith(".tsx")
    ? ts.ScriptKind.TSX
    : ts.ScriptKind.TS;
  const sourceFile = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    scriptKind,
  );
  const references: ImportReference[] = [];

  const visit = (node: ts.Node): void => {
    if (ts.isImportDeclaration(node)) {
      const specifier = readStringArgument(node.moduleSpecifier);
      if (specifier) {
        const kind = node.importClause?.isTypeOnly ? "import-type" : "import";
        references.push(toImportReference(file, specifier, kind));
      }
    } else if (ts.isExportDeclaration(node)) {
      const specifier = readStringArgument(node.moduleSpecifier);
      if (specifier) {
        references.push(
          toImportReference(
            file,
            specifier,
            node.isTypeOnly ? "export-type" : "export",
          ),
        );
      }
    } else if (ts.isImportEqualsDeclaration(node)) {
      const specifier = readImportEqualsReference(node);
      if (specifier) {
        references.push(toImportReference(file, specifier, "import-equals"));
      }
    } else if (ts.isCallExpression(node)) {
      const reference = readCallReference(node);
      if (reference) {
        references.push(
          toImportReference(file, reference.specifier, reference.kind),
        );
      }
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  return references;
};

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

export const collectProductionImportReferences = (
  repoRoot: string,
): ImportReference[] => {
  const srcRoot = path.join(repoRoot, "src");
  const sourceFiles = productionSourceDirs
    .flatMap((directory) => walkSourceFiles(path.join(srcRoot, directory)))
    .concat(path.join(srcRoot, "extension.ts"));

  return sourceFiles
    .flatMap((filePath) => {
      const file = toRelativePath(repoRoot, filePath);
      return collectImportReferencesFromSource(
        file,
        fs.readFileSync(filePath, "utf8"),
      );
    })
    .sort(compareImportReferences);
};

const startsWithAny = (value: string, prefixes: readonly string[]): boolean =>
  prefixes.some((prefix) => value === prefix || value.startsWith(`${prefix}/`));

const isForbiddenDomainImport = (reference: ImportReference): boolean => {
  const resolvedPath = reference.resolvedPath ?? reference.specifier;
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

const isApplicationBoundaryImport = (reference: ImportReference): boolean =>
  reference.resolvedPath
    ? startsWithAny(reference.resolvedPath, [
        "src/presentation",
        "src/infrastructure",
      ])
    : false;

const isPresentationParserImport = (reference: ImportReference): boolean => {
  const resolvedPath = reference.resolvedPath ?? reference.specifier;
  return startsWithAny(resolvedPath, ["src/generate/parser"]);
};

export const findCurrentRuleViolations = (
  references: readonly ImportReference[],
): RuleViolation[] =>
  references.flatMap((reference) => {
    const violations: RuleViolation[] = [];
    if (
      reference.file.startsWith("src/domain/") &&
      isForbiddenDomainImport(reference)
    ) {
      violations.push({
        ...reference,
        rule: "domain must not import presentation/webview, parser, vscode, React, MUI, or XyFlow",
      });
    }
    if (
      reference.file.startsWith("src/application/") &&
      isApplicationBoundaryImport(reference)
    ) {
      violations.push({
        ...reference,
        rule: "application must not import presentation or infrastructure",
      });
    }
    if (
      reference.file.startsWith("src/presentation/") &&
      isPresentationParserImport(reference)
    ) {
      violations.push({
        ...reference,
        rule: "presentation must not import generated parser modules directly",
      });
    }
    return violations;
  });

export const formatViolation = ({
  file,
  specifier,
  rule,
}: RuleViolation): string => `${file} imports ${specifier} (${rule})`;
