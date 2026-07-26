import * as assert from "assert";
import type { AjsParserPort } from "../../application/parsing/AjsParserPort";
import {
  toUnitListDocumentDto,
  toUnitListTableData,
} from "../../application/unit-list/unitListDocument";
import { validateFlowGraphDocument } from "../../application/flow-graph/flowGraphDocument";
import { createBuildUnitList } from "../../application/unit-list/buildUnitList";
import { toUnitDefinitionByPath } from "../../application/unit-definition/unitDefinitionDocument";
import type { AjsDocument } from "../../domain/models/ajs/AjsDocument";
import { createViewerDocumentChangedMessage } from "../../presentation/webview/viewerHostMessages";
import { assertPlainJsonValue } from "../support/plainJson";
import { testAjsParser } from "../support/parseAjs";

const validDefinition = `
unit=root,,jp1admin,;
{
  ty=g;
  el=jobnet,n,+0+0;
  unit=jobnet,,jp1admin,;
  {
    ty=n;
    el=job,j,+0+0;
    unit=job,,jp1admin,;
    {
      ty=j;
    }
  }
}
`;

suite("Build Unit List", () => {
  const buildUnitList = createBuildUnitList(testAjsParser);

  test("builds a document DTO without parent references", () => {
    const result = buildUnitList(validDefinition);

    assert.deepStrictEqual(result.errors, []);
    assert.ok(result.document);
    assert.strictEqual(result.document?.rootUnits.length, 1);
    assert.strictEqual(
      result.document?.rootUnits[0].unitAttribute,
      "root,,jp1admin,",
    );
    assert.ok(!("parent" in result.document!.rootUnits[0]));
    assert.ok(!("parent" in result.document!.rootUnits[0].children[0]));
    assert.strictEqual(result.document?.warnings.length, 0);
    assert.strictEqual(result.document?.unitDefinitions.length, 3);
    assert.strictEqual(result.document?.unitList.rows.length, 3);
    assert.deepStrictEqual(
      result.document?.unitList.units.map(
        ({ absolutePath, parameterSearchValues }) => ({
          absolutePath,
          parameterSearchValues,
        }),
      ),
      [
        { absolutePath: "/root", parameterSearchValues: ["g"] },
        { absolutePath: "/root/jobnet", parameterSearchValues: ["n"] },
        { absolutePath: "/root/jobnet/job", parameterSearchValues: ["j"] },
      ],
    );
    assert.strictEqual(
      toUnitDefinitionByPath(result.document).get("/root/jobnet/job")?.rawData,
      "ty=j",
    );
    assert.ok(result.document?.rootUnits[0].id);
    assert.deepStrictEqual(
      JSON.parse(JSON.stringify(result.document)),
      result.document,
    );
  });

  test("validates the flow document from the shared document DTO", () => {
    const result = buildUnitList(validDefinition);
    assert.ok(result.document);

    const validation = validateFlowGraphDocument(result.document);
    assert.strictEqual(validation.status, "available");
    assert.ok(validation.status === "available");
    const document = validation.document;
    const root = document.rootUnits[0];
    const jobnet = root.children[0];
    const job = jobnet.children[0];

    assert.strictEqual(document.rootUnits.length, 1);
    assert.strictEqual(root.name, "root");
    assert.strictEqual(jobnet.name, "jobnet");
    assert.strictEqual(job.name, "job");
    assert.strictEqual(jobnet.parentId, root.id);
    assert.strictEqual(job.parentId, jobnet.id);
    assert.strictEqual(job.absolutePath, "/root/jobnet/job");
    assert.deepStrictEqual(job.layout, { h: 0, v: 0 });
    assert.strictEqual(
      job.parameters.find((parameter) => parameter.key === "ty")?.value,
      "j",
    );
  });

  test("preserves normalized relation and warning data in the document DTO", () => {
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
          layout: { h: 1, v: 2 },
          parameters: [{ key: "ty", value: "n" }],
          relations: [
            {
              sourceUnitId: "root-id",
              targetUnitId: "child-id",
              type: "seq",
            },
          ],
          children: [
            {
              id: "child-id",
              name: "child",
              unitAttribute: "child,,jp1admin,",
              unitType: "j",
              absolutePath: "/root/child",
              depth: 1,
              parentId: "root-id",
              isRoot: false,
              isRootJobnet: false,
              hasSchedule: false,
              hasWaitedFor: false,
              layout: { h: 3, v: 4 },
              parameters: [{ key: "ty", value: "j" }],
              relations: [],
              children: [],
            },
          ],
        },
      ],
      warnings: [
        {
          code: "missing_relation_target",
          message: "relation target was not found",
          unitPath: "/root",
        },
      ],
    };

    const dto = toUnitListDocumentDto(document);
    const validation = validateFlowGraphDocument(dto);
    assert.strictEqual(validation.status, "available");
    assert.ok(validation.status === "available");
    const restored = validation.document;

    assert.deepStrictEqual(dto.rootUnits, document.rootUnits);
    assert.deepStrictEqual(dto.warnings, document.warnings);
    assert.deepStrictEqual(
      dto.unitDefinitions.map(({ absolutePath, rawData }) => ({
        absolutePath,
        rawData,
      })),
      [
        { absolutePath: "/root", rawData: "ty=n" },
        { absolutePath: "/root/child", rawData: "ty=j" },
      ],
    );
    assert.deepStrictEqual(restored.rootUnits, document.rootUnits);
    assert.notStrictEqual(restored.rootUnits[0], document.rootUnits[0]);
    assert.notStrictEqual(
      restored.rootUnits[0].children[0],
      document.rootUnits[0].children[0],
    );
  });

  test("returns unavailable for malformed flow document payloads", () => {
    assert.strictEqual(validateFlowGraphDocument({}).status, "unavailable");
    assert.strictEqual(
      validateFlowGraphDocument({
        rootUnits: [{ unitAttribute: "root,,jp1admin," }],
        warnings: [],
      }).status,
      "unavailable",
    );
  });

  test("restores list data when serialized definitions are malformed", () => {
    const payload = {
      rootUnits: [],
      warnings: [],
      unitDefinitions: [
        {
          absolutePath: "/root/broken",
          rawData: "ty=j",
          commands: [{ id: "ajsshow" }],
          commandBuilders: [],
        },
      ],
    };

    const validation = validateFlowGraphDocument(payload);
    assert.strictEqual(validation.status, "available");
    assert.ok(validation.status === "available");
    assert.deepStrictEqual(validation.document, { rootUnits: [] });
    assert.strictEqual(toUnitDefinitionByPath(payload).size, 0);
  });

  test("rejects incomplete or reordered table projections", () => {
    const result = buildUnitList(validDefinition);
    assert.ok(result.document);
    const document = result.document!;

    assert.strictEqual(
      toUnitListTableData({
        ...document,
        unitList: {
          ...document.unitList,
          rows: document.unitList.rows.slice(1),
        },
      }),
      undefined,
    );
    assert.strictEqual(
      toUnitListTableData({
        ...document,
        unitList: {
          ...document.unitList,
          units: [...document.unitList.units].reverse(),
        },
      }),
      undefined,
    );
  });

  test("rejects corrupt fields and inconsistent projection metadata", () => {
    const result = buildUnitList(validDefinition);
    assert.ok(result.document);
    const cloneDocument = () =>
      JSON.parse(JSON.stringify(result.document)) as typeof result.document;

    const invalidComment = cloneDocument()!;
    invalidComment.unitList.rows[0].group2.comment = {} as string;
    assert.strictEqual(toUnitListTableData(invalidComment), undefined);

    const invalidRecoveryFlag = cloneDocument()!;
    invalidRecoveryFlag.unitList.rows[0].group3.isRecovery = {} as boolean;
    assert.strictEqual(toUnitListTableData(invalidRecoveryFlag), undefined);

    const invalidUnitType = cloneDocument()!;
    invalidUnitType.unitList.units[0].unitType = "invalid" as "g";
    assert.strictEqual(toUnitListTableData(invalidUnitType), undefined);

    const inconsistentName = cloneDocument()!;
    inconsistentName.unitList.units[0].name = "different-root";
    assert.strictEqual(toUnitListTableData(inconsistentName), undefined);

    const inconsistentParent = cloneDocument()!;
    inconsistentParent.unitList.units[1].parentId = "different-parent";
    assert.strictEqual(toUnitListTableData(inconsistentParent), undefined);

    const inconsistentGroupType = cloneDocument()!;
    inconsistentGroupType.unitList.rows[0].group1.groupType = "n";
    assert.strictEqual(toUnitListTableData(inconsistentGroupType), undefined);

    const inconsistentRecovery = cloneDocument()!;
    inconsistentRecovery.unitList.rows[0].group3.isRecovery = true;
    assert.strictEqual(toUnitListTableData(inconsistentRecovery), undefined);

    const inconsistentParentPath = cloneDocument()!;
    inconsistentParentPath.unitList.rows[1].group1.parentAbsolutePath = "/bad";
    assert.strictEqual(toUnitListTableData(inconsistentParentPath), undefined);
  });

  test("keeps a representative large projection deterministic", () => {
    const childCount = 500;
    const childDefinitions = Array.from(
      { length: childCount },
      (_, index) => `unit=job-${index},,jp1admin,;{ty=j;}`,
    ).join("\n");
    const definition = `unit=root,,jp1admin,;{ty=g;${childDefinitions}}`;

    const result = buildUnitList(definition);

    assert.deepStrictEqual(result.errors, []);
    assert.strictEqual(result.document?.unitList.rows.length, childCount + 1);
    assert.strictEqual(
      result.document?.unitList.rows[0]?.absolutePath,
      "/root",
    );
    assert.strictEqual(
      result.document?.unitList.rows.at(-1)?.absolutePath,
      `/root/job-${childCount - 1}`,
    );
    const message = createViewerDocumentChangedMessage(result.document);
    assertPlainJsonValue(message);
    assert.deepStrictEqual(JSON.parse(JSON.stringify(message)), message);
    assert.strictEqual(message.data?.unitList.rows.length, childCount + 1);
  });

  test("returns no document when the parser reports errors", () => {
    const invalidDefinition = validDefinition.replace("ty=g;", "ty=g");

    const result = buildUnitList(invalidDefinition);

    assert.strictEqual(result.document, undefined);
    assert.ok(result.errors.length > 0);
  });

  test("builds the DTO through an injected parser port", () => {
    const parseResult = testAjsParser.parse(validDefinition);
    assert.strictEqual(parseResult.ok, true);
    const parser: AjsParserPort = {
      parse: () => parseResult,
    };

    const result = createBuildUnitList(parser)("ignored");

    assert.strictEqual(
      result.document?.rootUnits[0].unitAttribute,
      "root,,jp1admin,",
    );
  });

  test("returns repository-owned errors from an injected parser port", () => {
    const parser: AjsParserPort = {
      parse: () => ({
        ok: false,
        errors: [{ line: 2, column: 3, message: "invalid syntax" }],
      }),
    };

    const result = createBuildUnitList(parser)("ignored");

    assert.deepStrictEqual(result.errors, [
      { line: 2, column: 3, message: "invalid syntax" },
    ]);
    assert.strictEqual(result.document, undefined);
  });
});
