import * as assert from "assert";
import type {
  AjsParameter,
  AjsRelation,
  AjsUnit,
} from "../../domain/models/ajs/AjsDocument";
import { TySymbols, type TySymbol } from "../../domain/values/AjsType";
import {
  buildSemanticDiffUnitCorrespondence,
  compareSemanticDiffAttributes,
  compareSemanticDiffRelations,
  createSemanticDiffIdentityFingerprint,
  semanticDiffUnitIdentityStrategy,
  semanticDiffUnitFingerprint,
  semanticDiffUnitIdentityKey,
  type SemanticDiffUnitMatch,
} from "../../domain/services/semantic-diff/semanticDiffStructuralRules";

const parameters = (values: Record<string, string>): AjsParameter[] =>
  Object.entries(values).map(([key, value]) => ({ key, value }));

const parameterEntries = (entries: Array<[string, string]>): AjsParameter[] =>
  entries.map(([key, value]) => ({ key, value }));

const unit = (overrides: Partial<AjsUnit> = {}): AjsUnit => ({
  id: "/root/jobnet/job",
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
  parameters: parameters({ ty: "j", sc: "echo ok" }),
  relations: [],
  children: [],
  ...overrides,
});

const jobnet = (absolutePath: string): AjsUnit =>
  unit({
    id: absolutePath,
    name: absolutePath.split("/").at(-1) ?? absolutePath,
    unitType: "n",
    absolutePath,
    depth: 1,
    parentId: "/root",
    isRootJobnet: true,
    parameters: parameters({ ty: "n" }),
  });

const unitMap = (...units: AjsUnit[]): Map<string, AjsUnit> =>
  new Map(units.map((item) => [item.id, item]));

const relation = (
  sourceUnitId: string,
  targetUnitId: string,
  type: AjsRelation["type"] = "seq",
): AjsRelation => ({ sourceUnitId, targetUnitId, type });

const typedUnit = (
  unitType: AjsUnit["unitType"],
  entries: Array<[string, string]>,
  overrides: Partial<AjsUnit> = {},
): AjsUnit =>
  unit({
    unitType,
    parameters: parameterEntries([["ty", unitType], ...entries]),
    ...overrides,
  });

const quoted = (value: string): string => `"${value}"`;

