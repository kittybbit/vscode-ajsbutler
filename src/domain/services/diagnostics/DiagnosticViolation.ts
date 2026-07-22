import type { AjsParameter } from "../../models/ajs/AjsDocument";
import type { DiagnosticRuleId } from "./DiagnosticRuleId";

export const eventReceiveFilterViolationReasons = {
  invalidShape: "invalid-shape",
  aggregateByteLimitExceeded: "aggregate-byte-limit-exceeded",
} as const;

export type EventReceiveFilterViolationReason =
  (typeof eventReceiveFilterViolationReasons)[keyof typeof eventReceiveFilterViolationReasons];

export const retryAbrDependencyViolationReasons = {
  automaticRetryRequiresCodeEndJudgment:
    "automatic-retry-requires-code-end-judgment",
  retryParameterRequiresCodeEndJudgment:
    "retry-parameter-requires-code-end-judgment",
  retryParameterRequiresAutomaticRetry:
    "retry-parameter-requires-automatic-retry",
} as const;

export type RetryAbrDependencyViolationReason =
  (typeof retryAbrDependencyViolationReasons)[keyof typeof retryAbrDependencyViolationReasons];

export type DiagnosticParameterEvidence = Readonly<AjsParameter>;

export type DiagnosticViolation<TReason extends string> = Readonly<{
  ruleId: DiagnosticRuleId;
  reason: TReason;
  evidence: DiagnosticParameterEvidence;
}>;
