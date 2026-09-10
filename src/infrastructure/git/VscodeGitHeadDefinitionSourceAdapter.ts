import * as vscode from "vscode";
import type {
  GitHeadDefinitionResult,
  GitHeadDefinitionSourceInput,
  GitHeadDefinitionUnavailableReason,
  ReadGitHeadDefinition,
} from "../../application/semantic-diff/GitHeadDefinitionSourcePort";

export const MAX_GIT_HEAD_SOURCE_BYTES = 8 * 1024 * 1024;

const UNKNOWN_PATH = "UnknownPath";
const INDEX_RENAMED = 3;
const WORKING_TREE_MODIFIED = 5;
const WORKING_TREE_DELETED = 6;

type GitBranch = {
  readonly commit?: unknown;
};

type GitChange = {
  readonly uri?: vscode.Uri;
  readonly originalUri?: vscode.Uri;
  readonly renameUri?: vscode.Uri;
  readonly status?: unknown;
};

type GitRepositoryState = {
  readonly HEAD?: GitBranch;
  readonly indexChanges?: readonly GitChange[];
  readonly workingTreeChanges?: readonly GitChange[];
};

type GitRepository = {
  readonly rootUri?: vscode.Uri;
  readonly isUsingVirtualFileSystem?: boolean;
  readonly state?: GitRepositoryState;
  readonly getObjectDetails?: (
    treeish: string,
    path: string,
  ) => Promise<unknown>;
  readonly detectObjectType?: (object: string) => Promise<unknown>;
  readonly show?: (ref: string, path: string) => Promise<string>;
};

type GitApi = {
  readonly state?: unknown;
  readonly getRepository?: (uri: vscode.Uri) => GitRepository | null;
};

type GitExtensionExports = {
  readonly enabled?: boolean;
  readonly getAPI?: (version: 1) => unknown;
};

type GitExtensionHost = {
  readonly isActive?: boolean;
  readonly exports?: GitExtensionExports;
  activate(): Thenable<unknown>;
};

export type VscodeGitHeadDefinitionSourceAdapterDeps = Readonly<{
  getExtension?: (id: "vscode.git") => GitExtensionHost | undefined;
  maxSourceBytes?: number;
}>;

type ApiResolution =
  | Readonly<{ kind: "ready"; api: GitApi }>
  | Readonly<{
      kind: "unavailable";
      reason: Extract<
        GitHeadDefinitionUnavailableReason,
        | "extension-missing"
        | "extension-disabled"
        | "activation-failed"
        | "api-unavailable"
      >;
    }>;

type SourcePath = Readonly<{
  relativePath: string;
  absolutePath: string;
}>;

type SelectedPath = Readonly<{
  readonly kind: "ready";
  path: SourcePath;
  objectDetails: Readonly<{
    mode: string;
    object: string;
  }>;
}>;

const unavailable = (
  reason: GitHeadDefinitionUnavailableReason,
): GitHeadDefinitionResult => ({
  kind: "unavailable",
  reason,
});

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const stringValue = (value: unknown): value is string =>
  typeof value === "string" && value.length > 0;

const isUri = (value: unknown): value is vscode.Uri =>
  isObject(value) &&
  typeof value.scheme === "string" &&
  typeof value.authority === "string" &&
  typeof value.path === "string" &&
  typeof value.fsPath === "string" &&
  typeof value.toString === "function";

const normalizePath = (path: string): string[] | undefined => {
  const segments = path.replaceAll("\\", "/").split("/");
  if (segments.some((segment) => segment === "..")) return undefined;
  return segments.filter((segment) => segment.length > 0 && segment !== ".");
};

const samePathSegment = (left: string, right: string): boolean =>
  left === right;

const sourcePathFor = (
  rootUri: vscode.Uri,
  documentUri: vscode.Uri,
): SourcePath | undefined => {
  if (
    rootUri.scheme !== "file" ||
    documentUri.scheme !== "file" ||
    rootUri.authority !== documentUri.authority
  ) {
    return undefined;
  }
  const rootSegments = normalizePath(rootUri.path);
  const documentSegments = normalizePath(documentUri.path);
  if (!rootSegments || !documentSegments) return undefined;
  if (documentSegments.length <= rootSegments.length) return undefined;
  for (let index = 0; index < rootSegments.length; index += 1) {
    if (!samePathSegment(rootSegments[index]!, documentSegments[index]!)) {
      return undefined;
    }
  }
  const relativePath = documentSegments.slice(rootSegments.length).join("/");
  return relativePath.length > 0
    ? { relativePath, absolutePath: documentUri.fsPath }
    : undefined;
};

const isUnknownPath = (error: unknown): boolean =>
  isObject(error) && error.gitErrorCode === UNKNOWN_PATH;

const isAllowedRename = (change: GitChange, expectedStatus: number): boolean =>
  change.status === expectedStatus ||
  (expectedStatus === INDEX_RENAMED && change.status === "INDEX_RENAMED") ||
  (expectedStatus === WORKING_TREE_MODIFIED &&
    (change.status === "MODIFIED" || change.status === "DELETED")) ||
  (expectedStatus === WORKING_TREE_DELETED && change.status === "DELETED");

