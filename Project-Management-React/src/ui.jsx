import React from "react";

const LABELS = {
  TODO: "To Do", IN_PROGRESS: "In Progress", DONE: "Done",
  PLANNED: "Planned", ACTIVE: "Active", COMPLETED: "Completed",
  LOW: "Low", MEDIUM: "Medium", HIGH: "High",
};

export const label = (v) => LABELS[v] || v;
export const pct = (done, total) => (total ? Math.round((done / total) * 100) : 0);

export function Badge({ value }) {
  if (!value) return null;
  return <span className={`badge ${String(value).toLowerCase()}`}>{label(value)}</span>;
}

export function PageHeader({ title, subtitle, children }) {
  return (
    <header className="page-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children}
    </header>
  );
}

export function Empty({ title, text }) {
  return (
    <div className="empty">
      <strong>{title}</strong>
      {text && <p>{text}</p>}
    </div>
  );
}

export function ProgressBar({ value }) {
  return (
    <div className="bar" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div style={{ width: `${value}%` }} />
    </div>
  );
}
