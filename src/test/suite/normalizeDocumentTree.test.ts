import * as assert from "assert";
import { parseAjs } from "../../domain/services/parser/AjsParser";
import { AjsNormalizationWarning } from "../../domain/models/ajs/AjsDocument";
import { normalizeUnitTree } from "../../domain/models/ajs/normalize/documentTree";

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
    el=job-b,qj,+400+144;
    ar=(f=job-a,t=job-b);
    unit=job-a,,jp1admin,;
    {
      ty=j;
      cm="first#"#"##note";
    }
    unit=job-b,,jp1admin,;
    {
      ty=qj;
      eun=job-a;
    }
  }
}
`;

suite("Normalize document tree helpers", () => {
  test("normalizes a unit tree recursively", () => {
    const result = parseAjs(validDefinition);
    assert.deepStrictEqual(result.errors, []);

    const warnings: AjsNormalizationWarning[] = [];
    const normalized = normalizeUnitTree(result.rootUnits[0], warnings);

    assert.deepStrictEqual(warnings, []);
    assert.strictEqual(normalized.name, "root");
    assert.strictEqual(normalized.children[0].name, "jobnet");
    assert.strictEqual(
      normalized.children[0].children[0].comment,
      'first""#note',
    );
    assert.strictEqual(normalized.children[0].children[1].hasWaitedFor, true);
    assert.deepStrictEqual(normalized.children[0].relations, [
      {
        sourceUnitId: "/root/jobnet/job-a",
        targetUnitId: "/root/jobnet/job-b",
        type: "seq",
      },
    ]);
  });
});
