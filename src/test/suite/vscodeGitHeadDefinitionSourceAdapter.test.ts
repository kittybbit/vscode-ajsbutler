import * as assert from "assert";
import * as vscode from "vscode";
import {
  MAX_GIT_HEAD_SOURCE_BYTES,
  VscodeGitHeadDefinitionSourceAdapter,
} from "../../infrastructure/git/VscodeGitHeadDefinitionSourceAdapter";
import {
  GIT_HEAD_CONTENT_SCHEME,
  MAX_GIT_HEAD_SNAPSHOT_ENTRIES,
  VscodeGitHeadContentProvider,
} from "../../infrastructure/git/VscodeGitHeadContentProvider";

const rootUri = vscode.Uri.parse("file:///workspace/project");
const activeUri = vscode.Uri.parse("file:///workspace/project/definition.ajs");

const unknownPath = (): Error & { gitErrorCode: string } =>
  Object.assign(new Error("unknown path"), { gitErrorCode: "UnknownPath" });

const createAdapter = (repository: Record<string, unknown> | null) => {
  const api = { getRepository: () => repository };
  const extension = {
    isActive: true,
    exports: { enabled: true, getAPI: () => api },
    activate: async () => ({ enabled: true, getAPI: () => api }),
  };
  return new VscodeGitHeadDefinitionSourceAdapter({
    getExtension: () => extension,
  });
};

const createRepository = (
  overrides: Record<string, unknown> = {},
): Record<string, unknown> => ({
  rootUri,
  state: {
    HEAD: { commit: "head-commit-1" },
    indexChanges: [],
    workingTreeChanges: [],
  },
  getObjectDetails: async () => ({
    mode: "100644",
    object: "object-1",
    size: 32,
  }),
  detectObjectType: async () => ({ mimetype: "text/plain", encoding: "utf8" }),
  show: async () => "unit=head,,jp1admin,;{ty=g;}",
  ...overrides,
});

