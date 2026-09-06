type StringMap = Readonly<Record<string, string>>;

export type SemanticDiffExplorerLabels = Readonly<{
  title: string;
  output: string;
  filter: string;
  all: string;
  confirmationRequired: string;
  findings: string;
  empty: string;
  filterEmpty: string;
  source: string;
  flow: string;
  unavailable: string;
  loading: string;
  stateLabel: string;
  details: string;
  availableActions: string;
  summaryCards: string;
  tree: string;
  warning: string;
  group: (value: string) => string;
  state: (value: string) => string;
  reason: (value: string) => string;
  detailField: (value: string) => string;
  value: (value: string) => string;
  error: (value: string) => string;
  selected: (label: string) => string;
  expanded: (label: string) => string;
  collapsed: (label: string) => string;
  actionCompleted: (label: string) => string;
  actionUnavailable: (label: string) => string;
}>;

const stateLabels: StringMap = {
  added: "Added",
  removed: "Removed",
  changed: "Changed",
  renamed: "Renamed",
  moved: "Moved",
  confirmed: "Confirmed",
  candidate: "Candidate",
  "confirmation-required": "Confirmation required",
  unsupported: "Unsupported",
  limitation: "Limitation",
  uninterpretable: "Uninterpretable",
  uncalculated: "Uncalculated",
  parse: "Parse limitation",
  normalization: "Normalization limitation",
  "changed-time": "Time changed",
  "jp1-ajs3-v13-rule-basis": "JP1/AJS3 v13 rule basis",
  "runtime-state-not-verified": "Runtime state not verified",
  "external-state-not-verified": "External state not verified",
  "comparison-period": "Comparison period",
};

const reasonLabels: StringMap = {
  "conditional-relation-removed": "Conditional relation removed",
  "wait-release-source-changed": "Wait-release source changed",
  "timeout-removed": "Timeout removed",
  "condition-judgment-changed": "Condition judgment changed",
  "wait-target-changed": "Wait target changed",
  "no-calculated-schedule-run": "Schedule run not calculated",
  "calculated-schedule-run-removed": "Calculated schedule run removed",
  "execution-user-type-changed": "Execution user type changed",
  "jp1-resource-group-changed": "JP1 resource group changed",
  "uninterpretable-file-monitoring-condition":
    "File monitoring condition cannot be interpreted",
  "cycle-schedule": "Cycle schedule is unsupported",
  "closed-day-substitution": "Closed-day substitution is unsupported",
  "shift-days": "Shift days are unsupported",
  "calendar-selection": "Calendar selection is unsupported",
  "inherited-parent-rule": "Inherited parent rule is unsupported",
  "days-from-start": "Days-from-start rule is unsupported",
  "invalid-start-time": "Invalid start time",
  "unpaired-start-time": "Unpaired start time",
  "unsupported-schedule-date": "Unsupported schedule date",
  "missing-start-time": "Missing start time",
  "invalid-calendar-day": "Invalid calendar day",
  "invalid-schedule-comparison-period": "Invalid schedule comparison period",
  "missing-target-side": "Target side is missing",
  "missing-target": "Target is missing",
  "unsupported-target": "Target type is unsupported",
};

const detailLabels: StringMap = {
  unit: "Unit",
  parameter: "Parameter",
  before: "Before",
  after: "After",
  raw: "Raw",
  removed: "Removed",
  period: "Period",
  "jp1-ajs3-v13-rule-basis": "JP1/AJS3 v13 rule basis",
  "runtime-state-not-verified": "Runtime state not verified",
  "external-state-not-verified": "External state not verified",
  "comparison-period": "Comparison period",
};

const valueLabels: StringMap = {
  "job-group": "Job group",
  jobnet: "Jobnet",
  unit: "Unit",
  relation: "Relation",
  attribute: "Attribute",
  "execution-environment": "Execution environment",
  "execution-definition": "Execution definition",
  "start-condition": "Start condition",
  "end-control": "End control",
  "abnormal-end-control": "Abnormal-end control",
  "wait-condition": "Wait condition",
  "external-integration": "External integration",
  schedule: "Schedule",
  required: "Required",
  total: "Total",
};

const errorLabels: StringMap = {
  "invalid-request": "Invalid request",
  "unknown-session": "This Explorer session is no longer available",
  "unknown-action": "This action is no longer available",
  "stale-request": "The request was superseded",
  "superseded-session": "The Explorer session was superseded",
  "disposed-session": "The Explorer session was closed",
  "record-not-found": "The comparison record was not found",
  "unavailable-target": "The target is unavailable",
  "stale-source": "The source changed and cannot be revealed safely",
  "source-lookup-failed": "The source target could not be located",
  "flow-not-ready": "The Flow viewer is not ready",
  "flow-target-missing": "The Flow target could not be located",
  "output-failed": "Semantic diff output could not be opened",
  "payload-too-large": "The Explorer message is too large",
  "host-disposed": "The Explorer host was closed",
};

