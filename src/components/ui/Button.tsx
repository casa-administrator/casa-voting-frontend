import type { ButtonHTMLAttributes, ReactNode } from "react";

import { Link } from "react-router-dom";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

interface BaseProps {
  children: ReactNode;

  variant?: ButtonVariant;

  size?: "sm" | "md";
}

type ButtonProps = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps>;

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`ui-button ui-button-${variant} ui-button-${size} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

interface ButtonLinkProps extends BaseProps {
  to: string;

  className?: string;
}

export function ButtonLink({
  children,
  to,
  variant = "primary",
  size = "md",
  className = "",
}: ButtonLinkProps) {
  return (
    <Link
      to={to}
      className={`ui-button ui-button-${variant} ui-button-${size} ${className}`}
    >
      {children}
    </Link>
  );
}
