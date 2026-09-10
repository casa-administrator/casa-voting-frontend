import type { ReactNode } from "react";

export function DataTable({ children }: { children: ReactNode }) {
  return (
    <div className="data-table-card">
      <div className="data-table-scroll">
        <table className="data-table">{children}</table>
      </div>
    </div>
  );
}
