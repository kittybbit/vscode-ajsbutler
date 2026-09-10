import type { SemanticDiffOutputContext } from "../../application/semantic-diff/semanticDiffDto";
import type { SemanticDiffScheduleImpact } from "../../application/semantic-diff/semanticDiffScheduleImpact";

/**
 * Host-private lifetime registry for the immutable calendar projection.
 * Context objects are deliberately used as keys: a structurally equivalent
 * result from another comparison must never resolve this sidecar.
 */
export class ScheduleImpactSidecarRegistry {
  private readonly entries = new Map<
    SemanticDiffOutputContext,
    SemanticDiffScheduleImpact
  >();

  public register(
    context: SemanticDiffOutputContext,
    sidecar: SemanticDiffScheduleImpact,
  ): void {
    this.entries.set(context, sidecar);
  }

  public resolve(
    context: SemanticDiffOutputContext,
  ): SemanticDiffScheduleImpact | undefined {
    return this.entries.get(context);
  }

  public release(context: SemanticDiffOutputContext): boolean {
    return this.entries.delete(context);
  }

  public get size(): number {
    return this.entries.size;
  }

  public clear(): void {
    this.entries.clear();
  }
}

export const createScheduleImpactSidecarRegistry =
  (): ScheduleImpactSidecarRegistry => new ScheduleImpactSidecarRegistry();
