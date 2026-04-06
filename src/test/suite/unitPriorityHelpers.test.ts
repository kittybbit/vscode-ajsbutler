import * as assert from "assert";
import { parseAjs } from "../../domain/services/parser/AjsParser";
import { tyFactory } from "../../domain/utils/TyUtils";
import { J } from "../../domain/models/units/J";
import { N } from "../../domain/models/units/N";
import {
  resolveUnitPriority,
  type PrioritizableUnit,
} from "../../domain/models/units/unitPriorityHelpers";

suite("Unit priority helpers", () => {
  test("prefers explicit pr over inherited parent priority", () => {
    const result = parseAjs(`
      pj=/root;
      ty=n;
      ni=7;
      {
        ty=j;
        nm=job1;
        pr=5;
      }
    `);

    assert.deepStrictEqual(result.errors, []);
    const root = tyFactory(result.rootUnits[0]) as N;
    const child = root.children[0] as J;
    assert.strictEqual(resolveUnitPriority(child), 5);
  });

  test("inherits parent priority when no explicit child priority exists", () => {
    const result = parseAjs(`
      pj=/root;
      ty=n;
      ni=7;
      {
        ty=j;
        nm=job1;
      }
    `);

    assert.deepStrictEqual(result.errors, []);
    const root = tyFactory(result.rootUnits[0]) as N;
    const child = root.children[0] as J;
    assert.strictEqual(resolveUnitPriority(child), 7);
  });

  test("falls back to the default priority when no source is present", () => {
    const result = parseAjs(`
      pj=/root;
      ty=n;
      {
        ty=j;
        nm=job1;
      }
    `);

    assert.deepStrictEqual(result.errors, []);
    const root = tyFactory(result.rootUnits[0]) as N;
    const child = root.children[0] as J;
    assert.strictEqual(resolveUnitPriority(child), 1);
  });

  test("accepts prioritizable unit shapes through the shared interface", () => {
    const unit = {
      pr: undefined,
      ni: {
        inherited: false,
        priority: 4,
      },
      parent: undefined,
      priority: 4,
    } as PrioritizableUnit;

    assert.strictEqual(resolveUnitPriority(unit), 4);
  });
});
