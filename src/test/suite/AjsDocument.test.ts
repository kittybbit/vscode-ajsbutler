import * as assert from "assert";
import {
  findAjsUnitAncestors,
  findAjsUnitById,
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
});
