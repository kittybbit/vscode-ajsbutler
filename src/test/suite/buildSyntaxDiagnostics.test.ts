import * as assert from "assert";
import { createBuildSyntaxDiagnostics } from "../../application/editor-feedback/buildSyntaxDiagnostics";
import { buildDiagnostic } from "../../application/editor-feedback/syntaxDiagnosticCore";
import { syntaxDiagnosticCategories } from "../../application/editor-feedback/syntaxDiagnosticTypes";
import type { AjsParserPort } from "../../application/parsing/AjsParserPort";
import { testAjsParser } from "../support/parseAjs";
import {
  assertSyntaxDiagnostics,
  buildRootUnitDefinition,
  expectedSyntaxDiagnostic,
} from "../support/syntaxDiagnostics";

const buildSyntaxDiagnostics = createBuildSyntaxDiagnostics(testAjsParser);

type ExpectedDiagnosticLocation = Parameters<
  typeof expectedSyntaxDiagnostic
>[0];

const expectedAutomaticRetryEndJudgmentDiagnostic = (
  location: ExpectedDiagnosticLocation,
) =>
  expectedSyntaxDiagnostic(
    location,
    "Automatic retry (abr=y) requires end judgment (jd) to be cod.",
  );

const expectedExecutionTimeRangeDiagnostic = (
  location: ExpectedDiagnosticLocation,
) =>
  expectedSyntaxDiagnostic(
    location,
    "Execution time (fd) must be between 1 and 1440.",
  );

const expectedStartConditionExecutionTimeDiagnostic = (
  location: ExpectedDiagnosticLocation,
) =>
  expectedSyntaxDiagnostic(
    location,
    "Execution time (fd) cannot be specified for jobs defined as start conditions.",
  );

const expectedTransferSourceFullPathDiagnostic = (
  location: ExpectedDiagnosticLocation,
) =>
  expectedSyntaxDiagnostic(
    location,
    "Transfer source file name (ts1) must use a full path when specified as a quoted transfer-file value.",
  );

const buildStartConditionDefinition = (
  units: Parameters<typeof buildRootUnitDefinition>[0],
): string =>
  buildRootUnitDefinition([{ name: "start-condition", type: "rc" }, ...units]);

const buildTransferFileDefinition = (
  jobParameters: readonly string[],
  queueParameters: readonly string[],
): string =>
  buildRootUnitDefinition([
    { name: "job1", type: "j", parameters: jobParameters },
    { name: "queue1", type: "qj", parameters: queueParameters },
  ]);

