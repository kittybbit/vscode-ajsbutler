import * as assert from "assert";
import { Table } from "@tanstack/table-core";
import {
  buildUnitListProjection,
  UnitListRowView,
} from "../../application/unit-list/buildUnitListView";
import type { AjsDocument } from "../../domain/models/ajs/AjsDocument";
import {
  exportCsvView,
  toExportUnitListCsvInput,
} from "../../presentation/webview/editor/ajsTable/exportCsvView";

suite("Export CSV View", () => {
  test("exports visible reordered Slice 2 row values for copy and save", () => {
    const document: AjsDocument = {
      rootUnits: [
        {
          id: "job-id",
          name: "job",
          unitAttribute: "job,,jp1admin,",
          unitType: "j",
          absolutePath: "/job",
          depth: 0,
          isRoot: true,
          isRootJobnet: false,
          hasSchedule: false,
          hasWaitedFor: false,
          layout: { h: 0, v: 0 },
          parameters: [{ key: "ty", value: "j" }],
          relations: [],
          children: [],
        },
      ],
      warnings: [],
    };
    const row = buildUnitListProjection(document).rows[0];
    const table = {
      getHeaderGroups: () => [
        {
          headers: [
            {
              colSpan: 1,
              isPlaceholder: false,
              column: { columnDef: { header: "#" } },
            },
            {
              colSpan: 1,
              isPlaceholder: false,
              column: { columnDef: { header: "Flags" } },
            },
            {
              colSpan: 1,
              isPlaceholder: false,
              column: { columnDef: { header: "Command" } },
            },
            {
              colSpan: 1,
              isPlaceholder: false,
              column: { columnDef: { header: "Empty" } },
            },
            {
              colSpan: 2,
              isPlaceholder: true,
              column: { columnDef: { header: "Hidden group" } },
            },
          ],
        },
      ],
      getVisibleLeafColumns: () => [
        {
          columnDef: { header: "#" },
        },
        {
          columnDef: {
            header: "Flags",
            accessorFn: () => ["one", "two"],
          },
        },
        {
          columnDef: {
            header: "Command",
            accessorFn: (unit: UnitListRowView) => `${unit.group1.name}\nline2`,
          },
        },
        {
          columnDef: {
            header: "Empty",
            accessorFn: () => undefined,
          },
        },
      ],
      getRowModel: () => ({
        rows: [
          {
            original: row,
          },
        ],
      }),
    } as Table<UnitListRowView>;

    const input = toExportUnitListCsvInput(table);
    const copyCsv = exportCsvView(table);
    const saveCsv = exportCsvView(table);

    assert.deepStrictEqual(input, {
      headerRows: [["#", "Flags", "Command", "Empty", "", ""]],
      rows: [{ values: ["one\ntwo", "job\nline2", ""] }],
    });
    assert.deepStrictEqual(JSON.parse(JSON.stringify(input)), input);
    assert.strictEqual(
      copyCsv,
      '"#","Flags","Command","Empty","",""\n"1","one\ntwo","job\nline2",""',
    );
    assert.strictEqual(saveCsv, copyCsv);
  });
});
