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

const createFlowPanel = ({
  uri,
  panel,
  ready,
  documentByPanel,
}: Readonly<{
  uri: vscode.Uri;
  panel: vscode.WebviewPanel;
  ready: Promise<Readonly<{ document: FlowReadyDocument }>>;
  documentByPanel: WeakMap<vscode.WebviewPanel, UnitListDocumentDto | null>;
}>): SemanticDiffFlowPanel => ({
  flowUri: uri.toString(),
  ready,
  postMessage: (message: unknown) => panel.webview.postMessage(message),
  getBaseDocument: () => documentByPanel.get(panel) ?? null,
});

const findOrCreatePanel = (
  factory: ViewerFactory,
  document: vscode.TextDocument,
): Readonly<{ panel: vscode.WebviewPanel; created: boolean }> => {
  const existing = factory.getExistingPanel(document);
  return existing
    ? { panel: existing, created: false }
    : { panel: factory.getPanel(document), created: true };
};

const mountCreatedPanel = (
  context: vscode.ExtensionContext,
  panel: vscode.WebviewPanel,
  created: boolean,
): void => {
  if (!created) return;
  try {
    mountViewerPanel(context, panel, AJS_FLOW_VIEWER_TYPE);
  } catch (error) {
    panel.dispose();
    throw error;
  }
};

const revealPanel = (panel: vscode.WebviewPanel): void => {
  try {
    panel.reveal(panel.viewColumn);
  } catch {
    throw new Error("Flow viewer could not be revealed.");
  }
};

class FlowViewerBridgeController implements SemanticDiffFlowViewerBridge {
  private factory: ViewerFactory | undefined;
  private readonly readyByPanel = new WeakMap<
    vscode.WebviewPanel,
    FlowReadyState
  >();
  private readonly documentByPanel = new WeakMap<
    vscode.WebviewPanel,
    UnitListDocumentDto | null
  >();

  public constructor(
    private readonly buildUnitList: BuildUnitList,
    private readonly context: vscode.ExtensionContext,
  ) {}

  public setFactory(factory: ViewerFactory): void {
    this.factory = factory;
  }

  public onReady(
    document: vscode.TextDocument,
    panel: vscode.WebviewPanel,
  ): void {
    const state = this.readyByPanel.get(panel);
    try {
      const readyDocument = buildReadyDocument(this.buildUnitList, document);
      this.documentByPanel.set(panel, readyDocument);
      this.resolveReadyState(state, readyDocument);
    } catch (error) {
      this.documentByPanel.set(panel, null);
      this.rejectReadyState(state, error);
    }
  }

  private resolveReadyState(
    state: FlowReadyState | undefined,
    document: FlowReadyDocument,
  ): void {
    if (!state || state.settled) return;
    state.settled = true;
    state.resolve({ document });
  }

  private rejectReadyState(
    state: FlowReadyState | undefined,
    error: unknown,
  ): void {
    if (!state || state.settled) return;
    state.settled = true;
    state.reject(error);
  }

  public onDocumentChanged(
    document: UnitListDocumentDto | null,
    panel: vscode.WebviewPanel,
  ): void {
    this.documentByPanel.set(panel, document);
  }

  public async open(
    uri: vscode.Uri,
    targetUnitId: string,
  ): Promise<SemanticDiffFlowPanel> {
    void targetUnitId;
    const panel = await this.openPanel(uri);
    return this.createFlowPanel(uri, panel);
  }

  private async openPanel(uri: vscode.Uri): Promise<vscode.WebviewPanel> {
    const factory = this.factory;
    if (!factory) throw new Error("Flow viewer is not registered.");
    const document = await vscode.workspace.openTextDocument(uri);
    const panelInfo = findOrCreatePanel(factory, document);
    mountCreatedPanel(this.context, panelInfo.panel, panelInfo.created);
    revealPanel(panelInfo.panel);
    return panelInfo.panel;
  }

  private createFlowPanel(
    uri: vscode.Uri,
    panel: vscode.WebviewPanel,
  ): SemanticDiffFlowPanel {
    const existingDocument = this.documentByPanel.get(panel);
    const ready =
      existingDocument === undefined
        ? this.createPendingReady(panel)
        : this.createExistingReady(existingDocument);
    return createFlowPanel({
      uri,
      panel,
      ready,
      documentByPanel: this.documentByPanel,
    });
  }

  private createPendingReady(
    panel: vscode.WebviewPanel,
  ): Promise<Readonly<{ document: FlowReadyDocument }>> {
    let state = this.readyByPanel.get(panel);
    if (!state) {
      state = createFlowReadyState();
      this.readyByPanel.set(panel, state);
    }
    return state.promise;
  }

  private createExistingReady(
    document: UnitListDocumentDto | null,
  ): Promise<Readonly<{ document: FlowReadyDocument }>> {
    return document === null
      ? Promise.reject(new Error("Flow document could not be built."))
      : Promise.resolve({ document });
  }
}

export const createSemanticDiffFlowViewerBridge = ({
  buildUnitList,
  context,
}: Readonly<{
  buildUnitList: BuildUnitList;
  context: vscode.ExtensionContext;
}>): SemanticDiffFlowViewerBridge =>
  new FlowViewerBridgeController(buildUnitList, context);
