import React, { useEffect, useState } from "react";
import api from "./axiosConfig";
import { Badge, Empty, PageHeader, ProgressBar, pct } from "./ui";

function Dashboard({ user, go }) {
  const [data, setData] = useState({ projects: [], sprints: [], tasks: [], progress: null });

  useEffect(() => {
    Promise.all([api.get("/projects"), api.get("/sprints"), api.get("/tasks"), api.get("/progress")])
      .then(([p, s, t, g]) => setData({ projects: p.data, sprints: s.data, tasks: t.data, progress: g.data }))
      .catch(() => {});
  }, []);

  const { projects, sprints, tasks, progress } = data;
  const active = sprints.filter((s) => s.status === "ACTIVE");
  const current = active[0];
  const currentStats = progress?.sprints.find((s) => s.id === current?.id);
  const latest = [...tasks].reverse().slice(0, 5);

  const stats = [
    ["Projects", projects.length, "project"],
    ["Active sprints", active.length, "sprint"],
    ["Tasks", tasks.length, "task"],
    ["Overall progress", `${progress?.overallPercent ?? 0}%`, "progress"],
  ];

  return (
    <div className="page">
      <PageHeader title={`Welcome back, ${user.name}`} subtitle="Here is where your work stands today." />

      <section className="stats">
        {stats.map(([text, value, target]) => (
          <button key={text} className="stat" onClick={() => go(target)}>
            <span>{text}</span>
            <strong>{value}</strong>
          </button>
        ))}
      </section>

      <section className="grid-2">
        <div className="card">
          <div className="card-head">
            <h2>Current sprint</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => go("sprint")}>View sprints</button>
          </div>
          {current ? (
            <>
              <div className="row-between">
                <div>
                  <h3 className="item-title">{current.sprintName}</h3>
                  <p className="muted">
                    {current.project?.projectName || "No project"} · {current.startDate} to {current.endDate}
                  </p>
                </div>
                <Badge value="ACTIVE" />
              </div>
              <div className="progress-row">
                <span>{currentStats?.done ?? 0} of {currentStats?.total ?? 0} tasks done</span>
                <strong>{currentStats?.percent ?? 0}%</strong>
              </div>
              <ProgressBar value={currentStats?.percent ?? 0} />
            </>
          ) : (
            <Empty title="No active sprint" text="Set a sprint's status to Active to track it here." />
          )}
        </div>

        <div className="card">
          <div className="card-head">
            <h2>Latest tasks</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => go("task")}>View tasks</button>
          </div>
          {latest.length === 0 ? (
            <Empty title="No tasks yet" />
          ) : (
            <ul className="list">
              {latest.map((t) => (
                <li key={t.id}>
                  <div className="grow">
                    <strong>{t.taskName}</strong>
                    <div className="muted">{t.assignedTo?.name || "Unassigned"}</div>
                  </div>
                  <Badge value={t.status} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <div className="card">
        <div className="card-head">
          <h2>Projects</h2>
          <button className="btn btn-ghost btn-sm" onClick={() => go("project")}>View projects</button>
        </div>
        {!progress || progress.projects.length === 0 ? (
          <Empty title="No projects yet" />
        ) : (
          <ul className="list">
            {progress.projects.map((p) => (
              <li key={p.id} className="stack">
                <div className="row-between">
                  <strong>{p.name}</strong>
                  <span className="muted">{p.done} of {p.total} tasks done · {p.percent}%</span>
                </div>
                <ProgressBar value={p.percent} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
