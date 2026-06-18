import { DEFAULTS } from "../../domain/models/parameters/Defaults";
import type { AjsParameterDiagnosticRule } from "./syntaxDiagnosticCore";
import {
  buildExplicitAllowedValuesRule,
  buildExplicitByteLengthRule,
  buildExplicitDecimalRangeRule,
  buildRequiredParameterRule,
} from "./syntaxDiagnosticCore";
import {
  isValidExplicitColonSeparatedHexadecimalEventId,
  isValidExplicitEventHostValue,
  isValidExplicitEventReceivingFilterReference,
  isValidExplicitEventReceivingQuotedString,
  isValidExplicitEventReceivingTimeoutCondition,
  isValidExplicitEventSearchCondition,
  isValidExplicitIpv4Address,
} from "./syntaxDiagnosticEventRules";
import {
  hasInvalidWildcardWithShortMonitoringInterval,
  isValidExplicitFileMonitoringFileName,
  isValidExplicitFileMonitoringInterval,
  splitFileMonitoringConditions,
} from "./syntaxDiagnosticFileMonitoringRules";
import { parseExplicitHexadecimalInRange } from "./syntaxDiagnosticScalarValidators";
import { transferFileIndexes } from "./syntaxDiagnosticTargetTypes";
import {
  hasInvalidExplicitTransferSourcePath,
  isValidExplicitTransferFileValue,
} from "./syntaxDiagnosticTransferRules";
import { findParameter } from "./syntaxDiagnosticUnitLookup";

export const eventTimeoutActionAllowedValues = new Set([
  "kl",
  "nr",
  "wr",
  "an",
]);

export const jobEndJudgmentNumericRangeRules = [
  buildExplicitDecimalRangeRule({
    key: "wth",
    minimum: 0,
    maximum: 2147483647,
    message: "Warning threshold (wth) must be between 0 and 2147483647.",
  }),
  buildExplicitDecimalRangeRule({
    key: "tho",
    minimum: 0,
    maximum: 2147483647,
    message: "Abnormal threshold (tho) must be between 0 and 2147483647.",
  }),
  buildExplicitDecimalRangeRule({
    key: "rjs",
    minimum: 1,
    maximum: 4294967295,
    message: "Retry start code (rjs) must be between 1 and 4294967295.",
  }),
  buildExplicitDecimalRangeRule({
    key: "rje",
    minimum: 1,
    maximum: 4294967295,
    message: "Retry end code (rje) must be between 1 and 4294967295.",
  }),
  buildExplicitDecimalRangeRule({
    key: "rec",
    minimum: 1,
    maximum: 12,
    message: "Retry count (rec) must be between 1 and 12.",
  }),
  buildExplicitDecimalRangeRule({
    key: "rei",
    minimum: 1,
    maximum: 10,
    message: "Retry interval (rei) must be between 1 and 10.",
  }),
] as const;

export const eventTimeoutActionDiagnosticRules = [
  buildExplicitAllowedValuesRule(
    "ets",
    eventTimeoutActionAllowedValues,
    "Event timeout action (ets) must be one of kl, nr, wr, or an.",
  ),
] as const;

export const waitJobExecutionTimeDiagnosticRules = [
  buildExplicitDecimalRangeRule({
    key: "fd",
    minimum: 1,
    maximum: 1440,
    message: "Execution time (fd) must be between 1 and 1440.",
  }),
] as const;

export const transferFileByteLengthRules: readonly AjsParameterDiagnosticRule[] =
  transferFileIndexes.flatMap((index) => [
    buildExplicitByteLengthRule({
      key: `ts${index}`,
      minimum: 1,
      maximum: 511,
      message: `Transfer source file name (ts${index}) must be between 1 and 511 bytes.`,
    }),
    buildExplicitByteLengthRule({
      key: `td${index}`,
      minimum: 1,
      maximum: 511,
      message: `Transfer destination file name (td${index}) must be between 1 and 511 bytes.`,
    }),
  ]);

export const transferFileValueShapeRules: readonly AjsParameterDiagnosticRule[] =
  transferFileIndexes.flatMap((index) => [
    {
      key: `ts${index}`,
      message: `Transfer source file name (ts${index}) must be a quoted transfer-file value or macro-variable form.`,
      isInvalid: (parameter) => !isValidExplicitTransferFileValue(parameter),
    },
    {
      key: `td${index}`,
      message: `Transfer destination file name (td${index}) must be a quoted transfer-file value or macro-variable form.`,
      isInvalid: (parameter) => !isValidExplicitTransferFileValue(parameter),
    },
  ]);

