import * as assert from "assert";
import { parseAjs } from "../../domain/services/parser/AjsParser";
import { tyFactory } from "../../domain/utils/TyUtils";
import { N } from "../../domain/models/units/N";

const parseJobnets = (): { jobnet: N; subnet: N } => {
  const result = parseAjs(`
    unit=root,,jp1admin,;
    {
      ty=g;
      gty=n;
      el=jobnet,n,+0+0;
      unit=jobnet,,jp1admin,;
      {
        ty=n;
        sd=2024/12/+31;
        el=subnet,n,+160+0;
        unit=subnet,,jp1admin,;
        {
          ty=n;
        }
      }
    }
  `);

  assert.deepStrictEqual(result.errors, []);
  const root = tyFactory(result.rootUnits[0]);
  const jobnet = root.children[0] as N;
  const subnet = jobnet.children[0] as N;

  return { jobnet, subnet };
};

suite("Jobnet entity", () => {
  test("keeps root jobnet schedule and connector defaults local to N", () => {
    const { jobnet, subnet } = parseJobnets();

    assert.strictEqual(jobnet.isRootJobnet, true);
    assert.strictEqual(jobnet.hasSchedule, true);
    assert.strictEqual(jobnet.ncl?.value(), "n");
    assert.strictEqual(jobnet.ncs?.value(), "n");
    assert.strictEqual(jobnet.ncex?.value(), "n");

    assert.strictEqual(subnet.isRootJobnet, false);
    assert.strictEqual(subnet.hasSchedule, false);
    assert.strictEqual(subnet.ncl, undefined);
    assert.strictEqual(subnet.ncs, undefined);
    assert.strictEqual(subnet.ncex, undefined);
  });
});
