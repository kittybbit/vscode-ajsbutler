import React from "react";
import { createRoot, type Root } from "react-dom/client";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import type { FlowGraphUnitDto } from "../../application/flow-graph/flowGraphDocument";
import UnitTreeSelector from "../../presentation/webview/editor/shared/UnitTreeSelector";

let root: Root | undefined;
let container: HTMLDivElement | undefined;

const createUnitById = (
  rootUnits: readonly FlowGraphUnitDto[],
): ReadonlyMap<string, Pick<FlowGraphUnitDto, "id" | "parentId">> => {
  const units = new Map<string, Pick<FlowGraphUnitDto, "id" | "parentId">>();
  const visit = (unit: FlowGraphUnitDto): void => {
    units.set(unit.id, { id: unit.id, parentId: unit.parentId });
    unit.children.forEach(visit);
  };
  rootUnits.forEach(visit);
  return units;
};

export const mount = (
  rootUnits: FlowGraphUnitDto[],
  selectedUnitId: string,
): void => {
  if (root !== undefined) {
    throw new Error("The accessibility fixture is already mounted.");
  }

  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  const unitById = createUnitById(rootUnits);
  root.render(
    <ThemeProvider theme={createTheme()}>
      <UnitTreeSelector
        rootUnits={rootUnits}
        unitById={unitById}
        selectedUnitId={selectedUnitId}
        autoScrollSelectedUnit={false}
        onSelectUnit={() => undefined}
        ariaLabel="Unit tree"
        title="Unit tree"
      />
    </ThemeProvider>,
  );
};

export const dispose = (): void => {
  const activeRoot = root;
  root = undefined;
  if (activeRoot !== undefined) {
    activeRoot.unmount();
  }

  const activeContainer = container;
  container = undefined;
  activeContainer?.remove();
};
