import * as assert from "assert";
import { AntlrAjsParser } from "../../infrastructure/parser/AntlrAjsParser";
import { AntlrRawAjsParser } from "../../infrastructure/parser/AntlrRawAjsParser";

suite("ANTLR AJS parser adapter", () => {
  const parser = new AntlrAjsParser();

  test("normalizes nested units before returning them", () => {
    const result = parser.parse(`
unit=root,,jp1admin,;
{
  ty=g;
  unit=child,,jp1admin,;
  {
    ty=j;
  }
}
`);

    assert.strictEqual(result.ok, true);
    assert.strictEqual(result.document.rootUnits[0].name, "root");
    assert.strictEqual(result.document.rootUnits[0].children[0].name, "child");
    assert.strictEqual(
      result.document.rootUnits[0].children[0].parentId,
      "/root",
    );
  });

  test("keeps raw parent links inside the infrastructure seam", () => {
    const result = new AntlrRawAjsParser().parse(`
unit=root,,jp1admin,;
{
  ty=g;
  unit=child,,jp1admin,;
  {
    ty=j;
  }
}
`);

    assert.deepStrictEqual(result.errors, []);
    assert.strictEqual(result.rootUnits[0].children[0].parent?.name, "root");
  });

  test("preserves normalization warnings on successful parses", () => {
    const result = parser.parse(`
unit=root,,jp1admin,;
{
}
`);

    assert.strictEqual(result.ok, true);
    assert.strictEqual(result.document.warnings.length, 1);
    assert.strictEqual(result.document.warnings[0].unitPath, "/root");
  });

  test("returns repository-owned syntax error positions and messages", () => {
    const result = parser.parse(`
unit=root,,jp1admin,;
{
  ty=g
}
`);

    assert.strictEqual(result.ok, false);
    if (result.ok) {
      throw new Error("Expected parser failure.");
    }
    assert.ok(!("document" in result));
    assert.ok(result.errors.length > 0);
    assert.deepStrictEqual(Object.keys(result.errors[0]).sort(), [
      "column",
      "line",
      "message",
    ]);
    assert.strictEqual(result.errors[0].line, 5);
    assert.strictEqual(result.errors[0].column, 0);
    assert.strictEqual(result.errors[0].message, "missing ';' at '}'");
  });
});
