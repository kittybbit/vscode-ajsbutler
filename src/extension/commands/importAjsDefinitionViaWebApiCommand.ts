import {
  buildDefinitionOnlyUnitListRequest,
  createImportAjsDefinitionError,
  type ImportAjsDefinitionConnectionDto,
  type ImportAjsDefinitionFailureDto,
  type ImportAjsDefinitionHostKind,
  type ImportAjsDefinitionPortRequestDto,
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

type ImportInputValues = {
  baseUrl: string;
  manager: string;
  serviceName: string;
  location: string;
  username: string;
  password: string;
};

type ImportInputKey = keyof ImportInputValues;

type ImportInputStep = {
  key: ImportInputKey;
  options: (
    values: Partial<ImportInputValues>,
  ) => ImportAjsDefinitionInputOptions;
};

type ImportCommandEarlyExit =
  | { kind: "handled"; result: ImportAjsDefinitionResultDto }
  | { kind: "ready"; host: ImportAjsDefinitionHostKind };

type ImportExecutionPlan =
  | {
      kind: "ready";
      request: ImportAjsDefinitionPortRequestDto;
      inputs: ImportInputs;
    }
  | { kind: "done"; result: ImportAjsDefinitionResultDto };

const IMPORT_INPUT_KEYS: ImportInputKey[] = [
  "baseUrl",
  "manager",
  "serviceName",
  "location",
  "username",
  "password",
];

const IMPORT_INPUT_STEPS: ImportInputStep[] = [
  {
    key: "baseUrl",
    options: () => ({
      prompt: "JP1/AJS Web Console URL",
      placeHolder: "https://localhost:22252",
    }),
  },
  {
    key: "manager",
    options: ({ baseUrl }) => ({
      prompt: "JP1/AJS manager host",
      placeHolder: "manager.example.com",
      value: baseUrl ? extractHostName(baseUrl) : undefined,
    }),
  },
  {
    key: "serviceName",
    options: () => ({
      prompt: "JP1/AJS scheduler service name",
      placeHolder: "AJSROOT1",
    }),
  },
  {
    key: "location",
    options: () => ({
      prompt: "JP1/AJS unit location",
      placeHolder: "/JobGroup",
      value: "/",
    }),
  },
  {
    key: "username",
    options: () => ({
      prompt: "JP1/AJS user name",
      placeHolder: "jp1admin",
    }),
  },
  {
    key: "password",
    options: () => ({
      prompt: "JP1/AJS password",
      password: true,
    }),
  },
];

export const executeImportAjsDefinitionViaWebApiCommand = async (
  deps: ImportAjsDefinitionCommandDeps,
): Promise<ImportAjsDefinitionResultDto> => {
  const earlyExit = await resolveEarlyExit(deps);
  if (earlyExit.kind === "handled") {
    return earlyExit.result;
  }

  return executeDesktopImport(deps, earlyExit.host);
};

const resolveEarlyExit = async (
  deps: ImportAjsDefinitionCommandDeps,
): Promise<ImportCommandEarlyExit> => {
  const host = deps.getHost();
  const unsupportedHostResult = await rejectUnsupportedHostIfNeeded(deps, host);
  return unsupportedHostResult
    ? { kind: "handled", result: unsupportedHostResult }
    : { kind: "ready", host };
};

const executeDesktopImport = async (
  deps: ImportAjsDefinitionCommandDeps,
  host: ImportAjsDefinitionHostKind,
): Promise<ImportAjsDefinitionResultDto> => {
  const plan = await buildImportExecutionPlan(deps, host);
  if (plan.kind === "done") {
    return plan.result;
  }

  await storeImportCredential(deps, plan.request, plan.inputs);

  const result = await deps.importPort.importDefinition(plan.request);
  await reportImportResult(deps, result);
  return result;
};

const buildImportExecutionPlan = async (
  deps: ImportAjsDefinitionCommandDeps,
  host: ImportAjsDefinitionHostKind,
): Promise<ImportExecutionPlan> => {
  const inputs = await collectInputs(deps);
  if (!inputs) {
    return { kind: "done", result: reportCancelledImport(deps) };
  }

  const request = buildDefinitionOnlyUnitListRequest({
    host,
    connection: inputs.connection,
    scope: inputs.scope,
    credentialRef: buildCredentialRef(inputs.connection, inputs.scope),
  });

  if ("ok" in request) {
    return {
      kind: "done",
      result: await reportRequestBuildFailure(deps, request),
    };
  }

  return { kind: "ready", request, inputs };
};

const collectInputs = async (
  deps: ImportAjsDefinitionCommandDeps,
): Promise<ImportInputs | undefined> => {
  const values = await collectRequiredInputValues(deps);
  if (!values) {
    return undefined;
  }

  return {
    connection: {
      baseUrl: values.baseUrl,
      acceptLanguage: toWebApiLanguage(deps.getLanguage()),
    },
    scope: {
      manager: values.manager,
      serviceName: values.serviceName,
      location: values.location,
      searchLowerUnits: true,
    },
    username: values.username,
    password: values.password,
  };
};

const rejectUnsupportedHostIfNeeded = async (
  deps: ImportAjsDefinitionCommandDeps,
  host: ImportAjsDefinitionHostKind,
): Promise<ImportAjsDefinitionResultDto | undefined> => {
  if (host !== "web") {
    return undefined;
  }

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
};

const reportCancelledImport = (
  deps: ImportAjsDefinitionCommandDeps,
): ImportAjsDefinitionResultDto => {
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
};

const reportRequestBuildFailure = async (
  deps: ImportAjsDefinitionCommandDeps,
  result: ImportAjsDefinitionFailureDto,
): Promise<ImportAjsDefinitionFailureDto> => {
  await deps.showErrorMessage(result.error.message);
  deps.trackEvent("webapiImport", {
    result: result.error.code,
  });
  return result;
};

const storeImportCredential = async (
  deps: ImportAjsDefinitionCommandDeps,
  request: ImportAjsDefinitionPortRequestDto,
  inputs: ImportInputs,
): Promise<void> => {
  await deps.storeCredential(request.credentialRef ?? "", {
    username: inputs.username,
    password: inputs.password,
  });
};

const reportImportResult = async (
  deps: ImportAjsDefinitionCommandDeps,
  result: ImportAjsDefinitionResultDto,
): Promise<void> => {
  if (result.ok) {
    await reportImportSuccess(deps, result);
    return;
  }

  if (isFailure(result)) {
    await reportImportFailure(deps, result);
  }
};

const reportImportSuccess = async (
  deps: ImportAjsDefinitionCommandDeps,
  result: Extract<ImportAjsDefinitionResultDto, { ok: true }>,
): Promise<void> => {
  await deps.showInformationMessage(
    `JP1/AJS WebAPI import beta loaded ${result.content.units.length} unit(s).`,
  );
  deps.trackEvent("webapiImport", {
    result: "success",
    unitCount: String(result.content.units.length),
    all: String(result.content.source.all),
  });
};

const reportImportFailure = async (
  deps: ImportAjsDefinitionCommandDeps,
  result: ImportAjsDefinitionFailureDto,
): Promise<void> => {
  const error = result.error;
  await deps.showErrorMessage(error.message);
  deps.trackEvent("webapiImport", {
    result: error.code,
    httpStatus: error.httpStatus ? String(error.httpStatus) : "none",
  });
};

const collectRequiredInputValues = async (
  deps: ImportAjsDefinitionCommandDeps,
): Promise<ImportInputValues | undefined> => {
  const values: Partial<ImportInputValues> = {};
  let completed = true;

  for (const step of IMPORT_INPUT_STEPS) {
    const value = await promptRequired(deps, step.options(values));
    if (value) {
      values[step.key] = value;
    } else {
      completed = false;
      break;
    }
  }

  return completed && hasImportInputValues(values) ? values : undefined;
};

const hasImportInputValues = (
  values: Partial<ImportInputValues>,
): values is ImportInputValues =>
  IMPORT_INPUT_KEYS.every((key) => typeof values[key] === "string");

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
