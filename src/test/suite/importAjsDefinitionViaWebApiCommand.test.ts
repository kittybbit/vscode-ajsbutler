import * as assert from "assert";
import {
  executeImportAjsDefinitionViaWebApiCommand,
  IMPORT_AJS_DEFINITION_VIA_WEBAPI_COMMAND,
  type ImportAjsDefinitionCommandDeps,
  type ImportAjsDefinitionCommandRequest,
} from "../../presentation/vscode/commands/importAjsDefinitionViaWebApiCommand";
import {
  createImportedAjsDefinitionContent,
  createImportAjsDefinitionError,
} from "../../application/webapi-import/importAjsDefinitionViaWebApi";
import type { ValidatedTelemetryEvent } from "../../application/telemetry/TelemetryPort";
import { VscodeTelemetryAdapter } from "../../infrastructure/telemetry/VscodeTelemetryAdapter";

type ImportAjsDefinitionCommandObservations = {
  prompts: Array<{ prompt: string; value?: string }>;
  requests: ImportAjsDefinitionCommandRequest[];
  informationMessages: string[];
  errorMessages: string[];
  events: Array<{
    eventName: string;
    properties?: Record<string, string>;
  }>;
};

class ImportAjsDefinitionCommandHarness {
  readonly observed: ImportAjsDefinitionCommandObservations = {
    prompts: [],
    requests: [],
    informationMessages: [],
    errorMessages: [],
    events: [],
  };

  readonly deps: ImportAjsDefinitionCommandDeps;

  private readonly answers: string[];

  constructor(
    answers: string[],
    overrides: Partial<ImportAjsDefinitionCommandDeps> = {},
  ) {
    this.answers = [...answers];
    this.deps = {
      getHost: () => "desktop",
      getLanguage: () => "ja",
      showInputBox: (options) => this.showInputBox(options),
      showInformationMessage: (message) => this.showInformationMessage(message),
      showErrorMessage: (message) => this.showErrorMessage(message),
      importCapability: {
        importDefinition: (request) => this.importDefinition(request),
      },
      now: () => 0,
      reportTelemetry: (event) => this.reportTelemetry(event),
      ...overrides,
    };
  }

  private async showInputBox(
    options: Parameters<ImportAjsDefinitionCommandDeps["showInputBox"]>[0],
  ): Promise<string | undefined> {
    this.observed.prompts.push({
      prompt: options.prompt,
      value: options.value,
    });
    return this.answers.shift();
  }

  private async showInformationMessage(message: string): Promise<undefined> {
    this.observed.informationMessages.push(message);
    return undefined;
  }

  private async showErrorMessage(message: string): Promise<undefined> {
    this.observed.errorMessages.push(message);
    return undefined;
  }

  private async importDefinition(request: ImportAjsDefinitionCommandRequest) {
    this.observed.requests.push(request);
    return {
      ok: true as const,
      content: createImportedAjsDefinitionContent(
        {
          manager: request.scope.manager,
          serviceName: request.scope.serviceName,
          location: request.scope.location,
          all: true,
        },
        [{ unitName: "/JobGroup/Jobnet" }],
      ),
    };
  }

  private reportTelemetry(event: ValidatedTelemetryEvent): void {
    this.observed.events.push({
      eventName: event.name,
      properties: event.properties,
    });
  }
}

const createDeps = (
  answers: string[],
  overrides: Partial<ImportAjsDefinitionCommandDeps> = {},
): ImportAjsDefinitionCommandHarness =>
  new ImportAjsDefinitionCommandHarness(answers, overrides);

const successfulAnswers = [
  "https://web-console.example.com:22252",
  "manager.example.com",
  "AJSROOT1",
  "/JobGroup",
  "jp1admin",
  "secret",
];

