import * as assert from "assert";
import { Jp1Ajs3WebApiImportAdapter } from "../../infrastructure/webapi/Jp1Ajs3WebApiImportAdapter";
import type { ImportAjsDefinitionPortRequestDto } from "../../application/webapi-import/importAjsDefinitionViaWebApi";

const baseRequest: ImportAjsDefinitionPortRequestDto = {
  endpoint: "unit-list",
  method: "GET",
  path: "/ajs/api/v1/objects/statuses",
  connection: {
    baseUrl: "https://web-console.example.com:22252",
    acceptLanguage: "en",
    timeoutMs: 1000,
  },
  credentialRef: "credential-ref",
  query: {
    mode: "search",
    manager: "manager.example.com",
    serviceName: "AJSROOT1",
    location: "/JobGroup",
    searchLowerUnits: "YES",
    searchTarget: "DEFINITION",
  },
};

suite("JP1/AJS3 WebAPI import adapter", () => {
  test("maps a successful unit-list response to application content", async () => {
    const requested: Array<{
      input: string;
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
        requested.push({ input, headers: init.headers });
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
    assert.ok(
      requested[0].input.includes(
        "/ajs/api/v1/objects/statuses?mode=search&manager=manager.example.com",
      ),
    );
    assert.strictEqual(requested[0].headers["Accept-Language"], "en");
    assert.ok(requested[0].headers["X-AJS-Authorization"].length > 0);
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
});
