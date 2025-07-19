"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportedLanguages = exports.translations = void 0;
exports.getTranslations = getTranslations;
var index_js_1 = require("./translations/index.js");
exports.translations = {
    en: index_js_1.en,
    fr: index_js_1.fr,
    de: index_js_1.de,
    ja: index_js_1.ja,
};
function getTranslations(lang) {
    return exports.translations[lang] || exports.translations.en;
}
exports.supportedLanguages = [
    { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
    { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
    { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
    { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
];