suite("Build Syntax Diagnostics", () => {
  test("preserves diagnostic position fallback for normalized parameters", () => {
    assert.deepStrictEqual(
      buildDiagnostic({ key: "evsid", value: "zz" }, "invalid"),
      {
        line: 1,
        column: 0,
        length: 5,
        message: "invalid",
        severity: "error",
      },
    );
  });

  test("maps repository-owned errors from an injected parser port", () => {
    const parser: AjsParserPort = {
      parse: () => ({
        rootUnits: [],
        errors: [{ line: 4, column: 2, message: "invalid syntax" }],
      }),
    };

    const diagnostics = createBuildSyntaxDiagnostics(parser)("ignored");

    assert.deepStrictEqual(diagnostics, [
      {
        line: 4,
        column: 2,
        length: 1,
        message: "invalid syntax",
        severity: "error",
        category: syntaxDiagnosticCategories.parserSyntax,
      },
    ]);
  });

  test("characterizes mixed diagnostic summaries across parser and domain rules", () => {
    const diagnostics = buildSyntaxDiagnostics(
      [
        "unit=root,,jp1admin,;",
        "{",
        "  ty=g;",
        "  st=145,+48:00;",
        "  el=jobnet,n,+0+0;",
        "  el=event,evsj,+240+0;",
        "  el=wait,evwj,+480+0;",
        "  unit=jobnet,,jp1admin,;",
        "  {",
        "    ty=n;",
        "    ln=0,145;",
        "  }",
        "  unit=event,,jp1admin,;",
        "  {",
        "    ty=evsj;",
        "    evsrt=y;",
        "    evsid=zz;",
        "  }",
        "  unit=wait,,jp1admin,;",
        "  {",
        "    ty=evwj;",
        "    evuid=2147483648;",
        "    evwms=bare;",
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
        severity: diagnostic.severity,
        message: diagnostic.message,
      })),
      [
        {
          line: 4,
          column: 2,
          length: 2,
          severity: "error",
          message:
            "Start time (st) must use schedule rule numbers 1..144 and times between 00:00 and 47:59.",
        },
        {
          line: 11,
          column: 4,
          length: 2,
          severity: "error",
          message:
            "Parent schedule rule (ln) must use schedule rule numbers between 1 and 144.",
        },
        {
          line: 17,
          column: 4,
          length: 5,
          severity: "error",
          message:
            "Event ID (evsid) must be hexadecimal within 00000000-00001FFF or 7FFF8000-7FFFFFFF.",
        },
        {
          line: 16,
          column: 4,
          length: 5,
          severity: "error",
          message:
            "Event arrival check (evsrt=y) requires an event destination host (evhst).",
        },
        {
          line: 23,
          column: 4,
          length: 5,
          severity: "error",
          message:
            "Event message filter (evwms) must be a quoted string between 1 and 1024 bytes.",
        },
      ],
    );
    assert.deepStrictEqual(
      diagnostics.map((diagnostic) => diagnostic.category),
      [
        syntaxDiagnosticCategories.scheduleRule,
        syntaxDiagnosticCategories.scheduleRule,
        syntaxDiagnosticCategories.eventSending,
        syntaxDiagnosticCategories.eventSending,
        syntaxDiagnosticCategories.eventReceiving,
      ],
    );
  });

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

  test("does not infer semantic diagnostic target types during normalization", () => {
    const diagnostics = buildSyntaxDiagnostics(
      "unit=root,,jp1admin,;\n{\n  st=145,+48:00;\n}\n",
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
        "  cy=142,(9,y);",
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
        "  cy=1,(10,y);",
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

    assertSyntaxDiagnostics(diagnostics, [
      expectedSyntaxDiagnostic(
        [5, 2, 2],
        "Start time (st) must use schedule rule numbers 1..144 and times between 00:00 and 47:59.",
      ),
      expectedSyntaxDiagnostic(
        [6, 2, 2],
        "Cycle value (cy) must use schedule rule numbers 1..144 and cycle ranges y=1..9, m=1..12, w=1..5, or d=1..31.",
      ),
      expectedSyntaxDiagnostic(
        [7, 2, 3],
        "Maximum shift days (shd) must use schedule rule numbers 1..144 and values between 1 and 31.",
      ),
      expectedSyntaxDiagnostic(
        [8, 2, 4],
        "Days-from-start rule (cftd) must use schedule rule numbers 1..144 with valid no/be/af/db/da ranges.",
      ),
      expectedSyntaxDiagnostic(
        [9, 2, 2],
        "Start delay time (sy) must use schedule rule numbers 1..144 and either 00:00-47:59 or M/C/U minutes between 1 and 2879.",
      ),
      expectedSyntaxDiagnostic(
        [10, 2, 2],
        "End delay time (ey) must use schedule rule numbers 1..144 and either 00:00-47:59 or M/C/U minutes between 1 and 2879.",
      ),
      expectedSyntaxDiagnostic(
        [11, 2, 2],
        "Start-condition count (wc) must use schedule rule numbers 1..144 and values no, un, or 1..999.",
      ),
      expectedSyntaxDiagnostic(
        [12, 2, 2],
        "Monitoring end time (wt) must use schedule rule numbers 1..144 and values no, un, 00:00-47:59, or 1..2879 minutes.",
      ),
      expectedSyntaxDiagnostic(
        [17, 4, 2],
        "Parent schedule rule (ln) must use schedule rule numbers between 1 and 144.",
      ),
    ]);
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

    assertSyntaxDiagnostics(diagnostics, [
      expectedSyntaxDiagnostic(
        [4, 2, 2],
        "Execution-start date (sd) must use schedule rule numbers 1..144, except sd=0,ud, and its explicit year/day values must stay within the JP1/AJS3 v13 schedule and SCHEDULELIMIT ranges.",
      ),
      expectedSyntaxDiagnostic(
        [5, 2, 2],
        "Execution-start date (sd) must use schedule rule numbers 1..144, except sd=0,ud, and its explicit year/day values must stay within the JP1/AJS3 v13 schedule and SCHEDULELIMIT ranges.",
      ),
      expectedSyntaxDiagnostic(
        [6, 2, 2],
        "Execution-start date (sd) must use schedule rule numbers 1..144, except sd=0,ud, and its explicit year/day values must stay within the JP1/AJS3 v13 schedule and SCHEDULELIMIT ranges.",
      ),
      expectedSyntaxDiagnostic(
        [7, 2, 2],
        "Execution-start date (sd) must use schedule rule numbers 1..144, except sd=0,ud, and its explicit year/day values must stay within the JP1/AJS3 v13 schedule and SCHEDULELIMIT ranges.",
      ),
      expectedSyntaxDiagnostic(
        [8, 2, 2],
        "Execution-start date (sd) must use schedule rule numbers 1..144, except sd=0,ud, and its explicit year/day values must stay within the JP1/AJS3 v13 schedule and SCHEDULELIMIT ranges.",
      ),
      expectedSyntaxDiagnostic(
        [9, 2, 2],
        "Execution-start date (sd) must use schedule rule numbers 1..144, except sd=0,ud, and its explicit year/day values must stay within the JP1/AJS3 v13 schedule and SCHEDULELIMIT ranges.",
      ),
      expectedSyntaxDiagnostic(
        [10, 2, 2],
        "Execution-start date (sd) must use schedule rule numbers 1..144, except sd=0,ud, and its explicit year/day values must stay within the JP1/AJS3 v13 schedule and SCHEDULELIMIT ranges.",
      ),
      expectedSyntaxDiagnostic(
        [11, 2, 2],
        "Execution-start date (sd) must use schedule rule numbers 1..144, except sd=0,ud, and its explicit year/day values must stay within the JP1/AJS3 v13 schedule and SCHEDULELIMIT ranges.",
      ),
      expectedSyntaxDiagnostic(
        [12, 2, 2],
        "Execution-start date (sd) must use schedule rule numbers 1..144, except sd=0,ud, and its explicit year/day values must stay within the JP1/AJS3 v13 schedule and SCHEDULELIMIT ranges.",
      ),
      expectedSyntaxDiagnostic(
        [13, 2, 2],
        "Execution-start date (sd) must use schedule rule numbers 1..144, except sd=0,ud, and its explicit year/day values must stay within the JP1/AJS3 v13 schedule and SCHEDULELIMIT ranges.",
      ),
    ]);
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

    assertSyntaxDiagnostics(diagnostics, [
      expectedSyntaxDiagnostic(
        [5, 2, 2],
        "Weekly cycle (cy=(n,w)) cannot be specified when execution-start date (sd) uses open-day (*) or closed-day (@) scheduling for the same rule.",
      ),
      expectedSyntaxDiagnostic(
        [7, 2, 2],
        "Weekly cycle (cy=(n,w)) cannot be specified when execution-start date (sd) uses open-day (*) or closed-day (@) scheduling for the same rule.",
      ),
    ]);
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
      buildRootUnitDefinition([
        {
          name: "job1",
          type: "j",
          parameters: [
            "wth=2147483648;",
            "tho=-1;",
            "rjs=0;",
            "rje=4294967296;",
          ],
        },
        {
          name: "custom",
          type: "cj",
          parameters: ["abr=y;", "rec=13;", "rei=0;"],
        },
      ]),
    );

    assertSyntaxDiagnostics(diagnostics, [
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
    ]);
  });

  test("reports end-judgment diagnostics for explicit invalid retry combinations", () => {
    const diagnostics = buildSyntaxDiagnostics(
      buildRootUnitDefinition([
        { name: "job1", type: "j", parameters: ["jd=ab;", "abr=y;"] },
        { name: "custom", type: "cj", parameters: ["jd=nm;", "abr=y;"] },
      ]),
    );

    assertSyntaxDiagnostics(diagnostics, [
      expectedAutomaticRetryEndJudgmentDiagnostic([10, 4, 3]),
      expectedAutomaticRetryEndJudgmentDiagnostic([16, 4, 3]),
    ]);
  });

  test("reports retry parameter diagnostics for explicit invalid end-judgment combinations", () => {
    const diagnostics = buildSyntaxDiagnostics(
      buildRootUnitDefinition([
        { name: "job1", type: "j", parameters: ["jd=ab;", "rjs=1;", "rje=9;"] },
        {
          name: "custom",
          type: "cj",
          parameters: ["jd=nm;", "rec=3;", "rei=1;"],
        },
      ]),
    );

    assertSyntaxDiagnostics(diagnostics, [
      {
        line: 10,
        column: 4,
        length: 3,
        message: "Retry parameter (rjs) requires end judgment (jd) to be cod.",
      },
      {
        line: 11,
        column: 4,
        length: 3,
        message: "Retry parameter (rje) requires end judgment (jd) to be cod.",
      },
      {
        line: 17,
        column: 4,
        length: 3,
        message: "Retry parameter (rec) requires end judgment (jd) to be cod.",
      },
      {
        line: 18,
        column: 4,
        length: 3,
        message: "Retry parameter (rei) requires end judgment (jd) to be cod.",
      },
    ]);
  });

  test("reports retry parameter diagnostics when automatic retry is not enabled", () => {
    const diagnostics = buildSyntaxDiagnostics(
      buildRootUnitDefinition([
        {
          name: "job1",
          type: "j",
          parameters: ["jd=cod;", "rjs=1;", "rje=9;"],
        },
        {
          name: "custom",
          type: "cj",
          parameters: ["jd=cod;", "abr=n;", "rec=3;", "rei=1;"],
        },
      ]),
    );

    assertSyntaxDiagnostics(diagnostics, [
      expectedSyntaxDiagnostic(
        [10, 4, 3],
        "Retry parameter (rjs) requires automatic retry (abr) to be y.",
      ),
      expectedSyntaxDiagnostic(
        [11, 4, 3],
        "Retry parameter (rje) requires automatic retry (abr) to be y.",
      ),
      expectedSyntaxDiagnostic(
        [18, 4, 3],
        "Retry parameter (rec) requires automatic retry (abr) to be y.",
      ),
      expectedSyntaxDiagnostic(
        [19, 4, 3],
        "Retry parameter (rei) requires automatic retry (abr) to be y.",
      ),
    ]);
  });

  test("reports end-judgment and retry diagnostics for normal and recovery QUEUE jobs", () => {
    for (const type of ["qj", "rq"]) {
      const dependencyDiagnostics = buildSyntaxDiagnostics(
        buildRootUnitDefinition([
          {
            name: "queue1",
            type,
            parameters: [
              "jd=ab;",
              "abr=y;",
              "rjs=0;",
              "rje=4294967296;",
              "rec=13;",
              "rei=0;",
            ],
          },
        ]),
      );
      const dependencyMessages = dependencyDiagnostics.map(
        (diagnostic) => diagnostic.message,
      );

      assert.deepStrictEqual(dependencyMessages, [
        "Retry start code (rjs) must be between 1 and 4294967295.",
        "Retry end code (rje) must be between 1 and 4294967295.",
        "Retry count (rec) must be between 1 and 12.",
        "Retry interval (rei) must be between 1 and 10.",
        "Automatic retry (abr=y) requires end judgment (jd) to be cod.",
        "Retry parameter (rjs) requires end judgment (jd) to be cod.",
        "Retry parameter (rje) requires end judgment (jd) to be cod.",
        "Retry parameter (rec) requires end judgment (jd) to be cod.",
        "Retry parameter (rei) requires end judgment (jd) to be cod.",
      ]);

      const thresholdDiagnostics = buildSyntaxDiagnostics(
        buildRootUnitDefinition([
          {
            name: "queue1",
            type,
            parameters: ["jd=cod;", "abr=y;", "wth=20;", "tho=10;"],
          },
        ]),
      );

      assert.deepStrictEqual(
        thresholdDiagnostics.map((diagnostic) => diagnostic.message),
        [
          "Warning threshold (wth) must be less than abnormal threshold (tho).",
          "Abnormal threshold (tho) must be greater than warning threshold (wth).",
        ],
      );
    }
  });

  test("does not report threshold-ordering diagnostics for omitted or ordered explicit end-judgment thresholds", () => {
    const diagnostics = buildSyntaxDiagnostics(
      buildRootUnitDefinition([
        { name: "job1", type: "j", parameters: ["jd=cod;"] },
        {
          name: "job2",
          type: "cj",
          parameters: ["jd=cod;", "wth=10;", "tho=20;"],
        },
        {
          name: "job3",
          type: "j",
          parameters: ["jd=ab;", "wth=30;", "tho=10;"],
        },
      ]),
    );

    assert.deepStrictEqual(diagnostics, []);
  });

  test("reports threshold-ordering diagnostics for explicit invalid end-judgment thresholds", () => {
    const diagnostics = buildSyntaxDiagnostics(
      buildRootUnitDefinition([
        {
          name: "job1",
          type: "j",
          parameters: ["jd=cod;", "wth=20;", "tho=10;"],
        },
        {
          name: "job2",
          type: "cj",
          parameters: ["jd=cod;", "wth=15;", "tho=15;"],
        },
      ]),
    );

    assertSyntaxDiagnostics(diagnostics, [
      expectedSyntaxDiagnostic(
        [10, 4, 3],
        "Warning threshold (wth) must be less than abnormal threshold (tho).",
      ),
      expectedSyntaxDiagnostic(
        [11, 4, 3],
        "Abnormal threshold (tho) must be greater than warning threshold (wth).",
      ),
      expectedSyntaxDiagnostic(
        [17, 4, 3],
        "Warning threshold (wth) must be less than abnormal threshold (tho).",
      ),
      expectedSyntaxDiagnostic(
        [18, 4, 3],
        "Abnormal threshold (tho) must be greater than warning threshold (wth).",
      ),
    ]);
  });

  test("does not report file monitoring diagnostics for omitted defaults and valid explicit combinations", () => {
    const diagnostics = buildSyntaxDiagnostics(
      buildRootUnitDefinition([
        { name: "file1", type: "flwj", parameters: ["flco=y;"] },
        {
          name: "file2",
          type: "rflwj",
          parameters: ["flwc=c;", "flco=n;"],
        },
        { name: "file3", type: "flwj", parameters: ["flwc=c:d;"] },
        { name: "file4", type: "flwj", parameters: ["flwc=c:d:s;"] },
        { name: "file5", type: "rflwj", parameters: ["flwc=c:d:m;"] },
      ]),
    );

    assert.deepStrictEqual(diagnostics, []);
  });

  test("reports file monitoring diagnostics for malformed condition forms", () => {
    const invalidConditions = ["d", "d:c", "c::s", "c:d:s:x", "c:d:s:m"];

    for (const condition of invalidConditions) {
      const diagnostics = buildSyntaxDiagnostics(
        buildRootUnitDefinition([
          {
            name: "file1",
            type: "flwj",
            parameters: [`flwc=${condition};`],
          },
        ]),
      );

      assert.deepStrictEqual(
        diagnostics.map((diagnostic) => diagnostic.message),
        ["File monitoring condition (flwc) must use c, c:d, c:d:s, or c:d:m."],
      );
    }
  });

  test("does not report file monitoring target-pattern diagnostics for valid explicit values", () => {
    const diagnostics = buildSyntaxDiagnostics(
      buildRootUnitDefinition([
        {
          name: "file1",
          type: "flwj",
          parameters: ['flwf="watch.txt";', "flwi=60;"],
        },
        {
          name: "file2",
          type: "rflwj",
          parameters: ['flwf="logs/*.txt";', "flwi=10;"],
        },
      ]),
    );

    assert.deepStrictEqual(diagnostics, []);
  });

  test("measures quoted file monitoring names by content bytes", () => {
    const exactAsciiContent = "a".repeat(255);
    const overAsciiContent = "a".repeat(256);
    const exactMultibyteContent = "あ".repeat(85);
    const overMultibyteContent = "あ".repeat(86);
    const diagnostics = buildSyntaxDiagnostics(
      buildRootUnitDefinition([
        {
          name: "file1",
          type: "flwj",
          parameters: [`flwf="${exactAsciiContent}";`],
        },
        {
          name: "file2",
          type: "flwj",
          parameters: [`flwf="${overAsciiContent}";`],
        },
        {
          name: "file3",
          type: "flwj",
          parameters: [`flwf="${exactMultibyteContent}";`],
        },
        {
          name: "file4",
          type: "flwj",
          parameters: [`flwf="${overMultibyteContent}";`],
        },
      ]),
    );

    assert.deepStrictEqual(
      diagnostics.map((diagnostic) => diagnostic.message),
      [
        "Monitored file name (flwf) must be between 1 and 255 bytes.",
        "Monitored file name (flwf) must be between 1 and 255 bytes.",
      ],
    );
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

    assertSyntaxDiagnostics(diagnostics, [
      {
        line: 10,
        column: 4,
        length: 4,
        message: "Monitored file name (flwf) must be between 1 and 255 bytes.",
      },
      {
        line: 15,
        column: 4,
        length: 4,
        message: "Monitoring interval (flwi) must be between 1 and 600.",
      },
      expectedSyntaxDiagnostic(
        [20, 4, 4],
        "Monitored file name (flwf) cannot use wildcard (*) when monitoring interval (flwi) is between 1 and 9.",
      ),
    ]);
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

    assertSyntaxDiagnostics(diagnostics, [
      expectedSyntaxDiagnostic(
        [9, 4, 4],
        "File monitoring condition (flwc) must use c, c:d, c:d:s, or c:d:m.",
      ),
      expectedSyntaxDiagnostic(
        [15, 4, 4],
        "File monitoring condition (flwc) must use c, c:d, c:d:s, or c:d:m.",
      ),
      expectedSyntaxDiagnostic(
        [15, 4, 4],
        "File close option (flco) requires file creation monitoring (flwc=c).",
      ),
    ]);
  });

  test("reports file monitoring fd diagnostics for explicit out-of-range values and start-condition usage", () => {
    const diagnostics = buildSyntaxDiagnostics(
      buildStartConditionDefinition([
        { name: "file1", type: "flwj", parameters: ["fd=0;"] },
        { name: "file2", type: "rflwj", parameters: ["fd=10;"] },
      ]),
    );

    assertSyntaxDiagnostics(diagnostics, [
      expectedExecutionTimeRangeDiagnostic([14, 4, 4]),
      expectedStartConditionExecutionTimeDiagnostic([14, 4, 4]),
      expectedStartConditionExecutionTimeDiagnostic([19, 4, 5]),
    ]);
  });

  test("does not report event timeout action diagnostics for omitted defaults and valid explicit values", () => {
    const diagnostics = buildSyntaxDiagnostics(
      buildRootUnitDefinition([
        { name: "file1", type: "flwj" },
        { name: "file2", type: "rflwj", parameters: ["ets=wr;"] },
        { name: "interval1", type: "tmwj" },
        { name: "interval2", type: "rtmwj", parameters: ["ets=an;"] },
      ]),
    );

    assert.deepStrictEqual(diagnostics, []);
  });

  test("reports event timeout action diagnostics for explicit invalid values", () => {
    const diagnostics = buildSyntaxDiagnostics(
      buildRootUnitDefinition([
        { name: "file1", type: "flwj", parameters: ["ets=xx;"] },
        { name: "interval1", type: "tmwj", parameters: ["ets=yy;"] },
      ]),
    );

    assertSyntaxDiagnostics(diagnostics, [
      {
        line: 9,
        column: 4,
        length: 3,
        message: "Event timeout action (ets) must be one of kl, nr, wr, or an.",
      },
      {
        line: 14,
        column: 4,
        length: 3,
        message: "Event timeout action (ets) must be one of kl, nr, wr, or an.",
      },
    ]);
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

    assertSyntaxDiagnostics(diagnostics, [
      expectedSyntaxDiagnostic(
        [8, 4, 3],
        "End timing (etn=y) can be specified only for execution-interval control jobs defined as start conditions.",
      ),
    ]);
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

    assertSyntaxDiagnostics(diagnostics, [
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
    ]);
  });

  test("reports execution-interval control fd diagnostics for explicit out-of-range values and start-condition usage", () => {
    const diagnostics = buildSyntaxDiagnostics(
      buildStartConditionDefinition([
        { name: "interval1", type: "tmwj", parameters: ["fd=1441;"] },
        { name: "interval2", type: "rtmwj", parameters: ["fd=10;"] },
      ]),
    );

    assertSyntaxDiagnostics(diagnostics, [
      expectedExecutionTimeRangeDiagnostic([14, 4, 7]),
      expectedStartConditionExecutionTimeDiagnostic([14, 4, 7]),
      expectedStartConditionExecutionTimeDiagnostic([19, 4, 5]),
    ]);
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

  test("accepts transfer-file macros only in supported unit and queuing contexts", () => {
    const diagnostics = buildSyntaxDiagnostics(
      buildRootUnitDefinition([
        { name: "job", type: "j", parameters: ["ts1=?SRC?;"] },
        {
          name: "recovery-job",
          type: "rj",
          parameters: ["jty=q;", "ts1=?SRC?;"],
        },
        { name: "pc-job", type: "pj", parameters: ["ts1=?SRC?;"] },
        {
          name: "recovery-pc-job",
          type: "rp",
          parameters: ["jty=q;", "ts1=?SRC?;"],
        },
        { name: "custom", type: "cj", parameters: ["ts1=?SRC?;"] },
        { name: "recovery-custom", type: "rcj", parameters: ["ts1=?SRC?;"] },
        { name: "queue", type: "qj", parameters: ["ts1=?SRC?;"] },
        { name: "recovery-queue", type: "rq", parameters: ["ts1=?SRC?;"] },
      ]),
    );

    assert.deepStrictEqual(diagnostics, []);

    for (const type of ["j", "rj", "pj", "rp"]) {
      const nonQueuingDiagnostics = buildSyntaxDiagnostics(
        buildRootUnitDefinition([
          {
            name: "job",
            type,
            parameters: ["jty=n;", "ts1=?SRC?;", "td1=?DST?;"],
          },
        ]),
      );

      assert.deepStrictEqual(
        nonQueuingDiagnostics.map((diagnostic) => diagnostic.message),
        [
          "Transfer source file name (ts1) must be quoted, or use a macro-variable form allowed by the unit class and effective jty=q.",
          "Transfer destination file name (td1) must be quoted, or use a macro-variable form allowed by the unit class and effective jty=q.",
        ],
      );
    }
  });

  test("reports every transfer-file parameter index on custom PC jobs", () => {
    const parameters = [1, 2, 3, 4].flatMap((index) => [
      `ts${index}="C:/source-${index}";`,
      `td${index}="destination-${index}";`,
      `top${index}=sav;`,
    ]);
    const expectedMessages = [1, 2, 3, 4].flatMap((index) =>
      ["ts", "td", "top"].map(
        (prefix) =>
          `Transfer-file parameter (${prefix}${index}) cannot be specified for custom PC jobs.`,
      ),
    );

    for (const type of ["cpj", "rcpj"]) {
      const diagnostics = buildSyntaxDiagnostics(
        buildRootUnitDefinition([{ name: "custom-pc", type, parameters }]),
      );

      assert.deepStrictEqual(
        diagnostics.map((diagnostic) => diagnostic.message),
        expectedMessages,
      );
    }
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

    assertSyntaxDiagnostics(diagnostics, [
      expectedSyntaxDiagnostic(
        [9, 4, 3],
        "Transfer source file name (ts1) must be between 1 and 511 bytes.",
      ),
      expectedSyntaxDiagnostic(
        [15, 4, 3],
        "Transfer destination file name (td1) must be between 1 and 511 bytes.",
      ),
    ]);
  });

  test("measures quoted transfer file names by content bytes", () => {
    const exactSourceContent = `/${"a".repeat(510)}`;
    const overSourceContent = `/${"a".repeat(511)}`;
    const exactDestinationContent = "a".repeat(511);
    const overMultibyteDestinationContent = "あ".repeat(171);
    const diagnostics = buildSyntaxDiagnostics(
      buildRootUnitDefinition([
        {
          name: "job1",
          type: "j",
          parameters: [
            `ts1="${exactSourceContent}";`,
            `td1="${exactDestinationContent}";`,
          ],
        },
        {
          name: "job2",
          type: "j",
          parameters: [
            `ts1="${overSourceContent}";`,
            `td1="${overMultibyteDestinationContent}";`,
          ],
        },
      ]),
    );

    assert.deepStrictEqual(
      diagnostics.map((diagnostic) => diagnostic.message),
      [
        "Transfer source file name (ts1) must be between 1 and 511 bytes.",
        "Transfer destination file name (td1) must be between 1 and 511 bytes.",
      ],
    );
  });

  test("reports transfer-source path diagnostics for quoted relative paths", () => {
    const diagnostics = buildSyntaxDiagnostics(
      buildTransferFileDefinition(
        ['ts1="relative/source-1";', 'td1="dest-1";'],
        ['ts1="queue-source";', 'td1="queue-dest";'],
      ),
    );

    assertSyntaxDiagnostics(diagnostics, [
      expectedTransferSourceFullPathDiagnostic([9, 4, 3]),
      expectedTransferSourceFullPathDiagnostic([15, 4, 3]),
    ]);
  });

  test("reports transfer-file value-shape diagnostics for explicit bare strings", () => {
    const diagnostics = buildSyntaxDiagnostics(
      buildTransferFileDefinition(
        ["ts1=source-1;", "td1=dest-1;"],
        ["ts1=queue-source;"],
      ),
    );

    assertSyntaxDiagnostics(diagnostics, [
      expectedSyntaxDiagnostic(
        [9, 4, 3],
        "Transfer source file name (ts1) must be quoted, or use a macro-variable form allowed by the unit class and effective jty=q.",
      ),
      expectedSyntaxDiagnostic(
        [10, 4, 3],
        "Transfer destination file name (td1) must be quoted, or use a macro-variable form allowed by the unit class and effective jty=q.",
      ),
      expectedSyntaxDiagnostic(
        [15, 4, 3],
        "Transfer source file name (ts1) must be quoted, or use a macro-variable form allowed by the unit class and effective jty=q.",
      ),
    ]);
  });

  test("reports transfer-file invalid-combination diagnostics when source files are omitted", () => {
    const diagnostics = buildSyntaxDiagnostics(
      buildTransferFileDefinition(
        ["td1=dest-only;", "top1=del;"],
        ["td1=queue-dest-only;", "top1=del;"],
      ),
    );

    assertSyntaxDiagnostics(diagnostics, [
      expectedSyntaxDiagnostic(
        [9, 4, 3],
        "Transfer destination file name (td1) requires transfer source file name (ts1).",
      ),
      expectedSyntaxDiagnostic(
        [10, 4, 4],
        "Transfer operation (top1) requires transfer source file name (ts1).",
      ),
      expectedSyntaxDiagnostic(
        [15, 4, 3],
        "Transfer destination file name (td1) requires transfer source file name (ts1).",
      ),
    ]);
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
      buildRootUnitDefinition([
        { name: "event1", type: "evsj", parameters: ["evsid=1fff;"] },
        { name: "event2", type: "revsj", parameters: ["evsid=7fff8000;"] },
        { name: "event3", type: "evsj" },
      ]),
    );

    assert.deepStrictEqual(diagnostics, []);
  });

  test("reports event sending evsid diagnostics for explicit invalid values", () => {
    const diagnostics = buildSyntaxDiagnostics(
      buildRootUnitDefinition([
        { name: "event1", type: "evsj", parameters: ["evsid=ACT-1;"] },
        { name: "event2", type: "revsj", parameters: ["evsid=00002000;"] },
      ]),
    );

    assertSyntaxDiagnostics(diagnostics, [
      expectedSyntaxDiagnostic(
        [9, 4, 5],
        "Event ID (evsid) must be hexadecimal within 00000000-00001FFF or 7FFF8000-7FFFFFFF.",
      ),
      expectedSyntaxDiagnostic(
        [14, 4, 5],
        "Event ID (evsid) must be hexadecimal within 00000000-00001FFF or 7FFF8000-7FFFFFFF.",
      ),
    ]);
  });

  test("does not report event sending range diagnostics for omitted defaults and valid explicit ranges", () => {
    const diagnostics = buildSyntaxDiagnostics(
      buildRootUnitDefinition([
        { name: "event1", type: "evsj" },
        {
          name: "event2",
          type: "revsj",
          parameters: ["evspl=600;", "evsrc=999;"],
        },
      ]),
    );

    assert.deepStrictEqual(diagnostics, []);
  });

  test("reports event sending range diagnostics for explicit out-of-range values", () => {
    const diagnostics = buildSyntaxDiagnostics(
      buildRootUnitDefinition([
        { name: "event1", type: "evsj", parameters: ["evspl=2;"] },
        { name: "event2", type: "revsj", parameters: ["evsrc=1000;"] },
      ]),
    );

    assertSyntaxDiagnostics(diagnostics, [
      expectedSyntaxDiagnostic(
        [9, 4, 5],
        "Event arrival check interval (evspl) must be between 3 and 600.",
      ),
      {
        line: 14,
        column: 4,
        length: 5,
        message: "Event arrival check count (evsrc) must be between 0 and 999.",
      },
    ]);
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

    assertSyntaxDiagnostics(diagnostics, [
      expectedSyntaxDiagnostic(
        [9, 4, 5],
        "Event arrival check (evsrt=y) requires an event destination host (evhst).",
      ),
      expectedSyntaxDiagnostic(
        [14, 4, 5],
        "Event arrival check (evsrt=y) requires an event destination host (evhst).",
      ),
    ]);
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

    assertSyntaxDiagnostics(diagnostics, [
      expectedSyntaxDiagnostic(
        [9, 4, 5],
        "Event search condition (evesc) must be no or between 1 and 720.",
      ),
      expectedSyntaxDiagnostic(
        [14, 4, 5],
        "Event search condition (evesc) must be no or between 1 and 720.",
      ),
      expectedSyntaxDiagnostic(
        [19, 4, 5],
        "Event search condition (evesc) must be no or between 1 and 720.",
      ),
      expectedSyntaxDiagnostic(
        [24, 4, 5],
        "Event ID (evwid) must be hexadecimal in 00000000:00000000-FFFFFFFF:FFFFFFFF format.",
      ),
      expectedSyntaxDiagnostic(
        [29, 4, 5],
        "Event source IP address (evipa) must be a dotted-decimal IPv4 address between 0.0.0.0 and 255.255.255.255.",
      ),
    ]);
  });

  test("does not report event receiving string-filter diagnostics for omitted and valid explicit values", () => {
    const diagnostics = buildSyntaxDiagnostics(
      [
        "unit=root,,jp1admin,;",
        "{",
        "  ty=g;",
        "  el=wait1,evwj,+0+0;",
        "  el=wait2,revwj,+160+0;",
        "  unit=wait1,,jp1admin,;",
        "  {",
        "    ty=evwj;",
        '    evusr="ops.*";',
        '    evgrp="admins";',
        '    evwms="match message";',
        '    evdet="detail text";',
        '    evwfr=?AJS2.EVENT?:"value";',
        '    evtmc=n:"/tmp/result.txt";',
        "  }",
        "  unit=wait2,,jp1admin,;",
        "  {",
        "    ty=revwj;",
        "  }",
        "}",
        "",
      ].join("\n"),
    );

    assert.deepStrictEqual(diagnostics, []);
  });

  test("reports event receiving string-filter diagnostics for explicit invalid values", () => {
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
        "  el=wait6,revwj,+800+0;",
        "  unit=wait1,,jp1admin,;",
        "  {",
        "    ty=evwj;",
        "    evusr=plain-user;",
        "  }",
        "  unit=wait2,,jp1admin,;",
        "  {",
        "    ty=revwj;",
        `    evgrp="${"a".repeat(21)}";`,
        "  }",
        "  unit=wait3,,jp1admin,;",
        "  {",
        "    ty=evwj;",
        `    evwms="${"m".repeat(1025)}";`,
        "  }",
        "  unit=wait4,,jp1admin,;",
        "  {",
        "    ty=revwj;",
        "    evdet=detail-text;",
        "  }",
        "  unit=wait5,,jp1admin,;",
        "  {",
        "    ty=evwj;",
        "    evwfr=attribute:value;",
        "  }",
        "  unit=wait6,,jp1admin,;",
        "  {",
        "    ty=revwj;",
        '    evtmc=d:"";',
        "  }",
        "}",
        "",
      ].join("\n"),
    );

    assertSyntaxDiagnostics(diagnostics, [
      expectedSyntaxDiagnostic(
        [12, 4, 5],
        "Event issue source user name (evusr) must be a quoted string between 1 and 20 bytes.",
      ),
      expectedSyntaxDiagnostic(
        [17, 4, 5],
        "Event issue source group name (evgrp) must be a quoted string between 1 and 20 bytes.",
      ),
      expectedSyntaxDiagnostic(
        [22, 4, 5],
        "Event message filter (evwms) must be a quoted string between 1 and 1024 bytes.",
      ),
      expectedSyntaxDiagnostic(
        [27, 4, 5],
        "Detailed event information filter (evdet) must be a quoted string between 1 and 1024 bytes.",
      ),
      expectedSyntaxDiagnostic(
        [32, 4, 5],
        'Optional extended attribute filter (evwfr) must use optional-extended-attribute-name:"value" format.',
      ),
      expectedSyntaxDiagnostic(
        [37, 4, 5],
        'End judgment condition (evtmc) must be n, a, n:"file-name", a:"file-name", d:"file-name", or b:"file-name" with a file name between 1 and 256 bytes.',
      ),
    ]);
  });

  test("enforces canonical repeated evwfr aggregate bytes at the first crossing parameter", () => {
    const exactContent = "a".repeat(1013);
    const overContent = "a".repeat(1014);
    const exactMultibyteContent = `${"あ".repeat(337)}aa`;
    const exactDiagnostics = buildSyntaxDiagnostics(
      buildRootUnitDefinition([
        {
          name: "wait1",
          type: "evwj",
          parameters: [
            `evwfr=a:"${exactContent}";`,
            `evwfr=b:"${exactContent}";`,
          ],
        },
      ]),
    );

    assert.deepStrictEqual(exactDiagnostics, []);

    const overDiagnostics = buildSyntaxDiagnostics(
      buildRootUnitDefinition([
        {
          name: "wait1",
          type: "evwj",
          parameters: [
            `evwfr=a:"${exactContent}";`,
            `evwfr=b:"${overContent}";`,
            'evwfr=c:"later";',
          ],
        },
      ]),
    );

    assertSyntaxDiagnostics(overDiagnostics, [
      expectedSyntaxDiagnostic(
        [10, 4, 5],
        "Combined optional extended attribute filters (evwfr) must total no more than 2048 bytes in canonical evwfr=<raw-value>; form.",
      ),
    ]);

    const multibyteDiagnostics = buildSyntaxDiagnostics(
      buildRootUnitDefinition([
        {
          name: "wait1",
          type: "revwj",
          parameters: [
            `evwfr=a:"${exactContent}";`,
            `evwfr=b:"${exactMultibyteContent}a";`,
          ],
        },
      ]),
    );

    assert.strictEqual(multibyteDiagnostics.length, 1);
    assert.strictEqual(multibyteDiagnostics[0].line, 10);
  });

  test("keeps evwfr shape and aggregate diagnostics separate for malformed values", () => {
    const diagnostics = buildSyntaxDiagnostics(
      buildRootUnitDefinition([
        {
          name: "wait1",
          type: "evwj",
          parameters: [`evwfr=${"a".repeat(2042)};`],
        },
      ]),
    );

    assert.deepStrictEqual(
      diagnostics.map((diagnostic) => diagnostic.message),
      [
        'Optional extended attribute filter (evwfr) must use optional-extended-attribute-name:"value" format.',
        "Combined optional extended attribute filters (evwfr) must total no more than 2048 bytes in canonical evwfr=<raw-value>; form.",
      ],
    );
  });

  test("does not report event receiving numeric-identifier diagnostics for omitted and boundary values", () => {
    const diagnostics = buildSyntaxDiagnostics(
      buildRootUnitDefinition([
        {
          name: "wait1",
          type: "evwj",
          parameters: ["evuid=-1;", "evgid=0;", "evpid=9999999999;"],
        },
        { name: "wait2", type: "revwj" },
      ]),
    );

    assert.deepStrictEqual(diagnostics, []);
  });

  test("reports event receiving numeric-identifier diagnostics for explicit out-of-range values", () => {
    const diagnostics = buildSyntaxDiagnostics(
      buildRootUnitDefinition([
        { name: "wait1", type: "evwj", parameters: ["evuid=-2;"] },
        { name: "wait2", type: "revwj", parameters: ["evgid=10000000000;"] },
        { name: "wait3", type: "evwj", parameters: ["evpid=abc;"] },
      ]),
    );

    assertSyntaxDiagnostics(diagnostics, [
      expectedSyntaxDiagnostic(
        [9, 4, 5],
        "Event issue source user ID (evuid) must be a signed decimal value between -1 and 9999999999.",
      ),
      expectedSyntaxDiagnostic(
        [14, 4, 5],
        "Event issue source group ID (evgid) must be a signed decimal value between -1 and 9999999999.",
      ),
      expectedSyntaxDiagnostic(
        [19, 4, 5],
        "Event issue source process ID (evpid) must be a signed decimal value between -1 and 9999999999.",
      ),
    ]);
  });

  test("does not report event receiving timeout-control diagnostics for valid explicit values outside start-condition context", () => {
    const diagnostics = buildSyntaxDiagnostics(
      buildRootUnitDefinition([
        {
          name: "wait1",
          type: "evwj",
          parameters: ["etm=1;", "ha=y;", "ets=kl;"],
        },
        {
          name: "wait2",
          type: "revwj",
          parameters: ["etm=1440;", "ha=n;", "ets=an;"],
        },
      ]),
    );

    assert.deepStrictEqual(diagnostics, []);
  });

  test("reports event receiving timeout-control diagnostics for explicit invalid values and start-condition usage", () => {
    const diagnostics = buildSyntaxDiagnostics(
      buildRootUnitDefinition([
        { name: "start-condition", type: "rc" },
        { name: "wait1", type: "evwj", parameters: ["etm=0;"] },
        { name: "wait2", type: "revwj", parameters: ["ha=maybe;"] },
        { name: "wait3", type: "evwj", parameters: ["ets=xx;"] },
        {
          name: "wait4",
          type: "revwj",
          parameters: ["etm=10;", "ha=y;", "ets=wr;"],
        },
      ]),
    );

    assertSyntaxDiagnostics(diagnostics, [
      {
        line: 14,
        column: 4,
        length: 5,
        message: "Event timeout period (etm) must be between 1 and 1440.",
      },
      {
        line: 19,
        column: 4,
        length: 5,
        message: "Hold attribute (ha) must be y or n.",
      },
      {
        line: 24,
        column: 4,
        length: 5,
        message: "Event timeout action (ets) must be one of kl, nr, wr, or an.",
      },
      expectedSyntaxDiagnostic(
        [29, 4, 5],
        "Event timeout period (etm) cannot be specified for jobs defined as start conditions.",
      ),
      expectedSyntaxDiagnostic(
        [30, 4, 5],
        "Hold attribute (ha) cannot be specified for jobs defined as start conditions.",
      ),
      expectedSyntaxDiagnostic(
        [31, 4, 5],
        "Event timeout action (ets) cannot be specified for jobs defined as start conditions.",
      ),
    ]);
  });

  test("reports event receiving fd diagnostics for explicit out-of-range values and start-condition usage", () => {
    const diagnostics = buildSyntaxDiagnostics(
      buildStartConditionDefinition([
        { name: "wait1", type: "evwj", parameters: ["fd=0;"] },
        { name: "wait2", type: "revwj", parameters: ["fd=10;"] },
      ]),
    );

    assertSyntaxDiagnostics(diagnostics, [
      expectedExecutionTimeRangeDiagnostic([14, 4, 4]),
      expectedStartConditionExecutionTimeDiagnostic([14, 4, 4]),
      expectedStartConditionExecutionTimeDiagnostic([19, 4, 5]),
    ]);
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

    assertSyntaxDiagnostics(diagnostics, [
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
    ]);
  });
});
