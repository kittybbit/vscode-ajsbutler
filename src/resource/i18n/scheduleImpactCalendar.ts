const localizedText = [
  ["Schedule Impact Calendar", "スケジュール影響カレンダー"],
  ["Comparison period", "比較期間"],
  ["Schedule impact timeline", "スケジュール影響タイムライン"],
  ["Identity candidates", "同一性候補"],
  ["Uncalculated schedule portions", "未計算のスケジュール範囲"],
  ["Filters", "フィルター"],
  ["Root jobnet", "ルートジョブネット"],
  ["Root outcomes", "ルート結果"],
  ["Counterpart", "対応するルート"],
  ["Side", "サイド"],
  ["Source unit name", "ソースユニット名"],
  ["Source unit path", "ソースユニットパス"],
  ["Occurrence", "出現順"],
  ["Scope transition", "範囲遷移"],
  ["Side absent", "サイドなし"],
  ["Target kind", "対象種別"],
  ["Target ID", "対象ID"],
  ["Parameter key", "パラメーターキー"],
  ["Structured detail", "構造化詳細"],
  ["Kind", "種別"],
  ["Reason", "理由"],
  ["Calendar legend", "カレンダー凡例"],
  ["None", "なし"],
  ["Root outcome", "ルート結果"],
  ["Run state", "実行状態"],
  ["All", "すべて"],
  [
    "No timeline entries match these filters.",
    "条件に一致するタイムライン項目はありません。",
  ],
  ["Valid no-runs", "有効な実行なし"],
  [
    "No roots have a valid no-run outcome.",
    "有効な実行なしのルートはありません。",
  ],
  ["Supported runs", "対応する実行"],
  ["Partial", "一部計算"],
  ["Uncalculated", "未計算"],
  ["Unchanged", "変更なし"],
  ["Added", "追加"],
  ["Removed", "削除"],
  ["Time changed", "時刻変更"],
  ["Added root scope", "ルート範囲の追加"],
  ["Removed root scope", "ルート範囲の削除"],
  ["Before", "変更前"],
  ["After", "変更後"],
  ["Rule", "ルール"],
  ["Before candidates", "変更前候補"],
  ["After candidates", "変更後候補"],
  ["No identity candidates.", "同一性候補はありません。"],
  [
    "No uncalculated schedule portions.",
    "未計算のスケジュール範囲はありません。",
  ],
  ["Issue", "問題"],
  [
    "The schedule impact calendar could not be loaded.",
    "スケジュール影響カレンダーを読み込めませんでした。",
  ],
  [
    "Loading schedule impact calendar…",
    "スケジュール影響カレンダーを読み込んでいます…",
  ],
  [
    "Schedule impact calendar unavailable",
    "スケジュール影響カレンダーは利用できません",
  ],
  ["Refresh", "更新"],
  ["Schedule impact calendar contains", "スケジュール影響カレンダーに"],
  ["Selected schedule impact", "選択したスケジュール影響:"],
  ["entries", "件あります。"],
  ["entries are visible.", "件中表示しています。"],
  [
    "Schedule impact filters updated.",
    "スケジュール影響フィルターを更新しました。",
  ],
] as const;

const englishText = localizedText.map(([english]) => english);
const japaneseText = localizedText.map(([, japanese]) => japanese);

const formatCalendarResults = (
  locale: "en" | "ja",
  visible: number,
  total: number,
): string =>
  locale === "ja"
    ? `${total} 件中 ${visible} 件を表示`
    : `${visible} of ${total} timeline entries visible`;

const formatCalendarCandidateGroup = (
  locale: "en" | "ja",
  index: number,
): string =>
  locale === "ja" ? `候補グループ${index}` : `Candidate group ${index}`;

const formatCalendarSelection = ({
  locale,
  value,
  selectedPrefix,
  selectedSuffix,
}: Readonly<{
  locale: "en" | "ja";
  value: string;
  selectedPrefix: string;
  selectedSuffix: string;
}>): string =>
  locale === "ja"
    ? `スケジュール影響カレンダーに ${value} 件あります。`
    : `${selectedPrefix} ${value} ${selectedSuffix}.`;

