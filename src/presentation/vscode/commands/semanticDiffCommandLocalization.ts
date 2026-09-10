import type { GitHeadDefinitionUnavailableReason } from "../../../application/semantic-diff/GitHeadDefinitionSourcePort";

export type SemanticDiffCommandLocalization = Readonly<{
  noActiveEditor: string;
  cancelled: string;
  sourcePicker: string;
  sourcePickerTitle: string;
  selectDefinitionFile: string;
  gitHead: string;
  periodPicker: string;
  periodPickerTitle: string;
  noSchedulePeriod: string;
  specifySchedulePeriod: string;
  fromDateTitle: string;
  fromDatePrompt: string;
  toDateTitle: string;
  toDatePrompt: string;
  datePlaceholder: string;
  invalidFromDate: string;
  invalidToDate: string;
  nonIncreasingPeriod: string;
  activeEditorFailed: string;
  afterNonText: string;
  afterTooLarge: string;
  sourcePickerFailed: string;
  gitHeadUnavailable: string;
  gitHeadRepositoryMissing: string;
  gitHeadMissing: string;
  gitHeadSourceMissing: string;
  gitHeadUnsupported: string;
  gitHeadBinary: string;
  gitHeadTooLarge: string;
  gitHeadReadFailed: string;
  gitHeadSnapshotCapacity: string;
  beforeFileReadFailed: string;
  beforeFileNonText: string;
  beforeFileTooLarge: string;
  parseFailed: string;
  parseFailedBefore: string;
  parseFailedAfter: string;
  parseFailedBoth: string;
  comparisonFailed: string;
  sourceCaptureFailed: string;
  explorerOpenFailed: string;
}>;

type SupportedLanguage = "en" | "ja";

type LocalizedValue = Readonly<{
  en: string;
  ja: string;
}>;

const LOCALIZED_TEXT: Readonly<
  Record<keyof SemanticDiffCommandLocalization, LocalizedValue>
