import type { ReactNode } from "react";

export function FormField({
  label,
  children,
  help,
  full = false,
}: {
  label: ReactNode;

  children: ReactNode;

  help?: ReactNode;

  full?: boolean;
}) {
  return (
    <label className={full ? "form-field form-field-full" : "form-field"}>
      <span className="form-label">{label}</span>

      {children}

      {help && <small className="form-help">{help}</small>}
    </label>
  );
}
