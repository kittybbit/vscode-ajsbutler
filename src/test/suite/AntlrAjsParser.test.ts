import * as assert from "assert";
import { AntlrAjsParser } from "../../infrastructure/parser/AntlrAjsParser";

suite("ANTLR AJS parser adapter", () => {
  const parser = new AntlrAjsParser();

  test("maps nested units into the raw unit model", () => {
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

    assert.deepStrictEqual(result.errors, []);
    assert.strictEqual(result.rootUnits[0].name, "root");
    assert.strictEqual(result.rootUnits[0].children[0].name, "child");
    assert.strictEqual(result.rootUnits[0].children[0].parent?.name, "root");
  });

  test("returns repository-owned syntax error positions and messages", () => {
    const result = parser.parse(`
unit=root,,jp1admin,;
{
  ty=g
}
`);

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
