import * as assert from "assert";
import {
  createSemanticDiffCaptureScopeIdAllocator,
  createSemanticDiffSourceHandleIdAllocator,
  createSemanticDiffSourceIndexIdAllocator,
  lookupSemanticDiffSourceIndex,
  SemanticDiffSourceIndexRegistry,
  type SemanticDiffSourceIndex,
  validateSemanticDiffSourceIndex,
} from "../../application/parsing/AjsParserWithSourceIndexPort";
import {
  beginSemanticDiffSourceCapture,
  isSemanticDiffSourceCaptureBindingActive,
  lookupSemanticDiffSourceCaptureBinding,
  registerSemanticDiffSourceCaptureScope,
  SemanticDiffSourceCaptureError,
} from "../../application/semantic-diff/semanticDiffSourceCapture";
import type { SemanticDiffOutputContext } from "../../application/semantic-diff/semanticDiffDto";

const range = (
  startLine: number,
  startCharacter: number,
  endLine = startLine,
  endCharacter = startCharacter + 1,
) => ({
  start: { line: startLine, character: startCharacter },
  end: { line: endLine, character: endCharacter },
});

const context = {} as SemanticDiffOutputContext;
const scopeIds = createSemanticDiffCaptureScopeIdAllocator();

const index = (
  id: ReturnType<typeof createSemanticDiffSourceIndexIdAllocator>,
  unitEntries: SemanticDiffSourceIndex["unitEntries"],
): SemanticDiffSourceIndex => ({
  sourceIndexId: id(),
  unitEntries,
});

