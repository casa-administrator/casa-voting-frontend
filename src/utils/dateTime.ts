export type AppLanguage =
  | "km"
  | "en";


export function normalizeLanguage(
  language:
    string,
): AppLanguage {
  return language.startsWith(
    "en",
  )
    ? "en"
    : "km";
}


export function formatDateTime(
  value:
    string |
    Date,
  language:
    AppLanguage,
) {
  const date =
    value instanceof Date
      ? value
      : new Date(
          value,
        );


  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "—";
  }


  return new Intl.DateTimeFormat(
    language === "km"
      ? "km-KH"
      : "en-US",
    {
      year:
        "numeric",

      month:
        "short",

      day:
        "numeric",

      hour:
        "numeric",

      minute:
        "2-digit",
    },
  ).format(
    date,
  );
}