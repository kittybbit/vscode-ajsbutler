import * as vscode from "vscode";
import type {
  GitHeadDefinitionSourceInput,
  GitHeadDefinitionUnavailableReason,
} from "../../application/semantic-diff/GitHeadDefinitionSourcePort";

const URI_STRING_FIELDS = ["scheme", "authority", "path", "fsPath"] as const;
const EXTENSION_ENABLED_STATES = new Map<unknown, "enabled" | "disabled">([
  [true, "enabled"],
  [false, "disabled"],
]);
const API_UNAVAILABLE_REASONS = new Map<
  "enabled" | "disabled" | "unknown",
  "extension-disabled" | "api-unavailable" | undefined
>([
  ["enabled", undefined],
  ["disabled", "extension-disabled"],
  ["unknown", "api-unavailable"],
]);
const READ_CAPABILITIES = [
  "getObjectDetails",
  "detectObjectType",
  "show",
] as const;

export type GitBranch = {
  readonly commit?: unknown;
};

export type GitChange = {
  readonly uri?: vscode.Uri;
  readonly originalUri?: vscode.Uri;
  readonly renameUri?: vscode.Uri;
  readonly status?: unknown;
};

export type GitRepositoryState = {
  readonly HEAD?: GitBranch;
  readonly indexChanges?: readonly GitChange[];
  readonly workingTreeChanges?: readonly GitChange[];
};

