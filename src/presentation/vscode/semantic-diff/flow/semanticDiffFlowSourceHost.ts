import * as vscode from "vscode";
import type {
  SemanticDiffOutputContext,
  SemanticDiffSide,
} from "../../../../application/semantic-diff/semanticDiffDto";
import type { SemanticDiffSourceCaptureEntry } from "../source/semanticDiffExplorerSourceTypes";
import type {
  SemanticDiffFlowHost,
  SemanticDiffFlowPanel,
  SemanticDiffFlowSourceSnapshot,
} from "./semanticDiffExplorerFlow";

export type SemanticDiffFlowSourceHostDeps = Readonly<{
  sourceCapture: (
    context: SemanticDiffOutputContext,
  ) => SemanticDiffSourceCaptureEntry | undefined;
  getOpenTextDocuments: () => readonly vscode.TextDocument[];
  openFlow: (
    uri: vscode.Uri,
    targetUnitId: string,
  ) => Promise<SemanticDiffFlowPanel>;
}>;

const sourceVersionMatches = (
  currentVersion: number | null,
  snapshotVersion: number | null,
): boolean => snapshotVersion === null || currentVersion === snapshotVersion;

const sourceIdentityMatches = (
  current: SemanticDiffFlowSourceSnapshot,
  snapshot: SemanticDiffFlowSourceSnapshot,
): boolean =>
  current.sourceHandleId === snapshot.sourceHandleId &&
  current.uri === snapshot.uri;

const sourceSnapshotMatches = (
  current: SemanticDiffFlowSourceSnapshot,
  snapshot: SemanticDiffFlowSourceSnapshot,
): boolean =>
  sourceVersionMatches(current.version, snapshot.version) &&
  current.text === snapshot.text;

const documentSnapshotMatches = (
  document: vscode.TextDocument | undefined,
  snapshot: SemanticDiffFlowSourceSnapshot,
): boolean =>
  document !== undefined &&
  sourceVersionMatches(document.version, snapshot.version) &&
  document.getText() === snapshot.text;

const sourceUriString = (uri: vscode.Uri): string =>
  vscode.Uri.from({
    scheme: uri.scheme,
    authority: uri.authority,
    path: uri.path,
    query: uri.query,
    fragment: uri.fragment,
  }).toString();

const createSourceSnapshotGetter =
  (sourceCapture: SemanticDiffFlowSourceHostDeps["sourceCapture"]) =>
  (
    side: SemanticDiffSide,
    context: SemanticDiffOutputContext,
  ): SemanticDiffFlowSourceSnapshot | undefined => {
    const source = sourceCapture(context)?.sources[side];
    return source
      ? {
          sourceHandleId: source.sourceHandleId,
          version: source.version,
          text: source.text,
          uri: sourceUriString(source.uri),
        }
      : undefined;
  };

const isSourceCurrent = ({
  getSourceSnapshot,
  getOpenTextDocuments,
  side,
  context,
  snapshot,
}: Readonly<{
  getSourceSnapshot: ReturnType<typeof createSourceSnapshotGetter>;
  getOpenTextDocuments: SemanticDiffFlowSourceHostDeps["getOpenTextDocuments"];
  side: SemanticDiffSide;
  context: SemanticDiffOutputContext;
  snapshot: SemanticDiffFlowSourceSnapshot;
}>): boolean => {
  const current = getSourceSnapshot(side, context);
  if (current === undefined || !sourceIdentityMatches(current, snapshot)) {
    return false;
  }
  const currentDocument = getOpenTextDocuments().find(
    (document) => document.uri.toString() === snapshot.uri,
  );
  return (
    sourceSnapshotMatches(current, snapshot) &&
    documentSnapshotMatches(currentDocument, snapshot)
  );
};

const openFlowSource = async ({
  sourceCapture,
  openFlow,
  side,
  targetUnitId,
  context,
}: Readonly<{
  sourceCapture: SemanticDiffFlowSourceHostDeps["sourceCapture"];
  openFlow: SemanticDiffFlowSourceHostDeps["openFlow"];
  side: SemanticDiffSide;
  targetUnitId: string;
  context: SemanticDiffOutputContext;
}>): Promise<SemanticDiffFlowPanel> => {
  const source = sourceCapture(context)?.sources[side];
  if (!source) throw new Error("Semantic Diff source is unavailable.");
  return openFlow(source.uri, targetUnitId);
};

export const createSemanticDiffFlowSourceHost = ({
  sourceCapture,
  getOpenTextDocuments,
  openFlow,
}: SemanticDiffFlowSourceHostDeps): SemanticDiffFlowHost => {
  const getSourceSnapshot = createSourceSnapshotGetter(sourceCapture);

  return {
    getSourceSnapshot,
    isSourceCurrent: (side, context, snapshot) => {
      return isSourceCurrent({
        getSourceSnapshot,
        getOpenTextDocuments,
        side,
        context,
        snapshot,
      });
    },
    open: (side, targetUnitId, context) =>
      openFlowSource({
        sourceCapture,
        openFlow,
        side,
        targetUnitId,
        context,
      }),
  };
};
