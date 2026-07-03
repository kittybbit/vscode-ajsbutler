export const syntaxDiagnosticCategories = {
  eventReceiving: "event_receiving",
  eventSending: "event_sending",
  executionIntervalControl: "execution_interval_control",
  fileMonitoring: "file_monitoring",
  jobEndJudgment: "job_end_judgment",
  parserSyntax: "parser_syntax",
  queueTransferFile: "queue_transfer_file",
  scheduleRule: "schedule_rule",
  transferOperation: "transfer_operation",
} as const;

export type SyntaxDiagnosticCategory =
  (typeof syntaxDiagnosticCategories)[keyof typeof syntaxDiagnosticCategories];

export type SyntaxDiagnosticDto = {
  line: number;
  column: number;
  length: number;
  message: string;
  severity: "error";
  category?: SyntaxDiagnosticCategory;
};

export type BuildSyntaxDiagnosticsOptions = {
  scheduleLimitYear?: number;
};