export const transferSourceFilePathRules: readonly AjsParameterDiagnosticRule[] =
  transferFileIndexes.map((index) => ({
    key: `ts${index}`,
    message: `Transfer source file name (ts${index}) must use a full path when specified as a quoted transfer-file value.`,
    isInvalid: (parameter) => hasInvalidExplicitTransferSourcePath(parameter),
  }));

export const transferOperationDiagnosticRules: readonly AjsParameterDiagnosticRule[] =
  [
    ...transferFileByteLengthRules,
    ...transferFileValueShapeRules,
    ...transferSourceFilePathRules,
    ...transferFileIndexes.flatMap((index) => [
      buildRequiredParameterRule(
        `td${index}`,
        `ts${index}`,
        `Transfer destination file name (td${index}) requires transfer source file name (ts${index}).`,
      ),
      buildRequiredParameterRule(
        `top${index}`,
        `ts${index}`,
        `Transfer operation (top${index}) requires transfer source file name (ts${index}).`,
      ),
    ]),
  ];

export const queueTransferFileDiagnosticRules: readonly AjsParameterDiagnosticRule[] =
  [
    ...transferFileByteLengthRules,
    ...transferFileValueShapeRules,
    ...transferSourceFilePathRules,
    ...transferFileIndexes.map((index) =>
      buildRequiredParameterRule(
        `td${index}`,
        `ts${index}`,
        `Transfer destination file name (td${index}) requires transfer source file name (ts${index}).`,
      ),
    ),
  ];

export const fileMonitoringDiagnosticRules: readonly AjsParameterDiagnosticRule[] =
  [
    {
      key: "flwf",
      message: "Monitored file name (flwf) must be between 1 and 255 bytes.",
      isInvalid: (parameter) =>
        !isValidExplicitFileMonitoringFileName(parameter),
    },
    {
      key: "flwi",
      message: "Monitoring interval (flwi) must be between 1 and 600.",
      isInvalid: (parameter) =>
        !isValidExplicitFileMonitoringInterval(parameter),
    },
    {
      key: "flwf",
      message:
        "Monitored file name (flwf) cannot use wildcard (*) when monitoring interval (flwi) is between 1 and 9.",
      isInvalid: (parameter, unit) =>
        hasInvalidWildcardWithShortMonitoringInterval(parameter, unit),
    },
    {
      key: "flwc",
      message: "File monitoring condition (flwc) cannot specify both s and m.",
      isInvalid: (parameter) => {
        const flwcConditions = splitFileMonitoringConditions(parameter.value);
        return flwcConditions.has("s") && flwcConditions.has("m");
      },
    },
    {
      key: "flco",
      message:
        "File close option (flco) requires file creation monitoring (flwc=c).",
      isInvalid: (_parameter, unit) => {
        const effectiveFlwc =
          findParameter(unit, "flwc")?.value ?? DEFAULTS.Flwc;
        return !splitFileMonitoringConditions(effectiveFlwc).has("c");
      },
    },
    ...waitJobExecutionTimeDiagnosticRules,
    ...eventTimeoutActionDiagnosticRules,
  ];

export const executionIntervalControlDiagnosticRules: readonly AjsParameterDiagnosticRule[] =
  [
    buildExplicitDecimalRangeRule({
      key: "tmitv",
      minimum: 1,
      maximum: 1440,
      message: "Execution interval (tmitv) must be between 1 and 1440.",
    }),
    buildExplicitAllowedValuesRule(
      "etn",
      new Set(["y", "n"]),
      "End timing (etn) must be y or n.",
    ),
    ...waitJobExecutionTimeDiagnosticRules,
    ...eventTimeoutActionDiagnosticRules,
  ];

export const eventSendingDiagnosticRules: readonly AjsParameterDiagnosticRule[] =
  [
    {
      key: "evhst",
      message: "Event host (evhst) must be between 1 and 255 bytes.",
      isInvalid: (parameter) => !isValidExplicitEventHostValue(parameter),
    },
    {
      key: "evsid",
      message:
        "Event ID (evsid) must be hexadecimal within 00000000-00001FFF or 7FFF8000-7FFFFFFF.",
      isInvalid: (parameter) =>
        parseExplicitHexadecimalInRange(
          parameter.value,
          0x00000000,
          0x00001fff,
        ) === undefined &&
        parseExplicitHexadecimalInRange(
          parameter.value,
          0x7fff8000,
          0x7fffffff,
        ) === undefined,
    },
    buildExplicitDecimalRangeRule({
      key: "evspl",
      minimum: 3,
      maximum: 600,
      message:
        "Event arrival check interval (evspl) must be between 3 and 600.",
    }),
    buildExplicitDecimalRangeRule({
      key: "evsrc",
      minimum: 0,
      maximum: 999,
      message: "Event arrival check count (evsrc) must be between 0 and 999.",
    }),
    {
      key: "evsrt",
      message:
        "Event arrival check (evsrt=y) requires an event destination host (evhst).",
      isInvalid: (parameter, unit) =>
        (parameter.value ?? DEFAULTS.Evsrt) === "y" &&
        !findParameter(unit, "evhst"),
    },
  ];

