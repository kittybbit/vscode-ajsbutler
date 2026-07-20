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

const unitPresentationAllowances = ownedBy(
  "migrate-unit-information-boundaries",
  "Unit list, CSV, and definition presentation consume application DTOs.",
  [
    {
      source: "src/presentation/webview/editor/ajsTable/columnDefs/common.tsx",
      target: "src/domain/services/i18n/nls",
      kind: "import-type",
      ruleId: "presentation-domain-dependency",
    },
    {
      source: "src/presentation/webview/editor/ajsTable/columnDefs/group1.tsx",
      target: "src/domain/services/i18n/nls",
      kind: "import",
      ruleId: "presentation-domain-dependency",
    },
    {
      source: "src/presentation/webview/editor/ajsTable/columnDefs/group11.tsx",
      target: "src/domain/services/i18n/nls",
      kind: "import-type",
      ruleId: "presentation-domain-dependency",
    },
    {
      source: "src/presentation/webview/editor/ajsTable/columnDefs/group12.ts",
      target: "src/domain/services/i18n/nls",
      kind: "import-type",
      ruleId: "presentation-domain-dependency",
    },
    {
      source: "src/presentation/webview/editor/ajsTable/columnDefs/group13.ts",
      target: "src/domain/services/i18n/nls",
      kind: "import-type",
      ruleId: "presentation-domain-dependency",
    },
    {
      source: "src/presentation/webview/editor/ajsTable/columnDefs/group14.ts",
      target: "src/domain/services/i18n/nls",
      kind: "import-type",
      ruleId: "presentation-domain-dependency",
    },
    {
      source: "src/presentation/webview/editor/ajsTable/columnDefs/group15.ts",
      target: "src/domain/services/i18n/nls",
      kind: "import-type",
      ruleId: "presentation-domain-dependency",
    },
    {
      source: "src/presentation/webview/editor/ajsTable/columnDefs/group16.ts",
      target: "src/domain/services/i18n/nls",
      kind: "import-type",
      ruleId: "presentation-domain-dependency",
    },
    {
      source: "src/presentation/webview/editor/ajsTable/columnDefs/group17.ts",
      target: "src/domain/services/i18n/nls",
      kind: "import-type",
      ruleId: "presentation-domain-dependency",
    },
    {
      source: "src/presentation/webview/editor/ajsTable/columnDefs/group18.ts",
      target: "src/domain/services/i18n/nls",
      kind: "import-type",
      ruleId: "presentation-domain-dependency",
    },
    {
      source: "src/presentation/webview/editor/ajsTable/columnDefs/group19.ts",
      target: "src/domain/services/i18n/nls",
      kind: "import-type",
      ruleId: "presentation-domain-dependency",
    },
    {
      source: "src/presentation/webview/editor/ajsTable/columnDefs/group20.ts",
      target: "src/domain/services/i18n/nls",
      kind: "import-type",
      ruleId: "presentation-domain-dependency",
    },
    {
      source: "src/presentation/webview/editor/ajsTable/columnDefs/group3.tsx",
      target: "src/domain/services/i18n/nls",
      kind: "import-type",
      ruleId: "presentation-domain-dependency",
    },
    {
      source: "src/presentation/webview/editor/ajsTable/columnDefs/group4.ts",
      target: "src/domain/services/i18n/nls",
      kind: "import-type",
      ruleId: "presentation-domain-dependency",
    },
    {
      source: "src/presentation/webview/editor/ajsTable/columnDefs/group5.tsx",
      target: "src/domain/services/i18n/nls",
      kind: "import-type",
      ruleId: "presentation-domain-dependency",
    },
    {
      source: "src/presentation/webview/editor/ajsTable/columnDefs/group6.tsx",
      target: "src/domain/services/i18n/nls",
      kind: "import-type",
      ruleId: "presentation-domain-dependency",
    },
    {
      source: "src/presentation/webview/editor/ajsTable/columnDefs/group6.tsx",
      target: "src/domain/values/AjsType",
      kind: "import",
      ruleId: "presentation-domain-dependency",
    },
    {
      source: "src/presentation/webview/editor/ajsTable/columnDefs/group7.tsx",
      target: "src/domain/services/i18n/nls",
      kind: "import-type",
      ruleId: "presentation-domain-dependency",
    },
    {
      source: "src/presentation/webview/editor/ajsTable/columnDefs/group8.ts",
      target: "src/domain/services/i18n/nls",
      kind: "import-type",
      ruleId: "presentation-domain-dependency",
    },
    {
      source: "src/presentation/webview/editor/ajsTable/columnDefs/group9.ts",
      target: "src/domain/services/i18n/nls",
      kind: "import-type",
      ruleId: "presentation-domain-dependency",
    },
    {
      source:
        "src/presentation/webview/editor/ajsTable/DisplayColumnSelector.tsx",
      target: "src/domain/services/i18n/nls",
      kind: "import",
      ruleId: "presentation-domain-dependency",
    },
    {
      source: "src/presentation/webview/editor/ajsTable/globalFilter.ts",
      target: "src/domain/models/ajs/AjsDocument",
      kind: "import",
      ruleId: "presentation-domain-dependency",
    },
    {
      source: "src/presentation/webview/editor/ajsTable/Header.tsx",
      target: "src/domain/services/i18n/nls",
      kind: "import",
      ruleId: "presentation-domain-dependency",
    },
    {
      source: "src/presentation/webview/editor/ajsTable/navigation.ts",
      target: "src/domain/models/ajs/AjsDocument",
      kind: "import-type",
      ruleId: "presentation-domain-dependency",
    },
    {
      source: "src/presentation/webview/editor/ajsTable/tableColumnDef.tsx",
      target: "src/domain/services/i18n/nls",
      kind: "import",
      ruleId: "presentation-domain-dependency",
    },
    {
      source: "src/presentation/webview/editor/ajsTable/TableContents.tsx",
      target: "src/domain/models/ajs/AjsDocument",
      kind: "import",
      ruleId: "presentation-domain-dependency",
    },
    {
      source: "src/presentation/webview/editor/ajsTable/tableViewerData.ts",
      target: "src/domain/models/ajs/AjsDocument",
      kind: "import",
      ruleId: "presentation-domain-dependency",
    },
    {
      source:
        "src/presentation/webview/editor/ajsTable/UnitListDetailPanel.tsx",
      target: "src/domain/services/i18n/nls",
      kind: "import",
      ruleId: "presentation-domain-dependency",
    },
    {
      source: "src/presentation/webview/editor/UnitEntityDialog.tsx",
      target: "src/domain/services/i18n/nls",
      kind: "import",
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
  ...unitPresentationAllowances,
  ...nodeBoundaryAllowances,
];
