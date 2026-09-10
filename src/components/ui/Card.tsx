import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;

  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return <section className={`ui-card ${className}`}>{children}</section>;
}

export function CardHeader({
  title,
  description,
  action,
}: {
  title: ReactNode;

  description?: ReactNode;

  action?: ReactNode;
}) {
  return (
    <div className="ui-card-header">
      <div className="ui-card-header-copy">
        <h2>{title}</h2>

        {description && <p>{description}</p>}
      </div>

      {action && <div className="ui-card-header-action">{action}</div>}
    </div>
  );
}

export function CardBody({ children }: { children: ReactNode }) {
  return <div className="ui-card-body">{children}</div>;
}
