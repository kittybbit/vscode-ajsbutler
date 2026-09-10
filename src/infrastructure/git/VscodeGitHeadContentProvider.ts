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

/** Serves immutable Git HEAD snapshots without rereading the provider. */
export class VscodeGitHeadContentProvider
  implements vscode.TextDocumentContentProvider, vscode.Disposable
{
  private readonly snapshots = new Map<string, SnapshotEntry>();
  private disposed = false;

  public provideTextDocumentContent(uri: vscode.Uri): string {
    if (this.disposed) return "";
    const key = keyForUri(uri);
    const entry = key ? this.snapshots.get(key) : undefined;
    return entry && !entry.released ? entry.content : "";
  }

  public reserve(content: string): GitHeadSnapshotReservationResult {
    if (this.disposed || this.snapshots.size >= MAX_GIT_HEAD_SNAPSHOT_ENTRIES) {
      return { kind: "unavailable", reason: "capacity-exceeded" };
    }
    const key = createProviderKey();
    const entry: SnapshotEntry = { key, content, released: false };
    this.snapshots.set(key, entry);
    let released = false;
    const reservation: GitHeadSnapshotReservation = {
      uri: vscode.Uri.from({
        scheme: GIT_HEAD_CONTENT_SCHEME,
        path: `/${key}`,
      }),
      release: (): void => {
        if (released) return;
        released = true;
        entry.released = true;
        if (this.snapshots.get(key) === entry) this.snapshots.delete(key);
      },
    };
    return { kind: "reserved", reservation };
  }

  public get size(): number {
    return this.snapshots.size;
  }

  public dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    for (const entry of this.snapshots.values()) entry.released = true;
    this.snapshots.clear();
  }
}

export const createVscodeGitHeadContentProvider =
  (): VscodeGitHeadContentProvider => new VscodeGitHeadContentProvider();
