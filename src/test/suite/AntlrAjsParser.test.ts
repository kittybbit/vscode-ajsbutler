import * as assert from "assert";
import { flattenAjsUnits } from "../../domain/models/ajs/AjsDocument";
import { AntlrAjsParser } from "../../infrastructure/parser/AntlrAjsParser";
import { AntlrRawAjsParser } from "../../infrastructure/parser/AntlrRawAjsParser";

const buildBoundedLargeDefinition = (childCount: number): string => {
  const childDefinitions = Array.from(
    { length: childCount },
    (_, index) => `unit=job-${index},,jp1admin,;{ty=j;}`,
  ).join("\n");
  return `unit=root,,jp1admin,;{ty=g;${childDefinitions}}`;
};

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

  test("keeps encoded parameters plain while normalizing the comment", () => {
    const result = parser.parse(`
unit=root,,jp1admin,;
{
  ty=g;
  cm="first#"#"##note";
}
`);

    assert.strictEqual(result.ok, true);
    if (!result.ok) {
      throw new Error("Expected encoded parameter definition to parse.");
    }
    const root = result.document.rootUnits[0];
    assert.strictEqual(root.comment, 'first""#note');
    assert.strictEqual(
      root.parameters.find((parameter) => parameter.key === "cm")?.value,
      '"first#"#"##note"',
    );
    assert.ok(!("parent" in root));
  });

  test("returns no partial document for a truncated definition", () => {
    const result = parser.parse(`
unit=root,,jp1admin,;
{
  ty=g;
  unit=child,,jp1admin,;
  {
    ty=j;
  }
`);

    assert.strictEqual(result.ok, false);
    if (result.ok) {
      throw new Error("Expected truncated definition to fail.");
    }
    assert.ok(!("document" in result));
    assert.ok(result.errors.length > 0);
    assert.ok(
      result.errors.every(
        ({ line, column, message }) =>
          line >= 1 && column >= 0 && message.length > 0,
      ),
    );
  });

  test("completes a bounded-large definition without partial normalization", () => {
    const childCount = 500;
    const result = parser.parse(buildBoundedLargeDefinition(childCount));

    assert.strictEqual(result.ok, true);
    if (!result.ok) {
      throw new Error("Expected bounded-large definition to parse.");
    }
    const allUnits = flattenAjsUnits(result.document.rootUnits);
    assert.strictEqual(allUnits.length, childCount + 1);
    assert.strictEqual(allUnits[0].id, "/root");
    assert.strictEqual(allUnits.at(-1)?.id, `/root/job-${childCount - 1}`);
    assert.deepStrictEqual(result.document.warnings, []);
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
