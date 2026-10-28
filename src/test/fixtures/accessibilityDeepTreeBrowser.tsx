import React, { useMemo, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import type { FlowGraphUnitDto } from "../../application/flow-graph/flowGraphDocument";
import VirtualizedTable from "../../presentation/webview/editor/ajsTable/VirtualizedTable";
import type { TableRowView } from "../../presentation/webview/editor/ajsTable/tableViewerData";
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

const createTableRow = (index: number): TableRowView =>
  ({
    id: `job-${index}`,
    absolutePath: `/root/job-${index}`,
    group1: { name: `job-${index}` },
  }) as unknown as TableRowView;

const VirtualizedGridFixture = ({ rowCount }: { rowCount: number }) => {
  const rows = useMemo(
    () => Array.from({ length: rowCount }, (_, index) => createTableRow(index)),
    [rowCount],
  );
  const [selectedAbsolutePath, setSelectedAbsolutePath] = useState(
    rows[0]?.absolutePath,
  );
  const table = useReactTable({
    data: rows,
    columns: [
      {
        id: "#",
        header: "#",
        enableHiding: false,
        enableSorting: false,
        accessorFn: (_row: TableRowView, index: number) => index + 1,
      },
      {
        id: "name",
        header: "Name",
        accessorFn: (row: TableRowView) => row.group1.name,
      },
      {
        id: "path",
        header: "Path",
        accessorFn: (row: TableRowView) => row.absolutePath,
      },
    ],
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <ThemeProvider theme={createTheme()}>
      <div style={{ height: 420, width: 900 }}>
        <VirtualizedTable
          headerGroups={table.getHeaderGroups()}
          rows={table.getRowModel().rows}
          rowIndex={rows.findIndex(
            (row) => row.absolutePath === selectedAbsolutePath,
          )}
          columnVisibility={{}}
          searchQuery=""
          parameterSearchValuesByPath={new Map()}
          selectedAbsolutePath={selectedAbsolutePath}
          selectRow={setSelectedAbsolutePath}
          focusUnitTree={() => undefined}
          openDetailPane={() => undefined}
          restoreFocusRequest={{ revision: 0 }}
          gridAriaLabel="Virtualized units"
        />
      </div>
    </ThemeProvider>
  );
};

export const mountGrid = (rowCount: number): void => {
  if (root !== undefined) {
    throw new Error("The accessibility fixture is already mounted.");
  }

  container = document.createElement("div");
  container.style.height = "420px";
  container.style.width = "900px";
  document.body.append(container);
  root = createRoot(container);
  root.render(<VirtualizedGridFixture rowCount={rowCount} />);
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