const cardLabels: StringMap = {
  changes: "Changes",
  elements: "Elements",
  attributes: "Attributes",
  "confirmation-required": "Confirmation required",
  unsupported: "Unsupported",
  limitations: "Limitations",
  "schedule-run-changes": "Schedule run changes",
};

const groupLabels: StringMap = {
  "Comparison-level findings": "Comparison-level findings",
};

const englishUnknown = {
  state: "State unavailable",
  reason: "Reason unavailable",
  detailField: "Additional detail",
  value: "Other",
  error: "Explorer error",
  card: "Summary",
};

const english: SemanticDiffExplorerLabels = {
  title: "Semantic Diff Explorer",
  output: "Output",
  filter: "Filter changes",
  all: "All",
  confirmationRequired: "Confirmation required",
  findings: "Semantic diff findings",
  empty: "No semantic differences or review notes.",
  filterEmpty: "No confirmation-required items match this filter.",
  source: "Open source",
  flow: "Open Flow",
  unavailable: "Unavailable",
  loading: "Loading Semantic Diff Explorer…",
  stateLabel: "State",
  details: "Details",
  availableActions: "Available actions",
  summaryCards: "Summary cards",
  tree: "Semantic diff changes",
  warning: "Warning",
  group: (value) => groupLabels[value] ?? value,
  state: (value) => stateLabels[value] ?? englishUnknown.state,
  reason: (value) => reasonLabels[value] ?? englishUnknown.reason,
  detailField: (value) => detailLabels[value] ?? englishUnknown.detailField,
  value: (value) => valueLabels[value] ?? englishUnknown.value,
  error: (value) => errorLabels[value] ?? englishUnknown.error,
  selected: (label) => `Selected ${label}.`,
  expanded: (label) => `Expanded ${label}.`,
  collapsed: (label) => `Collapsed ${label}.`,
  actionCompleted: (label) => `${label} completed.`,
  actionUnavailable: (label) => `${label} is unavailable.`,
};

const japaneseStateLabels: StringMap = {
  added: "追加",
  removed: "削除",
  changed: "変更",
  renamed: "名前変更",
  moved: "移動",
  confirmed: "確定",
  candidate: "候補",
  "confirmation-required": "確認が必要",
  unsupported: "未対応",
  limitation: "制約",
  uninterpretable: "解釈不能",
  uncalculated: "未計算",
  parse: "解析の制約",
  normalization: "正規化の制約",
  "changed-time": "時刻変更",
  "jp1-ajs3-v13-rule-basis": "JP1/AJS3 v13ルール基準",
  "runtime-state-not-verified": "実行時状態を確認していません",
  "external-state-not-verified": "外部状態を確認していません",
  "comparison-period": "比較期間",
};

const japaneseReasonLabels: StringMap = {
  "conditional-relation-removed": "条件付きリレーションの削除",
  "wait-release-source-changed": "待ち合わせ解放元の変更",
  "timeout-removed": "タイムアウトの削除",
  "condition-judgment-changed": "条件判定の変更",
  "wait-target-changed": "待ち合わせ対象の変更",
  "no-calculated-schedule-run": "スケジュール実行未計算",
  "calculated-schedule-run-removed": "計算済みスケジュール実行の削除",
  "execution-user-type-changed": "実行ユーザー種別の変更",
  "jp1-resource-group-changed": "JP1リソースグループの変更",
  "uninterpretable-file-monitoring-condition":
    "ファイル監視条件を解釈できません",
  "cycle-schedule": "サイクルスケジュールは未対応です",
  "closed-day-substitution": "休日時振替は未対応です",
  "shift-days": "シフト日は未対応です",
  "calendar-selection": "カレンダー選択は未対応です",
  "inherited-parent-rule": "親ルールの継承は未対応です",
  "days-from-start": "開始日からの日数指定は未対応です",
  "invalid-start-time": "開始時刻が不正です",
  "unpaired-start-time": "開始時刻に対応する値がありません",
  "unsupported-schedule-date": "未対応のスケジュール日付です",
  "missing-start-time": "開始時刻がありません",
  "invalid-calendar-day": "カレンダー日が不正です",
  "invalid-schedule-comparison-period": "スケジュール比較期間が不正です",
  "missing-target-side": "対象側がありません",
  "missing-target": "対象がありません",
  "unsupported-target": "対象種別は未対応です",
};

