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

export type ConstructionReferenceKind = "call" | "new";

export type ImportedConstructionReference = {
  file: string;
  target: string;
  symbol: string;
  kind: ConstructionReferenceKind;
};

export type FunctionFactoryDefinition = {
  file: string;
  symbol: string;
};

const repositoryAliases = [
  ["@generate/", "src/generate/"],
  ["@resource/", "src/resource/"],
] as const;

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

type ImportedBinding = {
  target: string;
  symbol: string;
};

type SourceModuleMap = ReadonlyMap<string, string>;

export const withoutSourceExtension = (file: string): string =>
  file.replace(/\.(?:tsx?|mts|cts)$/u, "");

const sourceModuleCandidates = (modulePath: string): string[] => [
  modulePath,
  `${modulePath}.ts`,
  `${modulePath}.tsx`,
  `${modulePath}.mts`,
  `${modulePath}.cts`,
  `${modulePath}/index.ts`,
  `${modulePath}/index.tsx`,
];

const findSourceModule = (
  modulePath: string,
  sourceFiles: SourceModuleMap,
): { file: string; source: string } | undefined => {
  const candidate = sourceModuleCandidates(modulePath).find((file) =>
    sourceFiles.has(file),
  );
  return candidate
    ? { file: candidate, source: sourceFiles.get(candidate) as string }
    : undefined;
};

const parseSourceModule = (file: string, source: string): ts.SourceFile =>
  ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );

const resolveExportedBinding = (
  modulePath: string,
  symbol: string,
  sourceFiles: SourceModuleMap,
  visited = new Set<string>(),
): ImportedBinding | undefined => {
  const module = findSourceModule(modulePath, sourceFiles);
  if (!module) {
    return { target: withoutSourceExtension(modulePath), symbol };
  }
  const moduleKey = `${module.file}\0${symbol}`;
  if (visited.has(moduleKey)) {
    return undefined;
  }
  const nextVisited = new Set(visited).add(moduleKey);
  const sourceFile = parseSourceModule(module.file, module.source);

  for (const statement of sourceFile.statements) {
    if (!ts.isExportDeclaration(statement)) {
      continue;
    }
    const moduleSpecifier = readStringArgument(statement.moduleSpecifier);
    const exportClause = statement.exportClause;
    if (moduleSpecifier) {
      const target =
        resolveImportPath(module.file, moduleSpecifier) ?? moduleSpecifier;
      if (exportClause && ts.isNamedExports(exportClause)) {
        const exported = exportClause.elements.find(
          (element) => (element.name.text ?? "") === symbol,
        );
        if (exported) {
          return resolveExportedBinding(
            target,
            exported.propertyName?.text ?? exported.name.text,
            sourceFiles,
            nextVisited,
          );
        }
      } else if (!exportClause) {
        const resolved = resolveExportedBinding(
          target,
          symbol,
          sourceFiles,
          nextVisited,
        );
        if (resolved) {
          return resolved;
        }
      }
      continue;
    }
    if (exportClause && ts.isNamedExports(exportClause)) {
      const exported = exportClause.elements.find(
        (element) => element.name.text === symbol,
      );
      if (exported) {
        const localName = exported.propertyName?.text ?? exported.name.text;
        const localBinding = collectImportedBindings(
          module.file,
          sourceFile,
          sourceFiles,
        ).get(localName);
        if (localBinding) {
          return resolveExportedBinding(
            localBinding.target,
            localBinding.symbol,
            sourceFiles,
            nextVisited,
          );
        }
        return {
          target: withoutSourceExtension(module.file),
          symbol: localName,
        };
      }
    }
  }

  const exportedDeclaration = sourceFile.statements.find((statement) => {
    if (!hasExportModifier(statement)) {
      return false;
    }
    if (
      ts.isFunctionDeclaration(statement) ||
      ts.isClassDeclaration(statement)
    ) {
      return statement.name?.text === symbol;
    }
    if (ts.isVariableStatement(statement)) {
      return statement.declarationList.declarations.some(
        (declaration) =>
          ts.isIdentifier(declaration.name) && declaration.name.text === symbol,
      );
    }
    return false;
  });
  if (exportedDeclaration) {
    return {
      target: withoutSourceExtension(module.file),
      symbol,
    };
  }

  return { target: withoutSourceExtension(module.file), symbol };
};

