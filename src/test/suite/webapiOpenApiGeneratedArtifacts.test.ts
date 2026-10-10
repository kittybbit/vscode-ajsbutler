import * as assert from "assert";
import {
  jp1Ajs3GetUnitListOperation,
  type Jp1Ajs3UnitListResponse,
} from "../../infrastructure/webapi/generated/jp1Ajs3WebApi.generated";
import {
  jp1Ajs3DefinitionOnlyUnitListResponse,
  jp1Ajs3GetUnitListMockOperation,
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
});
