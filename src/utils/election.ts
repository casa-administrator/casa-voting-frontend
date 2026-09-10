import type {
  TFunction,
} from "i18next";

import type {
  ResultVisibility,
} from "../types/elections";


export function formatElectionStatus(
  status:
    string,
  t:
    TFunction,
) {
  switch (
    status
  ) {
    case "draft":
      return t(
        "common.draft",
      );

    case "scheduled":
      return t(
        "common.scheduled",
      );

    case "live":
      return t(
        "common.live",
      );

    case "closed":
      return t(
        "common.closed",
      );

    case "archived":
      return t(
        "common.archived",
      );

    default:
      return status;
  }
}


export function electionStatusTone(
  status:
    string,
):
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral" {
  switch (
    status
  ) {
    case "live":
      return "success";

    case "scheduled":
      return "info";

    case "draft":
      return "warning";

    case "closed":
    case "archived":
    default:
      return "neutral";
  }
}


export function formatResultVisibility(
  visibility:
    ResultVisibility,
  t:
    TFunction,
) {
  switch (
    visibility
  ) {
    case "live":
      return t(
        "elections.visibilityLive",
      );

    case "after_close":
      return t(
        "elections.visibilityAfterClose",
      );

    case "hidden":
      return t(
        "elections.visibilityHidden",
      );
  }
}


export function formatVotingRule(
  minimum:
    number,
  maximum:
    number,
  t:
    TFunction,
) {
  if (
    minimum ===
    maximum
  ) {
    return t(
      "elections.selectExact",
      {
        count:
          minimum,
      },
    );
  }


  return t(
    "elections.selectRange",
    {
      min:
        minimum,

      max:
        maximum,
    },
  );
}

export function formatStartType(
  value:
    string |
    null |
    undefined,
  t:
    TFunction,
) {
  switch (value) {
    case "manual":
      return t(
        "elections.startManual",
      );

    case "automatic_timer":
      return t(
        "elections.startAutomatic",
      );

    default:
      return "—";
  }
}


export function formatCloseType(
  value:
    string |
    null |
    undefined,
  t:
    TFunction,
) {
  switch (value) {
    case "manual":
      return t(
        "elections.closeManual",
      );

    case "automatic_timer":
      return t(
        "elections.closeAutomatic",
      );

    case "emergency":
      return t(
        "elections.closeEmergency",
      );

    default:
      return "—";
  }
}