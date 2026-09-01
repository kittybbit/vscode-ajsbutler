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
  Number(left > right) - Number(left < right);

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

const hasValidEventFilterReference = (parameter: AjsParameter): boolean =>
  hasValidExplicitEventReceivingFilterReference(parameter) &&
  (parseHashEscapedQuotedEventStringContent(
    parameter.value.slice(parameter.value.indexOf(":") + 1),
  )?.length ?? 0) > 0;

const hasValidEventProcessIdentifier = (parameter: AjsParameter): boolean => {
  const numericValue = Number(parameter.value);
  return (
    /^-?\d+$/.test(parameter.value) &&
    numericValue >= -1 &&
    numericValue <= 9999999999
  );
};

type EventSelectorValidator = (parameter: AjsParameter) => boolean;

const eventSelectorValidators: Record<
  EventSelectorKey,
  EventSelectorValidator
> = {
  evwid: hasValidExplicitEventReceivingId,
  evusr: (parameter) =>
    hasValidExplicitEventReceivingQuotedString(parameter, 1, 20),
  evgrp: (parameter) =>
    hasValidExplicitEventReceivingQuotedString(parameter, 1, 20),
  evhst: hasValidExplicitEventHostLength,
  evipa: hasValidExplicitEventSourceIpAddress,
  evwms: (parameter) =>
    hasValidExplicitEventReceivingQuotedString(parameter, 1, 1024),
  evdet: (parameter) =>
    hasValidExplicitEventReceivingQuotedString(parameter, 1, 1024),
  evwsv: (parameter) => isValidEventServerValue(parameter.value),
  evwfr: hasValidEventFilterReference,
  evuid: hasValidEventProcessIdentifier,
  evgid: hasValidEventProcessIdentifier,
  evpid: hasValidEventProcessIdentifier,
};

const repeatableEventSelectorKeys = new Set<EventSelectorKey>(["evwfr"]);

const hasValidEventSelectorValues = (
  unit: AjsUnit,
  key: EventSelectorKey,
): boolean => {
  const parameters = valuesFor(unit, key);
  const hasValidCount =
    repeatableEventSelectorKeys.has(key) || parameters.length <= 1;
  return hasValidCount && parameters.every(eventSelectorValidators[key]);
};

const hasValidEventSelectors = (unit: AjsUnit): boolean => {
  const selectorsAreValid = eventSelectorKeys.every((key) =>
    hasValidEventSelectorValues(unit, key),
  );
  const totalFilterBytes = valuesFor(unit, "evwfr").reduce(
    (total, parameter) =>
      total + getCanonicalEventReceivingFilterByteLength(parameter),
    0,
  );
  return selectorsAreValid && totalFilterBytes <= 2048;
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
  const executableIsValid = executable
    ? hasValidV13QuotedValue(executable, executableFileMaximumBytes)
    : false;
  const checks = [
    executableIsValid,
    valuesFor(unit, "te").length === 0,
    parameters.length <= 1,
    parameters.every((parameter) =>
      hasValidV13QuotedValue(parameter, executableParameterMaximumBytes),
    ),
  ];
  return checks.every(Boolean);
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

type SemanticStrategyRule = {
  strategyId: Exclude<
    SemanticDiffIdentityStrategyId,
    "legacy-all-parameters-v1"
  >;
  appliesTo: (unit: AjsUnit) => boolean;
};

const semanticStrategyRules: SemanticStrategyRule[] = [
  {
    strategyId: "event-reception-v1",
    appliesTo: (unit) =>
      eventReceptionUnitTypes.has(String(unit.unitType)) &&
      hasValidEventSelectors(unit),
  },
  {
    strategyId: "file-monitor-v1",
    appliesTo: (unit) =>
      fileMonitoringUnitTypes.has(String(unit.unitType)) &&
      hasValidFileMonitoringForm(unit),
  },
  { strategyId: "command-text-v1", appliesTo: hasValidCommandTextForm },
  {
    strategyId: "executable-file-v1",
    appliesTo: hasValidExecutableFileForm,
  },
];

const strategyFor = (unit: AjsUnit): SemanticDiffIdentityStrategyId =>
  semanticStrategyRules.find((rule) => rule.appliesTo(unit))?.strategyId ??
  "legacy-all-parameters-v1";

type SemanticStrategyId = Exclude<
  SemanticDiffIdentityStrategyId,
  "legacy-all-parameters-v1"
>;

type SemanticFieldFactory = (unit: AjsUnit) => SemanticDiffIdentityField[];

const eventReceptionFields: SemanticFieldFactory = (unit) =>
  eventSelectorKeys.map((key) =>
    key === "evwfr"
      ? field(
          key,
          sortOrdinal(valuesFor(unit, key).map((parameter) => parameter.value)),
        )
      : scalarField(key, valuesFor(unit, key)),
  );

const fileMonitoringFields: SemanticFieldFactory = (unit) => {
  const explicitCondition = exactlyOne(valuesFor(unit, "flwc"));
  return [
    scalarField("flwf", valuesFor(unit, "flwf")),
    field("flwc", [explicitCondition?.value ?? DEFAULTS.Flwc], true),
  ];
};

const semanticFieldFactories: Record<SemanticStrategyId, SemanticFieldFactory> =
  {
    "command-text-v1": (unit) => [scalarField("te", valuesFor(unit, "te"))],
    "executable-file-v1": (unit) => [
      scalarField("sc", valuesFor(unit, "sc")),
      scalarField("prm", valuesFor(unit, "prm")),
    ],
    "event-reception-v1": eventReceptionFields,
    "file-monitor-v1": fileMonitoringFields,
  };

const semanticFieldsFor = (
  unit: AjsUnit,
  strategyId: SemanticStrategyId,
): SemanticDiffIdentityField[] => semanticFieldFactories[strategyId](unit);

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
