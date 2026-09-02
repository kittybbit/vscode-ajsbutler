import type * as vscode from "vscode";
import type {
  SemanticDiffOutputDocument,
  SemanticDiffOutputMode,
} from "../../semantic-diff/semanticDiffOutput";

export const SEMANTIC_DIFF_REPORT_SCHEME = "ajsbutler-semantic-diff";
export const COPY_SEMANTIC_DIFF_MARKDOWN_COMMAND =
  "ajsbutler.copySemanticDiffMarkdown";
export const SAVE_SEMANTIC_DIFF_OUTPUT_COMMAND =
  "ajsbutler.saveSemanticDiffOutput";

const DEFAULT_REPORT_LIMIT = 32;

export type SemanticDiffReportDocumentOptions = {
  readonly limit?: number;
};

type ReportEntry = {
  readonly key: string;
  readonly uri: vscode.Uri;
  readonly document: SemanticDiffOutputDocument;
  readonly creationSequence: number;
  lastAccessSequence: number;
};

type PendingReportEntry = ReportEntry & {
  state: "pending" | "ready" | "failed";
  readonly epoch: number;
  readonly commitPromise: Promise<vscode.Uri>;
  resolveCommit: (uri: vscode.Uri) => void;
  rejectCommit: (error: unknown) => void;
};

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
  showSaveDialog?: (
    options: vscode.SaveDialogOptions,
  ) => Thenable<vscode.Uri | undefined>;
  writeFile?: (uri: vscode.Uri, content: Uint8Array) => Thenable<void>;
};

const fullMarkdownDocument = (content: string): SemanticDiffOutputDocument => ({
  mode: "full",
  languageId: "markdown",
  extension: ".md",
  mediaType: "text/markdown; charset=utf-8",
  content,
});

const suggestedFileName = (mode: SemanticDiffOutputMode): string => {
  switch (mode) {
    case "summary":
      return "semantic-diff-summary.md";
    case "full":
      return "semantic-diff-full.md";
    case "audit":
      return "semantic-diff-audit.md";
    case "json":
      return "semantic-diff.json";
  }
};

const disposedError = (): Error =>
  new Error("Semantic diff report documents are no longer available.");

/**
 * Owns the bounded lifetime of displayed Semantic Diff output documents.
 * Content is kept in memory only for the duration of the provider cache.
 */
