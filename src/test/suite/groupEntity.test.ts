import * as assert from "assert";
import { parseAjs } from "../../domain/services/parser/AjsParser";
import { tyFactory } from "../../domain/utils/TyUtils";
import { G } from "../../domain/models/units/G";

const parseRootGroup = (): G => {
  const result = parseAjs(`
    unit=root,,jp1admin,;
    {
      ty=g;
      gty=p;
      op=mo;
      cl=tu;
    }
  `);

  assert.deepStrictEqual(result.errors, []);
  return tyFactory(result.rootUnits[0]) as G;
};

suite("Group entity", () => {
  test("keeps planning and week semantics local to the group wrapper", () => {
    const group = parseRootGroup();

    assert.strictEqual(group.isPlanning(), true);
    assert.strictEqual(group.mo, true);
    assert.strictEqual(group.tu, false);
    assert.strictEqual(group.we, undefined);
  });

  test("keeps connector control defaults local to the group wrapper", () => {
    const group = parseRootGroup();

    assert.strictEqual(group.ncl?.value(), "n");
    assert.strictEqual(group.ncs?.value(), "n");
    assert.strictEqual(group.ncex?.value(), "n");
  });
});
