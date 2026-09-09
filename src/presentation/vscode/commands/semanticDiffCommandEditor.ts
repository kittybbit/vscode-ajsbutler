import type * as vscode from "vscode";
import type {
  SemanticDiffCommandDeps,
  SemanticDiffCommandResult,
} from "./semanticDiffCommand";

type SemanticDiffCommandErrorCode = Extract<
  SemanticDiffCommandResult,
  { ok: false }
>["error"]["code"];

type CommandStep<T> =
  | { kind: "ready"; value: T }
  | {
      kind: "failed";
      error: {
        code: SemanticDiffCommandErrorCode;
        message: string;
        notify: boolean;
      };
    };

const readyStep = <T>(value: T): CommandStep<T> => ({
  kind: "ready",
  value,
});

const failedStep = (
  code: SemanticDiffCommandErrorCode,
  message: string,
): CommandStep<never> => ({
  kind: "failed",
  error: { code, message, notify: true },
});

export const readSemanticDiffActiveEditor = (
  deps: SemanticDiffCommandDeps,
): CommandStep<vscode.TextEditor> => {
  try {
    const activeEditor = deps.getActiveEditor();
    return activeEditor
      ? readyStep(activeEditor)
      : failedStep(
          "no-active-editor",
          "Open a JP1/AJS definition before running semantic diff.",
        );
  } catch {
    return failedStep(
      "active-editor-failed",
      "The active JP1/AJS definition could not be accessed.",
    );
  }
};
