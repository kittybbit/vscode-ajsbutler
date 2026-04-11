import * as vscode from "vscode";

const LANGUAGE_ID = "jp1ajs";

const activateExtension = async () => {
  const extension = vscode.extensions.getExtension(
    "kittybbit.vscode-ajsbutler",
  );
  if (!extension) {
    throw new Error("Extension not found");
  }
  await extension?.activate();
};

const waitFor = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function run(): Promise<void> {
  await activateExtension();

  const commands = await vscode.commands.getCommands(true);
  if (!commands.includes("open.ajsbutler.tableViewer")) {
    throw new Error("Table viewer command not registered");
  }
  if (!commands.includes("open.ajsbutler.flowViewer")) {
    throw new Error("Flow viewer command not registered");
  }

  const invalidDocument = await vscode.workspace.openTextDocument({
    language: LANGUAGE_ID,
    content: "unit=root,,jp1admin,;\n{\n  ty=g\n}\n",
  });
  await vscode.window.showTextDocument(invalidDocument);
  await waitFor(200);
  const diagnostics = vscode.languages.getDiagnostics(invalidDocument.uri);
  if (diagnostics.length === 0) {
    throw new Error("Expected diagnostics for invalid JP1/AJS document");
  }

  const hoverDocument = await vscode.workspace.openTextDocument({
    language: LANGUAGE_ID,
    content: "ty=g;\n",
  });
  await vscode.window.showTextDocument(hoverDocument);
  const hovers = (await vscode.commands.executeCommand(
    "vscode.executeHoverProvider",
    hoverDocument.uri,
    new vscode.Position(0, 0),
  )) as vscode.Hover[];
  if (hovers.length === 0) {
    throw new Error("Expected hover results for parameter symbol");
  }

  const previewDocument = await vscode.workspace.openTextDocument({
    language: LANGUAGE_ID,
    content: "unit=root,,jp1admin,;\n{\n  ty=n;\n}\n",
  });
  await vscode.window.showTextDocument(previewDocument);
  await vscode.commands.executeCommand("open.ajsbutler.tableViewer");
  await vscode.commands.executeCommand("open.ajsbutler.flowViewer");
  await waitFor(200);
}
