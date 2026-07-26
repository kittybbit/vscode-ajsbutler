export const viewerOperationIds = {
  copyCsv: "copy.csv",
  saveCsv: "save.csv",
  unitSelect: "unit.select",
  definitionOpen: "definition.open",
  flowScopeOpen: "flow.scope.open",
  flowNestedToggle: "flow.nested.toggle",
  flowRelationshipFocusToggle: "flow.relationship_focus.toggle",
  flowMiniMapToggle: "flow.minimap.toggle",
} as const;

export type ViewerOperationId =
  (typeof viewerOperationIds)[keyof typeof viewerOperationIds];
