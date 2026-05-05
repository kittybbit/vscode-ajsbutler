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
        "    rjs=1;",
        "    rje=9;",
        "    rec=3;",
        "    rei=1;",
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

  test("reports retry parameter diagnostics for explicit invalid end-judgment combinations", () => {
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
        "    rjs=1;",
        "    rje=9;",
        "  }",
        "  unit=custom,,jp1admin,;",
        "  {",
        "    ty=cj;",
        "    jd=nm;",
        "    rec=3;",
        "    rei=1;",
        "  }",
        "}",
        "",
      ].join("\n"),
    );

    assert.strictEqual(diagnostics.length, 4);
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
            "Retry parameter (rjs) requires end judgment (jd) to be cod.",
        },
        {
          line: 11,
          column: 4,
          length: 3,
          message:
            "Retry parameter (rje) requires end judgment (jd) to be cod.",
        },
        {
          line: 17,
          column: 4,
          length: 3,
          message:
            "Retry parameter (rec) requires end judgment (jd) to be cod.",
        },
        {
          line: 18,
          column: 4,
          length: 3,
          message:
            "Retry parameter (rei) requires end judgment (jd) to be cod.",
        },
      ],
    );
    assert.deepStrictEqual(
      diagnostics.map((diagnostic) => diagnostic.severity),
      ["error", "error", "error", "error"],
    );
  });

  test("reports retry parameter diagnostics when automatic retry is not enabled", () => {
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
        "    jd=cod;",
        "    rjs=1;",
        "    rje=9;",
        "  }",
        "  unit=custom,,jp1admin,;",
        "  {",
        "    ty=cj;",
        "    jd=cod;",
        "    abr=n;",
        "    rec=3;",
        "    rei=1;",
        "  }",
        "}",
        "",
      ].join("\n"),
    );

    assert.strictEqual(diagnostics.length, 4);
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
            "Retry parameter (rjs) requires automatic retry (abr) to be y.",
        },
        {
          line: 11,
          column: 4,
          length: 3,
          message:
            "Retry parameter (rje) requires automatic retry (abr) to be y.",
        },
        {
          line: 18,
          column: 4,
          length: 3,
          message:
            "Retry parameter (rec) requires automatic retry (abr) to be y.",
        },
        {
          line: 19,
          column: 4,
          length: 3,
          message:
            "Retry parameter (rei) requires automatic retry (abr) to be y.",
        },
      ],
    );
    assert.deepStrictEqual(
      diagnostics.map((diagnostic) => diagnostic.severity),
      ["error", "error", "error", "error"],
    );
  });

  test("does not report file monitoring diagnostics for omitted defaults and valid explicit combinations", () => {
    const diagnostics = buildSyntaxDiagnostics(
      [
        "unit=root,,jp1admin,;",
        "{",
        "  ty=g;",
        "  el=file1,flwj,+0+0;",
        "  el=file2,rflwj,+160+0;",
        "  unit=file1,,jp1admin,;",
        "  {",
        "    ty=flwj;",
        "    flco=y;",
        "  }",
        "  unit=file2,,jp1admin,;",
        "  {",
        "    ty=rflwj;",
        "    flwc=c:d:s;",
        "    flco=n;",
        "  }",
        "}",
        "",
      ].join("\n"),
    );

    assert.deepStrictEqual(diagnostics, []);
  });

  test("reports file monitoring diagnostics for explicit invalid condition combinations", () => {
    const diagnostics = buildSyntaxDiagnostics(
      [
        "unit=root,,jp1admin,;",
        "{",
        "  ty=g;",
        "  el=file1,flwj,+0+0;",
        "  el=file2,rflwj,+160+0;",
        "  unit=file1,,jp1admin,;",
        "  {",
        "    ty=flwj;",
        "    flwc=d:s:m;",
        "  }",
        "  unit=file2,,jp1admin,;",
        "  {",
        "    ty=rflwj;",
        "    flwc=d:s;",
        "    flco=y;",
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
          line: 9,
          column: 4,
          length: 4,
          message:
            "File monitoring condition (flwc) cannot specify both s and m.",
        },
        {
          line: 15,
          column: 4,
          length: 4,
          message:
            "File close option (flco) requires file creation monitoring (flwc=c).",
        },
      ],
    );
    assert.deepStrictEqual(
      diagnostics.map((diagnostic) => diagnostic.severity),
      ["error", "error"],
    );
  });
});
