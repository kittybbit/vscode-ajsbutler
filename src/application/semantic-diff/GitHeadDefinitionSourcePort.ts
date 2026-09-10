export type GitHeadDefinitionUnavailableReason =
  | "extension-missing"
  | "extension-disabled"
  | "activation-failed"
  | "api-unavailable"
  | "repository-not-found"
  | "virtual-repository-unsupported"
  | "head-missing"
  | "head-source-missing"
  | "submodule"
  | "binary"
  | "unsupported-encoding"
  | "too-large"
  | "read-failed";

export type GitHeadDefinitionSourceInput = Readonly<{
  documentUri: string;
}>;

export type GitHeadDefinitionResult =
  | Readonly<{
      kind: "ready";
      content: string;
      ref: "HEAD";
    }>
  | Readonly<{
      kind: "unavailable";
      reason: GitHeadDefinitionUnavailableReason;
    }>;

export type ReadGitHeadDefinition = (
  input: GitHeadDefinitionSourceInput,
) => Promise<GitHeadDefinitionResult>;

export interface GitHeadDefinitionSourcePort {
  readGitHeadDefinition: ReadGitHeadDefinition;
}
