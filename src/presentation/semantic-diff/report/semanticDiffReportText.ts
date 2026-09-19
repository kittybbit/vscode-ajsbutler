import * as message from "@resource/i18n/message";

type LocaleEntry = {
  [lang: string]: string;
};

const localeTable = (language: string): LocaleEntry => ({
  ...message.en,
  ...({ en: message.en, ja: message.ja }[language] ?? {}),
});

export const semanticDiffReportText = (
  key: string,
  language: string | undefined,
  values: Record<string, string> = {},
): string =>
  Object.entries(values).reduce(
    (localized, [name, value]) => localized.replaceAll(`{${name}}`, value),
    localeTable(language?.toLowerCase().split("-")[0] ?? "en")[
      `semanticDiff.${key}`
    ] || `semanticDiff.${key}`,
  );