suite("Semantic Diff source capture and index contracts", () => {
  test("captures exactly before then after and binds the same context", () => {
    const ids = createSemanticDiffSourceIndexIdAllocator();
    const handleIds = createSemanticDiffSourceHandleIdAllocator();
    const calls: string[] = [];
    const beforeIndex = index(ids, []);
    const afterIndex = index(ids, []);
    const capture = beginSemanticDiffSourceCapture(
      {
        before: {
          side: "before",
          sourceHandleId: handleIds(),
          text: "before",
          version: 1,
        },
        after: {
          side: "after",
          sourceHandleId: handleIds(),
          text: "after",
          version: 2,
        },
      },
      {
        parseWithSourceIndex: (content) => {
          calls.push(content);
          return content === "before"
            ? {
                ok: true,
                document: { rootUnits: [], warnings: [] },
                sourceIndex: beforeIndex,
              }
            : {
                ok: true,
                document: { rootUnits: [], warnings: [] },
                sourceIndex: afterIndex,
              };
        },
      },
      scopeIds,
    );

    assert.deepStrictEqual(capture.parser.parse("before"), {
      ok: true,
      document: { rootUnits: [], warnings: [] },
    });
    assert.deepStrictEqual(capture.parser.parse("after"), {
      ok: true,
      document: { rootUnits: [], warnings: [] },
    });
    const bound = capture.bind(context);
    assert.strictEqual(bound.ok, true);
    if (!bound.ok) throw new Error("Expected capture binding.");
    assert.strictEqual(bound.context, context);
    assert.notStrictEqual(bound.before.sourceIndex, beforeIndex);
    assert.notStrictEqual(bound.after.sourceIndex, afterIndex);
    assert.deepStrictEqual(bound.before.sourceIndex, beforeIndex);
    assert.deepStrictEqual(bound.after.sourceIndex, afterIndex);
    assert.ok(Object.isFrozen(bound));
    assert.ok(Object.isFrozen(bound.before));
    assert.ok(Object.isFrozen(bound.before.sourceIndex));
    registerSemanticDiffSourceCaptureScope(bound);
    assert.deepStrictEqual(calls, ["before", "after"]);
    assert.deepStrictEqual(capture.bind(context), {
      ok: false,
      code: "capture-already-bound",
    });
  });

  test("continues to the second fixed-order parse after a parser error", () => {
    const handleIds = createSemanticDiffSourceHandleIdAllocator();
    let calls = 0;
    const capture = beginSemanticDiffSourceCapture(
      {
        before: {
          side: "before",
          sourceHandleId: handleIds(),
          text: "bad",
          version: null,
        },
        after: {
          side: "after",
          sourceHandleId: handleIds(),
          text: "good",
          version: null,
        },
      },
      {
        parseWithSourceIndex: () => {
          calls += 1;
          return calls === 1
            ? { ok: false, errors: [{ line: 1, column: 0, message: "bad" }] }
            : {
                ok: true,
                document: { rootUnits: [], warnings: [] },
                sourceIndex: index(
                  createSemanticDiffSourceIndexIdAllocator(),
                  [],
                ),
              };
        },
      },
      scopeIds,
    );
    assert.strictEqual(capture.parser.parse("bad").ok, false);
    assert.strictEqual(capture.parser.parse("good").ok, true);
    assert.deepStrictEqual(capture.bind(context), {
      ok: false,
      code: "capture-parser-failed",
    });
    assert.strictEqual(calls, 2);
  });

  test("rejects wrong order, extra, and post-release calls without invoking parser", () => {
    const handleIds = createSemanticDiffSourceHandleIdAllocator();
    let calls = 0;
    const capture = beginSemanticDiffSourceCapture(
      {
        before: {
          side: "before",
          sourceHandleId: handleIds(),
          text: "before",
          version: null,
        },
        after: {
          side: "after",
          sourceHandleId: handleIds(),
          text: "after",
          version: null,
        },
      },
      {
        parseWithSourceIndex: () => {
          calls += 1;
          return {
            ok: true,
            document: { rootUnits: [], warnings: [] },
            sourceIndex: index(createSemanticDiffSourceIndexIdAllocator(), []),
          };
        },
      },
      scopeIds,
    );
    assert.throws(
      () => capture.parser.parse("after"),
      (error: unknown) =>
        error instanceof SemanticDiffSourceCaptureError &&
        error.code === "capture-order-invalid",
    );
    assert.strictEqual(calls, 0);
    capture.parser.parse("before");
    capture.parser.parse("after");
    assert.throws(() => capture.parser.parse("after"), /capture-extra-parse/);
    assert.strictEqual(calls, 2);
    capture.release();
    capture.release();
    assert.throws(() => capture.parser.parse("before"), /capture-released/);
    assert.strictEqual(calls, 2);
  });

  test("looks up duplicate parameters and rejects ambiguous units", () => {
    const id = createSemanticDiffSourceIndexIdAllocator()();
    const duplicateUnit = {
      unitId: "/root/job",
      headerRange: range(0, 0, 0, 10),
      nameRange: range(0, 5),
      parameterOccurrences: [
        { parameterKey: "ty", occurrenceOrdinal: 0, range: range(1, 2) },
        { parameterKey: "ty", occurrenceOrdinal: 1, range: range(2, 2) },
      ],
    };
    const sourceIndex = {
      sourceIndexId: id,
      unitEntries: [duplicateUnit, duplicateUnit],
    } satisfies SemanticDiffSourceIndex;
    assert.deepStrictEqual(
      lookupSemanticDiffSourceIndex(sourceIndex, {
        sourceIndexId: id,
        unitId: "/root/job",
        targetKind: "unit",
      }),
      { code: "unit-missing" },
    );
    const unique = { ...sourceIndex, unitEntries: [duplicateUnit] };
    const result = lookupSemanticDiffSourceIndex(unique, {
      sourceIndexId: id,
      unitId: "/root/job",
      targetKind: "attribute",
      parameterKey: "ty",
    });
    assert.ok("primaryRange" in result);
    if ("primaryRange" in result) {
      assert.deepStrictEqual(result.occurrences, [range(1, 2), range(2, 2)]);
    }
    const registry = new SemanticDiffSourceIndexRegistry();
    registry.register(unique);
    assert.deepStrictEqual(
      registry.lookup({
        sourceIndexId: id,
        unitId: "/root/job",
        targetKind: "unit",
      }),
      { primaryRange: duplicateUnit.nameRange, occurrences: [] },
    );
    registry.unregister(id);
    assert.deepStrictEqual(
      registry.lookup({
        sourceIndexId: id,
        unitId: "/root/job",
        targetKind: "unit",
      }),
      { code: "expired-source-index" },
    );
  });

  test("keeps lookup and index validation closed", () => {
    const id = createSemanticDiffSourceIndexIdAllocator()();
    const validUnit = {
      unitId: "/root",
      headerRange: range(0, 0, 0, 10),
      nameRange: range(0, 5),
      parameterOccurrences: [
        { parameterKey: "ty", occurrenceOrdinal: 0, range: range(1, 2) },
      ],
    };
    const valid = { sourceIndexId: id, unitEntries: [validUnit] };
    assert.strictEqual(validateSemanticDiffSourceIndex(valid, id), true);
    assert.deepStrictEqual(
      lookupSemanticDiffSourceIndex(valid, {
        sourceIndexId: id,
        unitId: "/root",
        targetKind: "attribute",
      }),
      { code: "parameter-key-missing" },
    );
    assert.strictEqual(
      validateSemanticDiffSourceIndex(
        {
          sourceIndexId: id,
          unitEntries: [
            {
              ...validUnit,
              parameterOccurrences: [
                {
                  parameterKey: "ty",
                  occurrenceOrdinal: 1,
                  range: range(1, 2),
                },
              ],
            },
          ],
        },
        id,
      ),
      false,
    );
    assert.strictEqual(
      validateSemanticDiffSourceIndex(
        {
          sourceIndexId: id,
          unitEntries: [
            {
              ...validUnit,
              headerRange: {
                start: { line: 2, character: 0 },
                end: { line: 1, character: 0 },
              },
            },
          ],
        },
        id,
      ),
      false,
    );
  });

  test("rejects malformed, foreign, and unregistered indexes before binding", () => {
    const handleIds = createSemanticDiffSourceHandleIdAllocator();
    const indexIds = createSemanticDiffSourceIndexIdAllocator();
    const validAfter = index(indexIds, []);
    const capture = beginSemanticDiffSourceCapture(
      {
        before: {
          side: "before",
          sourceHandleId: handleIds(),
          text: "before",
          version: null,
        },
        after: {
          side: "after",
          sourceHandleId: handleIds(),
          text: "after",
          version: null,
        },
      },
      {
        parseWithSourceIndex: (content) =>
          content === "before"
            ? {
                ok: true,
                document: { rootUnits: [], warnings: [] },
                sourceIndex: {
                  sourceIndexId: indexIds(),
                  unitEntries: [],
                  unexpected: true,
                } as never,
              }
            : {
                ok: true,
                document: { rootUnits: [], warnings: [] },
                sourceIndex: validAfter,
              },
      },
      scopeIds,
    );
    capture.parser.parse("before");
    capture.parser.parse("after");
    assert.deepStrictEqual(capture.bind(context), {
      ok: false,
      code: "capture-incomplete",
    });

    const first = beginSemanticDiffSourceCapture(
      {
        before: {
          side: "before",
          sourceHandleId: handleIds(),
          text: "first-before",
          version: null,
        },
        after: {
          side: "after",
          sourceHandleId: handleIds(),
          text: "first-after",
          version: null,
        },
      },
      {
        parseWithSourceIndex: (content) => ({
          ok: true,
          document: { rootUnits: [], warnings: [] },
          sourceIndex: index(indexIds, [
            {
              unitId: content,
              headerRange: range(0, 0),
              nameRange: null,
              parameterOccurrences: [],
            },
          ]),
        }),
      },
      scopeIds,
    );
    first.parser.parse("first-before");
    first.parser.parse("first-after");
    const firstBinding = first.bind(context);
    if (!firstBinding.ok) throw new Error("Expected first binding.");
    registerSemanticDiffSourceCaptureScope(firstBinding);

    const second = beginSemanticDiffSourceCapture(
      {
        before: {
          side: "before",
          sourceHandleId: handleIds(),
          text: "second-before",
          version: null,
        },
        after: {
          side: "after",
          sourceHandleId: handleIds(),
          text: "second-after",
          version: null,
        },
      },
      {
        parseWithSourceIndex: (content) => ({
          ok: true,
          document: { rootUnits: [], warnings: [] },
          sourceIndex: index(indexIds, [
            {
              unitId: content,
              headerRange: range(0, 0),
              nameRange: null,
              parameterOccurrences: [],
            },
          ]),
        }),
      },
      scopeIds,
    );
    second.parser.parse("second-before");
    second.parser.parse("second-after");
    const secondBinding = second.bind(context);
    if (!secondBinding.ok) throw new Error("Expected second binding.");
    registerSemanticDiffSourceCaptureScope(secondBinding);
    const foreignLookup = lookupSemanticDiffSourceCaptureBinding(
      firstBinding,
      "before",
      {
        sourceIndexId: secondBinding.before.sourceIndex.sourceIndexId,
        unitId: "second-before",
        targetKind: "unit",
      },
    );
    assert.deepStrictEqual(foreignLookup, { code: "expired-source-index" });
    assert.deepStrictEqual(
      lookupSemanticDiffSourceCaptureBinding(firstBinding, "before", null),
      { code: "expired-source-index" },
    );
    assert.ok(isSemanticDiffSourceCaptureBindingActive(firstBinding));
    first.release();
    assert.strictEqual(
      isSemanticDiffSourceCaptureBindingActive(firstBinding),
      false,
    );
    assert.deepStrictEqual(
      lookupSemanticDiffSourceCaptureBinding(firstBinding, "before", {
        sourceIndexId: firstBinding.before.sourceIndex.sourceIndexId,
        unitId: "first-before",
        targetKind: "unit",
      }),
      { code: "expired-source-index" },
    );
  });

  test("detaches and freezes retained source index data", () => {
    const indexIds = createSemanticDiffSourceIndexIdAllocator();
    const handleIds = createSemanticDiffSourceHandleIdAllocator();
    const sourceIndex = index(indexIds, [
      {
        unitId: "/root/job",
        headerRange: range(0, 0, 0, 4),
        nameRange: null,
        parameterOccurrences: [
          { parameterKey: "ty", occurrenceOrdinal: 0, range: range(1, 0) },
        ],
      },
    ]);
    const capture = beginSemanticDiffSourceCapture(
      {
        before: {
          side: "before",
          sourceHandleId: handleIds(),
          text: "before",
          version: 1,
        },
        after: {
          side: "after",
          sourceHandleId: handleIds(),
          text: "after",
          version: 2,
        },
      },
      {
        parseWithSourceIndex: (content) => ({
          ok: true,
          document: { rootUnits: [], warnings: [] },
          sourceIndex:
            content === "before"
              ? sourceIndex
              : { ...sourceIndex, sourceIndexId: indexIds() },
        }),
      },
      scopeIds,
    );
    capture.parser.parse("before");
    capture.parser.parse("after");
    const beforeText = sourceIndex.unitEntries[0]!.unitId;
    const binding = capture.bind(context);
    if (!binding.ok) throw new Error("Expected source binding.");
    (sourceIndex.unitEntries[0] as { unitId: string }).unitId = "mutated";
    (sourceIndex.unitEntries[0]!.headerRange.start as { line: number }).line =
      42;
    assert.strictEqual(
      binding.before.sourceIndex.unitEntries[0]!.unitId,
      beforeText,
    );
    assert.strictEqual(
      binding.before.sourceIndex.unitEntries[0]!.headerRange.start.line,
      0,
    );
    assert.ok(Object.isFrozen(binding.before.sourceIndex.unitEntries[0]));
    assert.ok(
      Object.isFrozen(
        binding.before.sourceIndex.unitEntries[0]!.headerRange.start,
      ),
    );
  });
});
