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

export type UnitListGroup4View = {
  managerHost?: string;
  managerUnit?: string;
};

export type UnitListGroup5View = {
  startDeadlineDate?: string;
  maximumDuration?: string;
  startTimeType?: string;
  jobGroupType?: AjsGroupType;
};

export type UnitListGroup8View = {
  nestedConnectorRelease?: string;
};

export type UnitListGroup9View = {
  startCondition?: string;
};

export type UnitListRowView = {
  absolutePath: string;
  group2: UnitListGroup2View;
  group1: UnitListGroup1View;
  group3: UnitListGroup3View;
  group4: UnitListGroup4View;
  group5: UnitListGroup5View;
  group8: UnitListGroup8View;
  group9: UnitListGroup9View;
};

const findParameterValue = (
  parameters: Array<{ key: string; value: string }>,
  key: string,
): string | undefined =>
  parameters.find((parameter) => parameter.key === key)?.value;

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
        executionAgent: findParameterValue(unit.parameters, "ex"),
        nestedConnectionLimit: findParameterValue(unit.parameters, "ncl"),
        nestedConnectionName: findParameterValue(unit.parameters, "ncn"),
        nestedConnectionService: findParameterValue(unit.parameters, "ncsv"),
        nestedConnectionEnabled: findParameterValue(unit.parameters, "ncs"),
        nestedConnectionExternal: findParameterValue(unit.parameters, "ncex"),
        nestedConnectionHost: findParameterValue(unit.parameters, "nchn"),
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
        cty: findParameterValue(unit.parameters, "cty"),
        layoutHv:
          unit.depth > 0 ? `+${unit.layout.h}+${unit.layout.v}` : undefined,
        size: findParameterValue(unit.parameters, "sz"),
      },
      group3: {
        hardAttribute: findParameterValue(unit.parameters, "ha"),
        isRecovery: unit.isRecovery,
        jp1Username: unit.jp1Username,
        jp1ResourceGroup: unit.jp1ResourceGroup,
      },
      group4: {
        managerHost:
          unit.unitType === "mg" || unit.unitType === "mn"
            ? findParameterValue(unit.parameters, "mh")
            : undefined,
        managerUnit:
          unit.unitType === "mg" || unit.unitType === "mn"
            ? findParameterValue(unit.parameters, "mu")
            : undefined,
      },
      group5: {
        startDeadlineDate:
          unit.unitType === "g"
            ? findParameterValue(unit.parameters, "sdd")
            : undefined,
        maximumDuration:
          unit.unitType === "g"
            ? findParameterValue(unit.parameters, "md")
            : undefined,
        startTimeType:
          unit.unitType === "g"
            ? findParameterValue(unit.parameters, "stt")
            : undefined,
        jobGroupType: unit.unitType === "g" ? unit.groupType : undefined,
      },
      group8: {
        nestedConnectorRelease:
          unit.unitType === "nc"
            ? findParameterValue(unit.parameters, "ncr")
            : undefined,
      },
      group9: {
        startCondition:
          unit.unitType === "rc"
            ? findParameterValue(unit.parameters, "cond")
            : undefined,
      },
    };
  });
};
