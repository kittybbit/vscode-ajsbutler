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

const flowPresentationAllowances = ownedBy(
  "migrate-flow-graph-and-navigation-boundaries",
  "Flow and navigation presentation consume application DTOs or events.",
  [
    {
      source:
        "src/presentation/webview/editor/ajsFlow/buildExpandedFlowGraph.ts",
      target: "src/domain/models/ajs/AjsDocument",
      kind: "import",
      ruleId: "presentation-domain-dependency",
    },
    {
      source:
        "src/presentation/webview/editor/ajsFlow/expandedFlowGraphGrowthOffsets.ts",
      target: "src/domain/models/ajs/AjsDocument",
      kind: "import",
      ruleId: "presentation-domain-dependency",
    },
    {
      source:
        "src/presentation/webview/editor/ajsFlow/expandedFlowGraphLayout.ts",
      target: "src/domain/models/ajs/AjsDocument",
      kind: "import",
      ruleId: "presentation-domain-dependency",
    },
    {
      source:
        "src/presentation/webview/editor/ajsFlow/expandedFlowGraphNodes.ts",
      target: "src/domain/models/ajs/AjsDocument",
      kind: "import-type",
      ruleId: "presentation-domain-dependency",
    },
    {
      source:
        "src/presentation/webview/editor/ajsFlow/expandedFlowGraphPanelIntrusion.ts",
      target: "src/domain/models/ajs/AjsDocument",
      kind: "import",
      ruleId: "presentation-domain-dependency",
    },
    {
      source:
        "src/presentation/webview/editor/ajsFlow/expandedFlowGraphReveal.ts",
      target: "src/domain/models/ajs/AjsDocument",
      kind: "import",
      ruleId: "presentation-domain-dependency",
    },
    {
      source:
        "src/presentation/webview/editor/ajsFlow/expandedFlowGraphTypes.ts",
      target: "src/domain/models/ajs/AjsDocument",
      kind: "import",
      ruleId: "presentation-domain-dependency",
    },
    {
      source: "src/presentation/webview/editor/ajsFlow/flowGraphView.ts",
      target: "src/domain/models/ajs/AjsDocument",
      kind: "import-type",
      ruleId: "presentation-domain-dependency",
    },
    {
      source: "src/presentation/webview/editor/ajsFlow/flowNodeDetail.ts",
      target: "src/domain/models/ajs/AjsDocument",
      kind: "import-type",
      ruleId: "presentation-domain-dependency",
    },
    {
      source: "src/presentation/webview/editor/ajsFlow/FlowNodeDetailPanel.tsx",
      target: "src/domain/services/i18n/nls",
      kind: "import",
      ruleId: "presentation-domain-dependency",
    },
    {
      source: "src/presentation/webview/editor/ajsFlow/flowSearch.ts",
      target: "src/domain/models/ajs/AjsDocument",
      kind: "import",
      ruleId: "presentation-domain-dependency",
    },
    {
      source: "src/presentation/webview/editor/ajsFlow/FlowSelector.tsx",
      target: "src/domain/models/ajs/AjsDocument",
      kind: "import-type",
      ruleId: "presentation-domain-dependency",
    },
    {
      source: "src/presentation/webview/editor/ajsFlow/flowTreeSelection.ts",
      target: "src/domain/models/ajs/AjsDocument",
      kind: "import-type",
      ruleId: "presentation-domain-dependency",
    },
    {
      source: "src/presentation/webview/editor/ajsFlow/Header.tsx",
      target: "src/domain/models/ajs/AjsDocument",
      kind: "import",
      ruleId: "presentation-domain-dependency",
    },
    {
      source: "src/presentation/webview/editor/ajsFlow/nestedExpansion.ts",
      target: "src/domain/models/ajs/AjsDocument",
      kind: "import",
      ruleId: "presentation-domain-dependency",
    },
    {
      source: "src/presentation/webview/editor/ajsFlow/nodes/AjsNode.tsx",
      target: "src/domain/services/i18n/nls",
      kind: "import",
      ruleId: "presentation-domain-dependency",
    },
    {
      source: "src/presentation/webview/editor/ajsFlow/nodes/AjsNode.tsx",
      target: "src/domain/values/AjsType",
      kind: "import",
      ruleId: "presentation-domain-dependency",
    },
    {
      source: "src/presentation/webview/editor/ajsFlow/useFlowGraphState.ts",
      target: "src/domain/models/ajs/AjsDocument",
      kind: "import",
      ruleId: "presentation-domain-dependency",
    },
    {
      source: "src/presentation/webview/editor/ajsFlow/useFlowSearchState.ts",
      target: "src/domain/models/ajs/AjsDocument",
      kind: "import",
      ruleId: "presentation-domain-dependency",
    },
    {
      source:
        "src/presentation/webview/editor/ajsFlow/useFlowViewerController.ts",
      target: "src/domain/models/ajs/AjsDocument",
      kind: "import",
      ruleId: "presentation-domain-dependency",
    },
    {
      source:
        "src/presentation/webview/editor/ajsFlow/useFlowViewerController.ts",
      target: "src/domain/models/ajs/AjsDocument",
      kind: "import-type",
      ruleId: "presentation-domain-dependency",
    },
    {
      source: "src/presentation/webview/editor/ajsFlow/useFlowViewerEffects.ts",
      target: "src/domain/models/ajs/AjsDocument",
      kind: "import",
      ruleId: "presentation-domain-dependency",
    },
    {
      source:
        "src/presentation/webview/editor/ajsFlow/useNestedExpansionState.ts",
      target: "src/domain/models/ajs/AjsDocument",
      kind: "import",
      ruleId: "presentation-domain-dependency",
    },
    {
      source: "src/presentation/webview/editor/shared/unitTreeSelection.ts",
      target: "src/domain/models/ajs/AjsDocument",
      kind: "import-type",
      ruleId: "presentation-domain-dependency",
    },
    {
      source: "src/presentation/webview/editor/shared/UnitTreeSelector.tsx",
      target: "src/domain/models/ajs/AjsDocument",
      kind: "import-type",
      ruleId: "presentation-domain-dependency",
    },
  ],
);

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
  ...flowPresentationAllowances,
  ...nodeBoundaryAllowances,
];
