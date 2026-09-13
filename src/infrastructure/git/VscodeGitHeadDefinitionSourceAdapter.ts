import type {
  GitHeadDefinitionResult,
  GitHeadDefinitionSourceInput,
  GitHeadDefinitionUnavailableReason,
  ReadGitHeadDefinition,
} from "../../application/semantic-diff/GitHeadDefinitionSourcePort";
import {
  getDefaultExtension,
  resolveApiOnce,
  resolveReadContext,
  type ApiResolution,
  type ReadContext,
  type VscodeGitHeadDefinitionSourceAdapterDeps,
} from "./VscodeGitHeadApiResolution";
import { candidateChanges, sourcePathFor } from "./VscodeGitHeadPathGuards";
import {
  inspectObjectType,
  inspectPath,
  objectReasonForMode,
  readContent,
  type PathInspection,
  type SelectedPath,
} from "./VscodeGitHeadObjectPipeline";

export type { VscodeGitHeadDefinitionSourceAdapterDeps } from "./VscodeGitHeadApiResolution";

export const MAX_GIT_HEAD_SOURCE_BYTES = 8 * 1024 * 1024;

const unavailable = (
  reason: GitHeadDefinitionUnavailableReason,
): GitHeadDefinitionResult => ({
  kind: "unavailable",
  reason,
});

export class VscodeGitHeadDefinitionSourceAdapter {
  private readonly getExtension: NonNullable<
    VscodeGitHeadDefinitionSourceAdapterDeps["getExtension"]
  >;
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
    const context = await resolveReadContext(apiResolution.api, input);
    if (context.kind === "unavailable") return unavailable(context.reason);
    return await this.readHead(context.context);
  };

  private async resolveApi(): Promise<ApiResolution> {
    if (!this.apiPromise) this.apiPromise = this.resolveApiOnce();
    return await this.apiPromise;
  }

  private resolveApiOnce(): Promise<ApiResolution> {
    return resolveApiOnce(this.getExtension);
  }

  private async readHead(
    context: ReadContext,
  ): Promise<GitHeadDefinitionResult> {
    const currentPath = sourcePathFor(context.rootUri, context.documentUri);
    if (!currentPath) return unavailable("head-source-missing");
    const current = await inspectPath(context, currentPath);
    return this.resolveHeadInspection(context, current);
  }

  private async resolveHeadInspection(
    context: ReadContext,
    current: PathInspection,
  ): Promise<GitHeadDefinitionResult> {
    if (current.kind === "ready") {
      return await this.readSelectedPath(context, current);
    }
    if (current.reason !== "head-source-missing") {
      return unavailable(current.reason);
    }
    return await this.readRenameFallback(context);
  }

  private async readRenameFallback(
    context: ReadContext,
  ): Promise<GitHeadDefinitionResult> {
    const candidates = candidateChanges({
      state: context.state,
      activeUri: context.documentUri,
      rootUri: context.rootUri,
    });
    if (candidates.length !== 1) return unavailable("head-source-missing");
    const candidatePath = sourcePathFor(
      context.rootUri,
      candidates[0]!.originalUri,
    );
    if (!candidatePath) return unavailable("head-source-missing");
    const selected = await inspectPath(context, candidatePath);
    return selected.kind === "ready"
      ? this.readSelectedPath(context, selected)
      : unavailable(selected.reason);
  }

  private async readSelectedPath(
    context: ReadContext,
    selected: SelectedPath,
  ): Promise<GitHeadDefinitionResult> {
    const objectReason = objectReasonForMode(selected.objectDetails.mode);
    if (objectReason) return unavailable(objectReason);
    const objectType = await inspectObjectType(
      context.repository,
      selected.objectDetails.object,
    );
    if (objectType.kind === "unavailable") {
      return unavailable(objectType.reason);
    }
    const content = await readContent({
      repository: context.repository,
      headCommit: context.headCommit,
      path: selected.path,
      maxSourceBytes: this.maxSourceBytes,
    });
    return content.kind === "ready"
      ? { kind: "ready", content: content.content, ref: "HEAD" }
      : unavailable(content.reason);
  }
}

export const createVscodeGitHeadDefinitionSourceAdapter = (
  deps: VscodeGitHeadDefinitionSourceAdapterDeps = {},
): ReadGitHeadDefinition =>
  new VscodeGitHeadDefinitionSourceAdapter(deps).readGitHeadDefinition;
