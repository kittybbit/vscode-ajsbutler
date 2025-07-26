import * as vscode from "vscode";
import { paramDefinitionLang } from "../../domain/services/i18n/nls";
import { isParamSymbol } from "../../domain/values/AjsType";

const SELECTOR: vscode.DocumentSelector = { language: "jp1ajs" };

export class Ajs3v12HoverProvider implements vscode.HoverProvider {
  public static register(context: vscode.ExtensionContext) {
    console.log("registered Ajs3v12HoverProvider");
    context.subscriptions.push(
      vscode.languages.registerHoverProvider(
        SELECTOR,
        new Ajs3v12HoverProvider(),
      ),
    );
  }

  static #paramDefinition = paramDefinitionLang(vscode.env.language);

  private constructor() {
    console.log("invoke Ajs3v12HoverProvider.constructor.");
  }

  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _token: vscode.CancellationToken,
  ): vscode.ProviderResult<vscode.Hover> {
    const wordRange = document.getWordRangeAtPosition(position, /[a-zA-Z0-9]+/);
    if (wordRange === undefined) {
      return undefined;
    }
    const currentWord = document.getText(wordRange);
    if (isParamSymbol(currentWord)) {
      const content = new vscode.MarkdownString(`**${currentWord}**\n`)
        .appendMarkdown("- - -\n")
        .appendMarkdown(
          `\`${Ajs3v12HoverProvider.#paramDefinition[currentWord].syntax}\``,
        );
      return new vscode.Hover(content);
    }
    return undefined;
  }
}
