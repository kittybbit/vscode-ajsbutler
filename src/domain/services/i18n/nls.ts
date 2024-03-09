// internationalization
import { merge } from 'lodash-es';
import * as message from '@resource/i18n/message';
import * as ty from '@resource/i18n/ty';
import * as parameter from '@resource/i18n/parameter';
import * as ajscolumn from '@resource/i18n/ajscolumn';

/** Literal type */
export type LocaleKeyType = keyof typeof message.message_en;
type LocaleEntry = {
    [lang: string]: string;
}
const localeTable = (language: string): LocaleEntry => {
    return Object.assign(
        message.message_en,
        {
            'en': message.message_en,
            'ja': message.message_ja
        }[language]);
};

/** Return message or key string if key is not present. */
export const localeString = (key: string, language: string = 'en'): string => localeTable(language)[key] || key;
/** Return message. */
export const localeMap = (key: LocaleKeyType, language: string = 'en'): string => localeString(key, language);

// ty name
export const tyDefinitionLang = (language: string): typeof ty.ty_en => {
    return merge(
        {},
        ty.ty_en,
        {
            'en': ty.ty_en,
            'ja': ty.ty_ja,
        }[language])
        ;
};

// parameter
export const paramDefinitionLang = (language: string): typeof parameter.parameter_en => {
    return merge(
        {},
        parameter.parameter_en,
        {
            'en': parameter.parameter_en,
            'ja': parameter.parameter_ja,
        }[language]);
};

// column titles
export const ajsTableColumnHeaderLang = (language: string): typeof ajscolumn.ajscolumn_en => {
    return merge(
        {},
        ajscolumn.ajscolumn_en,
        {
            'en': ajscolumn.ajscolumn_en,
            'ja': ajscolumn.ajscolumn_ja,
        }[language]);
};