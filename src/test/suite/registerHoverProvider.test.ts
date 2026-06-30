import * as assert from "assert";
import * as vscode from "vscode";
import { createAjsHoverProvider } from "../../presentation/vscode/languages/registerHoverProvider";

suite("Register hover provider", () => {
  const createTextDocument = (
    wordRange: vscode.Range | undefined,
    word: string,
  ): vscode.TextDocument =>
    ({
      getWordRangeAtPosition: () => wordRange,
      getText: (range?: vscode.Range) => (range === wordRange ? word : ""),
    }) as unknown as vscode.TextDocument;

  test("uses the injected parameter-hover capability", async () => {
    let requestedWord: string | undefined;
    let requestedLanguage: string | undefined;
    const provider = createAjsHoverProvider((word, language) => {
      requestedWord = word;
      requestedLanguage = language;
      return undefined;
    });
    const wordRange = new vscode.Range(0, 0, 0, 2);

    await provider.provideHover(
      createTextDocument(wordRange, "ty"),
      new vscode.Position(0, 0),
      {} as vscode.CancellationToken,
    );

    assert.strictEqual(requestedWord, "ty");
    assert.strictEqual(requestedLanguage, vscode.env.language);
  });

  test("maps parameter-hover output to a markdown hover", async () => {
    const provider = createAjsHoverProvider(() => ({
      symbol: "ty",
      syntax: "ty=n;",
    }));
    const hover = await provider.provideHover(
      createTextDocument(new vscode.Range(0, 0, 0, 2), "ty"),
      new vscode.Position(0, 0),
      {} as vscode.CancellationToken,
    );

    assert.ok(hover instanceof vscode.Hover);
    const [content] = hover.contents;
    assert.ok(content instanceof vscode.MarkdownString);
    assert.strictEqual(content.value, "**ty**\n- - -\n`ty=n;`");
  });
});
