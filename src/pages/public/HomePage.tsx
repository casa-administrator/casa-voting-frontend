import {
  ArrowRight,
  CalendarClock,
  ShieldCheck,
  Users,
  Vote,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";

import { useTranslation } from "react-i18next";

import { ApiError } from "../../api/client";

import { getPublicElections, initializePublicDevice } from "../../api/public";

import { EmptyState } from "../../components/ui/EmptyState";

import { StatusBadge } from "../../components/ui/StatusBadge";

import type { PublicElection } from "../../types/public";

import { formatDateTime, normalizeLanguage } from "../../utils/dateTime";

export function HomePage() {
  const { t, i18n } = useTranslation();

  const [elections, setElections] = useState<PublicElection[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const language = normalizeLanguage(i18n.language);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        /*
         * Idempotent device initialization.
         * Creates/retains the public device cookie.
         */
        await initializePublicDevice();

        const response = await getPublicElections();

        if (!active) {
          return;
        }

        setElections(response);

        setErrorMessage(null);
      } catch (error) {
        if (!active) {
          return;
        }

        setErrorMessage(
          error instanceof ApiError ? error.message : t("home.loadError"),
        );
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [t]);

  const liveElections = useMemo(
    () => elections.filter((election) => election.status === "live"),
    [elections],
  );

  return (
    <div className="public-home">
      <section className="public-hero">
        <div className="public-hero-copy">
          <span className="public-hero-eyebrow">
            <ShieldCheck size={16} />

            {t("home.eyebrow")}
          </span>

          <h1>{t("home.title")}</h1>

          <p>{t("home.description")}</p>
        </div>

        <div className="public-hero-mark">
          <Vote size={42} />

          <strong>CASA</strong>

          <span>{t("home.secureVoting")}</span>
        </div>
      </section>

      <section className="public-election-section">
        <div className="public-section-heading">
          <div>
            <span>{t("home.voting")}</span>

            <h2>{t("home.activeElections")}</h2>
          </div>

          {!isLoading && liveElections.length > 0 && (
            <span className="public-election-count">
              {t("home.activeCount", {
                count: liveElections.length,
              })}
            </span>
          )}
        </div>

        {errorMessage && (
          <div className="alert alert-error" role="alert">
            {errorMessage}
          </div>
        )}

        {isLoading ? (
          <div className="public-election-loading">{t("home.loading")}</div>
        ) : liveElections.length === 0 ? (
          <EmptyState
            title={t("home.noActiveElection")}
            description={t("home.noActiveDescription")}
          />
        ) : (
          <div className="public-election-grid">
            {liveElections.map((election) => (
              <ElectionCard
                key={election.id}
                election={election}
                language={language}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ElectionCard({
  election,
  language,
}: {
  election: PublicElection;

  language: "km" | "en";
}) {
  const { t } = useTranslation();

  return (
    <article className="public-election-card">
      <div className="public-election-card-top">
        <StatusBadge tone="success">{t("common.live")}</StatusBadge>

        {election.end_at && (
          <div className="public-election-end">
            <CalendarClock size={14} />

            <span>
              {t("home.ends", {
                date: formatDateTime(election.end_at, language),
              })}
            </span>
          </div>
        )}
      </div>

      <div className="public-election-card-content">
        <h3>{election.title}</h3>

        <p>{election.description || t("home.defaultElectionDescription")}</p>
      </div>

      <div className="public-election-meta">
        {typeof election.expected_voters === "number" && (
          <span>
            <Users size={14} />

            {t("home.expectedVoters", {
              count: election.expected_voters,
            })}
          </span>
        )}

        <span>
          <Vote size={14} />

          {formatSelectionRule(
            election.voting_rules.min_selections,

            election.voting_rules.max_selections,

            t,
          )}
        </span>
      </div>

      <div className="public-election-actions">
        <Link
          to={`/elections/${election.id}/vote`}
          className="public-vote-button"
        >
          {t("home.voteNow")}

          <ArrowRight size={16} />
        </Link>

        {election.result_visibility === "live" && (
          <Link
            to={`/elections/${election.id}/results`}
            className="public-results-button"
          >
            {t("home.viewResults")}
          </Link>
        )}
      </div>
    </article>
  );
}

function formatSelectionRule(
  minimum: number,
  maximum: number,
  t: ReturnType<typeof useTranslation>["t"],
) {
  if (minimum === maximum) {
    return t("home.selectExact", {
      count: minimum,
    });
  }

  return t("home.selectRange", {
    min: minimum,

    max: maximum,
  });
}
