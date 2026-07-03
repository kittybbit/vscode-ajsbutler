import * as vscode from "vscode";
import type { FindParameterHover } from "../../../application/editor-feedback/findParameterHover";
import { createHoverTelemetryEvent } from "../../../application/telemetry/editorFeedbackTelemetry";
import { toDurationBucket } from "../../../application/telemetry/telemetryBuckets";
import type { TelemetryEvent } from "../../../application/telemetry/telemetryEvent";
import type { TelemetryPort } from "../../../application/telemetry/TelemetryPort";
import { LANGUAGE_ID } from "../constant";
import { getTelemetryHost } from "../telemetryHost";

const SELECTOR: vscode.DocumentSelector = { language: LANGUAGE_ID };
const PARAMETER_WORD_PATTERN = /[a-zA-Z0-9]+/;

type HoverLookupContext = {
  document: vscode.TextDocument;
  findParameterHover: FindParameterHover;
  language: string;
  position: vscode.Position;
  telemetry?: TelemetryPort;
};

const reportHoverTelemetry = (
  telemetry: TelemetryPort | undefined,
  event: TelemetryEvent,
): void => {
  if (!telemetry) {
    return;
  }

  try {
    telemetry.trackEvent(event.name, event.properties);
  } catch {
    // Telemetry must not suppress hover results.
  }
};

const findHoverForPosition = ({
  document,
  findParameterHover,
  language,
  position,
  telemetry,
}: HoverLookupContext): vscode.ProviderResult<vscode.Hover> => {
  const startedAt = performance.now();
  const wordRange = document.getWordRangeAtPosition(
    position,
    PARAMETER_WORD_PATTERN,
  );
  if (wordRange === undefined) {
    reportHoverTelemetry(
      telemetry,
      createHoverTelemetryEvent({
        action: "requested",
        host: getTelemetryHost(),
        result: "success",
        hoverTargetCategory: "none",
      }),
    );
    reportHoverTelemetry(
      telemetry,
      createHoverTelemetryEvent({
        action: "resolved",
        host: getTelemetryHost(),
        result: "no_match",
        durationBucket: toDurationBucket(performance.now() - startedAt),
        hoverTargetCategory: "none",
      }),
    );
    return undefined;
  }

  reportHoverTelemetry(
    telemetry,
    createHoverTelemetryEvent({
      action: "requested",
      host: getTelemetryHost(),
      result: "success",
      hoverTargetCategory: "parameter",
    }),
  );

  const hoverDefinition = findParameterHover(
    document.getText(wordRange),
    language,
  );
  if (!hoverDefinition) {
    reportHoverTelemetry(
      telemetry,
      createHoverTelemetryEvent({
        action: "resolved",
        host: getTelemetryHost(),
        result: "no_match",
        durationBucket: toDurationBucket(performance.now() - startedAt),
        hoverTargetCategory: "parameter",
      }),
    );
    return undefined;
  }

  const content = new vscode.MarkdownString(`**${hoverDefinition.symbol}**\n`)
    .appendMarkdown("- - -\n")
    .appendMarkdown(`\`${hoverDefinition.syntax}\``);
  reportHoverTelemetry(
    telemetry,
    createHoverTelemetryEvent({
      action: "resolved",
      host: getTelemetryHost(),
      result: "matched",
      durationBucket: toDurationBucket(performance.now() - startedAt),
      hoverTargetCategory: "parameter",
    }),
  );
  return new vscode.Hover(content);
};

class Ajs3v12HoverProvider implements vscode.HoverProvider {
  readonly #findParameterHover: FindParameterHover;
  readonly #telemetry: TelemetryPort | undefined;

  constructor(
    findParameterHover: FindParameterHover,
    telemetry?: TelemetryPort,
  ) {
    this.#findParameterHover = findParameterHover;
    this.#telemetry = telemetry;
  }

  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
  ): vscode.ProviderResult<vscode.Hover> {
    return findHoverForPosition({
      document,
      findParameterHover: this.#findParameterHover,
      language: vscode.env.language,
      position,
      telemetry: this.#telemetry,
    });
  }
}

export const createAjsHoverProvider = (
  findParameterHover: FindParameterHover,
  telemetry?: TelemetryPort,
): vscode.HoverProvider =>
  new Ajs3v12HoverProvider(findParameterHover, telemetry);

export const registerHoverProvider = (
  findParameterHover: FindParameterHover,
  telemetry?: TelemetryPort,
): vscode.Disposable => {
  console.log("registered Ajs3v12HoverProvider");
  return vscode.languages.registerHoverProvider(
    SELECTOR,
    createAjsHoverProvider(findParameterHover, telemetry),
  );
};
