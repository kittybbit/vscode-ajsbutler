import {
  createImportedAjsDefinitionContent,
  createImportAjsDefinitionError,
  mapHttpStatusToImportErrorCode,
  type ImportAjsDefinitionPortRequestDto,
  type ImportAjsDefinitionResultDto,
  type ImportAjsDefinitionViaWebApiPort,
  type ImportedAjsUnitDefinitionDto,
} from "../../application/webapi-import/importAjsDefinitionViaWebApi";
import type {
  Jp1Ajs3StatusMonitoringResource,
  Jp1Ajs3UnitDefinitionInformation,
  Jp1Ajs3UnitListResponse,
  Jp1Ajs3WebApiError,
} from "./generated/jp1Ajs3WebApi.generated";

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
    request: ImportAjsDefinitionPortRequestDto,
  ): Promise<ImportAjsDefinitionResultDto> {
    const credential = await this.#credentialProvider.resolveCredential(
      request.credentialRef,
    );
    if (!credential) {
      return {
        ok: false,
        error: createImportAjsDefinitionError(
          "authentication-failed",
          "JP1/AJS WebAPI credentials are not available.",
        ),
      };
    }

    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      request.connection.timeoutMs ?? DEFAULT_TIMEOUT_MS,
    );

    try {
      const response = await this.#fetch(buildRequestUrl(request), {
        method: request.method,
        headers: buildHeaders(request, credential),
        signal: controller.signal,
      });

      if (!response.ok) {
        return await toErrorResult(response);
      }

      const body = await response.json();
      if (!isUnitListResponse(body)) {
        return {
          ok: false,
          error: createImportAjsDefinitionError(
            "malformed-response",
            "JP1/AJS WebAPI returned an unexpected unit-list response shape.",
          ),
        };
      }

      return toSuccessResult(request, body);
    } catch (error) {
      return toTransportError(error);
    } finally {
      clearTimeout(timeout);
    }
  }
}

const defaultFetch: Jp1Ajs3WebApiFetch = async (input, init) => {
  const fetchImpl = globalThis.fetch;
  if (!fetchImpl) {
    throw new Error("Fetch API is not available in this extension host.");
  }

  return fetchImpl(input, init);
};

const buildRequestUrl = (
  request: ImportAjsDefinitionPortRequestDto,
): string => {
  const url = new URL(
    request.path,
    ensureTrailingSlash(request.connection.baseUrl),
  );
  Object.entries(request.query).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  return url.toString();
};

const ensureTrailingSlash = (baseUrl: string): string =>
  baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;

const buildHeaders = (
  request: ImportAjsDefinitionPortRequestDto,
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
  request: ImportAjsDefinitionPortRequestDto,
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
        manager: request.query.manager,
        serviceName: request.query.serviceName,
        location: request.query.location,
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
