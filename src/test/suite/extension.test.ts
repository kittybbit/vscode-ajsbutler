import * as assert from "assert";
import * as vscode from "vscode";
import { LANGUAGE_ID } from "../../extension/constant";

suite("Extension Test Suite", () => {
  test("registers preview commands after activation", async () => {
    const extension = vscode.extensions.getExtension(
      "kittybbit.vscode-ajsbutler",
    );
    assert.ok(extension);
    await extension?.activate();

    const commands = await vscode.commands.getCommands(true);

    assert.ok(commands.includes("open.ajsbutler.tableViewer"));
    assert.ok(commands.includes("open.ajsbutler.flowViewer"));
  });

  test("provides diagnostics for invalid jp1ajs documents", async () => {
    const extension = vscode.extensions.getExtension(
      "kittybbit.vscode-ajsbutler",
    );
    await extension?.activate();

    const document = await vscode.workspace.openTextDocument({
      language: LANGUAGE_ID,
      content: "unit=root,,jp1admin,;\n{\n  ty=g\n}\n",
    });
    await vscode.window.showTextDocument(document);
    await new Promise((resolve) => setTimeout(resolve, 200));

    const diagnostics = vscode.languages.getDiagnostics(document.uri);

    assert.ok(diagnostics.length > 0);
    assert.ok(diagnostics[0].message.length > 0);
  });

  test("provides hover information for parameter symbols", async () => {
    const extension = vscode.extensions.getExtension(
      "kittybbit.vscode-ajsbutler",
    );
    await extension?.activate();

    const document = await vscode.workspace.openTextDocument({
      language: LANGUAGE_ID,
      content: "ty=g;\n",
    });
    const editor = await vscode.window.showTextDocument(document);

    const hovers = (await vscode.commands.executeCommand(
      "vscode.executeHoverProvider",
      document.uri,
      new vscode.Position(0, 0),
    )) as vscode.Hover[];

    assert.ok(editor);
    assert.ok(hovers.length > 0);
  });
});
