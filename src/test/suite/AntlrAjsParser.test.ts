import * as assert from "assert";
import { flattenAjsUnits } from "../../domain/models/ajs/AjsDocument";
import { AntlrAjsParser } from "../../infrastructure/parser/AntlrAjsParser";
import { createSemanticDiffSourceIndexIdAllocator } from "../../application/parsing/AjsParserWithSourceIndexPort";
import { AntlrRawAjsParser } from "../../infrastructure/parser/AntlrRawAjsParser";

const buildBoundedLargeDefinition = (childCount: number): string => {
  const childDefinitions = Array.from(
    { length: childCount },
    (_, index) => `unit=job-${index},,jp1admin,;{ty=j;}`,
  ).join("\n");
  return `unit=root,,jp1admin,;{ty=g;${childDefinitions}}`;
};

suite("ANTLR AJS parser adapter", () => {
  const parser = new AntlrAjsParser({
    sourceIndexIdAllocator: createSemanticDiffSourceIndexIdAllocator(),
  });

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

  test("keeps ANTLR syntax errors technical inside the raw seam", () => {
    const result = new AntlrRawAjsParser().parse(`
unit=root,,jp1admin,;
{
  ty=g
}
`);

    assert.strictEqual(result.errors.length, 1);
    assert.deepStrictEqual(Object.keys(result.errors[0]).sort(), [
      "charPositionInLine",
      "line",
      "msg",
    ]);
    assert.strictEqual(result.errors[0].line, 5);
    assert.strictEqual(result.errors[0].charPositionInLine, 0);
    assert.ok(result.errors[0].msg.length > 0);
  });

  test("preserves normalization warnings on successful parses", () => {
    const result = parser.parse(`
unit=root,,jp1admin,;
{
  ty=g;
  el=child,j,+0+0;
  unit=child,,jp1admin,;
  {
    cm="no type";
  }
}
`);

    assert.strictEqual(result.ok, true);
    assert.strictEqual(result.document.warnings.length, 1);
    assert.strictEqual(result.document.warnings[0].unitPath, "/root/child");
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

  test("returns repository-owned syntax error positions and a message", () => {
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
    assert.strictEqual(
      result.errors[0].message,
      "mismatched input '}' expecting ';'",
    );
  });

  test("returns a parser error without constructing a partial source index", () => {
    const result = parser.parseWithSourceIndex(
      "unit=root,,jp1admin,\n{ty=g;}\n",
    );
    assert.strictEqual(result.ok, false);
    if (result.ok) throw new Error("Expected malformed definition to fail.");
    assert.ok(result.errors.length > 0);
    assert.ok(!("sourceIndex" in result));
  });

  test("builds a same-pass source index with exact UTF-16 ranges", () => {
    const result = parser.parseWithSourceIndex(
      "unit=😀root,,jp1admin,;\r\n{\r\n  ty=g;\r\n  cm=😀;\r\n  unit=child,,jp1admin,;\r\n  {\r\n    ty=j;\r\n  }\r\n}",
    );
    assert.strictEqual(result.ok, true);
    if (!result.ok) throw new Error("Expected enriched parser success.");
    assert.strictEqual(result.document.rootUnits[0]?.id, "/😀root");
    const root = result.sourceIndex.unitEntries[0]!;
    assert.strictEqual(root.unitId, "/😀root");
    assert.deepStrictEqual(root.headerRange, {
      start: { line: 0, character: 0 },
      end: { line: 0, character: 23 },
    });
    assert.deepStrictEqual(root.nameRange, {
      start: { line: 0, character: 5 },
      end: { line: 0, character: 11 },
    });
    assert.deepStrictEqual(root.parameterOccurrences[0], {
      parameterKey: "ty",
      occurrenceOrdinal: 0,
      range: {
        start: { line: 2, character: 2 },
        end: { line: 2, character: 4 },
      },
    });
    assert.deepStrictEqual(root.parameterOccurrences[1], {
      parameterKey: "cm",
      occurrenceOrdinal: 0,
      range: {
        start: { line: 3, character: 2 },
        end: { line: 3, character: 4 },
      },
    });
    assert.strictEqual(
      result.sourceIndex.unitEntries[1]?.unitId,
      "/😀root/child",
    );
  });

  test("indexes source after supplementary text with LF and CRLF line resets", () => {
    const lines = [
      "unit=😀root,,jp1admin,;{ty=g;cm=😀🧭;unit=次🚀,,jp1admin,;{ty=j;cm=😀;jd=cod;}}",
      "unit=plain名前,,jp1admin,;{ty=j;cm=日本語;}",
    ];
    const expectedRange = (line: number, token: string) => {
      const character = lines[line]!.indexOf(token);
      assert.ok(character >= 0);
      return {
        start: { line, character },
        end: { line, character: character + token.length },
      };
    };
    for (const newline of ["\n", "\r\n"]) {
      const result = parser.parseWithSourceIndex(lines.join(newline));
      assert.strictEqual(result.ok, true);
      if (!result.ok) throw new Error("Expected Unicode source to parse.");
      const [root, child, plain] = result.sourceIndex.unitEntries;
      assert.deepStrictEqual(
        root!.headerRange,
        expectedRange(0, "unit=😀root,,jp1admin,;"),
      );
      assert.deepStrictEqual(root!.nameRange, expectedRange(0, "😀root"));
      assert.deepStrictEqual(
        child!.headerRange,
        expectedRange(0, "unit=次🚀,,jp1admin,;"),
      );
      assert.deepStrictEqual(child!.nameRange, expectedRange(0, "次🚀"));
      const judgment = child!.parameterOccurrences.find(
        (entry) => entry.parameterKey === "jd",
      )!;
      assert.deepStrictEqual(judgment.range, expectedRange(0, "jd"));
      assert.strictEqual(
        lines[0]!.slice(
          judgment.range.start.character,
          judgment.range.end.character,
        ),
        "jd",
      );
      assert.deepStrictEqual(
        plain!.headerRange,
        expectedRange(1, "unit=plain名前,,jp1admin,;"),
      );
      assert.deepStrictEqual(plain!.nameRange, expectedRange(1, "plain名前"));
      assert.deepStrictEqual(
        plain!.parameterOccurrences[0]!.range,
        expectedRange(1, "ty"),
      );
    }
  });

  test("retains source evidence for a bounded-large supplementary definition", () => {
    const content = buildBoundedLargeDefinition(500).replaceAll(
      "job-",
      "😀job-",
    );
    const result = parser.parseWithSourceIndex(content);
    assert.strictEqual(result.ok, true);
    if (!result.ok) throw new Error("Expected large Unicode source to parse.");
    assert.strictEqual(result.sourceIndex.unitEntries.length, 501);
    const last = result.sourceIndex.unitEntries.at(-1)!;
    const line = content.split("\n").at(-1)!;
    const column = line.indexOf("ty");
    assert.strictEqual(last.unitId, "/root/😀job-499");
    assert.deepStrictEqual(last.parameterOccurrences[0]!.range, {
      start: { line: 499, character: column },
      end: { line: 499, character: column + "ty".length },
    });
  });

  test("retains duplicate normalized paths for unavailable lookup", () => {
    const result = parser.parseWithSourceIndex(
      "unit=root,,jp1admin,;{ty=g;unit=job,,jp1admin,;{ty=j;}unit=job,,jp1admin,;{ty=j;}}",
    );
    assert.strictEqual(result.ok, true);
    if (!result.ok) throw new Error("Expected enriched parser success.");
    assert.strictEqual(
      result.sourceIndex.unitEntries.filter(
        (entry) => entry.unitId === "/root/job",
      ).length,
      2,
    );
  });
});
