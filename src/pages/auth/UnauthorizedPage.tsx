import { Link } from "react-router-dom";

import { useTranslation } from "react-i18next";

export function UnauthorizedPage() {
  const { t } = useTranslation();

  return (
    <div className="message-page">
      <h1>{t("system.accessDenied")}</h1>

      <p>{t("system.accessDeniedDescription")}</p>

      <Link to="/" className="ui-button ui-button-primary ui-button-md">
        {t("system.returnHome")}
      </Link>
    </div>
  );
}
