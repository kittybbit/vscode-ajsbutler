import * as assert from "assert";
import {
  buildExportUnitListCsvInput,
  exportUnitListCsv,
  exportUnitListCsvRows,
} from "../../application/unit-list/exportUnitListCsv";

suite("Export Unit List CSV", () => {
  test("quotes and escapes every exported field", () => {
    const csv = exportUnitListCsv({
      headerRows: [
        ["#", 'Name "quoted"'],
        ["", "Owner"],
      ],
      dataRows: [
        ["1", "line1\nline2"],
        ["2", 'value "x"'],
      ],
    });

    assert.strictEqual(
      csv,
      '"#","Name ""quoted"""\n"","Owner"\n"1","line1\nline2"\n"2","value ""x"""',
    );
  });

  test("builds CSV input from application-facing row data", () => {
    const input = buildExportUnitListCsvInput({
      headerRows: [["#", "Name", "Comment"]],
      rows: [
        { name: "root", comment: "line1\nline2" },
        { name: 'job "quoted"', comment: "" },
      ],
      columns: [{ value: (row) => row.name }, { value: (row) => row.comment }],
    });

    assert.deepStrictEqual(input, {
      headerRows: [["#", "Name", "Comment"]],
      dataRows: [
        ["1", "root", "line1\nline2"],
        ["2", 'job "quoted"', ""],
      ],
    });
    assert.strictEqual(
      exportUnitListCsvRows({
        headerRows: [["#", "Name", "Comment"]],
        rows: [{ name: "root", comment: "line1\nline2" }],
        columns: [
          { value: (row) => row.name },
          { value: (row) => row.comment },
        ],
      }),
      '"#","Name","Comment"\n"1","root","line1\nline2"',
    );
  });
});