const formatCalendarSelectedItem = (
  locale: "en" | "ja",
  value: string,
  selectedItemPrefix: string,
): string =>
  locale === "ja"
    ? `選択したスケジュール影響: ${value}。`
    : `${selectedItemPrefix} ${value}.`;

const formatCalendarFiltered = ({
  locale,
  visible,
  total,
  filteredSuffix,
}: Readonly<{
  locale: "en" | "ja";
  visible: number;
  total: number;
  filteredSuffix: string;
}>): string =>
  locale === "ja"
    ? `${total} 件中 ${visible} 件を表示しています。`
    : `${visible} of ${total} ${filteredSuffix}`;

const createScheduleImpactCalendarLabels = (
  text: readonly string[],
  locale: "en" | "ja",
) => {
  const [
    title,
    period,
    timeline,
    candidates,
    issues,
    filters,
    root,
    rootStatus,
    counterpart,
    side,
    unitName,
    unitPath,
    occurrence,
    scopeTransition,
    absentSide,
    targetKind,
    targetId,
    parameterKey,
    detail,
    kind,
    reason,
    legend,
    none,
    outcome,
    runState,
    all,
    noResults,
    noRuns,
    emptyNoRuns,
    supportedRuns,
    partial,
    uncalculated,
    unchanged,
    added,
    removed,
    changedTime,
    addedRootScope,
    removedRootScope,
    before,
    after,
    rule,
    candidateBefore,
    candidateAfter,
    emptyCandidates,
    emptyIssues,
    issue,
    error,
    loading,
    failed,
    refresh,
    selectedPrefix,
    selectedItemPrefix,
    selectedSuffix,
    filteredSuffix,
    filterChanged,
  ] = text;
  return {
    title,
    period,
    timeline,
    candidates,
    issues,
    filters,
    root,
    rootStatus,
    counterpart,
    side,
    unitName,
    unitPath,
    occurrence,
    scopeTransition,
    absentSide,
    targetKind,
    targetId,
    parameterKey,
    detail,
    kind,
    reason,
    legend,
    none,
    outcome,
    runState,
    all,
    results: (visible: number, total: number): string =>
      formatCalendarResults(locale, visible, total),
    noResults,
    noRuns,
    emptyNoRuns,
    supportedRuns,
    partial,
    uncalculated,
    unchanged,
    added,
    removed,
    changedTime,
    addedRootScope,
    removedRootScope,
    before,
    after,
    rule,
    candidateBefore,
    candidateAfter,
    candidateGroup: (index: number): string =>
      formatCalendarCandidateGroup(locale, index),
    emptyCandidates,
    emptyIssues,
    issue,
    error,
    loading,
    failed,
    refresh,
    selected: (value: string): string =>
      formatCalendarSelection({
        locale,
        value,
        selectedPrefix,
        selectedSuffix,
      }),
    selectedItem: (value: string): string =>
      formatCalendarSelectedItem(locale, value, selectedItemPrefix),
    filtered: (visible: number, total: number): string =>
      formatCalendarFiltered({ locale, visible, total, filteredSuffix }),
    filterChanged,
  };
};

export const scheduleImpactCalendarEnglish = createScheduleImpactCalendarLabels(
  englishText,
  "en",
);
export const scheduleImpactCalendarJapanese =
  createScheduleImpactCalendarLabels(japaneseText, "ja");

export type ScheduleImpactCalendarLabels = typeof scheduleImpactCalendarEnglish;

export const normalizeScheduleImpactCalendarLocale = (
  language: string | undefined,
): "en" | "ja" => {
  const normalized = (language ?? "").toLowerCase();
  return normalized === "ja" || normalized.startsWith("ja-") ? "ja" : "en";
};

export const getScheduleImpactCalendarLabels = (
  language: string | undefined,
): ScheduleImpactCalendarLabels =>
  normalizeScheduleImpactCalendarLocale(language) === "ja"
    ? scheduleImpactCalendarJapanese
    : scheduleImpactCalendarEnglish;
