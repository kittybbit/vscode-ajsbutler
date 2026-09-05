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

type ReportWriteRequest = {
  readonly record: ReportEntry;
  readonly destination: vscode.Uri;
  readonly writeFile: NonNullable<SemanticDiffReportDocumentDeps["writeFile"]>;
  readonly operationEpoch: number;
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

const suggestedFileName = (mode: SemanticDiffOutputMode): string =>
  ({
    summary: "semantic-diff-summary.md",
    full: "semantic-diff-full.md",
    audit: "semantic-diff-audit.md",
    json: "semantic-diff.json",
  })[mode];

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
    return this.contentForKey(this.safeUriKey(uri));
  }

  async openReport(
    document: SemanticDiffOutputDocument | string,
  ): Promise<vscode.Uri> {
    this.assertOpenAllowed();
    const output = this.normalizeDocument(document);
    const entry = this.createPendingEntry(
      output,
      this.createReportUri(output.extension),
    );
    return await this.completeOpening(entry);
  }

  async copyReport(uri?: vscode.Uri): Promise<boolean> {
    const record = this.resolveReport(uri);
    if (!record || record.document.languageId !== "markdown") {
      await this.notifyError(
        "Open a semantic diff report before copying Markdown.",
      );
      return false;
    }
    return await this.copyContent(record, this.epoch);
  }

  async saveReport(uri?: vscode.Uri): Promise<boolean> {
    return await this.saveResolvedReport(this.resolveReport(uri));
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

  private assertOpenAllowed(): void {
    if (this.disposed) throw disposedError();
  }

  private normalizeDocument(
    document: SemanticDiffOutputDocument | string,
  ): SemanticDiffOutputDocument {
    return typeof document === "string"
      ? fullMarkdownDocument(document)
      : document;
  }

  private async completeOpening(
    entry: PendingReportEntry,
  ): Promise<vscode.Uri> {
    const attempt = await this.attemptOpening(entry);
    if (attempt.failed) {
      this.failEntry(entry, attempt.error);
      return await entry.commitPromise;
    }
    if (!this.isCurrentEntry(entry)) {
      this.failEntry(entry, disposedError());
    } else {
      entry.state = "ready";
      void this.drainCommits();
    }
    return await entry.commitPromise;
  }

  private async attemptOpening(
    entry: PendingReportEntry,
  ): Promise<{ readonly failed: boolean; readonly error?: unknown }> {
    try {
      await this.openAndShow(entry);
      return { failed: false };
    } catch (error) {
      return { failed: true, error };
    }
  }

  private async saveResolvedReport(
    record: ReportEntry | undefined,
  ): Promise<boolean> {
    if (!record) {
      await this.notifyError("Open a semantic diff report before saving.");
      return false;
    }
    const dependencies = this.saveDependencies();
    if (!dependencies) {
      await this.notifyError("Semantic diff output could not be saved.");
      return false;
    }
    return await this.saveContent(record, dependencies, this.epoch);
  }

  private saveDependencies():
    | {
        readonly showSaveDialog: NonNullable<
          SemanticDiffReportDocumentDeps["showSaveDialog"]
        >;
        readonly writeFile: NonNullable<
          SemanticDiffReportDocumentDeps["writeFile"]
        >;
      }
    | undefined {
    const { showSaveDialog, writeFile } = this.deps;
    if (!showSaveDialog || !writeFile) return undefined;
    return { showSaveDialog, writeFile };
  }

  private contentForKey(key: string | undefined): string {
    const committed = key ? this.reports.get(key) : undefined;
    if (committed) {
      this.touchReport(committed);
      return committed.document.content;
    }
    return key ? (this.pending.get(key)?.document.content ?? "") : "";
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

  private createPendingEntry(
    document: SemanticDiffOutputDocument,
    uri: vscode.Uri,
  ): PendingReportEntry {
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
      document,
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
    return entry;
  }

  private async openAndShow(entry: PendingReportEntry): Promise<void> {
    const opened = await this.deps.openTextDocument(entry.uri);
    if (!this.isCurrentEntry(entry)) throw disposedError();
    await this.deps.showTextDocument(opened, { preview: false });
  }

  private isCurrentEntry(entry: PendingReportEntry): boolean {
    return (
      !this.disposed &&
      entry.epoch === this.epoch &&
      this.pending.get(entry.key) === entry
    );
  }

  private async copyContent(
    record: ReportEntry,
    operationEpoch: number,
  ): Promise<boolean> {
    let copied = false;
    try {
      if (!this.isStale(operationEpoch)) {
        await this.deps.writeClipboard(record.document.content);
        if (!this.isStale(operationEpoch)) {
          await this.notifyInformation(
            "Semantic diff Markdown copied to clipboard.",
          );
          copied = true;
        }
      }
    } catch {
      await this.notifyError("Semantic diff Markdown could not be copied.");
    }
    return copied;
  }

  private async saveContent(
    record: ReportEntry,
    dependencies: {
      readonly showSaveDialog: NonNullable<
        SemanticDiffReportDocumentDeps["showSaveDialog"]
      >;
      readonly writeFile: NonNullable<
        SemanticDiffReportDocumentDeps["writeFile"]
      >;
    },
    operationEpoch: number,
  ): Promise<boolean> {
    const destination = await this.requestSaveDestination(
      record,
      dependencies.showSaveDialog,
    );
    let saved = false;
    if (destination && !this.isStale(operationEpoch)) {
      saved = await this.writeReportFile({
        record,
        destination,
        writeFile: dependencies.writeFile,
        operationEpoch,
      });
    }
    if (saved) await this.notifyInformation("Semantic diff output saved.");
    return saved;
  }

  private async requestSaveDestination(
    record: ReportEntry,
    showSaveDialog: NonNullable<
      SemanticDiffReportDocumentDeps["showSaveDialog"]
    >,
  ): Promise<vscode.Uri | undefined> {
    let destination: vscode.Uri | undefined;
    try {
      destination = await showSaveDialog({
        defaultUri: this.deps.createUri({
          scheme: "untitled",
          path: `/${suggestedFileName(record.document.mode)}`,
        }),
        saveLabel: "Save Semantic Diff Output",
      });
    } catch {
      await this.notifyError("Semantic diff output could not be saved.");
    }
    return destination;
  }

  private async writeReportFile(request: ReportWriteRequest): Promise<boolean> {
    let saved = false;
    try {
      await request.writeFile(
        request.destination,
        new TextEncoder().encode(request.record.document.content),
      );
      saved = !this.isStale(request.operationEpoch);
    } catch {
      await this.notifyError("Semantic diff output could not be saved.");
    }
    return saved;
  }

  private isStale(operationEpoch: number): boolean {
    return this.disposed || operationEpoch !== this.epoch;
  }

  private async drainCommits(): Promise<void> {
    if (this.draining) return;
    this.draining = true;
    try {
      this.drainReadyCommits();
    } finally {
      this.draining = false;
    }
  }

  private drainReadyCommits(): void {
    let entry = this.nextReadyCommit();
    while (entry) {
      this.commitEntries.delete(this.nextCommitSequence);
      this.nextCommitSequence += 1;
      this.settleCommitEntry(entry);
      entry = this.nextReadyCommit();
    }
  }

  private nextReadyCommit(): PendingReportEntry | undefined {
    const entry = this.commitEntries.get(this.nextCommitSequence);
    return entry?.state === "pending" ? undefined : entry;
  }

  private settleCommitEntry(entry: PendingReportEntry): void {
    if (entry.state === "failed") {
      entry.rejectCommit(disposedError());
      return;
    }
    if (this.disposed || entry.epoch !== this.epoch) {
      entry.state = "failed";
      this.pending.delete(entry.key);
      entry.rejectCommit(disposedError());
      return;
    }
    this.commitEntry(entry);
  }

  private commitEntry(entry: PendingReportEntry): void {
    this.touchReport(entry);
    this.pending.delete(entry.key);
    this.reports.set(entry.key, entry);
    this.evictIfNeeded(entry.key);
    entry.resolveCommit(entry.uri);
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
        )[0]!;
      this.reports.delete(candidate.key);
    }
  }

  private resolveReport(uri?: vscode.Uri): ReportEntry | undefined {
    if (this.disposed) return undefined;
    const key = this.reportKey(uri);
    const record = key ? this.reports.get(key) : undefined;
    if (record) this.touchReport(record);
    return record;
  }

  private reportKey(uri?: vscode.Uri): string | undefined {
    const explicitKey =
      uri?.scheme === SEMANTIC_DIFF_REPORT_SCHEME
        ? this.safeUriKey(uri)
        : undefined;
    return explicitKey ?? this.activeReportKey();
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

  private touchReport(entry: ReportEntry): void {
    entry.lastAccessSequence = this.nextAccessSequence;
    this.nextAccessSequence += 1;
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
