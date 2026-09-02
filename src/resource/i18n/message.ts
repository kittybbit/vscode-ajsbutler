import { en as baseEn } from "./message_en";
import { ja as baseJa } from "./message_ja";
import {
  semanticDiffIdentityMessagesEn,
  semanticDiffIdentityMessagesJa,
} from "./semanticDiffIdentityMessages";

const retiredSemanticDiffRationaleKeys = new Set([
  "semanticDiff.generated.rationaleExact",
  "semanticDiff.generated.rationaleFingerprint",
  "semanticDiff.generated.rationaleCandidate",
]);

const withoutRetiredSemanticDiffRationale = <
  Messages extends Record<string, string>,
>(
  messages: Messages,
): Omit<Messages, `semanticDiff.generated.rationale${string}`> =>
  Object.fromEntries(
    Object.entries(messages).filter(
      ([key]) => !retiredSemanticDiffRationaleKeys.has(key),
    ),
  ) as Omit<Messages, `semanticDiff.generated.rationale${string}`>;

export const en = {
  ...withoutRetiredSemanticDiffRationale(baseEn),
  ...semanticDiffIdentityMessagesEn,
};

export const ja = {
  ...withoutRetiredSemanticDiffRationale(baseJa),
  ...semanticDiffIdentityMessagesJa,
};
