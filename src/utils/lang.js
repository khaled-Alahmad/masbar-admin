import i18n from "@/i18n";

export const languageKeys = ["en", "ar"]; // List of languages
export let currentlyLang = i18n.language || "en";

i18n.on("languageChanged", (lang) => {
    currentlyLang = lang; // Update when the language changes
});