suite("Import AJS definition via WebAPI command", () => {
  test("uses the contributed beta command id", () => {
    assert.strictEqual(
      IMPORT_AJS_DEFINITION_VIA_WEBAPI_COMMAND,
      "ajsbutler.importDefinitionViaWebApiBeta",
    );
  });

  test("collects inputs and invokes the injected import capability", async () => {
    const state = createDeps(successfulAnswers);

    const result = await executeImportAjsDefinitionViaWebApiCommand(state.deps);

    assert.strictEqual(result.ok, true);
    assert.deepStrictEqual(state.observed.prompts, [
      { prompt: "JP1/AJS Web Console URL", value: undefined },
      {
        prompt: "JP1/AJS manager host",
        value: "web-console.example.com",
      },
      {
        prompt: "JP1/AJS scheduler service name",
        value: undefined,
      },
      { prompt: "JP1/AJS unit location", value: "/" },
      { prompt: "JP1/AJS user name", value: undefined },
      { prompt: "JP1/AJS password", value: undefined },
    ]);
    assert.deepStrictEqual(state.observed.requests, [
      {
        connection: {
          baseUrl: "https://web-console.example.com:22252",
          acceptLanguage: "ja",
        },
        scope: {
          manager: "manager.example.com",
          serviceName: "AJSROOT1",
          location: "/JobGroup",
          searchLowerUnits: true,
        },
        credential: {
          username: "jp1admin",
          password: "secret",
        },
      },
    ]);
    const serializedRequest = JSON.stringify(state.observed.requests[0]);
    assert.ok(!serializedRequest.includes('"credentialRef"'));
    assert.ok(!serializedRequest.includes('"method"'));
    assert.ok(!serializedRequest.includes('"path"'));
    assert.ok(!serializedRequest.includes('"searchTarget"'));
    assert.deepStrictEqual(state.observed.informationMessages, [
      "JP1/AJS WebAPI import beta loaded 1 unit(s).",
    ]);
    assert.deepStrictEqual(
      state.observed.events.map((event) => event.eventName),
      ["webapi_import.workflow.started", "webapi_import.workflow.completed"],
    );
    assert.deepStrictEqual(state.observed.events[0].properties, {
      development: String(DEVELOPMENT),
      host: "desktop",
      stage: "started",
      result: "started",
    });
    assert.deepStrictEqual(state.observed.events[1].properties, {
      development: String(DEVELOPMENT),
      host: "desktop",
      stage: "completed",
      result: "success",
      durationBucket: "lt100ms",
      unitCountBucket: "1",
      all: "true",
    });
  });

  test("returns cancelled without invoking the capability", async () => {
    const state = createDeps(["https://web-console.example.com:22252"]);

    const result = await executeImportAjsDefinitionViaWebApiCommand(state.deps);

    assert.strictEqual(result.ok, false);
    if (result.ok) {
      throw new Error("Expected cancelled result.");
    }
    assert.strictEqual(result.error.code, "cancelled");
    assert.deepStrictEqual(state.observed.requests, []);
    assert.deepStrictEqual(
      state.observed.events.map((event) => event.eventName),
      ["webapi_import.workflow.started", "webapi_import.workflow.cancelled"],
    );
    assert.deepStrictEqual(state.observed.events[1].properties, {
      development: String(DEVELOPMENT),
      host: "desktop",
      stage: "cancelled",
      result: "cancelled",
      durationBucket: "lt100ms",
      inputStep: "manager",
    });
  });

  test("falls back to en for unsupported WebAPI languages", async () => {
    const state = createDeps(successfulAnswers, {
      getLanguage: () => "fr",
    });

    await executeImportAjsDefinitionViaWebApiCommand(state.deps);

    assert.strictEqual(
      state.observed.requests[0].connection.acceptLanguage,
      "en",
    );
  });

  test("does not let telemetry failures block the import workflow", async () => {
    const telemetry = new VscodeTelemetryAdapter("test", () => ({
      sendTelemetryEvent: () => {
        throw new Error("telemetry failed");
      },
      dispose() {},
    }));
    const state = createDeps(successfulAnswers, {
      reportTelemetry: (event) => telemetry.report(event),
    });

    const result = await executeImportAjsDefinitionViaWebApiCommand(state.deps);

    assert.strictEqual(result.ok, true);
    assert.deepStrictEqual(state.observed.informationMessages, [
      "JP1/AJS WebAPI import beta loaded 1 unit(s).",
    ]);
  });

  test("does not swallow non-adapter reporting errors", async () => {
    const expected = new Error("invalid reporting dependency");
    const state = createDeps(successfulAnswers, {
      reportTelemetry: () => {
        throw expected;
      },
    });

    await assert.rejects(
      executeImportAjsDefinitionViaWebApiCommand(state.deps),
      (error) => error === expected,
    );
  });

  test("reports injected unsupported-host capability before prompting", async () => {
    const unavailable = {
      ok: false as const,
      error: createImportAjsDefinitionError(
        "unsupported-host",
        "JP1/AJS WebAPI import beta is available only in the desktop extension host.",
      ),
    };
    const state = createDeps([], {
      getHost: () => "web",
      importCapability: {
        unavailable,
        importDefinition: async () => unavailable,
      },
    });

    const result = await executeImportAjsDefinitionViaWebApiCommand(state.deps);

    assert.strictEqual(result, unavailable);
    assert.deepStrictEqual(state.observed.prompts, []);
    assert.deepStrictEqual(state.observed.errorMessages, [
      "JP1/AJS WebAPI import beta is available only in the desktop extension host.",
    ]);
    assert.deepStrictEqual(
      state.observed.events.map((event) => event.eventName),
      [
        "webapi_import.workflow.started",
        "webapi_import.workflow.unsupported_host",
      ],
    );
    assert.deepStrictEqual(state.observed.events[1].properties, {
      development: String(DEVELOPMENT),
      host: "web",
      stage: "unsupported_host",
      result: "unsupported_host",
      durationBucket: "lt100ms",
      errorCode: "unsupported-host",
    });
  });

  test("preserves capability rejection without reporting a result", async () => {
    const expected = new Error("secret storage unavailable");
    const state = createDeps(successfulAnswers, {
      importCapability: {
        importDefinition: async () => {
          throw expected;
        },
      },
    });

    await assert.rejects(
      executeImportAjsDefinitionViaWebApiCommand(state.deps),
      (error) => error === expected,
    );
    assert.deepStrictEqual(
      state.observed.events.map((event) => event.eventName),
      ["webapi_import.workflow.started"],
    );
    assert.deepStrictEqual(state.observed.informationMessages, []);
    assert.deepStrictEqual(state.observed.errorMessages, []);
  });

  test("reports failed import with safe error and HTTP status categories", async () => {
    const state = createDeps(successfulAnswers, {
      importCapability: {
        importDefinition: async () => ({
          ok: false,
          error: {
            code: "authorization-failed",
            message: "Forbidden",
            recoverable: true,
            httpStatus: 403,
          },
        }),
      },
    });

    const result = await executeImportAjsDefinitionViaWebApiCommand(state.deps);

    assert.strictEqual(result.ok, false);
    assert.deepStrictEqual(state.observed.errorMessages, ["Forbidden"]);
    assert.deepStrictEqual(state.observed.events[1].properties, {
      development: String(DEVELOPMENT),
      host: "desktop",
      stage: "failed",
      result: "failed",
      durationBucket: "lt100ms",
      errorCode: "authorization-failed",
      httpStatusCategory: "4xx",
    });
  });
});