const japaneseDetailLabels: StringMap = {
  unit: "ユニット",
  parameter: "パラメーター",
  before: "変更前",
  after: "変更後",
  raw: "元の値",
  removed: "削除済み",
  period: "期間",
  "jp1-ajs3-v13-rule-basis": "JP1/AJS3 v13ルール基準",
  "runtime-state-not-verified": "実行時状態を確認していません",
  "external-state-not-verified": "外部状態を確認していません",
  "comparison-period": "比較期間",
};

const japaneseValueLabels: StringMap = {
  "job-group": "ジョブグループ",
  jobnet: "ジョブネット",
  unit: "ユニット",
  relation: "リレーション",
  attribute: "属性",
  "execution-environment": "実行環境",
  "execution-definition": "実行定義",
  "start-condition": "開始条件",
  "end-control": "終了制御",
  "abnormal-end-control": "異常終了制御",
  "wait-condition": "待ち合わせ条件",
  "external-integration": "外部連携",
  schedule: "スケジュール",
  required: "必須",
  total: "合計",
};

const japaneseErrorLabels: StringMap = {
  "invalid-request": "不正なリクエストです",
  "unknown-session": "このExplorerセッションは利用できません",
  "unknown-action": "この操作は利用できません",
  "stale-request": "リクエストは置き換えられました",
  "superseded-session": "Explorerセッションは置き換えられました",
  "disposed-session": "Explorerセッションは終了しました",
  "record-not-found": "比較レコードが見つかりません",
  "unavailable-target": "対象を利用できません",
  "stale-source": "ソースが変更されたため安全に表示できません",
  "source-lookup-failed": "ソース対象が見つかりません",
  "flow-not-ready": "フロービューアーの準備ができていません",
  "flow-target-missing": "フロー対象が見つかりません",
  "output-failed": "セマンティック差分の出力を開けません",
  "payload-too-large": "Explorerメッセージが大きすぎます",
  "host-disposed": "Explorerホストは終了しました",
};

const japaneseCardLabels: StringMap = {
  changes: "変更",
  elements: "要素",
  attributes: "属性",
  "confirmation-required": "確認が必要",
  unsupported: "未対応",
  limitations: "制約",
  "schedule-run-changes": "スケジュール実行の変更",
};

const japaneseGroupLabels: StringMap = {
  "Comparison-level findings": "比較レベルの検出結果",
};

const japaneseUnknown = {
  state: "状態不明",
  reason: "理由不明",
  detailField: "追加詳細",
  value: "その他",
  error: "Explorerエラー",
  card: "概要",
};

export const semanticDiffExplorerCardLabel = (
  id: string,
  language = "en",
): string =>
  (language.toLowerCase().startsWith("ja") ? japaneseCardLabels : cardLabels)[
    id
  ] ??
  (language.toLowerCase().startsWith("ja")
    ? japaneseUnknown.card
    : englishUnknown.card);

const japanese: SemanticDiffExplorerLabels = {
  title: "セマンティック差分エクスプローラー",
  output: "出力",
  filter: "変更を絞り込む",
  all: "すべて",
  confirmationRequired: "確認が必要",
  findings: "セマンティック差分の検出結果",
  empty: "セマンティック差分またはレビュー項目はありません。",
  filterEmpty: "確認が必要な項目はありません。",
  source: "ソースを開く",
  flow: "フローを開く",
  unavailable: "利用不可",
  loading: "セマンティック差分エクスプローラーを読み込んでいます…",
  stateLabel: "状態",
  details: "詳細",
  availableActions: "利用可能な操作",
  summaryCards: "概要カード",
  tree: "セマンティック差分の変更",
  warning: "警告",
  group: (value) => japaneseGroupLabels[value] ?? value,
  state: (value) => japaneseStateLabels[value] ?? japaneseUnknown.state,
  reason: (value) => japaneseReasonLabels[value] ?? japaneseUnknown.reason,
  detailField: (value) =>
    japaneseDetailLabels[value] ?? japaneseUnknown.detailField,
  value: (value) => japaneseValueLabels[value] ?? japaneseUnknown.value,
  error: (value) => japaneseErrorLabels[value] ?? japaneseUnknown.error,
  selected: (label) => `${label}を選択しました。`,
  expanded: (label) => `${label}を展開しました。`,
  collapsed: (label) => `${label}を折りたたみました。`,
  actionCompleted: (label) => `${label}が完了しました。`,
  actionUnavailable: (label) => `${label}は利用できません。`,
};

export const getSemanticDiffExplorerLabels = (
  language = "en",
): SemanticDiffExplorerLabels =>
  language.toLowerCase().startsWith("ja") ? japanese : english;

export const semanticDiffExplorerLocalization = getSemanticDiffExplorerLabels;
