import {
  createWebApiImportWorkflowEvent,
  type WebApiImportTelemetryInputStep,
} from "../../../application/telemetry/webApiImportTelemetry";
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
} from "../../../application/webapi-import/importAjsDefinitionViaWebApi";

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
  now: () => number;
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

type ImportInputCollection =
  | { kind: "ready"; inputs: ImportInputs }
  | { kind: "cancelled"; inputStep: WebApiImportTelemetryInputStep };

type ImportInputStep = {
  key: ImportInputKey;
  options: (
    values: Partial<ImportInputValues>,
  ) => ImportAjsDefinitionInputOptions;
};

type ImportCommandEarlyExit =
  | { kind: "handled"; result: ImportAjsDefinitionResultDto }
  | { kind: "ready"; host: ImportAjsDefinitionHostKind; startedAt: number };

type ImportExecutionPlan =
  | {
      kind: "ready";
      request: ImportAjsDefinitionPortRequestDto;
      inputs: ImportInputs;
      startedAt: number;
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

  return executeDesktopImport(deps, earlyExit);
};

const resolveEarlyExit = async (
  deps: ImportAjsDefinitionCommandDeps,
): Promise<ImportCommandEarlyExit> => {
  const host = deps.getHost();
  const startedAt = deps.now();
  reportImportStarted(deps, host);
  const unsupportedHostResult = await rejectUnsupportedHostIfNeeded(
    deps,
    host,
    startedAt,
  );
  return unsupportedHostResult
    ? { kind: "handled", result: unsupportedHostResult }
    : { kind: "ready", host, startedAt };
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

const executeDesktopImport = async (
  deps: ImportAjsDefinitionCommandDeps,
  { host, startedAt }: Extract<ImportCommandEarlyExit, { kind: "ready" }>,
): Promise<ImportAjsDefinitionResultDto> => {
  const plan = await buildImportExecutionPlan(deps, host, startedAt);
  if (plan.kind === "done") {
    return plan.result;
  }

  await storeImportCredential(deps, plan.request, plan.inputs);

  const result = await deps.importPort.importDefinition(plan.request);
  await reportImportResult(deps, result, plan.startedAt);
  return result;
};

const buildImportExecutionPlan = async (
  deps: ImportAjsDefinitionCommandDeps,
  host: ImportAjsDefinitionHostKind,
  startedAt: number,
): Promise<ImportExecutionPlan> => {
  const inputCollection = await collectInputs(deps);
  if (inputCollection.kind === "cancelled") {
    return {
      kind: "done",
      result: reportCancelledImport(deps, startedAt, inputCollection.inputStep),
    };
  }

  const inputs = inputCollection.inputs;
  const request = buildDefinitionOnlyUnitListRequest({
    host,
    connection: inputs.connection,
    scope: inputs.scope,
    credentialRef: buildCredentialRef(inputs.connection, inputs.scope),
  });

  if ("ok" in request) {
    return {
      kind: "done",
      result: await reportRequestBuildFailure(deps, request, startedAt),
    };
  }

  return { kind: "ready", request, inputs, startedAt };
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
    inputs: {
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
      username: inputValues.values.username,
      password: inputValues.values.password,
    },
  };
};

const rejectUnsupportedHostIfNeeded = async (
  deps: ImportAjsDefinitionCommandDeps,
  host: ImportAjsDefinitionHostKind,
  startedAt: number,
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
      host: deps.getHost(),
      stage: "cancelled",
      result: "cancelled",
      durationMs: deps.now() - startedAt,
      inputStep,
    }),
  );
  return result;
};

const reportRequestBuildFailure = async (
  deps: ImportAjsDefinitionCommandDeps,
  result: ImportAjsDefinitionFailureDto,
  startedAt: number,
): Promise<ImportAjsDefinitionFailureDto> => {
  await deps.showErrorMessage(result.error.message);
  reportWebApiImportFailure(deps, result, startedAt);
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
  startedAt: number,
): Promise<void> => {
  if (result.ok) {
    await reportImportSuccess(deps, result, startedAt);
    return;
  }

  if (isFailure(result)) {
    await reportImportFailure(deps, result, startedAt);
  }
};

const reportImportSuccess = async (
  deps: ImportAjsDefinitionCommandDeps,
  result: Extract<ImportAjsDefinitionResultDto, { ok: true }>,
  startedAt: number,
): Promise<void> => {
  await deps.showInformationMessage(
    `JP1/AJS WebAPI import beta loaded ${result.content.units.length} unit(s).`,
  );
  reportWebApiImportEvent(
    deps,
    createWebApiImportWorkflowEvent({
      host: deps.getHost(),
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
  startedAt: number,
): Promise<void> => {
  await deps.showErrorMessage(result.error.message);
  reportWebApiImportFailure(deps, result, startedAt);
};

const reportWebApiImportFailure = (
  deps: ImportAjsDefinitionCommandDeps,
  result: ImportAjsDefinitionFailureDto,
  startedAt: number,
): void => {
  reportWebApiImportEvent(
    deps,
    createWebApiImportWorkflowEvent({
      host: deps.getHost(),
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
