import * as vscode from "vscode";
import type { BuildSyntaxDiagnostics } from "../../../application/editor-feedback/buildSyntaxDiagnostics";
import type {
  SyntaxDiagnosticCategory,
  SyntaxDiagnosticDto,
} from "../../../application/editor-feedback/syntaxDiagnosticTypes";
import {
  createDiagnosticsEvaluatedTelemetryEvent,
  createDiagnosticsReportedTelemetryEvent,
} from "../../../application/telemetry/editorFeedbackTelemetry";
import type { TelemetryEvent } from "../../../application/telemetry/telemetryEvent";
import {
  toCountBucket,
  toDurationBucket,
} from "../../../application/telemetry/telemetryBuckets";
import type { TelemetryPort } from "../../../application/telemetry/TelemetryPort";
import { LANGUAGE_ID } from "../constant";
import { getTelemetryHost } from "../telemetryHost";

const toVsCodeDiagnostic = (
  diagnostic: SyntaxDiagnosticDto,
): vscode.Diagnostic => {
  const startPos = new vscode.Position(diagnostic.line - 1, diagnostic.column);
  const endPos = new vscode.Position(
    diagnostic.line - 1,
    diagnostic.column + diagnostic.length,
  );
  const range = new vscode.Range(startPos, endPos);
  return new vscode.Diagnostic(
    range,
    diagnostic.message,
    vscode.DiagnosticSeverity.Error,
  );
};

const reportDiagnosticsTelemetry = (
  telemetry: TelemetryPort | undefined,
  diagnostics: readonly SyntaxDiagnosticDto[],
  durationMs: number,
): void => {
  if (!telemetry) {
    return;
  }

  try {
    trackTelemetryEvent(
      telemetry,
      createDiagnosticsEvaluatedTelemetryEvent({
        host: getTelemetryHost(),
        result: "success",
        durationBucket: toDurationBucket(durationMs),
        diagnosticCountBucket: toCountBucket(diagnostics.length),
      }),
    );

    const categoryCounts = new Map<SyntaxDiagnosticCategory, number>();
    diagnostics.forEach((diagnostic) => {
      if (diagnostic.category) {
        categoryCounts.set(
          diagnostic.category,
          (categoryCounts.get(diagnostic.category) ?? 0) + 1,
        );
      }
    });

    categoryCounts.forEach((count, diagnosticCategory) => {
      trackTelemetryEvent(
        telemetry,
        createDiagnosticsReportedTelemetryEvent({
          host: getTelemetryHost(),
          result: "reported",
          diagnosticCategory,
          diagnosticCountBucket: toCountBucket(count),
        }),
      );
    });
  } catch {
    // Telemetry must not suppress editor diagnostics.
  }
};

const trackTelemetryEvent = (
  telemetry: TelemetryPort,
  event: TelemetryEvent,
): void => {
  telemetry.trackEvent(event.name, event.properties);
};

export const updateDiagnostics = (
  buildSyntaxDiagnostics: BuildSyntaxDiagnostics,
  collection: vscode.DiagnosticCollection,
  document: vscode.TextDocument,
  telemetry?: TelemetryPort,
): void => {
  console.log(`invoke checkForErrors. (${document.uri.toString()})`);
  const startedAt = performance.now();
  const syntaxDiagnostics = buildSyntaxDiagnostics(document.getText());
  collection.set(document.uri, syntaxDiagnostics.map(toVsCodeDiagnostic));
  reportDiagnosticsTelemetry(
    telemetry,
    syntaxDiagnostics,
    performance.now() - startedAt,
  );
};

const isAjsDocument = (document: vscode.TextDocument): boolean =>
  document.languageId === LANGUAGE_ID;

const runForAjsDocument = (
  document: vscode.TextDocument,
  eventName: string,
  action: (document: vscode.TextDocument) => void,
): void => {
  if (!isAjsDocument(document)) {
    return;
  }

  console.log(`invoke Diagnostic.${eventName}. (${document.uri.toString()})`);
  action(document);
};

const createOpenDocumentListener =
  (
    buildSyntaxDiagnostics: BuildSyntaxDiagnostics,
    collection: vscode.DiagnosticCollection,
    telemetry?: TelemetryPort,
  ) =>
  (document: vscode.TextDocument): void => {
    runForAjsDocument(document, "onDidOpenTextDocument", (targetDocument) => {
      updateDiagnostics(
        buildSyntaxDiagnostics,
        collection,
        targetDocument,
        telemetry,
      );
    });
  };

const createChangeDocumentListener =
  (
    buildSyntaxDiagnostics: BuildSyntaxDiagnostics,
    collection: vscode.DiagnosticCollection,
    telemetry?: TelemetryPort,
  ) =>
  (event: vscode.TextDocumentChangeEvent): void => {
    runForAjsDocument(
      event.document,
      "onDidChangeTextDocument",
      (targetDocument) => {
        updateDiagnostics(
          buildSyntaxDiagnostics,
          collection,
          targetDocument,
          telemetry,
        );
      },
    );
  };

const createCloseDocumentListener =
  (collection: vscode.DiagnosticCollection) =>
  (document: vscode.TextDocument): void => {
    runForAjsDocument(document, "onDidCloseTextDocument", (targetDocument) => {
      collection.delete(targetDocument.uri);
    });
  };

export const registerDiagnostics = (
  buildSyntaxDiagnostics: BuildSyntaxDiagnostics,
  telemetry?: TelemetryPort,
): vscode.Disposable => {
  console.log("initialize Diagnostic.");
  const collection =
    vscode.languages.createDiagnosticCollection("vscode.ajsbutler");

  return vscode.Disposable.from(
    collection,
    vscode.workspace.onDidOpenTextDocument(
      createOpenDocumentListener(buildSyntaxDiagnostics, collection, telemetry),
    ),
    vscode.workspace.onDidChangeTextDocument(
      createChangeDocumentListener(
        buildSyntaxDiagnostics,
        collection,
        telemetry,
      ),
    ),
    vscode.workspace.onDidCloseTextDocument(
      createCloseDocumentListener(collection),
    ),
  );
};
