import * as assert from "assert";
import {
  inspectObjectType,
  inspectPath,
  objectReasonForMode,
  readContent,
  readReasonForError,
  validObjectDetails,
  validObjectType,
  validateContent,
  type ReadContentContext,
} from "../../infrastructure/git/VscodeGitHeadObjectPipeline";
import type {
  GitRepositoryWithCapabilities,
  ReadContext,
  SourcePath,
} from "../../infrastructure/git/VscodeGitHeadApiResolution";
import * as vscode from "vscode";

const rootUri = vscode.Uri.parse("file:///workspace/project");
const activeUri = vscode.Uri.parse("file:///workspace/project/definition.ajs");
const sourcePath: SourcePath = {
  relativePath: "definition.ajs",
  absolutePath: activeUri.fsPath,
};

const unknownPath = (): Error & { gitErrorCode: string } =>
  Object.assign(new Error("unknown path"), { gitErrorCode: "UnknownPath" });

const repository = (
  overrides: Partial<GitRepositoryWithCapabilities> = {},
): GitRepositoryWithCapabilities => ({
  rootUri,
  state: { HEAD: { commit: "head-commit" } },
  getObjectDetails: async () => ({ mode: "100644", object: "object-1" }),
  detectObjectType: async () => ({ mimetype: "text/plain" }),
  show: async () => "head-content",
  ...overrides,
});

const context = (
  repo: GitRepositoryWithCapabilities = repository(),
): ReadContext => ({
  repository: repo,
  rootUri,
  state: repo.state!,
  documentUri: activeUri,
  headCommit: "head-commit",
});

suite("Git HEAD object pipeline seam", () => {
  test("validates object details and provider object type shapes", () => {
    assert.deepStrictEqual(
      validObjectDetails({ mode: "100644", object: "abc" }),
      {
        mode: "100644",
        object: "abc",
      },
    );
    assert.strictEqual(
      validObjectDetails({ mode: "", object: "abc" }),
      undefined,
    );
    assert.strictEqual(validObjectDetails(undefined), undefined);
    assert.deepStrictEqual(validObjectType({ mimetype: "text/plain" }), {
      mimetype: "text/plain",
    });
    assert.deepStrictEqual(
      validObjectType({ mimetype: "text/plain", encoding: "utf16le" }),
      { mimetype: "text/plain", encoding: "utf16le" },
    );
    assert.strictEqual(validObjectType({ encoding: "utf8" }), undefined);
  });

  test("guards modes, MIME types, and provider-advertised encodings", async () => {
    assert.strictEqual(objectReasonForMode("160000"), "submodule");
    assert.strictEqual(objectReasonForMode("040000"), "binary");
    assert.strictEqual(objectReasonForMode("100644"), undefined);
    assert.deepStrictEqual(
      await inspectObjectType(
        repository({
          detectObjectType: async () => ({ mimetype: "image/png" }),
        }),
        "binary-object",
      ),
      { kind: "unavailable", reason: "binary" },
    );
    assert.deepStrictEqual(
      await inspectObjectType(
        repository({
          detectObjectType: async () => ({
            mimetype: "text/plain",
            encoding: "shift_jis",
          }),
        }),
        "encoded-object",
      ),
      { kind: "unavailable", reason: "unsupported-encoding" },
    );
    assert.deepStrictEqual(
      await inspectObjectType(
        repository({ detectObjectType: async () => ({}) }),
        "missing-type",
      ),
      { kind: "unavailable", reason: "read-failed" },
    );
  });

  test("classifies object lookup failures without leaking host errors", async () => {
    assert.deepStrictEqual(await inspectPath(context(), sourcePath), {
      kind: "ready",
      path: sourcePath,
      objectDetails: { mode: "100644", object: "object-1" },
    });
    assert.deepStrictEqual(
      await inspectPath(
        context(
          repository({
            getObjectDetails: async () => {
              throw unknownPath();
            },
          }),
        ),
        sourcePath,
      ),
      { kind: "unavailable", reason: "head-source-missing" },
    );
    assert.deepStrictEqual(
      await inspectPath(
        context(
          repository({
            getObjectDetails: async () => {
              throw new Error("read");
            },
          }),
        ),
        sourcePath,
      ),
      { kind: "unavailable", reason: "read-failed" },
    );
    assert.strictEqual(
      readReasonForError(unknownPath()),
      "head-source-missing",
    );
  });

  test("validates decoded content bytes and read failure reasons", async () => {
    assert.deepStrictEqual(validateContent("abc", 3), {
      kind: "ready",
      content: "abc",
    });
    assert.deepStrictEqual(validateContent("a\u0000b", 100), {
      kind: "unavailable",
      reason: "binary",
    });
    assert.deepStrictEqual(validateContent("abcd", 3), {
      kind: "unavailable",
      reason: "too-large",
    });

    const readContext = (
      repo: GitRepositoryWithCapabilities,
    ): ReadContentContext => ({
      repository: repo,
      headCommit: "head-commit",
      path: sourcePath,
      maxSourceBytes: 8,
    });
    assert.deepStrictEqual(
      await readContent(
        readContext(repository({ show: async () => "decoded" })),
      ),
      { kind: "ready", content: "decoded" },
    );
    assert.deepStrictEqual(
      await readContent(
        readContext(
          repository({
            show: async () => {
              throw unknownPath();
            },
          }),
        ),
      ),
      { kind: "unavailable", reason: "head-source-missing" },
    );
    assert.deepStrictEqual(
      await readContent(
        readContext(
          repository({
            show: async () => {
              throw new Error("read");
            },
          }),
        ),
      ),
      { kind: "unavailable", reason: "read-failed" },
    );
  });
});
