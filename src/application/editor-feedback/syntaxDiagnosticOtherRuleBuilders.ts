import type { AjsDocument, AjsUnit } from "../../domain/models/ajs/AjsDocument";
import type { SyntaxDiagnosticDto } from "./syntaxDiagnosticTypes";
import {
  buildDiagnostic,
  collectRuleDiagnostics,
} from "./syntaxDiagnosticCore";
import {
  customPcTransferFileProhibitedTargetTypes,
  eventReceivingDiagnosticTargetTypes,
  eventSendingDiagnosticTargetTypes,
  executionIntervalControlDiagnosticTargetTypes,
  fileMonitoringDiagnosticTargetTypes,
  queueTransferFileDiagnosticTargetTypes,
  transferFileIndexes,
  transferOperationDiagnosticTargetTypes,
} from "./syntaxDiagnosticTargetTypes";
import {
  eventReceivingDiagnosticRules,
  eventSendingDiagnosticRules,
  executionIntervalControlDiagnosticRules,
  fileMonitoringDiagnosticRules,
  queueTransferFileDiagnosticRules,
  transferOperationDiagnosticRules,
} from "./syntaxDiagnosticRuleSets";
import {
  findParameter,
  findUnitsByTypes,
  hasStartConditionContext,
} from "./syntaxDiagnosticUnitLookup";

const collectOptionalParameterDiagnostics = (
  unit: AjsUnit,
  inputs: readonly { key: string; message: string }[],
): SyntaxDiagnosticDto[] =>
  inputs.flatMap(({ key, message }) => {
    const parameter = findParameter(unit, key);
    return parameter ? [buildDiagnostic(parameter, message)] : [];
  });

const collectStartConditionDisabledParameterDiagnostics = (
  document: AjsDocument,
  unit: AjsUnit,
  parameterMessages: readonly { key: string; message: string }[],
): SyntaxDiagnosticDto[] =>
  hasStartConditionContext(document, unit)
    ? collectOptionalParameterDiagnostics(
        unit,
        parameterMessages.map(({ key, message }) => ({ key, message })),
      )
    : [];

export const buildFileMonitoringDiagnostics = (
  document: AjsDocument,
): SyntaxDiagnosticDto[] =>
  findUnitsByTypes(document, fileMonitoringDiagnosticTargetTypes).flatMap(
    (unit) => [
      ...collectRuleDiagnostics(unit, fileMonitoringDiagnosticRules),
      ...collectStartConditionDisabledParameterDiagnostics(document, unit, [
        {
          key: "fd",
          message:
            "Execution time (fd) cannot be specified for jobs defined as start conditions.",
        },
      ]),
    ],
  );

export const buildExecutionIntervalControlDiagnostics = (
  document: AjsDocument,
): SyntaxDiagnosticDto[] =>
  findUnitsByTypes(
    document,
    executionIntervalControlDiagnosticTargetTypes,
  ).flatMap((unit) => {
    const diagnostics = [
      ...collectRuleDiagnostics(unit, executionIntervalControlDiagnosticRules),
      ...collectStartConditionDisabledParameterDiagnostics(document, unit, [
        {
          key: "fd",
          message:
            "Execution time (fd) cannot be specified for jobs defined as start conditions.",
        },
      ]),
    ];
    const endTimingParameter = findParameter(unit, "etn");

    if (
      endTimingParameter?.value === "y" &&
      !hasStartConditionContext(document, unit)
    ) {
      diagnostics.push(
        buildDiagnostic(
          endTimingParameter,
          "End timing (etn=y) can be specified only for execution-interval control jobs defined as start conditions.",
        ),
      );
    }

    return diagnostics;
  });

export const buildTransferOperationDiagnostics = (
  document: AjsDocument,
): SyntaxDiagnosticDto[] =>
  findUnitsByTypes(document, transferOperationDiagnosticTargetTypes).flatMap(
    (unit) =>
      customPcTransferFileProhibitedTargetTypes.has(unit.unitType)
        ? collectOptionalParameterDiagnostics(
            unit,
            transferFileIndexes.flatMap((index) =>
              ["ts", "td", "top"].map((prefix) => {
                const key = `${prefix}${index}`;
                return {
                  key,
                  message: `Transfer-file parameter (${key}) cannot be specified for custom PC jobs.`,
                };
              }),
            ),
          )
        : collectRuleDiagnostics(unit, transferOperationDiagnosticRules),
  );

export const buildQueueTransferFileDiagnostics = (
  document: AjsDocument,
): SyntaxDiagnosticDto[] =>
  findUnitsByTypes(document, queueTransferFileDiagnosticTargetTypes).flatMap(
    (unit) => collectRuleDiagnostics(unit, queueTransferFileDiagnosticRules),
  );

export const buildEventSendingDiagnostics = (
  document: AjsDocument,
): SyntaxDiagnosticDto[] =>
  findUnitsByTypes(document, eventSendingDiagnosticTargetTypes).flatMap(
    (unit) => collectRuleDiagnostics(unit, eventSendingDiagnosticRules),
  );

export const buildEventReceivingDiagnostics = (
  document: AjsDocument,
): SyntaxDiagnosticDto[] =>
  findUnitsByTypes(document, eventReceivingDiagnosticTargetTypes).flatMap(
    (unit) => {
      const diagnostics = [
        ...collectRuleDiagnostics(unit, eventReceivingDiagnosticRules),
        ...collectStartConditionDisabledParameterDiagnostics(document, unit, [
          {
            key: "fd",
            message:
              "Execution time (fd) cannot be specified for jobs defined as start conditions.",
          },
        ]),
      ];

      const invalidStartConditionParameters =
        collectStartConditionDisabledParameterDiagnostics(document, unit, [
          {
            key: "etm",
            message:
              "Event timeout period (etm) cannot be specified for jobs defined as start conditions.",
          },
          {
            key: "ha",
            message:
              "Hold attribute (ha) cannot be specified for jobs defined as start conditions.",
          },
          {
            key: "ets",
            message:
              "Event timeout action (ets) cannot be specified for jobs defined as start conditions.",
          },
        ]);

      diagnostics.push(...invalidStartConditionParameters);

      return diagnostics;
    },
  );
