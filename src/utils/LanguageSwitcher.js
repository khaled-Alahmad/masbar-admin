"use client";

import { Select, SelectItem } from "@nextui-org/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const languages = [
        { code: "en", name: "English", dir: "ltr" },
        { code: "ar", name: "العربية", dir: "rtl" },
        { code: "tr", name: "Türkçe", dir: "ltr" },
    ];

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        const selectedLang = languages.find((l) => l.code === lang);
        document.documentElement.dir = selectedLang?.dir || "ltr"; // Change direction dynamically
    };

    // Set direction on first load
    useEffect(() => {
        const currentLang = i18n.language || "en";
        const selectedLang = languages.find((l) => l.code === currentLang);
        document.documentElement.dir = selectedLang?.dir || "ltr";
    }, [i18n.language]);

    return (
        <Select
            // label="Language"
            selectedKeys={[i18n.language]}
            onChange={(e) => changeLanguage(e.target.value)}
        >
            {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                </SelectItem>
            ))}
        </Select>
    );
};

export default LanguageSwitcher;
