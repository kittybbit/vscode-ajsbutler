import type * as vscode from "vscode";

export const SEMANTIC_DIFF_REPORT_SCHEME = "ajsbutler-semantic-diff";
export const COPY_SEMANTIC_DIFF_MARKDOWN_COMMAND =
  "ajsbutler.copySemanticDiffMarkdown";

export type SemanticDiffReportDocumentDeps = {
  openTextDocument: (uri: vscode.Uri) => Thenable<vscode.TextDocument>;
  showTextDocument: (
    document: vscode.TextDocument,
    options: vscode.TextDocumentShowOptions,
  ) => Thenable<vscode.TextEditor>;
  getActiveEditor: () => vscode.TextEditor | undefined;
  writeClipboard: (text: string) => Thenable<void>;
  showInformationMessage: (message: string) => Thenable<string | undefined>;
  showErrorMessage: (message: string) => Thenable<string | undefined>;
  createUri: (components: {
    scheme: string;
    path: string;
    query?: string;
  }) => vscode.Uri;
};

export class SemanticDiffReportDocumentProvider
  implements vscode.TextDocumentContentProvider
{
  private readonly reports = new Map<string, string>();
  private nextReportId = 1;

  constructor(private readonly deps: SemanticDiffReportDocumentDeps) {}

  provideTextDocumentContent(uri: vscode.Uri): string {
    return this.reports.get(uri.toString()) ?? "";
  }

  async openReport(report: string): Promise<void> {
    const uri = this.createReportUri();
    this.reports.set(uri.toString(), report);

    const document = await this.deps.openTextDocument(uri);
    await this.deps.showTextDocument(document, { preview: false });
  }

  async copyReport(uri?: vscode.Uri): Promise<boolean> {
    const reportUri = this.resolveReportUri(uri);
    const reportKey = reportUri?.toString();
    if (!reportKey || !this.reports.has(reportKey)) {
      await this.deps.showErrorMessage(
        "Open a semantic diff report before copying Markdown.",
      );
      return false;
    }
    const report = this.reports.get(reportKey) ?? "";

    try {
      await this.deps.writeClipboard(report);
      await this.deps.showInformationMessage(
        "Semantic diff Markdown copied to clipboard.",
      );
      return true;
    } catch {
      await this.deps.showErrorMessage(
        "Semantic diff Markdown could not be copied.",
      );
      return false;
    }
  }

  private createReportUri(): vscode.Uri {
    const reportId = this.nextReportId;
    this.nextReportId += 1;

    return this.deps.createUri({
      scheme: SEMANTIC_DIFF_REPORT_SCHEME,
      path: `/semantic-diff-${reportId}.md`,
      query: String(reportId),
    });
  }

  private resolveReportUri(uri?: vscode.Uri): vscode.Uri | undefined {
    if (uri?.scheme === SEMANTIC_DIFF_REPORT_SCHEME) {
      return uri;
    }

    const activeUri = this.deps.getActiveEditor()?.document.uri;
    if (activeUri?.scheme === SEMANTIC_DIFF_REPORT_SCHEME) {
      return activeUri;
    }

    return undefined;
  }
}
