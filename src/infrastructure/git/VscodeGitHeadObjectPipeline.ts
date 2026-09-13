import type { GitHeadDefinitionUnavailableReason } from "../../application/semantic-diff/GitHeadDefinitionSourcePort";
import type {
  GitRepositoryWithCapabilities,
  ReadContext,
  SourcePath,
} from "./VscodeGitHeadApiResolution";

const UNKNOWN_PATH = "UnknownPath";
const BLOB_MODES = new Set(["100644", "100755", "120000"]);
const TEXT_MIME_TYPES = new Set([
  "application/json",
  "application/javascript",
  "application/xml",
]);
const SUPPORTED_ENCODINGS = new Set(["utf8", "utf16be", "utf16le"]);
const UNSUPPORTED_OBJECT_REASONS = new Map<string, "submodule" | "binary">([
  ["160000", "submodule"],
]);
const MIME_TYPE_REASONS = new Map<boolean, "binary" | undefined>([
  [true, undefined],
  [false, "binary"],
]);
const ENCODING_REASONS = new Map<boolean, "unsupported-encoding" | undefined>([
  [true, undefined],
  [false, "unsupported-encoding"],
]);
const READ_FAILURE_REASONS = new Map<
  boolean,
  "head-source-missing" | "read-failed"
>([
  [true, "head-source-missing"],
  [false, "read-failed"],
]);

export type ObjectDetails = Readonly<{ mode: string; object: string }>;

export type ObjectType = Readonly<{ mimetype: string; encoding?: string }>;

export type SelectedPath = Readonly<{
  readonly kind: "ready";
  path: SourcePath;
  objectDetails: ObjectDetails;
}>;

export type PathInspection =
  | SelectedPath
  | Readonly<{
      kind: "unavailable";
      reason: Extract<
        GitHeadDefinitionUnavailableReason,
        "head-source-missing" | "read-failed"
      >;
    }>;

export type ObjectTypeResolution =
  | Readonly<{ kind: "ready"; objectType: ObjectType }>
  | Readonly<{
      kind: "unavailable";
      reason: Extract<
        GitHeadDefinitionUnavailableReason,
        "binary" | "unsupported-encoding" | "read-failed"
      >;
    }>;

export type ContentResolution =
  | Readonly<{ kind: "ready"; content: string }>
  | Readonly<{
      kind: "unavailable";
      reason: Extract<
        GitHeadDefinitionUnavailableReason,
        "binary" | "too-large" | "head-source-missing" | "read-failed"
      >;
    }>;

export type ReadContentContext = Readonly<{
  repository: GitRepositoryWithCapabilities;
  headCommit: string;
  path: SourcePath;
  maxSourceBytes: number;
}>;

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const recordValue = (value: unknown): Record<string, unknown> | undefined =>
  isObject(value) ? value : undefined;

const stringValue = (value: unknown): value is string =>
  typeof value === "string" && value.length > 0;

const nonEmptyRecordValue = (
  record: Record<string, unknown> | undefined,
  field: string,
): string | undefined => {
  const value = record?.[field];
  return stringValue(value) ? value : undefined;
};

export const validObjectDetails = (
  value: unknown,
): ObjectDetails | undefined => {
  const record = recordValue(value);
  const mode = nonEmptyRecordValue(record, "mode");
  const object = nonEmptyRecordValue(record, "object");
  return mode && object ? { mode, object } : undefined;
};

const objectTypeWithEncoding = (
  mimetype: string,
  encoding: unknown,
): ObjectType =>
  typeof encoding === "string" ? { mimetype, encoding } : { mimetype };

export const validObjectType = (value: unknown): ObjectType | undefined => {
  const record = recordValue(value);
  const mimetype = record?.mimetype;
  return typeof mimetype === "string"
    ? objectTypeWithEncoding(mimetype, record?.encoding)
    : undefined;
};

export const isTextMime = (mimetype: string): boolean => {
  const normalized = mimetype.toLowerCase();
  return normalized.startsWith("text/") || TEXT_MIME_TYPES.has(normalized);
};

export const readReasonForError = (
  error: unknown,
): Extract<
  GitHeadDefinitionUnavailableReason,
  "head-source-missing" | "read-failed"
> =>
  READ_FAILURE_REASONS.get(recordValue(error)?.gitErrorCode === UNKNOWN_PATH)!;

export const objectReasonForMode = (
  mode: string,
): "submodule" | "binary" | undefined =>
  UNSUPPORTED_OBJECT_REASONS.get(mode) ??
  (BLOB_MODES.has(mode) ? undefined : "binary");

const objectTypeTextReason = (
  objectType: ObjectType,
): "binary" | "unsupported-encoding" | undefined => {
  const mimeReason = MIME_TYPE_REASONS.get(isTextMime(objectType.mimetype));
  const encodingReason = ENCODING_REASONS.get(
    SUPPORTED_ENCODINGS.has(objectType.encoding ?? "utf8"),
  );
  return mimeReason ?? encodingReason;
};

const objectTypeUnavailableReason = (
  objectType: ObjectType | undefined,
): "binary" | "unsupported-encoding" | "read-failed" | undefined =>
  objectType ? objectTypeTextReason(objectType) : "read-failed";

export const inspectPath = async (
  context: ReadContext,
  path: SourcePath,
): Promise<PathInspection> => {
  try {
    const details = validObjectDetails(
      await context.repository.getObjectDetails(
        context.headCommit,
        path.relativePath,
      ),
    );
    return details
      ? { kind: "ready", path, objectDetails: details }
      : { kind: "unavailable", reason: "read-failed" };
  } catch (error) {
    return { kind: "unavailable", reason: readReasonForError(error) };
  }
};

export const inspectObjectType = async (
  repository: GitRepositoryWithCapabilities,
  object: string,
): Promise<ObjectTypeResolution> => {
  let objectType: ObjectType | undefined;
  try {
    objectType = validObjectType(await repository.detectObjectType(object));
  } catch {
    return { kind: "unavailable", reason: "read-failed" };
  }
  const reason = objectTypeUnavailableReason(objectType);
  return reason
    ? { kind: "unavailable", reason }
    : { kind: "ready", objectType: objectType! };
};

export const validateContent = (
  content: string,
  maxSourceBytes: number,
): ContentResolution => {
  if (content.includes("\u0000")) {
    return { kind: "unavailable", reason: "binary" };
  }
  return new TextEncoder().encode(content).byteLength <= maxSourceBytes
    ? { kind: "ready", content }
    : { kind: "unavailable", reason: "too-large" };
};

export const readContent = async (
  context: ReadContentContext,
): Promise<ContentResolution> => {
  try {
    const content = await context.repository.show(
      context.headCommit,
      context.path.absolutePath,
    );
    if (typeof content !== "string") {
      return { kind: "unavailable", reason: "read-failed" };
    }
    return validateContent(content, context.maxSourceBytes);
  } catch (error) {
    return { kind: "unavailable", reason: readReasonForError(error) };
  }
};
