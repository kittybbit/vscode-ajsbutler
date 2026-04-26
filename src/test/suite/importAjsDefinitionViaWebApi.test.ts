import * as assert from "assert";
import {
  buildDefinitionOnlyUnitListRequest,
  createImportedAjsDefinitionContent,
  createImportAjsDefinitionError,
  mapHttpStatusToImportErrorCode,
  type ImportAjsDefinitionViaWebApiPort,
} from "../../application/webapi-import/importAjsDefinitionViaWebApi";

suite("Import AJS definition via WebAPI DTOs", () => {
  test("builds a definition-only desktop port request", () => {
    const portRequest = buildDefinitionOnlyUnitListRequest({
      host: "desktop",
      connection: {
        baseUrl: "https://web-console.example.com:22252",
        acceptLanguage: "en",
        timeoutMs: 10000,
      },
      credentialRef: "jp1-webapi:default",
      scope: {
        manager: "manager.example.com",
        serviceName: "AJSROOT1",
        location: "/JobGroup",
      },
    });

    assert.strictEqual("ok" in portRequest, false);
    assert.deepStrictEqual(portRequest, {
      endpoint: "unit-list",
      method: "GET",
      path: "/ajs/api/v1/objects/statuses",
      connection: {
        baseUrl: "https://web-console.example.com:22252",
        acceptLanguage: "en",
        timeoutMs: 10000,
      },
      credentialRef: "jp1-webapi:default",
      query: {
        mode: "search",
        manager: "manager.example.com",
        serviceName: "AJSROOT1",
        location: "/JobGroup",
        searchLowerUnits: "YES",
        searchTarget: "DEFINITION",
      },
    });
  });

  test("returns an unsupported-host result for web extension execution", () => {
    const result = buildDefinitionOnlyUnitListRequest({
      host: "web",
      connection: {
        baseUrl: "https://web-console.example.com:22252",
      },
      scope: {
        manager: "manager.example.com",
        serviceName: "AJSROOT1",
        location: "/JobGroup",
      },
    });

    assert.strictEqual("ok" in result, true);
    assert.deepStrictEqual(result, {
      ok: false,
      error: {
        code: "unsupported-host",
        message:
          "JP1/AJS WebAPI import is not supported in the web extension host yet.",
        recoverable: true,
      },
    });
  });

  test("creates normalized import content without exposing transport response objects", () => {
    const content = createImportedAjsDefinitionContent(
      {
        manager: "manager.example.com",
        serviceName: "AJSROOT1",
        location: "/JobGroup",
        all: true,
      },
      [
        {
          unitName: "/JobGroup/Jobnet",
          simpleUnitName: "Jobnet",
          unitType: "ROOTNET",
          parameters: "sample=sample_ref_minimal_utf8",
        },
      ],
    );

    assert.deepStrictEqual(content.source, {
      type: "jp1-ajs3-webapi",
      endpoint: "unit-list",
      manualSection: "7.1.1 Unit list acquisition API",
      apiId: "SC-009",
      manager: "manager.example.com",
      serviceName: "AJSROOT1",
      location: "/JobGroup",
      all: true,
    });
    assert.strictEqual(content.units[0].unitName, "/JobGroup/Jobnet");
    assert.deepStrictEqual(content.warnings, []);
  });

  test("maps manual HTTP statuses and repository-owned failures to structured errors", () => {
    assert.strictEqual(
      mapHttpStatusToImportErrorCode(401),
      "authentication-failed",
    );
    assert.strictEqual(
      mapHttpStatusToImportErrorCode(403),
      "authorization-failed",
    );
    assert.strictEqual(
      mapHttpStatusToImportErrorCode(412),
      "web-console-unavailable",
    );
    assert.strictEqual(
      mapHttpStatusToImportErrorCode(418),
      "unexpected-status",
    );

    assert.deepStrictEqual(
      createImportAjsDefinitionError("timeout", "The request timed out.", {
        messageId: "timeout",
      }),
      {
        code: "timeout",
        message: "The request timed out.",
        recoverable: true,
        messageId: "timeout",
      },
    );
  });

  test("defines an application import port without infrastructure types", async () => {
    const port: ImportAjsDefinitionViaWebApiPort = {
      async importDefinition(request) {
        return {
          ok: true,
          content: createImportedAjsDefinitionContent(
            {
              manager: request.query.manager,
              serviceName: request.query.serviceName,
              location: request.query.location,
              all: true,
            },
            [{ unitName: request.query.location }],
          ),
        };
      },
    };

    const request = buildDefinitionOnlyUnitListRequest({
      host: "desktop",
      connection: { baseUrl: "https://web-console.example.com:22252" },
      scope: {
        manager: "manager.example.com",
        serviceName: "AJSROOT1",
        location: "/JobGroup",
        searchLowerUnits: false,
      },
    });
    assert.strictEqual("ok" in request, false);
    if ("ok" in request) {
      throw new Error("Expected a desktop port request.");
    }

    const result = await port.importDefinition(request);

    assert.strictEqual(result.ok, true);
    if (!result.ok) {
      throw new Error("Expected a successful import result.");
    }
    assert.strictEqual(result.content.units[0].unitName, "/JobGroup");
  });
});
