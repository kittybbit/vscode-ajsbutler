import * as assert from "assert";
import * as vscode from "vscode";
import type { TelemetryProperties } from "../../application/telemetry/TelemetryPort";
import {
  createExtensionDependencies,
  instrumentParserPerformance,
} from "../../bootstrap/extension/extensionDependencies";
import { getTelemetryHost } from "../../presentation/vscode/telemetryHost";

suite("Extension dependencies", () => {
  test("constructs bootstrap-owned dependencies", () => {
    const context = {
      secrets: {
        get: async () => undefined,
        store: async () => {},
        delete: async () => {},
        onDidChange: () => ({ dispose() {} }),
      },
    } as unknown as vscode.ExtensionContext;

    const dependencies = createExtensionDependencies(context);

    assert.strictEqual(typeof dependencies.telemetry.trackEvent, "function");
    assert.strictEqual(typeof dependencies.buildSyntaxDiagnostics, "function");
    assert.strictEqual(typeof dependencies.buildUnitList, "function");
    assert.strictEqual(typeof dependencies.findParameterHover, "function");
    assert.strictEqual(
      typeof dependencies.semanticDiff.buildSemanticDiffReport,
      "function",
    );
    assert.strictEqual(
      typeof dependencies.webApiImport.storeCredential,
      "function",
    );
    assert.strictEqual(
      typeof dependencies.webApiImport.importPort.importDefinition,
      "function",
    );

    dependencies.telemetry.dispose();
  });

  test("instruments parser performance without exposing content", () => {
    const events: Array<{
      eventName: string;
      properties?: TelemetryProperties;
    }> = [];
    const parser = instrumentParserPerformance(
      {
        parse: () => ({
          rootUnits: [],
          errors: [],
        }),
      },
      {
        trackEvent: (eventName, properties) => {
          events.push({ eventName, properties });
        },
        dispose() {},
      },
    );

    assert.deepStrictEqual(parser.parse("raw definition content"), {
      rootUnits: [],
      errors: [],
    });
    assert.deepStrictEqual(
      {
        ...events[0]?.properties,
        durationBucket: "<bucket>",
      },
      {
        development: String(DEVELOPMENT),
        host: getTelemetryHost(),
        operation: "parse",
        result: "success",
        durationBucket: "<bucket>",
        diagnosticCountBucket: "0",
      },
    );
    assert.strictEqual(events[0]?.eventName, "performance.parse.completed");
    assert.ok(events[0]?.properties?.durationBucket);
  });
});
