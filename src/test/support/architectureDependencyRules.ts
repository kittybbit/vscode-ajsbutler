import { builtinModules } from "module";
import {
  type FunctionFactoryDefinition,
  type ImportReference,
  type ImportedConstructionReference,
} from "./architectureSourceAnalysis";

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
