import * as assert from "assert";
import { exportUnitListCsv } from "../../application/unit-list/exportUnitListCsv";

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
});
