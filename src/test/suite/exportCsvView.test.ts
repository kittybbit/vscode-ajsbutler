import * as assert from "assert";
import { Table } from "@tanstack/table-core";
import Parameter from "../../domain/models/parameters/Parameter";
import { UnitListRowView } from "../../application/unit-list/buildUnitListView";
import { exportCsvView } from "../../ui-component/editor/ajsTable/exportCsvView";

class TestParameter extends Parameter {}

suite("Export CSV View", () => {
  test("exports table cells from UnitListRowView data without changing CSV output", () => {
    const parameter = new TestParameter({
      unit: {} as never,
      parameter: "prm",
      rawValue: '"line1\nline2"',
      inherited: false,
      position: 0,
    });
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
              column: { columnDef: { header: "Command" } },
            },
            {
              colSpan: 1,
              isPlaceholder: false,
              column: { columnDef: { header: "Flags" } },
            },
          ],
        },
      ],
      getRowModel: () => ({
        rows: [
          {
            getVisibleCells: () => [
              {
                getValue: () => undefined,
              },
              {
                getValue: () => parameter,
              },
              {
                getValue: () => ["one", "two"],
              },
            ],
          },
        ],
      }),
    } as unknown as Table<UnitListRowView>;

    const csv = exportCsvView(table);

    assert.strictEqual(csv, '"#","Command","Flags"\n"1","line1\nline2","one\ntwo"');
  });
});
