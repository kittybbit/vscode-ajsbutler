import * as assert from "assert";
import { ScheduleImpactSidecarRegistry } from "../../bootstrap/extension/scheduleImpactSidecarRegistry";
import type { SemanticDiffOutputContext } from "../../application/semantic-diff/semanticDiffDto";
import type { SemanticDiffScheduleImpact } from "../../application/semantic-diff/semanticDiffScheduleImpact";

const context = (): SemanticDiffOutputContext => ({
  result: {
    inputs: {
      before: { side: "before", unitIds: [], relations: [] },
      after: { side: "after", unitIds: [], relations: [] },
    },
    changes: [],
    identityDecisions: [],
    confirmationRequired: [],
    unsupportedItems: [],
    limitations: [],
  },
  summary: {} as never,
});

const sidecar = {} as SemanticDiffScheduleImpact;

suite("Schedule impact sidecar registry", () => {
  test("uses exact context identity and releases entries", () => {
    const registry = new ScheduleImpactSidecarRegistry();
    const first = context();
    const equivalent = { ...first } as SemanticDiffOutputContext;
    registry.register(first, sidecar);

    assert.strictEqual(registry.resolve(first), sidecar);
    assert.strictEqual(registry.resolve(equivalent), undefined);
    assert.strictEqual(registry.size, 1);
    assert.strictEqual(registry.release(equivalent), false);
    assert.strictEqual(registry.release(first), true);
    assert.strictEqual(registry.resolve(first), undefined);
  });
});
