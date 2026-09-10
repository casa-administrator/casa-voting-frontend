import { useTranslation } from "react-i18next";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const language = i18n.language.startsWith("en") ? "en" : "km";

  async function change(next: "km" | "en") {
    await i18n.changeLanguage(next);
  }

  return (
    <div className="language-switcher">
      <button
        type="button"
        className={
          language === "km" ? "language-button active" : "language-button"
        }
        onClick={() => void change("km")}
      >
        ខ្មែរ
      </button>

      <span>|</span>

      <button
        type="button"
        className={
          language === "en" ? "language-button active" : "language-button"
        }
        onClick={() => void change("en")}
      >
        EN
      </button>
    </div>
  );
}
