import {
  findAjsUnitParameters,
  type AjsParameter,
  type AjsUnit,
} from "../../models/ajs/AjsDocument";
import { DEFAULTS } from "../../models/parameters/Defaults";
import type {
  SemanticDiffIdentityField,
  SemanticDiffIdentityFingerprintEvidence,
  SemanticDiffIdentityStrategyId,
} from "../../models/semantic-diff/SemanticDiff";
import {
  getCanonicalEventReceivingFilterByteLength,
  hasValidExplicitEventHostLength,
  hasValidExplicitEventReceivingFilterReference,
  hasValidExplicitEventReceivingId,
  hasValidExplicitEventReceivingQuotedString,
  hasValidExplicitEventSourceIpAddress,
  parseHashEscapedQuotedEventStringContent,
} from "../diagnostics/EventDiagnosticRules";
import {
  hasValidExplicitFileMonitoringByteLength,
  hasValidExplicitFileMonitoringCondition,
} from "../diagnostics/MonitoringWaitDiagnosticRules";

const commandTextUnitTypes = new Set(["j", "rj"]);
const executableFileUnitTypes = new Set(["j", "rj", "pj", "rp", "qj", "rq"]);
const eventReceptionUnitTypes = new Set(["evwj", "revwj"]);
const fileMonitoringUnitTypes = new Set(["flwj", "rflwj"]);

const eventSelectorKeys = [
  "evwid",
  "evusr",
  "evgrp",
  "evhst",
  "evipa",
  "evwms",
  "evdet",
  "evwsv",
  "evwfr",
  "evuid",
  "evgid",
  "evpid",
] as const;

type EventSelectorKey = (typeof eventSelectorKeys)[number];

const eventValueSegments = ["em", "al", "cr", "er", "wr", "no", "in", "db"];
const eventValueSegmentSet = new Set(eventValueSegments);

// JP1/AJS3 v13 Command Reference 5.2.6 and 5.2.7 define these as quoted
// string values with byte limits.  Identity selection is deliberately
// conservative: a value that is not a valid definition-file string falls
// back to the historical all-parameter representation.
const commandTextMaximumBytes = 1023;
const executableFileMaximumBytes = 511;
const executableParameterMaximumBytes = 1023;

const compareOrdinal = (left: string, right: string): number =>
  left < right ? -1 : left > right ? 1 : 0;

const sortOrdinal = (values: string[]): string[] =>
  [...values].sort(compareOrdinal);

const valuesFor = (unit: AjsUnit, key: string): AjsParameter[] =>
  findAjsUnitParameters(unit, key);

const field = (
  key: string,
  values: string[],
  presence = values.length > 0,
): SemanticDiffIdentityField => ({
  key,
  presence: presence ? "present" : "absent",
  values: presence ? values : [],
});

const scalarField = (
  key: string,
  parameters: AjsParameter[],
): SemanticDiffIdentityField =>
  field(
    key,
    parameters.map((parameter) => parameter.value),
  );

const exactlyOne = (parameters: AjsParameter[]): AjsParameter | undefined =>
  parameters.length === 1 ? parameters[0] : undefined;

const hasValidV13QuotedValue = (
  parameter: AjsParameter,
  maximumBytes: number,
): boolean => {
  const content = parseHashEscapedQuotedEventStringContent(parameter.value);
  if (content === undefined) {
    return false;
  }
  const byteLength = new TextEncoder().encode(content).length;
  return byteLength >= 1 && byteLength <= maximumBytes;
};

const isValidEventServerValue = (value: string): boolean => {
  const segments = value.split(":");
  return (
    segments.length >= 1 &&
    segments.length <= eventValueSegments.length &&
    segments.every(
      (segment, index) =>
        eventValueSegmentSet.has(segment) &&
        segment === eventValueSegments[index],
    )
  );
};

