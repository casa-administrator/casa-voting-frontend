import { Plus, Pencil, Power, PowerOff, Trash2 } from "lucide-react";

import { useCallback, useEffect, useState } from "react";

import type { SubmitEventHandler } from "react";

import { useTranslation } from "react-i18next";

import { ApiError } from "../../api/client";

import {
  activateCandidate,
  createCandidate,
  deactivateCandidate,
  deleteCandidate,
  getCandidates,
  updateCandidate,
} from "../../api/candidates";

import { useAuth } from "../../auth/useAuth";

import { Button } from "../../components/ui/Button";

import { Card, CardBody, CardHeader } from "../../components/ui/Card";

import { DataTable } from "../../components/ui/DataTable";

import { EmptyState } from "../../components/ui/EmptyState";

import { FormField } from "../../components/ui/FormField";

import { StatusBadge } from "../../components/ui/StatusBadge";

import type { Candidate } from "../../types/candidates";

import type { ElectionStatus } from "../../types/elections";

interface CandidateManagerProps {
  electionId: string;

  electionStatus: ElectionStatus;

  onChanged?: () => void | Promise<void>;
}

export function CandidateManager({
  electionId,
  electionStatus,
  onChanged,
}: CandidateManagerProps) {
  const { t } = useTranslation();

  const { hasPermission } = useAuth();

  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);

  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(
    null,
  );

  const editable = electionStatus === "draft" || electionStatus === "scheduled";

  const loadCandidates = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await getCandidates(electionId);

      setCandidates(response.items);

      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError ? error.message : t("candidates.loadError"),
      );
    } finally {
      setIsLoading(false);
    }
  }, [electionId, t]);

  useEffect(() => {
    void loadCandidates();
  }, [loadCandidates]);

  async function afterChange() {
    await loadCandidates();

    await onChanged?.();
  }

  function openCreate() {
    setEditingCandidate(null);

    setFormOpen(true);
  }

  function openEdit(candidate: Candidate) {
    setEditingCandidate(candidate);

    setFormOpen(true);
  }

  function closeForm() {
    setEditingCandidate(null);

    setFormOpen(false);
  }

  async function handleActivate(candidate: Candidate) {
    try {
      await activateCandidate(candidate.id);

      await afterChange();
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError ? error.message : t("candidates.actionError"),
      );
    }
  }

  async function handleDeactivate(candidate: Candidate) {
    try {
      await deactivateCandidate(candidate.id);

      await afterChange();
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError ? error.message : t("candidates.actionError"),
      );
    }
  }

  async function handleDelete(candidate: Candidate) {
    const confirmed = window.confirm(
      t("candidates.deleteConfirm", {
        number: candidate.candidate_number,

        name: candidateName(candidate),
      }),
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteCandidate(candidate.id);

      await afterChange();
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError ? error.message : t("candidates.deleteError"),
      );
    }
  }

  return (
    <Card>
      <CardHeader
        title={t("candidates.title")}
        description={t(
          editable ? "candidates.description" : "candidates.lockedDescription",
        )}
        action={
          editable && hasPermission("candidates.create") ? (
            <Button onClick={openCreate}>
              <Plus size={16} />

              {t("candidates.addCandidate")}
            </Button>
          ) : undefined
        }
      />

      <CardBody>
        {errorMessage && (
          <div className="alert alert-error candidate-message" role="alert">
            {errorMessage}
          </div>
        )}

        {formOpen && (
          <CandidateForm
            electionId={electionId}
            candidate={editingCandidate}
            onCancel={closeForm}
            onSaved={async () => {
              closeForm();

              await afterChange();
            }}
          />
        )}

        {isLoading ? (
          <div className="candidate-loading">{t("candidates.loading")}</div>
        ) : candidates.length === 0 ? (
          <EmptyState
            title={t("candidates.noCandidates")}
            description={t("candidates.noCandidatesDescription")}
            action={
              editable && hasPermission("candidates.create") ? (
                <Button onClick={openCreate}>
                  <Plus size={16} />

                  {t("candidates.addCandidate")}
                </Button>
              ) : undefined
            }
          />
        ) : (
          <DataTable>
            <thead>
              <tr>
                <th>{t("candidates.number")}</th>

                <th>{t("candidates.candidate")}</th>

                <th>{t("candidates.position")}</th>

                <th>{t("candidates.displayOrder")}</th>

                <th>{t("common.status")}</th>

                <th>{t("common.actions")}</th>
              </tr>
            </thead>

            <tbody>
              {candidates.map((candidate) => (
                <tr key={candidate.id}>
                  <td>
                    <strong>#{candidate.candidate_number}</strong>
                  </td>

                  <td>
                    <div className="candidate-table-person">
                      {candidate.image_url ? (
                        <img
                          src={candidate.image_url}
                          alt={candidateName(candidate)}
                        />
                      ) : (
                        <div className="candidate-table-avatar">
                          {candidate.candidate_number}
                        </div>
                      )}

                      <div>
                        <strong>{candidateName(candidate)}</strong>

                        {candidate.description && (
                          <span>{candidate.description}</span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td>{candidate.position || "—"}</td>

                  <td>{candidate.display_order}</td>

                  <td>
                    <StatusBadge
                      tone={candidate.is_active ? "success" : "neutral"}
                    >
                      {candidate.is_active
                        ? t("common.active")
                        : t("common.inactive")}
                    </StatusBadge>
                  </td>

                  <td>
                    {editable && (
                      <div className="candidate-actions">
                        {hasPermission("candidates.update") && (
                          <>
                            <button
                              type="button"
                              className="icon-action"
                              title={t("common.edit")}
                              onClick={() => openEdit(candidate)}
                            >
                              <Pencil size={15} />
                            </button>

                            {candidate.is_active ? (
                              <button
                                type="button"
                                className="icon-action"
                                title={t("candidates.deactivate")}
                                onClick={() => void handleDeactivate(candidate)}
                              >
                                <PowerOff size={15} />
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="icon-action"
                                title={t("candidates.activate")}
                                onClick={() => void handleActivate(candidate)}
                              >
                                <Power size={15} />
                              </button>
                            )}
                          </>
                        )}

                        {hasPermission("candidates.delete") && (
                          <button
                            type="button"
                            className="icon-action icon-action-danger"
                            title={t("common.delete")}
                            onClick={() => void handleDelete(candidate)}
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        )}
      </CardBody>
    </Card>
  );
}

function CandidateForm({
  electionId,
  candidate,
  onCancel,
  onSaved,
}: {
  electionId: string;

  candidate: Candidate | null;

  onCancel: () => void;

  onSaved: () => Promise<void>;
}) {
  const { t } = useTranslation();

  const [candidateNumber, setCandidateNumber] = useState(
    candidate?.candidate_number ?? 1,
  );

  const [title, setTitle] = useState(candidate?.title ?? "");

  const [firstName, setFirstName] = useState(candidate?.first_name ?? "");

  const [lastName, setLastName] = useState(candidate?.last_name ?? "");

  const [position, setPosition] = useState(candidate?.position ?? "");

  const [description, setDescription] = useState(candidate?.description ?? "");

  const [imageUrl, setImageUrl] = useState(candidate?.image_url ?? "");

  const [displayOrder, setDisplayOrder] = useState(
    candidate?.display_order ?? candidateNumber,
  );

  const [isActive, setIsActive] = useState(candidate?.is_active ?? true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    setErrorMessage(null);

    try {
      if (candidate) {
        await updateCandidate(candidate.id, {
          candidate_number: candidateNumber,

          title: title.trim() || null,

          first_name: firstName.trim(),

          last_name: lastName.trim(),

          position: position.trim() || null,

          description: description.trim() || null,

          image_url: imageUrl.trim() || null,

          display_order: displayOrder,
        });
      } else {
        await createCandidate(electionId, {
          candidate_number: candidateNumber,

          title: title.trim() || null,

          first_name: firstName.trim(),

          last_name: lastName.trim(),

          position: position.trim() || null,

          description: description.trim() || null,

          image_url: imageUrl.trim() || null,

          display_order: displayOrder,

          is_active: isActive,
        });
      }

      await onSaved();
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError ? error.message : t("candidates.saveError"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="candidate-form" onSubmit={handleSubmit}>
      <div className="candidate-form-header">
        <div>
          <h3>
            {candidate
              ? t("candidates.editCandidate")
              : t("candidates.addCandidate")}
          </h3>

          <p>{t("candidates.formDescription")}</p>
        </div>
      </div>

      <div className="form-grid">
        <FormField label={t("candidates.number")}>
          <input
            type="number"
            min={1}
            max={10000}
            required
            value={candidateNumber}
            onChange={(event) => setCandidateNumber(Number(event.target.value))}
          />
        </FormField>

        <FormField label={t("candidates.displayOrder")}>
          <input
            type="number"
            min={1}
            max={10000}
            required
            value={displayOrder}
            onChange={(event) => setDisplayOrder(Number(event.target.value))}
          />
        </FormField>

        <FormField label={t("candidates.nameTitle")}>
          <input
            type="text"
            value={title}
            placeholder={t("candidates.titlePlaceholder")}
            onChange={(event) => setTitle(event.target.value)}
          />
        </FormField>

        <div />

        <FormField label={t("candidates.firstName")}>
          <input
            type="text"
            required
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
          />
        </FormField>

        <FormField label={t("candidates.lastName")}>
          <input
            type="text"
            required
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
          />
        </FormField>

        <FormField label={t("candidates.position")} full>
          <input
            type="text"
            value={position}
            onChange={(event) => setPosition(event.target.value)}
          />
        </FormField>

        <FormField label={t("candidates.descriptionLabel")} full>
          <textarea
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </FormField>

        <FormField label={t("candidates.imageUrl")} full>
          <input
            type="url"
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
          />
        </FormField>

        {!candidate && (
          <label className="candidate-active-option">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(event) => setIsActive(event.target.checked)}
            />

            <div>
              <strong>{t("candidates.activeCandidate")}</strong>

              <span>{t("candidates.activeCandidateDescription")}</span>
            </div>
          </label>
        )}
      </div>

      {errorMessage && (
        <div className="alert alert-error" role="alert">
          {errorMessage}
        </div>
      )}

      <div className="form-actions">
        <Button variant="secondary" onClick={onCancel}>
          {t("common.cancel")}
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? t("candidates.saving")
            : candidate
              ? t("candidates.updateCandidate")
              : t("candidates.addCandidate")}
        </Button>
      </div>
    </form>
  );
}

function candidateName(candidate: Candidate) {
  return [candidate.title, candidate.first_name, candidate.last_name]
    .filter(Boolean)
    .join(" ");
}
