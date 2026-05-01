import * as assert from "assert";
import { buildSyntaxDiagnostics } from "../../application/editor-feedback/buildSyntaxDiagnostics";

suite("Build Syntax Diagnostics", () => {
  test("returns parser errors as UI-independent diagnostics", () => {
    const diagnostics = buildSyntaxDiagnostics(
      "unit=root,,jp1admin,;\n{\n  ty=g\n}\n",
    );

    assert.ok(diagnostics.length > 0);
    assert.strictEqual(diagnostics[0].severity, "error");
    assert.strictEqual(typeof diagnostics[0].line, "number");
    assert.strictEqual(typeof diagnostics[0].column, "number");
    assert.strictEqual(diagnostics[0].length, 1);
    assert.ok(diagnostics[0].message.length > 0);
  });

  test("returns an empty array for valid input", () => {
    const diagnostics = buildSyntaxDiagnostics(
      "unit=root,,jp1admin,;\n{\n  ty=g;\n}\n",
    );

    assert.deepStrictEqual(diagnostics, []);
  });

  test("does not report end-judgment diagnostics for omitted defaults", () => {
    const diagnostics = buildSyntaxDiagnostics(
      [
        "unit=root,,jp1admin,;",
        "{",
        "  ty=g;",
        "  el=job1,j,+0+0;",
        "  unit=job1,,jp1admin,;",
        "  {",
        "    ty=j;",
        "  }",
        "}",
        "",
      ].join("\n"),
    );

    assert.deepStrictEqual(diagnostics, []);
  });

  test("does not report end-judgment diagnostics for explicit valid retry settings", () => {
    const diagnostics = buildSyntaxDiagnostics(
      [
        "unit=root,,jp1admin,;",
        "{",
        "  ty=g;",
        "  el=job1,j,+0+0;",
        "  unit=job1,,jp1admin,;",
        "  {",
        "    ty=j;",
        "    jd=cod;",
        "    abr=y;",
        "  }",
        "}",
        "",
      ].join("\n"),
    );

    assert.deepStrictEqual(diagnostics, []);
  });

  test("reports end-judgment diagnostics for explicit invalid retry combinations", () => {
    const diagnostics = buildSyntaxDiagnostics(
      [
        "unit=root,,jp1admin,;",
        "{",
        "  ty=g;",
        "  el=job1,j,+0+0;",
        "  el=custom,cj,+160+0;",
        "  unit=job1,,jp1admin,;",
        "  {",
        "    ty=j;",
        "    jd=ab;",
        "    abr=y;",
        "  }",
        "  unit=custom,,jp1admin,;",
        "  {",
        "    ty=cj;",
        "    jd=nm;",
        "    abr=y;",
        "  }",
        "}",
        "",
      ].join("\n"),
    );

    assert.strictEqual(diagnostics.length, 2);
    assert.deepStrictEqual(
      diagnostics.map((diagnostic) => ({
        line: diagnostic.line,
        column: diagnostic.column,
        length: diagnostic.length,
        message: diagnostic.message,
      })),
      [
        {
          line: 10,
          column: 4,
          length: 3,
          message:
            "Automatic retry (abr=y) requires end judgment (jd) to be cod.",
        },
        {
          line: 16,
          column: 4,
          length: 3,
          message:
            "Automatic retry (abr=y) requires end judgment (jd) to be cod.",
        },
      ],
    );
    assert.deepStrictEqual(
      diagnostics.map((diagnostic) => diagnostic.severity),
      ["error", "error"],
    );
  });
});