suite("Semantic Diff Structural Rules", () => {
  test("uses parent jobnet, name, and type for exact unit identity", () => {
    const beforeParent = jobnet("/root/before");
    const afterParent = jobnet("/root/after");
    const before = unit({
      id: "/root/before/load",
      name: "LOAD",
      absolutePath: "/root/before/load",
      parentId: beforeParent.id,
    });
    const after = unit({
      id: "/root/after/load",
      name: "LOAD",
      absolutePath: "/root/after/load",
      parentId: afterParent.id,
      parameters: parameters({ ty: "j", sc: "echo changed" }),
    });
    const beforeUnitById = unitMap(beforeParent, before);
    const afterUnitById = unitMap(afterParent, after);

    assert.deepStrictEqual(
      semanticDiffUnitIdentityKey(before, beforeUnitById),
      {
        kind: "unit",
        parentJobnetPath: "/root/before",
        unitName: "LOAD",
        unitType: "j",
      },
    );

    const result = buildSemanticDiffUnitCorrespondence({
      beforeUnits: [before],
      afterUnits: [after],
      beforeUnitById,
      afterUnitById,
      jobGroupPath: "/root",
    });

    assert.deepStrictEqual(result.matches, []);
    assert.deepStrictEqual(result.removedUnits, [before]);
    assert.deepStrictEqual(result.addedUnits, [after]);
  });

  test("confirms only one-to-one fingerprints and preserves ambiguity", () => {
    const parent = jobnet("/root/jobnet");
    const before = unit({
      id: "before",
      name: "before",
      absolutePath: "before",
    });
    const after = unit({ id: "after", name: "after", absolutePath: "after" });
    const parentMap = unitMap(parent, before, after);

    assert.strictEqual(
      semanticDiffUnitFingerprint(before),
      semanticDiffUnitFingerprint(after),
    );

    const oneToOne = buildSemanticDiffUnitCorrespondence({
      beforeUnits: [before],
      afterUnits: [after],
      beforeUnitById: parentMap,
      afterUnitById: parentMap,
    });
    assert.deepStrictEqual(
      oneToOne.fingerprintMatches.map((match) => [
        match.before.id,
        match.after.id,
        match.kind,
      ]),
      [["before", "after", "fingerprint"]],
    );

    const beforeSecond = unit({
      id: "before-2",
      name: "before-2",
      absolutePath: "before-2",
    });
    const afterSecond = unit({
      id: "after-2",
      name: "after-2",
      absolutePath: "after-2",
    });
    const ambiguousMap = unitMap(
      parent,
      before,
      beforeSecond,
      after,
      afterSecond,
    );
    const ambiguous = buildSemanticDiffUnitCorrespondence({
      beforeUnits: [before, beforeSecond],
      afterUnits: [after, afterSecond],
      beforeUnitById: ambiguousMap,
      afterUnitById: ambiguousMap,
    });

    assert.strictEqual(ambiguous.fingerprintMatches.length, 0);
    assert.strictEqual(ambiguous.candidates.length, 1);
    assert.deepStrictEqual(ambiguous.removedUnits, []);
    assert.deepStrictEqual(ambiguous.addedUnits, []);
  });

  test("classifies changed parameters and scalar attributes", () => {
    const before = unit({
      comment: "before",
      parameters: parameters({ ty: "j", sc: "echo ok", eu: "user-a" }),
    });
    const after = unit({
      comment: "after",
      parameters: parameters({ eu: "user-b", sc: "echo ok", ty: "j" }),
    });

    assert.deepStrictEqual(compareSemanticDiffAttributes(before, after), [
      { key: "comment", category: "execution-definition" },
      { key: "eu", category: "execution-environment" },
    ]);
  });

  test("compares relations after applying unit correspondence", () => {
    const before = unit({
      id: "before",
      name: "before",
      absolutePath: "before",
    });
    const after = unit({ id: "after", name: "after", absolutePath: "after" });
    const beforeTail = unit({
      id: "before-tail",
      name: "tail",
      absolutePath: "before-tail",
    });
    const afterTail = unit({
      id: "after-tail",
      name: "tail",
      absolutePath: "after-tail",
    });
    before.relations = [relation(before.id, beforeTail.id)];
    after.relations = [relation(after.id, afterTail.id)];
    const matches: SemanticDiffUnitMatch[] = [
      { before, after, kind: "fingerprint" },
      { before: beforeTail, after: afterTail, kind: "exact" },
    ];

    const unchanged = compareSemanticDiffRelations({
      beforeUnits: [before, beforeTail],
      afterUnits: [after, afterTail],
      beforeUnitById: unitMap(before, beforeTail),
      afterUnitById: unitMap(after, afterTail),
      matches,
    });
    assert.deepStrictEqual(unchanged, []);

    after.relations = [relation(after.id, afterTail.id, "con")];
    const changed = compareSemanticDiffRelations({
      beforeUnits: [before, beforeTail],
      afterUnits: [after, afterTail],
      beforeUnitById: unitMap(before, beforeTail),
      afterUnitById: unitMap(after, afterTail),
      matches,
    });
    assert.deepStrictEqual(
      changed.map((decision) => [
        decision.kind,
        decision.pairKey,
        decision.relation.type,
      ]),
      [
        ["removed", "after->after-tail", "seq"],
        ["added", "after->after-tail", "con"],
      ],
    );
  });

  test("selects the reference-backed strategy and only its canonical fields", () => {
    const command = typedUnit("j", [
      ["te", '"echo $JOB"'],
      ["eu", "operator-a"],
    ]);
    const executable = typedUnit("j", [
      ["sc", '"/opt/jobs/run.sh"'],
      ["prm", '"--safe"'],
      ["eu", "operator-a"],
    ]);
    const executableWithoutArguments = typedUnit("j", [
      ["sc", '"/opt/jobs/run.sh"'],
    ]);
    const executableWithExplicitEmptyArguments = typedUnit("j", [
      ["sc", '"/opt/jobs/run.sh"'],
      ["prm", '""'],
    ]);
    const pcExecutable = typedUnit("rp", [["sc", '"C:\\jobs\\run.exe"']]);
    const queueExecutable = typedUnit("rq", [["sc", '"queue-job"']]);
    const event = typedUnit("evwj", [
      ["evwid", "00000000:FFFFFFFF"],
      ["evusr", '"operator"'],
      ["evgrp", '"batch"'],
      ["evhst", "host-a"],
      ["evipa", "127.0.0.1"],
      ["evwms", '"message"'],
      ["evdet", '"details"'],
      ["evwsv", "em:al:cr"],
      ["evwfr", 'attr:"z"'],
      ["evwfr", 'attr:"a"'],
      ["evuid", "100"],
      ["evgid", "200"],
      ["evpid", "300"],
      ["etm", "10"],
    ]);
    const recoveryEvent = typedUnit(
      "revwj",
      event.parameters
        .filter((parameter) => parameter.key !== "ty")
        .map(
          (parameter) => [parameter.key, parameter.value] as [string, string],
        ),
    );
    const reorderedEvent = typedUnit(
      "evwj",
      event.parameters
        .filter((parameter) => parameter.key !== "ty")
        .reverse()
        .map(
          (parameter) => [parameter.key, parameter.value] as [string, string],
        ),
    );
    const file = typedUnit("flwj", [
      ["flwf", '"/var/log/job.log"'],
      ["flwi", "5"],
      ["fd", "20"],
      ["flco", "y"],
    ]);
    const recoveryFile = typedUnit(
      "rflwj",
      file.parameters
        .filter((parameter) => parameter.key !== "ty")
        .map(
          (parameter) => [parameter.key, parameter.value] as [string, string],
        ),
    );

    assert.strictEqual(
      semanticDiffUnitIdentityStrategy(command),
      "command-text-v1",
    );
    assert.deepStrictEqual(
      createSemanticDiffIdentityFingerprint(command).evidence.fields,
      [{ key: "te", presence: "present", values: ['"echo $JOB"'] }],
    );
    assert.strictEqual(
      semanticDiffUnitIdentityStrategy(executable),
      "executable-file-v1",
    );
    assert.deepStrictEqual(
      createSemanticDiffIdentityFingerprint(executable).evidence.fields,
      [
        { key: "sc", presence: "present", values: ['"/opt/jobs/run.sh"'] },
        { key: "prm", presence: "present", values: ['"--safe"'] },
      ],
    );
    assert.notStrictEqual(
      createSemanticDiffIdentityFingerprint(executableWithoutArguments)
        .fingerprint,
      createSemanticDiffIdentityFingerprint(
        executableWithExplicitEmptyArguments,
      ).fingerprint,
    );
    assert.strictEqual(
      semanticDiffUnitIdentityStrategy(pcExecutable),
      "executable-file-v1",
    );
    assert.strictEqual(
      semanticDiffUnitIdentityStrategy(queueExecutable),
      "executable-file-v1",
    );
    assert.strictEqual(
      semanticDiffUnitIdentityStrategy(event),
      "event-reception-v1",
    );
    assert.strictEqual(
      semanticDiffUnitIdentityStrategy(recoveryEvent),
      "event-reception-v1",
    );
    const eventEvidence = createSemanticDiffIdentityFingerprint(event).evidence;
    const recoveryEventEvidence =
      createSemanticDiffIdentityFingerprint(recoveryEvent).evidence;
    assert.notStrictEqual(
      createSemanticDiffIdentityFingerprint(event).fingerprint,
      createSemanticDiffIdentityFingerprint(recoveryEvent).fingerprint,
    );
    assert.strictEqual(
      createSemanticDiffIdentityFingerprint(event).fingerprint,
      createSemanticDiffIdentityFingerprint(reorderedEvent).fingerprint,
    );
    assert.deepStrictEqual(recoveryEventEvidence.fields, eventEvidence.fields);
    assert.deepStrictEqual(
      eventEvidence.fields.map((identityField) => identityField.key),
      [
        "evwid",
        "evusr",
        "evgrp",
        "evhst",
        "evipa",
        "evwms",
        "evdet",
        "evwsv",
        "evwfr",
        "evuid",
        "evgid",
        "evpid",
      ],
    );
    assert.deepStrictEqual(
      eventEvidence.fields.find(
        (identityField) => identityField.key === "evwfr",
      ),
      { key: "evwfr", presence: "present", values: ['attr:"a"', 'attr:"z"'] },
    );
    assert.deepStrictEqual(
      eventEvidence.fields.find((identityField) => identityField.key === "etm"),
      undefined,
    );
    const eventWithDifferentTimeout = {
      ...event,
      parameters: event.parameters.map((parameter) =>
        parameter.key === "etm" ? { ...parameter, value: "20" } : parameter,
      ),
    };
    const eventWithDifferentSelector = {
      ...event,
      parameters: event.parameters.map((parameter) =>
        parameter.key === "evwid"
          ? { ...parameter, value: "00000001:FFFFFFFF" }
          : parameter,
      ),
    };
    assert.strictEqual(
      createSemanticDiffIdentityFingerprint(event).fingerprint,
      createSemanticDiffIdentityFingerprint(eventWithDifferentTimeout)
        .fingerprint,
    );
    assert.notStrictEqual(
      createSemanticDiffIdentityFingerprint(event).fingerprint,
      createSemanticDiffIdentityFingerprint(eventWithDifferentSelector)
        .fingerprint,
    );
    assert.strictEqual(
      semanticDiffUnitIdentityStrategy(file),
      "file-monitor-v1",
    );
    assert.strictEqual(
      semanticDiffUnitIdentityStrategy(recoveryFile),
      "file-monitor-v1",
    );
    assert.notStrictEqual(
      createSemanticDiffIdentityFingerprint(file).fingerprint,
      createSemanticDiffIdentityFingerprint(recoveryFile).fingerprint,
    );
    assert.deepStrictEqual(
      createSemanticDiffIdentityFingerprint(file).evidence.fields,
      [
        { key: "flwf", presence: "present", values: ['"/var/log/job.log"'] },
        { key: "flwc", presence: "present", values: ["c"] },
      ],
    );
    const fileWithExplicitDefault = {
      ...file,
      parameters: [...file.parameters, { key: "flwc", value: "c" }],
    };
    const fileWithDifferentPolling = {
      ...file,
      parameters: file.parameters.map((parameter) =>
        parameter.key === "flwi" ? { ...parameter, value: "30" } : parameter,
      ),
    };
    const fileWithDifferentCondition = {
      ...file,
      parameters: [...file.parameters, { key: "flwc", value: "c:d" }],
    };
    assert.strictEqual(
      createSemanticDiffIdentityFingerprint(file).fingerprint,
      createSemanticDiffIdentityFingerprint(fileWithExplicitDefault)
        .fingerprint,
    );
    assert.strictEqual(
      createSemanticDiffIdentityFingerprint(file).fingerprint,
      createSemanticDiffIdentityFingerprint(fileWithDifferentPolling)
        .fingerprint,
    );
    assert.notStrictEqual(
      createSemanticDiffIdentityFingerprint(file).fingerprint,
      createSemanticDiffIdentityFingerprint(fileWithDifferentCondition)
        .fingerprint,
    );
  });

  test("covers every supported ordinary and recovery definition form", () => {
    const supportedForms: Array<{
      unitType: TySymbol;
      entries: Array<[string, string]>;
      strategy:
        | "command-text-v1"
        | "executable-file-v1"
        | "event-reception-v1"
        | "file-monitor-v1";
    }> = [
      {
        unitType: "j",
        entries: [["te", quoted("echo")]],
        strategy: "command-text-v1",
      },
      {
        unitType: "rj",
        entries: [["te", quoted("echo")]],
        strategy: "command-text-v1",
      },
      {
        unitType: "j",
        entries: [["sc", quoted("run.sh")]],
        strategy: "executable-file-v1",
      },
      {
        unitType: "rj",
        entries: [["sc", quoted("run.sh")]],
        strategy: "executable-file-v1",
      },
      {
        unitType: "pj",
        entries: [["sc", quoted("run.exe")]],
        strategy: "executable-file-v1",
      },
      {
        unitType: "rp",
        entries: [["sc", quoted("run.exe")]],
        strategy: "executable-file-v1",
      },
      {
        unitType: "qj",
        entries: [["sc", quoted("queue-job")]],
        strategy: "executable-file-v1",
      },
      {
        unitType: "rq",
        entries: [["sc", quoted("queue-job")]],
        strategy: "executable-file-v1",
      },
      {
        unitType: "evwj",
        entries: [["evwid", "00000000:FFFFFFFF"]],
        strategy: "event-reception-v1",
      },
      {
        unitType: "revwj",
        entries: [["evwid", "00000000:FFFFFFFF"]],
        strategy: "event-reception-v1",
      },
      {
        unitType: "flwj",
        entries: [["flwf", quoted("watch.log")]],
        strategy: "file-monitor-v1",
      },
      {
        unitType: "rflwj",
        entries: [["flwf", quoted("watch.log")]],
        strategy: "file-monitor-v1",
      },
    ];

    supportedForms.forEach(({ unitType, entries, strategy }) => {
      assert.strictEqual(
        semanticDiffUnitIdentityStrategy(typedUnit(unitType, entries)),
        strategy,
        `${unitType} should select ${strategy}`,
      );
    });
  });

  test("uses legacy fallback for invalid v13 command values and forms", () => {
    const cases: Array<{
      name: string;
      unitType: TySymbol;
      entries: Array<[string, string]>;
      expected:
        | "command-text-v1"
        | "executable-file-v1"
        | "legacy-all-parameters-v1";
    }> = [
      {
        name: "te minimum",
        unitType: "j",
        entries: [["te", quoted("x")]],
        expected: "command-text-v1",
      },
      {
        name: "te maximum",
        unitType: "j",
        entries: [["te", quoted("x".repeat(1023))]],
        expected: "command-text-v1",
      },
      {
        name: "te empty",
        unitType: "j",
        entries: [["te", quoted("")]],
        expected: "legacy-all-parameters-v1",
      },
      {
        name: "te overlong",
        unitType: "j",
        entries: [["te", quoted("x".repeat(1024))]],
        expected: "legacy-all-parameters-v1",
      },
      {
        name: "te malformed string",
        unitType: "j",
        entries: [["te", '"bad#x"']],
        expected: "legacy-all-parameters-v1",
      },
      {
        name: "te unquoted",
        unitType: "j",
        entries: [["te", "echo"]],
        expected: "legacy-all-parameters-v1",
      },
      {
        name: "sc maximum",
        unitType: "pj",
        entries: [["sc", quoted("x".repeat(511))]],
        expected: "executable-file-v1",
      },
      {
        name: "sc empty",
        unitType: "pj",
        entries: [["sc", quoted("")]],
        expected: "legacy-all-parameters-v1",
      },
      {
        name: "sc overlong",
        unitType: "pj",
        entries: [["sc", quoted("x".repeat(512))]],
        expected: "legacy-all-parameters-v1",
      },
      {
        name: "sc malformed string",
        unitType: "pj",
        entries: [["sc", '"bad#x"']],
        expected: "legacy-all-parameters-v1",
      },
      {
        name: "sc unquoted",
        unitType: "pj",
        entries: [["sc", "run.exe"]],
        expected: "legacy-all-parameters-v1",
      },
      {
        name: "prm maximum",
        unitType: "qj",
        entries: [
          ["sc", quoted("queue")],
          ["prm", quoted("x".repeat(1023))],
        ],
        expected: "executable-file-v1",
      },
      {
        name: "prm empty",
        unitType: "qj",
        entries: [
          ["sc", quoted("queue")],
          ["prm", quoted("")],
        ],
        expected: "legacy-all-parameters-v1",
      },
      {
        name: "prm overlong",
        unitType: "qj",
        entries: [
          ["sc", quoted("queue")],
          ["prm", quoted("x".repeat(1024))],
        ],
        expected: "legacy-all-parameters-v1",
      },
      {
        name: "prm malformed string",
        unitType: "qj",
        entries: [
          ["sc", quoted("queue")],
          ["prm", '"bad#x"'],
        ],
        expected: "legacy-all-parameters-v1",
      },
      {
        name: "prm unquoted",
        unitType: "qj",
        entries: [
          ["sc", quoted("queue")],
          ["prm", "--safe"],
        ],
        expected: "legacy-all-parameters-v1",
      },
      {
        name: "mixed command form",
        unitType: "j",
        entries: [
          ["te", quoted("echo")],
          ["sc", quoted("run.sh")],
        ],
        expected: "legacy-all-parameters-v1",
      },
      {
        name: "duplicate executable parameter",
        unitType: "j",
        entries: [
          ["sc", quoted("run.sh")],
          ["prm", quoted("one")],
          ["prm", quoted("two")],
        ],
        expected: "legacy-all-parameters-v1",
      },
    ];

    cases.forEach(({ name, unitType, entries, expected }) => {
      assert.strictEqual(
        semanticDiffUnitIdentityStrategy(typedUnit(unitType, entries)),
        expected,
        name,
      );
    });
  });

  test("validates command limits in bytes, not JavaScript string length", () => {
    const validCommand = typedUnit("j", [["te", quoted("あ".repeat(341))]]);
    const invalidCommand = typedUnit("j", [["te", quoted("あ".repeat(342))]]);
    const validExecutable = typedUnit("pj", [["sc", quoted("あ".repeat(170))]]);
    const invalidExecutable = typedUnit("pj", [
      ["sc", quoted("あ".repeat(171))],
    ]);

    assert.strictEqual(
      semanticDiffUnitIdentityStrategy(validCommand),
      "command-text-v1",
    );
    assert.strictEqual(
      semanticDiffUnitIdentityStrategy(invalidCommand),
      "legacy-all-parameters-v1",
    );
    assert.strictEqual(
      semanticDiffUnitIdentityStrategy(validExecutable),
      "executable-file-v1",
    );
    assert.strictEqual(
      semanticDiffUnitIdentityStrategy(invalidExecutable),
      "legacy-all-parameters-v1",
    );
  });

  test("keeps command forms separate and uses file-monitor effective defaults", () => {
    const commandBefore = typedUnit("j", [["te", '"echo before"']], {
      id: "command-before",
      name: "old-command",
      absolutePath: "command-before",
    });
    const commandAfter = typedUnit("j", [["te", '"echo after"']], {
      id: "command-after",
      name: "new-command",
      absolutePath: "command-after",
    });
    const executableAfter = typedUnit("j", [["sc", '"echo before"']], {
      id: "executable-after",
      name: "new-executable",
      absolutePath: "executable-after",
    });
    const beforeFile = typedUnit("flwj", [["flwf", "watch.log"]], {
      id: "file-before",
      name: "old-file",
      absolutePath: "file-before",
    });
    const afterFile = typedUnit(
      "flwj",
      [
        ["flwf", "watch.log"],
        ["flwc", "c"],
      ],
      {
        id: "file-after",
        name: "new-file",
        absolutePath: "file-after",
      },
    );
    const commandChange = buildSemanticDiffUnitCorrespondence({
      beforeUnits: [commandBefore],
      afterUnits: [commandAfter],
      beforeUnitById: unitMap(commandBefore),
      afterUnitById: unitMap(commandAfter),
    });
    assert.deepStrictEqual(commandChange.fingerprintMatches, []);
    assert.deepStrictEqual(commandChange.removedUnits, [commandBefore]);
    assert.deepStrictEqual(commandChange.addedUnits, [commandAfter]);

    const formChange = buildSemanticDiffUnitCorrespondence({
      beforeUnits: [commandBefore],
      afterUnits: [executableAfter],
      beforeUnitById: unitMap(commandBefore),
      afterUnitById: unitMap(executableAfter),
    });
    assert.deepStrictEqual(formChange.fingerprintMatches, []);
    assert.deepStrictEqual(formChange.removedUnits, [commandBefore]);
    assert.deepStrictEqual(formChange.addedUnits, [executableAfter]);

    const defaultChange = buildSemanticDiffUnitCorrespondence({
      beforeUnits: [beforeFile],
      afterUnits: [afterFile],
      beforeUnitById: unitMap(beforeFile),
      afterUnitById: unitMap(afterFile),
    });
    assert.strictEqual(defaultChange.fingerprintMatches.length, 1);
  });

  test("treats executable script and parameter changes as identity changes", () => {
    const before = typedUnit(
      "j",
      [
        ["sc", quoted("run-before.sh")],
        ["prm", quoted("--before")],
      ],
      { id: "before", name: "before", absolutePath: "before" },
    );
    const afterScript = typedUnit(
      "j",
      [
        ["sc", quoted("run-after.sh")],
        ["prm", quoted("--before")],
      ],
      {
        id: "after-script",
        name: "after-script",
        absolutePath: "after-script",
      },
    );
    const afterParameter = typedUnit(
      "j",
      [
        ["sc", quoted("run-before.sh")],
        ["prm", quoted("--after")],
      ],
      {
        id: "after-parameter",
        name: "after-parameter",
        absolutePath: "after-parameter",
      },
    );

    const correspondenceFor = (after: AjsUnit[]) =>
      buildSemanticDiffUnitCorrespondence({
        beforeUnits: [before],
        afterUnits: after,
        beforeUnitById: unitMap(before),
        afterUnitById: unitMap(...after),
      });

    [afterScript, afterParameter].forEach((after) => {
      const result = correspondenceFor([after]);
      assert.deepStrictEqual(result.fingerprintMatches, []);
      assert.deepStrictEqual(result.removedUnits, [before]);
      assert.deepStrictEqual(result.addedUnits, [after]);
    });
  });

  test("uses selected identity fields for correspondence and preserves decisions", () => {
    const beforeCommand = typedUnit(
      "j",
      [
        ["te", '"echo stable"'],
        ["eu", "before"],
      ],
      {
        id: "before-command",
        name: "before-command",
        absolutePath: "before-command",
      },
    );
    const afterCommand = typedUnit(
      "j",
      [
        ["te", '"echo stable"'],
        ["eu", "after"],
      ],
      {
        id: "after-command",
        name: "after-command",
        absolutePath: "after-command",
      },
    );
    const beforeCandidateA = unit({
      id: "before-candidate-a",
      name: "before-candidate-a",
      absolutePath: "before-candidate-a",
    });
    const beforeCandidateB = unit({
      id: "before-candidate-b",
      name: "before-candidate-b",
      absolutePath: "before-candidate-b",
    });
    const afterCandidateA = unit({
      id: "after-candidate-a",
      name: "after-candidate-a",
      absolutePath: "after-candidate-a",
    });
    const afterCandidateB = unit({
      id: "after-candidate-b",
      name: "after-candidate-b",
      absolutePath: "after-candidate-b",
    });
    const beforeRemoved = unit({
      id: "before-removed",
      name: "before-removed",
      absolutePath: "before-removed",
      parameters: parameters({ ty: "j", sc: "echo removed" }),
    });
    const afterAdded = unit({
      id: "after-added",
      name: "after-added",
      absolutePath: "after-added",
      parameters: parameters({ ty: "j", sc: "echo added" }),
    });
    const result = buildSemanticDiffUnitCorrespondence({
      beforeUnits: [
        beforeCandidateB,
        beforeRemoved,
        beforeCommand,
        beforeCandidateA,
      ],
      afterUnits: [afterCandidateB, afterAdded, afterCommand, afterCandidateA],
      beforeUnitById: unitMap(
        beforeCandidateA,
        beforeCandidateB,
        beforeRemoved,
        beforeCommand,
      ),
      afterUnitById: unitMap(
        afterCandidateA,
        afterCandidateB,
        afterAdded,
        afterCommand,
      ),
    });

    assert.deepStrictEqual(
      result.identityDecisions.map((decision) => [
        decision.status,
        decision.rule,
      ]),
      [
        ["fingerprint-confirmed", "one-to-one-fingerprint"],
        ["candidate", "ambiguous-fingerprint"],
        ["removed", "unmatched-before"],
        ["added", "unmatched-after"],
      ],
    );
    const confirmed = result.identityDecisions[0];
    assert.strictEqual(confirmed.evidence.kind, "fingerprint");
    if (confirmed.evidence.kind === "fingerprint") {
      assert.strictEqual(confirmed.evidence.strategyId, "command-text-v1");
      assert.deepStrictEqual(confirmed.evidence.fields, [
        { key: "te", presence: "present", values: ['"echo stable"'] },
      ]);
    }
    const candidate = result.identityDecisions.find(
      (decision) => decision.status === "candidate",
    );
    assert.ok(candidate);
    assert.deepStrictEqual(
      candidate?.before.map((reference) => reference.id),
      ["before-candidate-a", "before-candidate-b"],
    );
    assert.deepStrictEqual(
      candidate?.after.map((reference) => reference.id),
      ["after-candidate-a", "after-candidate-b"],
    );
    assert.ok(
      result.identityDecisions.every((decision) =>
        decision.id.startsWith("identity:v1:"),
      ),
    );
  });

  test("emits exact, add, and remove decisions with typed evidence", () => {
    const beforeExact = typedUnit("j", [["sc", quoted("exact.sh")]], {
      id: "exact",
      name: "exact",
      absolutePath: "exact",
    });
    const afterExact = typedUnit("j", [["sc", quoted("exact.sh")]], {
      id: "exact",
      name: "exact",
      absolutePath: "exact",
    });
    const removed = typedUnit("j", [["sc", quoted("removed.sh")]], {
      id: "removed",
      name: "removed",
      absolutePath: "removed",
    });
    const added = typedUnit("j", [["sc", quoted("added.sh")]], {
      id: "added",
      name: "added",
      absolutePath: "added",
    });

    const result = buildSemanticDiffUnitCorrespondence({
      beforeUnits: [beforeExact, removed],
      afterUnits: [afterExact, added],
      beforeUnitById: unitMap(beforeExact, removed),
      afterUnitById: unitMap(afterExact, added),
    });

    assert.deepStrictEqual(
      result.identityDecisions.map((decision) => decision.status),
      ["exact", "removed", "added"],
    );
    assert.strictEqual(result.identityDecisions[0].evidence.kind, "exact-key");
    assert.strictEqual(
      result.identityDecisions[1].evidence.kind,
      "fingerprint",
    );
    assert.strictEqual(
      result.identityDecisions[2].evidence.kind,
      "fingerprint",
    );
    assert.deepStrictEqual(
      result.identityDecisions[0].before.map((ref) => ref.id),
      ["exact"],
    );
    assert.deepStrictEqual(
      result.identityDecisions[0].after.map((ref) => ref.id),
      ["exact"],
    );
  });

  test("covers event selector syntax and byte boundaries", () => {
    const cases: Array<{
      key: string;
      value: string;
      expected: "event-reception-v1" | "legacy-all-parameters-v1";
    }> = [
      {
        key: "evwid",
        value: "00000000:FFFFFFFF",
        expected: "event-reception-v1",
      },
      { key: "evwid", value: "00000000", expected: "legacy-all-parameters-v1" },
      { key: "evipa", value: "0.0.0.0", expected: "event-reception-v1" },
      {
        key: "evipa",
        value: "256.0.0.1",
        expected: "legacy-all-parameters-v1",
      },
      {
        key: "evusr",
        value: quoted("x".repeat(20)),
        expected: "event-reception-v1",
      },
      {
        key: "evusr",
        value: quoted("x".repeat(21)),
        expected: "legacy-all-parameters-v1",
      },
      {
        key: "evgrp",
        value: quoted("x".repeat(20)),
        expected: "event-reception-v1",
      },
      {
        key: "evgrp",
        value: quoted("x".repeat(21)),
        expected: "legacy-all-parameters-v1",
      },
      { key: "evhst", value: "h".repeat(255), expected: "event-reception-v1" },
      {
        key: "evhst",
        value: "h".repeat(256),
        expected: "legacy-all-parameters-v1",
      },
      {
        key: "evwms",
        value: quoted("x".repeat(1024)),
        expected: "event-reception-v1",
      },
      {
        key: "evwms",
        value: quoted("x".repeat(1025)),
        expected: "legacy-all-parameters-v1",
      },
      {
        key: "evdet",
        value: quoted("x".repeat(1024)),
        expected: "event-reception-v1",
      },
      {
        key: "evdet",
        value: quoted("x".repeat(1025)),
        expected: "legacy-all-parameters-v1",
      },
      {
        key: "evwsv",
        value: "em:al:cr:er:wr:no:in:db",
        expected: "event-reception-v1",
      },
      { key: "evwsv", value: "al:em", expected: "legacy-all-parameters-v1" },
      { key: "evuid", value: "-1", expected: "event-reception-v1" },
      { key: "evuid", value: "9999999999", expected: "event-reception-v1" },
      {
        key: "evuid",
        value: "10000000000",
        expected: "legacy-all-parameters-v1",
      },
      {
        key: "evwfr",
        value: `attr:${quoted("x")}`,
        expected: "event-reception-v1",
      },
      {
        key: "evwfr",
        value: `attr:${quoted("")}`,
        expected: "legacy-all-parameters-v1",
      },
      {
        key: "evwfr",
        value: `attr:${quoted("x".repeat(2034))}`,
        expected: "event-reception-v1",
      },
      {
        key: "evwfr",
        value: `attr:${quoted("x".repeat(2035))}`,
        expected: "legacy-all-parameters-v1",
      },
    ];

    cases.forEach(({ key, value, expected }) => {
      assert.strictEqual(
        semanticDiffUnitIdentityStrategy(typedUnit("evwj", [[key, value]])),
        expected,
        `${key}=${value.slice(0, 24)}`,
      );
    });

    assert.strictEqual(
      semanticDiffUnitIdentityStrategy(
        typedUnit("evwj", [
          ["evwid", "00000000:FFFFFFFF"],
          ["evwid", "00000000:FFFFFFFF"],
        ]),
      ),
      "legacy-all-parameters-v1",
    );
  });

  test("keeps the historical grouping key for every fallback unit type", () => {
    TySymbols.forEach((unitType) => {
      const fallbackSpecificEntries =
        unitType === "evwj" || unitType === "revwj"
          ? ([
              ["evwid", "00000000:FFFFFFFF"],
              ["evwid", "00000000:FFFFFFFF"],
            ] as Array<[string, string]>)
          : [];
      const fixture = typedUnit(
        unitType,
        [
          ...fallbackSpecificEntries,
          ["custom", "z"],
          ["custom", "a"],
          ["unit", "ignored"],
          ["el", "ignored"],
        ],
        {
          groupType: "p",
          permission: "permission",
          jp1Username: "user",
          jp1ResourceGroup: "resource",
        },
      );
      const historicalKey = [
        unitType,
        "p",
        "permission",
        "user",
        "resource",
        [
          ...fallbackSpecificEntries,
          ["custom", "z"],
          ["custom", "a"],
          ["unit", "ignored"],
          ["el", "ignored"],
          ["ty", unitType],
        ]
          .filter(([key]) => key !== "unit" && key !== "el")
          .map(([key, value]) => `${key}=${value}`)
          .sort()
          .join("|"),
      ].join("::");

      assert.strictEqual(
        semanticDiffUnitIdentityStrategy(fixture),
        "legacy-all-parameters-v1",
        `${unitType} should use fallback`,
      );
      assert.strictEqual(
        createSemanticDiffIdentityFingerprint(fixture).fingerprint,
        historicalKey,
        `${unitType} factory key changed`,
      );
      assert.strictEqual(
        semanticDiffUnitFingerprint(fixture),
        historicalKey,
        `${unitType} grouping key changed`,
      );
    });
  });

  test("retains a large repeated-candidate group without guessing", () => {
    const candidateCount = 256;
    const before = Array.from({ length: candidateCount }, (_, index) =>
      typedUnit("j", [["sc", quoted("repeated.sh")]], {
        id: `before-${index}`,
        name: `before-${index}`,
        absolutePath: `/before/repeated-${index}`,
      }),
    );
    const after = Array.from({ length: candidateCount }, (_, index) =>
      typedUnit("j", [["sc", quoted("repeated.sh")]], {
        id: `after-${index}`,
        name: `after-${index}`,
        absolutePath: `/after/repeated-${index}`,
      }),
    );
    const build = (beforeUnits: AjsUnit[], afterUnits: AjsUnit[]) =>
      buildSemanticDiffUnitCorrespondence({
        beforeUnits,
        afterUnits,
        beforeUnitById: unitMap(...beforeUnits),
        afterUnitById: unitMap(...afterUnits),
      });

    const result = build(before, after);
    assert.deepStrictEqual(result.fingerprintMatches, []);
    assert.strictEqual(result.candidates.length, 1);
    assert.strictEqual(result.candidates[0].before.length, candidateCount);
    assert.strictEqual(result.candidates[0].after.length, candidateCount);
    assert.deepStrictEqual(
      result.identityDecisions.map((decision) => decision.status),
      ["candidate"],
    );

    const reversed = build([...before].reverse(), [...after].reverse());
    assert.strictEqual(
      result.identityDecisions[0].id,
      reversed.identityDecisions[0].id,
    );
    assert.deepStrictEqual(
      result.candidates[0].before.map((item) => item.id),
      [...before]
        .sort((left, right) =>
          left.absolutePath.localeCompare(right.absolutePath),
        )
        .map((item) => item.id),
    );
    assert.deepStrictEqual(
      result.candidates[0].after.map((item) => item.id),
      [...after]
        .sort((left, right) =>
          left.absolutePath.localeCompare(right.absolutePath),
        )
        .map((item) => item.id),
    );
  });

  test("falls back to the legacy fingerprint for unsupported and malformed forms", () => {
    const unsupported = typedUnit("rc", [["cond", "and"]]);
    const malformedEvent = typedUnit("evwj", [["evwid", "not-an-event-id"]]);
    const emptyEventFilter = typedUnit("evwj", [["evwfr", 'attr:""']]);
    const duplicateFile = typedUnit("flwj", [
      ["flwf", "one.log"],
      ["flwf", "two.log"],
    ]);

    assert.strictEqual(
      semanticDiffUnitIdentityStrategy(unsupported),
      "legacy-all-parameters-v1",
    );
    assert.strictEqual(
      semanticDiffUnitIdentityStrategy(malformedEvent),
      "legacy-all-parameters-v1",
    );
    assert.strictEqual(
      semanticDiffUnitIdentityStrategy(emptyEventFilter),
      "legacy-all-parameters-v1",
    );
    assert.strictEqual(
      semanticDiffUnitIdentityStrategy(duplicateFile),
      "legacy-all-parameters-v1",
    );
    assert.strictEqual(
      createSemanticDiffIdentityFingerprint(unsupported).fingerprint,
      createSemanticDiffIdentityFingerprint({
        ...unsupported,
        parameters: [...unsupported.parameters].reverse(),
      }).fingerprint,
    );
    assert.strictEqual(
      semanticDiffUnitFingerprint(unsupported),
      [
        unsupported.unitType,
        unsupported.groupType ?? "",
        unsupported.permission ?? "",
        unsupported.jp1Username ?? "",
        unsupported.jp1ResourceGroup ?? "",
        "cond=and|ty=rc",
      ].join("::"),
    );
  });
});