export class SemanticDiffReportDocumentProvider
  implements vscode.TextDocumentContentProvider, vscode.Disposable
{
  private readonly reports = new Map<string, ReportEntry>();
  private readonly pending = new Map<string, PendingReportEntry>();
  private readonly commitEntries = new Map<number, PendingReportEntry>();
  private readonly limit: number;
  private nextReportId = 1;
  private nextCreationSequence = 1;
  private nextCommitSequence = 1;
  private nextAccessSequence = 1;
  private draining = false;
  private disposed = false;
  private epoch = 0;

  constructor(
    private readonly deps: SemanticDiffReportDocumentDeps,
    limitOrOptions:
      | number
      | SemanticDiffReportDocumentOptions = DEFAULT_REPORT_LIMIT,
  ) {
    this.limit =
      typeof limitOrOptions === "number"
        ? limitOrOptions
        : (limitOrOptions.limit ?? DEFAULT_REPORT_LIMIT);
    if (!Number.isInteger(this.limit) || this.limit < 1) {
      throw new TypeError(
        "Semantic diff report limit must be a positive integer.",
      );
    }
  }

  provideTextDocumentContent(uri: vscode.Uri): string {
    if (this.disposed) return "";
    const key = this.safeUriKey(uri);
    const committed = key ? this.reports.get(key) : undefined;
    if (committed) {
      committed.lastAccessSequence = this.nextAccessSequence;
      this.nextAccessSequence += 1;
      return committed.document.content;
    }
    return key ? (this.pending.get(key)?.document.content ?? "") : "";
  }

  async openReport(
    document: SemanticDiffOutputDocument | string,
  ): Promise<vscode.Uri> {
    if (this.disposed) throw disposedError();

    const output =
      typeof document === "string" ? fullMarkdownDocument(document) : document;
    const uri = this.createReportUri(output.extension);
    const key = this.safeUriKey(uri);
    if (!key) throw new Error("Semantic diff report URI could not be created.");

    const creationSequence = this.nextCreationSequence;
    this.nextCreationSequence += 1;
    let resolveCommit!: (resolvedUri: vscode.Uri) => void;
    let rejectCommit!: (error: unknown) => void;
    const commitPromise = new Promise<vscode.Uri>((resolve, reject) => {
      resolveCommit = resolve;
      rejectCommit = reject;
    });
    const entry: PendingReportEntry = {
      key,
      uri,
      document: output,
      creationSequence,
      lastAccessSequence: this.nextAccessSequence,
      state: "pending",
      epoch: this.epoch,
      commitPromise,
      resolveCommit,
      rejectCommit,
    };
    this.pending.set(key, entry);
    this.commitEntries.set(creationSequence, entry);

    try {
      const opened = await this.deps.openTextDocument(uri);
      if (
        this.disposed ||
        entry.epoch !== this.epoch ||
        this.pending.get(key) !== entry
      ) {
        this.failEntry(entry, disposedError());
        return await commitPromise;
      }
      await this.deps.showTextDocument(opened, { preview: false });
    } catch (error) {
      this.failEntry(entry, error);
      return await commitPromise;
    }

    if (this.disposed || this.pending.get(key) !== entry) {
      this.failEntry(entry, disposedError());
    } else {
      entry.state = "ready";
      void this.drainCommits();
    }
    return await commitPromise;
  }

  async copyReport(uri?: vscode.Uri): Promise<boolean> {
    const record = this.resolveReport(uri);
    if (!record || record.document.languageId !== "markdown") {
      await this.notifyError(
        "Open a semantic diff report before copying Markdown.",
      );
      return false;
    }
    const operationEpoch = this.epoch;

    try {
      if (this.disposed || operationEpoch !== this.epoch) return false;
      await this.deps.writeClipboard(record.document.content);
      if (this.disposed || operationEpoch !== this.epoch) return false;
      await this.notifyInformation(
        "Semantic diff Markdown copied to clipboard.",
      );
      return true;
    } catch {
      await this.notifyError("Semantic diff Markdown could not be copied.");
      return false;
    }
  }

  async saveReport(uri?: vscode.Uri): Promise<boolean> {
    const record = this.resolveReport(uri);
    if (!record) {
      await this.notifyError("Open a semantic diff report before saving.");
      return false;
    }
    if (!this.deps.showSaveDialog || !this.deps.writeFile) {
      await this.notifyError("Semantic diff output could not be saved.");
      return false;
    }
    const operationEpoch = this.epoch;

    let destination: vscode.Uri | undefined;
    try {
      destination = await this.deps.showSaveDialog({
        defaultUri: this.deps.createUri({
          scheme: "untitled",
          path: `/${suggestedFileName(record.document.mode)}`,
        }),
        saveLabel: "Save Semantic Diff Output",
      });
    } catch {
      await this.notifyError("Semantic diff output could not be saved.");
      return false;
    }
    if (!destination) return false;
    if (this.disposed || operationEpoch !== this.epoch) return false;

    try {
      await this.deps.writeFile(
        destination,
        new TextEncoder().encode(record.document.content),
      );
      if (this.disposed || operationEpoch !== this.epoch) return false;
    } catch {
      await this.notifyError("Semantic diff output could not be saved.");
      return false;
    }
    await this.notifyInformation("Semantic diff output saved.");
    return true;
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.epoch += 1;
    const error = disposedError();
    for (const entry of this.commitEntries.values()) {
      entry.state = "failed";
      entry.rejectCommit(error);
    }
    this.commitEntries.clear();
    this.pending.clear();
    this.reports.clear();
  }

  private async drainCommits(): Promise<void> {
    if (this.draining) return;
    this.draining = true;
    try {
      while (this.commitEntries.has(this.nextCommitSequence)) {
        const sequence = this.nextCommitSequence;
        const entry = this.commitEntries.get(sequence)!;
        if (entry.state === "pending") break;
        this.commitEntries.delete(sequence);
        this.nextCommitSequence += 1;

        if (entry.state === "failed") {
          entry.rejectCommit(disposedError());
          continue;
        }
        if (this.disposed || entry.epoch !== this.epoch) {
          entry.state = "failed";
          this.pending.delete(entry.key);
          entry.rejectCommit(disposedError());
          continue;
        }

        entry.lastAccessSequence = this.nextAccessSequence;
        this.nextAccessSequence += 1;
        this.pending.delete(entry.key);
        this.reports.set(entry.key, entry);
        this.evictIfNeeded(entry.key);
        entry.resolveCommit(entry.uri);
      }
    } finally {
      this.draining = false;
    }
  }

  private failEntry(entry: PendingReportEntry, error: unknown): void {
    if (entry.state === "failed") return;
    entry.state = "failed";
    this.pending.delete(entry.key);
    entry.rejectCommit(error);
    void this.drainCommits();
  }

  private evictIfNeeded(protectedKey: string): void {
    while (this.reports.size > this.limit) {
      const candidate = [...this.reports.values()]
        .filter((entry) => entry.key !== protectedKey)
        .sort(
          (left, right) =>
            left.lastAccessSequence - right.lastAccessSequence ||
            left.creationSequence - right.creationSequence,
        )[0];
      if (!candidate) return;
      this.reports.delete(candidate.key);
    }
  }

  private createReportUri(extension: ".md" | ".json"): vscode.Uri {
    const reportId = this.nextReportId;
    this.nextReportId += 1;
    return this.deps.createUri({
      scheme: SEMANTIC_DIFF_REPORT_SCHEME,
      path: `/semantic-diff-${reportId}${extension}`,
      query: String(reportId),
    });
  }

  private resolveReport(uri?: vscode.Uri): ReportEntry | undefined {
    if (this.disposed) return undefined;
    const explicitKey =
      uri?.scheme === SEMANTIC_DIFF_REPORT_SCHEME
        ? this.safeUriKey(uri)
        : undefined;
    const activeKey = explicitKey ?? this.activeReportKey();
    const record = activeKey ? this.reports.get(activeKey) : undefined;
    if (record) {
      record.lastAccessSequence = this.nextAccessSequence;
      this.nextAccessSequence += 1;
    }
    return record;
  }

  private activeReportKey(): string | undefined {
    try {
      const activeUri = this.deps.getActiveEditor()?.document.uri;
      return activeUri?.scheme === SEMANTIC_DIFF_REPORT_SCHEME
        ? this.safeUriKey(activeUri)
        : undefined;
    } catch {
      return undefined;
    }
  }

  private safeUriKey(uri: vscode.Uri | undefined): string | undefined {
    if (!uri) return undefined;
    try {
      return uri.toString();
    } catch {
      return undefined;
    }
  }

  private async notifyInformation(message: string): Promise<void> {
    try {
      await this.deps.showInformationMessage(message);
    } catch {
      // Notification failure must not discard a successful host operation.
    }
  }

  private async notifyError(message: string): Promise<void> {
    try {
      await this.deps.showErrorMessage(message);
    } catch {
      // Notification failure must not replace the safe command result.
    }
  }
}
