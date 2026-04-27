import * as assert from "assert";
import { DEFAULTS } from "../../domain/models/parameters/Defaults";
import { resolveJobEndJudgmentDefaultRawValue } from "../../domain/models/parameters/jobEndJudgmentHelpers";

suite("Job end judgment helpers", () => {
  test("resolves the JP1/AJS3 v13 default end judgment mode", () => {
    assert.strictEqual(resolveJobEndJudgmentDefaultRawValue(), DEFAULTS.Jd);
    assert.strictEqual(resolveJobEndJudgmentDefaultRawValue(), "cod");
  });
});
