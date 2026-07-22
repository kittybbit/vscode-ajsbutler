import type { AjsDocument, AjsUnit } from "../../domain/models/ajs/AjsDocument";
import type { SyntaxDiagnosticDto } from "./syntaxDiagnosticTypes";
import {
  buildDiagnostic,
  collectRuleDiagnostics,
} from "./syntaxDiagnosticCore";
import {
  customPcTransferFileProhibitedTargetTypes,
  queueTransferFileDiagnosticTargetTypes,
  transferFileIndexes,
  transferOperationDiagnosticTargetTypes,
} from "./syntaxDiagnosticTargetTypes";
import {
  queueTransferFileDiagnosticRules,
  transferOperationDiagnosticRules,
} from "./syntaxDiagnosticRuleSets";
import { findParameter, findUnitsByTypes } from "./syntaxDiagnosticUnitLookup";

const collectOptionalParameterDiagnostics = (
  unit: AjsUnit,
  inputs: readonly { key: string; message: string }[],
): SyntaxDiagnosticDto[] =>
  inputs.flatMap(({ key, message }) => {
    const parameter = findParameter(unit, key);
    return parameter ? [buildDiagnostic(parameter, message)] : [];
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
