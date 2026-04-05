import * as assert from "assert";
import { parseAjs } from "../../domain/services/parser/AjsParser";
import { tyFactory } from "../../domain/utils/TyUtils";
import { N } from "../../domain/models/units/N";
import { J } from "../../domain/models/units/J";
import { Qj } from "../../domain/models/units/Qj";

suite("Waitable unit entity", () => {
  test("provides shared hasWaitedFor behavior through inheritance", () => {
    const result = parseAjs(`
      pj=/root;
      ty=n;
      {
        ty=j;
        nm=job1;
      }
      {
        ty=qj;
        nm=job2;
        eun=job1;
      }
    `);

    assert.deepStrictEqual(result.errors, []);

    const root = tyFactory(result.rootUnits[0]) as N;
    const job1 = root.children[0] as J;
    const job2 = root.children[1] as Qj;

    assert.strictEqual(root.hasWaitedFor, false);
    assert.strictEqual(job1.hasWaitedFor, false);
    assert.strictEqual(job2.hasWaitedFor, true);
  });
});
