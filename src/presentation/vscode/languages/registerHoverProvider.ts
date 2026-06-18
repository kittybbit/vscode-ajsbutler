import * as vscode from "vscode";
import type { FindParameterHover } from "../../../application/editor-feedback/findParameterHover";
import { LANGUAGE_ID } from "../constant";

const SELECTOR: vscode.DocumentSelector = { language: LANGUAGE_ID };

class Ajs3v12HoverProvider implements vscode.HoverProvider {
  readonly #findParameterHover: FindParameterHover;

  constructor(findParameterHover: FindParameterHover) {
    this.#findParameterHover = findParameterHover;
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
    const hoverDefinition = this.#findParameterHover(
      currentWord,
      vscode.env.language,
    );
    if (!hoverDefinition) {
      return undefined;
    }

    const content = new vscode.MarkdownString(`**${hoverDefinition.symbol}**\n`)
      .appendMarkdown("- - -\n")
      .appendMarkdown(`\`${hoverDefinition.syntax}\``);
    return new vscode.Hover(content);
  }
}

export const createAjsHoverProvider = (
  findParameterHover: FindParameterHover,
): vscode.HoverProvider => new Ajs3v12HoverProvider(findParameterHover);

export const registerHoverProvider = (
  findParameterHover: FindParameterHover,
): vscode.Disposable => {
  console.log("registered Ajs3v12HoverProvider");
  return vscode.languages.registerHoverProvider(
    SELECTOR,
    createAjsHoverProvider(findParameterHover),
  );
};
