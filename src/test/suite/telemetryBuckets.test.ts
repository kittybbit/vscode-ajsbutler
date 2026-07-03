import * as assert from "assert";
import {
  toCountBucket,
  toDurationBucket,
  toHttpStatusCategory,
} from "../../application/telemetry/telemetryBuckets";

suite("Telemetry buckets", () => {
  test("maps durations to coarse stable buckets", () => {
    assert.strictEqual(toDurationBucket(-1), "unknown");
    assert.strictEqual(toDurationBucket(Number.NaN), "unknown");
    assert.strictEqual(toDurationBucket(99), "lt100ms");
    assert.strictEqual(toDurationBucket(100), "100_499ms");
    assert.strictEqual(toDurationBucket(499), "100_499ms");
    assert.strictEqual(toDurationBucket(500), "500_999ms");
    assert.strictEqual(toDurationBucket(999), "500_999ms");
    assert.strictEqual(toDurationBucket(1000), "1_4s");
    assert.strictEqual(toDurationBucket(4999), "1_4s");
    assert.strictEqual(toDurationBucket(5000), "5_14s");
    assert.strictEqual(toDurationBucket(14999), "5_14s");
    assert.strictEqual(toDurationBucket(15000), "15s_plus");
  });

  test("maps counts to coarse stable buckets", () => {
    assert.strictEqual(toCountBucket(-1), "unknown");
    assert.strictEqual(toCountBucket(Number.POSITIVE_INFINITY), "unknown");
    assert.strictEqual(toCountBucket(0), "0");
    assert.strictEqual(toCountBucket(1), "1");
    assert.strictEqual(toCountBucket(2), "2_9");
    assert.strictEqual(toCountBucket(9), "2_9");
    assert.strictEqual(toCountBucket(10), "10_99");
    assert.strictEqual(toCountBucket(99), "10_99");
    assert.strictEqual(toCountBucket(100), "100_999");
    assert.strictEqual(toCountBucket(999), "100_999");
    assert.strictEqual(toCountBucket(1000), "1000_plus");
  });

  test("maps HTTP status codes to anonymous status classes", () => {
    assert.strictEqual(toHttpStatusCategory(undefined), "none");
    assert.strictEqual(toHttpStatusCategory(Number.NaN), "unknown");
    assert.strictEqual(toHttpStatusCategory(99), "unknown");
    assert.strictEqual(toHttpStatusCategory(100), "1xx");
    assert.strictEqual(toHttpStatusCategory(204), "2xx");
    assert.strictEqual(toHttpStatusCategory(302), "3xx");
    assert.strictEqual(toHttpStatusCategory(404), "4xx");
    assert.strictEqual(toHttpStatusCategory(503), "5xx");
    assert.strictEqual(toHttpStatusCategory(600), "unknown");
  });
});
