import * as assert from "assert";
import { toUnitDefinitionByPath } from "../../application/unit-definition/unitDefinitionDocument";
import {
  toUnitListDocumentDto,
  toUnitListTableData,
} from "../../application/unit-list/unitListDocument";
import type { AjsDocument } from "../../domain/models/ajs/AjsDocument";
import {
  createTableViewerData,
  findSelectedUnitId,
} from "../../presentation/webview/editor/ajsTable/tableViewerData";

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
      parameters: [
        { key: "ty", value: "n" },
        { key: "cm", value: "root comment" },
      ],
      relations: [],
      children: [],
    },
  ],
  warnings: [],
};

suite("Table viewer data", () => {
  test("indexes application-projected rows and metadata without domain reconstruction", () => {
    const payload = JSON.parse(
      JSON.stringify(toUnitListDocumentDto(document)),
    ) as unknown;
    const tableData = toUnitListTableData(payload);
    assert.ok(tableData);

    const viewerData = createTableViewerData(
      tableData,
      toUnitDefinitionByPath(payload),
    );

    assert.strictEqual(viewerData.rootUnits[0]?.id, "root-id");
    assert.strictEqual(viewerData.rowViewByPath.get("/root")?.id, "root-id");
    assert.strictEqual(
      viewerData.unitById.get("root-id")?.absolutePath,
      "/root",
    );
    assert.deepStrictEqual(
      viewerData.parameterSearchValuesByPath.get("/root"),
      ["n", "root comment"],
    );
    assert.strictEqual(
      findSelectedUnitId("/root", viewerData.unitByAbsolutePath),
      "root-id",
    );
  });

  test("uses an empty safe state for a rejected projection", () => {
    const viewerData = createTableViewerData(undefined, new Map());

    assert.deepStrictEqual(viewerData.rootUnits, []);
    assert.strictEqual(viewerData.rowViewByPath.size, 0);
    assert.strictEqual(viewerData.unitById.size, 0);
    assert.strictEqual(viewerData.parameterSearchValuesByPath.size, 0);
  });
});