const isValidEventSelector = (
  key: EventSelectorKey,
  parameter: AjsParameter,
): boolean => {
  switch (key) {
    case "evwid":
      return hasValidExplicitEventReceivingId(parameter);
    case "evusr":
    case "evgrp":
      return hasValidExplicitEventReceivingQuotedString(parameter, 1, 20);
    case "evhst":
      return hasValidExplicitEventHostLength(parameter);
    case "evipa":
      return hasValidExplicitEventSourceIpAddress(parameter);
    case "evwms":
    case "evdet":
      return hasValidExplicitEventReceivingQuotedString(parameter, 1, 1024);
    case "evwsv":
      return isValidEventServerValue(parameter.value);
    case "evwfr":
      if (!hasValidExplicitEventReceivingFilterReference(parameter)) {
        return false;
      }
      return (
        (
          parseHashEscapedQuotedEventStringContent(
            parameter.value.slice(parameter.value.indexOf(":") + 1),
          ) ?? ""
        ).length > 0
      );
    case "evuid":
    case "evgid":
    case "evpid":
      return (
        /^-?\d+$/.test(parameter.value) &&
        Number(parameter.value) >= -1 &&
        Number(parameter.value) <= 9999999999
      );
  }
};

const hasValidEventSelectors = (unit: AjsUnit): boolean => {
  for (const key of eventSelectorKeys) {
    const parameters = valuesFor(unit, key);
    if (key !== "evwfr" && parameters.length > 1) {
      return false;
    }
    if (parameters.some((parameter) => !isValidEventSelector(key, parameter))) {
      return false;
    }
  }

  const totalFilterBytes = valuesFor(unit, "evwfr").reduce(
    (total, parameter) =>
      total + getCanonicalEventReceivingFilterByteLength(parameter),
    0,
  );
  return totalFilterBytes <= 2048;
};

const hasValidCommandTextForm = (unit: AjsUnit): boolean => {
  if (!commandTextUnitTypes.has(String(unit.unitType))) {
    return false;
  }

  const text = exactlyOne(valuesFor(unit, "te"));
  return (
    text !== undefined &&
    hasValidV13QuotedValue(text, commandTextMaximumBytes) &&
    valuesFor(unit, "sc").length === 0 &&
    valuesFor(unit, "prm").length === 0
  );
};

const hasValidExecutableFileForm = (unit: AjsUnit): boolean => {
  if (!executableFileUnitTypes.has(String(unit.unitType))) {
    return false;
  }

  const executable = exactlyOne(valuesFor(unit, "sc"));
  const parameters = valuesFor(unit, "prm");
  return (
    executable !== undefined &&
    hasValidV13QuotedValue(executable, executableFileMaximumBytes) &&
    valuesFor(unit, "te").length === 0 &&
    parameters.length <= 1 &&
    parameters.every((parameter) =>
      hasValidV13QuotedValue(parameter, executableParameterMaximumBytes),
    )
  );
};

const hasValidFileMonitoringForm = (unit: AjsUnit): boolean => {
  if (!fileMonitoringUnitTypes.has(String(unit.unitType))) {
    return false;
  }

  const file = exactlyOne(valuesFor(unit, "flwf"));
  const conditions = valuesFor(unit, "flwc");
  const condition = exactlyOne(conditions);
  return (
    file !== undefined &&
    conditions.length <= 1 &&
    hasValidExplicitFileMonitoringByteLength(file) &&
    (condition === undefined ||
      hasValidExplicitFileMonitoringCondition(condition))
  );
};

const strategyFor = (unit: AjsUnit): SemanticDiffIdentityStrategyId => {
  const unitType = String(unit.unitType);
  if (eventReceptionUnitTypes.has(unitType) && hasValidEventSelectors(unit)) {
    return "event-reception-v1";
  }
  if (
    fileMonitoringUnitTypes.has(unitType) &&
    hasValidFileMonitoringForm(unit)
  ) {
    return "file-monitor-v1";
  }
  if (hasValidCommandTextForm(unit)) {
    return "command-text-v1";
  }
  if (hasValidExecutableFileForm(unit)) {
    return "executable-file-v1";
  }
  return "legacy-all-parameters-v1";
};

