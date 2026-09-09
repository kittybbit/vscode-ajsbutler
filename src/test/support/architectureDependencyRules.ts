import * as fs from "fs";
import { builtinModules } from "module";
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

export type CompositionRootViolation = ImportedConstructionReference & {
  reason:
    | "application-factory-outside-bootstrap"
    | "infrastructure-construction-outside-bootstrap"
    | "allocator-construction-outside-bootstrap";
};

export const architectureRuleIds = {
  domainOuterDependency: "domain-outer-dependency",
  applicationOuterDependency: "application-outer-dependency",
  presentationOuterImplementation: "presentation-outer-implementation",
  infrastructureOuterDependency: "infrastructure-outer-dependency",
  concreteInfrastructureOutsideComposition:
    "concrete-infrastructure-outside-composition",
  generatedParserOutsideInfrastructure:
    "generated-parser-outside-infrastructure",
  rawUnitOutsideParserNormalizer: "raw-unit-outside-parser-normalizer",
  legacyWrapperDependency: "legacy-wrapper-dependency",
  presentationDomainDependency: "presentation-domain-dependency",
  hostFrameworkOutsidePresentation: "host-framework-outside-presentation",
  nodeBuiltinBrowserBoundary: "node-builtin-browser-boundary",
  telemetrySdkOutsideAdapter: "telemetry-sdk-outside-adapter",
} as const;

export type ArchitectureRuleId =
  (typeof architectureRuleIds)[keyof typeof architectureRuleIds];

export type RuleViolation = ImportReference & {
  ruleId: ArchitectureRuleId;
  rule: string;
};

