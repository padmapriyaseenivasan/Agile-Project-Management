import React, { useEffect, useState } from "react";
import api, { errMsg } from "./axiosConfig";
import { Empty, PageHeader } from "./ui";

const EMPTY = { projectName: "", description: "", startDate: "", endDate: "" };

function Project({ isAdmin }) {
  const [projects, setProjects] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);

  const load = async () => {
    try {
      const [p, s] = await Promise.all([api.get("/projects"), api.get("/sprints")]);
      setProjects(p.data);
      setSprints(s.data);
    } catch (e) { console.error(e); }
  };
  useEffect(() => { load(); }, []);

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const reset = () => { setForm(EMPTY); setEditId(null); };

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editId) await api.put(`/projects/${editId}`, form);
      else await api.post("/projects", form);
      reset();
      load();
    } catch (err) { alert(errMsg(err, "Could not save the project")); }
  };

  const edit = (p) => {
    setEditId(p.id);
    setForm({
      projectName: p.projectName || "", description: p.description || "",
      startDate: p.startDate || "", endDate: p.endDate || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try { await api.delete(`/projects/${id}`); load(); }
    catch (err) { alert(errMsg(err, "Could not delete the project")); }
  };

  return (
    <div className="page">
      <PageHeader title="Projects" subtitle={isAdmin ? "Create and manage your projects." : "Projects you are working on."} />

      {isAdmin && (
        <div className="card">
          <h2>{editId ? "Edit project" : "New project"}</h2>
          <form onSubmit={submit}>
            <div className="form-grid">
              <div className="field full">
                <label>Project name</label>
                <input name="projectName" value={form.projectName} onChange={set} placeholder="e.g. Customer portal" required />
              </div>
              <div className="field">
                <label>Start date</label>
                <input type="date" name="startDate" value={form.startDate} onChange={set} required />
              </div>
              <div className="field">
                <label>End date</label>
                <input type="date" name="endDate" value={form.endDate} onChange={set} required />
              </div>
              <div className="field full">
                <label>Description</label>
                <textarea name="description" rows="3" value={form.description} onChange={set} placeholder="What is this project about?" required />
              </div>
            </div>
            <div className="actions">
              <button className="btn btn-primary">{editId ? "Save changes" : "Create project"}</button>
              {editId && <button type="button" className="btn btn-ghost" onClick={reset}>Cancel</button>}
            </div>
          </form>
        </div>
      )}

      <h2 className="section-title">All projects ({projects.length})</h2>
      {projects.length === 0 ? (
        <div className="card"><Empty title="No projects yet" text={isAdmin ? "Create your first project above." : "Your admin has not added any projects."} /></div>
      ) : (
        <div className="cards">
          {projects.map((p) => (
            <div className="card project-card" key={p.id}>
              <div className="row-between">
                <h3 className="item-title">{p.projectName}</h3>
                <span className="chip">{sprints.filter((s) => s.project?.id === p.id).length} sprints</span>
              </div>
              <p className="muted clamp">{p.description}</p>
              <p className="dates">{p.startDate} to {p.endDate}</p>
              {isAdmin && (
                <div className="actions">
                  <button className="btn btn-soft btn-sm" onClick={() => edit(p)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => remove(p.id)}>Delete</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Project;
