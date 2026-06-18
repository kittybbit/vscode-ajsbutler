import * as assert from "assert";
import * as vscode from "vscode";
import { createAjsHoverProvider } from "../../extension/languages/registerHoverProvider";

suite("Register hover provider", () => {
  test("uses the injected parameter-hover capability", async () => {
    let requestedWord: string | undefined;
    let requestedLanguage: string | undefined;
    const provider = createAjsHoverProvider((word, language) => {
      requestedWord = word;
      requestedLanguage = language;
      return undefined;
    });
    const wordRange = new vscode.Range(0, 0, 0, 2);
    const document = {
      getWordRangeAtPosition: () => wordRange,
      getText: (range?: vscode.Range) => (range === wordRange ? "ty" : ""),
    } as unknown as vscode.TextDocument;

    await provider.provideHover(
      document,
      new vscode.Position(0, 0),
      {} as vscode.CancellationToken,
    );

    assert.strictEqual(requestedWord, "ty");
    assert.strictEqual(requestedLanguage, vscode.env.language);
  });
});
