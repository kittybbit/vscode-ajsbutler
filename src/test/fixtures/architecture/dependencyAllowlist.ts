import {
  type ArchitectureRuleId,
  type DependencyAllowance,
  type DownstreamFeatureOwner,
  type ImportReferenceKind,
} from "../../support/architectureDependencyRules";

type ExactDependency = {
  source: string;
  target: string;
  kind: ImportReferenceKind;
  ruleId: ArchitectureRuleId;
};

const ownedBy = (
  ownerFeature: DownstreamFeatureOwner,
  removalCondition: string,
  dependencies: readonly ExactDependency[],
): DependencyAllowance[] =>
  dependencies.map((dependency) => ({
    ...dependency,
    ownerFeature,
    removalCondition,
  }));

const nodeBoundaryAllowances = ownedBy(
  "standardize-serialization-and-composition-root",
  "The dependency is removed or retained behind an explicit browser-safe host boundary.",
  [
    {
      source: "src/presentation/vscode/webview/messageHandlers.ts",
      target: "os",
      kind: "import",
      ruleId: "node-builtin-browser-boundary",
    },
    {
      source: "src/presentation/vscode/webview/ViewerFactory.ts",
      target: "path",
      kind: "import",
      ruleId: "node-builtin-browser-boundary",
    },
  ],
);

export const dependencyAllowlist: readonly DependencyAllowance[] = [
  ...nodeBoundaryAllowances,
];
