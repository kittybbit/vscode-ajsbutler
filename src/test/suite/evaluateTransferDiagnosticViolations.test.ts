import * as assert from "assert";
import type {
  AjsDocument,
  AjsParameter,
  AjsUnit,
} from "../../domain/models/ajs/AjsDocument";
import { diagnosticRuleIds } from "../../domain/services/diagnostics/DiagnosticRuleId";
import {
  evaluateQueueTransferDiagnosticViolations,
  evaluateTransferOperationDiagnosticViolations,
  transferViolationReasons,
  type TransferDiagnosticViolation,
} from "../../domain/services/diagnostics/evaluateTransferDiagnosticViolations";

const createUnit = (
  unitType: AjsUnit["unitType"],
  parameters: AjsParameter[],
  name = unitType,
): AjsUnit => ({
  id: `/root/${name}`,
  name,
  unitAttribute: "",
  unitType,
  absolutePath: `/root/${name}`,
  depth: 1,
  isRoot: false,
  isRootJobnet: false,
  hasSchedule: false,
  hasWaitedFor: false,
  layout: { h: 0, v: 0 },
  parameters,
  relations: [],
  children: [],
});

const createDocument = (...units: AjsUnit[]): AjsDocument => ({
  rootUnits: units,
  warnings: [],
});

const summarize = (
  violations: readonly TransferDiagnosticViolation[],
): Array<{ ruleId: string; reason: string; key: string }> =>
  violations.map(({ ruleId, reason, evidence }) => ({
    ruleId,
    reason,
    key: evidence.key,
  }));

suite("Evaluate transfer diagnostic violations", () => {
  test("preserves transfer operation rule ordering and source evidence", () => {
    const unit = createUnit("j", [
      { key: "ty", value: "j" },
      { key: "ts1", value: '""', line: 4, column: 2, length: 3 },
      { key: "td1", value: "bare" },
      { key: "top2", value: "del" },
      { key: "ts3", value: '"relative/path"' },
    ]);

    const violations = evaluateTransferOperationDiagnosticViolations(
      createDocument(unit),
    );

    assert.deepStrictEqual(summarize(violations), [
      {
        ruleId: diagnosticRuleIds.transferFilePath,
        reason: transferViolationReasons.invalidSourceByteLength,
        key: "ts1",
      },
      {
        ruleId: diagnosticRuleIds.transferFileForm,
        reason: transferViolationReasons.invalidDestinationForm,
        key: "td1",
      },
      {
        ruleId: diagnosticRuleIds.transferFilePath,
        reason: transferViolationReasons.invalidSourcePath,
        key: "ts3",
      },
      {
        ruleId: diagnosticRuleIds.transferFilePath,
        reason: transferViolationReasons.operationRequiresSource,
        key: "top2",
      },
    ]);
    assert.strictEqual(violations[0]?.evidence, unit.parameters[1]);
  });

  test("applies queue transfer rules without the operation dependency", () => {
    const unit = createUnit("qj", [
      { key: "ty", value: "qj" },
      { key: "td1", value: "bare" },
      { key: "top1", value: "del" },
    ]);

    assert.deepStrictEqual(
      summarize(
        evaluateQueueTransferDiagnosticViolations(createDocument(unit)),
      ),
      [
        {
          ruleId: diagnosticRuleIds.transferFileForm,
          reason: transferViolationReasons.invalidDestinationForm,
          key: "td1",
        },
        {
          ruleId: diagnosticRuleIds.transferFilePath,
          reason: transferViolationReasons.destinationRequiresSource,
          key: "td1",
        },
      ],
    );
  });

  test("reports every prohibited custom PC parameter in index and prefix order", () => {
    const parameters = [
      { key: "ty", value: "cpj" },
      ...[1, 2, 3, 4].flatMap((index) =>
        ["ts", "td", "top"].map((prefix) => ({
          key: `${prefix}${index}`,
          value: "value",
        })),
      ),
    ];
    const violations = evaluateTransferOperationDiagnosticViolations(
      createDocument(createUnit("cpj", parameters)),
    );

    assert.deepStrictEqual(
      summarize(violations),
      [1, 2, 3, 4].flatMap((index) =>
        ["ts", "td", "top"].map((prefix) => ({
          ruleId: diagnosticRuleIds.transferFileForm,
          reason: transferViolationReasons.customPcParameterProhibited,
          key: `${prefix}${index}`,
        })),
      ),
    );
  });

  test("accepts macros only for the existing unit and effective job-type contexts", () => {
    const accepted = [
      createUnit("j", [
        { key: "ty", value: "j" },
        { key: "ts1", value: "?SRC?" },
      ]),
      createUnit(
        "rj",
        [
          { key: "ty", value: "rj" },
          { key: "jty", value: "q" },
          { key: "ts1", value: "?SRC?" },
        ],
        "rj",
      ),
      createUnit(
        "cj",
        [
          { key: "ty", value: "cj" },
          { key: "ts1", value: "?SRC?" },
        ],
        "cj",
      ),
    ];
    const queue = createUnit("qj", [
      { key: "ty", value: "qj" },
      { key: "ts1", value: "?SRC?" },
    ]);

    assert.deepStrictEqual(
      evaluateTransferOperationDiagnosticViolations(
        createDocument(...accepted),
      ),
      [],
    );
    assert.deepStrictEqual(
      evaluateQueueTransferDiagnosticViolations(createDocument(queue)),
      [],
    );

    const nonQueuing = createUnit("j", [
      { key: "ty", value: "j" },
      { key: "jty", value: "n" },
      { key: "ts1", value: "?SRC?" },
    ]);
    assert.strictEqual(
      evaluateTransferOperationDiagnosticViolations(
        createDocument(nonQueuing),
      )[0]?.reason,
      transferViolationReasons.invalidSourceForm,
    );
  });

  test("ignores unsupported and implicit target types", () => {
    const unsupported = createUnit("g", [
      { key: "ty", value: "g" },
      { key: "ts1", value: "bare" },
    ]);
    const implicit = createUnit("j", [{ key: "ts1", value: "bare" }]);

    assert.deepStrictEqual(
      evaluateTransferOperationDiagnosticViolations(
        createDocument(unsupported, implicit),
      ),
      [],
    );
    assert.deepStrictEqual(
      evaluateQueueTransferDiagnosticViolations(
        createDocument(unsupported, implicit),
      ),
      [],
    );
  });
});