suite("VS Code Git HEAD definition source adapter", () => {
  test("uses one immutable HEAD commit and current path before status", async () => {
    const objectCalls: Array<[string, string]> = [];
    const showCalls: Array<[string, string]> = [];
    const repository = createRepository({
      state: {
        HEAD: { commit: "captured-head" },
        indexChanges: [
          {
            originalUri: vscode.Uri.parse("file:///workspace/project/old.ajs"),
            renameUri: activeUri,
            status: 3,
          },
        ],
        workingTreeChanges: [],
      },
      getObjectDetails: async (commit: string, path: string) => {
        objectCalls.push([commit, path]);
        return { mode: "100644", object: "object-1", size: 10 };
      },
      show: async (commit: string, path: string) => {
        showCalls.push([commit, path]);
        return "head-content";
      },
    });

    const result = await createAdapter(repository).readGitHeadDefinition({
      documentUri: activeUri.toString(),
    });

    assert.deepStrictEqual(result, {
      kind: "ready",
      content: "head-content",
      ref: "HEAD",
    });
    assert.deepStrictEqual(objectCalls, [["captured-head", "definition.ajs"]]);
    assert.deepStrictEqual(showCalls, [["captured-head", activeUri.fsPath]]);
  });

  test("allows exactly one current-path rename fallback", async () => {
    const calls: string[] = [];
    const originalUri = vscode.Uri.parse("file:///workspace/project/old.ajs");
    const repository = createRepository({
      state: {
        HEAD: { commit: "head-commit-2" },
        indexChanges: [
          { originalUri, renameUri: activeUri, status: "INDEX_RENAMED" },
        ],
        workingTreeChanges: [],
      },
      getObjectDetails: async (_commit: string, path: string) => {
        calls.push(path);
        if (path === "definition.ajs") throw unknownPath();
        return { mode: "100644", object: "old-object", size: 10 };
      },
      show: async (_commit: string, path: string) => {
        calls.push(path);
        return "renamed-head";
      },
    });

    const result = await createAdapter(repository).readGitHeadDefinition({
      documentUri: activeUri.toString(),
    });

    assert.deepStrictEqual(result, {
      kind: "ready",
      content: "renamed-head",
      ref: "HEAD",
    });
    assert.deepStrictEqual(calls, [
      "definition.ajs",
      "old.ajs",
      originalUri.fsPath,
    ]);
  });

  test("does not inspect candidates after a non-UnknownPath failure", async () => {
    let objectCallCount = 0;
    const repository = createRepository({
      state: {
        HEAD: { commit: "head-commit-3" },
        indexChanges: [
          {
            originalUri: vscode.Uri.parse("file:///workspace/project/old.ajs"),
            renameUri: activeUri,
            status: "INDEX_RENAMED",
          },
        ],
        workingTreeChanges: [],
      },
      getObjectDetails: async () => {
        objectCallCount += 1;
        throw new Error("provider failure");
      },
    });

    const result = await createAdapter(repository).readGitHeadDefinition({
      documentUri: activeUri.toString(),
    });

    assert.deepStrictEqual(result, {
      kind: "unavailable",
      reason: "read-failed",
    });
    assert.strictEqual(objectCallCount, 1);
  });

  test("resolves nested paths and rejects outside or traversal paths", async () => {
    const nestedUri = vscode.Uri.parse(
      "file:///workspace/project/nested/definition.ajs",
    );
    const calls: string[] = [];
    const repository = createRepository({
      getObjectDetails: async (_commit: string, path: string) => {
        calls.push(path);
        return { mode: "100644", object: "nested-object" };
      },
      show: async () => "nested-head",
    });
    const nestedResult = await new VscodeGitHeadDefinitionSourceAdapter({
      getExtension: () => ({
        isActive: true,
        exports: {
          enabled: true,
          getAPI: () => ({ getRepository: () => repository }),
        },
        activate: async () => undefined,
      }),
    }).readGitHeadDefinition({ documentUri: nestedUri.toString() });
    assert.deepStrictEqual(nestedResult, {
      kind: "ready",
      content: "nested-head",
      ref: "HEAD",
    });
    assert.deepStrictEqual(calls, ["nested/definition.ajs"]);

    const outside = await createAdapter(repository).readGitHeadDefinition({
      documentUri: "file:///workspace/project-other/definition.ajs",
    });
    assert.deepStrictEqual(outside, {
      kind: "unavailable",
      reason: "head-source-missing",
    });
    const traversal = await createAdapter(repository).readGitHeadDefinition({
      documentUri: "file:///workspace/project/../secret.ajs",
    });
    assert.deepStrictEqual(traversal, {
      kind: "unavailable",
      reason: "head-source-missing",
    });
  });

  test("supports a working-tree deleted rename and never guesses copies or chains", async () => {
    const originalUri = vscode.Uri.parse("file:///workspace/project/old.ajs");
    const workingRename = createRepository({
      state: {
        HEAD: { commit: "working-head" },
        indexChanges: [],
        workingTreeChanges: [
          { originalUri, renameUri: activeUri, status: "DELETED" },
        ],
      },
      getObjectDetails: async (_commit: string, path: string) => {
        if (path === "definition.ajs") throw unknownPath();
        return { mode: "100644", object: "old-object" };
      },
      show: async () => "working-deleted-head",
    });
    assert.deepStrictEqual(
      await createAdapter(workingRename).readGitHeadDefinition({
        documentUri: activeUri.toString(),
      }),
      { kind: "ready", content: "working-deleted-head", ref: "HEAD" },
    );

    const workingModified = createRepository({
      state: {
        HEAD: { commit: "working-modified-head" },
        indexChanges: [],
        workingTreeChanges: [
          { originalUri, renameUri: activeUri, status: "MODIFIED" },
        ],
      },
      getObjectDetails: async (_commit: string, path: string) => {
        if (path === "definition.ajs") throw unknownPath();
        return { mode: "100644", object: "old-object" };
      },
      show: async () => "working-modified-head-content",
    });
    assert.deepStrictEqual(
      await createAdapter(workingModified).readGitHeadDefinition({
        documentUri: activeUri.toString(),
      }),
      {
        kind: "ready",
        content: "working-modified-head-content",
        ref: "HEAD",
      },
    );

    const ambiguousStates = [
      {
        indexChanges: [
          { originalUri, renameUri: activeUri, status: "INDEX_COPIED" },
        ],
        workingTreeChanges: [],
      },
      {
        indexChanges: [
          { originalUri, renameUri: activeUri, status: "INDEX_RENAMED" },
          { originalUri, renameUri: activeUri, status: "INDEX_RENAMED" },
        ],
        workingTreeChanges: [],
      },
      {
        indexChanges: [
          { originalUri, renameUri: activeUri, status: "INDEX_RENAMED" },
        ],
        workingTreeChanges: [
          { originalUri, renameUri: activeUri, status: "DELETED" },
        ],
      },
      {
        indexChanges: [{ originalUri, renameUri: activeUri, status: "OTHER" }],
        workingTreeChanges: [],
      },
      {
        indexChanges: [
          {
            originalUri: "file:///workspace/project/old.ajs",
            renameUri: activeUri,
            status: "INDEX_RENAMED",
          },
        ],
        workingTreeChanges: [],
      },
    ];
    for (const stateChanges of ambiguousStates) {
      const result = await createAdapter(
        createRepository({
          state: {
            HEAD: { commit: "ambiguous-head" },
            ...stateChanges,
          },
          getObjectDetails: async (commit: string, path: string) => {
            if (commit === "ambiguous-head" && path === "definition.ajs") {
              throw unknownPath();
            }
            return { mode: "100644", object: "unexpected" };
          },
        }),
      ).readGitHeadDefinition({ documentUri: activeUri.toString() });
      assert.deepStrictEqual(result, {
        kind: "unavailable",
        reason: "head-source-missing",
      });
    }
  });

  test("maps candidate UnknownPath directly to a missing HEAD source", async () => {
    let showCalls = 0;
    const originalUri = vscode.Uri.parse("file:///workspace/project/old.ajs");
    const repository = createRepository({
      state: {
        HEAD: { commit: "candidate-missing-head" },
        indexChanges: [
          { originalUri, renameUri: activeUri, status: "INDEX_RENAMED" },
        ],
        workingTreeChanges: [],
      },
      getObjectDetails: async () => {
        throw unknownPath();
      },
      show: async () => {
        showCalls += 1;
        return "must not show";
      },
    });
    assert.deepStrictEqual(
      await createAdapter(repository).readGitHeadDefinition({
        documentUri: activeUri.toString(),
      }),
      { kind: "unavailable", reason: "head-source-missing" },
    );
    assert.strictEqual(showCalls, 0);
  });

  test("gates unsupported objects and provider-advertised encodings", async () => {
    const cases: Array<{
      overrides: Record<string, unknown>;
      reason: string;
    }> = [
      {
        overrides: {
          getObjectDetails: async () => ({
            mode: "160000",
            object: "sub",
            size: 1,
          }),
        },
        reason: "submodule",
      },
      {
        overrides: {
          getObjectDetails: async () => ({
            mode: "040000",
            object: "tree",
          }),
        },
        reason: "binary",
      },
      {
        overrides: {
          detectObjectType: async () => ({
            mimetype: "application/octet-stream",
          }),
        },
        reason: "binary",
      },
      {
        overrides: {
          detectObjectType: async () => ({
            mimetype: "text/plain",
            encoding: "shift_jis",
          }),
        },
        reason: "unsupported-encoding",
      },
      { overrides: { show: async () => "\u0000" }, reason: "binary" },
      {
        overrides: {
          getObjectDetails: async () => ({
            mode: "100644",
            object: "large",
          }),
          show: async () => "x".repeat(MAX_GIT_HEAD_SOURCE_BYTES + 1),
        },
        reason: "too-large",
      },
    ];
    for (const testCase of cases) {
      const result = await createAdapter(
        createRepository(testCase.overrides),
      ).readGitHeadDefinition({
        documentUri: activeUri.toString(),
      });
      assert.deepStrictEqual(result, {
        kind: "unavailable",
        reason: testCase.reason,
      });
    }
  });

  test("enforces the decoded limit and accepts configured textconv output", async () => {
    const exact = "x".repeat(MAX_GIT_HEAD_SOURCE_BYTES);
    const exactResult = await createAdapter(
      createRepository({
        getObjectDetails: async () => ({
          mode: "100644",
          object: "large-raw-object",
          size: MAX_GIT_HEAD_SOURCE_BYTES + 1,
        }),
        detectObjectType: async () => ({ mimetype: "text/plain" }),
        show: async () => exact,
      }),
    ).readGitHeadDefinition({ documentUri: activeUri.toString() });
    assert.deepStrictEqual(exactResult, {
      kind: "ready",
      content: exact,
      ref: "HEAD",
    });

    const over = await createAdapter(
      createRepository({
        detectObjectType: async () => ({
          mimetype: "text/plain",
          encoding: "utf16le",
        }),
        show: async () => "x".repeat(MAX_GIT_HEAD_SOURCE_BYTES + 1),
      }),
    ).readGitHeadDefinition({ documentUri: activeUri.toString() });
    assert.deepStrictEqual(over, {
      kind: "unavailable",
      reason: "too-large",
    });

    const textconv = await createAdapter(
      createRepository({
        detectObjectType: async () => ({
          mimetype: "text/plain",
          encoding: "utf16be",
        }),
        show: async () => "decoded textconv output",
      }),
    ).readGitHeadDefinition({ documentUri: activeUri.toString() });
    assert.deepStrictEqual(textconv, {
      kind: "ready",
      content: "decoded textconv output",
      ref: "HEAD",
    });
  });

  test("reports feature-detected capability failures without leaking host errors", async () => {
    const missing = new VscodeGitHeadDefinitionSourceAdapter({
      getExtension: () => undefined,
    });
    assert.deepStrictEqual(
      await missing.readGitHeadDefinition({
        documentUri: activeUri.toString(),
      }),
      { kind: "unavailable", reason: "extension-missing" },
    );
    assert.deepStrictEqual(
      await createAdapter(null).readGitHeadDefinition({
        documentUri: activeUri.toString(),
      }),
      { kind: "unavailable", reason: "repository-not-found" },
    );

    const disabled = new VscodeGitHeadDefinitionSourceAdapter({
      getExtension: () => ({
        isActive: true,
        exports: { enabled: false, getAPI: () => undefined },
        activate: async () => undefined,
      }),
    });
    assert.deepStrictEqual(
      await disabled.readGitHeadDefinition({
        documentUri: activeUri.toString(),
      }),
      { kind: "unavailable", reason: "extension-disabled" },
    );
  });

  test("uses the activated GitExtension export shape and caches activation", async () => {
    let activationCount = 0;
    const repository = createRepository();
    const adapter = new VscodeGitHeadDefinitionSourceAdapter({
      getExtension: () => ({
        isActive: false,
        activate: async () => {
          activationCount += 1;
          return {
            enabled: true,
            getAPI: () => ({ getRepository: () => repository }),
          };
        },
      }),
    });
    assert.deepStrictEqual(
      await adapter.readGitHeadDefinition({
        documentUri: activeUri.toString(),
      }),
      { kind: "ready", content: "unit=head,,jp1admin,;{ty=g;}", ref: "HEAD" },
    );
    assert.deepStrictEqual(
      await adapter.readGitHeadDefinition({
        documentUri: activeUri.toString(),
      }),
      { kind: "ready", content: "unit=head,,jp1admin,;{ty=g;}", ref: "HEAD" },
    );
    assert.strictEqual(activationCount, 1);

    const activationFailure = new VscodeGitHeadDefinitionSourceAdapter({
      getExtension: () => ({
        isActive: false,
        activate: async () => {
          throw new Error("activation failure");
        },
      }),
    });
    assert.deepStrictEqual(
      await activationFailure.readGitHeadDefinition({
        documentUri: activeUri.toString(),
      }),
      { kind: "unavailable", reason: "activation-failed" },
    );

    const missingApi = new VscodeGitHeadDefinitionSourceAdapter({
      getExtension: () => ({
        isActive: true,
        exports: { enabled: true },
        activate: async () => undefined,
      }),
    });
    assert.deepStrictEqual(
      await missingApi.readGitHeadDefinition({
        documentUri: activeUri.toString(),
      }),
      { kind: "unavailable", reason: "api-unavailable" },
    );

    const throwingApi = new VscodeGitHeadDefinitionSourceAdapter({
      getExtension: () => ({
        isActive: true,
        exports: {
          enabled: true,
          getAPI: () => {
            throw new Error("getAPI failure");
          },
        },
        activate: async () => undefined,
      }),
    });
    assert.deepStrictEqual(
      await throwingApi.readGitHeadDefinition({
        documentUri: activeUri.toString(),
      }),
      { kind: "unavailable", reason: "api-unavailable" },
    );
  });

  test("rejects virtual Git repositories and missing HEAD", async () => {
    assert.deepStrictEqual(
      await createAdapter(
        createRepository({ isUsingVirtualFileSystem: true }),
      ).readGitHeadDefinition({ documentUri: activeUri.toString() }),
      { kind: "unavailable", reason: "virtual-repository-unsupported" },
    );
    assert.deepStrictEqual(
      await createAdapter(
        createRepository({
          state: { indexChanges: [], workingTreeChanges: [] },
        }),
      ).readGitHeadDefinition({ documentUri: activeUri.toString() }),
      { kind: "unavailable", reason: "head-missing" },
    );
  });
});

