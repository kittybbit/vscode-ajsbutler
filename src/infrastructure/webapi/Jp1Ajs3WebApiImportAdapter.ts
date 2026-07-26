import {
  createImportedAjsDefinitionContent,
  createImportAjsDefinitionError,
  type ImportAjsDefinitionErrorCode,
  type ImportAjsDefinitionRequestDto,
  type ImportAjsDefinitionResultDto,
  type ImportAjsDefinitionViaWebApiPort,
  type ImportedAjsUnitDefinitionDto,
} from "../../application/webapi-import/importAjsDefinitionViaWebApi";
import type {
  Jp1Ajs3GetUnitListRequest,
  Jp1Ajs3StatusMonitoringResource,
  Jp1Ajs3UnitDefinitionInformation,
  Jp1Ajs3UnitListResponse,
  Jp1Ajs3WebApiError,
} from "./generated/jp1Ajs3WebApi.generated";
import { jp1Ajs3GetUnitListOperation } from "./generated/jp1Ajs3WebApi.generated";

export type Jp1Ajs3WebApiCredential = {
  username: string;
  password: string;
};

export interface Jp1Ajs3WebApiCredentialProvider {
  resolveCredential(
    credentialRef: string | undefined,
  ): Promise<Jp1Ajs3WebApiCredential | undefined>;
}

export type Jp1Ajs3WebApiFetch = (
  input: string,
  init: {
    method: "GET";
    headers: Record<string, string>;
    signal?: AbortSignal;
  },
) => Promise<{
  ok: boolean;
  status: number;
  json(): Promise<unknown>;
}>;

type Jp1Ajs3WebApiResponse = Awaited<ReturnType<Jp1Ajs3WebApiFetch>>;

export type Jp1Ajs3WebApiImportAdapterDeps = {
  credentialProvider: Jp1Ajs3WebApiCredentialProvider;
  fetch?: Jp1Ajs3WebApiFetch;
};

const DEFAULT_TIMEOUT_MS = 30000;

export class Jp1Ajs3WebApiImportAdapter
  implements ImportAjsDefinitionViaWebApiPort
{
  #credentialProvider: Jp1Ajs3WebApiCredentialProvider;
  #fetch: Jp1Ajs3WebApiFetch;

  constructor(deps: Jp1Ajs3WebApiImportAdapterDeps) {
    this.#credentialProvider = deps.credentialProvider;
    this.#fetch = deps.fetch ?? defaultFetch;
  }

  async importDefinition(
    request: ImportAjsDefinitionRequestDto,
  ): Promise<ImportAjsDefinitionResultDto> {
    const credential = await this.#credentialProvider.resolveCredential(
      request.credentialRef,
    );
    if (!credential) {
      return toMissingCredentialResult();
    }

    return await importDefinitionWithCredential(
      this.#fetch,
      request,
      credential,
    );
  }
}

const toMissingCredentialResult = (): ImportAjsDefinitionResultDto => ({
  ok: false,
  error: createImportAjsDefinitionError(
    "authentication-failed",
    "JP1/AJS WebAPI credentials are not available.",
  ),
});

const importDefinitionWithCredential = async (
  fetch: Jp1Ajs3WebApiFetch,
  request: ImportAjsDefinitionRequestDto,
  credential: Jp1Ajs3WebApiCredential,
): Promise<ImportAjsDefinitionResultDto> => {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    request.connection.timeoutMs ?? DEFAULT_TIMEOUT_MS,
  );

  try {
    const response = await fetch(buildRequestUrl(request), {
      method: jp1Ajs3GetUnitListOperation.method,
      headers: buildHeaders(request, credential),
      signal: controller.signal,
    });
    return await toResponseResult(request, response);
  } catch (error) {
    return toTransportError(error);
  } finally {
    clearTimeout(timeout);
  }
};

const toResponseResult = async (
  request: ImportAjsDefinitionRequestDto,
  response: Jp1Ajs3WebApiResponse,
): Promise<ImportAjsDefinitionResultDto> => {
  if (!response.ok) {
    return await toErrorResult(response);
  }

  return toUnitListResult(request, await response.json());
};

const toUnitListResult = (
  request: ImportAjsDefinitionRequestDto,
  body: unknown,
): ImportAjsDefinitionResultDto =>
  isUnitListResponse(body)
    ? toSuccessResult(request, body)
    : toMalformedResponseResult();

const toMalformedResponseResult = (): ImportAjsDefinitionResultDto => ({
  ok: false,
  error: createImportAjsDefinitionError(
    "malformed-response",
    "JP1/AJS WebAPI returned an unexpected unit-list response shape.",
  ),
});

const defaultFetch: Jp1Ajs3WebApiFetch = async (input, init) => {
  const fetchImpl = globalThis.fetch;
  if (!fetchImpl) {
    throw new Error("Fetch API is not available in this extension host.");
  }

  return fetchImpl(input, init);
};

const buildRequestUrl = (request: ImportAjsDefinitionRequestDto): string => {
  const url = new URL(
    jp1Ajs3GetUnitListOperation.path,
    ensureTrailingSlash(request.connection.baseUrl),
  );
  Object.entries(toDefinitionOnlyUnitListQuery(request)).forEach(
    ([key, value]) => {
      url.searchParams.set(key, value);
    },
  );
  return url.toString();
};

