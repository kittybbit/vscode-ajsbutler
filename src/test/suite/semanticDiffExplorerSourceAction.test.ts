import * as assert from "assert";
import * as vscode from "vscode";
import { AntlrAjsParser } from "../../infrastructure/parser/AntlrAjsParser";
import {
  createSemanticDiffCaptureScopeIdAllocator,
  createSemanticDiffSourceHandleIdAllocator,
  createSemanticDiffSourceIndexIdAllocator,
  type AjsParserWithSourceIndexPort,
  type SemanticDiffSourceIndex,
} from "../../application/parsing/AjsParserWithSourceIndexPort";
import {
  beginSemanticDiffSourceCapture,
  registerSemanticDiffSourceCaptureScope,
} from "../../application/semantic-diff/semanticDiffSourceCapture";
import type { SemanticDiffOutputContext } from "../../application/semantic-diff/semanticDiffDto";
import {
  executeSemanticDiffExplorerSourceAction,
  type SemanticDiffSourceActionDeps,
} from "../../presentation/vscode/semantic-diff/source/semanticDiffExplorerSourceAction";
import type { SemanticDiffSourceCaptureEntry } from "../../presentation/vscode/semantic-diff/panel/semanticDiffExplorerRegistry";

type SourceActionTestDeps = SemanticDiffSourceActionDeps & {
  readonly parserCalls: number;
  readonly revealCount: number;
  readonly revealedRanges: readonly vscode.Range[];
};

const context = {} as SemanticDiffOutputContext;

const sourceIndex = (
  id: ReturnType<typeof createSemanticDiffSourceIndexIdAllocator>,
): SemanticDiffSourceIndex => ({
  sourceIndexId: id(),
  unitEntries: [
    {
      unitId: "/root",
      headerRange: {
        start: { line: 0, character: 0 },
        end: { line: 0, character: 20 },
      },
      nameRange: {
        start: { line: 0, character: 5 },
        end: { line: 0, character: 9 },
      },
      parameterOccurrences: [],
    },
  ],
});

const createSourceActionDeps = (
  text: () => string,
  onShow?: () => void,
  parsedSource?: {
    readonly text: string;
    readonly parser: AjsParserWithSourceIndexPort;
  },
): SourceActionTestDeps => {
  const indexIds = createSemanticDiffSourceIndexIdAllocator();
  const handleIds = createSemanticDiffSourceHandleIdAllocator();
  let parserCalls = 0;
  const enrichedParser: AjsParserWithSourceIndexPort = {
    parseWithSourceIndex: (content) => {
      parserCalls += 1;
      if (parsedSource)
        return parsedSource.parser.parseWithSourceIndex(content);
      return {
        ok: true,
        document: { rootUnits: [], warnings: [] },
        sourceIndex: sourceIndex(indexIds),
      };
    },
  };
  const beforeText = parsedSource?.text ?? "before";
  const afterText = parsedSource?.text ?? "after";
  const beforeUri = vscode.Uri.parse("untitled:before.ajs");
  const capture = beginSemanticDiffSourceCapture(
    {
      before: {
        side: "before",
        sourceHandleId: handleIds(),
        text: beforeText,
        version: null,
      },
      after: {
        side: "after",
        sourceHandleId: handleIds(),
        text: afterText,
        version: null,
      },
    },
    enrichedParser,
    createSemanticDiffCaptureScopeIdAllocator(),
  );
  capture.parser.parse(beforeText);
  capture.parser.parse(afterText);
  const binding = capture.bind(context);
  if (!binding.ok) throw new Error("Expected a complete source capture.");
  registerSemanticDiffSourceCaptureScope(binding);
  const document = {
    uri: beforeUri,
    version: 1,
    getText: text,
  } as unknown as vscode.TextDocument;
  let revealCount = 0;
  const revealedRanges: vscode.Range[] = [];
  const entry: SemanticDiffSourceCaptureEntry = {
    binding,
    sources: {
      before: {
        side: "before",
        sourceHandleId: binding.before.sourceHandleId,
        text: beforeText,
        version: null,
        uri: beforeUri,
      },
      after: {
        side: "after",
        sourceHandleId: binding.after.sourceHandleId,
        text: afterText,
        version: null,
        uri: vscode.Uri.parse("untitled:after.ajs"),
      },
    },
    release: capture.release,
  };
  return {
    sourceCapture: entry,
    openTextDocument: async () => document,
    showTextDocument: async () => {
      onShow?.();
      return {
        document,
        revealRange: (range: vscode.Range) => {
          revealCount += 1;
          revealedRanges.push(range);
        },
      } as unknown as vscode.TextEditor;
    },
    isCurrent: () => true,
    get parserCalls() {
      return parserCalls;
    },
    get revealCount() {
      return revealCount;
    },
    get revealedRanges() {
      return revealedRanges;
    },
  };
};

