import i18n from "i18next";

import {
  initReactI18next,
} from "react-i18next";

import en from "./en";
import km from "./km";


const STORAGE_KEY =
  "casa_voting_language";


function initialLanguage():
  "km" | "en" {
  const stored =
    window.localStorage.getItem(
      STORAGE_KEY,
    );

  return stored ===
    "en"
    ? "en"
    : "km";
}


const language =
  initialLanguage();


void i18n
  .use(
    initReactI18next,
  )
  .init({
    resources: {
      km,
      en,
    },

    lng:
      language,

    fallbackLng:
      "km",

    interpolation: {
      escapeValue:
        false,
    },
  });


document.documentElement.lang =
  language;


i18n.on(
  "languageChanged",
  (
    value,
  ) => {
    const next =
      value.startsWith(
        "en",
      )
        ? "en"
        : "km";

    document.documentElement.lang =
      next;

    window.localStorage.setItem(
      STORAGE_KEY,
      next,
    );
  },
);


export default i18n;