import * as assert from "assert";
import type { AjsParserPort } from "../../application/parsing/AjsParserPort";
import { toAjsDocument } from "../../application/unit-list/unitListDocument";
import { createBuildUnitList } from "../../application/unit-list/buildUnitList";
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
    assert.strictEqual(
      job.parameters.find((parameter) => parameter.key === "ty")?.value,
      "j",
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
