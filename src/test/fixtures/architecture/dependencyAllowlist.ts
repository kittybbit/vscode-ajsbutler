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

const rawUnitAllowances = ownedBy(
  "isolate-parser-boundary",
  "Raw Unit is confined to the parser and normalizer seam.",
  [],
);

const legacyWrapperAllowances = ownedBy(
  "complete-normalized-domain-model",
  "The legacy wrapper dependency is removed or explicitly reclassified.",
  [
    {
      source: "src/domain/models/ajs/normalize/unit.ts",
      target: "src/domain/models/units/unitGroupStateHelpers",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/ajs/normalize/unit.ts",
      target: "src/domain/models/units/unitJobnetStateHelpers",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/ajs/normalize/unit.ts",
      target: "src/domain/models/units/unitLayoutHelpers",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/ajs/normalize/unit.ts",
      target: "src/domain/models/units/unitLayoutHelpers",
      kind: "import-type",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/ajs/normalize/unit.ts",
      target: "src/domain/models/units/unitScheduleStateHelpers",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/ajs/normalize/unit.ts",
      target: "src/domain/models/units/unitWaitStateHelpers",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/ajs/normalize/unitBuilder.ts",
      target: "src/domain/models/units/unitDepthHelpers",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/ajs/normalize/unitBuilder.ts",
      target: "src/domain/models/units/unitTypeHelpers",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/parameters/optionalArrayParameterBuilders.ts",
      target: "src/domain/models/units/UnitEntity",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/parameters/optionalScalarParameterBuilders.ts",
      target: "src/domain/models/units/N",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/parameters/optionalScalarParameterBuilders.ts",
      target: "src/domain/models/units/UnitEntity",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/parameters/Parameter.ts",
      target: "src/domain/models/units/UnitEntity",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/parameters/parameter.types.d.ts",
      target: "src/domain/models/units/UnitEntity",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/parameters/requiredScalarParameterBuilders.ts",
      target: "src/domain/models/units/UnitEntity",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/parameters/ruleParameterBuilders.ts",
      target: "src/domain/models/units/N",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/parameters/ruleParameterBuilders.ts",
      target: "src/domain/models/units/UnitEntity",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source:
        "src/domain/models/parameters/transferOperationParameterBuilders.ts",
      target: "src/domain/models/units/Cj",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source:
        "src/domain/models/parameters/transferOperationParameterBuilders.ts",
      target: "src/domain/models/units/J",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/units/Cj.ts",
      target: "src/domain/models/units/unitCapabilityEntities",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/units/Cmsj.ts",
      target: "src/domain/models/units/unitCapabilityEntities",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/units/Cpj.ts",
      target: "src/domain/models/units/unitCapabilityEntities",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/units/Evsj.ts",
      target: "src/domain/models/units/unitCapabilityEntities",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/units/Evwj.ts",
      target: "src/domain/models/units/unitCapabilityEntities",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/units/Flwj.ts",
      target: "src/domain/models/units/unitCapabilityEntities",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/units/Fxj.ts",
      target: "src/domain/models/units/unitCapabilityEntities",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/units/G.ts",
      target: "src/domain/models/units/UnitEntity",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/units/G.ts",
      target: "src/domain/models/units/unitGroupStateHelpers",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/units/Htpj.ts",
      target: "src/domain/models/units/unitCapabilityEntities",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/units/J.ts",
      target: "src/domain/models/units/unitCapabilityEntities",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/units/Jdj.ts",
      target: "src/domain/models/units/UnitEntity",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/units/Lfwj.ts",
      target: "src/domain/models/units/unitCapabilityEntities",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/units/Mg.ts",
      target: "src/domain/models/units/UnitEntity",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/units/Mlsj.ts",
      target: "src/domain/models/units/unitCapabilityEntities",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/units/Mlwj.ts",
      target: "src/domain/models/units/unitCapabilityEntities",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/units/Mqsj.ts",
      target: "src/domain/models/units/unitCapabilityEntities",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/units/Mqwj.ts",
      target: "src/domain/models/units/unitCapabilityEntities",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/units/Mssj.ts",
      target: "src/domain/models/units/unitCapabilityEntities",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/units/Mswj.ts",
      target: "src/domain/models/units/unitCapabilityEntities",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/units/N.ts",
      target: "src/domain/models/units/unitCapabilityEntities",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/units/N.ts",
      target: "src/domain/models/units/unitJobnetStateHelpers",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/units/N.ts",
      target: "src/domain/models/units/unitScheduleStateHelpers",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/units/Nc.ts",
      target: "src/domain/models/units/unitCapabilityEntities",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/units/Ntwj.ts",
      target: "src/domain/models/units/unitCapabilityEntities",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/units/Orj.ts",
      target: "src/domain/models/units/UnitEntity",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/units/Pwlj.ts",
      target: "src/domain/models/units/unitCapabilityEntities",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/units/Pwrj.ts",
      target: "src/domain/models/units/unitCapabilityEntities",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/units/Qj.ts",
      target: "src/domain/models/units/unitCapabilityEntities",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/units/Rc.ts",
      target: "src/domain/models/units/UnitEntity",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/units/Tmwj.ts",
      target: "src/domain/models/units/unitCapabilityEntities",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/units/unitCapabilityEntities.ts",
      target: "src/domain/models/units/UnitEntity",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/units/unitCapabilityEntities.ts",
      target: "src/domain/models/units/unitPriorityHelpers",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/units/unitCapabilityEntities.ts",
      target: "src/domain/models/units/unitWaitStateHelpers",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/units/UnitEntity.ts",
      target: "src/domain/models/units/unitDepthHelpers",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/units/UnitEntity.ts",
      target: "src/domain/models/units/unitTypeHelpers",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/units/unitPriorityHelpers.ts",
      target: "src/domain/models/units/N",
      kind: "import-type",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/units/unitPriorityHelpers.ts",
      target: "src/domain/models/units/UnitEntity",
      kind: "import-type",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/models/units/unitRelationHelpers.ts",
      target: "src/domain/models/units/UnitEntity",
      kind: "import-type",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/utils/TyUtils.ts",
      target: "src/domain/models/units/Cj",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/utils/TyUtils.ts",
      target: "src/domain/models/units/Cmsj",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/utils/TyUtils.ts",
      target: "src/domain/models/units/Cpj",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/utils/TyUtils.ts",
      target: "src/domain/models/units/Evsj",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/utils/TyUtils.ts",
      target: "src/domain/models/units/Evwj",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/utils/TyUtils.ts",
      target: "src/domain/models/units/Flwj",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/utils/TyUtils.ts",
      target: "src/domain/models/units/Fxj",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/utils/TyUtils.ts",
      target: "src/domain/models/units/G",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/utils/TyUtils.ts",
      target: "src/domain/models/units/Htpj",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/utils/TyUtils.ts",
      target: "src/domain/models/units/J",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/utils/TyUtils.ts",
      target: "src/domain/models/units/Jdj",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/utils/TyUtils.ts",
      target: "src/domain/models/units/Lfwj",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/utils/TyUtils.ts",
      target: "src/domain/models/units/Mg",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/utils/TyUtils.ts",
      target: "src/domain/models/units/Mlsj",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/utils/TyUtils.ts",
      target: "src/domain/models/units/Mlwj",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/utils/TyUtils.ts",
      target: "src/domain/models/units/Mqsj",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/utils/TyUtils.ts",
      target: "src/domain/models/units/Mqwj",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/utils/TyUtils.ts",
      target: "src/domain/models/units/Mssj",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/utils/TyUtils.ts",
      target: "src/domain/models/units/Mswj",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/utils/TyUtils.ts",
      target: "src/domain/models/units/N",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/utils/TyUtils.ts",
      target: "src/domain/models/units/Nc",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/utils/TyUtils.ts",
      target: "src/domain/models/units/Ntwj",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/utils/TyUtils.ts",
      target: "src/domain/models/units/Orj",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/utils/TyUtils.ts",
      target: "src/domain/models/units/Pwlj",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/utils/TyUtils.ts",
      target: "src/domain/models/units/Pwrj",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/utils/TyUtils.ts",
      target: "src/domain/models/units/Qj",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/utils/TyUtils.ts",
      target: "src/domain/models/units/Rc",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/utils/TyUtils.ts",
      target: "src/domain/models/units/Tmwj",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
    {
      source: "src/domain/utils/TyUtils.ts",
      target: "src/domain/models/units/UnitEntity",
      kind: "import",
      ruleId: "legacy-wrapper-dependency",
    },
  ],
);

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
      target: "src/domain/models/parameters/Parameter",
      kind: "import",
      ruleId: "presentation-domain-dependency",
    },
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
      source: "src/presentation/webview/editor/ajsTable/exportCsvView.ts",
      target: "src/domain/models/parameters/Parameter",
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
      source: "src/presentation/webview/editor/ajsTable/globalFilter.ts",
      target: "src/domain/models/parameters/Parameter",
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
  ...rawUnitAllowances,
  ...legacyWrapperAllowances,
  ...flowPresentationAllowances,
  ...unitPresentationAllowances,
  ...nodeBoundaryAllowances,
];
