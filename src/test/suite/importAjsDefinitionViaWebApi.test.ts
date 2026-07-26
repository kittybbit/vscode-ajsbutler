import * as assert from "assert";
import {
  createImportedAjsDefinitionContent,
  createImportAjsDefinitionError,
  createImportAjsDefinitionViaWebApi,
  type ImportAjsDefinitionRequestDto,
  type ImportAjsDefinitionViaWebApiPort,
} from "../../application/webapi-import/importAjsDefinitionViaWebApi";

const baseRequest: ImportAjsDefinitionRequestDto = {
  connection: {
    baseUrl: "https://web-console.example.com:22252",
    acceptLanguage: "en",
    timeoutMs: 10000,
  },
  scope: {
    manager: "manager.example.com",
    serviceName: "AJSROOT1",
    location: "/JobGroup",
    searchLowerUnits: false,
  },
  credentialRef: "jp1-webapi:default",
};

suite("Import AJS definition via WebAPI application boundary", () => {
  test("invokes a host-neutral port without transport fields", async () => {
    const requests: ImportAjsDefinitionRequestDto[] = [];
    const port: ImportAjsDefinitionViaWebApiPort = {
      async importDefinition(request) {
        requests.push(request);
        return {
          ok: true,
          content: createImportedAjsDefinitionContent(
            {
              manager: request.scope.manager,
              serviceName: request.scope.serviceName,
              location: request.scope.location,
              all: true,
            },
            [{ unitName: request.scope.location }],
          ),
        };
      },
    };

    const result = await createImportAjsDefinitionViaWebApi(port)(baseRequest);

    assert.strictEqual(result.ok, true);
    assert.deepStrictEqual(requests, [baseRequest]);
    const serializedRequest = JSON.stringify(requests[0]);
    assert.ok(!serializedRequest.includes('"method"'));
    assert.ok(!serializedRequest.includes('"path"'));
    assert.ok(!serializedRequest.includes('"endpoint"'));
    assert.ok(!serializedRequest.includes('"searchTarget"'));
    assert.ok(!serializedRequest.includes('"username"'));
    assert.ok(!serializedRequest.includes('"password"'));
  });

  test("copies request DTOs before invoking the port", async () => {
    let observed: ImportAjsDefinitionRequestDto | undefined;
    const importDefinition = createImportAjsDefinitionViaWebApi({
      async importDefinition(request) {
        observed = request;
        return {
          ok: true,
          content: createImportedAjsDefinitionContent(
            {
              manager: request.scope.manager,
              serviceName: request.scope.serviceName,
              location: request.scope.location,
              all: true,
            },
            [],
          ),
        };
      },
    });

    await importDefinition(baseRequest);

    assert.ok(observed);
    assert.notStrictEqual(observed.connection, baseRequest.connection);
    assert.notStrictEqual(observed.scope, baseRequest.scope);
    assert.deepStrictEqual(observed, baseRequest);
  });

  test("creates imported content without exposing transport response objects", () => {
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

  test("creates repository-owned structured errors", () => {
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
});
