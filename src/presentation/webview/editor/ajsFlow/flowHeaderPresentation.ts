import type { FlowGraphUnitDto } from "../../../../application/flow-graph/flowGraphDocument";
import type { HeaderSearchControlLabels } from "../shared/headerSearchControlModel";
import { unitInformationMessage } from "../unitInformationLocalization";

const isRootJobnet = (unit: FlowGraphUnitDto): boolean =>
  unit.unitType === "n" && unit.isRootJobnet;

export const getFlowHeaderSearchLabels = (
  language: string,
): HeaderSearchControlLabels => ({
  helperText: {
    noResults: unitInformationMessage("a11y.flow.search.noResults", language),
    matched: unitInformationMessage("a11y.flow.search.matched", language),
    idle: unitInformationMessage("a11y.flow.search.idle", language),
  },
  navigation: {
    resultAriaLabel: (position) => `${position.current} / ${position.total}`,
    previousTooltip: unitInformationMessage("a11y.search.previous", language),
    previousAriaLabel: unitInformationMessage("a11y.search.previous", language),
    nextTooltip: unitInformationMessage("a11y.search.next", language),
    nextAriaLabel: unitInformationMessage("a11y.search.next", language),
  },
});

export const getCurrentUnitLabel = (
  currentUnit?: FlowGraphUnitDto,
  language = "en",
): string | undefined => {
  if (!currentUnit) {
    return undefined;
  }
  if (isRootJobnet(currentUnit)) {
    return unitInformationMessage("a11y.flow.rootJobnet", language);
  }
  return currentUnit.unitType.toUpperCase();
};

export const getExpandAllLabel = (
  hasExpandedAllNestedUnits: boolean,
  language: string,
): string =>
  unitInformationMessage(
    hasExpandedAllNestedUnits
      ? "a11y.flow.controls.collapseAll"
      : "a11y.flow.controls.expandAll",
    language,
  );
