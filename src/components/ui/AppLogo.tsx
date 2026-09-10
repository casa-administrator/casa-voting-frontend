import { useTranslation } from "react-i18next";
import casaLogo from "/casa-logo.png";

interface AppLogoProps {
  showText?: boolean;
  className?: string;
}

export function AppLogo({ showText = false, className = "" }: AppLogoProps) {
  const { t } = useTranslation();

  return (
    <div className={`app-logo ${className}`.trim()}>
      <img src={casaLogo} alt="CASA" className="app-logo-image" />

      {showText && (
        <div className="app-logo-text">
          <strong>{t("common.appName")}</strong>

          <span>{t("common.casa")}</span>
        </div>
      )}
    </div>
  );
}
