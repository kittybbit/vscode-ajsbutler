import * as assert from "assert";
import * as vscode from "vscode";
import type { SemanticDiffOutputContext } from "../../application/semantic-diff/semanticDiffDto";
import type { SemanticDiffSourceCaptureEntry } from "../../presentation/vscode/semantic-diff/source/semanticDiffExplorerSourceTypes";
import {
  createSemanticDiffFlowSourceHost,
  type SemanticDiffFlowSourceHostDeps,
} from "../../presentation/vscode/semantic-diff/flow/semanticDiffFlowSourceHost";
import type {
  SemanticDiffFlowPanel,
  SemanticDiffFlowSourceSnapshot,
} from "../../presentation/vscode/semantic-diff/flow/semanticDiffExplorerFlow";

const context = {} as SemanticDiffOutputContext;

const source = (
  side: "before" | "after",
  overrides: Partial<{
    sourceHandleId: string;
    version: number | null;
    text: string;
    uri: vscode.Uri;
  }> = {},
) => ({
  side,
  sourceHandleId: overrides.sourceHandleId ?? `${side}-handle`,
  version: overrides.version === undefined ? 1 : overrides.version,
  text: overrides.text ?? `${side} text`,
  uri: overrides.uri ?? vscode.Uri.parse(`file:///${side}.ajs`),
});

const captureEntry = (
  before = source("before"),
  after = source("after"),
): SemanticDiffSourceCaptureEntry =>
  ({
    binding: {} as never,
    sources: { before, after },
    release: () => undefined,
  }) as unknown as SemanticDiffSourceCaptureEntry;

const textDocument = (
  uri: vscode.Uri,
  version: number,
  text: string,
): vscode.TextDocument =>
  ({ uri, version, getText: () => text }) as vscode.TextDocument;

const panel = {} as SemanticDiffFlowPanel;

const createHarness = (
  initialCapture: SemanticDiffSourceCaptureEntry | undefined = captureEntry(),
  initialDocuments: readonly vscode.TextDocument[] = [],
  openFlow?: SemanticDiffFlowSourceHostDeps["openFlow"],
) => {
  let currentCapture = initialCapture;
  let documents = initialDocuments;
  const opened: Array<Readonly<{ uri: vscode.Uri; targetUnitId: string }>> = [];
  const host = createSemanticDiffFlowSourceHost({
    sourceCapture: () => currentCapture,
    getOpenTextDocuments: () => documents,
    openFlow: (uri, targetUnitId) => {
      opened.push({ uri, targetUnitId });
      return openFlow ? openFlow(uri, targetUnitId) : Promise.resolve(panel);
    },
  });
  return {
    host,
    opened,
    setCapture: (entry: SemanticDiffSourceCaptureEntry | undefined) => {
      currentCapture = entry;
    },
    setDocuments: (next: readonly vscode.TextDocument[]) => {
      documents = next;
    },
  };
};

const snapshotFor = (
  host: ReturnType<typeof createSemanticDiffFlowSourceHost>,
  side: "before" | "after" = "before",
): SemanticDiffFlowSourceSnapshot => {
  const snapshot = host.getSourceSnapshot?.(side, context);
  assert.ok(snapshot);
  if (!snapshot) throw new Error("Expected a captured source snapshot.");
  return snapshot;
};

