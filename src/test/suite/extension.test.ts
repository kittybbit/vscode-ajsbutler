import * as assert from "assert";
import * as vscode from "vscode";
import { LANGUAGE_ID } from "../../extension/constant";

const AJS_TABLE_VIEWER_TYPE = "ajsbutler.tableViewer";
const AJS_FLOW_VIEWER_TYPE = "ajsbutler.flowViewer";

const activateExtension = async () => {
  const extension = vscode.extensions.getExtension(
    "kittybbit.vscode-ajsbutler",
  );
  assert.ok(extension);
  await extension?.activate();
};

const waitFor = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const findWebviewTab = (viewType: string) =>
  vscode.window.tabGroups.all
    .flatMap((group) => group.tabs)
    .find(
      (tab) =>
        tab.input instanceof vscode.TabInputWebview &&
        tab.input.viewType === viewType,
    );

suite("Extension Test Suite", () => {
  test("registers preview commands after activation", async () => {
    await activateExtension();

    const commands = await vscode.commands.getCommands(true);

    assert.ok(commands.includes("open.ajsbutler.tableViewer"));
    assert.ok(commands.includes("open.ajsbutler.flowViewer"));
    assert.ok(commands.includes("ajsbutler.importDefinitionViaWebApiBeta"));
  });

  test("provides diagnostics for invalid jp1ajs documents", async () => {
    await activateExtension();

    const document = await vscode.workspace.openTextDocument({
      language: LANGUAGE_ID,
      content: "unit=root,,jp1admin,;\n{\n  ty=g\n}\n",
    });
    await vscode.window.showTextDocument(document);
    await waitFor(200);

    const diagnostics = vscode.languages.getDiagnostics(document.uri);

    assert.ok(diagnostics.length > 0);
    assert.ok(diagnostics[0].message.length > 0);
  });

  test("provides hover information for parameter symbols", async () => {
    await activateExtension();

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

  test("opens table and flow viewers as webview tabs", async () => {
    await activateExtension();

    const document = await vscode.workspace.openTextDocument({
      language: LANGUAGE_ID,
      content: "unit=root,,jp1admin,;\n{\n  ty=n;\n}\n",
    });
    await vscode.window.showTextDocument(document);

    await vscode.commands.executeCommand("open.ajsbutler.tableViewer");
    await vscode.commands.executeCommand("open.ajsbutler.flowViewer");
    await waitFor(200);

    assert.ok(findWebviewTab(AJS_TABLE_VIEWER_TYPE));
    assert.ok(findWebviewTab(AJS_FLOW_VIEWER_TYPE));
  });
});
