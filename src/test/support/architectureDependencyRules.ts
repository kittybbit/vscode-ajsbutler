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

export const downstreamFeatureOwners = [
  "isolate-parser-boundary",
  "complete-normalized-domain-model",
  "migrate-unit-information-boundaries",
  "migrate-flow-graph-and-navigation-boundaries",
  "migrate-diagnostics-and-hover-boundaries",
  "complete-webapi-infrastructure-boundaries",
  "migrate-semantic-diff-and-report-boundaries",
  "isolate-telemetry-adapter-boundary",
  "standardize-serialization-and-composition-root",
  "remove-legacy-and-enforce-clean-architecture",
] as const;

export type DownstreamFeatureOwner = (typeof downstreamFeatureOwners)[number];

export type RuleViolation = ImportReference & {
  ruleId: ArchitectureRuleId;
  rule: string;
};

export type DependencyAllowance = {
  source: string;
  target: string;
  kind: ImportReferenceKind;
  ruleId: ArchitectureRuleId;
  ownerFeature: DownstreamFeatureOwner;
  removalCondition: string;
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

const startsWithAny = (value: string, prefixes: readonly string[]): boolean =>
  prefixes.some((prefix) => value === prefix || value.startsWith(`${prefix}/`));

export const getDependencyTarget = (reference: ImportReference): string =>
  reference.resolvedPath ?? reference.specifier;

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
    "legacy unit wrappers are temporary normalized-model migration dependencies",
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

export const findCurrentRuleViolations = (
  references: readonly ImportReference[],
): RuleViolation[] => {
  const currentRuleIds = new Set<ArchitectureRuleId>([
    architectureRuleIds.domainOuterDependency,
    architectureRuleIds.applicationOuterDependency,
    architectureRuleIds.generatedParserOutsideInfrastructure,
  ]);
  return findArchitectureRuleViolations(references).filter(({ ruleId }) =>
    currentRuleIds.has(ruleId),
  );
};

const violationKey = (violation: RuleViolation): string =>
  [
    violation.file,
    getDependencyTarget(violation),
    violation.kind,
    violation.ruleId,
  ].join("\0");

const allowanceKey = ({
  source,
  target,
  kind,
  ruleId,
}: DependencyAllowance): string => [source, target, kind, ruleId].join("\0");

export const validateDependencyAllowlist = (
  violations: readonly RuleViolation[],
  allowances: readonly DependencyAllowance[],
): string[] => {
  const issues: string[] = [];
  const violationKeys = new Set(violations.map(violationKey));
  const allowanceKeys = new Set<string>();

  allowances.forEach((allowance) => {
    const key = allowanceKey(allowance);
    if (allowanceKeys.has(key)) {
      issues.push(`duplicate allowlist entry: ${key}`);
    }
    allowanceKeys.add(key);
    if (!allowance.ownerFeature.trim() || !allowance.removalCondition.trim()) {
      issues.push(`missing allowlist ownership or removal condition: ${key}`);
    }
    if (/[?*]/.test(`${allowance.source}\0${allowance.target}`)) {
      issues.push(`wildcards are forbidden in allowlist entries: ${key}`);
    }
    if (!violationKeys.has(key)) {
      issues.push(`stale allowlist entry: ${key}`);
    }
  });

  violations.forEach((violation) => {
    const key = violationKey(violation);
    if (!allowanceKeys.has(key)) {
      issues.push(`unexplained architecture violation: ${key}`);
    }
  });

  return issues.sort((left, right) => left.localeCompare(right));
};

export const formatViolation = ({
  file,
  specifier,
  ruleId,
  rule,
}: RuleViolation): string =>
  `${file} imports ${specifier} [${ruleId}] (${rule})`;
