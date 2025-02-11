// internationalization
import * as message from "@resource/i18n/message";
import * as ty from "@resource/i18n/ty";
import * as parameter from "@resource/i18n/parameter";
import * as ajscolumn from "@resource/i18n/ajscolumn";

/** Literal type */
export type LocaleKeyType = keyof typeof message.en;
type LocaleEntry = {
  [lang: string]: string;
};
const localeTable = (language: string): LocaleEntry => {
  return {
    ...message.en,
    ...{
      en: message.en,
      ja: message.ja,
    }[language],
  };
};

/** Return message or key string if key is not present. */
export const localeString = (key: string, language: string = "en"): string =>
  localeTable(language)[key] || key;
/** Return message. */
export const localeMap = (
  key: LocaleKeyType,
  language: string = "en",
): string => localeString(key, language);

// ty name
export const tyDefinitionLang = (language: string): typeof ty.en => {
  return {
    ...ty.en,
    ...{
      en: ty.en,
      ja: ty.ja,
    }[language],
  };
};

// parameter
export const paramDefinitionLang = (language: string): typeof parameter.en => {
  return {
    ...parameter.en,
    ...{
      en: parameter.en,
      ja: parameter.ja,
    }[language],
  };
};

// column titles
export const ajsTableColumnHeaderLang = (
  language: string,
): typeof ajscolumn.en => {
  return {
    ...ajscolumn.en,
    ...{
      en: ajscolumn.en,
      ja: ajscolumn.ja,
    }[language],
  };
};