export type GitRepository = {
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

export type GitRepositoryWithCapabilities = GitRepository &
  Required<
    Pick<GitRepository, "getObjectDetails" | "detectObjectType" | "show">
  >;

export type GitApi = {
  readonly state?: unknown;
  readonly getRepository?: (uri: vscode.Uri) => GitRepository | null;
};

export type GitExtensionExports = {
  readonly enabled?: boolean;
  readonly getAPI?: (version: 1) => unknown;
};

export type GitExtensionHost = {
  readonly isActive?: boolean;
  readonly exports?: GitExtensionExports;
  activate(): Thenable<unknown>;
};

export type VscodeGitHeadDefinitionSourceAdapterDeps = Readonly<{
  getExtension?: (id: "vscode.git") => GitExtensionHost | undefined;
  maxSourceBytes?: number;
}>;

export type ApiResolution =
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

export type SourcePath = Readonly<{
  relativePath: string;
  absolutePath: string;
}>;

export type ReadContext = Readonly<{
  repository: GitRepositoryWithCapabilities;
  rootUri: vscode.Uri;
  state: GitRepositoryState;
  documentUri: vscode.Uri;
  headCommit: string;
}>;

export type RepositoryBasics = Readonly<{
  kind: "ready";
  rootUri: vscode.Uri;
  state: GitRepositoryState;
}>;

export type DocumentUriResolution =
  | Readonly<{ kind: "ready"; documentUri: vscode.Uri }>
  | Readonly<{
      kind: "unavailable";
      reason: "virtual-repository-unsupported";
    }>;

export type RepositoryResolution =
  | Readonly<{ kind: "ready"; repository: GitRepository }>
  | Readonly<{
      kind: "unavailable";
      reason: Extract<
        GitHeadDefinitionUnavailableReason,
        "api-unavailable" | "repository-not-found"
      >;
    }>;

export type ContextResolution =
  | Readonly<{ kind: "ready"; context: ReadContext }>
  | Readonly<{
      kind: "unavailable";
      reason: Extract<
        GitHeadDefinitionUnavailableReason,
        | "virtual-repository-unsupported"
        | "head-missing"
        | "repository-not-found"
        | "api-unavailable"
      >;
    }>;

type ExtensionResolution =
  | Readonly<{ kind: "ready"; exportsValue: unknown }>
  | Readonly<{ kind: "unavailable"; reason: "activation-failed" }>;

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const recordValue = (value: unknown): Record<string, unknown> | undefined =>
  isObject(value) ? value : undefined;

const stringValue = (value: unknown): value is string =>
  typeof value === "string" && value.length > 0;

export const isUri = (value: unknown): value is vscode.Uri => {
  const record = recordValue(value);
  return Boolean(
    record &&
      URI_STRING_FIELDS.every((field) => typeof record[field] === "string") &&
      typeof record.toString === "function",
  );
};

export const getDefaultExtension = (): GitExtensionHost | undefined =>
  vscode.extensions.getExtension<GitExtensionExports>("vscode.git") as
    | GitExtensionHost
    | undefined;

export const getExtensionSafely = (
  getExtension: (id: "vscode.git") => GitExtensionHost | undefined,
): GitExtensionHost | undefined => {
  try {
    return getExtension("vscode.git");
  } catch {
    return undefined;
  }
};

const activateExtension = async (
  extension: GitExtensionHost,
): Promise<ExtensionResolution> => {
  try {
    return {
      kind: "ready",
      exportsValue: extension.isActive
        ? extension.exports
        : await extension.activate(),
    };
  } catch {
    return { kind: "unavailable", reason: "activation-failed" };
  }
};

type GitApiGetter = (version: 1) => unknown;

const apiValueFromExports = (exportsValue: unknown): unknown => {
  const record = recordValue(exportsValue);
  const getAPI = record?.getAPI;
  if (typeof getAPI !== "function") return undefined;
  try {
    return (getAPI as GitApiGetter).call(record, 1);
  } catch {
    return undefined;
  }
};

const hasRepositoryCapability = (api: unknown): api is GitApi => {
  if (!isObject(api)) return false;
  try {
    return typeof api.getRepository === "function";
  } catch {
    return false;
  }
};

const apiFromExports = (exportsValue: unknown): ApiResolution => {
  const api = apiValueFromExports(exportsValue);
  return hasRepositoryCapability(api)
    ? { kind: "ready", api }
    : { kind: "unavailable", reason: "api-unavailable" };
};

const extensionEnabledState = (
  exportsValue: unknown,
): "enabled" | "disabled" | "unknown" =>
  EXTENSION_ENABLED_STATES.get(recordValue(exportsValue)?.enabled) ?? "unknown";

const resolveEnabledApi = (exportsValue: unknown): ApiResolution => {
  const state = extensionEnabledState(exportsValue);
  const reason = API_UNAVAILABLE_REASONS.get(state);
  return reason
    ? { kind: "unavailable", reason }
    : apiFromExports(exportsValue);
};

export const resolveApiOnce = async (
  getExtension: (id: "vscode.git") => GitExtensionHost | undefined,
): Promise<ApiResolution> => {
  const extension = getExtensionSafely(getExtension);
  if (!extension) return { kind: "unavailable", reason: "extension-missing" };
  return resolveActivatedApi(await activateExtension(extension));
};

const resolveActivatedApi = (activated: ExtensionResolution): ApiResolution => {
  try {
    return activated.kind === "ready"
      ? resolveEnabledApi(activated.exportsValue)
      : activated;
  } catch {
    return { kind: "unavailable", reason: "activation-failed" };
  }
};

const fileRootUri = (repository: GitRepository): vscode.Uri | undefined => {
  const rootUri = repository.rootUri;
  return isUri(rootUri) && rootUri.scheme === "file" ? rootUri : undefined;
};

const physicalRootUri = (repository: GitRepository): vscode.Uri | undefined =>
  repository.isUsingVirtualFileSystem === true
    ? undefined
    : fileRootUri(repository);

export const repositoryBasics = (
  repository: GitRepository,
):
  | RepositoryBasics
  | Readonly<{
      kind: "unavailable";
      reason: "virtual-repository-unsupported";
    }> => {
  const rootUri = physicalRootUri(repository);
  return rootUri && repository.state
    ? { kind: "ready", rootUri, state: repository.state }
    : { kind: "unavailable", reason: "virtual-repository-unsupported" };
};

const hasReadCapabilities = (
  repository: GitRepository,
): repository is GitRepositoryWithCapabilities =>
  READ_CAPABILITIES.every(
    (capability) => typeof repository[capability] === "function",
  );

const headCommitFor = (state: GitRepositoryState): string | undefined =>
  stringValue(state.HEAD?.commit) ? state.HEAD.commit : undefined;

const readContextForBasics = (
  repository: GitRepository,
  documentUri: vscode.Uri,
  basics: RepositoryBasics,
): ContextResolution => {
  const headCommit = headCommitFor(basics.state);
  if (!headCommit) return { kind: "unavailable", reason: "head-missing" };
  if (!hasReadCapabilities(repository)) {
    return { kind: "unavailable", reason: "api-unavailable" };
  }
  return {
    kind: "ready",
    context: {
      repository,
      rootUri: basics.rootUri,
      state: basics.state,
      documentUri,
      headCommit,
    },
  };
};

const createReadContext = (
  repository: GitRepository,
  documentUri: vscode.Uri,
): ContextResolution => {
  const basics = repositoryBasics(repository);
  return basics.kind === "unavailable"
    ? basics
    : readContextForBasics(repository, documentUri, basics);
};

export const parseDocumentUri = (
  input: GitHeadDefinitionSourceInput,
): DocumentUriResolution => {
  let documentUri: vscode.Uri;
  try {
    documentUri = vscode.Uri.parse(input.documentUri, true);
  } catch {
    return { kind: "unavailable", reason: "virtual-repository-unsupported" };
  }
  return documentUri.scheme === "file"
    ? { kind: "ready", documentUri }
    : { kind: "unavailable", reason: "virtual-repository-unsupported" };
};

export const findRepository = (
  api: GitApi,
  documentUri: vscode.Uri,
): RepositoryResolution => {
  try {
    const repository = api.getRepository?.(documentUri) ?? null;
    return repository
      ? { kind: "ready", repository }
      : { kind: "unavailable", reason: "repository-not-found" };
  } catch {
    return { kind: "unavailable", reason: "api-unavailable" };
  }
};

export const resolveReadContext = async (
  api: GitApi,
  input: GitHeadDefinitionSourceInput,
): Promise<ContextResolution> => {
  const document = parseDocumentUri(input);
  if (document.kind === "unavailable") return document;
  const repository = findRepository(api, document.documentUri);
  if (repository.kind === "unavailable") return repository;
  return createReadContext(repository.repository, document.documentUri);
};