const collectImportedBindings = (
  file: string,
  sourceFile: ts.SourceFile,
  sourceFiles: SourceModuleMap = new Map(),
): ReadonlyMap<string, ImportedBinding> => {
  const bindings = new Map<string, ImportedBinding>();

  sourceFile.statements
    .filter(ts.isImportDeclaration)
    .forEach((declaration) => {
      const specifier = readStringArgument(declaration.moduleSpecifier);
      const importClause = declaration.importClause;
      if (!specifier || !importClause || importClause.isTypeOnly) {
        return;
      }

      const target = resolveImportPath(file, specifier) ?? specifier;
      if (importClause.name) {
        bindings.set(importClause.name.text, { target, symbol: "default" });
      }

      const namedBindings = importClause.namedBindings;
      if (!namedBindings) {
        return;
      }
      if (ts.isNamespaceImport(namedBindings)) {
        bindings.set(namedBindings.name.text, { target, symbol: "*" });
      } else {
        namedBindings.elements
          .filter((element) => !element.isTypeOnly)
          .forEach((element) => {
            const symbol = element.propertyName?.text ?? element.name.text;
            bindings.set(
              element.name.text,
              resolveExportedBinding(target, symbol, sourceFiles) ?? {
                target,
                symbol,
              },
            );
          });
      }
    });

  return bindings;
};

const resolveImportedConstruction = (
  expression: ts.Expression,
  bindings: ReadonlyMap<string, ImportedBinding>,
  sourceFiles: SourceModuleMap,
): ImportedBinding | undefined => {
  if (ts.isIdentifier(expression)) {
    return bindings.get(expression.text);
  }
  if (
    ts.isPropertyAccessExpression(expression) &&
    ts.isIdentifier(expression.expression)
  ) {
    const namespaceBinding = bindings.get(expression.expression.text);
    if (namespaceBinding?.symbol !== "*") {
      return undefined;
    }
    return (
      resolveExportedBinding(
        namespaceBinding.target,
        expression.name.text,
        sourceFiles,
      ) ?? { target: namespaceBinding.target, symbol: expression.name.text }
    );
  }
  return undefined;
};

export const collectImportedConstructionReferencesFromSource = (
  file: string,
  source: string,
  sourceFiles: SourceModuleMap = new Map(),
): ImportedConstructionReference[] => {
  const sourceFile = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const bindings = collectImportedBindings(file, sourceFile, sourceFiles);
  const references: ImportedConstructionReference[] = [];

  const visit = (node: ts.Node): void => {
    if (ts.isNewExpression(node) || ts.isCallExpression(node)) {
      const kind = ts.isNewExpression(node) ? "new" : "call";
      const binding = resolveImportedConstruction(
        node.expression,
        bindings,
        sourceFiles,
      );
      if (binding) {
        references.push({ file, ...binding, kind });
      }
    }
    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  return references;
};

const hasExportModifier = (node: ts.Node): boolean =>
  ts
    .getModifiers(node as ts.HasModifiers)
    ?.some(({ kind }) => kind === ts.SyntaxKind.ExportKeyword) ?? false;

const unwrapParenthesizedExpression = (
  expression: ts.Expression,
): ts.Expression =>
  ts.isParenthesizedExpression(expression)
    ? unwrapParenthesizedExpression(expression.expression)
    : expression;

const isFunctionExpression = (
  expression: ts.Expression,
): expression is ts.ArrowFunction | ts.FunctionExpression =>
  ts.isArrowFunction(expression) || ts.isFunctionExpression(expression);

const blockReturnsFunction = (block: ts.Block): boolean =>
  block.statements.some(
    (statement) =>
      ts.isReturnStatement(statement) &&
      !!statement.expression &&
      isFunctionExpression(unwrapParenthesizedExpression(statement.expression)),
  );

const returnsFunction = (initializer: ts.Expression): boolean => {
  const outer = unwrapParenthesizedExpression(initializer);
  if (!isFunctionExpression(outer)) {
    return false;
  }
  if (!ts.isBlock(outer.body)) {
    return isFunctionExpression(unwrapParenthesizedExpression(outer.body));
  }
  return blockReturnsFunction(outer.body);
};

export const collectFunctionFactoryDefinitionsFromSource = (
  file: string,
  source: string,
): FunctionFactoryDefinition[] => {
  const sourceFile = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const definitionFile = file.replace(/\.[^.]+$/u, "");

  const variableFactories = sourceFile.statements
    .filter(ts.isVariableStatement)
    .filter(hasExportModifier)
    .flatMap(({ declarationList }) =>
      declarationList.declarations.flatMap((declaration) =>
        ts.isIdentifier(declaration.name) &&
        declaration.initializer &&
        returnsFunction(declaration.initializer)
          ? [{ file: definitionFile, symbol: declaration.name.text }]
          : [],
      ),
    );
  const functionFactories = sourceFile.statements
    .filter(ts.isFunctionDeclaration)
    .filter(hasExportModifier)
    .flatMap((declaration) =>
      declaration.name &&
      declaration.body &&
      blockReturnsFunction(declaration.body)
        ? [{ file: definitionFile, symbol: declaration.name.text }]
        : [],
    );

  return [...variableFactories, ...functionFactories].sort((left, right) =>
    left.symbol.localeCompare(right.symbol),
  );
};
