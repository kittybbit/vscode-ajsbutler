import type { SemanticDiffSourceCaptureBinding } from "../../../../application/semantic-diff/semanticDiffSourceCapture";
import type { ImmutableSourceDescriptor } from "../../../../application/semantic-diff/semanticDiffSourceCapture";

export type SemanticDiffSourceHostDescriptor = ImmutableSourceDescriptor & {
  readonly uri: import("vscode").Uri;
};

export type SemanticDiffSourceCaptureEntry = Readonly<{
  binding: SemanticDiffSourceCaptureBinding;
  sources: Readonly<{
    before: SemanticDiffSourceHostDescriptor;
    after: SemanticDiffSourceHostDescriptor;
  }>;
  release: () => void;
}>;
