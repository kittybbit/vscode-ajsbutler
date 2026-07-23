import * as assert from "assert";
import { Jp1Ajs3WebApiImportAdapter } from "../../infrastructure/webapi/Jp1Ajs3WebApiImportAdapter";
import type { ImportAjsDefinitionRequestDto } from "../../application/webapi-import/importAjsDefinitionViaWebApi";

const baseRequest: ImportAjsDefinitionRequestDto = {
  connection: {
    baseUrl: "https://web-console.example.com:22252",
    acceptLanguage: "en",
    timeoutMs: 1000,
  },
  credentialRef: "credential-ref",
  scope: {
    manager: "manager.example.com",
    serviceName: "AJSROOT1",
    location: "/JobGroup",
    searchLowerUnits: true,
  },
};

suite("JP1/AJS3 WebAPI import adapter", () => {
  test("maps a successful unit-list response to application content", async () => {
    const requested: Array<{
      input: string;
      method: string;
      headers: Record<string, string>;
    }> = [];
    const adapter = new Jp1Ajs3WebApiImportAdapter({
      credentialProvider: {
        async resolveCredential() {
          return {
            username: "jp1admin",
            password: "secret",
          };
        },
      },
      async fetch(input, init) {
        requested.push({ input, method: init.method, headers: init.headers });
        return {
          ok: true,
          status: 200,
          async json() {
            return {
              statuses: [
                {
                  definition: {
                    unitName: "/JobGroup/Jobnet",
                    simpleUnitName: "Jobnet",
                    unitType: "ROOTNET",
                    parameters: "sample=sample_ref_minimal_utf8",
                  },
                  unitStatus: null,
                  release: null,
                },
              ],
              all: true,
            };
          },
        };
      },
    });

    const result = await adapter.importDefinition(baseRequest);

    assert.strictEqual(result.ok, true);
    if (!result.ok) {
      throw new Error("Expected successful import.");
    }
    assert.strictEqual(result.content.units[0].unitName, "/JobGroup/Jobnet");
    assert.strictEqual(result.content.source.apiId, "SC-009");
    assert.strictEqual(requested.length, 1);
    assert.strictEqual(requested[0].method, "GET");
    const requestedUrl = new URL(requested[0].input);
    assert.strictEqual(requestedUrl.pathname, "/ajs/api/v1/objects/statuses");
    assert.deepStrictEqual(Object.fromEntries(requestedUrl.searchParams), {
      mode: "search",
      manager: "manager.example.com",
      serviceName: "AJSROOT1",
      location: "/JobGroup",
      searchLowerUnits: "YES",
      searchTarget: "DEFINITION",
    });
    assert.strictEqual(requested[0].headers.Accept, "application/json");
    assert.strictEqual(requested[0].headers["Accept-Language"], "en");
    assert.ok(requested[0].headers["X-AJS-Authorization"].length > 0);
  });

  test("maps disabled lower-unit search to the SC-009 NO query value", async () => {
    let requestedUrl: URL | undefined;
    const adapter = new Jp1Ajs3WebApiImportAdapter({
      credentialProvider: {
        async resolveCredential() {
          return {
            username: "jp1admin",
            password: "secret",
          };
        },
      },
      async fetch(input) {
        requestedUrl = new URL(input);
        return {
          ok: true,
          status: 200,
          async json() {
            return {
              statuses: [],
              all: true,
            };
          },
        };
      },
    });

    await adapter.importDefinition({
      ...baseRequest,
      scope: {
        ...baseRequest.scope,
        searchLowerUnits: false,
      },
    });

    assert.strictEqual(
      requestedUrl?.searchParams.get("searchLowerUnits"),
      "NO",
    );
  });

  test("defaults Accept-Language to en for Prism-compatible requests", async () => {
    let acceptLanguage: string | undefined;
    const adapter = new Jp1Ajs3WebApiImportAdapter({
      credentialProvider: {
        async resolveCredential() {
          return {
            username: "jp1admin",
            password: "secret",
          };
        },
      },
      async fetch(_input, init) {
        acceptLanguage = init.headers["Accept-Language"];
        return {
          ok: true,
          status: 200,
          async json() {
            return {
              statuses: [],
              all: true,
            };
          },
        };
      },
    });

    await adapter.importDefinition({
      ...baseRequest,
      connection: {
        baseUrl: baseRequest.connection.baseUrl,
      },
    });

    assert.strictEqual(acceptLanguage, "en");
  });

  test("returns authentication failure when credentials are unavailable", async () => {
    const adapter = new Jp1Ajs3WebApiImportAdapter({
      credentialProvider: {
        async resolveCredential() {
          return undefined;
        },
      },
      async fetch() {
        throw new Error("fetch should not be called");
      },
    });

    const result = await adapter.importDefinition(baseRequest);

    assert.strictEqual(result.ok, false);
    if (result.ok) {
      throw new Error("Expected failed import.");
    }
    assert.strictEqual(result.error.code, "authentication-failed");
  });

  test("maps HTTP errors without leaking credentials", async () => {
    const adapter = new Jp1Ajs3WebApiImportAdapter({
      credentialProvider: {
        async resolveCredential() {
          return { username: "jp1admin", password: "secret" };
        },
      },
      async fetch() {
        return {
          ok: false,
          status: 403,
          async json() {
            return {
              message: "The operator does not have execution permission.",
              messageID: "KNAK403",
            };
          },
        };
      },
    });

    const result = await adapter.importDefinition(baseRequest);

    assert.strictEqual(result.ok, false);
    if (result.ok) {
      throw new Error("Expected failed import.");
    }
    assert.strictEqual(result.error.code, "authorization-failed");
    assert.strictEqual(result.error.httpStatus, 403);
    assert.strictEqual(result.error.messageId, "KNAK403");
    assert.ok(!result.error.message.includes("secret"));
  });

  test("rejects malformed success responses", async () => {
    const adapter = new Jp1Ajs3WebApiImportAdapter({
      credentialProvider: {
        async resolveCredential() {
          return { username: "jp1admin", password: "secret" };
        },
      },
      async fetch() {
        return {
          ok: true,
          status: 200,
          async json() {
            return { statuses: null };
          },
        };
      },
    });

    const result = await adapter.importDefinition(baseRequest);

    assert.strictEqual(result.ok, false);
    if (result.ok) {
      throw new Error("Expected failed import.");
    }
    assert.strictEqual(result.error.code, "malformed-response");
  });

  test("preserves partial, empty, and missing-definition warnings", async () => {
    const responses = [
      {
        statuses: [
          {
            definition: null,
            unitStatus: { unitName: "/JobGroup/Missing" },
            release: null,
          },
        ],
        all: false,
      },
      { statuses: [], all: true },
    ];
    const adapter = new Jp1Ajs3WebApiImportAdapter({
      credentialProvider: {
        async resolveCredential() {
          return { username: "jp1admin", password: "secret" };
        },
      },
      async fetch() {
        const body = responses.shift();
        return {
          ok: true,
          status: 200,
          async json() {
            return body;
          },
        };
      },
    });

    const partial = await adapter.importDefinition(baseRequest);
    const empty = await adapter.importDefinition(baseRequest);

    assert.strictEqual(partial.ok, true);
    assert.strictEqual(empty.ok, true);
    if (!partial.ok || !empty.ok) {
      throw new Error("Expected successful warning results.");
    }
    assert.deepStrictEqual(
      partial.content.warnings.map((warning) => warning.code),
      ["partial-result", "definition-missing"],
    );
    assert.strictEqual(
      partial.content.warnings[1].unitName,
      "/JobGroup/Missing",
    );
    assert.deepStrictEqual(
      empty.content.warnings.map((warning) => warning.code),
      ["empty-result"],
    );
  });

  test("maps documented and unexpected HTTP statuses", async () => {
    const mappings = [
      [400, "invalid-request"],
      [401, "authentication-failed"],
      [403, "authorization-failed"],
      [404, "resource-not-found"],
      [409, "conflict"],
      [412, "web-console-unavailable"],
      [500, "server-error"],
      [418, "unexpected-status"],
    ] as const;

    for (const [status, expectedCode] of mappings) {
      const adapter = new Jp1Ajs3WebApiImportAdapter({
        credentialProvider: {
          async resolveCredential() {
            return { username: "jp1admin", password: "secret" };
          },
        },
        async fetch() {
          return {
            ok: false,
            status,
            async json() {
              return undefined;
            },
          };
        },
      });

      const result = await adapter.importDefinition(baseRequest);

      assert.strictEqual(result.ok, false);
      if (result.ok) {
        throw new Error(`Expected HTTP ${status} to fail.`);
      }
      assert.strictEqual(result.error.code, expectedCode);
      assert.strictEqual(result.error.httpStatus, status);
    }
  });

  test("maps network and timeout failures without exposing raw errors", async () => {
    const credentialProvider = {
      async resolveCredential() {
        return { username: "jp1admin", password: "secret" };
      },
    };
    const networkAdapter = new Jp1Ajs3WebApiImportAdapter({
      credentialProvider,
      async fetch() {
        throw new Error("secret network detail");
      },
    });
    const timeoutAdapter = new Jp1Ajs3WebApiImportAdapter({
      credentialProvider,
      async fetch(_input, init) {
        return await new Promise((_, reject) => {
          init.signal?.addEventListener("abort", () => {
            reject(new DOMException("aborted", "AbortError"));
          });
        });
      },
    });

    const network = await networkAdapter.importDefinition(baseRequest);
    const timeout = await timeoutAdapter.importDefinition({
      ...baseRequest,
      connection: { ...baseRequest.connection, timeoutMs: 0 },
    });

    assert.strictEqual(network.ok, false);
    assert.strictEqual(timeout.ok, false);
    if (network.ok || timeout.ok) {
      throw new Error("Expected transport failures.");
    }
    assert.strictEqual(network.error.code, "network-failed");
    assert.strictEqual(timeout.error.code, "timeout");
    assert.ok(!network.error.message.includes("secret network detail"));
  });
});
