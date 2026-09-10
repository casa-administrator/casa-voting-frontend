import { useState } from "react";

import type { SubmitEventHandler } from "react";

import { useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";

import { ApiError } from "../../api/client";

import { createElection } from "../../api/elections";

import { Button, ButtonLink } from "../../components/ui/Button";

import { Card, CardBody, CardHeader } from "../../components/ui/Card";

import { FormField } from "../../components/ui/FormField";

import { PageHeader } from "../../components/ui/PageHeader";

import type { ResultVisibility } from "../../types/elections";

export function CreateElectionPage() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [expectedVoters, setExpectedVoters] = useState(345);

  const [minSelections, setMinSelections] = useState(1);

  const [maxSelections, setMaxSelections] = useState(1);

  const [allowBlankBallot, setAllowBlankBallot] = useState(false);

  const [resultVisibility, setResultVisibility] =
    useState<ResultVisibility>("after_close");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setErrorMessage(null);

    if (maxSelections < minSelections) {
      setErrorMessage(t("elections.invalidSelectionRange"));

      return;
    }

    if (!title.trim()) {
      setErrorMessage(t("elections.titleRequired"));

      return;
    }

    setIsSubmitting(true);

    try {
      const election = await createElection({
        title: title.trim(),

        description: description.trim() || null,

        expected_voters: expectedVoters,

        voting_rules: {
          min_selections: minSelections,

          max_selections: maxSelections,

          one_vote_per_device: true,

          allow_blank_ballot: allowBlankBallot,
        },

        result_visibility: resultVisibility,
      });

      navigate(`/admin/elections/${election.id}`, {
        replace: true,
      });
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError ? error.message : t("elections.createError"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow={t("elections.management")}
        title={t("elections.createElection")}
        description={t("elections.createDescription")}
        actions={
          <ButtonLink to="/admin/elections" variant="secondary">
            {t("common.cancel")}
          </ButtonLink>
        }
      />

      <form onSubmit={handleSubmit} className="create-election-form">
        <Card>
          <CardHeader
            title={t("elections.generalInformation")}
            description={t("elections.generalInformationDescription")}
          />

          <CardBody>
            <div className="form-grid">
              <FormField label={t("elections.electionTitle")} full>
                <input
                  type="text"
                  required
                  minLength={2}
                  maxLength={200}
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder={t("elections.electionTitlePlaceholder")}
                />
              </FormField>

              <FormField label={t("elections.electionDescription")} full>
                <textarea
                  rows={4}
                  maxLength={3000}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder={t("elections.electionDescriptionPlaceholder")}
                />
              </FormField>

              <FormField label={t("elections.expectedVoters")}>
                <input
                  type="number"
                  required
                  min={1}
                  max={1000000}
                  value={expectedVoters}
                  onChange={(event) =>
                    setExpectedVoters(Number(event.target.value))
                  }
                />
              </FormField>

              <FormField label={t("elections.resultVisibility")}>
                <select
                  value={resultVisibility}
                  onChange={(event) =>
                    setResultVisibility(event.target.value as ResultVisibility)
                  }
                >
                  <option value="after_close">
                    {t("elections.visibilityAfterClose")}
                  </option>

                  <option value="live">{t("elections.visibilityLive")}</option>

                  <option value="hidden">
                    {t("elections.visibilityHidden")}
                  </option>
                </select>
              </FormField>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title={t("elections.votingRules")}
            description={t("elections.votingRulesDescription")}
          />

          <CardBody>
            <div className="form-grid">
              <FormField label={t("elections.minimumSelections")}>
                <input
                  type="number"
                  required
                  min={1}
                  max={100}
                  value={minSelections}
                  onChange={(event) =>
                    setMinSelections(Number(event.target.value))
                  }
                />
              </FormField>

              <FormField label={t("elections.maximumSelections")}>
                <input
                  type="number"
                  required
                  min={1}
                  max={100}
                  value={maxSelections}
                  onChange={(event) =>
                    setMaxSelections(Number(event.target.value))
                  }
                />
              </FormField>

              <div className="election-rule-card">
                <input type="checkbox" checked disabled />

                <div>
                  <strong>{t("elections.oneVotePerDevice")}</strong>

                  <span>{t("elections.oneVotePerDeviceDescription")}</span>
                </div>
              </div>

              <label className="election-rule-card">
                <input
                  type="checkbox"
                  checked={allowBlankBallot}
                  onChange={(event) =>
                    setAllowBlankBallot(event.target.checked)
                  }
                />

                <div>
                  <strong>{t("elections.allowBlankBallot")}</strong>

                  <span>{t("elections.allowBlankBallotDescription")}</span>
                </div>
              </label>
            </div>
          </CardBody>
        </Card>

        {errorMessage && (
          <div className="alert alert-error" role="alert">
            {errorMessage}
          </div>
        )}

        <div className="form-actions">
          <ButtonLink to="/admin/elections" variant="secondary">
            {t("common.cancel")}
          </ButtonLink>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? t("elections.creating")
              : t("elections.createElection")}
          </Button>
        </div>
      </form>
    </div>
  );
}
