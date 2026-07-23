import {
  createWebApiImportWorkflowEvent,
  type WebApiImportTelemetryInputStep,
} from "../../../application/telemetry/webApiImportTelemetry";
import {
  createImportAjsDefinitionError,
  type ImportAjsDefinitionConnectionDto,
  type ImportAjsDefinitionFailureDto,
  type ImportAjsDefinitionHostKind,
  type ImportAjsDefinitionResultDto,
  type ImportAjsDefinitionScopeDto,
} from "../../../application/webapi-import/importAjsDefinitionViaWebApi";

export const IMPORT_AJS_DEFINITION_VIA_WEBAPI_COMMAND =
  "ajsbutler.importDefinitionViaWebApiBeta";

export type ImportAjsDefinitionInputOptions = {
  prompt: string;
  placeHolder?: string;
  password?: boolean;
  value?: string;
};

export type ImportAjsDefinitionCommandRequest = {
  connection: ImportAjsDefinitionConnectionDto;
  scope: ImportAjsDefinitionScopeDto;
  credential: {
    username: string;
    password: string;
  };
};

export type ImportAjsDefinitionCapability = {
  unavailable?: ImportAjsDefinitionFailureDto;
  importDefinition(
    request: ImportAjsDefinitionCommandRequest,
  ): Promise<ImportAjsDefinitionResultDto>;
};

export type ImportAjsDefinitionCommandDeps = {
  getHost: () => ImportAjsDefinitionHostKind;
  getLanguage: () => string | undefined;
  showInputBox: (
    options: ImportAjsDefinitionInputOptions,
  ) => Thenable<string | undefined>;
  showInformationMessage: (message: string) => Thenable<string | undefined>;
  showErrorMessage: (message: string) => Thenable<string | undefined>;
  importCapability: ImportAjsDefinitionCapability;
  now: () => number;
  trackEvent: (eventName: string, properties?: Record<string, string>) => void;
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

type ImportInputCollection =
  | { kind: "ready"; request: ImportAjsDefinitionCommandRequest }
  | { kind: "cancelled"; inputStep: WebApiImportTelemetryInputStep };

type ImportInputStep = {
  key: ImportInputKey;
  options: (
    values: Partial<ImportInputValues>,
  ) => ImportAjsDefinitionInputOptions;
};

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
  const host = deps.getHost();
  const startedAt = deps.now();
  reportImportStarted(deps, host);

  if (deps.importCapability.unavailable) {
    return await reportUnavailableImport(
      deps,
      deps.importCapability.unavailable,
      host,
      startedAt,
    );
  }

  const inputCollection = await collectInputs(deps);
  if (inputCollection.kind === "cancelled") {
    return reportCancelledImport(
      deps,
      host,
      startedAt,
      inputCollection.inputStep,
    );
  }

  const result = await deps.importCapability.importDefinition(
    inputCollection.request,
  );
  await reportImportResult(deps, result, host, startedAt);
  return result;
};

const reportImportStarted = (
  deps: ImportAjsDefinitionCommandDeps,
  host: ImportAjsDefinitionHostKind,
): void => {
  reportWebApiImportEvent(
    deps,
    createWebApiImportWorkflowEvent({
      host,
      stage: "started",
      result: "started",
    }),
  );
};

const collectInputs = async (
  deps: ImportAjsDefinitionCommandDeps,
): Promise<ImportInputCollection> => {
  const inputValues = await collectRequiredInputValues(deps);
  if (inputValues.kind === "cancelled") {
    return inputValues;
  }

  return {
    kind: "ready",
    request: {
      connection: {
        baseUrl: inputValues.values.baseUrl,
        acceptLanguage: toWebApiLanguage(deps.getLanguage()),
      },
      scope: {
        manager: inputValues.values.manager,
        serviceName: inputValues.values.serviceName,
        location: inputValues.values.location,
        searchLowerUnits: true,
      },
      credential: {
        username: inputValues.values.username,
        password: inputValues.values.password,
      },
    },
  };
};

const reportUnavailableImport = async (
  deps: ImportAjsDefinitionCommandDeps,
  result: ImportAjsDefinitionFailureDto,
  host: ImportAjsDefinitionHostKind,
  startedAt: number,
): Promise<ImportAjsDefinitionFailureDto> => {
  await deps.showErrorMessage(result.error.message);
  reportWebApiImportEvent(
    deps,
    createWebApiImportWorkflowEvent({
      host,
      stage: "unsupported_host",
      result: "unsupported_host",
      durationMs: deps.now() - startedAt,
      errorCode: result.error.code,
    }),
  );
  return result;
};

