import * as assert from "assert";
import { Cpj } from "../../domain/models/units/Cpj";
import { N } from "../../domain/models/units/N";
import { Qj } from "../../domain/models/units/Qj";
import { parseAjs } from "../../domain/services/parser/AjsParser";
import { tyFactory } from "../../domain/utils/TyUtils";

suite("Unit capability entities", () => {
  test("keeps shared wait-state getters on waitable wrappers", () => {
    const result = parseAjs(`
      pj=/root;
      ty=n;
      {
        ty=cpj;
        nm=extract-env;
        eun=job-a;
        ega=exec;
        uem=y;
      }
    `);

    assert.deepStrictEqual(result.errors, []);
    const root = tyFactory(result.rootUnits[0]) as N;
    const child = root.children[0] as Cpj;

    assert.strictEqual(child.eun?.[0]?.value(), "job-a");
    assert.strictEqual(child.hasWaitedFor, true);
    assert.strictEqual(child.ega?.value(), "exec");
    assert.strictEqual(child.uem?.value(), "y");
  });

  test("keeps shared priority and wait-state behavior on prioritizable wrappers", () => {
    const result = parseAjs(`
      pj=/root;
      ty=n;
      ni=7;
      {
        ty=qj;
        nm=queue-job;
        pr=5;
        eun=job-a;
      }
    `);

    assert.deepStrictEqual(result.errors, []);
    const root = tyFactory(result.rootUnits[0]) as N;
    const child = root.children[0] as Qj;

    assert.strictEqual(root.priority, 7);
    assert.strictEqual(child.priority, 5);
    assert.strictEqual(child.hasWaitedFor, true);
  });
});
