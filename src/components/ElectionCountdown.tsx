import { Clock3 } from "lucide-react";

import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

interface ElectionCountdownProps {
  endAt: string | null;
  onExpire?: () => void;
}

interface RemainingTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

function calculateRemaining(endAt: string | null): RemainingTime {
  if (!endAt) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      expired: true,
    };
  }

  const difference = new Date(endAt).getTime() - Date.now();

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      expired: true,
    };
  }

  const totalSeconds = Math.floor(difference / 1000);

  const days = Math.floor(totalSeconds / 86400);

  const hours = Math.floor((totalSeconds % 86400) / 3600);

  const minutes = Math.floor((totalSeconds % 3600) / 60);

  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    expired: false,
  };
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function ElectionCountdown({ endAt, onExpire }: ElectionCountdownProps) {
  const { t } = useTranslation();

  const [remaining, setRemaining] = useState<RemainingTime>(() =>
    calculateRemaining(endAt),
  );

  useEffect(() => {
    let expirationHandled = false;

    function update() {
      const next = calculateRemaining(endAt);

      setRemaining(next);

      if (next.expired && !expirationHandled) {
        expirationHandled = true;

        onExpire?.();
      }
    }

    update();

    const interval = window.setInterval(update, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [endAt, onExpire]);

  if (!endAt) {
    return null;
  }

  if (remaining.expired) {
    return (
      <div className="election-countdown election-countdown-ended">
        <Clock3 size={18} />

        <div>
          <span>{t("countdown.status")}</span>

          <strong>{t("countdown.ended")}</strong>
        </div>
      </div>
    );
  }

  return (
    <div className="election-countdown">
      <Clock3 size={18} />

      <div>
        <span>{t("countdown.remaining")}</span>

        <strong>
          {remaining.days > 0 && `${remaining.days}${t("countdown.dayShort")} `}
          {pad(remaining.hours)}:{pad(remaining.minutes)}:
          {pad(remaining.seconds)}
        </strong>
      </div>
    </div>
  );
}
