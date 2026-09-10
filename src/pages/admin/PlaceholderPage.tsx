import { useTranslation } from "react-i18next";

import { PageHeader } from "../../components/ui/PageHeader";

export function PlaceholderPage({ titleKey }: { titleKey: string }) {
  const { t } = useTranslation();

  return (
    <div>
      <PageHeader eyebrow={t("common.administration")} title={t(titleKey)} />
    </div>
  );
}
