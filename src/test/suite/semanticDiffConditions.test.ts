import * as assert from "assert";
import type {
  AjsDocument,
  AjsParameter,
  AjsRelation,
  AjsUnit,
  AjsUnitType,
} from "../../domain/models/ajs/AjsDocument";
import { buildSemanticDiffOutputContext } from "../../application/semantic-diff/buildSemanticDiffOutputContext";
import { compareSemanticDiff } from "../../application/semantic-diff/compareSemanticDiff";
import { renderSemanticDiffAuditMarkdown } from "../../presentation/semantic-diff/renderSemanticDiffAuditMarkdown";
import { renderSemanticDiffMarkdown } from "../../presentation/semantic-diff/renderSemanticDiffMarkdown";
import { renderSemanticDiffJson } from "../../presentation/semantic-diff/serializeSemanticDiffJson";

const relation = (
  sourceUnitId: string,
  targetUnitId: string,
  type: AjsRelation["type"] = "seq",
): AjsRelation => ({
  sourceUnitId,
  targetUnitId,
  type,
});

const params = (values: Record<string, string>): AjsParameter[] =>
  Object.entries(values).map(([key, value]) => ({ key, value }));

const unit = (overrides: Partial<AjsUnit>): AjsUnit => ({
  id: overrides.absolutePath ?? "/root/jobnet/job",
  name: "job",
  unitAttribute: "job,,jp1admin,",
  unitType: "j",
  absolutePath: "/root/jobnet/job",
  depth: 2,
  parentId: "/root/jobnet",
  isRoot: false,
  isRootJobnet: false,
  hasSchedule: false,
  hasWaitedFor: false,
  layout: { h: 1, v: 1 },
  parameters: params({ ty: "j", sc: "echo ok" }),
  relations: [],
  children: [],
  ...overrides,
});

const typedUnit = (
  name: string,
  unitType: AjsUnitType,
  parameters: Record<string, string>,
): AjsUnit =>
  unit({
    id: `/root/jobnet/${name}`,
    name,
    unitType,
    absolutePath: `/root/jobnet/${name}`,
    parameters: params({ ty: unitType, ...parameters }),
  });

const jobnet = (children: AjsUnit[]): AjsUnit =>
  unit({
    id: "/root/jobnet",
    name: "jobnet",
    unitAttribute: "jobnet,,jp1admin,",
    unitType: "n",
    absolutePath: "/root/jobnet",
    depth: 1,
    parentId: "/root",
    isRootJobnet: true,
    parameters: params({ ty: "n" }),
    children,
  });

const document = (children: AjsUnit[]): AjsDocument => ({
  rootUnits: [
    unit({
      id: "/root",
      name: "root",
      unitAttribute: "root,,jp1admin,",
      unitType: "g",
      absolutePath: "/root",
      depth: 0,
      parentId: undefined,
      isRoot: true,
      parameters: params({ ty: "g" }),
      children: [jobnet(children)],
    }),
  ],
  warnings: [],
});

const compareChildren = (before: AjsUnit[], after: AjsUnit[]) =>
  compareSemanticDiff({
    before: document(before),
    after: document(after),
    options: { jobGroupPath: "/root" },
  });

