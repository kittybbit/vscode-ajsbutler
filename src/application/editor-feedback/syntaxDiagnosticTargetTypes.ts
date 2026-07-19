export const jobEndJudgmentDiagnosticTargetTypes = new Set([
  "j",
  "rj",
  "pj",
  "rp",
  "cj",
  "rcj",
  "qj",
  "rq",
]);

export const jobEndJudgmentRetryParameterKeys = ["rjs", "rje", "rec", "rei"];

export const fileMonitoringDiagnosticTargetTypes = new Set(["flwj", "rflwj"]);

export const executionIntervalControlDiagnosticTargetTypes = new Set([
  "tmwj",
  "rtmwj",
]);

export const eventSendingDiagnosticTargetTypes = new Set(["evsj", "revsj"]);

export const eventReceivingDiagnosticTargetTypes = new Set(["evwj", "revwj"]);

export const scheduleRuleDiagnosticTargetTypes = new Set(["g", "n"]);

export const transferOperationDiagnosticTargetTypes = new Set([
  "j",
  "rj",
  "pj",
  "rp",
  "cj",
  "rcj",
  "cpj",
  "rcpj",
]);

export const queueTransferFileDiagnosticTargetTypes = new Set(["qj", "rq"]);

export const transferMacroQueuingTargetTypes = new Set(["j", "rj", "pj", "rp"]);

export const transferMacroAllowedTargetTypes = new Set([
  "cj",
  "rcj",
  "qj",
  "rq",
]);

export const customPcTransferFileProhibitedTargetTypes = new Set([
  "cpj",
  "rcpj",
]);

export const transferFileIndexes = [1, 2, 3, 4] as const;
