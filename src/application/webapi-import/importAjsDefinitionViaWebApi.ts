export type ImportAjsDefinitionHostKind = "desktop" | "web";

export type ImportAjsDefinitionLanguage = "ja" | "en" | "zh";

export type ImportAjsDefinitionErrorCode =
  | "cancelled"
  | "unsupported-host"
  | "authentication-failed"
  | "authorization-failed"
  | "network-failed"
  | "timeout"
  | "unexpected-status"
  | "malformed-response"
  | "resource-not-found"
  | "web-console-unavailable"
  | "conflict"
  | "invalid-request"
  | "server-error";

export type ImportAjsDefinitionScopeDto = {
  manager: string;
  serviceName: string;
  location: string;
  searchLowerUnits?: boolean;
};

export type ImportAjsDefinitionConnectionDto = {
  baseUrl: string;
  acceptLanguage?: ImportAjsDefinitionLanguage;
  timeoutMs?: number;
};

export type ImportAjsDefinitionRequestDto = {
  host: ImportAjsDefinitionHostKind;
  connection: ImportAjsDefinitionConnectionDto;
  scope: ImportAjsDefinitionScopeDto;
  credentialRef?: string;
};

export type ImportAjsDefinitionPortRequestDto = {
  endpoint: "unit-list";
  method: "GET";
  path: "/ajs/api/v1/objects/statuses";
  connection: ImportAjsDefinitionConnectionDto;
  credentialRef?: string;
  query: {
    mode: "search";
    manager: string;
    serviceName: string;
    location: string;
    searchLowerUnits: "YES" | "NO";
    searchTarget: "DEFINITION";
  };
};

export type ImportedAjsDefinitionSourceDto = {
  type: "jp1-ajs3-webapi";
  endpoint: "unit-list";
  manualSection: "7.1.1 Unit list acquisition API";
  apiId: "SC-009";
  manager: string;
  serviceName: string;
  location: string;
  all: boolean;
};

export type ImportedAjsUnitDefinitionDto = {
  unitName: string;
  simpleUnitName?: string;
  unitType?: string;
  unitComment?: string;
  owner?: string;
  parameters?: string;
  rootJobnetName?: string;
  execAgent?: string;
  execFileName?: string;
  customJobType?: string;
  registerStatus?: string;
  recoveryUnit?: boolean;
  wait?: boolean;
  jobnetReleaseUnit?: boolean;
  jp1ResourceGroup?: string;
  unitID?: number;
};

export type ImportedAjsDefinitionContentDto = {
  source: ImportedAjsDefinitionSourceDto;
  units: ImportedAjsUnitDefinitionDto[];
  warnings: ImportAjsDefinitionWarningDto[];
};

export type ImportAjsDefinitionWarningDto = {
  code: "partial-result" | "empty-result" | "definition-missing";
  message: string;
  unitName?: string;
};

export type ImportAjsDefinitionErrorDto = {
  code: ImportAjsDefinitionErrorCode;
  message: string;
  recoverable: true;
  httpStatus?: number;
  messageId?: string;
};

export type ImportAjsDefinitionSuccessDto = {
  ok: true;
  content: ImportedAjsDefinitionContentDto;
};

export type ImportAjsDefinitionFailureDto = {
  ok: false;
  error: ImportAjsDefinitionErrorDto;
};

export type ImportAjsDefinitionResultDto =
  | ImportAjsDefinitionSuccessDto
  | ImportAjsDefinitionFailureDto;

export interface ImportAjsDefinitionViaWebApiPort {
  importDefinition(
    request: ImportAjsDefinitionPortRequestDto,
  ): Promise<ImportAjsDefinitionResultDto>;
}

export const buildDefinitionOnlyUnitListRequest = (
  request: ImportAjsDefinitionRequestDto,
): ImportAjsDefinitionPortRequestDto | ImportAjsDefinitionFailureDto => {
  if (request.host === "web") {
    return {
      ok: false,
      error: createImportAjsDefinitionError(
        "unsupported-host",
        "JP1/AJS WebAPI import is not supported in the web extension host yet.",
      ),
    };
  }

  return {
    endpoint: "unit-list",
    method: "GET",
    path: "/ajs/api/v1/objects/statuses",
    connection: { ...request.connection },
    credentialRef: request.credentialRef,
    query: {
      mode: "search",
      manager: request.scope.manager,
      serviceName: request.scope.serviceName,
      location: request.scope.location,
      searchLowerUnits: request.scope.searchLowerUnits === false ? "NO" : "YES",
      searchTarget: "DEFINITION",
    },
  };
};

export const createImportedAjsDefinitionContent = (
  source: Omit<
    ImportedAjsDefinitionSourceDto,
    "type" | "endpoint" | "manualSection" | "apiId"
  >,
  units: ImportedAjsUnitDefinitionDto[],
  warnings: ImportAjsDefinitionWarningDto[] = [],
): ImportedAjsDefinitionContentDto => ({
  source: {
    type: "jp1-ajs3-webapi",
    endpoint: "unit-list",
    manualSection: "7.1.1 Unit list acquisition API",
    apiId: "SC-009",
    ...source,
  },
  units: units.map((unit) => ({ ...unit })),
  warnings: warnings.map((warning) => ({ ...warning })),
});

export const createImportAjsDefinitionError = (
  code: ImportAjsDefinitionErrorCode,
  message: string,
  details: Pick<ImportAjsDefinitionErrorDto, "httpStatus" | "messageId"> = {},
): ImportAjsDefinitionErrorDto => ({
  code,
  message,
  recoverable: true,
  ...details,
});

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

export const mapHttpStatusToImportErrorCode = (
  httpStatus: number,
): ImportAjsDefinitionErrorCode =>
  HTTP_STATUS_IMPORT_ERROR_CODES[httpStatus] ?? "unexpected-status";
