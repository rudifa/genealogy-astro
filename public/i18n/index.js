import { fr, de, it, rm, en, ja, zg } from "./translations/index";
export const translations = {
    fr,
    de,
    it,
    rm,
    en,
    ja,
    zg,
};
export function getTranslations(lang) {
    return translations[lang] || translations.en;
}
export const supportedLanguages = [
    { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
    { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
    { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
    { code: "rm", name: "Rhaeto-Romance", nativeName: "Rumantsch", flag: "🇨🇭" },
    { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
    { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
    { code: "zg", name: "Burzum Nazg", nativeName: "Burzum Nazg", flag: "👁️" },
];