suite("Semantic diff flow source host", () => {
  test("looks up both captured sides and accepts fresh open documents", () => {
    const entry = captureEntry(
      source("before"),
      source("after", { version: null }),
    );
    const documents = [
      textDocument(entry.sources.before.uri, 1, entry.sources.before.text),
      textDocument(entry.sources.after.uri, 9, entry.sources.after.text),
    ];
    const { host } = createHarness(entry, documents);
    const before = snapshotFor(host, "before");
    const after = snapshotFor(host, "after");

    assert.deepStrictEqual(before, {
      sourceHandleId: "before-handle",
      version: 1,
      text: "before text",
      uri: "file:///before.ajs",
    });
    assert.deepStrictEqual(after, {
      sourceHandleId: "after-handle",
      version: null,
      text: "after text",
      uri: "file:///after.ajs",
    });
    assert.strictEqual(host.isSourceCurrent?.("before", context, before), true);
    assert.strictEqual(host.isSourceCurrent?.("after", context, after), true);
  });

  test("rejects a replaced source handle or URI", () => {
    const entry = captureEntry();
    const document = textDocument(
      entry.sources.before.uri,
      1,
      entry.sources.before.text,
    );
    const harness = createHarness(entry, [document]);
    const snapshot = snapshotFor(harness.host);

    harness.setCapture(
      captureEntry(source("before", { sourceHandleId: "new-handle" })),
    );
    assert.strictEqual(
      harness.host.isSourceCurrent?.("before", context, snapshot),
      false,
    );

    harness.setCapture(
      captureEntry(
        source("before", { uri: vscode.Uri.parse("file:///replacement.ajs") }),
      ),
    );
    assert.strictEqual(
      harness.host.isSourceCurrent?.("before", context, snapshot),
      false,
    );
  });

  test("requires captured and open text plus each non-null version to match", () => {
    const entry = captureEntry();
    const document = textDocument(
      entry.sources.before.uri,
      1,
      entry.sources.before.text,
    );
    const harness = createHarness(entry, [document]);
    const snapshot = snapshotFor(harness.host);

    assert.strictEqual(
      harness.host.isSourceCurrent?.("before", context, {
        ...snapshot,
        text: "different retained text",
      }),
      false,
    );
    assert.strictEqual(
      harness.host.isSourceCurrent?.("before", context, {
        ...snapshot,
        version: 2,
      }),
      false,
    );

    harness.setDocuments([
      textDocument(entry.sources.before.uri, 1, "different open text"),
    ]);
    assert.strictEqual(
      harness.host.isSourceCurrent?.("before", context, snapshot),
      false,
    );
    harness.setDocuments([
      textDocument(entry.sources.before.uri, 2, entry.sources.before.text),
    ]);
    assert.strictEqual(
      harness.host.isSourceCurrent?.("before", context, snapshot),
      false,
    );

    harness.setCapture(
      captureEntry(source("before", { text: "different retained text" })),
    );
    assert.strictEqual(
      harness.host.isSourceCurrent?.("before", context, snapshot),
      false,
    );
  });

  test("treats document changes between freshness checks as stale", () => {
    const entry = captureEntry();
    const harness = createHarness(entry, [
      textDocument(entry.sources.before.uri, 1, entry.sources.before.text),
    ]);
    const snapshot = snapshotFor(harness.host);

    assert.strictEqual(
      harness.host.isSourceCurrent?.("before", context, snapshot),
      true,
    );
    harness.setDocuments([
      textDocument(entry.sources.before.uri, 2, "edited after capture"),
    ]);
    assert.strictEqual(
      harness.host.isSourceCurrent?.("before", context, snapshot),
      false,
    );
  });

  test("returns unavailable when the capture or matching open document is missing", () => {
    const entry = captureEntry();
    const harness = createHarness(entry, []);
    const snapshot = snapshotFor(harness.host);

    assert.strictEqual(
      harness.host.isSourceCurrent?.("before", context, snapshot),
      false,
    );
    harness.setCapture(undefined);
    assert.strictEqual(
      harness.host.getSourceSnapshot?.("before", context),
      undefined,
    );
    assert.strictEqual(
      harness.host.isSourceCurrent?.("before", context, snapshot),
      false,
    );
  });

  test("keeps snapshot lookup available without a configured flow bridge", async () => {
    const entry = captureEntry();
    const host = createSemanticDiffFlowSourceHost({
      sourceCapture: () => entry,
      getOpenTextDocuments: () => [],
      openFlow: async () => {
        throw new Error("Flow viewer is not registered.");
      },
    });

    assert.strictEqual(
      snapshotFor(host).uri,
      entry.sources.before.uri.toString(),
    );
    await assert.rejects(host.open("before", "/root/job", context), {
      message: "Flow viewer is not registered.",
    });
  });

  test("opens the captured URI with the requested target unit", async () => {
    const entry = captureEntry();
    const harness = createHarness(entry);

    assert.strictEqual(
      await harness.host.open("after", "/root/job", context),
      panel,
    );
    assert.deepStrictEqual(harness.opened, [
      { uri: entry.sources.after.uri, targetUnitId: "/root/job" },
    ]);
  });

  test("keeps the missing-source error and propagates flow-open failures", async () => {
    const missing = createHarness();
    missing.setCapture(undefined);
    await assert.rejects(missing.host.open("before", "/root/job", context), {
      message: "Semantic Diff source is unavailable.",
    });
    assert.deepStrictEqual(missing.opened, []);

    const failure = new Error("Flow viewer could not be revealed.");
    const entry = captureEntry();
    const failedOpen = createHarness(entry, [], async () => {
      throw failure;
    });
    await assert.rejects(
      failedOpen.host.open("before", "/root/job", context),
      failure,
    );
  });
});
