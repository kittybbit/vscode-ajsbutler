import * as assert from "assert";
import { resolveTopDefaultRawValue } from "../../domain/models/parameters/transferOperationHelpers";

suite("Transfer operation helpers", () => {
  test("derives the transfer operation default from source and destination presence", () => {
    const transfer = {
      ts1: "source-1",
      td1: "destination-1",
      ts2: "source-2",
      ts3: "source-3",
    };

    assert.strictEqual(resolveTopDefaultRawValue(transfer, 1), "sav");
    assert.strictEqual(resolveTopDefaultRawValue(transfer, 2), "del");
    assert.strictEqual(resolveTopDefaultRawValue(transfer, 3), "del");
    assert.strictEqual(resolveTopDefaultRawValue(transfer, 4), undefined);
  });
});
