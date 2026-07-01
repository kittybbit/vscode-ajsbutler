import * as assert from "assert";
import {
  executeImportAjsDefinitionViaWebApiCommand,
  IMPORT_AJS_DEFINITION_VIA_WEBAPI_COMMAND,
  type ImportAjsDefinitionCommandDeps,
} from "../../presentation/vscode/commands/importAjsDefinitionViaWebApiCommand";
import {
  createImportedAjsDefinitionContent,
  type ImportAjsDefinitionPortRequestDto,
} from "../../application/webapi-import/importAjsDefinitionViaWebApi";

type ImportAjsDefinitionCommandObservations = {
  prompts: Array<{ prompt: string; value?: string }>;
  credentials: Array<{
    credentialRef: string;
    username: string;
    password: string;
  }>;
  imports: ImportAjsDefinitionPortRequestDto[];
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
    credentials: [],
    imports: [],
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
      storeCredential: (credentialRef, credential) =>
        this.storeCredential(credentialRef, credential),
      importPort: {
        importDefinition: (request) => this.importDefinition(request),
      },
      trackEvent: (eventName, properties) =>
        this.trackEvent(eventName, properties),
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

  private async storeCredential(
    credentialRef: string,
    credential: { username: string; password: string },
  ): Promise<void> {
    this.observed.credentials.push({
      credentialRef,
      username: credential.username,
      password: credential.password,
    });
  }

  private async importDefinition(request: ImportAjsDefinitionPortRequestDto) {
    this.observed.imports.push(request);
    return {
      ok: true as const,
      content: createImportedAjsDefinitionContent(
        {
          manager: request.query.manager,
          serviceName: request.query.serviceName,
          location: request.query.location,
          all: true,
        },
        [{ unitName: "/JobGroup/Jobnet" }],
      ),
    };
  }

  private trackEvent(
    eventName: string,
    properties?: Record<string, string>,
  ): void {
    this.observed.events.push({ eventName, properties });
  }
}

const createDeps = (
  answers: string[],
  overrides: Partial<ImportAjsDefinitionCommandDeps> = {},
): ImportAjsDefinitionCommandHarness =>
  new ImportAjsDefinitionCommandHarness(answers, overrides);

suite("Import AJS definition via WebAPI command", () => {
  test("uses the contributed beta command id", () => {
    assert.strictEqual(
      IMPORT_AJS_DEFINITION_VIA_WEBAPI_COMMAND,
      "ajsbutler.importDefinitionViaWebApiBeta",
    );
  });

  test("collects desktop inputs and calls the import port", async () => {
    const state = createDeps([
      "https://web-console.example.com:22252",
      "manager.example.com",
      "AJSROOT1",
      "/JobGroup",
      "jp1admin",
      "secret",
    ]);

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
    assert.strictEqual(state.observed.imports.length, 1);
    assert.deepStrictEqual(state.observed.imports[0].query, {
      mode: "search",
      manager: "manager.example.com",
      serviceName: "AJSROOT1",
      location: "/JobGroup",
      searchLowerUnits: "YES",
      searchTarget: "DEFINITION",
    });
    assert.strictEqual(
      state.observed.imports[0].connection.acceptLanguage,
      "ja",
    );
    assert.strictEqual(state.observed.credentials.length, 1);
    assert.strictEqual(state.observed.credentials[0].username, "jp1admin");
    assert.strictEqual(state.observed.credentials[0].password, "secret");
    assert.deepStrictEqual(state.observed.informationMessages, [
      "JP1/AJS WebAPI import beta loaded 1 unit(s).",
    ]);
    assert.strictEqual(
      state.observed.events.at(-1)?.properties?.result,
      "success",
    );
  });

  test("returns cancelled without storing credentials when input is cancelled", async () => {
    const state = createDeps(["https://web-console.example.com:22252"]);

    const result = await executeImportAjsDefinitionViaWebApiCommand(state.deps);

    assert.strictEqual(result.ok, false);
    if (result.ok) {
      throw new Error("Expected cancelled result.");
    }
    assert.strictEqual(result.error.code, "cancelled");
    assert.deepStrictEqual(state.observed.credentials, []);
    assert.deepStrictEqual(state.observed.imports, []);
  });

  test("falls back to en when VS Code language is not supported by WebAPI", async () => {
    const state = createDeps(
      [
        "https://web-console.example.com:22252",
        "manager.example.com",
        "AJSROOT1",
        "/JobGroup",
        "jp1admin",
        "secret",
      ],
      {
        getLanguage: () => "fr",
      },
    );

    await executeImportAjsDefinitionViaWebApiCommand(state.deps);

    assert.strictEqual(
      state.observed.imports[0].connection.acceptLanguage,
      "en",
    );
  });

  test("reports unsupported host before prompting in web execution", async () => {
    const state = createDeps([], {
      getHost: () => "web",
    });

    const result = await executeImportAjsDefinitionViaWebApiCommand(state.deps);

    assert.strictEqual(result.ok, false);
    if (result.ok) {
      throw new Error("Expected unsupported host result.");
    }
    assert.strictEqual(result.error.code, "unsupported-host");
    assert.deepStrictEqual(state.observed.prompts, []);
    assert.deepStrictEqual(state.observed.errorMessages, [
      "JP1/AJS WebAPI import beta is available only in the desktop extension host.",
    ]);
  });
});
