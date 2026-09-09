type LocalePair = readonly [string, string];
type LocaleTable = Readonly<Record<string, LocalePair>>;

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

const ui: LocaleTable = {
  title: ["Semantic Diff Explorer", "セマンティック差分エクスプローラー"],
  output: ["Output", "出力"],
  filter: ["Filter changes", "変更を絞り込む"],
  all: ["All", "すべて"],
  confirmationRequired: ["Confirmation required", "確認が必要"],
  findings: ["Semantic diff findings", "セマンティック差分の検出結果"],
  empty: [
    "No semantic differences or review notes.",
    "セマンティック差分またはレビュー項目はありません。",
  ],
  filterEmpty: [
    "No confirmation-required items match this filter.",
    "確認が必要な項目はありません。",
  ],
  source: ["Open source", "ソースを開く"],
  flow: ["Open Flow", "フローを開く"],
  unavailable: ["Unavailable", "利用不可"],
  loading: [
    "Loading Semantic Diff Explorer…",
    "セマンティック差分エクスプローラーを読み込んでいます…",
  ],
  stateLabel: ["State", "状態"],
  details: ["Details", "詳細"],
  availableActions: ["Available actions", "利用可能な操作"],
  summaryCards: ["Summary cards", "概要カード"],
  tree: ["Semantic diff changes", "セマンティック差分の変更"],
  warning: ["Warning", "警告"],
  unknownState: ["State unavailable", "状態不明"],
  unknownReason: ["Reason unavailable", "理由不明"],
  unknownDetail: ["Additional detail", "追加詳細"],
  unknownValue: ["Other", "その他"],
  unknownError: ["Explorer error", "Explorerエラー"],
  unknownCard: ["Summary", "概要"],
};

const states: LocaleTable = {
  added: ["Added", "追加"],
  removed: ["Removed", "削除"],
  changed: ["Changed", "変更"],
  renamed: ["Renamed", "名前変更"],
  moved: ["Moved", "移動"],
  confirmed: ["Confirmed", "確定"],
  candidate: ["Candidate", "候補"],
  "confirmation-required": ["Confirmation required", "確認が必要"],
  unsupported: ["Unsupported", "未対応"],
  limitation: ["Limitation", "制約"],
  uninterpretable: ["Uninterpretable", "解釈不能"],
  uncalculated: ["Uncalculated", "未計算"],
  parse: ["Parse limitation", "解析の制約"],
  normalization: ["Normalization limitation", "正規化の制約"],
  "changed-time": ["Time changed", "時刻変更"],
  "jp1-ajs3-v13-rule-basis": [
    "JP1/AJS3 v13 rule basis",
    "JP1/AJS3 v13ルール基準",
  ],
  "runtime-state-not-verified": [
    "Runtime state not verified",
    "実行時状態を確認していません",
  ],
  "external-state-not-verified": [
    "External state not verified",
    "外部状態を確認していません",
  ],
  "comparison-period": ["Comparison period", "比較期間"],
};

const reasons: LocaleTable = {
  "conditional-relation-removed": [
    "Conditional relation removed",
    "条件付きリレーションの削除",
  ],
  "wait-release-source-changed": [
    "Wait-release source changed",
    "待ち合わせ解放元の変更",
  ],
  "timeout-removed": ["Timeout removed", "タイムアウトの削除"],
  "condition-judgment-changed": [
    "Condition judgment changed",
    "条件判定の変更",
  ],
  "wait-target-changed": ["Wait target changed", "待ち合わせ対象の変更"],
  "no-calculated-schedule-run": [
    "Schedule run not calculated",
    "スケジュール実行未計算",
  ],
  "calculated-schedule-run-removed": [
    "Calculated schedule run removed",
    "計算済みスケジュール実行の削除",
  ],
  "execution-user-type-changed": [
    "Execution user type changed",
    "実行ユーザー種別の変更",
  ],
  "jp1-resource-group-changed": [
    "JP1 resource group changed",
    "JP1リソースグループの変更",
  ],
  "uninterpretable-file-monitoring-condition": [
    "File monitoring condition cannot be interpreted",
    "ファイル監視条件を解釈できません",
  ],
  "cycle-schedule": [
    "Cycle schedule is unsupported",
    "サイクルスケジュールは未対応です",
  ],
  "closed-day-substitution": [
    "Closed-day substitution is unsupported",
    "休日時振替は未対応です",
  ],
  "shift-days": ["Shift days are unsupported", "シフト日は未対応です"],
  "calendar-selection": [
    "Calendar selection is unsupported",
    "カレンダー選択は未対応です",
  ],
  "inherited-parent-rule": [
    "Inherited parent rule is unsupported",
    "親ルールの継承は未対応です",
  ],
  "days-from-start": [
    "Days-from-start rule is unsupported",
    "開始日からの日数指定は未対応です",
  ],
  "invalid-start-time": ["Invalid start time", "開始時刻が不正です"],
  "unpaired-start-time": [
    "Unpaired start time",
    "開始時刻に対応する値がありません",
  ],
  "unsupported-schedule-date": [
    "Unsupported schedule date",
    "未対応のスケジュール日付です",
  ],
  "missing-start-time": ["Missing start time", "開始時刻がありません"],
  "invalid-calendar-day": ["Invalid calendar day", "カレンダー日が不正です"],
  "invalid-schedule-comparison-period": [
    "Invalid schedule comparison period",
    "スケジュール比較期間が不正です",
  ],
  "missing-target-side": ["Target side is missing", "対象側がありません"],
  "missing-target": ["Target is missing", "対象がありません"],
  "unsupported-target": ["Target type is unsupported", "対象種別は未対応です"],
};