export const eventReceivingDiagnosticRules: readonly AjsParameterDiagnosticRule[] =
  [
    ...waitJobExecutionTimeDiagnosticRules,
    buildExplicitDecimalRangeRule({
      key: "etm",
      minimum: 1,
      maximum: 1440,
      message: "Event timeout period (etm) must be between 1 and 1440.",
    }),
    buildExplicitAllowedValuesRule(
      "ha",
      new Set(["y", "n"]),
      "Hold attribute (ha) must be y or n.",
    ),
    ...eventTimeoutActionDiagnosticRules,
    buildExplicitDecimalRangeRule({
      key: "evuid",
      minimum: -1,
      maximum: 9999999999,
      message:
        "Event issue source user ID (evuid) must be a signed decimal value between -1 and 9999999999.",
      options: { allowNegative: true },
    }),
    buildExplicitDecimalRangeRule({
      key: "evgid",
      minimum: -1,
      maximum: 9999999999,
      message:
        "Event issue source group ID (evgid) must be a signed decimal value between -1 and 9999999999.",
      options: { allowNegative: true },
    }),
    buildExplicitDecimalRangeRule({
      key: "evpid",
      minimum: -1,
      maximum: 9999999999,
      message:
        "Event issue source process ID (evpid) must be a signed decimal value between -1 and 9999999999.",
      options: { allowNegative: true },
    }),
    {
      key: "evusr",
      message:
        "Event issue source user name (evusr) must be a quoted string between 1 and 20 bytes.",
      isInvalid: (parameter) =>
        !isValidExplicitEventReceivingQuotedString(parameter, 1, 20),
    },
    {
      key: "evgrp",
      message:
        "Event issue source group name (evgrp) must be a quoted string between 1 and 20 bytes.",
      isInvalid: (parameter) =>
        !isValidExplicitEventReceivingQuotedString(parameter, 1, 20),
    },
    {
      key: "evhst",
      message: "Event host (evhst) must be between 1 and 255 bytes.",
      isInvalid: (parameter) => !isValidExplicitEventHostValue(parameter),
    },
    {
      key: "evwid",
      message:
        "Event ID (evwid) must be hexadecimal in 00000000:00000000-FFFFFFFF:FFFFFFFF format.",
      isInvalid: (parameter) =>
        !isValidExplicitColonSeparatedHexadecimalEventId(parameter),
    },
    {
      key: "evipa",
      message:
        "Event source IP address (evipa) must be a dotted-decimal IPv4 address between 0.0.0.0 and 255.255.255.255.",
      isInvalid: (parameter) => !isValidExplicitIpv4Address(parameter),
    },
    {
      key: "evwms",
      message:
        "Event message filter (evwms) must be a quoted string between 1 and 1024 bytes.",
      isInvalid: (parameter) =>
        !isValidExplicitEventReceivingQuotedString(parameter, 1, 1024),
    },
    {
      key: "evdet",
      message:
        "Detailed event information filter (evdet) must be a quoted string between 1 and 1024 bytes.",
      isInvalid: (parameter) =>
        !isValidExplicitEventReceivingQuotedString(parameter, 1, 1024),
    },
    {
      key: "evwfr",
      message:
        'Optional extended attribute filter (evwfr) must use optional-extended-attribute-name:"value" format within 2048 bytes.',
      isInvalid: (parameter) =>
        !isValidExplicitEventReceivingFilterReference(parameter),
    },
    {
      key: "evtmc",
      message:
        'End judgment condition (evtmc) must be n, a, n:"file-name", a:"file-name", d:"file-name", or b:"file-name" with a file name between 1 and 256 bytes.',
      isInvalid: (parameter) =>
        !isValidExplicitEventReceivingTimeoutCondition(parameter),
    },
    {
      key: "evesc",
      message:
        "Event search condition (evesc) must be no or between 1 and 720.",
      isInvalid: (parameter) => !isValidExplicitEventSearchCondition(parameter),
    },
  ];
