import * as assert from "assert";
import {
  executeImportAjsDefinitionViaWebApiCommand,
  IMPORT_AJS_DEFINITION_VIA_WEBAPI_COMMAND,
  type ImportAjsDefinitionCommandDeps,
} from "../../extension/commands/importAjsDefinitionViaWebApiCommand";
import {
  createImportedAjsDefinitionContent,
  type ImportAjsDefinitionPortRequestDto,
} from "../../application/webapi-import/importAjsDefinitionViaWebApi";

const createDeps = (
  answers: string[],
  overrides: Partial<ImportAjsDefinitionCommandDeps> = {},
) => {
  const prompts: Array<{ prompt: string; value?: string }> = [];
  const credentials: Array<{
    credentialRef: string;
    username: string;
    password: string;
  }> = [];
  const imports: ImportAjsDefinitionPortRequestDto[] = [];
  const informationMessages: string[] = [];
  const errorMessages: string[] = [];
  const events: Array<{
    eventName: string;
    properties?: Record<string, string>;
  }> = [];

  const deps: ImportAjsDefinitionCommandDeps = {
    getHost: () => "desktop",
    getLanguage: () => "ja",
    async showInputBox(options) {
      prompts.push({ prompt: options.prompt, value: options.value });
      return answers.shift();
    },
    async showInformationMessage(message) {
      informationMessages.push(message);
      return undefined;
    },
    async showErrorMessage(message) {
      errorMessages.push(message);
      return undefined;
    },
    async storeCredential(credentialRef, credential) {
      credentials.push({
        credentialRef,
        username: credential.username,
        password: credential.password,
      });
    },
    importPort: {
      async importDefinition(request) {
        imports.push(request);
        return {
          ok: true,
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
      },
    },
    trackEvent(eventName, properties) {
      events.push({ eventName, properties });
    },
    ...overrides,
  };

  return {
    deps,
    prompts,
    credentials,
    imports,
    informationMessages,
    errorMessages,
    events,
  };
};

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
    assert.deepStrictEqual(state.prompts, [
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
    assert.strictEqual(state.imports.length, 1);
    assert.deepStrictEqual(state.imports[0].query, {
      mode: "search",
      manager: "manager.example.com",
      serviceName: "AJSROOT1",
      location: "/JobGroup",
      searchLowerUnits: "YES",
      searchTarget: "DEFINITION",
    });
    assert.strictEqual(state.imports[0].connection.acceptLanguage, "ja");
    assert.strictEqual(state.credentials.length, 1);
    assert.strictEqual(state.credentials[0].username, "jp1admin");
    assert.strictEqual(state.credentials[0].password, "secret");
    assert.deepStrictEqual(state.informationMessages, [
      "JP1/AJS WebAPI import beta loaded 1 unit(s).",
    ]);
    assert.strictEqual(state.events.at(-1)?.properties?.result, "success");
  });

  test("returns cancelled without storing credentials when input is cancelled", async () => {
    const state = createDeps(["https://web-console.example.com:22252"]);

    const result = await executeImportAjsDefinitionViaWebApiCommand(state.deps);

    assert.strictEqual(result.ok, false);
    if (result.ok) {
      throw new Error("Expected cancelled result.");
    }
    assert.strictEqual(result.error.code, "cancelled");
    assert.deepStrictEqual(state.credentials, []);
    assert.deepStrictEqual(state.imports, []);
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

    assert.strictEqual(state.imports[0].connection.acceptLanguage, "en");
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
    assert.deepStrictEqual(state.prompts, []);
    assert.deepStrictEqual(state.errorMessages, [
      "JP1/AJS WebAPI import beta is available only in the desktop extension host.",
    ]);
  });
});
