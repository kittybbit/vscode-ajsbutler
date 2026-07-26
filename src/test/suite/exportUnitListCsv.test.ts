import * as assert from "assert";
import { exportUnitListCsv } from "../../application/unit-list/exportUnitListCsv";

suite("Export Unit List CSV", () => {
  test("quotes and escapes every exported field", () => {
    const csv = exportUnitListCsv({
      headerRows: [
        ["#", 'Name "quoted"'],
        ["", "Owner"],
      ],
      rows: [{ values: ["line1\nline2"] }, { values: ['value "x"'] }],
    });

    assert.strictEqual(
      csv,
      '"#","Name ""quoted"""\n"","Owner"\n"1","line1\nline2"\n"2","value ""x"""',
    );
  });

  test("numbers plain visible rows and preserves ordering and empty values", () => {
    const csv = exportUnitListCsv({
      headerRows: [["#", "Name", "Comment"]],
      rows: [
        { values: ["root", "line1\nline2"] },
        { values: ['job "quoted"', ""] },
      ],
    });

    assert.strictEqual(
      csv,
      '"#","Name","Comment"\n"1","root","line1\nline2"\n"2","job ""quoted""",""',
    );
  });

  test("preserves empty and header-only payloads", () => {
    assert.strictEqual(exportUnitListCsv({ headerRows: [], rows: [] }), "");
    assert.strictEqual(
      exportUnitListCsv({ headerRows: [["#", "Name"]], rows: [] }),
      '"#","Name"',
    );
  });

  test("exports representative large plain row and column input", () => {
    const rowCount = 500;
    const columnCount = 20;
    const csv = exportUnitListCsv({
      headerRows: [
        [
          "#",
          ...Array.from({ length: columnCount }, (_, index) => `C${index}`),
        ],
      ],
      rows: Array.from({ length: rowCount }, (_, rowIndex) => ({
        values: Array.from(
          { length: columnCount },
          (_, columnIndex) => `R${rowIndex}C${columnIndex}`,
        ),
      })),
    });
    const lines = csv.split("\n");

    assert.strictEqual(lines.length, rowCount + 1);
    assert.ok(lines[0]?.startsWith('"#","C0","C1"'));
    assert.ok(lines.at(-1)?.startsWith('"500","R499C0","R499C1"'));
  });
});