const semanticFieldsFor = (
  unit: AjsUnit,
  strategyId: Exclude<
    SemanticDiffIdentityStrategyId,
    "legacy-all-parameters-v1"
  >,
): SemanticDiffIdentityField[] => {
  switch (strategyId) {
    case "command-text-v1":
      return [scalarField("te", valuesFor(unit, "te"))];
    case "executable-file-v1":
      return [
        scalarField("sc", valuesFor(unit, "sc")),
        scalarField("prm", valuesFor(unit, "prm")),
      ];
    case "event-reception-v1":
      return eventSelectorKeys.map((key) =>
        key === "evwfr"
          ? field(
              key,
              sortOrdinal(
                valuesFor(unit, key).map((parameter) => parameter.value),
              ),
            )
          : scalarField(key, valuesFor(unit, key)),
      );
    case "file-monitor-v1": {
      const explicitCondition = exactlyOne(valuesFor(unit, "flwc"));
      return [
        scalarField("flwf", valuesFor(unit, "flwf")),
        field("flwc", [explicitCondition?.value ?? DEFAULTS.Flwc], true),
      ];
    }
  }
};

const legacyFieldsFor = (unit: AjsUnit): SemanticDiffIdentityField[] => {
  const parameters = sortOrdinal(
    unit.parameters
      .filter((parameter) => parameter.key !== "unit" && parameter.key !== "el")
      .map((parameter) => `${parameter.key}=${parameter.value}`),
  );
  return [
    field("unitType", [String(unit.unitType)], true),
    field("groupType", [unit.groupType ?? ""], true),
    field("permission", [unit.permission ?? ""], true),
    field("jp1Username", [unit.jp1Username ?? ""], true),
    field("jp1ResourceGroup", [unit.jp1ResourceGroup ?? ""], true),
    field("parameters", parameters, parameters.length > 0),
  ];
};

const legacyFingerprintKey = (unit: AjsUnit): string =>
  [
    unit.unitType,
    unit.groupType ?? "",
    unit.permission ?? "",
    unit.jp1Username ?? "",
    unit.jp1ResourceGroup ?? "",
    sortOrdinal(
      unit.parameters
        .filter(
          (parameter) => parameter.key !== "unit" && parameter.key !== "el",
        )
        .map((parameter) => `${parameter.key}=${parameter.value}`),
    ).join("|"),
  ].join("::");

/** The pre-feature grouping key used for conservative fallback matching. */
export const semanticDiffLegacyUnitFingerprint = legacyFingerprintKey;

const encodeComponent = (value: string): string => `${value.length}:${value}`;

const encodeArray = (values: string[]): string =>
  `${values.length}[${values.map(encodeComponent).join("")}]`;

const canonicalFingerprint = (
  strategyId: SemanticDiffIdentityStrategyId,
  unitType: string,
  fields: SemanticDiffIdentityField[],
): string =>
  [
    encodeComponent(strategyId),
    encodeComponent(unitType),
    encodeArray(
      fields.flatMap((identityField) => [
        identityField.key,
        identityField.presence,
        ...identityField.values,
      ]),
    ),
  ].join("");

export type SemanticDiffIdentityFingerprint = {
  fingerprint: string;
  evidence: SemanticDiffIdentityFingerprintEvidence;
};

/** Select the reference-backed strategy for one normalized unit. */
export const semanticDiffUnitIdentityStrategy = (
  unit: AjsUnit,
): SemanticDiffIdentityStrategyId => strategyFor(unit);

/** Build structured evidence and an unambiguous grouping key for one unit. */
export const createSemanticDiffIdentityFingerprint = (
  unit: AjsUnit,
): SemanticDiffIdentityFingerprint => {
  const strategyId = strategyFor(unit);
  const unitType = String(unit.unitType);
  const fields =
    strategyId === "legacy-all-parameters-v1"
      ? legacyFieldsFor(unit)
      : semanticFieldsFor(unit, strategyId);
  const evidence: SemanticDiffIdentityFingerprintEvidence = {
    kind: "fingerprint",
    strategyId,
    unitType,
    fields,
  };
  return {
    // Keep the fallback key byte-for-byte compatible with the pre-feature
    // semanticDiffUnitFingerprint helper. Supported strategies use the
    // length-prefixed canonical representation above.
    fingerprint:
      strategyId === "legacy-all-parameters-v1"
        ? legacyFingerprintKey(unit)
        : canonicalFingerprint(strategyId, unitType, fields),
    evidence,
  };
};

export const semanticDiffUnitIdentityFingerprint =
  createSemanticDiffIdentityFingerprint;
