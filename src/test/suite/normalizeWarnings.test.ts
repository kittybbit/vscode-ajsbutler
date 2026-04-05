import * as assert from "assert";
import {
  buildInvalidRelationWarning,
  buildMissingRelationTargetWarning,
  buildMissingUnitTypeWarning,
} from "../../domain/models/ajs/normalize/warnings";

suite("Normalize warning helpers", () => {
  test("builds missing-unit-type warnings", () => {
    assert.deepStrictEqual(buildMissingUnitTypeWarning("/root/job-a"), {
      code: "missing-unit-type",
      message: "Unit type could not be resolved for /root/job-a.",
      unitPath: "/root/job-a",
    });
  });

  test("builds relation warnings", () => {
    assert.deepStrictEqual(buildInvalidRelationWarning("/root/jobnet"), {
      code: "invalid-relation",
      message: "Relation could not be parsed for /root/jobnet.",
      unitPath: "/root/jobnet",
    });
    assert.deepStrictEqual(buildMissingRelationTargetWarning("/root/jobnet"), {
      code: "missing-relation-target",
      message: "Relation target was not found for /root/jobnet.",
      unitPath: "/root/jobnet",
    });
  });
});
