import * as assert from "assert";
import { resolveUnitLayout } from "../../domain/models/units/unitLayoutHelpers";

suite("Unit layout helpers", () => {
  test("resolves unit layout from el parameter values", () => {
    assert.deepStrictEqual(
      resolveUnitLayout("job-a", ["job-a,j,+240+144", "job-b,qj,+400+144"]),
      { h: 240, v: 144 },
    );

    assert.deepStrictEqual(
      resolveUnitLayout(".CONDITION", [".CONDITION,rc,+0+0"]),
      { h: 0, v: 0 },
    );
  });

  test("returns default layout when no matching el parameter exists", () => {
    assert.deepStrictEqual(resolveUnitLayout("missing", []), { h: 0, v: 0 });
    assert.deepStrictEqual(resolveUnitLayout("missing", ["job-a,j,+240+144"]), {
      h: 0,
      v: 0,
    });
  });
});