suite("Git HEAD snapshot content provider", () => {
  test("keeps independent opaque snapshots and evicts released entries", () => {
    const provider = new VscodeGitHeadContentProvider();
    const first = provider.reserve("first");
    const second = provider.reserve("second");
    assert.strictEqual(first.kind, "reserved");
    assert.strictEqual(second.kind, "reserved");
    if (first.kind !== "reserved" || second.kind !== "reserved") return;
    assert.notStrictEqual(
      first.reservation.uri.toString(),
      second.reservation.uri.toString(),
    );
    assert.strictEqual(first.reservation.uri.scheme, GIT_HEAD_CONTENT_SCHEME);
    assert.strictEqual(
      provider.provideTextDocumentContent(first.reservation.uri),
      "first",
    );
    assert.strictEqual(
      provider.provideTextDocumentContent(second.reservation.uri),
      "second",
    );
    first.reservation.release();
    first.reservation.release();
    assert.strictEqual(
      provider.provideTextDocumentContent(first.reservation.uri),
      "",
    );
    assert.strictEqual(provider.size, 1);
    provider.dispose();
    assert.strictEqual(
      provider.provideTextDocumentContent(second.reservation.uri),
      "",
    );
  });

  test("rejects the fixed active-entry capacity and reuses released capacity", () => {
    const provider = new VscodeGitHeadContentProvider();
    const reservations = Array.from(
      { length: MAX_GIT_HEAD_SNAPSHOT_ENTRIES },
      (_, index) => provider.reserve(`snapshot-${index}`),
    );
    assert.ok(reservations.every((entry) => entry.kind === "reserved"));
    assert.deepStrictEqual(provider.reserve("overflow"), {
      kind: "unavailable",
      reason: "capacity-exceeded",
    });
    const first = reservations[0];
    assert.strictEqual(first.kind, "reserved");
    if (first.kind !== "reserved") return;
    first.reservation.release();
    assert.strictEqual(provider.reserve("reused").kind, "reserved");
  });
});