const isActiveRename = (
  change: GitChange,
  activeUri: vscode.Uri,
  rootUri: vscode.Uri,
  expectedStatus: number,
): change is GitChange & { originalUri: vscode.Uri; renameUri: vscode.Uri } =>
  isAllowedRename(change, expectedStatus) &&
  isUri(change.originalUri) &&
  isUri(change.renameUri) &&
  change.renameUri.toString() === activeUri.toString() &&
  sourcePathFor(rootUri, change.originalUri) !== undefined;

const candidateChanges = (
  state: GitRepositoryState,
  activeUri: vscode.Uri,
  rootUri: vscode.Uri,
): Array<GitChange & { originalUri: vscode.Uri; renameUri: vscode.Uri }> => {
  const indexCandidates = (state.indexChanges ?? []).filter((change) =>
    isActiveRename(change, activeUri, rootUri, INDEX_RENAMED),
  );
  const workingCandidates = (state.workingTreeChanges ?? []).filter(
    (change) =>
      isActiveRename(change, activeUri, rootUri, WORKING_TREE_MODIFIED) ||
      isActiveRename(change, activeUri, rootUri, WORKING_TREE_DELETED),
  );
  return [...indexCandidates, ...workingCandidates];
};

const validObjectDetails = (
  value: unknown,
): Readonly<{ mode: string; object: string }> | undefined => {
  if (!isObject(value)) return undefined;
  return typeof value.mode === "string" &&
    typeof value.object === "string" &&
    value.mode.length > 0 &&
    value.object.length > 0
    ? { mode: value.mode, object: value.object }
    : undefined;
};

const validObjectType = (
  value: unknown,
): Readonly<{ mimetype: string; encoding?: string }> | undefined => {
  if (!isObject(value) || typeof value.mimetype !== "string") return undefined;
  return {
    mimetype: value.mimetype,
    ...(typeof value.encoding === "string" ? { encoding: value.encoding } : {}),
  };
};

const isBlobMode = (mode: string): boolean =>
  mode === "100644" || mode === "100755" || mode === "120000";

const isTextMime = (mimetype: string): boolean => {
  const normalized = mimetype.toLowerCase();
  return (
    normalized.startsWith("text/") ||
    normalized === "application/json" ||
    normalized === "application/javascript" ||
    normalized === "application/xml"
  );
};

const isSupportedEncoding = (encoding: string): boolean =>
  encoding === "utf8" || encoding === "utf16be" || encoding === "utf16le";

const encodedLength = (text: string): number =>
  new TextEncoder().encode(text).byteLength;

const readReasonForError = (error: unknown): GitHeadDefinitionResult =>
  isUnknownPath(error)
    ? unavailable("head-source-missing")
    : unavailable("read-failed");

const getDefaultExtension = (): GitExtensionHost | undefined =>
  vscode.extensions.getExtension<GitExtensionExports>("vscode.git") as
    | GitExtensionHost
    | undefined;

const apiFromExports = (exportsValue: unknown): ApiResolution => {
  if (!isObject(exportsValue) || typeof exportsValue.getAPI !== "function") {
    return { kind: "unavailable", reason: "api-unavailable" };
  }
  try {
    const api = exportsValue.getAPI(1);
    return isObject(api) && typeof api.getRepository === "function"
      ? { kind: "ready", api: api as GitApi }
      : { kind: "unavailable", reason: "api-unavailable" };
  } catch {
    return { kind: "unavailable", reason: "api-unavailable" };
  }
};

export class VscodeGitHeadDefinitionSourceAdapter {
  private readonly getExtension: (
    id: "vscode.git",
  ) => GitExtensionHost | undefined;
  private readonly maxSourceBytes: number;
  private apiPromise: Promise<ApiResolution> | undefined;

  public constructor(deps: VscodeGitHeadDefinitionSourceAdapterDeps = {}) {
    this.getExtension = deps.getExtension ?? getDefaultExtension;
    this.maxSourceBytes = deps.maxSourceBytes ?? MAX_GIT_HEAD_SOURCE_BYTES;
  }

