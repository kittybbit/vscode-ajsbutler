import * as vscode from "vscode";
import type { FindParameterHover } from "../../../application/editor-feedback/findParameterHover";
import { LANGUAGE_ID } from "../constant";

const SELECTOR: vscode.DocumentSelector = { language: LANGUAGE_ID };
const PARAMETER_WORD_PATTERN = /[a-zA-Z0-9]+/;

type HoverLookupContext = {
  document: vscode.TextDocument;
  findParameterHover: FindParameterHover;
  language: string;
  position: vscode.Position;
};

const findHoverForPosition = ({
  document,
  findParameterHover,
  language,
  position,
}: HoverLookupContext): vscode.ProviderResult<vscode.Hover> => {
  const wordRange = document.getWordRangeAtPosition(
    position,
    PARAMETER_WORD_PATTERN,
  );
  if (wordRange === undefined) {
    return undefined;
  }

  const hoverDefinition = findParameterHover(
    document.getText(wordRange),
    language,
  );
  if (!hoverDefinition) {
    return undefined;
  }

  const content = new vscode.MarkdownString(`**${hoverDefinition.symbol}**\n`)
    .appendMarkdown("- - -\n")
    .appendMarkdown(`\`${hoverDefinition.syntax}\``);
  return new vscode.Hover(content);
};

class Ajs3v12HoverProvider implements vscode.HoverProvider {
  readonly #findParameterHover: FindParameterHover;

  constructor(findParameterHover: FindParameterHover) {
    this.#findParameterHover = findParameterHover;
  }

  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
  ): vscode.ProviderResult<vscode.Hover> {
    return findHoverForPosition({
      document,
      findParameterHover: this.#findParameterHover,
      language: vscode.env.language,
      position,
    });
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
