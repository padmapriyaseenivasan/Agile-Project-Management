import React, { useEffect, useState } from "react";
import api, { errMsg } from "./axiosConfig";
import { Badge, Empty, PageHeader, ProgressBar, pct } from "./ui";

const EMPTY = { sprintName: "", startDate: "", endDate: "", status: "PLANNED", projectId: "" };

function Sprint({ isAdmin }) {
  const [sprints, setSprints] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);

  const load = async () => {
    try {
      const [s, p, t] = await Promise.all([api.get("/sprints"), api.get("/projects"), api.get("/tasks")]);
      setSprints(s.data); setProjects(p.data); setTasks(t.data);
    } catch (e) { console.error(e); }
  };
  useEffect(() => { load(); }, []);

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const reset = () => { setForm(EMPTY); setEditId(null); };

  const submit = async (e) => {
    e.preventDefault();
    const { projectId, ...body } = form;
    const q = projectId ? `?projectId=${projectId}` : "";
    try {
      if (editId) await api.put(`/sprints/${editId}${q}`, body);
      else await api.post(`/sprints${q}`, body);
      reset();
      load();
    } catch (err) { alert(errMsg(err, "Could not save the sprint")); }
  };

  const edit = (s) => {
    setEditId(s.id);
    setForm({
      sprintName: s.sprintName, startDate: s.startDate, endDate: s.endDate,
      status: s.status, projectId: s.project?.id || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this sprint?")) return;
    try { await api.delete(`/sprints/${id}`); load(); }
    catch (err) { alert(errMsg(err, "Could not delete the sprint")); }
  };

  return (
    <div className="page">
      <PageHeader title="Sprints" subtitle={isAdmin ? "Plan sprints for your projects." : "Sprints your team is running."} />

      {isAdmin && (
        <div className="card">
          <h2>{editId ? "Edit sprint" : "New sprint"}</h2>
          <form onSubmit={submit}>
            <div className="form-grid">
              <div className="field">
                <label>Sprint name</label>
                <input name="sprintName" value={form.sprintName} onChange={set} placeholder="e.g. Sprint 1" required />
              </div>
              <div className="field">
                <label>Project</label>
                <select name="projectId" value={form.projectId} onChange={set} required>
                  <option value="">Select a project</option>
                  {projects.map((p) => <option key={p.id} value={p.id}>{p.projectName}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Start date</label>
                <input type="date" name="startDate" value={form.startDate} onChange={set} required />
              </div>
              <div className="field">
                <label>End date</label>
                <input type="date" name="endDate" value={form.endDate} onChange={set} required />
              </div>
              <div className="field">
                <label>Status</label>
                <select name="status" value={form.status} onChange={set}>
                  <option value="PLANNED">Planned</option>
                  <option value="ACTIVE">Active</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>
            <div className="actions">
              <button className="btn btn-primary">{editId ? "Save changes" : "Create sprint"}</button>
              {editId && <button type="button" className="btn btn-ghost" onClick={reset}>Cancel</button>}
            </div>
          </form>
        </div>
      )}

      <h2 className="section-title">All sprints ({sprints.length})</h2>
      {sprints.length === 0 ? (
        <div className="card"><Empty title="No sprints yet" text={isAdmin ? "Create a sprint above." : "No sprints have been planned."} /></div>
      ) : (
        <div className="cards">
          {sprints.map((s) => {
            const mine = tasks.filter((t) => t.sprint?.id === s.id);
            const done = mine.filter((t) => t.status === "DONE").length;
            return (
              <div className="card" key={s.id}>
                <div className="row-between">
                  <h3 className="item-title">{s.sprintName}</h3>
                  <Badge value={s.status} />
                </div>
                <p className="muted">{s.project?.projectName || "No project"}</p>
                <p className="dates">{s.startDate} to {s.endDate}</p>
                <div className="progress-row">
                  <span>{done} of {mine.length} tasks done</span>
                  <strong>{pct(done, mine.length)}%</strong>
                </div>
                <ProgressBar value={pct(done, mine.length)} />
                {isAdmin && (
                  <div className="actions">
                    <button className="btn btn-soft btn-sm" onClick={() => edit(s)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => remove(s.id)}>Delete</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Sprint;
