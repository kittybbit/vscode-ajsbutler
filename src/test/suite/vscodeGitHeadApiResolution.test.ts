import * as assert from "assert";
import * as vscode from "vscode";
import {
  findRepository,
  parseDocumentUri,
  resolveApiOnce,
  resolveReadContext,
  type GitApi,
  type GitExtensionHost,
  type GitRepository,
} from "../../infrastructure/git/VscodeGitHeadApiResolution";

const rootUri = vscode.Uri.parse("file:///workspace/project");
const activeUri = vscode.Uri.parse("file:///workspace/project/definition.ajs");

const repository = (overrides: Partial<GitRepository> = {}): GitRepository => ({
  rootUri,
  state: { HEAD: { commit: "captured-head" } },
  getObjectDetails: async () => ({ mode: "100644", object: "object-1" }),
  detectObjectType: async () => ({ mimetype: "text/plain" }),
  show: async () => "head-content",
  ...overrides,
});

const extension = (exportsValue: unknown): GitExtensionHost => ({
  isActive: true,
  exports: exportsValue as GitExtensionHost["exports"],
  activate: async () => exportsValue,
});

suite("Git HEAD API resolution seam", () => {
  test("parses file URIs and builds a captured HEAD read context", async () => {
    const repo = repository();
    const api: GitApi = { getRepository: () => repo };
    const parsed = parseDocumentUri({ documentUri: activeUri.toString() });
    assert.strictEqual(parsed.kind, "ready");
    if (parsed.kind !== "ready") return;

    const resolved = await resolveReadContext(api, {
      documentUri: activeUri.toString(),
    });
    assert.strictEqual(resolved.kind, "ready");
    if (resolved.kind !== "ready") return;
    assert.strictEqual(resolved.context.headCommit, "captured-head");
    assert.strictEqual(
      resolved.context.documentUri.toString(),
      activeUri.toString(),
    );
    assert.strictEqual(resolved.context.repository, repo);
  });

  test("preserves the Git export receiver while resolving the API", async () => {
    const api: GitApi = { getRepository: () => repository() };
    const exportsValue = {
      enabled: true,
      getAPI: function (this: unknown, version: 1): GitApi {
        void version;
        assert.strictEqual(this, exportsValue);
        return api;
      },
    };
    const result = await resolveApiOnce(() => extension(exportsValue));
    assert.deepStrictEqual(result, { kind: "ready", api });
  });

  test("keeps extension discovery and activation failure reasons distinct", async () => {
    assert.deepStrictEqual(await resolveApiOnce(() => undefined), {
      kind: "unavailable",
      reason: "extension-missing",
    });
    assert.deepStrictEqual(
      await resolveApiOnce(() => ({
        isActive: false,
        activate: async () => {
          throw new Error("activation failure");
        },
      })),
      { kind: "unavailable", reason: "activation-failed" },
    );
    assert.deepStrictEqual(
      await resolveApiOnce(() => extension({ enabled: false })),
      { kind: "unavailable", reason: "extension-disabled" },
    );
    assert.deepStrictEqual(
      await resolveApiOnce(() => extension({ enabled: true })),
      { kind: "unavailable", reason: "api-unavailable" },
    );
  });

  test("classifies throwing host accessors at their original API boundaries", async () => {
    const enabledThrows: Record<string, unknown> = {};
    Object.defineProperty(enabledThrows, "enabled", {
      get: () => {
        throw new Error("enabled accessor failure");
      },
    });
    assert.deepStrictEqual(
      await resolveApiOnce(() => extension(enabledThrows)),
      { kind: "unavailable", reason: "activation-failed" },
    );

    const getApiThrows: Record<string, unknown> = { enabled: true };
    Object.defineProperty(getApiThrows, "getAPI", {
      get: () => {
        throw new Error("getAPI accessor failure");
      },
    });
    assert.deepStrictEqual(
      await resolveApiOnce(() => extension(getApiThrows)),
      { kind: "unavailable", reason: "activation-failed" },
    );

    const apiRepositoryThrows: Record<string, unknown> = {};
    Object.defineProperty(apiRepositoryThrows, "getRepository", {
      get: () => {
        throw new Error("getRepository accessor failure");
      },
    });
    assert.deepStrictEqual(
      await resolveApiOnce(() =>
        extension({ enabled: true, getAPI: () => apiRepositoryThrows }),
      ),
      { kind: "unavailable", reason: "api-unavailable" },
    );
  });

  test("applies document, repository, virtual-root, HEAD, and capability guards", async () => {
    const apiFor = (repo: GitRepository | null): GitApi => ({
      getRepository: () => repo,
    });
    assert.deepStrictEqual(parseDocumentUri({ documentUri: "not a URI" }), {
      kind: "unavailable",
      reason: "virtual-repository-unsupported",
    });
    assert.deepStrictEqual(
      await resolveReadContext(apiFor(null), {
        documentUri: activeUri.toString(),
      }),
      { kind: "unavailable", reason: "repository-not-found" },
    );
    assert.deepStrictEqual(
      await resolveReadContext(
        apiFor(repository({ isUsingVirtualFileSystem: true })),
        { documentUri: activeUri.toString() },
      ),
      { kind: "unavailable", reason: "virtual-repository-unsupported" },
    );
    assert.deepStrictEqual(
      await resolveReadContext(
        apiFor(repository({ state: { indexChanges: [] } })),
        { documentUri: activeUri.toString() },
      ),
      { kind: "unavailable", reason: "head-missing" },
    );
    assert.deepStrictEqual(
      await resolveReadContext(apiFor(repository({ show: undefined })), {
        documentUri: activeUri.toString(),
      }),
      { kind: "unavailable", reason: "api-unavailable" },
    );
  });

  test("maps repository lookup exceptions to an unavailable API", () => {
    assert.deepStrictEqual(
      findRepository(
        {
          getRepository: () => {
            throw new Error("lookup failure");
          },
        },
        activeUri,
      ),
      { kind: "unavailable", reason: "api-unavailable" },
    );
  });
});
