import * as assert from "assert";
import { isValidExplicitEventReceivingTimeoutCondition } from "../../application/editor-feedback/syntaxDiagnosticEventRules";
import type { UnitParameter } from "../../domain/values/Unit";

const parameter = (value: string): UnitParameter => ({ key: "evtmc", value });

suite("Syntax Diagnostic Event Rules", () => {
  test("validates event receiving timeout conditions", () => {
    assert.strictEqual(
      isValidExplicitEventReceivingTimeoutCondition(parameter("n")),
      true,
    );
    assert.strictEqual(
      isValidExplicitEventReceivingTimeoutCondition(parameter("a")),
      true,
    );
    assert.strictEqual(
      isValidExplicitEventReceivingTimeoutCondition(
        parameter('d:"/tmp/result.txt"'),
      ),
      true,
    );
    assert.strictEqual(
      isValidExplicitEventReceivingTimeoutCondition(
        parameter('b:"name##with#""'),
      ),
      true,
    );
  });

  test("rejects invalid event receiving timeout conditions", () => {
    assert.strictEqual(
      isValidExplicitEventReceivingTimeoutCondition(undefined),
      false,
    );
    assert.strictEqual(
      isValidExplicitEventReceivingTimeoutCondition(parameter("")),
      false,
    );
    assert.strictEqual(
      isValidExplicitEventReceivingTimeoutCondition(parameter("d")),
      false,
    );
    assert.strictEqual(
      isValidExplicitEventReceivingTimeoutCondition(parameter('x:"file"')),
      false,
    );
    assert.strictEqual(
      isValidExplicitEventReceivingTimeoutCondition(parameter('d:""')),
      false,
    );
  });
});
