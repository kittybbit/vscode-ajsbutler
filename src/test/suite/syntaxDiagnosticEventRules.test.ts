import * as assert from "assert";
import {
  hasValidExplicitEventReceivingFilterReference,
  hasValidExplicitEventReceivingTimeoutCondition,
} from "../../domain/services/diagnostics/EventDiagnosticRules";
import type { AjsParameter } from "../../domain/models/ajs/AjsDocument";

const parameter = (key: string, value: string): AjsParameter => ({
  key,
  value,
});

const evtmc = (value: string): AjsParameter => parameter("evtmc", value);
const evwfr = (value: string): AjsParameter => parameter("evwfr", value);

suite("Syntax Diagnostic Event Rules", () => {
  test("validates event receiving filter references", () => {
    assert.strictEqual(
      hasValidExplicitEventReceivingFilterReference(
        evwfr('?AJS2.EVENT?:"value"'),
      ),
      true,
    );
    assert.strictEqual(
      hasValidExplicitEventReceivingFilterReference(
        evwfr('attribute:"value##with#""'),
      ),
      true,
    );
    assert.strictEqual(
      hasValidExplicitEventReceivingFilterReference(
        evwfr(`${"a".repeat(2049)}:"value"`),
      ),
      true,
    );
  });

  test("rejects invalid event receiving filter references", () => {
    assert.strictEqual(
      hasValidExplicitEventReceivingFilterReference(evwfr("")),
      false,
    );
    assert.strictEqual(
      hasValidExplicitEventReceivingFilterReference(evwfr("attribute:value")),
      false,
    );
    assert.strictEqual(
      hasValidExplicitEventReceivingFilterReference(evwfr(':"value"')),
      false,
    );
  });

  test("validates event receiving timeout conditions", () => {
    assert.strictEqual(
      hasValidExplicitEventReceivingTimeoutCondition(evtmc("n")),
      true,
    );
    assert.strictEqual(
      hasValidExplicitEventReceivingTimeoutCondition(evtmc("a")),
      true,
    );
    assert.strictEqual(
      hasValidExplicitEventReceivingTimeoutCondition(
        evtmc('d:"/tmp/result.txt"'),
      ),
      true,
    );
    assert.strictEqual(
      hasValidExplicitEventReceivingTimeoutCondition(evtmc('b:"name##with#""')),
      true,
    );
  });

  test("rejects invalid event receiving timeout conditions", () => {
    assert.strictEqual(
      hasValidExplicitEventReceivingTimeoutCondition(evtmc("")),
      false,
    );
    assert.strictEqual(
      hasValidExplicitEventReceivingTimeoutCondition(evtmc("d")),
      false,
    );
    assert.strictEqual(
      hasValidExplicitEventReceivingTimeoutCondition(evtmc('x:"file"')),
      false,
    );
    assert.strictEqual(
      hasValidExplicitEventReceivingTimeoutCondition(evtmc('d:""')),
      false,
    );
  });
});
