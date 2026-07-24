import * as assert from "assert";
import * as vscode from "vscode";
import type { TelemetryEvent } from "../../application/telemetry/telemetryEvent";
import type { TelemetryPort } from "../../application/telemetry/TelemetryPort";
import { VscodeTelemetryAdapter } from "../../infrastructure/telemetry/VscodeTelemetryAdapter";
import { createAjsHoverProvider } from "../../presentation/vscode/languages/registerHoverProvider";
import { getTelemetryHost } from "../../presentation/vscode/telemetryHost";

suite("Register hover provider", () => {
  const createTextDocument = (
    wordRange: vscode.Range | undefined,
    word: string,
  ): vscode.TextDocument =>
    ({
      getWordRangeAtPosition: () => wordRange,
      getText: (range?: vscode.Range) => (range === wordRange ? word : ""),
    }) as unknown as vscode.TextDocument;

  test("uses the injected parameter-hover capability", async () => {
    let requestedWord: string | undefined;
    let requestedLanguage: string | undefined;
    const provider = createAjsHoverProvider((word, language) => {
      requestedWord = word;
      requestedLanguage = language;
      return undefined;
    });
    const wordRange = new vscode.Range(0, 0, 0, 2);

    await provider.provideHover(
      createTextDocument(wordRange, "ty"),
      new vscode.Position(0, 0),
      {} as vscode.CancellationToken,
    );

    assert.strictEqual(requestedWord, "ty");
    assert.strictEqual(requestedLanguage, vscode.env.language);
  });

  test("maps parameter-hover output to a markdown hover", async () => {
    const trackedEvents: TelemetryEvent[] = [];
    const telemetry: TelemetryPort = {
      report: (event) => trackedEvents.push(event),
      dispose() {},
    };
    const provider = createAjsHoverProvider(
      () => ({
        symbol: "ty",
        syntax: "ty=n;",
      }),
      telemetry,
    );
    const hover = await provider.provideHover(
      createTextDocument(new vscode.Range(0, 0, 0, 2), "ty"),
      new vscode.Position(0, 0),
      {} as vscode.CancellationToken,
    );

    assert.ok(hover instanceof vscode.Hover);
    const [content] = hover.contents;
    assert.ok(content instanceof vscode.MarkdownString);
    assert.strictEqual(content.value, "**ty**\n- - -\n`ty=n;`");
    assert.deepStrictEqual(
      trackedEvents.map((event) => event.name),
      ["editor.hover.requested", "editor.hover.resolved"],
    );
    assert.deepStrictEqual(trackedEvents[0].properties, {
      development: String(DEVELOPMENT),
      host: getTelemetryHost(),
      result: "success",
      hoverTargetCategory: "parameter",
    });
    assert.deepStrictEqual(
      {
        ...trackedEvents[1].properties,
        durationBucket: "<bucket>",
      },
      {
        development: String(DEVELOPMENT),
        host: getTelemetryHost(),
        result: "matched",
        durationBucket: "<bucket>",
        hoverTargetCategory: "parameter",
      },
    );
    assert.ok(trackedEvents[1].properties.durationBucket);
  });

  test("reports a no-match hover without exposing the token", async () => {
    const trackedEvents: TelemetryEvent[] = [];
    const provider = createAjsHoverProvider(() => undefined, {
      report: (event) => trackedEvents.push(event),
      dispose() {},
    });

    const hover = await provider.provideHover(
      createTextDocument(new vscode.Range(0, 0, 0, 8), "rawToken"),
      new vscode.Position(0, 0),
      {} as vscode.CancellationToken,
    );

    assert.strictEqual(hover, undefined);
    assert.deepStrictEqual(
      {
        ...trackedEvents[1].properties,
        durationBucket: "<bucket>",
      },
      {
        development: String(DEVELOPMENT),
        host: getTelemetryHost(),
        result: "no_match",
        durationBucket: "<bucket>",
        hoverTargetCategory: "parameter",
      },
    );
    assert.ok(trackedEvents[1].properties.durationBucket);
  });

  test("keeps hover results available when the SDK reporter fails", async () => {
    const telemetry = new VscodeTelemetryAdapter("test", () => ({
      sendTelemetryEvent: () => {
        throw new Error("telemetry failed");
      },
      dispose() {},
    }));
    const provider = createAjsHoverProvider(
      () => ({ symbol: "ty", syntax: "ty=n;" }),
      telemetry,
    );

    const hover = await provider.provideHover(
      createTextDocument(new vscode.Range(0, 0, 0, 2), "ty"),
      new vscode.Position(0, 0),
      {} as vscode.CancellationToken,
    );

    assert.ok(hover instanceof vscode.Hover);
  });
});
