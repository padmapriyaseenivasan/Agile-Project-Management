import React, { useEffect, useState } from "react";
import api from "./axiosConfig";
import { Badge, Empty, PageHeader, ProgressBar } from "./ui";

const COLUMNS = [["TODO", "To Do"], ["IN_PROGRESS", "In Progress"], ["DONE", "Done"]];

function Group({ title, items }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      {items.length === 0 ? (
        <Empty title="Nothing to show yet" />
      ) : (
        <ul className="list">
          {items.map((i) => (
            <li key={i.id} className="stack">
              <div className="row-between">
                <strong>{i.name}</strong>
                <span className="muted">{i.done} of {i.total} tasks done · {i.percent}%</span>
              </div>
              <ProgressBar value={i.percent} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Progress() {
  const [summary, setSummary] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    Promise.all([api.get("/progress"), api.get("/tasks")])
      .then(([p, t]) => { setSummary(p.data); setTasks(t.data); })
      .catch(() => {});
  }, []);

  if (!summary) return <div className="page"><PageHeader title="Progress" /></div>;

  return (
    <div className="page">
      <PageHeader title="Progress" subtitle="Track tasks, sprints and projects." />

      <div className="card">
        <div className="progress-row big">
          <span>Overall completion</span>
          <strong>{summary.overallPercent}%</strong>
        </div>
        <ProgressBar value={summary.overallPercent} />
      </div>

      <section className="stats">
        {[["Total tasks", summary.totalTasks], ["To Do", summary.todo], ["In Progress", summary.inProgress], ["Done", summary.done]].map(([t, v]) => (
          <div className="stat" key={t}><span>{t}</span><strong>{v}</strong></div>
        ))}
      </section>

      <section className="grid-2">
        <Group title="Project progress" items={summary.projects} />
        <Group title="Sprint progress" items={summary.sprints} />
      </section>

      <h2 className="section-title">Task progress</h2>
      <section className="board">
        {COLUMNS.map(([key, name]) => {
          const col = tasks.filter((t) => t.status === key);
          return (
            <div className="column" key={key}>
              <div className="column-head"><strong>{name}</strong><span className="chip">{col.length}</span></div>
              {col.length === 0 && <p className="muted">No tasks</p>}
              {col.map((t) => (
                <div className="ticket" key={t.id}>
                  <strong>{t.taskName}</strong>
                  <div className="muted">{t.assignedTo?.name || "Unassigned"}</div>
                  <Badge value={t.priority} />
                </div>
              ))}
            </div>
          );
        })}
      </section>
    </div>
  );
}

export default Progress;
