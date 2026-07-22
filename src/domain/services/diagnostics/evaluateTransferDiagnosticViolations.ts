import {
  findAjsUnitParameter,
  findAjsUnitParameters,
  flattenAjsUnits,
  type AjsDocument,
  type AjsParameter,
  type AjsUnit,
} from "../../models/ajs/AjsDocument";
import type { DiagnosticViolation } from "./DiagnosticViolation";
import { diagnosticRuleIds } from "./DiagnosticRuleId";
import {
  hasInvalidExplicitTransferSourcePath,
  hasValidExplicitTransferByteLength,
  hasValidExplicitTransferFileValue,
} from "./TransferDiagnosticRules";

export const transferViolationReasons = {
  invalidSourceByteLength: "invalid-source-byte-length",
  invalidDestinationByteLength: "invalid-destination-byte-length",
  invalidSourceForm: "invalid-source-form",
  invalidDestinationForm: "invalid-destination-form",
  invalidSourcePath: "invalid-source-path",
  destinationRequiresSource: "destination-requires-source",
  operationRequiresSource: "operation-requires-source",
  customPcParameterProhibited: "custom-pc-parameter-prohibited",
} as const;

export type TransferViolationReason =
  (typeof transferViolationReasons)[keyof typeof transferViolationReasons];
export type TransferDiagnosticViolation =
  DiagnosticViolation<TransferViolationReason>;

const transferOperationTargetTypes = new Set([
  "j",
  "rj",
  "pj",
  "rp",
  "cj",
  "rcj",
  "cpj",
  "rcpj",
]);
const queueTransferTargetTypes = new Set(["qj", "rq"]);
const customPcTargetTypes = new Set(["cpj", "rcpj"]);
const transferFileIndexes = [1, 2, 3, 4] as const;

const buildViolation = (
  ruleId: TransferDiagnosticViolation["ruleId"],
  reason: TransferViolationReason,
  evidence: AjsParameter,
): TransferDiagnosticViolation => ({ ruleId, reason, evidence });

const isExplicitTarget = (
  unit: AjsUnit,
  targetTypes: ReadonlySet<string>,
): boolean => {
  const explicitType = findAjsUnitParameter(unit, "ty")?.value;
  return explicitType ? targetTypes.has(explicitType) : false;
};

const evaluateAll = (
  unit: AjsUnit,
  key: string,
  ruleId: TransferDiagnosticViolation["ruleId"],
  reason: TransferViolationReason,
  isInvalid: (parameter: AjsParameter) => boolean,
): TransferDiagnosticViolation[] =>
  findAjsUnitParameters(unit, key).flatMap((parameter) =>
    isInvalid(parameter) ? [buildViolation(ruleId, reason, parameter)] : [],
  );

const evaluateTransferRules = (
  unit: AjsUnit,
  includeOperationDependency: boolean,
): TransferDiagnosticViolation[] => [
  ...transferFileIndexes.flatMap((index) => [
    ...evaluateAll(
      unit,
      `ts${index}`,
      diagnosticRuleIds.transferFilePath,
      transferViolationReasons.invalidSourceByteLength,
      (parameter) => !hasValidExplicitTransferByteLength(parameter),
    ),
    ...evaluateAll(
      unit,
      `td${index}`,
      diagnosticRuleIds.transferFilePath,
      transferViolationReasons.invalidDestinationByteLength,
      (parameter) => !hasValidExplicitTransferByteLength(parameter),
    ),
  ]),
  ...transferFileIndexes.flatMap((index) => [
    ...evaluateAll(
      unit,
      `ts${index}`,
      diagnosticRuleIds.transferFileForm,
      transferViolationReasons.invalidSourceForm,
      (parameter) => !hasValidExplicitTransferFileValue(parameter, unit),
    ),
    ...evaluateAll(
      unit,
      `td${index}`,
      diagnosticRuleIds.transferFileForm,
      transferViolationReasons.invalidDestinationForm,
      (parameter) => !hasValidExplicitTransferFileValue(parameter, unit),
    ),
  ]),
  ...transferFileIndexes.flatMap((index) =>
    evaluateAll(
      unit,
      `ts${index}`,
      diagnosticRuleIds.transferFilePath,
      transferViolationReasons.invalidSourcePath,
      hasInvalidExplicitTransferSourcePath,
    ),
  ),
  ...transferFileIndexes.flatMap((index) => [
    ...evaluateAll(
      unit,
      `td${index}`,
      diagnosticRuleIds.transferFilePath,
      transferViolationReasons.destinationRequiresSource,
      () => !findAjsUnitParameter(unit, `ts${index}`),
    ),
    ...(includeOperationDependency
      ? evaluateAll(
          unit,
          `top${index}`,
          diagnosticRuleIds.transferFilePath,
          transferViolationReasons.operationRequiresSource,
          () => !findAjsUnitParameter(unit, `ts${index}`),
        )
      : []),
  ]),
];

const evaluateCustomPcViolations = (
  unit: AjsUnit,
): TransferDiagnosticViolation[] =>
  transferFileIndexes.flatMap((index) =>
    ["ts", "td", "top"].flatMap((prefix) => {
      const parameter = findAjsUnitParameter(unit, `${prefix}${index}`);
      return parameter
        ? [
            buildViolation(
              diagnosticRuleIds.transferFileForm,
              transferViolationReasons.customPcParameterProhibited,
              parameter,
            ),
          ]
        : [];
    }),
  );

export const evaluateTransferOperationDiagnosticViolations = (
  document: AjsDocument,
): TransferDiagnosticViolation[] =>
  flattenAjsUnits(document.rootUnits)
    .filter((unit) => isExplicitTarget(unit, transferOperationTargetTypes))
    .flatMap((unit) =>
      customPcTargetTypes.has(unit.unitType)
        ? evaluateCustomPcViolations(unit)
        : evaluateTransferRules(unit, true),
    );

export const evaluateQueueTransferDiagnosticViolations = (
  document: AjsDocument,
): TransferDiagnosticViolation[] =>
  flattenAjsUnits(document.rootUnits)
    .filter((unit) => isExplicitTarget(unit, queueTransferTargetTypes))
    .flatMap((unit) => evaluateTransferRules(unit, false));
