import * as assert from "assert";
import { toUnitListDocumentDto } from "../../application/unit-list/unitListDocument";
import type { AjsDocument } from "../../domain/models/ajs/AjsDocument";
import { resolveFlowDocumentChange } from "../../presentation/webview/editor/ajsFlow/useFlowViewerEffects";
import { parseTableDocumentState } from "../../presentation/webview/editor/ajsTable/TableContents";

const document: AjsDocument = {
  rootUnits: [
    {
      id: "root-id",
      name: "root",
      unitAttribute: "root,,jp1admin,",
      unitType: "n",
      absolutePath: "/root",
      depth: 0,
      isRoot: true,
      isRootJobnet: true,
      hasSchedule: false,
      hasWaitedFor: false,
      layout: { h: 0, v: 0 },
      parameters: [{ key: "ty", value: "n" }],
      relations: [],
      children: [],
    },
  ],
  warnings: [],
};

suite("Unit definition document state", () => {
  test("table and flow resolve the same serialized definition payload", () => {
    const payload = JSON.parse(
      JSON.stringify(toUnitListDocumentDto(document)),
    ) as unknown;

    const tableState = parseTableDocumentState(payload);
    const flowState = resolveFlowDocumentChange(payload, undefined);

    assert.deepStrictEqual(
      tableState.unitDefinitionByPath.get("/root"),
      flowState.unitDefinitionByPath.get("/root"),
    );
    assert.strictEqual(tableState.tableData?.rows.length, 1);
    assert.strictEqual(flowState.ajsDocument?.rootUnits.length, 1);
    assert.strictEqual(flowState.currentUnitId, "root-id");
  });

  test("malformed definitions do not prevent table or flow document state", () => {
    const payload = {
      ...toUnitListDocumentDto(document),
      unitDefinitions: [{ absolutePath: "/root", rawData: "ty=n" }],
    };

    const tableState = parseTableDocumentState(payload);
    const flowState = resolveFlowDocumentChange(payload, undefined);

    assert.strictEqual(tableState.tableData?.rows.length, 1);
    assert.strictEqual(flowState.ajsDocument?.rootUnits.length, 1);
    assert.strictEqual(tableState.unitDefinitionByPath.size, 0);
    assert.strictEqual(flowState.unitDefinitionByPath.size, 0);
  });

  test("malformed table projection fails closed without breaking flow state", () => {
    const validPayload = toUnitListDocumentDto(document);
    const payload = {
      ...validPayload,
      unitList: { ...validPayload.unitList, rows: [] },
    };

    const tableState = parseTableDocumentState(payload);
    const flowState = resolveFlowDocumentChange(payload, undefined);

    assert.strictEqual(tableState.tableData, undefined);
    assert.strictEqual(flowState.ajsDocument?.rootUnits.length, 1);
    assert.strictEqual(flowState.currentUnitId, "root-id");
  });
});