> = {
  noActiveEditor: {
    en: "Open a JP1/AJS definition before running semantic diff.",
    ja: "セマンティック差分を実行する前に JP1/AJS 定義を開いてください。",
  },
  cancelled: {
    en: "Semantic diff was cancelled.",
    ja: "セマンティック差分をキャンセルしました。",
  },
  sourcePicker: {
    en: "Select before definition source",
    ja: "比較する前定義のソースを選択",
  },
  sourcePickerTitle: { en: "Compare Definition", ja: "定義を比較" },
  selectDefinitionFile: {
    en: "Select Definition File",
    ja: "定義ファイルを選択",
  },
  gitHead: { en: "Git HEAD", ja: "Git HEAD" },
  periodPicker: {
    en: "Select schedule comparison period",
    ja: "スケジュール比較期間を選択",
  },
  periodPickerTitle: { en: "Compare Definition", ja: "定義を比較" },
  noSchedulePeriod: { en: "No schedule period", ja: "スケジュール期間なし" },
  specifySchedulePeriod: {
    en: "Specify schedule period",
    ja: "スケジュール比較期間を指定",
  },
  fromDateTitle: { en: "Compare Definition", ja: "定義を比較" },
  fromDatePrompt: { en: "From date (YYYY-MM-DD)", ja: "開始日 (YYYY-MM-DD)" },
  toDateTitle: { en: "Compare Definition", ja: "定義を比較" },
  toDatePrompt: { en: "To date (YYYY-MM-DD)", ja: "終了日 (YYYY-MM-DD)" },
  datePlaceholder: { en: "YYYY-MM-DD", ja: "YYYY-MM-DD" },
  invalidFromDate: {
    en: "Enter a real date in YYYY-MM-DD format.",
    ja: "実在する日付を YYYY-MM-DD 形式で入力してください。",
  },
  invalidToDate: {
    en: "Enter a real date in YYYY-MM-DD format.",
    ja: "実在する日付を YYYY-MM-DD 形式で入力してください。",
  },
  nonIncreasingPeriod: {
    en: "The end date must be after the start date.",
    ja: "終了日は開始日より後にしてください。",
  },
  activeEditorFailed: {
    en: "The active JP1/AJS definition could not be accessed.",
    ja: "アクティブな JP1/AJS 定義にアクセスできません。",
  },
  afterNonText: {
    en: "The active JP1/AJS definition is not text.",
    ja: "アクティブな JP1/AJS 定義はテキストではありません。",
  },
  afterTooLarge: {
    en: "The active JP1/AJS definition exceeds the 8 MiB limit.",
    ja: "アクティブな JP1/AJS 定義が 8 MiB の上限を超えています。",
  },
  sourcePickerFailed: {
    en: "The before definition source could not be selected.",
    ja: "比較元の定義を選択できませんでした。",
  },
  gitHeadUnavailable: {
    en: "Git HEAD comparison is not available yet.",
    ja: "Git HEAD 比較はまだ利用できません。",
  },
  gitHeadRepositoryMissing: {
    en: "The active definition is not in a Git repository.",
    ja: "アクティブな定義は Git リポジトリにありません。",
  },
  gitHeadMissing: {
    en: "The active Git repository has no HEAD definition.",
    ja: "アクティブな Git リポジトリに HEAD 定義がありません。",
  },
  gitHeadSourceMissing: {
    en: "The definition could not be found at Git HEAD.",
    ja: "Git HEAD に定義が見つかりません。",
  },
  gitHeadUnsupported: {
    en: "Git HEAD could not provide this definition.",
    ja: "Git HEAD からこの定義を取得できません。",
  },
  gitHeadBinary: {
    en: "The Git HEAD definition is not text.",
    ja: "Git HEAD の定義はテキストではありません。",
  },
  gitHeadTooLarge: {
    en: "The Git HEAD definition exceeds the 8 MiB limit.",
    ja: "Git HEAD の定義が 8 MiB の上限を超えています。",
  },
  gitHeadReadFailed: {
    en: "The Git HEAD definition could not be read.",
    ja: "Git HEAD の定義を読み込めませんでした。",
  },
  gitHeadSnapshotCapacity: {
    en: "Git HEAD source snapshots are temporarily full.",
    ja: "Git HEAD ソースの保持領域が一時的に上限に達しています。",
  },
  beforeFileReadFailed: {
    en: "The selected before definition could not be read.",
    ja: "選択した比較元の定義を読み込めませんでした。",
  },
  beforeFileNonText: {
    en: "The selected before definition is not text.",
    ja: "選択した比較元の定義はテキストではありません。",
  },
  beforeFileTooLarge: {
    en: "The selected before definition exceeds the 8 MiB limit.",
    ja: "選択した比較元の定義が 8 MiB の上限を超えています。",
  },
  parseFailed: {
    en: "Semantic diff could not parse one or both definitions.",
    ja: "定義を解析できず、セマンティック差分を作成できませんでした。",
  },
  parseFailedBefore: {
    en: "The before definition could not be parsed.",
    ja: "比較元の定義を解析できませんでした。",
  },
  parseFailedAfter: {
    en: "The after definition could not be parsed.",
    ja: "アクティブな定義を解析できませんでした。",
  },
  parseFailedBoth: {
    en: "The before and after definitions could not be parsed.",
    ja: "比較元とアクティブな定義を解析できませんでした。",
  },
  comparisonFailed: {
    en: "Semantic diff comparison could not be completed.",
    ja: "セマンティック差分の比較を完了できませんでした。",
  },
  sourceCaptureFailed: {
    en: "Semantic diff source capture could not be established.",
    ja: "セマンティック差分のソースを保持できませんでした。",
  },
  explorerOpenFailed: {
    en: "Semantic diff Explorer could not be opened.",
    ja: "セマンティック差分 Explorer を開けませんでした。",
  },
};

const createLocalization = (
  language: SupportedLanguage,
): SemanticDiffCommandLocalization =>
  Object.fromEntries(
    Object.entries(LOCALIZED_TEXT).map(([key, value]) => [
      key,
      value[language],
    ]),
  ) as SemanticDiffCommandLocalization;

const ENGLISH = createLocalization("en");
const JAPANESE = createLocalization("ja");

export const getSemanticDiffCommandLocalization = (
  language: string | undefined,
): SemanticDiffCommandLocalization =>
  language?.toLowerCase().startsWith("ja") === true ? JAPANESE : ENGLISH;

export const localizeGitHeadUnavailableReason = (
  localization: SemanticDiffCommandLocalization,
  reason: GitHeadDefinitionUnavailableReason,
): string => {
  switch (reason) {
    case "repository-not-found":
      return localization.gitHeadRepositoryMissing;
    case "head-missing":
      return localization.gitHeadMissing;
    case "head-source-missing":
      return localization.gitHeadSourceMissing;
    case "binary":
    case "submodule":
      return localization.gitHeadBinary;
    case "unsupported-encoding":
      return localization.gitHeadUnsupported;
    case "too-large":
      return localization.gitHeadTooLarge;
    case "read-failed":
      return localization.gitHeadReadFailed;
    case "extension-missing":
    case "extension-disabled":
    case "activation-failed":
    case "api-unavailable":
    case "virtual-repository-unsupported":
      return localization.gitHeadUnavailable;
  }
};
