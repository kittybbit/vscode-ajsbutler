export type ValidSchedulePeriod = { from: Date; to: Date };

export type ScheduleDateCandidateResult = {
  candidates: string[];
  invalid: boolean;
  deferred: boolean;
  contextInvalid?: boolean;
  contextMissing?: boolean;
  contextEvidenceId?: string;
};

export type ScheduleDayClassification =
  | "open"
  | "closed"
  | { status: "missing-context" | "invalid"; evidenceId: string };

export const emptyScheduleDateCandidates = (): ScheduleDateCandidateResult => ({
  candidates: [],
  invalid: false,
  deferred: false,
});

export const deferredScheduleDateCandidates =
  (): ScheduleDateCandidateResult => ({
    candidates: [],
    invalid: false,
    deferred: true,
  });

export const invalidScheduleDateCandidates =
  (): ScheduleDateCandidateResult => ({
    candidates: [],
    invalid: true,
    deferred: false,
  });

export const singleScheduleDateCandidate = (
  candidate: string,
): ScheduleDateCandidateResult => ({
  candidates: [candidate],
  invalid: false,
  deferred: false,
});

export const classificationFailure = (
  classification: Exclude<ScheduleDayClassification, "open" | "closed">,
): ScheduleDateCandidateResult =>
  classification.status === "invalid"
    ? {
        ...invalidScheduleDateCandidates(),
        contextInvalid: true,
        contextEvidenceId: classification.evidenceId,
      }
    : {
        candidates: [],
        invalid: false,
        deferred: false,
        contextMissing: true,
        contextEvidenceId: classification.evidenceId,
      };
