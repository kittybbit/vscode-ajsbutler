import * as vscode from "vscode";
import {
  isUri,
  type GitChange,
  type GitRepositoryState,
  type SourcePath,
} from "./VscodeGitHeadApiResolution";

export type {
  GitChange,
  GitRepositoryState,
} from "./VscodeGitHeadApiResolution";

const INDEX_RENAMED = 3;
const WORKING_TREE_MODIFIED = 5;
const WORKING_TREE_DELETED = 6;

export type RenameContext = Readonly<{
  state: GitRepositoryState;
  activeUri: vscode.Uri;
  rootUri: vscode.Uri;
}>;

export type ActiveRename = GitChange & {
  originalUri: vscode.Uri;
  renameUri: vscode.Uri;
};

const isNormalizedPathSegment = (segment: string): boolean =>
  segment.length > 0 && segment !== ".";

export const normalizePath = (path: string): string[] | undefined => {
  const segments = path.replaceAll("\\", "/").split("/");
  return segments.includes("..")
    ? undefined
    : segments.filter(isNormalizedPathSegment);
};

const isFileUriPair = (rootUri: vscode.Uri, documentUri: vscode.Uri): boolean =>
  rootUri.scheme === "file" &&
  documentUri.scheme === "file" &&
  rootUri.authority === documentUri.authority;

const hasPathPrefix = (
  root: readonly string[],
  document: readonly string[],
): boolean =>
  document.length > root.length &&
  root.every((segment, index) => segment === document[index]);

const relativePathFor = (
  root: string[] | undefined,
  document: string[] | undefined,
): string | undefined => {
  if (!root || !document || !hasPathPrefix(root, document)) return undefined;
  return document.slice(root.length).join("/") || undefined;
};

export const sourcePathFor = (
  rootUri: vscode.Uri,
  documentUri: vscode.Uri,
): SourcePath | undefined => {
  const relativePath = isFileUriPair(rootUri, documentUri)
    ? relativePathFor(
        normalizePath(rootUri.path),
        normalizePath(documentUri.path),
      )
    : undefined;
  return relativePath
    ? { relativePath, absolutePath: documentUri.fsPath }
    : undefined;
};

const renameStatuses: Readonly<Record<number, readonly unknown[]>> = {
  [INDEX_RENAMED]: [INDEX_RENAMED, "INDEX_RENAMED"],
  [WORKING_TREE_MODIFIED]: [WORKING_TREE_MODIFIED, "MODIFIED", "DELETED"],
  [WORKING_TREE_DELETED]: [WORKING_TREE_DELETED, "DELETED"],
};

const hasExpectedStatus = (
  change: GitChange,
  expectedStatuses: readonly number[],
): boolean =>
  expectedStatuses.some((status) =>
    renameStatuses[status].includes(change.status),
  );

const hasActiveRenameTarget = (
  change: GitChange,
  context: RenameContext,
): change is ActiveRename => {
  const uris = [change.originalUri, change.renameUri];
  if (!uris.every(isUri)) return false;
  const [originalUri, renameUri] = uris as [vscode.Uri, vscode.Uri];
  return (
    renameUri.toString() === context.activeUri.toString() &&
    sourcePathFor(context.rootUri, originalUri) !== undefined
  );
};

const isActiveRename = (
  change: GitChange,
  context: RenameContext,
  expectedStatuses: readonly number[],
): change is ActiveRename =>
  hasExpectedStatus(change, expectedStatuses) &&
  hasActiveRenameTarget(change, context);

const activeRenames = (
  changes: readonly GitChange[],
  context: RenameContext,
  expectedStatuses: readonly number[],
): ActiveRename[] =>
  changes.filter((change) => isActiveRename(change, context, expectedStatuses));

export const candidateChanges = (context: RenameContext): ActiveRename[] => {
  const indexCandidates = activeRenames(
    context.state.indexChanges ?? [],
    context,
    [INDEX_RENAMED],
  );
  const workingCandidates = activeRenames(
    context.state.workingTreeChanges ?? [],
    context,
    [WORKING_TREE_MODIFIED, WORKING_TREE_DELETED],
  );
  return [...indexCandidates, ...workingCandidates];
};
