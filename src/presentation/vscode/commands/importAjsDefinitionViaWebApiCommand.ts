import {
  createImportAjsDefinitionError,
  type ImportAjsDefinitionFailureDto,
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
  connection: {
    baseUrl: string;
    acceptLanguage: "ja" | "en" | "zh";
  };
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
  getLanguage: () => string | undefined;
  showInputBox: (
    options: ImportAjsDefinitionInputOptions,
  ) => Thenable<string | undefined>;
  showInformationMessage: (message: string) => Thenable<string | undefined>;
  showErrorMessage: (message: string) => Thenable<string | undefined>;
  importCapability: ImportAjsDefinitionCapability;
  reportCompleted?: (result: "success" | "failed" | "cancelled") => void;
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
  | { kind: "cancelled" };

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
    options: () => ({ prompt: "JP1/AJS user name", placeHolder: "jp1admin" }),
  },
  {
    key: "password",
    options: () => ({ prompt: "JP1/AJS password", password: true }),
  },
];

const collectInputSteps = async (
  deps: ImportAjsDefinitionCommandDeps,
): Promise<Partial<ImportInputValues> | undefined> => {
  let values: Partial<ImportInputValues> = {};
  for (const step of IMPORT_INPUT_STEPS) {
    const value = await promptRequired(deps, step.options(values));
    if (!value) return undefined;
    values = { ...values, [step.key]: value };
  }
  return values;
};

const buildImportRequest = (
  values: ImportInputValues,
  deps: ImportAjsDefinitionCommandDeps,
): ImportAjsDefinitionCommandRequest => ({
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
  credential: { username: values.username, password: values.password },
});

const collectInputs = async (
  deps: ImportAjsDefinitionCommandDeps,
): Promise<ImportInputCollection> => {
  const values = await collectInputSteps(deps);
  if (!values || !hasImportInputValues(values)) return { kind: "cancelled" };
  return {
    kind: "ready",
    request: buildImportRequest(values, deps),
  };
};

const importCollectedRequest = async (
  deps: ImportAjsDefinitionCommandDeps,
): Promise<ImportAjsDefinitionResultDto> => {
  const inputCollection = await collectInputs(deps);
  if (inputCollection.kind === "cancelled") {
    return {
      ok: false,
      error: createImportAjsDefinitionError(
        "cancelled",
        "JP1/AJS WebAPI import was cancelled.",
      ),
    };
  }

  return deps.importCapability.importDefinition(inputCollection.request);
};

const showImportResult = async (
  deps: ImportAjsDefinitionCommandDeps,
  result: ImportAjsDefinitionResultDto,
): Promise<void> => {
  if ("error" in result) {
    await deps.showErrorMessage(result.error.message);
  } else {
    await deps.showInformationMessage(
      `JP1/AJS WebAPI import beta loaded ${result.content.units.length} unit(s).`,
    );
  }
};

const executeImport = async (
  deps: ImportAjsDefinitionCommandDeps,
): Promise<ImportAjsDefinitionResultDto> => {
  const result =
    deps.importCapability.unavailable ?? (await importCollectedRequest(deps));
  if (!("error" in result) || result.error.code !== "cancelled") {
    await showImportResult(deps, result);
  }
  return result;
};

const resolveImportCompletion = (
  result: ImportAjsDefinitionResultDto,
): "success" | "failed" | "cancelled" => {
  if (!("error" in result)) return "success";
  return result.error.code === "cancelled" ? "cancelled" : "failed";
};

const reportCompletedSafely = (
  deps: ImportAjsDefinitionCommandDeps,
  result: ImportAjsDefinitionResultDto,
): void => {
  try {
    deps.reportCompleted?.(resolveImportCompletion(result));
  } catch {
    // Telemetry must not change prompts, results or errors.
  }
};

const reportImportFailureSafely = (
  deps: ImportAjsDefinitionCommandDeps,
): void => {
  try {
    deps.reportCompleted?.("failed");
  } catch {
    // Telemetry must not replace the original import failure.
  }
};

export const executeImportAjsDefinitionViaWebApiCommand = async (
  deps: ImportAjsDefinitionCommandDeps,
): Promise<ImportAjsDefinitionResultDto> => {
  try {
    const result = await executeImport(deps);
    reportCompletedSafely(deps, result);
    return result;
  } catch (error) {
    reportImportFailureSafely(deps);
    throw error;
  }
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
