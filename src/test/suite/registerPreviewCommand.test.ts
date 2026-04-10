import * as assert from "assert";
import * as vscode from "vscode";
import { registerPreviewCommand } from "../../extension/commands/registerPreviewCommand";

suite("Register Preview Command", () => {
  test("registers the open command for the given view type", async () => {
    let registeredCommandId: string | undefined;
    let execute: (() => void) | undefined;

    const originalRegisterCommand = vscode.commands.registerCommand;
    (vscode.commands
      .registerCommand as typeof vscode.commands.registerCommand) = ((
      commandId: string,
      callback: () => void,
    ) => {
      registeredCommandId = commandId;
      execute = callback;
      return { dispose() {} };
    }) as typeof vscode.commands.registerCommand;

    try {
      const disposable = registerPreviewCommand("ajsbutler.tableViewer", () => {
        registeredCommandId = `${registeredCommandId}:executed`;
      });

      assert.strictEqual(registeredCommandId, "open.ajsbutler.tableViewer");
      execute?.();
      assert.strictEqual(
        registeredCommandId,
        "open.ajsbutler.tableViewer:executed",
      );
      disposable.dispose();
    } finally {
      (vscode.commands
        .registerCommand as typeof vscode.commands.registerCommand) =
        originalRegisterCommand;
    }
  });
});
