import * as assert from "assert";
import {
  findAjsUnitAncestors,
  findAjsUnitParameter,
  findAjsUnitParameterValue,
  findAjsUnitParameterValues,
  findAjsUnitById,
  findInheritedAjsUnitParameter,
  findInheritedAjsUnitParameterValue,
  findInheritedAjsUnitParameters,
  findParentAjsUnit,
  findRootJobnet,
} from "../../domain/models/ajs/AjsDocument";
import { normalizeAjsDocument } from "../../domain/models/ajs/normalizeAjsDocument";
import { parseAjs } from "../../domain/services/parser/AjsParser";

const validDefinition = `
unit=root,,jp1admin,;
{
  ty=g;
  gty=n;
  el=jobnet,n,+0+0;
  unit=jobnet,,jp1admin,;
  {
    ty=n;
    pr=4;
    op=mo:1;
    op=2024/01/01;
    el=job-a,j,+240+144;
    unit=job-a,,jp1admin,;
    {
      ty=j;
    }
  }
}
`;

suite("AjsDocument helpers", () => {
  test("finds parent, ancestors, and root jobnet from the normalized model", () => {
    const result = parseAjs(validDefinition);
    assert.deepStrictEqual(result.errors, []);
    const document = normalizeAjsDocument(result.rootUnits);

    const root = document.rootUnits[0];
    const jobnet = root.children[0];
    const job = jobnet.children[0];

    assert.strictEqual(findRootJobnet(document)?.id, jobnet.id);
    assert.strictEqual(findAjsUnitById(document, job.id)?.absolutePath, job.id);
    assert.strictEqual(findParentAjsUnit(document, job)?.id, jobnet.id);
    assert.deepStrictEqual(
      findAjsUnitAncestors(document, job).map((unit) => unit.id),
      [jobnet.id, root.id],
    );
  });

  test("finds direct and inherited parameters from the normalized model", () => {
    const result = parseAjs(validDefinition);
    assert.deepStrictEqual(result.errors, []);
    const document = normalizeAjsDocument(result.rootUnits);

    const jobnet = document.rootUnits[0].children[0];
    const job = jobnet.children[0];

    assert.strictEqual(findAjsUnitParameter(jobnet, "pr")?.value, "4");
    assert.strictEqual(findAjsUnitParameterValue(jobnet, "pr"), "4");
    assert.deepStrictEqual(findAjsUnitParameterValues(jobnet, "op"), [
      "mo:1",
      "2024/01/01",
    ]);
    assert.strictEqual(
      findInheritedAjsUnitParameter(document, job, "pr")?.value,
      "4",
    );
    assert.strictEqual(
      findInheritedAjsUnitParameterValue(document, job, "pr"),
      "4",
    );
    assert.deepStrictEqual(
      findInheritedAjsUnitParameters(document, job, "op")?.map(
        (parameter) => parameter.value,
      ),
      ["mo:1", "2024/01/01"],
    );
  });
});
