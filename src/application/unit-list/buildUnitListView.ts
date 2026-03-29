import {
  AjsDependencyType,
  AjsDocument,
  AjsGroupType,
  AjsUnitType,
  flattenAjsUnits,
} from "../../domain/models/ajs/AjsDocument";

export type UnitListGroup1View = {
  name: string;
  parentAbsolutePath: string;
  parentId?: string;
  unitType: AjsUnitType;
  groupType?: AjsGroupType;
  cty?: string;
  layoutHv?: string;
  size?: string;
};

export type UnitListGroup3View = {
  hardAttribute?: string;
  isRecovery?: boolean;
  jp1Username?: string;
  jp1ResourceGroup?: string;
};

export type UnitListLinkedUnitView = {
  id: string;
  name: string;
  absolutePath: string;
  relationType: AjsDependencyType;
};

export type UnitListGroup2View = {
  comment?: string;
  previousUnits: UnitListLinkedUnitView[];
  nextUnits: UnitListLinkedUnitView[];
  executionAgent?: string;
  nestedConnectionLimit?: string;
  nestedConnectionName?: string;
  nestedConnectionService?: string;
  nestedConnectionEnabled?: string;
  nestedConnectionExternal?: string;
  nestedConnectionHost?: string;
};

export type UnitListRowView = {
  absolutePath: string;
  group2: UnitListGroup2View;
  group1: UnitListGroup1View;
  group3: UnitListGroup3View;
};

export const buildUnitListView = (document: AjsDocument): UnitListRowView[] => {
  const units = flattenAjsUnits(document.rootUnits);
  const unitById = new Map(units.map((unit) => [unit.id, unit]));

  return units.map((unit) => {
    const parent = unit.parentId ? unitById.get(unit.parentId) : undefined;
    const previousUnits =
      parent?.dependencies
        .filter((dependency) => dependency.targetUnitId === unit.id)
        .flatMap((dependency) => {
          const sourceUnit = unitById.get(dependency.sourceUnitId);
          return sourceUnit
            ? [
                {
                  id: sourceUnit.id,
                  name: sourceUnit.name,
                  absolutePath: sourceUnit.absolutePath,
                  relationType: dependency.type,
                },
              ]
            : [];
        }) ?? [];
    const nextUnits =
      parent?.dependencies
        .filter((dependency) => dependency.sourceUnitId === unit.id)
        .flatMap((dependency) => {
          const targetUnit = unitById.get(dependency.targetUnitId);
          return targetUnit
            ? [
                {
                  id: targetUnit.id,
                  name: targetUnit.name,
                  absolutePath: targetUnit.absolutePath,
                  relationType: dependency.type,
                },
              ]
            : [];
        }) ?? [];

    return {
      absolutePath: unit.absolutePath,
      group2: {
        comment: unit.comment,
        previousUnits,
        nextUnits,
        executionAgent: unit.parameters.find(
          (parameter) => parameter.key === "ex",
        )?.value,
        nestedConnectionLimit: unit.parameters.find(
          (parameter) => parameter.key === "ncl",
        )?.value,
        nestedConnectionName: unit.parameters.find(
          (parameter) => parameter.key === "ncn",
        )?.value,
        nestedConnectionService: unit.parameters.find(
          (parameter) => parameter.key === "ncsv",
        )?.value,
        nestedConnectionEnabled: unit.parameters.find(
          (parameter) => parameter.key === "ncs",
        )?.value,
        nestedConnectionExternal: unit.parameters.find(
          (parameter) => parameter.key === "ncex",
        )?.value,
        nestedConnectionHost: unit.parameters.find(
          (parameter) => parameter.key === "nchn",
        )?.value,
      },
      group1: {
        name: unit.name,
        parentAbsolutePath:
          unit.depth > 0
            ? unit.absolutePath.split("/").slice(0, -1).join("/") || "/"
            : "/",
        parentId: unit.parentId,
        unitType: unit.unitType,
        groupType: unit.groupType,
        cty: unit.parameters.find((parameter) => parameter.key === "cty")
          ?.value,
        layoutHv:
          unit.depth > 0 ? `+${unit.layout.h}+${unit.layout.v}` : undefined,
        size: unit.parameters.find((parameter) => parameter.key === "sz")
          ?.value,
      },
      group3: {
        hardAttribute: unit.parameters.find(
          (parameter) => parameter.key === "ha",
        )?.value,
        isRecovery: unit.isRecovery,
        jp1Username: unit.jp1Username,
        jp1ResourceGroup: unit.jp1ResourceGroup,
      },
    };
  });
};
