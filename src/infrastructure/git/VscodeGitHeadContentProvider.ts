import * as vscode from "vscode";

export const GIT_HEAD_CONTENT_SCHEME = "ajsbutler-git-head";
export const MAX_GIT_HEAD_SNAPSHOT_ENTRIES = 8;

export type GitHeadSnapshotReservation = Readonly<{
  uri: vscode.Uri;
  release(): void;
}>;

export type GitHeadSnapshotReservationResult =
  | Readonly<{
      kind: "reserved";
      reservation: GitHeadSnapshotReservation;
    }>
  | Readonly<{
      kind: "unavailable";
      reason: "capacity-exceeded";
    }>;

type SnapshotEntry = {
  readonly key: string;
  readonly content: string;
  released: boolean;
};

let providerSequence = 1;

const createProviderKey = (): string => {
  const key = `snapshot-${providerSequence}`;
  providerSequence += 1;
  return key;
};

const keyForUri = (uri: vscode.Uri): string | undefined =>
  uri.scheme === GIT_HEAD_CONTENT_SCHEME && uri.path.startsWith("/")
    ? uri.path.slice(1)
    : undefined;

const contentForEntry = (
  entry: SnapshotEntry | undefined,
): string | undefined => (entry && !entry.released ? entry.content : undefined);

/** Serves immutable Git HEAD snapshots without rereading the provider. */
export class VscodeGitHeadContentProvider
  implements vscode.TextDocumentContentProvider, vscode.Disposable
{
  private readonly snapshots = new Map<string, SnapshotEntry>();
  private disposed = false;

  public provideTextDocumentContent(uri: vscode.Uri): string {
    if (this.disposed) return "";
    const key = keyForUri(uri);
    return contentForEntry(key ? this.snapshots.get(key) : undefined) ?? "";
  }

  public reserve(content: string): GitHeadSnapshotReservationResult {
    const entry = this.reserveEntry(content);
    if (!entry) {
      return { kind: "unavailable", reason: "capacity-exceeded" };
    }
    return { kind: "reserved", reservation: this.createReservation(entry) };
  }

  private reserveEntry(content: string): SnapshotEntry | undefined {
    if (this.disposed || this.snapshots.size >= MAX_GIT_HEAD_SNAPSHOT_ENTRIES) {
      return undefined;
    }
    const key = createProviderKey();
    const entry: SnapshotEntry = { key, content, released: false };
    this.snapshots.set(key, entry);
    return entry;
  }

  private createReservation(entry: SnapshotEntry): GitHeadSnapshotReservation {
    return {
      uri: vscode.Uri.from({
        scheme: GIT_HEAD_CONTENT_SCHEME,
        path: `/${entry.key}`,
      }),
      release: (): void => this.releaseEntry(entry),
    };
  }

  private releaseEntry(entry: SnapshotEntry): void {
    if (entry.released) return;
    entry.released = true;
    if (this.snapshots.get(entry.key) === entry) {
      this.snapshots.delete(entry.key);
    }
  }

  public get size(): number {
    return this.snapshots.size;
  }

  public dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.releaseAllEntries();
  }

  private releaseAllEntries(): void {
    for (const entry of this.snapshots.values()) entry.released = true;
    this.snapshots.clear();
  }
}

export const createVscodeGitHeadContentProvider =
  (): VscodeGitHeadContentProvider => new VscodeGitHeadContentProvider();
