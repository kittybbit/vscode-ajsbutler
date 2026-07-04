import type {
  AjsNormalizationWarning,
  AjsDocument,
  AjsParameter,
  AjsRelation,
  AjsUnit,
} from "../../domain/models/ajs/AjsDocument";

export type UnitListRootDto = Omit<
  AjsUnit,
  "layout" | "parameters" | "relations" | "children"
> & {
  layout: {
    h: number;
    v: number;
  };
  parameters: AjsParameter[];
  relations: AjsRelation[];
  children: UnitListRootDto[];
};

export type UnitListDocumentDto = {
  rootUnits: UnitListRootDto[];
  warnings: AjsNormalizationWarning[];
};

const copyParameter = (parameter: AjsParameter): AjsParameter => ({
  ...parameter,
});

const copyRelation = (relation: AjsRelation): AjsRelation => ({
  ...relation,
});

const copyWarning = (
  warning: AjsNormalizationWarning,
): AjsNormalizationWarning => ({
  ...warning,
});

export const toUnitListRootDto = (unit: AjsUnit): UnitListRootDto => {
  const dto: UnitListRootDto = {
    id: unit.id,
    name: unit.name,
    unitAttribute: unit.unitAttribute,
    unitType: unit.unitType,
    absolutePath: unit.absolutePath,
    depth: unit.depth,
    isRoot: unit.isRoot,
    isRootJobnet: unit.isRootJobnet,
    hasSchedule: unit.hasSchedule,
    hasWaitedFor: unit.hasWaitedFor,
    layout: { ...unit.layout },
    parameters: unit.parameters.map(copyParameter),
    relations: unit.relations.map(copyRelation),
    children: unit.children.map(toUnitListRootDto),
  };

  if (unit.permission !== undefined) {
    dto.permission = unit.permission;
  }
  if (unit.jp1Username !== undefined) {
    dto.jp1Username = unit.jp1Username;
  }
  if (unit.jp1ResourceGroup !== undefined) {
    dto.jp1ResourceGroup = unit.jp1ResourceGroup;
  }
  if (unit.groupType !== undefined) {
    dto.groupType = unit.groupType;
  }
  if (unit.comment !== undefined) {
    dto.comment = unit.comment;
  }
  if (unit.parentId !== undefined) {
    dto.parentId = unit.parentId;
  }
  if (unit.isRecovery !== undefined) {
    dto.isRecovery = unit.isRecovery;
  }

  return dto;
};

export const toUnitListDocumentDto = (
  document: AjsDocument,
): UnitListDocumentDto => ({
  rootUnits: document.rootUnits.map(toUnitListRootDto),
  warnings: document.warnings.map(copyWarning),
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isUnitListDocumentDto = (
  document: unknown,
): document is UnitListDocumentDto =>
  isRecord(document) && Array.isArray(document.rootUnits);

const toAjsUnit = (unit: UnitListRootDto): AjsUnit => ({
  ...unit,
  layout: { ...unit.layout },
  parameters: unit.parameters.map(copyParameter),
  relations: unit.relations.map(copyRelation),
  children: unit.children.map(toAjsUnit),
});

/**
 * Restores the normalized model after its plain DTO crosses the webview
 * serialization boundary.
 */
export function toAjsDocument(document: UnitListDocumentDto): AjsDocument;
export function toAjsDocument(document: unknown): AjsDocument | undefined;
export function toAjsDocument(document: unknown): AjsDocument | undefined {
  if (!isUnitListDocumentDto(document)) {
    return undefined;
  }

  try {
    return {
      rootUnits: document.rootUnits.map(toAjsUnit),
      warnings: Array.isArray(document.warnings)
        ? document.warnings.map(copyWarning)
        : [],
    };
  } catch {
    return undefined;
  }
}
