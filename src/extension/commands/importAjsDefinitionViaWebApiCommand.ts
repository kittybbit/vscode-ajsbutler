import {
  buildDefinitionOnlyUnitListRequest,
  createImportAjsDefinitionError,
  type ImportAjsDefinitionConnectionDto,
  type ImportAjsDefinitionFailureDto,
  type ImportAjsDefinitionHostKind,
  type ImportAjsDefinitionResultDto,
  type ImportAjsDefinitionScopeDto,
  type ImportAjsDefinitionViaWebApiPort,
} from "../../application/webapi-import/importAjsDefinitionViaWebApi";

export const IMPORT_AJS_DEFINITION_VIA_WEBAPI_COMMAND =
  "ajsbutler.importDefinitionViaWebApiBeta";

export type ImportAjsDefinitionInputOptions = {
  prompt: string;
  placeHolder?: string;
  password?: boolean;
  value?: string;
};

export type ImportAjsDefinitionCommandDeps = {
  getHost: () => ImportAjsDefinitionHostKind;
  getLanguage: () => string | undefined;
  showInputBox: (
    options: ImportAjsDefinitionInputOptions,
  ) => Thenable<string | undefined>;
  showInformationMessage: (message: string) => Thenable<string | undefined>;
  showErrorMessage: (message: string) => Thenable<string | undefined>;
  storeCredential: (
    credentialRef: string,
    credential: { username: string; password: string },
  ) => Promise<void>;
  importPort: ImportAjsDefinitionViaWebApiPort;
  trackEvent: (eventName: string, properties?: Record<string, string>) => void;
};

type ImportInputs = {
  connection: ImportAjsDefinitionConnectionDto;
  scope: ImportAjsDefinitionScopeDto;
  username: string;
  password: string;
};

export const executeImportAjsDefinitionViaWebApiCommand = async (
  deps: ImportAjsDefinitionCommandDeps,
): Promise<ImportAjsDefinitionResultDto> => {
  const host = deps.getHost();
  if (host === "web") {
    const result: ImportAjsDefinitionResultDto = {
      ok: false,
      error: createImportAjsDefinitionError(
        "unsupported-host",
        "JP1/AJS WebAPI import beta is available only in the desktop extension host.",
      ),
    };
    await deps.showErrorMessage(result.error.message);
    deps.trackEvent("webapiImport", {
      result: "unsupported-host",
    });
    return result;
  }

  const inputs = await collectInputs(deps);
  if (!inputs) {
    const result: ImportAjsDefinitionResultDto = {
      ok: false,
      error: createImportAjsDefinitionError(
        "cancelled",
        "JP1/AJS WebAPI import was cancelled.",
      ),
    };
    deps.trackEvent("webapiImport", {
      result: "cancelled",
    });
    return result;
  }

  const request = buildDefinitionOnlyUnitListRequest({
    host,
    connection: inputs.connection,
    scope: inputs.scope,
    credentialRef: buildCredentialRef(inputs.connection, inputs.scope),
  });

  if ("ok" in request) {
    await deps.showErrorMessage(request.error.message);
    deps.trackEvent("webapiImport", {
      result: request.error.code,
    });
    return request;
  }

  await deps.storeCredential(request.credentialRef ?? "", {
    username: inputs.username,
    password: inputs.password,
  });

  const result = await deps.importPort.importDefinition(request);
  if (result.ok) {
    await deps.showInformationMessage(
      `JP1/AJS WebAPI import beta loaded ${result.content.units.length} unit(s).`,
    );
    deps.trackEvent("webapiImport", {
      result: "success",
      unitCount: String(result.content.units.length),
      all: String(result.content.source.all),
    });
    return result;
  }

  if (isFailure(result)) {
    const error = result.error;
    await deps.showErrorMessage(error.message);
    deps.trackEvent("webapiImport", {
      result: error.code,
      httpStatus: error.httpStatus ? String(error.httpStatus) : "none",
    });
  }
  return result;
};

const collectInputs = async (
  deps: ImportAjsDefinitionCommandDeps,
): Promise<ImportInputs | undefined> => {
  const baseUrl = await promptRequired(deps, {
    prompt: "JP1/AJS Web Console URL",
    placeHolder: "https://localhost:22252",
  });
  if (!baseUrl) {
    return undefined;
  }

  const manager = await promptRequired(deps, {
    prompt: "JP1/AJS manager host",
    placeHolder: "manager.example.com",
    value: extractHostName(baseUrl),
  });
  if (!manager) {
    return undefined;
  }

  const serviceName = await promptRequired(deps, {
    prompt: "JP1/AJS scheduler service name",
    placeHolder: "AJSROOT1",
  });
  if (!serviceName) {
    return undefined;
  }

  const location = await promptRequired(deps, {
    prompt: "JP1/AJS unit location",
    placeHolder: "/JobGroup",
    value: "/",
  });
  if (!location) {
    return undefined;
  }

  const username = await promptRequired(deps, {
    prompt: "JP1/AJS user name",
    placeHolder: "jp1admin",
  });
  if (!username) {
    return undefined;
  }

  const password = await promptRequired(deps, {
    prompt: "JP1/AJS password",
    password: true,
  });
  if (!password) {
    return undefined;
  }

  return {
    connection: {
      baseUrl,
      acceptLanguage: toWebApiLanguage(deps.getLanguage()),
    },
    scope: {
      manager,
      serviceName,
      location,
      searchLowerUnits: true,
    },
    username,
    password,
  };
};

const promptRequired = async (
  deps: ImportAjsDefinitionCommandDeps,
  options: ImportAjsDefinitionInputOptions,
): Promise<string | undefined> => {
  const value = await deps.showInputBox(options);
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : undefined;
};

const buildCredentialRef = (
  connection: ImportAjsDefinitionConnectionDto,
  scope: ImportAjsDefinitionScopeDto,
): string =>
  [
    "jp1-ajs-webapi",
    normalizeCredentialRefPart(connection.baseUrl),
    normalizeCredentialRefPart(scope.manager),
    normalizeCredentialRefPart(scope.serviceName),
  ].join(":");

const normalizeCredentialRefPart = (value: string): string =>
  encodeURIComponent(value.trim().toLowerCase());

const extractHostName = (baseUrl: string): string | undefined => {
  try {
    return new URL(baseUrl).hostname;
  } catch {
    return undefined;
  }
};

const toWebApiLanguage = (language: string | undefined): "ja" | "en" | "zh" => {
  const normalized = language?.toLowerCase().split("-")[0];
  return normalized === "ja" || normalized === "zh" ? normalized : "en";
};

const isFailure = (
  result: ImportAjsDefinitionResultDto,
): result is ImportAjsDefinitionFailureDto => !result.ok;