suite("Semantic diff condition checks", () => {
  test("requires confirmation when a conditional relation is removed", () => {
    const beforeSource = typedUnit("source", "j", { sc: "echo source" });
    const beforeTarget = typedUnit("target", "j", { sc: "echo target" });
    beforeSource.relations = [
      relation(beforeSource.id, beforeTarget.id, "con"),
    ];
    const afterSource = typedUnit("source", "j", { sc: "echo source" });
    const afterTarget = typedUnit("target", "j", { sc: "echo target" });

    const result = compareChildren(
      [beforeSource, beforeTarget],
      [afterSource, afterTarget],
    );

    assert.deepStrictEqual(
      result.confirmationRequired.map((item) => item.reasonCode),
      ["conditional-relation-removed"],
    );
    assert.deepStrictEqual(
      result.confirmationRequired[0].detail.relationPair?.canonicalPair,
      {
        sourceUnitId: beforeSource.id,
        targetUnitId: beforeTarget.id,
        type: "con",
      },
    );
    assert.strictEqual(result.confirmationRequired[0].warning, null);
    assert.ok(
      result.confirmationRequired[0].constraints.some(
        (constraint) => constraint.code === "jp1-ajs3-v13-rule-basis",
      ),
    );
    assert.ok(
      result.confirmationRequired[0].constraints.some(
        (constraint) => constraint.code === "runtime-state-not-verified",
      ),
    );
    assert.strictEqual(
      renderSemanticDiffMarkdown(result).includes(
        "a previously conditional branch path may no longer be available",
      ),
      true,
    );

    const reorderedResult = compareChildren(
      [beforeTarget, beforeSource],
      [afterTarget, afterSource],
    );
    assert.deepStrictEqual(
      reorderedResult.confirmationRequired,
      result.confirmationRequired,
    );
  });

  test("does not treat plain predecessor removal as a confirmation-required problem", () => {
    const beforeSource = typedUnit("source", "j", { sc: "echo source" });
    const beforeTarget = typedUnit("target", "j", { sc: "echo target" });
    beforeSource.relations = [
      relation(beforeSource.id, beforeTarget.id, "seq"),
    ];
    const afterSource = typedUnit("source", "j", { sc: "echo source" });
    const afterTarget = typedUnit("target", "j", { sc: "echo target" });

    const result = compareChildren(
      [beforeSource, beforeTarget],
      [afterSource, afterTarget],
    );

    assert.deepStrictEqual(result.confirmationRequired, []);
  });

  test("does not treat an added conditional relation as a confirmation-required problem", () => {
    const beforeSource = typedUnit("source", "j", { sc: "echo source" });
    const beforeTarget = typedUnit("target", "j", { sc: "echo target" });
    const afterSource = typedUnit("source", "j", { sc: "echo source" });
    const afterTarget = typedUnit("target", "j", { sc: "echo target" });
    afterSource.relations = [relation(afterSource.id, afterTarget.id, "con")];

    const result = compareChildren(
      [beforeSource, beforeTarget],
      [afterSource, afterTarget],
    );

    assert.deepStrictEqual(result.confirmationRequired, []);
  });

  test("does not treat an endpoint removal as a tightened conditional path", () => {
    const beforeSource = typedUnit("source", "j", { sc: "echo source" });
    const beforeTarget = typedUnit("target", "j", { sc: "echo target" });
    beforeSource.relations = [
      relation(beforeSource.id, beforeTarget.id, "con"),
    ];
    const afterSource = typedUnit("source", "j", { sc: "echo source" });

    const result = compareChildren([beforeSource, beforeTarget], [afterSource]);

    assert.deepStrictEqual(result.confirmationRequired, []);
  });

  test("does not treat a cycle-only topology change as a confirmation-required problem", () => {
    const beforeSource = typedUnit("source", "j", { sc: "echo source" });
    const beforeTarget = typedUnit("target", "j", { sc: "echo target" });
    beforeSource.relations = [
      relation(beforeSource.id, beforeTarget.id, "seq"),
    ];
    const afterSource = typedUnit("source", "j", { sc: "echo source" });
    const afterTarget = typedUnit("target", "j", { sc: "echo target" });
    afterSource.relations = [relation(afterSource.id, afterTarget.id, "seq")];
    afterTarget.relations = [relation(afterTarget.id, afterSource.id, "seq")];

    const result = compareChildren(
      [beforeSource, beforeTarget],
      [afterSource, afterTarget],
    );

    assert.deepStrictEqual(result.confirmationRequired, []);
  });

  test("does not treat a reachability-only relation rewrite as a confirmation-required problem", () => {
    const beforeSource = typedUnit("source", "j", { sc: "echo source" });
    const beforeMiddle = typedUnit("middle", "j", { sc: "echo middle" });
    const beforeTarget = typedUnit("target", "j", { sc: "echo target" });
    beforeSource.relations = [
      relation(beforeSource.id, beforeMiddle.id, "seq"),
    ];
    beforeMiddle.relations = [
      relation(beforeMiddle.id, beforeTarget.id, "seq"),
    ];
    const afterSource = typedUnit("source", "j", { sc: "echo source" });
    const afterMiddle = typedUnit("middle", "j", { sc: "echo middle" });
    const afterTarget = typedUnit("target", "j", { sc: "echo target" });
    afterSource.relations = [relation(afterSource.id, afterTarget.id, "seq")];

    const result = compareChildren(
      [beforeSource, beforeMiddle, beforeTarget],
      [afterSource, afterMiddle, afterTarget],
    );

    assert.deepStrictEqual(result.confirmationRequired, []);
  });

  test("reports wait release source changes and timeout removal", () => {
    const beforeRelease = typedUnit("release-a", "j", { sc: "echo release" });
    const afterRelease = typedUnit("release-b", "j", { sc: "echo release" });
    const beforeWait = typedUnit("wait", "evwj", {
      eun: "release-a",
      evwid: "00000001:00000002",
      etm: "30",
    });
    const afterWait = typedUnit("wait", "evwj", {
      eun: "release-b",
      evwid: "00000001:00000002",
    });

    const result = compareChildren(
      [beforeRelease, beforeWait],
      [afterRelease, afterWait],
    );

    assert.deepStrictEqual(
      result.confirmationRequired.map((item) => item.reasonCode),
      ["timeout-removed", "wait-release-source-changed"],
    );
    const timeout = result.confirmationRequired.find(
      (item) => item.reasonCode === "timeout-removed",
    );
    const release = result.confirmationRequired.find(
      (item) => item.reasonCode === "wait-release-source-changed",
    );
    assert.deepStrictEqual(timeout?.detail, {
      unitPath: afterWait.absolutePath,
      parameterKey: "etm",
      relationPair: null,
      scheduleRule: null,
      period: null,
      beforeValues: ["30"],
      afterValues: [],
      rawValues: [],
      removedSources: [],
    });
    assert.deepStrictEqual(release?.detail, {
      unitPath: afterWait.absolutePath,
      parameterKey: "eun",
      relationPair: null,
      scheduleRule: null,
      period: null,
      beforeValues: ["release-a"],
      afterValues: ["release-b"],
      rawValues: ["release-a"],
      removedSources: ["release-a"],
    });
    assert.deepStrictEqual(
      timeout?.constraints.map((constraint) => constraint.code),
      [
        "jp1-ajs3-v13-rule-basis",
        "runtime-state-not-verified",
        "external-state-not-verified",
      ],
    );
    assert.deepStrictEqual(
      release?.constraints.map((constraint) => constraint.code),
      ["jp1-ajs3-v13-rule-basis", "runtime-state-not-verified"],
    );
    assert.strictEqual(timeout?.warning, null);
    assert.strictEqual(release?.warning, null);
    assert.ok(
      result.confirmationRequired.every((item) =>
        item.constraints.some(
          (constraint) => constraint.code === "runtime-state-not-verified",
        ),
      ),
    );
  });

  test("retains explicit timeouts and reports removed event and file timeouts across outputs", () => {
    const beforeRetainedEvent = typedUnit("retained-event", "evwj", {
      etm: "30",
    });
    const afterRetainedEvent = typedUnit("retained-event", "evwj", {
      etm: "30",
    });
    const beforeRetainedFile = typedUnit("retained-file", "flwj", {
      fd: "30",
    });
    const afterRetainedFile = typedUnit("retained-file", "flwj", {
      fd: "30",
    });
    const beforeRemovedEvent = typedUnit("removed-event", "evwj", {
      etm: "30",
    });
    const afterRemovedEvent = typedUnit("removed-event", "evwj", {});
    const beforeRemovedFile = typedUnit("removed-file", "flwj", {
      fd: "30",
    });
    const afterRemovedFile = typedUnit("removed-file", "flwj", {});

    const result = compareChildren(
      [
        beforeRetainedEvent,
        beforeRetainedFile,
        beforeRemovedEvent,
        beforeRemovedFile,
      ],
      [
        afterRetainedEvent,
        afterRetainedFile,
        afterRemovedEvent,
        afterRemovedFile,
      ],
    );
    const timeoutItems = result.confirmationRequired.filter(
      (item) => item.reasonCode === "timeout-removed",
    );

    assert.deepStrictEqual(
      timeoutItems.map((item) => [
        item.target.kind === "unit" || item.target.kind === "jobnet"
          ? item.target.unit.name
          : item.target.kind,
        item.detail.parameterKey,
        item.detail.beforeValues,
        item.detail.afterValues,
      ]),
      [
        ["removed-event", "etm", ["30"], []],
        ["removed-file", "fd", ["30"], []],
      ],
    );
    assert.deepStrictEqual(
      result.confirmationRequired.map((item) => item.target),
      timeoutItems.map((item) => item.target),
    );
    const full = renderSemanticDiffMarkdown(result);
    assert.ok(full.includes("removed-event explicit timeout etm removed"));
    assert.ok(full.includes("removed-file explicit timeout fd removed"));
    assert.strictEqual(full.includes("retained-event explicit timeout"), false);
    assert.strictEqual(full.includes("retained-file explicit timeout"), false);
    assert.ok(full.includes("Runtime history and external conditions"));
    assert.ok(full.includes("External files, events, hosts"));

    const context = buildSemanticDiffOutputContext(result);
    const audit = renderSemanticDiffAuditMarkdown(context);
    assert.ok(audit.includes("parameterKey: etm"));
    assert.ok(audit.includes("parameterKey: fd"));
    assert.ok(audit.includes("beforeValues: [30]"));
    assert.ok(audit.includes("afterValues: []"));
    assert.ok(audit.includes("runtime-state-not-verified"));
    assert.ok(audit.includes("external-state-not-verified"));

    const json = JSON.parse(renderSemanticDiffJson(context).content) as {
      result: {
        confirmationRequired: Array<{
          reasonCode: string;
          detail: {
            parameterKey: string | null;
            beforeValues: string[];
            afterValues: string[];
          };
          constraints: Array<{ code: string }>;
        }>;
      };
    };
    assert.deepStrictEqual(
      json.result.confirmationRequired.map((item) => ({
        reasonCode: item.reasonCode,
        parameterKey: item.detail.parameterKey,
        beforeValues: item.detail.beforeValues,
        afterValues: item.detail.afterValues,
        constraints: item.constraints.map((constraint) => constraint.code),
      })),
      [
        {
          reasonCode: "timeout-removed",
          parameterKey: "etm",
          beforeValues: ["30"],
          afterValues: [],
          constraints: [
            "external-state-not-verified",
            "jp1-ajs3-v13-rule-basis",
            "runtime-state-not-verified",
          ],
        },
        {
          reasonCode: "timeout-removed",
          parameterKey: "fd",
          beforeValues: ["30"],
          afterValues: [],
          constraints: [
            "external-state-not-verified",
            "jp1-ajs3-v13-rule-basis",
            "runtime-state-not-verified",
          ],
        },
      ],
    );
  });

  test("requires confirmation when supported end judgment parameters change", () => {
    const beforeJob = typedUnit("job", "j", {
      sc: "echo job",
      jd: "cod",
      wth: "10",
      tho: "20",
    });
    const afterJob = typedUnit("job", "j", {
      sc: "echo job",
      jd: "ab",
      wth: "10",
      tho: "20",
    });

    const result = compareChildren([beforeJob], [afterJob]);

    assert.deepStrictEqual(
      result.confirmationRequired.map((item) => item.reasonCode),
      ["condition-judgment-changed"],
    );
    assert.deepStrictEqual(result.confirmationRequired[0].detail, {
      unitPath: afterJob.absolutePath,
      parameterKey: "jd",
      relationPair: null,
      scheduleRule: null,
      period: null,
      beforeValues: ["cod"],
      afterValues: ["ab"],
      rawValues: [],
      removedSources: [],
    });
  });

  test("reports file and event wait target changes with external constraints in the report", () => {
    const beforeFile = typedUnit("file-wait", "flwj", {
      flwf: '"/var/before.dat"',
      flwc: "c",
    });
    const afterFile = typedUnit("file-wait", "flwj", {
      flwf: '"/var/after.dat"',
      flwc: "c",
    });
    const beforeEvent = typedUnit("event-wait", "evwj", {
      evwid: "00000001:00000002",
    });
    const afterEvent = typedUnit("event-wait", "evwj", {
      evwid: "00000001:00000003",
    });

    const result = compareChildren(
      [beforeFile, beforeEvent],
      [afterFile, afterEvent],
    );
    const report = renderSemanticDiffMarkdown(result);

    assert.deepStrictEqual(
      result.confirmationRequired.map((item) => item.reasonCode),
      ["wait-target-changed", "wait-target-changed"],
    );
    const waitDetails = result.confirmationRequired.map((item) => [
      item.detail.parameterKey,
      item.detail.beforeValues,
      item.detail.afterValues,
    ]);
    assert.deepStrictEqual(waitDetails, [
      ["evwid", ["00000001:00000002"], ["00000001:00000003"]],
      ["flwf", ['"/var/before.dat"'], ['"/var/after.dat"']],
    ]);
    assert.ok(report.includes("External files, events, hosts"));
    assert.ok(report.includes("Rule basis: JP1/AJS3 v13"));
    assert.ok(report.includes("Runtime history and external conditions"));

    const expectedConstraintCodes = [
      "jp1-ajs3-v13-rule-basis",
      "runtime-state-not-verified",
      "external-state-not-verified",
    ];
    assert.ok(
      result.confirmationRequired.every((item) =>
        item.constraints.every(
          (constraint, index) =>
            constraint.code === expectedConstraintCodes[index],
        ),
      ),
    );

    const context = buildSemanticDiffOutputContext(result);
    const audit = renderSemanticDiffAuditMarkdown(context);
    assert.ok(audit.includes("parameterKey: evwid"));
    assert.ok(audit.includes("beforeValues: [00000001:00000002]"));
    assert.ok(audit.includes("afterValues: [00000001:00000003]"));
    assert.ok(audit.includes("external-state-not-verified"));
    assert.ok(audit.includes('beforeValues: ["/var/before.dat"]'));
    assert.ok(audit.includes('afterValues: ["/var/after.dat"]'));

    const json = JSON.parse(renderSemanticDiffJson(context).content) as {
      result: {
        confirmationRequired: Array<{
          detail: {
            parameterKey: string | null;
            beforeValues: string[];
            afterValues: string[];
            rawValues: string[];
          };
          constraints: Array<{ code: string }>;
        }>;
      };
    };
    assert.deepStrictEqual(
      json.result.confirmationRequired.map((item) => ({
        parameterKey: item.detail.parameterKey,
        beforeValues: item.detail.beforeValues,
        afterValues: item.detail.afterValues,
        rawValues: item.detail.rawValues,
        constraints: item.constraints.map((constraint) => constraint.code),
      })),
      [
        {
          parameterKey: "evwid",
          beforeValues: ["00000001:00000002"],
          afterValues: ["00000001:00000003"],
          rawValues: [],
          constraints: [
            "external-state-not-verified",
            "jp1-ajs3-v13-rule-basis",
            "runtime-state-not-verified",
          ],
        },
        {
          parameterKey: "flwf",
          beforeValues: ['"/var/before.dat"'],
          afterValues: ['"/var/after.dat"'],
          rawValues: [],
          constraints: [
            "external-state-not-verified",
            "jp1-ajs3-v13-rule-basis",
            "runtime-state-not-verified",
          ],
        },
      ],
    );

    const japanese = renderSemanticDiffMarkdown(result, "ja-JP");
    assert.ok(japanese.includes("変更内容を確認してください"));
    assert.ok(japanese.includes("実行時または外部条件は検証されません"));
  });

  test("reports before-only and after-only values for every supported file and event target", () => {
    const fileTargetKeys = ["flwf", "flwc"];
    const eventTargetKeys = [
      "evwid",
      "evwfr",
      "evhst",
      "evwms",
      "evdet",
      "evusr",
      "evgrp",
      "evuid",
      "evgid",
      "evpid",
      "evipa",
      "evesc",
    ];
    const targetKeys = [...fileTargetKeys, ...eventTargetKeys];
    const targetCases = targetKeys.flatMap((parameterKey, index) => {
      const unitType: "flwj" | "evwj" =
        index < fileTargetKeys.length ? "flwj" : "evwj";
      return [
        {
          name: `before-only-${parameterKey}`,
          beforeValues: [`before-${parameterKey}`],
          afterValues: [],
        },
        {
          name: `after-only-${parameterKey}`,
          beforeValues: [],
          afterValues: [`after-${parameterKey}`],
        },
        {
          name: `replacement-${parameterKey}`,
          beforeValues: [`before-${parameterKey}`],
          afterValues: [`after-${parameterKey}`],
        },
      ].map((targetCase) => ({ ...targetCase, parameterKey, unitType }));
    });
    const beforeUnits = targetCases.map(
      ({ name, parameterKey, unitType, beforeValues }) =>
        typedUnit(
          name,
          unitType,
          beforeValues.length > 0 ? { [parameterKey]: beforeValues[0] } : {},
        ),
    );
    const afterUnits = targetCases.map(
      ({ name, parameterKey, unitType, afterValues }) =>
        typedUnit(
          name,
          unitType,
          afterValues.length > 0 ? { [parameterKey]: afterValues[0] } : {},
        ),
    );
    const result = compareChildren(beforeUnits, afterUnits);
    const expectedConstraintCodes = [
      "jp1-ajs3-v13-rule-basis",
      "runtime-state-not-verified",
      "external-state-not-verified",
    ];

    assert.strictEqual(result.confirmationRequired.length, targetCases.length);
    targetCases.forEach((targetCase) => {
      const item = result.confirmationRequired.find(
        (candidate) =>
          candidate.detail.unitPath === `/root/jobnet/${targetCase.name}`,
      );
      assert.ok(item);
      assert.strictEqual(item?.reasonCode, "wait-target-changed");
      assert.strictEqual(item?.detail.parameterKey, targetCase.parameterKey);
      assert.deepStrictEqual(
        item?.detail.beforeValues,
        targetCase.beforeValues,
      );
      assert.deepStrictEqual(item?.detail.afterValues, targetCase.afterValues);
      assert.deepStrictEqual(item?.detail.rawValues, []);
      assert.deepStrictEqual(
        item?.constraints.map((constraint) => constraint.code),
        expectedConstraintCodes,
      );
    });

    const context = buildSemanticDiffOutputContext(result);
    const full = renderSemanticDiffMarkdown(result);
    targetCases.forEach((targetCase) => {
      assert.ok(
        full.includes(
          `${targetCase.name} wait target ${targetCase.parameterKey} changed`,
        ),
      );
    });
    assert.ok(full.includes("Runtime history and external conditions"));
    assert.ok(full.includes("External files, events, hosts"));

    const audit = renderSemanticDiffAuditMarkdown(context);
    targetCases.forEach((targetCase) => {
      assert.ok(audit.includes(`parameterKey: ${targetCase.parameterKey}`));
      assert.ok(
        audit.includes(`beforeValues: [${targetCase.beforeValues.join(", ")}]`),
      );
      assert.ok(
        audit.includes(`afterValues: [${targetCase.afterValues.join(", ")}]`),
      );
    });
    assert.ok(audit.includes("runtime-state-not-verified"));
    assert.ok(audit.includes("external-state-not-verified"));

    const json = JSON.parse(renderSemanticDiffJson(context).content) as {
      result: {
        confirmationRequired: Array<{
          detail: {
            unitPath: string | null;
            parameterKey: string | null;
            beforeValues: string[];
            afterValues: string[];
            rawValues: string[];
          };
          constraints: Array<{ code: string }>;
        }>;
      };
    };
    assert.strictEqual(
      json.result.confirmationRequired.length,
      targetCases.length,
    );
    targetCases.forEach((targetCase) => {
      const item = json.result.confirmationRequired.find(
        (candidate) =>
          candidate.detail.unitPath === `/root/jobnet/${targetCase.name}`,
      );
      assert.ok(item);
      assert.strictEqual(item?.detail.parameterKey, targetCase.parameterKey);
      assert.deepStrictEqual(
        item?.detail.beforeValues,
        targetCase.beforeValues,
      );
      assert.deepStrictEqual(item?.detail.afterValues, targetCase.afterValues);
      assert.deepStrictEqual(item?.detail.rawValues, []);
      assert.deepStrictEqual(
        item?.constraints.map((constraint) => constraint.code),
        [
          "external-state-not-verified",
          "jp1-ajs3-v13-rule-basis",
          "runtime-state-not-verified",
        ],
      );
    });
  });

  test("reports uninterpretable file monitoring conditions instead of making a false claim", () => {
    const beforeFile = typedUnit("file-wait", "flwj", {
      flwf: '"/var/data.dat"',
      flwc: "s:m",
    });
    const afterFile = typedUnit("file-wait", "flwj", {
      flwf: '"/var/data.dat"',
      flwc: "s:m",
    });

    const result = compareChildren([beforeFile], [afterFile]);

    assert.deepStrictEqual(
      result.unsupportedItems.map((item) => [item.kind, item.reasonCode]),
      [["uninterpretable", "uninterpretable-file-monitoring-condition"]],
    );
    assert.deepStrictEqual(result.unsupportedItems[0].detail, {
      unitPath: afterFile.absolutePath,
      parameterKey: "flwc",
      relationPair: null,
      scheduleRule: null,
      period: null,
      beforeValues: ["s:m"],
      afterValues: ["s:m"],
      rawValues: [],
      removedSources: [],
    });
    assert.ok(result.unsupportedItems[0].warning);
    assert.deepStrictEqual(result.confirmationRequired, []);
  });

  test("keeps unsupported file conditions separate from supported target changes", () => {
    const beforeFile = typedUnit("file-wait", "flwj", {
      flwf: '"/var/before.dat"',
      flwc: "s:m",
    });
    const afterFile = typedUnit("file-wait", "flwj", {
      flwf: '"/var/after.dat"',
      flwc: "s",
    });

    const result = compareChildren([beforeFile], [afterFile]);

    assert.deepStrictEqual(
      result.confirmationRequired.map((item) => item.detail.parameterKey),
      ["flwf"],
    );
    assert.deepStrictEqual(
      result.unsupportedItems.map((item) => item.reasonCode),
      ["uninterpretable-file-monitoring-condition"],
    );
  });

  test("preserves duplicate release sources and resolves related targets in the matched job group", () => {
    const beforeRelease = typedUnit("release-a", "j", { sc: "echo release" });
    const afterRelease = typedUnit("release-a", "j", { sc: "echo release" });
    const beforeWait = typedUnit("wait", "evwj", {
      eun: "release-z",
      evwid: "00000001:00000002",
    });
    beforeWait.parameters.push({ key: "eun", value: "release-a" });
    beforeWait.parameters.push({ key: "eun", value: "release-a" });
    const afterWait = typedUnit("wait", "evwj", {
      eun: "release-b",
      evwid: "00000001:00000002",
    });
    const relatedAfterRelease = typedUnit("release-b", "j", {
      sc: "echo release",
    });
    const unrelatedAfterRelease = typedUnit("release-a", "j", {
      sc: "echo unrelated release",
    });
    unrelatedAfterRelease.id = "/root/other/release-a";
    unrelatedAfterRelease.absolutePath = "/root/other/release-a";
    unrelatedAfterRelease.parentId = "/root/other";

    const result = compareChildren(
      [beforeRelease, beforeWait],
      [afterRelease, afterWait, relatedAfterRelease, unrelatedAfterRelease],
    );
    const release = result.confirmationRequired.find(
      (item) => item.reasonCode === "wait-release-source-changed",
    );

    assert.deepStrictEqual(release?.detail.beforeValues, [
      "release-z",
      "release-a",
      "release-a",
    ]);
    assert.deepStrictEqual(release?.detail.afterValues, ["release-b"]);
    assert.deepStrictEqual(release?.detail.rawValues, [
      "release-a",
      "release-a",
      "release-z",
    ]);
    assert.deepStrictEqual(release?.detail.removedSources, [
      "release-a",
      "release-a",
      "release-z",
    ]);
    assert.deepStrictEqual(
      release?.relatedTargets.map((target) =>
        target.kind === "unit" || target.kind === "jobnet"
          ? target.unit.name
          : target.kind,
      ),
      ["release-a", "release-a"],
    );
  });
});
