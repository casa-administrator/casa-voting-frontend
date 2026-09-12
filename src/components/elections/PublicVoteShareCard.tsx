import { Check, Copy, Download, ExternalLink, Share2 } from "lucide-react";

import { useRef, useState } from "react";

import { QRCodeSVG } from "qrcode.react";

import { useTranslation } from "react-i18next";

import casaLogo from "../../../public/casa-logo.png";

import { Button } from "../ui/Button";

import { Card, CardBody, CardHeader } from "../ui/Card";

interface PublicVoteShareCardProps {
  electionId: string;
  electionStatus: string;
}

export function PublicVoteShareCard({
  electionId,
  electionStatus,
}: PublicVoteShareCardProps) {
  const { t } = useTranslation();

  const qrContainerRef = useRef<HTMLDivElement>(null);

  const [copied, setCopied] = useState(false);

  const publicVoteUrl = `${window.location.origin}/elections/${electionId}/vote`;

  const canShare = electionStatus === "scheduled" || electionStatus === "live";

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(publicVoteUrl);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      window.alert(t("publicShare.copyError"));
    }
  }

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t("publicShare.shareTitle"),

          text: t("publicShare.shareText"),

          url: publicVoteUrl,
        });

        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
      }
    }

    await handleCopy();
  }

  function handleDownloadQr() {
    const svg = qrContainerRef.current?.querySelector("svg");

    if (!svg) {
      return;
    }

    const serialized = new XMLSerializer().serializeToString(svg);

    const blob = new Blob([serialized], {
      type: "image/svg+xml;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const anchor = document.createElement("a");

    anchor.href = url;

    anchor.download = `casa-vote-${electionId}-qr.svg`;

    document.body.appendChild(anchor);

    anchor.click();

    anchor.remove();

    URL.revokeObjectURL(url);
  }

  if (!canShare) {
    return null;
  }

  return (
    <Card>
      <CardHeader
        title={t("publicShare.title")}
        description={t(
          electionStatus === "live"
            ? "publicShare.liveDescription"
            : "publicShare.scheduledDescription",
        )}
      />

      <CardBody>
        <div className="public-share-layout">
          {/* =========================
              LINK + ACTIONS
              ========================= */}

          <div className="public-share-info">
            <div>
              <span className="public-share-label">
                {t("publicShare.publicLink")}
              </span>

              <div className="public-share-url">
                <span>{publicVoteUrl}</span>

                <button
                  type="button"
                  className="icon-action"
                  onClick={() => void handleCopy()}
                  title={t("publicShare.copyLink")}
                >
                  {copied ? <Check size={17} /> : <Copy size={17} />}
                </button>
              </div>
            </div>

            <div className="public-share-actions">
              <Button
                type="button"
                variant="secondary"
                onClick={() => void handleCopy()}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}

                {copied ? t("publicShare.copied") : t("publicShare.copyLink")}
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={() => void handleShare()}
              >
                <Share2 size={16} />

                {t("publicShare.share")}
              </Button>

              <a
                href={publicVoteUrl}
                target="_blank"
                rel="noreferrer"
                className="button button-secondary"
              >
                <ExternalLink size={16} />

                {t("publicShare.open")}
              </a>
            </div>
          </div>

          {/* =========================
              QR CODE
              ========================= */}

          <div className="public-share-qr">
            <div ref={qrContainerRef} className="public-share-qr-code">
              <QRCodeSVG
                value={publicVoteUrl}
                size={200}
                level="H"
                includeMargin
                imageSettings={{
                  src: casaLogo,
                  width: 40,
                  height: 40,
                  excavate: true,
                }}
              />
            </div>

            <Button
              type="button"
              variant="secondary"
              onClick={handleDownloadQr}
            >
              <Download size={16} />

              {t("publicShare.downloadQr")}
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
