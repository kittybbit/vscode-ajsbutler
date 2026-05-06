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

  test("does not report event sending diagnostics for omitted evsrt defaults", () => {
    const diagnostics = buildSyntaxDiagnostics(
      [
        "unit=root,,jp1admin,;",
        "{",
        "  ty=g;",
        "  el=event1,evsj,+0+0;",
        "  unit=event1,,jp1admin,;",
        "  {",
        "    ty=evsj;",
        "  }",
        "}",
        "",
      ].join("\n"),
    );

    assert.deepStrictEqual(diagnostics, []);
  });

  test("does not report event sending diagnostics for valid explicit arrival-check settings", () => {
    const diagnostics = buildSyntaxDiagnostics(
      [
        "unit=root,,jp1admin,;",
        "{",
        "  ty=g;",
        "  el=event1,evsj,+0+0;",
        "  el=event2,revsj,+160+0;",
        "  el=event3,evsj,+320+0;",
        "  unit=event1,,jp1admin,;",
        "  {",
        "    ty=evsj;",
        "    evsrt=y;",
        "    evhst=server-a;",
        "  }",
        "  unit=event2,,jp1admin,;",
        "  {",
        "    ty=revsj;",
        "    evsrt=n;",
        "  }",
        "}",
        "",
      ].join("\n"),
    );

    assert.deepStrictEqual(diagnostics, []);
  });

  test("does not report event sending evsid diagnostics for omitted and valid explicit hexadecimal values", () => {
    const diagnostics = buildSyntaxDiagnostics(
      [
        "unit=root,,jp1admin,;",
        "{",
        "  ty=g;",
        "  el=event1,evsj,+0+0;",
        "  el=event2,revsj,+160+0;",
        "  unit=event1,,jp1admin,;",
        "  {",
        "    ty=evsj;",
        "    evsid=1fff;",
        "  }",
        "  unit=event2,,jp1admin,;",
        "  {",
        "    ty=revsj;",
        "    evsid=7fff8000;",
        "  }",
        "  unit=event3,,jp1admin,;",
        "  {",
        "    ty=evsj;",
        "  }",
        "}",
        "",
      ].join("\n"),
    );

    assert.deepStrictEqual(diagnostics, []);
  });

  test("reports event sending evsid diagnostics for explicit invalid values", () => {
    const diagnostics = buildSyntaxDiagnostics(
      [
        "unit=root,,jp1admin,;",
        "{",
        "  ty=g;",
        "  el=event1,evsj,+0+0;",
        "  el=event2,revsj,+160+0;",
        "  unit=event1,,jp1admin,;",
        "  {",
        "    ty=evsj;",
        "    evsid=ACT-1;",
        "  }",
        "  unit=event2,,jp1admin,;",
        "  {",
        "    ty=revsj;",
        "    evsid=00002000;",
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
          length: 5,
          message:
            "Event ID (evsid) must be hexadecimal within 00000000-00001FFF or 7FFF8000-7FFFFFFF.",
        },
        {
          line: 14,
          column: 4,
          length: 5,
          message:
            "Event ID (evsid) must be hexadecimal within 00000000-00001FFF or 7FFF8000-7FFFFFFF.",
        },
      ],
    );
    assert.deepStrictEqual(
      diagnostics.map((diagnostic) => diagnostic.severity),
      ["error", "error"],
    );
  });

  test("does not report event sending range diagnostics for omitted defaults and valid explicit ranges", () => {
    const diagnostics = buildSyntaxDiagnostics(
      [
        "unit=root,,jp1admin,;",
        "{",
        "  ty=g;",
        "  el=event1,evsj,+0+0;",
        "  el=event2,revsj,+160+0;",
        "  unit=event1,,jp1admin,;",
        "  {",
        "    ty=evsj;",
        "  }",
        "  unit=event2,,jp1admin,;",
        "  {",
        "    ty=revsj;",
        "    evspl=600;",
        "    evsrc=999;",
        "  }",
        "}",
        "",
      ].join("\n"),
    );

    assert.deepStrictEqual(diagnostics, []);
  });

  test("reports event sending range diagnostics for explicit out-of-range values", () => {
    const diagnostics = buildSyntaxDiagnostics(
      [
        "unit=root,,jp1admin,;",
        "{",
        "  ty=g;",
        "  el=event1,evsj,+0+0;",
        "  el=event2,revsj,+160+0;",
        "  unit=event1,,jp1admin,;",
        "  {",
        "    ty=evsj;",
        "    evspl=2;",
        "  }",
        "  unit=event2,,jp1admin,;",
        "  {",
        "    ty=revsj;",
        "    evsrc=1000;",
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
          length: 5,
          message:
            "Event arrival check interval (evspl) must be between 3 and 600.",
        },
        {
          line: 14,
          column: 4,
          length: 5,
          message:
            "Event arrival check count (evsrc) must be between 0 and 999.",
        },
      ],
    );
    assert.deepStrictEqual(
      diagnostics.map((diagnostic) => diagnostic.severity),
      ["error", "error"],
    );
  });

  test("reports event sending diagnostics when arrival checking omits evhst", () => {
    const diagnostics = buildSyntaxDiagnostics(
      [
        "unit=root,,jp1admin,;",
        "{",
        "  ty=g;",
        "  el=event1,evsj,+0+0;",
        "  el=event2,revsj,+160+0;",
        "  unit=event1,,jp1admin,;",
        "  {",
        "    ty=evsj;",
        "    evsrt=y;",
        "  }",
        "  unit=event2,,jp1admin,;",
        "  {",
        "    ty=revsj;",
        "    evsrt=y;",
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
          length: 5,
          message:
            "Event arrival check (evsrt=y) requires an event destination host (evhst).",
        },
        {
          line: 14,
          column: 4,
          length: 5,
          message:
            "Event arrival check (evsrt=y) requires an event destination host (evhst).",
        },
      ],
    );
    assert.deepStrictEqual(
      diagnostics.map((diagnostic) => diagnostic.severity),
      ["error", "error"],
    );
  });

  test("does not report event receiving diagnostics for omitted defaults and valid explicit values", () => {
    const diagnostics = buildSyntaxDiagnostics(
      [
        "unit=root,,jp1admin,;",
        "{",
        "  ty=g;",
        "  el=wait1,evwj,+0+0;",
        "  el=wait2,revwj,+160+0;",
        "  el=wait3,evwj,+320+0;",
        "  el=wait4,revwj,+480+0;",
        "  unit=wait1,,jp1admin,;",
        "  {",
        "    ty=evwj;",
        "  }",
        "  unit=wait2,,jp1admin,;",
        "  {",
        "    ty=revwj;",
        "    evwid=0123ABCD:89ABCDEF;",
        "    evesc=no;",
        "  }",
        "  unit=wait3,,jp1admin,;",
        "  {",
        "    ty=evwj;",
        "    evipa=192.168.0.1;",
        "    evesc=720;",
        "  }",
        "  unit=wait4,,jp1admin,;",
        "  {",
        "    ty=revwj;",
        "    evwid=A:1;",
        "    evipa=255.255.255.255;",
        "  }",
        "}",
        "",
      ].join("\n"),
    );

    assert.deepStrictEqual(diagnostics, []);
  });

  test("reports event receiving diagnostics for explicit invalid evesc, evwid, and evipa values", () => {
    const diagnostics = buildSyntaxDiagnostics(
      [
        "unit=root,,jp1admin,;",
        "{",
        "  ty=g;",
        "  el=wait1,evwj,+0+0;",
        "  el=wait2,revwj,+160+0;",
        "  el=wait3,evwj,+320+0;",
        "  el=wait4,revwj,+480+0;",
        "  el=wait5,evwj,+640+0;",
        "  unit=wait1,,jp1admin,;",
        "  {",
        "    ty=evwj;",
        "    evesc=0;",
        "  }",
        "  unit=wait2,,jp1admin,;",
        "  {",
        "    ty=revwj;",
        "    evesc=721;",
        "  }",
        "  unit=wait3,,jp1admin,;",
        "  {",
        "    ty=evwj;",
        "    evesc=abc;",
        "  }",
        "  unit=wait4,,jp1admin,;",
        "  {",
        "    ty=revwj;",
        "    evwid=123456789:1;",
        "  }",
        "  unit=wait5,,jp1admin,;",
        "  {",
        "    ty=evwj;",
        "    evipa=256.10.0.1;",
        "  }",
        "}",
        "",
      ].join("\n"),
    );

    assert.strictEqual(diagnostics.length, 5);
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
          length: 5,
          message:
            "Event search condition (evesc) must be no or between 1 and 720.",
        },
        {
          line: 14,
          column: 4,
          length: 5,
          message:
            "Event search condition (evesc) must be no or between 1 and 720.",
        },
        {
          line: 19,
          column: 4,
          length: 5,
          message:
            "Event search condition (evesc) must be no or between 1 and 720.",
        },
        {
          line: 24,
          column: 4,
          length: 5,
          message:
            "Event ID (evwid) must be hexadecimal in 00000000:00000000-FFFFFFFF:FFFFFFFF format.",
        },
        {
          line: 29,
          column: 4,
          length: 5,
          message:
            "Event source IP address (evipa) must be a dotted-decimal IPv4 address between 0.0.0.0 and 255.255.255.255.",
        },
      ],
    );
    assert.deepStrictEqual(
      diagnostics.map((diagnostic) => diagnostic.severity),
      ["error", "error", "error", "error", "error"],
    );
  });
});
