import React, { useEffect, useState } from "react";
import api, { errMsg } from "./axiosConfig";
import { Badge, Empty, PageHeader } from "./ui";

function Backlog({ isAdmin, go }) {
  const [tasks, setTasks] = useState([]);
  const [sprints, setSprints] = useState([]);

  const load = async () => {
    try {
      const [t, s] = await Promise.all([api.get("/tasks"), api.get("/sprints")]);
      setTasks(t.data.filter((x) => !x.sprint));    // no sprint = backlog
      setSprints(s.data.filter((x) => x.status !== "COMPLETED"));
    } catch (e) { console.error(e); }
  };
  useEffect(() => { load(); }, []);

  const moveToSprint = async (t, sprintId) => {
    if (!sprintId) return;
    const { taskName, description, status, priority } = t;
    try {
      await api.put(`/tasks/${t.id}?sprintId=${sprintId}`, { taskName, description, status, priority });
      load();
    } catch (err) { alert(errMsg(err, "Could not move the task")); }
  };

  return (
    <div className="page">
      <PageHeader title="Product backlog" subtitle="Work that is not in a sprint yet.">
        {isAdmin && <button className="btn btn-primary" onClick={() => go("task")}>Add backlog item</button>}
      </PageHeader>

      <div className="card">
        {tasks.length === 0 ? (
          <Empty title="The backlog is empty" text="Tasks created without a sprint show up here." />
        ) : (
          <ul className="list">
            {tasks.map((t) => (
              <li key={t.id}>
                <div className="grow">
                  <strong>{t.taskName}</strong>
                  <div className="muted clamp">{t.description}</div>
                </div>
                <Badge value={t.priority} />
                {isAdmin && (
                  <select className="filter" defaultValue="" onChange={(e) => moveToSprint(t, e.target.value)}>
                    <option value="">Move to sprint…</option>
                    {sprints.map((s) => <option key={s.id} value={s.id}>{s.sprintName}</option>)}
                  </select>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Backlog;