const details: LocaleTable = {
  unit: ["Unit", "ユニット"],
  parameter: ["Parameter", "パラメーター"],
  before: ["Before", "変更前"],
  after: ["After", "変更後"],
  raw: ["Raw", "元の値"],
  removed: ["Removed", "削除済み"],
  period: ["Period", "期間"],
  "jp1-ajs3-v13-rule-basis": [
    "JP1/AJS3 v13 rule basis",
    "JP1/AJS3 v13ルール基準",
  ],
  "runtime-state-not-verified": [
    "Runtime state not verified",
    "実行時状態を確認していません",
  ],
  "external-state-not-verified": [
    "External state not verified",
    "外部状態を確認していません",
  ],
  "comparison-period": ["Comparison period", "比較期間"],
};

const values: LocaleTable = {
  "job-group": ["Job group", "ジョブグループ"],
  jobnet: ["Jobnet", "ジョブネット"],
  unit: ["Unit", "ユニット"],
  relation: ["Relation", "リレーション"],
  attribute: ["Attribute", "属性"],
  "execution-environment": ["Execution environment", "実行環境"],
  "execution-definition": ["Execution definition", "実行定義"],
  "start-condition": ["Start condition", "開始条件"],
  "end-control": ["End control", "終了制御"],
  "abnormal-end-control": ["Abnormal-end control", "異常終了制御"],
  "wait-condition": ["Wait condition", "待ち合わせ条件"],
  "external-integration": ["External integration", "外部連携"],
  schedule: ["Schedule", "スケジュール"],
  required: ["Required", "必須"],
  total: ["Total", "合計"],
};

const errors: LocaleTable = {
  "invalid-request": ["Invalid request", "不正なリクエストです"],
  "unknown-session": [
    "This Explorer session is no longer available",
    "このExplorerセッションは利用できません",
  ],
  "unknown-action": [
    "This action is no longer available",
    "この操作は利用できません",
  ],
  "stale-request": [
    "The request was superseded",
    "リクエストは置き換えられました",
  ],
  "superseded-session": [
    "The Explorer session was superseded",
    "Explorerセッションは置き換えられました",
  ],
  "disposed-session": [
    "The Explorer session was closed",
    "Explorerセッションは終了しました",
  ],
  "record-not-found": [
    "The comparison record was not found",
    "比較レコードが見つかりません",
  ],
  "unavailable-target": ["The target is unavailable", "対象を利用できません"],
  "stale-source": [
    "The source changed and cannot be revealed safely",
    "ソースが変更されたため安全に表示できません",
  ],
  "source-lookup-failed": [
    "The source target could not be located",
    "ソース対象が見つかりません",
  ],
  "flow-not-ready": [
    "The Flow viewer is not ready",
    "フロービューアーの準備ができていません",
  ],
  "flow-target-missing": [
    "The Flow target could not be located",
    "フロー対象が見つかりません",
  ],
  "output-failed": [
    "Semantic diff output could not be opened",
    "セマンティック差分の出力を開けません",
  ],
  "payload-too-large": [
    "The Explorer message is too large",
    "Explorerメッセージが大きすぎます",
  ],
  "host-disposed": [
    "The Explorer host was closed",
    "Explorerホストは終了しました",
  ],
};

const cards: LocaleTable = {
  changes: ["Changes", "変更"],
  elements: ["Elements", "要素"],
  attributes: ["Attributes", "属性"],
  "confirmation-required": ["Confirmation required", "確認が必要"],
  unsupported: ["Unsupported", "未対応"],
  limitations: ["Limitations", "制約"],
  "schedule-run-changes": ["Schedule run changes", "スケジュール実行の変更"],
};

