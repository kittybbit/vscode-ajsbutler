import * as assert from "assert";
import type { AjsParserPort } from "../../application/parsing/AjsParserPort";
import {
  toAjsDocument,
  toUnitListDocumentDto,
} from "../../application/unit-list/unitListDocument";
import { createBuildUnitList } from "../../application/unit-list/buildUnitList";
import type { AjsDocument } from "../../domain/models/ajs/AjsDocument";
import { Unit } from "../../domain/values/Unit";
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
    assert.ok(result.document?.rootUnits[0].id);
    assert.deepStrictEqual(
      JSON.parse(JSON.stringify(result.document)),
      result.document,
    );
  });

  test("restores the normalized document from the document DTO", () => {
    const result = buildUnitList(validDefinition);
    assert.ok(result.document);

    const document = toAjsDocument(result.document!);
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
    const restored = toAjsDocument(dto);

    assert.deepStrictEqual(dto, document);
    assert.deepStrictEqual(restored, document);
    assert.notStrictEqual(restored.rootUnits[0], document.rootUnits[0]);
    assert.notStrictEqual(
      restored.rootUnits[0].children[0],
      document.rootUnits[0].children[0],
    );
  });

  test("returns undefined for malformed document payloads", () => {
    assert.strictEqual(toAjsDocument({}), undefined);
    assert.strictEqual(
      toAjsDocument({
        rootUnits: [{ unitAttribute: "root,,jp1admin," }],
        warnings: [],
      }),
      undefined,
    );
  });

  test("returns no document when the parser reports errors", () => {
    const invalidDefinition = validDefinition.replace("ty=g;", "ty=g");

    const result = buildUnitList(invalidDefinition);

    assert.strictEqual(result.document, undefined);
    assert.ok(result.errors.length > 0);
  });

  test("builds the DTO through an injected parser port", () => {
    const root = new Unit("root,,jp1admin,");
    const parser: AjsParserPort = {
      parse: () => ({ rootUnits: [root], errors: [] }),
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
        rootUnits: [],
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
