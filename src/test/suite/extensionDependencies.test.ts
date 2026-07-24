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
    assert.deepStrictEqual(dependencies.findParameterHover("ty", "en"), {
      symbol: "ty",
      syntax:
        "{g|mg|n|rn|rm|rr|rc|mn|j|rj|pj|rp|qj|rq|jdj|rjdj|orj|rorj|evwj|revwj|flwj|rflwj|mlwj|rmlwj|mqwj|rmqwj|mswj|rmswj|lfwj|rlfwj|ntwj|rntwj|tmwj|rtmwj|evsj|revsj|mlsj|rmlsj|mqsj|rmqsj|mssj|rmssj|cmsj|rcmsj|pwlj|rpwlj|pwrj|rpwrj|cj|rcj|cpj|rcpj|fxj|rfxj|htpj|rhtpj|nc}",
    });
    assert.strictEqual(
      dependencies.findParameterHover("not-a-param", "en"),
      undefined,
    );
    assert.strictEqual(
      typeof dependencies.semanticDiff.buildSemanticDiffReportData,
      "function",
    );
    assert.strictEqual(
      typeof dependencies.webApiImport.importDefinition,
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
          ok: true,
          document: { rootUnits: [], warnings: [] },
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
      ok: true,
      document: { rootUnits: [], warnings: [] },
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

  test("preserves parser failures while reporting their count", () => {
    const events: Array<{
      eventName: string;
      properties?: TelemetryProperties;
    }> = [];
    const failure = {
      ok: false as const,
      errors: [{ line: 1, column: 2, message: "invalid syntax" }],
    };
    const parser = instrumentParserPerformance(
      { parse: () => failure },
      {
        trackEvent: (eventName, properties) => {
          events.push({ eventName, properties });
        },
        dispose() {},
      },
    );

    assert.deepStrictEqual(parser.parse("raw definition content"), failure);
    assert.strictEqual(events[0]?.properties?.result, "failed");
    assert.strictEqual(events[0]?.properties?.diagnosticCountBucket, "1");
    assert.ok(!JSON.stringify(events[0]).includes("invalid syntax"));
    assert.ok(!JSON.stringify(events[0]).includes("raw definition content"));
  });
});
