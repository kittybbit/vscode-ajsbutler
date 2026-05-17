export type SyntaxDiagnosticDto = {
  line: number;
  column: number;
  length: number;
  message: string;
  severity: "error";
};

export type BuildSyntaxDiagnosticsOptions = {
  scheduleLimitYear?: number;
};