const productionSourceDirs = [
  "domain",
  "application",
  "infrastructure",
  "presentation",
  "bootstrap",
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

type ImportedBinding = {
  target: string;
  symbol: string;
};

type SourceModuleMap = ReadonlyMap<string, string>;

const withoutSourceExtension = (file: string): string =>
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

const startsWithAny = (value: string, prefixes: readonly string[]): boolean =>
  prefixes.some((prefix) => value === prefix || value.startsWith(`${prefix}/`));

const getDependencyTarget = (reference: ImportReference): string =>
  reference.resolvedPath ?? reference.specifier;

const parserInfrastructurePrefix = "src/infrastructure/parser/";
const parserApplicationPortPath = "src/application/parsing/AjsParserPort";
const normalizedParserAdapterPath =
  "src/infrastructure/parser/AntlrAjsParser.ts";

export const findParserPortBoundaryViolations = (
  references: readonly ImportReference[],
): ImportReference[] =>
  references.filter(
    ({ file, resolvedPath, specifier }) =>
      file.startsWith(parserInfrastructurePrefix) &&
      (resolvedPath ?? specifier) === parserApplicationPortPath &&
      file !== normalizedParserAdapterPath,
  );

const telemetryInternalModulePath = "src/application/telemetry/telemetryEvent";
const telemetryOuterSourcePrefixes = ["src/bootstrap", "src/presentation"];

export const findTelemetryBoundaryViolations = (
  references: readonly ImportReference[],
): ImportReference[] =>
  references.filter(
    ({ file, resolvedPath, specifier }) =>
      startsWithAny(file, telemetryOuterSourcePrefixes) &&
      (resolvedPath ?? specifier) === telemetryInternalModulePath,
  );

const ruleMessages: Record<ArchitectureRuleId, string> = {
  [architectureRuleIds.domainOuterDependency]:
    "domain must not import an outer layer or host framework",
  [architectureRuleIds.applicationOuterDependency]:
    "application must not import infrastructure, presentation, or bootstrap",
  [architectureRuleIds.presentationOuterImplementation]:
    "presentation must not import infrastructure or bootstrap",
  [architectureRuleIds.infrastructureOuterDependency]:
    "infrastructure must not import presentation or bootstrap",
  [architectureRuleIds.concreteInfrastructureOutsideComposition]:
    "concrete infrastructure must be referenced only by infrastructure or bootstrap",
  [architectureRuleIds.generatedParserOutsideInfrastructure]:
    "generated parser and ANTLR runtime must remain in parser infrastructure",
  [architectureRuleIds.rawUnitOutsideParserNormalizer]:
    "AjsRawUnit must remain inside parser infrastructure",
  [architectureRuleIds.legacyWrapperDependency]:
    "retired unit wrapper dependencies are forbidden and must not be reintroduced",
  [architectureRuleIds.presentationDomainDependency]:
    "presentation must consume application DTOs instead of domain objects",
  [architectureRuleIds.hostFrameworkOutsidePresentation]:
    "host and UI frameworks must remain in an allowed outer adapter",
  [architectureRuleIds.nodeBuiltinBrowserBoundary]:
    "Node built-ins in extension paths require an explicit browser-safe boundary",
  [architectureRuleIds.telemetrySdkOutsideAdapter]:
    "the telemetry SDK must remain inside its infrastructure adapter",
};

const layerOf = (file: string): string | undefined => {
  const match = /^src\/([^/]+)\//.exec(file);
  return match?.[1];
};

const factoryKey = ({ file, symbol }: FunctionFactoryDefinition): string =>
  `${file}\0${symbol}`;

export const findCompositionRootViolations = (
  references: readonly ImportedConstructionReference[],
  applicationFactories: readonly FunctionFactoryDefinition[],
): CompositionRootViolation[] => {
  const applicationFactoryKeys = new Set(applicationFactories.map(factoryKey));

  return references.flatMap<CompositionRootViolation>((reference) => {
    const sourceLayer = layerOf(reference.file);
    if (
      reference.kind === "call" &&
      /^create[A-Za-z0-9]*Allocator$/u.test(reference.symbol) &&
      !reference.file.startsWith("src/bootstrap/")
    ) {
      return [
        {
          ...reference,
          reason: "allocator-construction-outside-bootstrap" as const,
        },
      ];
    }
    if (
      reference.kind === "new" &&
      reference.target.startsWith("src/infrastructure/") &&
      sourceLayer !== "infrastructure" &&
      sourceLayer !== "bootstrap"
    ) {
      return [
        {
          ...reference,
          reason: "infrastructure-construction-outside-bootstrap" as const,
        },
      ];
    }
    if (
      sourceLayer !== "application" &&
      sourceLayer !== "bootstrap" &&
      applicationFactoryKeys.has(
        factoryKey({ file: reference.target, symbol: reference.symbol }),
      )
    ) {
      return [
        {
          ...reference,
          reason: "application-factory-outside-bootstrap" as const,
        },
      ];
    }
    return [];
  });
};

const isLayerTarget = (
  reference: ImportReference,
  layers: readonly string[],
): boolean => {
  const targetLayer = reference.resolvedPath
    ? layerOf(reference.resolvedPath)
    : undefined;
  return targetLayer ? layers.includes(targetLayer) : false;
};

const isGeneratedParserDependency = (reference: ImportReference): boolean =>
  startsWithAny(getDependencyTarget(reference), ["src/generate/parser"]) ||
  reference.specifier === "antlr4ts" ||
  reference.specifier.startsWith("antlr4ts/");

const isRawUnitDependency = (reference: ImportReference): boolean =>
  getDependencyTarget(reference) === "src/infrastructure/parser/raw/AjsRawUnit";

const isAllowedRawUnitSource = (file: string): boolean =>
  file.startsWith("src/infrastructure/parser/");

const isLegacyWrapperDependency = (reference: ImportReference): boolean =>
  startsWithAny(getDependencyTarget(reference), ["src/domain/models/units"]);

const isHostFrameworkDependency = (specifier: string): boolean =>
  specifier === "vscode" ||
  specifier === "react" ||
  specifier.startsWith("react-") ||
  specifier.startsWith("@mui/") ||
  specifier.startsWith("@xyflow/") ||
  specifier.startsWith("@tanstack/") ||
  specifier === "classnames";

const nodeBuiltins = new Set(
  builtinModules
    .map((specifier) => specifier.replace(/^node:/, ""))
    .concat("process"),
);

const isNodeBuiltinDependency = (specifier: string): boolean =>
  nodeBuiltins.has(specifier.replace(/^node:/, ""));

const isAllowedHostFrameworkSource = (reference: ImportReference): boolean => {
  if (reference.specifier === "vscode") {
    return (
      reference.file === "src/extension.ts" ||
      startsWithAny(reference.file, [
        "src/bootstrap",
        "src/infrastructure",
        "src/presentation/vscode",
      ])
    );
  }
  return reference.file.startsWith("src/presentation/webview/");
};

const addViolation = (
  violations: RuleViolation[],
  reference: ImportReference,
  ruleId: ArchitectureRuleId,
): void => {
  violations.push({ ...reference, ruleId, rule: ruleMessages[ruleId] });
};

export const findArchitectureRuleViolations = (
  references: readonly ImportReference[],
): RuleViolation[] =>
  references.flatMap((reference) => {
    const violations: RuleViolation[] = [];
    const sourceLayer = layerOf(reference.file);

    if (
      sourceLayer === "domain" &&
      (isLayerTarget(reference, [
        "application",
        "infrastructure",
        "presentation",
        "bootstrap",
      ]) ||
        isHostFrameworkDependency(reference.specifier))
    ) {
      addViolation(
        violations,
        reference,
        architectureRuleIds.domainOuterDependency,
      );
    }
    if (
      sourceLayer === "application" &&
      isLayerTarget(reference, ["infrastructure", "presentation", "bootstrap"])
    ) {
      addViolation(
        violations,
        reference,
        architectureRuleIds.applicationOuterDependency,
      );
    }
    if (
      sourceLayer === "presentation" &&
      isLayerTarget(reference, ["infrastructure", "bootstrap"])
    ) {
      addViolation(
        violations,
        reference,
        architectureRuleIds.presentationOuterImplementation,
      );
    }
    if (
      sourceLayer === "infrastructure" &&
      isLayerTarget(reference, ["presentation", "bootstrap"])
    ) {
      addViolation(
        violations,
        reference,
        architectureRuleIds.infrastructureOuterDependency,
      );
    }
    if (
      isLayerTarget(reference, ["infrastructure"]) &&
      sourceLayer !== "infrastructure" &&
      sourceLayer !== "bootstrap"
    ) {
      addViolation(
        violations,
        reference,
        architectureRuleIds.concreteInfrastructureOutsideComposition,
      );
    }
    if (
      isGeneratedParserDependency(reference) &&
      !reference.file.startsWith("src/infrastructure/parser/")
    ) {
      addViolation(
        violations,
        reference,
        architectureRuleIds.generatedParserOutsideInfrastructure,
      );
    }
    if (
      isRawUnitDependency(reference) &&
      !isAllowedRawUnitSource(reference.file)
    ) {
      addViolation(
        violations,
        reference,
        architectureRuleIds.rawUnitOutsideParserNormalizer,
      );
    }
    if (isLegacyWrapperDependency(reference)) {
      addViolation(
        violations,
        reference,
        architectureRuleIds.legacyWrapperDependency,
      );
    }
    if (
      sourceLayer === "presentation" &&
      isLayerTarget(reference, ["domain"])
    ) {
      addViolation(
        violations,
        reference,
        architectureRuleIds.presentationDomainDependency,
      );
    }
    if (
      isHostFrameworkDependency(reference.specifier) &&
      !isAllowedHostFrameworkSource(reference)
    ) {
      addViolation(
        violations,
        reference,
        architectureRuleIds.hostFrameworkOutsidePresentation,
      );
    }
    if (isNodeBuiltinDependency(reference.specifier)) {
      addViolation(
        violations,
        reference,
        architectureRuleIds.nodeBuiltinBrowserBoundary,
      );
    }
    if (
      reference.specifier === "@vscode/extension-telemetry" &&
      reference.file !==
        "src/infrastructure/telemetry/VscodeTelemetryAdapter.ts"
    ) {
      addViolation(
        violations,
        reference,
        architectureRuleIds.telemetrySdkOutsideAdapter,
      );
    }

    return violations;
  });

export const formatViolation = ({
  file,
  specifier,
  ruleId,
  rule,
}: RuleViolation): string =>
  `${file} imports ${specifier} [${ruleId}] (${rule})`;
