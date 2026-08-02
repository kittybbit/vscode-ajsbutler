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

  test("indexes a bounded large projection without losing row identity", () => {
    const childCount = 500;
    const rootUnit = document.rootUnits[0]!;
    const largeDocument: AjsDocument = {
      ...document,
      rootUnits: [
        {
          ...rootUnit,
          children: Array.from({ length: childCount }, (_, index) => ({
            ...rootUnit,
            id: `job-${index}`,
            name: `job-${index}`,
            unitAttribute: `job-${index},,jp1admin,`,
            unitType: "j",
            absolutePath: `/root/job-${index}`,
            depth: 1,
            isRoot: false,
            isRootJobnet: false,
            parameters: [{ key: "ty", value: "j" }],
            children: [],
          })),
        },
      ],
    };
    const payload = JSON.parse(
      JSON.stringify(toUnitListDocumentDto(largeDocument)),
    ) as unknown;
    const tableData = toUnitListTableData(payload);
    assert.ok(tableData);

    const viewerData = createTableViewerData(tableData, new Map());

    assert.strictEqual(viewerData.rowViewByPath.size, childCount + 1);
    assert.strictEqual(viewerData.rowViewByPath.get("/root")?.id, rootUnit.id);
    assert.strictEqual(
      viewerData.rowViewByPath.get(`/root/job-${childCount - 1}`)?.id,
      `job-${childCount - 1}`,
    );
    assert.strictEqual(viewerData.unitById.size, childCount + 1);
  });

  test("uses an empty safe state for a rejected projection", () => {
    const viewerData = createTableViewerData(undefined, new Map());

    assert.deepStrictEqual(viewerData.rootUnits, []);
    assert.strictEqual(viewerData.rowViewByPath.size, 0);
    assert.strictEqual(viewerData.unitById.size, 0);
    assert.strictEqual(viewerData.parameterSearchValuesByPath.size, 0);
  });

  test("fails closed when a serialized row record is malformed", () => {
    const payload = JSON.parse(
      JSON.stringify(toUnitListDocumentDto(document)),
    ) as {
      unitList: {
        rows: Array<{ group2: { previousUnits: unknown[] } }>;
      };
    };
    payload.unitList.rows[0].group2.previousUnits = [{}];

    const tableData = toUnitListTableData(payload);
    assert.strictEqual(tableData, undefined);

    const viewerData = createTableViewerData(tableData, new Map());
    assert.deepStrictEqual(viewerData.rootUnits, []);
    assert.strictEqual(viewerData.rowViewByPath.size, 0);
    assert.strictEqual(viewerData.unitById.size, 0);
    assert.strictEqual(viewerData.unitByAbsolutePath.size, 0);
  });
});
