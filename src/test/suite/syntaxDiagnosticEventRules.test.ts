import * as assert from "assert";
import {
  isValidExplicitEventReceivingFilterReference,
  isValidExplicitEventReceivingTimeoutCondition,
} from "../../application/editor-feedback/syntaxDiagnosticEventRules";
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
      isValidExplicitEventReceivingFilterReference(
        evwfr('?AJS2.EVENT?:"value"'),
      ),
      true,
    );
    assert.strictEqual(
      isValidExplicitEventReceivingFilterReference(
        evwfr('attribute:"value##with#""'),
      ),
      true,
    );
    assert.strictEqual(
      isValidExplicitEventReceivingFilterReference(
        evwfr(`${"a".repeat(2049)}:"value"`),
      ),
      true,
    );
  });

  test("rejects invalid event receiving filter references", () => {
    assert.strictEqual(
      isValidExplicitEventReceivingFilterReference(undefined),
      false,
    );
    assert.strictEqual(
      isValidExplicitEventReceivingFilterReference(evwfr("")),
      false,
    );
    assert.strictEqual(
      isValidExplicitEventReceivingFilterReference(evwfr("attribute:value")),
      false,
    );
    assert.strictEqual(
      isValidExplicitEventReceivingFilterReference(evwfr(':"value"')),
      false,
    );
  });

  test("validates event receiving timeout conditions", () => {
    assert.strictEqual(
      isValidExplicitEventReceivingTimeoutCondition(evtmc("n")),
      true,
    );
    assert.strictEqual(
      isValidExplicitEventReceivingTimeoutCondition(evtmc("a")),
      true,
    );
    assert.strictEqual(
      isValidExplicitEventReceivingTimeoutCondition(
        evtmc('d:"/tmp/result.txt"'),
      ),
      true,
    );
    assert.strictEqual(
      isValidExplicitEventReceivingTimeoutCondition(evtmc('b:"name##with#""')),
      true,
    );
  });

  test("rejects invalid event receiving timeout conditions", () => {
    assert.strictEqual(
      isValidExplicitEventReceivingTimeoutCondition(undefined),
      false,
    );
    assert.strictEqual(
      isValidExplicitEventReceivingTimeoutCondition(evtmc("")),
      false,
    );
    assert.strictEqual(
      isValidExplicitEventReceivingTimeoutCondition(evtmc("d")),
      false,
    );
    assert.strictEqual(
      isValidExplicitEventReceivingTimeoutCondition(evtmc('x:"file"')),
      false,
    );
    assert.strictEqual(
      isValidExplicitEventReceivingTimeoutCondition(evtmc('d:""')),
      false,
    );
  });
});
