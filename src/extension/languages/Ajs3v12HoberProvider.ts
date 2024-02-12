import * as vscode from 'vscode';
import { paramDefinitionLang } from '../../domain/services/i18n/nls'
import { isParamSymbol } from '../../domain/values/AjsType';

const MODE = { language: 'jp1ajs' };

export class Ajs3v12HoverProvider implements vscode.HoverProvider {

    public static register(context: vscode.ExtensionContext) {
        console.info('registerd Ajs3v12HoverProvider');
        context.subscriptions.push(
            vscode.languages.registerHoverProvider(
                MODE,
                new Ajs3v12HoverProvider()
            )
        );
    }

    #paramDefinition = paramDefinitionLang(vscode.env.language);

    provideHover(document: vscode.TextDocument, position: vscode.Position /* , _token: vscode.CancellationToken */): vscode.ProviderResult<vscode.Hover> {
        const wordRange = document.getWordRangeAtPosition(position, /[a-zA-Z0-9]+/);
        if (wordRange === undefined) {
            return undefined
        }
        const currentWord = document.lineAt(position.line).text.slice(wordRange.start.character, wordRange.end.character);
        if (isParamSymbol(currentWord)) {
            const content = (new vscode.MarkdownString(`**${currentWord}**\n`))
                .appendMarkdown('- - -\n')
                .appendMarkdown(`\`${this.#paramDefinition[currentWord].syntax}\``);
            return new vscode.Hover(content);
        }
        return undefined;
    }
}