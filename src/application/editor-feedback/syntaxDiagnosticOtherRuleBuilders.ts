import type { Unit } from "../../domain/values/Unit";
import type { SyntaxDiagnosticDto } from "./syntaxDiagnosticTypes";
import {
  buildDiagnostic,
  collectRuleDiagnostics,
} from "./syntaxDiagnosticCore";
import {
  eventReceivingDiagnosticTargetTypes,
  eventSendingDiagnosticTargetTypes,
  executionIntervalControlDiagnosticTargetTypes,
  fileMonitoringDiagnosticTargetTypes,
  queueTransferFileDiagnosticTargetTypes,
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
  unit: Unit,
  inputs: readonly { key: string; message: string }[],
): SyntaxDiagnosticDto[] =>
  inputs.flatMap(({ key, message }) => {
    const parameter = findParameter(unit, key);
    return parameter ? [buildDiagnostic(parameter, message)] : [];
  });

const collectStartConditionDisabledParameterDiagnostics = (
  unit: Unit,
  parameterMessages: readonly { key: string; message: string }[],
): SyntaxDiagnosticDto[] =>
  hasStartConditionContext(unit)
    ? collectOptionalParameterDiagnostics(
        unit,
        parameterMessages.map(({ key, message }) => ({ key, message })),
      )
    : [];

export const buildFileMonitoringDiagnostics = (
  rootUnits: Unit[],
): SyntaxDiagnosticDto[] =>
  findUnitsByTypes(rootUnits, fileMonitoringDiagnosticTargetTypes).flatMap(
    (unit) => [
      ...collectRuleDiagnostics(unit, fileMonitoringDiagnosticRules),
      ...collectStartConditionDisabledParameterDiagnostics(unit, [
        {
          key: "fd",
          message:
            "Execution time (fd) cannot be specified for jobs defined as start conditions.",
        },
      ]),
    ],
  );

export const buildExecutionIntervalControlDiagnostics = (
  rootUnits: Unit[],
): SyntaxDiagnosticDto[] =>
  findUnitsByTypes(
    rootUnits,
    executionIntervalControlDiagnosticTargetTypes,
  ).flatMap((unit) => {
    const diagnostics = [
      ...collectRuleDiagnostics(unit, executionIntervalControlDiagnosticRules),
      ...collectStartConditionDisabledParameterDiagnostics(unit, [
        {
          key: "fd",
          message:
            "Execution time (fd) cannot be specified for jobs defined as start conditions.",
        },
      ]),
    ];
    const endTimingParameter = findParameter(unit, "etn");

    if (endTimingParameter?.value === "y" && !hasStartConditionContext(unit)) {
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
  rootUnits: Unit[],
): SyntaxDiagnosticDto[] =>
  findUnitsByTypes(rootUnits, transferOperationDiagnosticTargetTypes).flatMap(
    (unit) => collectRuleDiagnostics(unit, transferOperationDiagnosticRules),
  );

export const buildQueueTransferFileDiagnostics = (
  rootUnits: Unit[],
): SyntaxDiagnosticDto[] =>
  findUnitsByTypes(rootUnits, queueTransferFileDiagnosticTargetTypes).flatMap(
    (unit) => collectRuleDiagnostics(unit, queueTransferFileDiagnosticRules),
  );

export const buildEventSendingDiagnostics = (
  rootUnits: Unit[],
): SyntaxDiagnosticDto[] =>
  findUnitsByTypes(rootUnits, eventSendingDiagnosticTargetTypes).flatMap(
    (unit) => collectRuleDiagnostics(unit, eventSendingDiagnosticRules),
  );

export const buildEventReceivingDiagnostics = (
  rootUnits: Unit[],
): SyntaxDiagnosticDto[] =>
  findUnitsByTypes(rootUnits, eventReceivingDiagnosticTargetTypes).flatMap(
    (unit) => {
      const diagnostics = [
        ...collectRuleDiagnostics(unit, eventReceivingDiagnosticRules),
        ...collectStartConditionDisabledParameterDiagnostics(unit, [
          {
            key: "fd",
            message:
              "Execution time (fd) cannot be specified for jobs defined as start conditions.",
          },
        ]),
      ];

      const invalidStartConditionParameters =
        collectStartConditionDisabledParameterDiagnostics(unit, [
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
