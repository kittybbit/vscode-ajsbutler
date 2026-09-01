const semanticDiffIdentityMessageKeys = [
  "semanticDiff.identityRule",
  "semanticDiff.identityStrategy",
  "semanticDiff.identityUnitType",
  "semanticDiff.identityFields",
  "semanticDiff.identityCandidates",
  "semanticDiff.identityKey",
  "semanticDiff.identity.present",
  "semanticDiff.identity.absent",
  "semanticDiff.identity.rule.exact-key",
  "semanticDiff.identity.rule.one-to-one-fingerprint",
  "semanticDiff.identity.rule.ambiguous-fingerprint",
  "semanticDiff.identity.rule.unmatched-before",
  "semanticDiff.identity.rule.unmatched-after",
  "semanticDiff.identity.strategy.command-text-v1",
  "semanticDiff.identity.strategy.executable-file-v1",
  "semanticDiff.identity.strategy.event-reception-v1",
  "semanticDiff.identity.strategy.file-monitor-v1",
  "semanticDiff.identity.strategy.legacy-all-parameters-v1",
] as const;

type SemanticDiffIdentityMessageKey =
  (typeof semanticDiffIdentityMessageKeys)[number];

const createSemanticDiffIdentityMessages = (
  values: readonly string[],
): Record<SemanticDiffIdentityMessageKey, string> =>
  Object.fromEntries(
    semanticDiffIdentityMessageKeys.map((key, index) => [key, values[index]]),
  ) as Record<SemanticDiffIdentityMessageKey, string>;

export const semanticDiffIdentityMessagesEn =
  createSemanticDiffIdentityMessages([
    "Rule",
    "Strategy",
    "Unit type",
    "Fields",
    "Candidates",
    "Key",
    "present",
    "absent",
    "exact identity key",
    "one-to-one fingerprint match",
    "ambiguous fingerprint candidates",
    "unmatched before unit",
    "unmatched after unit",
    "command text",
    "executable file",
    "event reception",
    "file monitoring",
    "legacy all parameters",
  ]);

export const semanticDiffIdentityMessagesJa =
  createSemanticDiffIdentityMessages([
    "ルール",
    "戦略",
    "ユニット種別",
    "項目",
    "候補",
    "キー",
    "指定あり",
    "指定なし",
    "完全一致キー",
    "一対一フィンガープリント一致",
    "曖昧なフィンガープリント候補",
    "変更前の未対応ユニット",
    "変更後の未対応ユニット",
    "コマンドテキスト",
    "実行ファイル",
    "イベント受信",
    "ファイル監視",
    "従来の全パラメーター",
  ]);