suite("Semantic Diff Explorer source actions", () => {
  test("reveals parsed unit-name and parameter UTF-16 spans after supplementary text", async () => {
    const content =
      "unit=😀root,,jp1admin,;{ty=g;cm=😀🧭;unit=次🚀,,jp1admin,;{ty=j;cm=😀;jd=cod;}}";
    const parser = new AntlrAjsParser({
      sourceIndexIdAllocator: createSemanticDiffSourceIndexIdAllocator(),
    });
    const deps = createSourceActionDeps(() => content, undefined, {
      text: content,
      parser,
    });
    try {
      for (const target of [
        { kind: "unit" as const, key: null, token: "次🚀" },
        { kind: "attribute" as const, key: "jd", token: "jd" },
      ]) {
        const result = await executeSemanticDiffExplorerSourceAction(
          {
            side: "before",
            targetId: "/😀root/次🚀",
            targetKind: target.kind,
            parameterKey: target.key,
          },
          deps,
        );
        assert.strictEqual(result.ok, true);
        if (!result.ok)
          throw new Error("Expected parsed source reveal success.");
        const start = content.indexOf(target.token);
        const expected = new vscode.Range(
          0,
          start,
          0,
          start + target.token.length,
        );
        assert.deepStrictEqual(result.range, expected);
        assert.deepStrictEqual(deps.revealedRanges.at(-1), expected);
        assert.strictEqual(
          content.slice(
            result.range.start.character,
            result.range.end.character,
          ),
          target.token,
        );
      }
      assert.strictEqual(deps.parserCalls, 2);
      assert.strictEqual(deps.revealCount, 2);
    } finally {
      deps.sourceCapture.release();
    }
  });

  test("reveals the retained exact range without parsing again", async () => {
    const deps = createSourceActionDeps(() => "before");
    const result = await executeSemanticDiffExplorerSourceAction(
      {
        side: "before",
        targetId: "/root",
        targetKind: "unit",
        parameterKey: null,
      },
      deps,
    );
    assert.strictEqual(result.ok, true);
    if (!result.ok) throw new Error("Expected source reveal success.");
    assert.deepStrictEqual(result.range.start, new vscode.Position(0, 5));
    assert.deepStrictEqual(result.range.end, new vscode.Position(0, 9));
    assert.strictEqual(deps.parserCalls, 2);
    assert.strictEqual(deps.revealCount, 1);
  });

  test("fails closed when the decoded source has changed", async () => {
    let showCount = 0;
    const deps = createSourceActionDeps(
      () => "changed",
      () => {
        showCount += 1;
      },
    );
    const result = await executeSemanticDiffExplorerSourceAction(
      {
        side: "before",
        targetId: "/root",
        targetKind: "unit",
        parameterKey: null,
      },
      deps,
    );
    assert.deepStrictEqual(result, { ok: false, code: "stale-source" });
    assert.strictEqual(showCount, 0);
    assert.strictEqual(deps.revealCount, 0);
  });

  test("revalidates immediately before reveal", async () => {
    let currentText = "before";
    const deps = createSourceActionDeps(
      () => currentText,
      () => {
        currentText = "changed";
      },
    );
    const result = await executeSemanticDiffExplorerSourceAction(
      {
        side: "before",
        targetId: "/root",
        targetKind: "unit",
        parameterKey: null,
      },
      deps,
    );
    assert.deepStrictEqual(result, { ok: false, code: "stale-source" });
    assert.strictEqual(deps.revealCount, 0);
  });

  test("fails closed after the capture owner releases directly", async () => {
    const deps = createSourceActionDeps(() => "before");
    deps.sourceCapture.release();
    const result = await executeSemanticDiffExplorerSourceAction(
      {
        side: "before",
        targetId: "/root",
        targetKind: "unit",
        parameterKey: null,
      },
      deps,
    );
    assert.deepStrictEqual(result, { ok: false, code: "stale-source" });
    assert.strictEqual(deps.revealCount, 0);
  });
});