const groups: LocaleTable = {
  "Comparison-level findings": [
    "Comparison-level findings",
    "比較レベルの検出結果",
  ],
};
const read = ({
  table,
  key,
  index,
  fallback,
}: Readonly<{
  table: LocaleTable;
  key: string;
  index: 0 | 1;
  fallback: string;
}>): string => table[key]?.[index] ?? fallback;
interface ExplorerStaticLabelShape {
  title: true;
  output: true;
  filter: true;
  all: true;
  confirmationRequired: true;
  findings: true;
  empty: true;
  filterEmpty: true;
  source: true;
  flow: true;
  unavailable: true;
  loading: true;
  stateLabel: true;
  details: true;
  availableActions: true;
  summaryCards: true;
  tree: true;
  warning: true;
}
interface ExplorerLookupLabelShape {
  group: true;
  state: true;
  reason: true;
  detailField: true;
  value: true;
  error: true;
}
interface ExplorerAnnouncementLabelShape {
  selected: true;
  expanded: true;
  collapsed: true;
  actionCompleted: true;
  actionUnavailable: true;
}
type ExplorerStaticLabelKey = keyof ExplorerStaticLabelShape;
type ExplorerLookupLabelKey = keyof ExplorerLookupLabelShape;
type ExplorerAnnouncementLabelKey = keyof ExplorerAnnouncementLabelShape;
type ExplorerDynamicLabelKey =
  | ExplorerLookupLabelKey
  | ExplorerAnnouncementLabelKey;
const createStaticLabels = (
  text: (key: string) => string,
): Pick<SemanticDiffExplorerLabels, ExplorerStaticLabelKey> => ({
  title: text("title"),
  output: text("output"),
  filter: text("filter"),
  all: text("all"),
  confirmationRequired: text("confirmationRequired"),
  findings: text("findings"),
  empty: text("empty"),
  filterEmpty: text("filterEmpty"),
  source: text("source"),
  flow: text("flow"),
  unavailable: text("unavailable"),
  loading: text("loading"),
  stateLabel: text("stateLabel"),
  details: text("details"),
  availableActions: text("availableActions"),
  summaryCards: text("summaryCards"),
  tree: text("tree"),
  warning: text("warning"),
});
const localized = (index: 0 | 1, english: string, japanese: string): string =>
  index === 1 ? japanese : english;
const createAnnouncementLabels = (
  index: 0 | 1,
): Pick<SemanticDiffExplorerLabels, ExplorerAnnouncementLabelKey> => ({
  selected: (label) =>
    localized(index, `Selected ${label}.`, `${label}を選択しました。`),
  expanded: (label) =>
    localized(index, `Expanded ${label}.`, `${label}を展開しました。`),
  collapsed: (label) =>
    localized(index, `Collapsed ${label}.`, `${label}を折りたたみました。`),
  actionCompleted: (label) =>
    localized(index, `${label} completed.`, `${label}が完了しました。`),
  actionUnavailable: (label) =>
    localized(index, `${label} is unavailable.`, `${label}は利用できません。`),
});
const createLookupLabels = (
  index: 0 | 1,
  lookup: (table: LocaleTable, key: string, fallbackKey: string) => string,
): Pick<SemanticDiffExplorerLabels, ExplorerLookupLabelKey> => ({
  group: (value) => read({ table: groups, key: value, index, fallback: value }),
  state: (value) => lookup(states, value, "unknownState"),
  reason: (value) => lookup(reasons, value, "unknownReason"),
  detailField: (value) => lookup(details, value, "unknownDetail"),
  value: (value) => lookup(values, value, "unknownValue"),
  error: (value) => lookup(errors, value, "unknownError"),
});
const createDynamicLabels = (
  index: 0 | 1,
  lookup: (table: LocaleTable, key: string, fallbackKey: string) => string,
): Pick<SemanticDiffExplorerLabels, ExplorerDynamicLabelKey> => ({
  ...createLookupLabels(index, lookup),
  ...createAnnouncementLabels(index),
});
const createLabels = (index: 0 | 1): SemanticDiffExplorerLabels => {
  const text = (key: string): string =>
    read({ table: ui, key, index, fallback: "" });
  const lookup = (
    table: LocaleTable,
    key: string,
    fallbackKey: string,
  ): string => read({ table, key, index, fallback: text(fallbackKey) });
  return { ...createStaticLabels(text), ...createDynamicLabels(index, lookup) };
};

const englishLabels = createLabels(0);
const japaneseLabels = createLabels(1);
const japanese = (language: string): boolean =>
  language.toLowerCase().startsWith("ja");
export const semanticDiffExplorerCardLabel = (
  id: string,
  language = "en",
): string =>
  read({
    table: cards,
    key: id,
    index: japanese(language) ? 1 : 0,
    fallback: japanese(language) ? "概要" : "Summary",
  });
export const getSemanticDiffExplorerLabels = (
  language = "en",
): SemanticDiffExplorerLabels =>
  japanese(language) ? japaneseLabels : englishLabels;
export const semanticDiffExplorerLocalization = getSemanticDiffExplorerLabels;
