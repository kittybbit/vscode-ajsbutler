import * as vscode from "vscode";
import type { BuildUnitList } from "../../application/unit-list/buildUnitList";
import type { UnitListDocumentDto } from "../../application/unit-list/unitListDocument";
import type { SemanticDiffFlowPanel } from "../../presentation/vscode/semantic-diff/semanticDiffExplorerFlow";
import { AJS_FLOW_VIEWER_TYPE } from "../../presentation/vscode/webview/constant";
import type { ViewerFactory } from "../../presentation/vscode/webview/ViewerFactory";
import { mountViewerPanel } from "../../presentation/vscode/webview/mountViewerPanel";

type FlowReadyDocument = NonNullable<ReturnType<BuildUnitList>["document"]>;
type FlowReadyState = {
  promise: Promise<Readonly<{ document: FlowReadyDocument }>>;
  resolve: (value: Readonly<{ document: FlowReadyDocument }>) => void;
  reject: (reason?: unknown) => void;
  settled: boolean;
};

const createFlowReadyState = (): FlowReadyState => {
  let resolve!: FlowReadyState["resolve"];
  let reject!: FlowReadyState["reject"];
  const promise = new Promise<Readonly<{ document: FlowReadyDocument }>>(
    (resolveReady, rejectReady) => {
      resolve = resolveReady;
      reject = rejectReady;
    },
  );
  return { promise, resolve, reject, settled: false };
};

const buildReadyDocument = (
  buildUnitList: BuildUnitList,
  document: vscode.TextDocument,
): FlowReadyDocument => {
  const result = buildUnitList(document.getText());
  if (!result.document) {
    throw new Error("Flow document could not be built.");
  }
  return result.document;
};

export type SemanticDiffFlowViewerBridge = Readonly<{
  setFactory(factory: ViewerFactory): void;
  onReady(document: vscode.TextDocument, panel: vscode.WebviewPanel): void;
  onDocumentChanged(
    document: UnitListDocumentDto | null,
    panel: vscode.WebviewPanel,
  ): void;
  open(uri: vscode.Uri, targetUnitId: string): Promise<SemanticDiffFlowPanel>;
}>;

export const createSemanticDiffFlowViewerBridge = ({
  buildUnitList,
  context,
}: Readonly<{
  buildUnitList: BuildUnitList;
  context: vscode.ExtensionContext;
}>): SemanticDiffFlowViewerBridge => {
  let factory: ViewerFactory | undefined;
  const readyByPanel = new WeakMap<vscode.WebviewPanel, FlowReadyState>();
  const documentByPanel = new WeakMap<
    vscode.WebviewPanel,
    UnitListDocumentDto | null
  >();

  return {
    setFactory(nextFactory) {
      factory = nextFactory;
    },
    onReady(document, panel) {
      const state = readyByPanel.get(panel);
      try {
        const readyDocument = buildReadyDocument(buildUnitList, document);
        documentByPanel.set(panel, readyDocument);
        if (!state || state.settled) return;
        state.settled = true;
        state.resolve({ document: readyDocument });
      } catch (error) {
        documentByPanel.set(panel, null);
        if (state && !state.settled) {
          state.settled = true;
          state.reject(error);
        }
      }
    },
    onDocumentChanged(document, panel) {
      documentByPanel.set(panel, document);
    },
    async open(uri, targetUnitId) {
      void targetUnitId;
      if (!factory) throw new Error("Flow viewer is not registered.");
      const document = await vscode.workspace.openTextDocument(uri);
      let panel = factory.getExistingPanel(document);
      let created = false;
      if (!panel) {
        panel = factory.getPanel(document);
        created = true;
      }
      if (created) {
        try {
          mountViewerPanel(context, panel, AJS_FLOW_VIEWER_TYPE);
        } catch (error) {
          panel.dispose();
          throw error;
        }
      }
      try {
        panel.reveal(panel.viewColumn);
      } catch {
        throw new Error("Flow viewer could not be revealed.");
      }
      const existingDocument = documentByPanel.get(panel);
      if (existingDocument !== undefined) {
        if (existingDocument === null) {
          return {
            flowUri: uri.toString(),
            ready: Promise.reject(
              new Error("Flow document could not be built."),
            ),
            postMessage: (message: unknown) =>
              panel.webview.postMessage(message),
            getBaseDocument: () => documentByPanel.get(panel) ?? null,
          };
        }
        return {
          flowUri: uri.toString(),
          ready: Promise.resolve({
            document: existingDocument,
          }),
          postMessage: (message: unknown) => panel.webview.postMessage(message),
          getBaseDocument: () => documentByPanel.get(panel) ?? null,
        };
      }
      let state = readyByPanel.get(panel);
      if (!state) {
        state = createFlowReadyState();
        readyByPanel.set(panel, state);
      }
      return {
        flowUri: uri.toString(),
        ready: state.promise,
        postMessage: (message: unknown) => panel.webview.postMessage(message),
        getBaseDocument: () => documentByPanel.get(panel) ?? null,
      };
    },
  };
};
