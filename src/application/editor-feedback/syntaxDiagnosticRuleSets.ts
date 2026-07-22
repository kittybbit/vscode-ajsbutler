import type { AjsParameterDiagnosticRule } from "./syntaxDiagnosticCore";
import {
  buildExplicitGovernedByteLengthRule,
  buildRequiredParameterRule,
} from "./syntaxDiagnosticCore";
import { transferFileIndexes } from "./syntaxDiagnosticTargetTypes";
import {
  hasInvalidExplicitTransferSourcePath,
  isValidExplicitTransferFileValue,
} from "./syntaxDiagnosticTransferRules";

export const transferFileByteLengthRules: readonly AjsParameterDiagnosticRule[] =
  transferFileIndexes.flatMap((index) => [
    buildExplicitGovernedByteLengthRule({
      key: `ts${index}`,
      minimum: 1,
      maximum: 511,
      message: `Transfer source file name (ts${index}) must be between 1 and 511 bytes.`,
    }),
    buildExplicitGovernedByteLengthRule({
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
      message: `Transfer source file name (ts${index}) must be quoted, or use a macro-variable form allowed by the unit class and effective jty=q.`,
      isInvalid: (parameter, unit) =>
        !isValidExplicitTransferFileValue(parameter, unit),
    },
    {
      key: `td${index}`,
      message: `Transfer destination file name (td${index}) must be quoted, or use a macro-variable form allowed by the unit class and effective jty=q.`,
      isInvalid: (parameter, unit) =>
        !isValidExplicitTransferFileValue(parameter, unit),
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
