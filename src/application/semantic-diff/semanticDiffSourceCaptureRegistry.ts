import {
  isPlainRecord,
  type SemanticDiffSourceIndexRegistry,
  type SemanticDiffSourceLookupRequest,
  type SemanticDiffSourceLookupResult,
} from "../parsing/AjsParserWithSourceIndexPort";
import type {
  SemanticDiffCaptureScopeId,
  SemanticDiffSourceIndexId,
} from "../parsing/AjsParserWithSourceIndexPort";
import type { SemanticDiffSourceCaptureBinding } from "./semanticDiffSourceCapture";
import type { SemanticDiffSide } from "./semanticDiffDto";

const expiredResult = (): SemanticDiffSourceLookupResult => ({
  code: "expired-source-index",
});

const hasSourceIndexId = (
  request: unknown,
  expectedId: string,
): request is SemanticDiffSourceLookupRequest =>
  isPlainRecord(request) && request.sourceIndexId === expectedId;

export class SemanticDiffSourceCaptureRegistry {
  readonly #registrations = new WeakMap<object, () => void>();
  readonly #activity = new WeakMap<object, () => boolean>();
  readonly #scopeIds = new WeakMap<object, SemanticDiffCaptureScopeId>();
  readonly #indexRegistries = new WeakMap<
    object,
    SemanticDiffSourceIndexRegistry
  >();

  public add(registration: {
    binding: SemanticDiffSourceCaptureBinding;
    scopeId: SemanticDiffCaptureScopeId;
    indexRegistry: SemanticDiffSourceIndexRegistry;
    activate: () => void;
    isActive: () => boolean;
  }): void {
    this.#scopeIds.set(registration.binding, registration.scopeId);
    this.#indexRegistries.set(registration.binding, registration.indexRegistry);
    this.#registrations.set(registration.binding, registration.activate);
    this.#activity.set(registration.binding, registration.isActive);
  }

  public activate(binding: SemanticDiffSourceCaptureBinding): void {
    if (this.#scopeIds.has(binding)) this.#registrations.get(binding)?.();
  }

  public isActive(binding: SemanticDiffSourceCaptureBinding): boolean {
    return this.#activity.get(binding)?.() === true;
  }

  public remove(binding: SemanticDiffSourceCaptureBinding): void {
    this.#indexRegistries.delete(binding);
    this.#activity.delete(binding);
    this.#registrations.delete(binding);
    this.#scopeIds.delete(binding);
  }

  public lookup(
    binding: SemanticDiffSourceCaptureBinding,
    side: SemanticDiffSide,
    request: unknown,
  ): SemanticDiffSourceLookupResult {
    const sourceIndexId = this.isActive(binding)
      ? getBindingSourceIndexId(binding, side)
      : undefined;
    const registry =
      sourceIndexId !== undefined && hasSourceIndexId(request, sourceIndexId)
        ? this.#indexRegistries.get(binding)
        : undefined;
    return (
      registry?.lookup(request as SemanticDiffSourceLookupRequest) ??
      expiredResult()
    );
  }
}

const getBindingSourceIndexId = (
  binding: SemanticDiffSourceCaptureBinding,
  side: SemanticDiffSide,
): SemanticDiffSourceIndexId | undefined => {
  if (side !== "before" && side !== "after") return undefined;
  return binding[side].sourceIndex.sourceIndexId;
};
