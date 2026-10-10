import * as assert from "assert";
import * as vscode from "vscode";
import { LANGUAGE_ID } from "../../presentation/vscode/constant";

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

const waitForCondition = async (
  predicate: () => boolean,
  timeoutMs = 5_000,
  timeoutMessage: string | (() => string) = "Condition did not become true.",
): Promise<void> => {
  const startedAt = Date.now();
  while (!predicate()) {
    assert.ok(
      Date.now() - startedAt < timeoutMs,
      typeof timeoutMessage === "function" ? timeoutMessage() : timeoutMessage,
    );
    await waitFor(25);
  }
};

const findWebviewTab = (viewType: string) =>
  vscode.window.tabGroups.all
    .flatMap((group) => group.tabs)
    .find(
      (tab) =>
        tab.input instanceof vscode.TabInputWebview &&
        (tab.input.viewType === viewType ||
          tab.input.viewType.endsWith(`-${viewType}`)),
    );

suite("Extension Test Suite", () => {
  test("registers preview commands after activation", async () => {
    await activateExtension();

    const commands = await vscode.commands.getCommands(true);

    assert.ok(commands.includes("open.ajsbutler.tableViewer"));
    assert.ok(commands.includes("open.ajsbutler.flowViewer"));
    assert.ok(commands.includes("ajsbutler.importDefinitionViaWebApiBeta"));
    assert.ok(commands.includes("ajsbutler.compareSemanticDiff"));
    assert.ok(commands.includes("ajsbutler.copySemanticDiffMarkdown"));
    assert.ok(commands.includes("ajsbutler.saveSemanticDiffOutput"));
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

  test("opens table and flow viewers as webview tabs", async function () {
    this.timeout(7_000);
    await activateExtension();

    const document = await vscode.workspace.openTextDocument({
      language: LANGUAGE_ID,
      content: "unit=root,,jp1admin,;\n{\n  ty=n;\n}\n",
    });
    await vscode.window.showTextDocument(document);

    await vscode.commands.executeCommand("open.ajsbutler.tableViewer");
    await vscode.commands.executeCommand("open.ajsbutler.flowViewer");
    await waitForCondition(
      () =>
        findWebviewTab(AJS_TABLE_VIEWER_TYPE) !== undefined &&
        findWebviewTab(AJS_FLOW_VIEWER_TYPE) !== undefined,
      5_000,
      () =>
        `Webview tabs not found; visible tabs: ${vscode.window.tabGroups.all
          .flatMap((group) => group.tabs)
          .map((tab) => {
            const input = tab.input as {
              viewType?: unknown;
              constructor?: { name?: string };
            };
            const viewType =
              typeof input.viewType === "string" ? input.viewType : "n/a";
            const inputKind = input.constructor?.name ?? "unknown";
            const inputKeys = Object.keys(input).join("|");
            return `${tab.label} (${inputKind}; viewType=${viewType}; keys=${inputKeys})`;
          })
          .join(", ")}`,
    );

    assert.ok(findWebviewTab(AJS_TABLE_VIEWER_TYPE));
    assert.ok(findWebviewTab(AJS_FLOW_VIEWER_TYPE));
  });
});