const reportCancelledImport = (
  deps: ImportAjsDefinitionCommandDeps,
  host: ImportAjsDefinitionHostKind,
  startedAt: number,
  inputStep: WebApiImportTelemetryInputStep,
): ImportAjsDefinitionResultDto => {
  const result: ImportAjsDefinitionResultDto = {
    ok: false,
    error: createImportAjsDefinitionError(
      "cancelled",
      "JP1/AJS WebAPI import was cancelled.",
    ),
  };
  reportWebApiImportEvent(
    deps,
    createWebApiImportWorkflowEvent({
      host,
      stage: "cancelled",
      result: "cancelled",
      durationMs: deps.now() - startedAt,
      inputStep,
    }),
  );
  return result;
};

const reportImportResult = async (
  deps: ImportAjsDefinitionCommandDeps,
  result: ImportAjsDefinitionResultDto,
  host: ImportAjsDefinitionHostKind,
  startedAt: number,
): Promise<void> => {
  if (result.ok) {
    await reportImportSuccess(deps, result, host, startedAt);
    return;
  }

  if (isFailure(result)) {
    await reportImportFailure(deps, result, host, startedAt);
  }
};

const reportImportSuccess = async (
  deps: ImportAjsDefinitionCommandDeps,
  result: Extract<ImportAjsDefinitionResultDto, { ok: true }>,
  host: ImportAjsDefinitionHostKind,
  startedAt: number,
): Promise<void> => {
  await deps.showInformationMessage(
    `JP1/AJS WebAPI import beta loaded ${result.content.units.length} unit(s).`,
  );
  reportWebApiImportEvent(
    deps,
    createWebApiImportWorkflowEvent({
      host,
      stage: "completed",
      result: "success",
      durationMs: deps.now() - startedAt,
      unitCount: result.content.units.length,
      all: result.content.source.all,
    }),
  );
};

const reportImportFailure = async (
  deps: ImportAjsDefinitionCommandDeps,
  result: ImportAjsDefinitionFailureDto,
  host: ImportAjsDefinitionHostKind,
  startedAt: number,
): Promise<void> => {
  await deps.showErrorMessage(result.error.message);
  reportWebApiImportFailure(deps, result, host, startedAt);
};

const reportWebApiImportFailure = (
  deps: ImportAjsDefinitionCommandDeps,
  result: ImportAjsDefinitionFailureDto,
  host: ImportAjsDefinitionHostKind,
  startedAt: number,
): void => {
  reportWebApiImportEvent(
    deps,
    createWebApiImportWorkflowEvent({
      host,
      stage: "failed",
      result: "failed",
      durationMs: deps.now() - startedAt,
      errorCode: result.error.code,
      httpStatus: result.error.httpStatus,
    }),
  );
};

const reportWebApiImportEvent = (
  deps: ImportAjsDefinitionCommandDeps,
  event: ReturnType<typeof createWebApiImportWorkflowEvent>,
): void => {
  try {
    deps.trackEvent(event.name, event.properties);
  } catch {
    // Telemetry must not change the WebAPI import workflow outcome.
  }
};

const collectRequiredInputValues = async (
  deps: ImportAjsDefinitionCommandDeps,
): Promise<
  | { kind: "ready"; values: ImportInputValues }
  | { kind: "cancelled"; inputStep: WebApiImportTelemetryInputStep }
> => {
  const inputSteps = await collectInputSteps(deps);
  if (inputSteps.kind === "cancelled") {
    return inputSteps;
  }
  if (hasImportInputValues(inputSteps.values)) {
    return { kind: "ready", values: inputSteps.values };
  }

  return { kind: "cancelled", inputStep: "password" };
};

const collectInputSteps = async (
  deps: ImportAjsDefinitionCommandDeps,
): Promise<
  | { kind: "ready"; values: Partial<ImportInputValues> }
  | { kind: "cancelled"; inputStep: WebApiImportTelemetryInputStep }
> => {
  let values: Partial<ImportInputValues> = {};
  for (const step of IMPORT_INPUT_STEPS) {
    const collected = await collectInputStep(deps, step, values);
    if (!collected) {
      return { kind: "cancelled", inputStep: toTelemetryInputStep(step.key) };
    }
    values = collected;
  }

  return { kind: "ready", values };
};

const collectInputStep = async (
  deps: ImportAjsDefinitionCommandDeps,
  step: ImportInputStep,
  values: Partial<ImportInputValues>,
): Promise<Partial<ImportInputValues> | undefined> => {
  const value = await promptRequired(deps, step.options(values));
  return value ? { ...values, [step.key]: value } : undefined;
};

const hasImportInputValues = (
  values: Partial<ImportInputValues>,
): values is ImportInputValues =>
  IMPORT_INPUT_KEYS.every((key) => typeof values[key] === "string");

const toTelemetryInputStep = (
  key: ImportInputKey,
): WebApiImportTelemetryInputStep => {
  switch (key) {
    case "baseUrl":
      return "base_url";
    case "serviceName":
      return "service_name";
    default:
      return key;
  }
};

const promptRequired = async (
  deps: ImportAjsDefinitionCommandDeps,
  options: ImportAjsDefinitionInputOptions,
): Promise<string | undefined> => {
  const value = await deps.showInputBox(options);
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : undefined;
};

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
