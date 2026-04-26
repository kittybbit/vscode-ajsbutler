import * as assert from "assert";
import {
  jp1Ajs3GetUnitListOperation,
  type Jp1Ajs3GetUnitListRequest,
  type Jp1Ajs3UnitListResponse,
} from "../../infrastructure/webapi/generated/jp1Ajs3WebApi.generated";
import {
  jp1Ajs3DefinitionOnlyUnitListResponse,
  jp1Ajs3GetUnitListMockOperation,
  jp1Ajs3PrismOpenApiPath,
  startJp1Ajs3PrismMockServer,
} from "../fixtures/webapi/generated/jp1Ajs3WebApiMock.generated";

suite("JP1/AJS3 WebAPI OpenAPI generated artifacts", () => {
  test("exposes the first read-only import operation metadata", () => {
    assert.deepStrictEqual(jp1Ajs3GetUnitListMockOperation, {
      method: "GET",
      path: "/ajs/api/v1/objects/statuses",
      operationId: "getUnitList",
    });
    assert.strictEqual(jp1Ajs3GetUnitListOperation.apiId, "SC-009");
    assert.strictEqual(
      jp1Ajs3GetUnitListOperation.initialSearchTarget,
      "DEFINITION",
    );
  });

  test("provides a definition-only unit-list response fixture", () => {
    const response: Jp1Ajs3UnitListResponse =
      jp1Ajs3DefinitionOnlyUnitListResponse;

    assert.strictEqual(response.all, true);
    assert.strictEqual(response.statuses.length, 1);
    assert.strictEqual(response.statuses[0].definition?.unitName, "/test_jg_1");
    assert.strictEqual(response.statuses[0].unitStatus, null);
  });

  test("serves sample-backed responses through Prism", async () => {
    const server = await startJp1Ajs3PrismMockServer();
    try {
      const response = await fetch(
        `${server.baseUrl}/ajs/api/v1/objects/statuses?mode=search&manager=manager.example.com&serviceName=AJSROOT1&location=/sample_ref_minimal&searchTarget=DEFINITION`,
        {
          headers: {
            Prefer: "example=sample_ref_minimal_utf8",
            "X-AJS-Authorization": "dummy",
          },
        },
      );
      const body = (await response.json()) as Jp1Ajs3UnitListResponse;

      assert.strictEqual(response.status, 200);
      assert.strictEqual(
        body.statuses[0].definition?.["x-ajs-butler-sample"],
        "sample/sample_ref_minimal_utf8",
      );
    } finally {
      await server.stop();
    }
  });

  test("points Prism at a generated OpenAPI file", () => {
    assert.ok(
      jp1Ajs3PrismOpenApiPath.endsWith("jp1Ajs3WebApi.prism.generated.yaml"),
    );
  });

  test("types the request shape without carrying credentials", () => {
    const request: Jp1Ajs3GetUnitListRequest = {
      headers: {
        "Accept-Language": "en",
      },
      query: {
        mode: "search",
        manager: "manager.example.com",
        serviceName: "AJSROOT1",
        location: "/JobGroup",
        searchTarget: "DEFINITION",
      },
    };

    assert.deepStrictEqual(Object.keys(request.query), [
      "mode",
      "manager",
      "serviceName",
      "location",
      "searchTarget",
    ]);
  });
});