const toDefinitionOnlyUnitListQuery = (
  request: ImportAjsDefinitionRequestDto,
): Jp1Ajs3GetUnitListRequest["query"] => ({
  mode: "search",
  manager: request.scope.manager,
  serviceName: request.scope.serviceName,
  location: request.scope.location,
  searchLowerUnits: request.scope.searchLowerUnits === false ? "NO" : "YES",
  searchTarget: jp1Ajs3GetUnitListOperation.initialSearchTarget,
});

const ensureTrailingSlash = (baseUrl: string): string =>
  baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;

const buildHeaders = (
  request: ImportAjsDefinitionRequestDto,
  credential: Jp1Ajs3WebApiCredential,
): Record<string, string> => {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Accept-Language": request.connection.acceptLanguage ?? "en",
    "X-AJS-Authorization": encodeCredential(credential),
  };

  return headers;
};

const encodeCredential = (credential: Jp1Ajs3WebApiCredential): string => {
  const value = `${credential.username}:${credential.password}`;
  return btoa(unescape(encodeURIComponent(value)));
};

const toErrorResult = async (response: {
  status: number;
  json(): Promise<unknown>;
}): Promise<ImportAjsDefinitionResultDto> => {
  const body = await safeJson(response);
  const apiError = isWebApiError(body) ? body : undefined;
  return {
    ok: false,
    error: createImportAjsDefinitionError(
      mapHttpStatusToImportErrorCode(response.status),
      apiError?.message ?? `JP1/AJS WebAPI returned HTTP ${response.status}.`,
      {
        httpStatus: response.status,
        messageId: apiError?.messageID,
      },
    ),
  };
};

const safeJson = async (response: { json(): Promise<unknown> }) => {
  try {
    return await response.json();
  } catch {
    return undefined;
  }
};

const toSuccessResult = (
  request: ImportAjsDefinitionRequestDto,
  response: Jp1Ajs3UnitListResponse,
): ImportAjsDefinitionResultDto => {
  const units = response.statuses
    .map((status) => status.definition)
    .filter(isUnitDefinition)
    .map(toImportedUnitDefinition);
  const warnings = [
    ...(!response.all
      ? [
          {
            code: "partial-result" as const,
            message:
              "JP1/AJS WebAPI reported that the unit-list response was truncated.",
          },
        ]
      : []),
    ...(response.statuses.length === 0
      ? [
          {
            code: "empty-result" as const,
            message: "JP1/AJS WebAPI returned no units for the selected scope.",
          },
        ]
      : []),
    ...response.statuses
      .filter((status) => status.definition === null)
      .map((status) => ({
        code: "definition-missing" as const,
        message:
          "A status-monitoring resource did not include definition data.",
        unitName: status.unitStatus?.unitName,
      })),
  ];

  return {
    ok: true,
    content: createImportedAjsDefinitionContent(
      {
        manager: request.scope.manager,
        serviceName: request.scope.serviceName,
        location: request.scope.location,
        all: response.all,
      },
      units,
      warnings,
    ),
  };
};

const toTransportError = (error: unknown): ImportAjsDefinitionResultDto => {
  if (error instanceof DOMException && error.name === "AbortError") {
    return {
      ok: false,
      error: createImportAjsDefinitionError(
        "timeout",
        "JP1/AJS WebAPI request timed out.",
      ),
    };
  }

  return {
    ok: false,
    error: createImportAjsDefinitionError(
      "network-failed",
      "JP1/AJS WebAPI request failed before a response was received.",
    ),
  };
};

const HTTP_STATUS_IMPORT_ERROR_CODES: Record<
  number,
  ImportAjsDefinitionErrorCode
> = {
  400: "invalid-request",
  401: "authentication-failed",
  403: "authorization-failed",
  404: "resource-not-found",
  409: "conflict",
  412: "web-console-unavailable",
  500: "server-error",
};

const mapHttpStatusToImportErrorCode = (
  httpStatus: number,
): ImportAjsDefinitionErrorCode =>
  HTTP_STATUS_IMPORT_ERROR_CODES[httpStatus] ?? "unexpected-status";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isUnitListResponse = (value: unknown): value is Jp1Ajs3UnitListResponse =>
  isRecord(value) &&
  Array.isArray(value.statuses) &&
  value.statuses.every(isStatusMonitoringResource) &&
  typeof value.all === "boolean";

const isStatusMonitoringResource = (
  value: unknown,
): value is Jp1Ajs3StatusMonitoringResource => isRecord(value);

const isWebApiError = (value: unknown): value is Jp1Ajs3WebApiError =>
  isRecord(value) &&
  (typeof value.message === "string" || typeof value.messageID === "string");

const isUnitDefinition = (
  definition: Jp1Ajs3StatusMonitoringResource["definition"],
): definition is Jp1Ajs3UnitDefinitionInformation =>
  isRecord(definition) && typeof definition.unitName === "string";

const toImportedUnitDefinition = (
  definition: Jp1Ajs3UnitDefinitionInformation,
): ImportedAjsUnitDefinitionDto => ({
  unitName: definition.unitName ?? "",
  simpleUnitName: definition.simpleUnitName,
  unitType: definition.unitType,
  unitComment: definition.unitComment,
  owner: definition.owner,
  parameters: definition.parameters,
  rootJobnetName: definition.rootJobnetName,
  execAgent: definition.execAgent,
  execFileName: definition.execFileName,
  customJobType: definition.customJobType,
  registerStatus: definition.registerStatus,
  recoveryUnit: definition.recoveryUnit,
  wait: definition.wait,
  jobnetReleaseUnit: definition.jobnetReleaseUnit,
  jp1ResourceGroup: definition.jp1ResourceGroup,
  unitID: definition.unitID,
});
