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

  test("does not report schedule-rule diagnostics for valid explicit values and ignored root ln", () => {
    const diagnostics = buildSyntaxDiagnostics(
      [
        "unit=root,,jp1admin,;",
        "{",
        "  ty=g;",
        "  ln=1,999;",
        "  st=144,+47:59;",
        "  cy=143,(12,m);",
        "  shd=142,31;",
        "  cftd=141,af,31,31;",
        "  sy=140,U2879;",
        "  ey=139,47:59;",
        "  wc=138,999;",
        "  wt=137,2879;",
        "  el=jobnet,n,+0+0;",
        "  unit=jobnet,,jp1admin,;",
        "  {",
        "    ty=n;",
        "    ln=136,144;",
        "  }",
        "}",
        "",
      ].join("\n"),
    );

    assert.deepStrictEqual(diagnostics, []);
  });

  test("does not report sd diagnostics for valid explicit dates including sd=0,ud", () => {
    const diagnostics = buildSyntaxDiagnostics(
      [
        "unit=root,,jp1admin,;",
        "{",
        "  ty=g;",
        "  sd=0,ud;",
        "  sd=1,1994/01/01;",
        "  sd=2,2036/12/31;",
        "  sd=3,02/29;",
        "  sd=4,+su:b;",
        "  sd=5,b-30;",
        "  sd=6,@35;",
        "}",
        "",
      ].join("\n"),
      { scheduleLimitYear: 2036 },
    );

    assert.deepStrictEqual(diagnostics, []);
  });

  test("reports schedule-rule diagnostics for explicit out-of-range values", () => {
    const diagnostics = buildSyntaxDiagnostics(
      [
        "unit=root,,jp1admin,;",
        "{",
        "  ty=g;",
        "  ln=1,999;",
        "  st=145,+48:00;",
        "  cy=1,(13,m);",
        "  shd=1,0;",
        "  cftd=1,no,2;",
        "  sy=1,C2880;",
        "  ey=1,48:00;",
        "  wc=1,1000;",
        "  wt=1,2880;",
        "  el=jobnet,n,+0+0;",
        "  unit=jobnet,,jp1admin,;",
        "  {",
        "    ty=n;",
        "    ln=0,145;",
        "  }",
        "}",
        "",
      ].join("\n"),
    );

    assert.strictEqual(diagnostics.length, 9);
    assert.deepStrictEqual(
      diagnostics.map((diagnostic) => ({
        line: diagnostic.line,
        column: diagnostic.column,
        length: diagnostic.length,
        message: diagnostic.message,
      })),
      [
        {
          line: 5,
          column: 2,
          length: 2,
          message:
            "Start time (st) must use schedule rule numbers 1..144 and times between 00:00 and 47:59.",
        },
        {
          line: 6,
          column: 2,
          length: 2,
          message:
            "Cycle value (cy) must use schedule rule numbers 1..144 and cycle ranges y=1..10, m=1..12, w=1..5, or d=1..31.",
        },
        {
          line: 7,
          column: 2,
          length: 3,
          message:
            "Maximum shift days (shd) must use schedule rule numbers 1..144 and values between 1 and 31.",
        },
        {
          line: 8,
          column: 2,
          length: 4,
          message:
            "Days-from-start rule (cftd) must use schedule rule numbers 1..144 with valid no/be/af/db/da ranges.",
        },
        {
          line: 9,
          column: 2,
          length: 2,
          message:
            "Start delay time (sy) must use schedule rule numbers 1..144 and either 00:00-47:59 or M/C/U minutes between 1 and 2879.",
        },
        {
          line: 10,
          column: 2,
          length: 2,
          message:
            "End delay time (ey) must use schedule rule numbers 1..144 and either 00:00-47:59 or M/C/U minutes between 1 and 2879.",
        },
        {
          line: 11,
          column: 2,
          length: 2,
          message:
            "Start-condition count (wc) must use schedule rule numbers 1..144 and values no, un, or 1..999.",
        },
        {
          line: 12,
          column: 2,
          length: 2,
          message:
            "Monitoring end time (wt) must use schedule rule numbers 1..144 and values no, un, 00:00-47:59, or 1..2879 minutes.",
        },
        {
          line: 17,
          column: 4,
          length: 2,
          message:
            "Parent schedule rule (ln) must use schedule rule numbers between 1 and 144.",
        },
      ],
    );
    assert.deepStrictEqual(
      diagnostics.map((diagnostic) => diagnostic.severity),
      [
        "error",
        "error",
        "error",
        "error",
        "error",
        "error",
        "error",
        "error",
        "error",
      ],
    );
  });

  test("reports sd diagnostics for explicit out-of-range rule and date values", () => {
    const diagnostics = buildSyntaxDiagnostics(
      [
        "unit=root,,jp1admin,;",
        "{",
        "  ty=g;",
        "  sd=ud;",
        "  sd=0,15;",
        "  sd=1,1993/12/31;",
        "  sd=2,2037/01/01;",
        "  sd=3,2025/02/29;",
        "  sd=4,04/31;",
        "  sd=5,+36;",
        "  sd=6,+su:6;",
        "  sd=7,b-31;",
        "  sd=8,2026/13/01;",
        "  sd=0,2026/04/ud;",
        "}",
        "",
      ].join("\n"),
      { scheduleLimitYear: 2036 },
    );

    assert.strictEqual(diagnostics.length, 10);
    assert.deepStrictEqual(
      diagnostics.map((diagnostic) => ({
        line: diagnostic.line,
        column: diagnostic.column,
        length: diagnostic.length,
        message: diagnostic.message,
      })),
      [
        {
          line: 4,
          column: 2,
          length: 2,
          message:
            "Execution-start date (sd) must use schedule rule numbers 1..144, except sd=0,ud, and its explicit year/day values must stay within the JP1/AJS3 v13 schedule and SCHEDULELIMIT ranges.",
        },
        {
          line: 5,
          column: 2,
          length: 2,
          message:
            "Execution-start date (sd) must use schedule rule numbers 1..144, except sd=0,ud, and its explicit year/day values must stay within the JP1/AJS3 v13 schedule and SCHEDULELIMIT ranges.",
        },
        {
          line: 6,
          column: 2,
          length: 2,
          message:
            "Execution-start date (sd) must use schedule rule numbers 1..144, except sd=0,ud, and its explicit year/day values must stay within the JP1/AJS3 v13 schedule and SCHEDULELIMIT ranges.",
        },
        {
          line: 7,
          column: 2,
          length: 2,
          message:
            "Execution-start date (sd) must use schedule rule numbers 1..144, except sd=0,ud, and its explicit year/day values must stay within the JP1/AJS3 v13 schedule and SCHEDULELIMIT ranges.",
        },
        {
          line: 8,
          column: 2,
          length: 2,
          message:
            "Execution-start date (sd) must use schedule rule numbers 1..144, except sd=0,ud, and its explicit year/day values must stay within the JP1/AJS3 v13 schedule and SCHEDULELIMIT ranges.",
        },
        {
          line: 9,
          column: 2,
          length: 2,
          message:
            "Execution-start date (sd) must use schedule rule numbers 1..144, except sd=0,ud, and its explicit year/day values must stay within the JP1/AJS3 v13 schedule and SCHEDULELIMIT ranges.",
        },
        {
          line: 10,
          column: 2,
          length: 2,
          message:
            "Execution-start date (sd) must use schedule rule numbers 1..144, except sd=0,ud, and its explicit year/day values must stay within the JP1/AJS3 v13 schedule and SCHEDULELIMIT ranges.",
        },
        {
          line: 11,
          column: 2,
          length: 2,
          message:
            "Execution-start date (sd) must use schedule rule numbers 1..144, except sd=0,ud, and its explicit year/day values must stay within the JP1/AJS3 v13 schedule and SCHEDULELIMIT ranges.",
        },
        {
          line: 12,
          column: 2,
          length: 2,
          message:
            "Execution-start date (sd) must use schedule rule numbers 1..144, except sd=0,ud, and its explicit year/day values must stay within the JP1/AJS3 v13 schedule and SCHEDULELIMIT ranges.",
        },
        {
          line: 13,
          column: 2,
          length: 2,
          message:
            "Execution-start date (sd) must use schedule rule numbers 1..144, except sd=0,ud, and its explicit year/day values must stay within the JP1/AJS3 v13 schedule and SCHEDULELIMIT ranges.",
        },
      ],
    );
    assert.deepStrictEqual(
      diagnostics.map((diagnostic) => diagnostic.severity),
      [
        "error",
        "error",
        "error",
        "error",
        "error",
        "error",
        "error",
        "error",
        "error",
        "error",
      ],
    );
  });

  test("does not report sd/cy compatibility diagnostics for valid explicit schedule combinations", () => {
    const diagnostics = buildSyntaxDiagnostics(
      [
        "unit=root,,jp1admin,;",
        "{",
        "  ty=g;",
        "  sd=1,15;",
        "  cy=1,(2,w);",
        "  sd=2,*15;",
        "  cy=2,(3,d);",
        "  sd=3,@su;",
        "  cy=4,(1,w);",
        "}",
        "",
      ].join("\n"),
    );

    assert.deepStrictEqual(diagnostics, []);
  });

  test("reports sd/cy compatibility diagnostics for explicit weekly cycles on open-day and closed-day schedules", () => {
    const diagnostics = buildSyntaxDiagnostics(
      [
        "unit=root,,jp1admin,;",
        "{",
        "  ty=g;",
        "  sd=1,*15;",
        "  cy=1,(2,w);",
        "  sd=2,@su;",
        "  cy=2,(1,w);",
        "  sd=3,20;",
        "  cy=3,(4,w);",
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
          line: 5,
          column: 2,
          length: 2,
          message:
            "Weekly cycle (cy=(n,w)) cannot be specified when execution-start date (sd) uses open-day (*) or closed-day (@) scheduling for the same rule.",
        },
        {
          line: 7,
          column: 2,
          length: 2,
          message:
            "Weekly cycle (cy=(n,w)) cannot be specified when execution-start date (sd) uses open-day (*) or closed-day (@) scheduling for the same rule.",
        },
      ],
    );
    assert.deepStrictEqual(
      diagnostics.map((diagnostic) => diagnostic.severity),
      ["error", "error"],
    );
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

  test("reports end-judgment numeric range diagnostics for explicit out-of-range values", () => {
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
        "    wth=2147483648;",
        "    tho=-1;",
        "    rjs=0;",
        "    rje=4294967296;",
        "  }",
        "  unit=custom,,jp1admin,;",
        "  {",
        "    ty=cj;",
        "    abr=y;",
        "    rec=13;",
        "    rei=0;",
        "  }",
        "}",
        "",
      ].join("\n"),
    );

    assert.strictEqual(diagnostics.length, 6);
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
          length: 3,
          message: "Warning threshold (wth) must be between 0 and 2147483647.",
        },
        {
          line: 10,
          column: 4,
          length: 3,
          message: "Abnormal threshold (tho) must be between 0 and 2147483647.",
        },
        {
          line: 11,
          column: 4,
          length: 3,
          message: "Retry start code (rjs) must be between 1 and 4294967295.",
        },
        {
          line: 12,
          column: 4,
          length: 3,
          message: "Retry end code (rje) must be between 1 and 4294967295.",
        },
        {
          line: 17,
          column: 4,
          length: 3,
          message: "Retry count (rec) must be between 1 and 12.",
        },
        {
          line: 18,
          column: 4,
          length: 3,
          message: "Retry interval (rei) must be between 1 and 10.",
        },
      ],
    );
    assert.deepStrictEqual(
      diagnostics.map((diagnostic) => diagnostic.severity),
      ["error", "error", "error", "error", "error", "error"],
    );
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

  test("does not report threshold-ordering diagnostics for omitted or ordered explicit end-judgment thresholds", () => {
    const diagnostics = buildSyntaxDiagnostics(
      [
        "unit=root,,jp1admin,;",
        "{",
        "  ty=g;",
        "  el=job1,j,+0+0;",
        "  el=job2,cj,+160+0;",
        "  el=job3,j,+320+0;",
        "  unit=job1,,jp1admin,;",
        "  {",
        "    ty=j;",
        "    jd=cod;",
        "  }",
        "  unit=job2,,jp1admin,;",
        "  {",
        "    ty=cj;",
        "    jd=cod;",
        "    wth=10;",
        "    tho=20;",
        "  }",
        "  unit=job3,,jp1admin,;",
        "  {",
        "    ty=j;",
        "    jd=ab;",
        "    wth=30;",
        "    tho=10;",
        "  }",
        "}",
        "",
      ].join("\n"),
    );

    assert.deepStrictEqual(diagnostics, []);
  });

  test("reports threshold-ordering diagnostics for explicit invalid end-judgment thresholds", () => {
    const diagnostics = buildSyntaxDiagnostics(
      [
        "unit=root,,jp1admin,;",
        "{",
        "  ty=g;",
        "  el=job1,j,+0+0;",
        "  el=job2,cj,+160+0;",
        "  unit=job1,,jp1admin,;",
        "  {",
        "    ty=j;",
        "    jd=cod;",
        "    wth=20;",
        "    tho=10;",
        "  }",
        "  unit=job2,,jp1admin,;",
        "  {",
        "    ty=cj;",
        "    jd=cod;",
        "    wth=15;",
        "    tho=15;",
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
            "Warning threshold (wth) must be less than abnormal threshold (tho).",
        },
        {
          line: 11,
          column: 4,
          length: 3,
          message:
            "Abnormal threshold (tho) must be greater than warning threshold (wth).",
        },
        {
          line: 17,
          column: 4,
          length: 3,
          message:
            "Warning threshold (wth) must be less than abnormal threshold (tho).",
        },
        {
          line: 18,
          column: 4,
          length: 3,
          message:
            "Abnormal threshold (tho) must be greater than warning threshold (wth).",
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

  test("does not report file monitoring target-pattern diagnostics for valid explicit values", () => {
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
        '    flwf="watch.txt";',
        "    flwi=60;",
        "  }",
        "  unit=file2,,jp1admin,;",
        "  {",
        "    ty=rflwj;",
        '    flwf="logs/*.txt";',
        "    flwi=10;",
        "  }",
        "}",
        "",
      ].join("\n"),
    );

    assert.deepStrictEqual(diagnostics, []);
  });

  test("reports file monitoring target-pattern diagnostics for explicit out-of-range values and wildcard short intervals", () => {
    const tooLongFileName = "a".repeat(256);
    const diagnostics = buildSyntaxDiagnostics(
      [
        "unit=root,,jp1admin,;",
        "{",
        "  ty=g;",
        "  el=file1,flwj,+0+0;",
        "  el=file2,rflwj,+160+0;",
        "  el=file3,flwj,+320+0;",
        "  unit=file1,,jp1admin,;",
        "  {",
        "    ty=flwj;",
        `    flwf="${tooLongFileName}";`,
        "  }",
        "  unit=file2,,jp1admin,;",
        "  {",
        "    ty=rflwj;",
        "    flwi=601;",
        "  }",
        "  unit=file3,,jp1admin,;",
        "  {",
        "    ty=flwj;",
        '    flwf="logs/*.txt";',
        "    flwi=9;",
        "  }",
        "}",
        "",
      ].join("\n"),
    );

    assert.strictEqual(diagnostics.length, 3);
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
          length: 4,
          message:
            "Monitored file name (flwf) must be between 1 and 255 bytes.",
        },
        {
          line: 15,
          column: 4,
          length: 4,
          message: "Monitoring interval (flwi) must be between 1 and 600.",
        },
        {
          line: 20,
          column: 4,
          length: 4,
          message:
            "Monitored file name (flwf) cannot use wildcard (*) when monitoring interval (flwi) is between 1 and 9.",
        },
      ],
    );
    assert.deepStrictEqual(
      diagnostics.map((diagnostic) => diagnostic.severity),
      ["error", "error", "error"],
    );
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

  test("does not report event timeout action diagnostics for omitted defaults and valid explicit values", () => {
    const diagnostics = buildSyntaxDiagnostics(
      [
        "unit=root,,jp1admin,;",
        "{",
        "  ty=g;",
        "  el=file1,flwj,+0+0;",
        "  el=file2,rflwj,+160+0;",
        "  el=interval1,tmwj,+320+0;",
        "  el=interval2,rtmwj,+480+0;",
        "  unit=file1,,jp1admin,;",
        "  {",
        "    ty=flwj;",
        "  }",
        "  unit=file2,,jp1admin,;",
        "  {",
        "    ty=rflwj;",
        "    ets=wr;",
        "  }",
        "  unit=interval1,,jp1admin,;",
        "  {",
        "    ty=tmwj;",
        "  }",
        "  unit=interval2,,jp1admin,;",
        "  {",
        "    ty=rtmwj;",
        "    ets=an;",
        "  }",
        "}",
        "",
      ].join("\n"),
    );

    assert.deepStrictEqual(diagnostics, []);
  });

  test("reports event timeout action diagnostics for explicit invalid values", () => {
    const diagnostics = buildSyntaxDiagnostics(
      [
        "unit=root,,jp1admin,;",
        "{",
        "  ty=g;",
        "  el=file1,flwj,+0+0;",
        "  el=interval1,tmwj,+160+0;",
        "  unit=file1,,jp1admin,;",
        "  {",
        "    ty=flwj;",
        "    ets=xx;",
        "  }",
        "  unit=interval1,,jp1admin,;",
        "  {",
        "    ty=tmwj;",
        "    ets=yy;",
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
          length: 3,
          message:
            "Event timeout action (ets) must be one of kl, nr, wr, or an.",
        },
        {
          line: 14,
          column: 4,
          length: 3,
          message:
            "Event timeout action (ets) must be one of kl, nr, wr, or an.",
        },
      ],
    );
    assert.deepStrictEqual(
      diagnostics.map((diagnostic) => diagnostic.severity),
      ["error", "error"],
    );
  });

  test("does not report execution-interval control diagnostics for valid start-condition values", () => {
    const diagnostics = buildSyntaxDiagnostics(
      [
        "unit=root,,jp1admin,;",
        "{",
        "  ty=g;",
        "  el=.CONDITION,rc,+0+0;",
        "  el=intervalDefault,tmwj,+0+0;",
        "  el=intervalExplicit,rtmwj,+160+0;",
        "  unit=.CONDITION,,jp1admin,;",
        "  {",
        "    ty=rc;",
        "  }",
        "  unit=intervalDefault,,jp1admin,;",
        "  {",
        "    ty=tmwj;",
        "  }",
        "  unit=intervalExplicit,,jp1admin,;",
        "  {",
        "    ty=rtmwj;",
        "    tmitv=1440;",
        "    etn=y;",
        "    ets=wr;",
        "  }",
        "}",
        "",
      ].join("\n"),
    );

    assert.deepStrictEqual(diagnostics, []);
  });

  test("reports execution-interval control diagnostics when etn=y is used outside start-condition context", () => {
    const diagnostics = buildSyntaxDiagnostics(
      [
        "unit=root,,jp1admin,;",
        "{",
        "  ty=g;",
        "  el=interval,tmwj,+0+0;",
        "  unit=interval,,jp1admin,;",
        "  {",
        "    ty=tmwj;",
        "    etn=y;",
        "  }",
        "}",
        "",
      ].join("\n"),
    );

    assert.deepStrictEqual(
      diagnostics.map((diagnostic) => ({
        line: diagnostic.line,
        column: diagnostic.column,
        length: diagnostic.length,
        message: diagnostic.message,
      })),
      [
        {
          line: 8,
          column: 4,
          length: 3,
          message:
            "End timing (etn=y) can be specified only for execution-interval control jobs defined as start conditions.",
        },
      ],
    );
    assert.deepStrictEqual(
      diagnostics.map((diagnostic) => diagnostic.severity),
      ["error"],
    );
  });

  test("reports execution-interval control diagnostics for explicit invalid tmitv and etn values", () => {
    const diagnostics = buildSyntaxDiagnostics(
      [
        "unit=root,,jp1admin,;",
        "{",
        "  ty=g;",
        "  el=interval1,tmwj,+0+0;",
        "  el=interval2,rtmwj,+160+0;",
        "  unit=interval1,,jp1admin,;",
        "  {",
        "    ty=tmwj;",
        "    tmitv=0;",
        "    etn=maybe;",
        "  }",
        "  unit=interval2,,jp1admin,;",
        "  {",
        "    ty=rtmwj;",
        "    tmitv=1441;",
        "    etn=Y;",
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
          line: 9,
          column: 4,
          length: 5,
          message: "Execution interval (tmitv) must be between 1 and 1440.",
        },
        {
          line: 10,
          column: 4,
          length: 3,
          message: "End timing (etn) must be y or n.",
        },
        {
          line: 15,
          column: 4,
          length: 5,
          message: "Execution interval (tmitv) must be between 1 and 1440.",
        },
        {
          line: 16,
          column: 4,
          length: 3,
          message: "End timing (etn) must be y or n.",
        },
      ],
    );
    assert.deepStrictEqual(
      diagnostics.map((diagnostic) => diagnostic.severity),
      ["error", "error", "error", "error"],
    );
  });

  test("does not report transfer-file diagnostics for valid explicit values and macro variables", () => {
    const diagnostics = buildSyntaxDiagnostics(
      [
        "unit=root,,jp1admin,;",
        "{",
        "  ty=g;",
        "  el=job1,j,+0+0;",
        "  el=custom,cj,+160+0;",
        "  el=queue1,qj,+320+0;",
        "  unit=job1,,jp1admin,;",
        "  {",
        "    ty=j;",
        "    ts1=?AJS2SRC1?;",
        '    td1="dest-1";',
        "    top1=sav;",
        "  }",
        "  unit=custom,,jp1admin,;",
        "  {",
        "    ty=cj;",
        '    ts1="/var/custom/source-1";',
        "    top1=sav;",
        "  }",
        "  unit=queue1,,jp1admin,;",
        "  {",
        "    ty=qj;",
        '    ts1="C:/queue/source";',
        "    td1=?AJS2QDST1?;",
        "  }",
        "}",
        "",
      ].join("\n"),
    );

    assert.deepStrictEqual(diagnostics, []);
  });

  test("reports transfer-file byte-length diagnostics for explicit out-of-range values", () => {
    const tooLongFileName = "a".repeat(512);
    const diagnostics = buildSyntaxDiagnostics(
      [
        "unit=root,,jp1admin,;",
        "{",
        "  ty=g;",
        "  el=job1,j,+0+0;",
        "  el=queue1,qj,+160+0;",
        "  unit=job1,,jp1admin,;",
        "  {",
        "    ty=j;",
        `    ts1=${tooLongFileName};`,
        "  }",
        "  unit=queue1,,jp1admin,;",
        "  {",
        "    ty=qj;",
        "    ts1=queue-source;",
        `    td1=${tooLongFileName};`,
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
          length: 3,
          message:
            "Transfer source file name (ts1) must be between 1 and 511 bytes.",
        },
        {
          line: 15,
          column: 4,
          length: 3,
          message:
            "Transfer destination file name (td1) must be between 1 and 511 bytes.",
        },
      ],
    );
    assert.deepStrictEqual(
      diagnostics.map((diagnostic) => diagnostic.severity),
      ["error", "error"],
    );
  });

  test("reports transfer-source path diagnostics for quoted relative paths", () => {
    const diagnostics = buildSyntaxDiagnostics(
      [
        "unit=root,,jp1admin,;",
        "{",
        "  ty=g;",
        "  el=job1,j,+0+0;",
        "  el=queue1,qj,+160+0;",
        "  unit=job1,,jp1admin,;",
        "  {",
        "    ty=j;",
        '    ts1="relative/source-1";',
        '    td1="dest-1";',
        "  }",
        "  unit=queue1,,jp1admin,;",
        "  {",
        "    ty=qj;",
        '    ts1="queue-source";',
        '    td1="queue-dest";',
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
          length: 3,
          message:
            "Transfer source file name (ts1) must use a full path when specified as a quoted transfer-file value.",
        },
        {
          line: 15,
          column: 4,
          length: 3,
          message:
            "Transfer source file name (ts1) must use a full path when specified as a quoted transfer-file value.",
        },
      ],
    );
    assert.deepStrictEqual(
      diagnostics.map((diagnostic) => diagnostic.severity),
      ["error", "error"],
    );
  });

  test("reports transfer-file value-shape diagnostics for explicit bare strings", () => {
    const diagnostics = buildSyntaxDiagnostics(
      [
        "unit=root,,jp1admin,;",
        "{",
        "  ty=g;",
        "  el=job1,j,+0+0;",
        "  el=queue1,qj,+160+0;",
        "  unit=job1,,jp1admin,;",
        "  {",
        "    ty=j;",
        "    ts1=source-1;",
        "    td1=dest-1;",
        "  }",
        "  unit=queue1,,jp1admin,;",
        "  {",
        "    ty=qj;",
        "    ts1=queue-source;",
        "  }",
        "}",
        "",
      ].join("\n"),
    );

    assert.strictEqual(diagnostics.length, 3);
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
          length: 3,
          message:
            "Transfer source file name (ts1) must be a quoted transfer-file value or macro-variable form.",
        },
        {
          line: 10,
          column: 4,
          length: 3,
          message:
            "Transfer destination file name (td1) must be a quoted transfer-file value or macro-variable form.",
        },
        {
          line: 15,
          column: 4,
          length: 3,
          message:
            "Transfer source file name (ts1) must be a quoted transfer-file value or macro-variable form.",
        },
      ],
    );
    assert.deepStrictEqual(
      diagnostics.map((diagnostic) => diagnostic.severity),
      ["error", "error", "error"],
    );
  });

  test("reports transfer-file invalid-combination diagnostics when source files are omitted", () => {
    const diagnostics = buildSyntaxDiagnostics(
      [
        "unit=root,,jp1admin,;",
        "{",
        "  ty=g;",
        "  el=job1,j,+0+0;",
        "  el=queue1,qj,+160+0;",
        "  unit=job1,,jp1admin,;",
        "  {",
        "    ty=j;",
        "    td1=dest-only;",
        "    top1=del;",
        "  }",
        "  unit=queue1,,jp1admin,;",
        "  {",
        "    ty=qj;",
        "    td1=queue-dest-only;",
        "  }",
        "}",
        "",
      ].join("\n"),
    );

    assert.strictEqual(diagnostics.length, 3);
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
          length: 3,
          message:
            "Transfer destination file name (td1) requires transfer source file name (ts1).",
        },
        {
          line: 10,
          column: 4,
          length: 4,
          message:
            "Transfer operation (top1) requires transfer source file name (ts1).",
        },
        {
          line: 15,
          column: 4,
          length: 3,
          message:
            "Transfer destination file name (td1) requires transfer source file name (ts1).",
        },
      ],
    );
    assert.deepStrictEqual(
      diagnostics.map((diagnostic) => diagnostic.severity),
      ["error", "error", "error"],
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

  test("does not report event-host diagnostics for valid explicit evhst values", () => {
    const sendingHost = "a".repeat(255);
    const diagnostics = buildSyntaxDiagnostics(
      [
        "unit=root,,jp1admin,;",
        "{",
        "  ty=g;",
        "  el=event1,evsj,+0+0;",
        "  el=wait1,evwj,+160+0;",
        "  unit=event1,,jp1admin,;",
        "  {",
        "    ty=evsj;",
        `    evhst=${sendingHost};`,
        "    evsrt=y;",
        "  }",
        "  unit=wait1,,jp1admin,;",
        "  {",
        "    ty=evwj;",
        "    evhst=*;",
        "  }",
        "}",
        "",
      ].join("\n"),
    );

    assert.deepStrictEqual(diagnostics, []);
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

  test("reports event-host diagnostics for explicit out-of-range evhst values", () => {
    const oversizedHost = "a".repeat(256);
    const diagnostics = buildSyntaxDiagnostics(
      [
        "unit=root,,jp1admin,;",
        "{",
        "  ty=g;",
        "  el=event1,evsj,+0+0;",
        "  el=event2,revsj,+160+0;",
        "  el=wait1,evwj,+320+0;",
        "  el=wait2,revwj,+480+0;",
        "  unit=event1,,jp1admin,;",
        "  {",
        "    ty=evsj;",
        `    evhst=${oversizedHost};`,
        "    evsrt=y;",
        "  }",
        "  unit=event2,,jp1admin,;",
        "  {",
        "    ty=revsj;",
        `    evhst=${oversizedHost};`,
        "    evsrt=y;",
        "  }",
        "  unit=wait1,,jp1admin,;",
        "  {",
        "    ty=evwj;",
        `    evhst=${oversizedHost};`,
        "  }",
        "  unit=wait2,,jp1admin,;",
        "  {",
        "    ty=revwj;",
        `    evhst=${oversizedHost};`,
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
          line: 9,
          column: 4,
          length: 5,
          message: "Event host (evhst) must be between 1 and 255 bytes.",
        },
        {
          line: 15,
          column: 4,
          length: 5,
          message: "Event host (evhst) must be between 1 and 255 bytes.",
        },
        {
          line: 21,
          column: 4,
          length: 5,
          message: "Event host (evhst) must be between 1 and 255 bytes.",
        },
        {
          line: 26,
          column: 4,
          length: 5,
          message: "Event host (evhst) must be between 1 and 255 bytes.",
        },
      ],
    );
    assert.deepStrictEqual(
      diagnostics.map((diagnostic) => diagnostic.severity),
      ["error", "error", "error", "error"],
    );
  });
});