  public readonly readGitHeadDefinition: ReadGitHeadDefinition = async (
    input: GitHeadDefinitionSourceInput,
  ): Promise<GitHeadDefinitionResult> => {
    const apiResolution = await this.resolveApi();
    if (apiResolution.kind === "unavailable") {
      return unavailable(apiResolution.reason);
    }

    let documentUri: vscode.Uri;
    try {
      documentUri = vscode.Uri.parse(input.documentUri, true);
    } catch {
      return unavailable("virtual-repository-unsupported");
    }
    if (documentUri.scheme !== "file") {
      return unavailable("virtual-repository-unsupported");
    }

    let repository: GitRepository | null;
    try {
      repository = apiResolution.api.getRepository?.(documentUri) ?? null;
    } catch {
      return unavailable("api-unavailable");
    }
    if (!repository) return unavailable("repository-not-found");
    if (repository.isUsingVirtualFileSystem === true) {
      return unavailable("virtual-repository-unsupported");
    }

    const rootUri = repository.rootUri;
    const state = repository.state;
    if (!isUri(rootUri) || rootUri.scheme !== "file" || !state) {
      return unavailable("virtual-repository-unsupported");
    }
    const headCommit = state.HEAD?.commit;
    if (!stringValue(headCommit)) return unavailable("head-missing");
    if (
      typeof repository.getObjectDetails !== "function" ||
      typeof repository.detectObjectType !== "function" ||
      typeof repository.show !== "function"
    ) {
      return unavailable("api-unavailable");
    }

    const currentPath = sourcePathFor(rootUri, documentUri);
    if (!currentPath) return unavailable("head-source-missing");
    const current = await this.inspectPath(repository, headCommit, currentPath);
    if (current.kind === "ready") {
      return await this.readSelectedPath(repository, headCommit, current);
    }
    if (current.reason !== "head-source-missing")
      return unavailable(current.reason);

    const candidates = candidateChanges(state, documentUri, rootUri);
    if (candidates.length !== 1) return unavailable("head-source-missing");
    const candidate = candidates[0]!;
    const candidatePath = sourcePathFor(rootUri, candidate.originalUri);
    if (!candidatePath) return unavailable("head-source-missing");
    const selected = await this.inspectPath(repository, headCommit, {
      relativePath: candidatePath.relativePath,
      absolutePath: candidate.originalUri.fsPath,
    });
    if (selected.kind !== "ready") return unavailable(selected.reason);
    return await this.readSelectedPath(repository, headCommit, selected);
  };

  private async resolveApi(): Promise<ApiResolution> {
    if (!this.apiPromise) this.apiPromise = this.resolveApiOnce();
    return await this.apiPromise;
  }

  private async resolveApiOnce(): Promise<ApiResolution> {
    let extension: GitExtensionHost | undefined;
    try {
      extension = this.getExtension("vscode.git");
    } catch {
      return { kind: "unavailable", reason: "extension-missing" };
    }
    if (!extension) return { kind: "unavailable", reason: "extension-missing" };
    try {
      const gitExports = extension.isActive
        ? extension.exports
        : await extension.activate();
      if (!isObject(gitExports)) {
        return { kind: "unavailable", reason: "api-unavailable" };
      }
      if (gitExports.enabled !== true) {
        return {
          kind: "unavailable",
          reason:
            gitExports.enabled === false
              ? "extension-disabled"
              : "api-unavailable",
        };
      }
      return apiFromExports(gitExports);
    } catch {
      return { kind: "unavailable", reason: "activation-failed" };
    }
  }

  private async inspectPath(
    repository: GitRepository,
    headCommit: string,
    path: SourcePath,
  ): Promise<
    | SelectedPath
    | { kind: "unavailable"; reason: GitHeadDefinitionUnavailableReason }
  > {
    try {
      const details = validObjectDetails(
        await repository.getObjectDetails!(headCommit, path.relativePath),
      );
      if (!details) return { kind: "unavailable", reason: "read-failed" };
      return { kind: "ready", path, objectDetails: details };
    } catch (error) {
      if (isUnknownPath(error)) {
        return { kind: "unavailable", reason: "head-source-missing" };
      }
      return { kind: "unavailable", reason: "read-failed" };
    }
  }

  private async readSelectedPath(
    repository: GitRepository,
    headCommit: string,
    selected: SelectedPath,
  ): Promise<GitHeadDefinitionResult> {
    if (selected.objectDetails.mode === "160000")
      return unavailable("submodule");
    if (!isBlobMode(selected.objectDetails.mode)) return unavailable("binary");

    let objectType:
      | Readonly<{ mimetype: string; encoding?: string }>
      | undefined;
    try {
      objectType = validObjectType(
        await repository.detectObjectType!(selected.objectDetails.object),
      );
    } catch {
      return unavailable("read-failed");
    }
    if (!objectType) return unavailable("read-failed");
    if (!isTextMime(objectType.mimetype)) return unavailable("binary");
    if (
      objectType.encoding !== undefined &&
      !isSupportedEncoding(objectType.encoding)
    ) {
      return unavailable("unsupported-encoding");
    }

    let content: string;
    try {
      content = await repository.show!(headCommit, selected.path.absolutePath);
    } catch (error) {
      return readReasonForError(error);
    }
    if (typeof content !== "string") return unavailable("read-failed");
    if (content.includes("\u0000")) return unavailable("binary");
    if (encodedLength(content) > this.maxSourceBytes) {
      return unavailable("too-large");
    }
    return { kind: "ready", content, ref: "HEAD" };
  }
}

export const createVscodeGitHeadDefinitionSourceAdapter = (
  deps: VscodeGitHeadDefinitionSourceAdapterDeps = {},
): ReadGitHeadDefinition =>
  new VscodeGitHeadDefinitionSourceAdapter(deps).readGitHeadDefinition;
