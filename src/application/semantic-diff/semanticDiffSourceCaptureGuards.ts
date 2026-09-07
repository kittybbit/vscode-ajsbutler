import { isSemanticDiffSourceHandleId } from "../parsing/AjsParserWithSourceIndexPort";
import { hasExactKeys } from "../parsing/semanticDiffSourceIndexPrimitives";
import type {
  ImmutableSourceDescriptor,
  SemanticDiffSourceCaptureInput,
} from "./semanticDiffSourceCapture";
import type { SemanticDiffSide } from "./semanticDiffDto";

const isValidVersion = (value: unknown): value is number | null =>
  value === null || isSafeVersionNumber(value);

const isSafeVersionNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value >= 0;

const isValidDescriptor = (
  value: unknown,
  expectedSide: SemanticDiffSide,
): value is ImmutableSourceDescriptor => {
  if (!hasExactKeys(value, ["side", "sourceHandleId", "text", "version"])) {
    return false;
  }
  if (value.side !== expectedSide) return false;
  return isDescriptorValues(value);
};

const isDescriptorValues = (value: Record<string, unknown>): boolean => {
  if (!isSemanticDiffSourceHandleId(value.sourceHandleId)) return false;
  if (typeof value.text !== "string") return false;
  return isValidVersion(value.version);
};

export const isValidCaptureInput = (
  value: unknown,
): value is SemanticDiffSourceCaptureInput => {
  if (!hasExactKeys(value, ["before", "after"])) return false;
  return (
    isValidDescriptor(value.before, "before") &&
    isValidDescriptor(value.after, "after")
  );
};

export const freezeCaptureInput = (
  input: SemanticDiffSourceCaptureInput,
): SemanticDiffSourceCaptureInput =>
  Object.freeze({
    before: Object.freeze({ ...input.before }),
    after: Object.freeze({ ...input.after }),
  });
