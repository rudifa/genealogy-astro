import { en, fr, de, ja } from "./translations/index";
export const translations = {
    en,
    fr,
    de,
    ja,
};
export function getTranslations(lang) {
    return translations[lang] || translations.en;
}
export const supportedLanguages = [
    { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
    { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
    { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
    { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
];
