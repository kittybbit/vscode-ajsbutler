import * as assert from "assert";
import { parseAjs } from "../../domain/services/parser/AjsParser";
import { normalizeAjsDocument } from "../../domain/models/ajs/normalizeAjsDocument";

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
    el=.CONDITION,rc,+0+0;
    ar=(f=job-a,t=job-b);
    ar=(f=.CONDITION,t=job-a,con);
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
    unit=.CONDITION,,jp1admin,;
    {
      ty=rc;
    }
  }
}
`;

suite("Normalize AJS Document", () => {
  test("creates a stable document model with units and dependencies", () => {
    const result = parseAjs(validDefinition);
    assert.deepStrictEqual(result.errors, []);

    const document = normalizeAjsDocument(result.rootUnits);

    assert.strictEqual(document.warnings.length, 0);
    assert.strictEqual(document.rootUnits.length, 1);
    const root = document.rootUnits[0];
    assert.strictEqual(root.name, "root");
    assert.strictEqual(root.unitType, "g");
    assert.strictEqual(root.groupType, "n");
    assert.strictEqual(root.children[0].isRecovery, false);
    assert.strictEqual(root.children[0].name, "jobnet");
    assert.strictEqual(root.children[0].isRootJobnet, true);
    assert.strictEqual(root.children[0].children[0].comment, 'first""#note');
    assert.deepStrictEqual(root.children[0].children[0].layout, {
      h: 240,
      v: 144,
    });
    assert.strictEqual(root.children[0].children[2].isRecovery, undefined);
    assert.deepStrictEqual(
      root.children[0].children
        .flatMap((child) => child.dependencies)
        .map((dependency) => dependency.type),
      ["seq", "con"],
    );
  });
});
