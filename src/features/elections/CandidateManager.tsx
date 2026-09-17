import {
  ImagePlus,
  Pencil,
  Plus,
  Power,
  PowerOff,
  Trash2,
  Upload,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { ChangeEvent, SubmitEventHandler } from "react";
import { useTranslation } from "react-i18next";
import { ApiError } from "../../api/client";
import {
  activateCandidate,
  createCandidate,
  deactivateCandidate,
  deleteCandidate,
  deleteCandidateImage,
  getCandidates,
  updateCandidate,
  uploadCandidateImage,
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

                <th>{t("candidates.from")}</th>

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

                  <td>{candidate.from || "—"}</td>

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

const CANDIDATE_IMAGE_MAX_BYTES = 2 * 1024 * 1024;

const CANDIDATE_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

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

  const [candidateFrom, setCandidateFrom] = useState(candidate?.from ?? "");

  const [description, setDescription] = useState(candidate?.description ?? "");

  const [displayOrder, setDisplayOrder] = useState(
    candidate?.display_order ?? candidateNumber,
  );

  const [isActive, setIsActive] = useState(candidate?.is_active ?? true);

  const [imageFile, setImageFile] = useState<File | null>(null);

  const [imageObjectUrl, setImageObjectUrl] = useState<string | null>(null);

  const [removeExistingImage, setRemoveExistingImage] = useState(false);

  /*
   * If candidate creation succeeds but image upload fails,
   * keep the created candidate ID.
   *
   * Retrying the form will update the same candidate instead
   * of creating a duplicate candidate.
   */
  const [createdCandidateId, setCreatedCandidateId] = useState<string | null>(
    null,
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const previewUrl =
    imageObjectUrl ??
    (removeExistingImage ? null : (candidate?.image_url ?? null));

  useEffect(() => {
    return () => {
      if (imageObjectUrl) {
        URL.revokeObjectURL(imageObjectUrl);
      }
    };
  }, [imageObjectUrl]);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    /*
     * Reset the native file input so the same file
     * can be selected again later if needed.
     */
    event.target.value = "";

    if (!file) {
      return;
    }

    if (!CANDIDATE_IMAGE_TYPES.includes(file.type)) {
      setErrorMessage(t("candidates.imageTypeError"));

      return;
    }

    if (file.size > CANDIDATE_IMAGE_MAX_BYTES) {
      setErrorMessage(t("candidates.imageSizeError"));

      return;
    }

    const objectUrl = URL.createObjectURL(file);

    setImageFile(file);

    setImageObjectUrl(objectUrl);

    setRemoveExistingImage(false);

    setErrorMessage(null);
  }

  function handleRemoveImage() {
    setImageFile(null);

    setImageObjectUrl(null);

    /*
     * Only call the DELETE endpoint if this candidate
     * already had a stored image.
     */
    setRemoveExistingImage(Boolean(candidate?.image_url));

    setErrorMessage(null);
  }

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    setErrorMessage(null);

    try {
      let targetCandidateId = candidate?.id ?? createdCandidateId;

      const candidatePayload = {
        candidate_number: candidateNumber,

        title: title.trim() || null,

        first_name: firstName.trim(),

        last_name: lastName.trim(),

        from: candidateFrom.trim() || null,

        description: description.trim() || null,

        display_order: displayOrder,
      };

      if (targetCandidateId) {
        await updateCandidate(targetCandidateId, candidatePayload);
      } else {
        const created = await createCandidate(electionId, {
          ...candidatePayload,

          is_active: isActive,
        });

        targetCandidateId = created.id;

        setCreatedCandidateId(created.id);
      }

      /*
       * Image actions happen after the candidate
       * itself exists.
       */
      if (imageFile) {
        await uploadCandidateImage(targetCandidateId, imageFile);
      } else if (removeExistingImage && candidate?.image_url) {
        await deleteCandidateImage(targetCandidateId);
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

        <FormField label={t("candidates.from")} full>
          <input
            type="text"
            value={candidateFrom}
            onChange={(event) => setCandidateFrom(event.target.value)}
          />
        </FormField>

        <FormField label={t("candidates.descriptionLabel")} full>
          <textarea
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </FormField>

        <div className="form-field form-field-full">
          <span className="form-label">{t("candidates.candidatePhoto")}</span>

          <div className="candidate-image-editor">
            <div className="candidate-image-preview">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt={
                    candidate
                      ? candidateName(candidate)
                      : t("candidates.candidatePhoto")
                  }
                />
              ) : (
                <div className="candidate-image-placeholder">
                  <ImagePlus size={28} strokeWidth={1.7} />

                  <span>{t("candidates.noPhoto")}</span>
                </div>
              )}
            </div>

            <div className="candidate-image-controls">
              <label className="candidate-image-upload">
                <Upload size={15} />

                <span>
                  {previewUrl
                    ? t("candidates.replacePhoto")
                    : t("candidates.choosePhoto")}
                </span>

                <input
                  className="candidate-image-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                />
              </label>

              {previewUrl && (
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={handleRemoveImage}
                >
                  <Trash2 size={14} />

                  {t("candidates.removePhoto")}
                </Button>
              )}

              <small className="candidate-image-help">
                {t("candidates.imageHelp")}
              </small>
            </div>
          </div>
        </div>

        {!candidate && !createdCandidateId && (
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
        <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          {t("common.cancel")}
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? t("candidates.saving")
            : candidate || createdCandidateId
              ? t("candidates.updateCandidate")
              : t("candidates.addCandidate")}
        </Button>
      </div>
    </form>
  );
}

function candidateName(candidate: Candidate) {
  return [candidate.title, candidate.last_name, candidate.first_name]
    .filter(Boolean)
    .join(" ");
}
