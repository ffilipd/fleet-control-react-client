import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en/common.json';
import fi from './locales/fi/common.json';
import sv from './locales/sv/common.json';

// Initialize i18next translator
i18n
    .use(initReactI18next)
    .init({
        // debug: true,
        fallbackLng: 'en',
        /** Interpolation let you integrate dynamic values into translations
         * if escapeValue is set to false, the dynamic values will not be escaped and the application will be vulnerable to XXS attacks
        */
        interpolation: {
            escapeValue: false // This should only be set to false if needed! <----------------------
        },
        // select language from the user profile, or default to English
        lng: 'en',
        // recources are the translation files loaded from redux store assigned to their own keys
        resources: {
            en: { translation: en }, // English
            fi: { translation: fi }, // Finnish
            sv: { translation: sv }, // Swedish
        }
    });

export default i18n;
