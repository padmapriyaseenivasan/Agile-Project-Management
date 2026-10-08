import React, { useEffect, useState } from "react";
import api, { errMsg } from "./axiosConfig";
import { Badge, Empty, PageHeader } from "./ui";

const EMPTY = { taskName: "", description: "", status: "TODO", priority: "MEDIUM", userId: "", sprintId: "" };

function Task({ user, isAdmin }) {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [scope, setScope] = useState("ALL");

  const load = async () => {
    try {
      const [t, s] = await Promise.all([api.get("/tasks"), api.get("/sprints")]);
      setTasks(t.data); setSprints(s.data);
      if (isAdmin) {
        const u = await api.get("/users");           // admin-only endpoint
        setUsers(u.data.filter((x) => x.role === "TEAM_MEMBER"));
      }
    } catch (e) { console.error(e); }
  };
  useEffect(() => { load(); }, []);

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const reset = () => { setForm(EMPTY); setEditId(null); };

  const submit = async (e) => {
    e.preventDefault();
    const { userId, sprintId, ...body } = form;
    const q = new URLSearchParams();
    if (userId) q.set("userId", userId);
    try {
      if (editId) {
        q.set("sprintId", sprintId || 0);            // 0 = back to backlog
        await api.put(`/tasks/${editId}?${q}`, body);
      } else {
        if (sprintId) q.set("sprintId", sprintId);   // none = product backlog
        await api.post(`/tasks?${q}`, body);
      }
      reset();
      load();
    } catch (err) { alert(errMsg(err, "Could not save the task")); }
  };

  const edit = (t) => {
    setEditId(t.id);
    setForm({
      taskName: t.taskName || "", description: t.description || "",
      status: t.status || "TODO", priority: t.priority || "MEDIUM",
      userId: t.assignedTo?.id || "", sprintId: t.sprint?.id || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try { await api.delete(`/tasks/${id}`); load(); }
    catch (err) { alert(errMsg(err, "Could not delete the task")); }
  };

  // team members can change only the status of their own tasks
  const changeStatus = async (t, status) => {
    try { await api.put(`/tasks/${t.id}`, { status }); load(); }
    catch (err) { alert(errMsg(err, "Could not update the status")); }
  };

  const shown = tasks
    .filter((t) => scope === "ALL" || t.assignedTo?.id === user.id)
    .filter((t) => filter === "ALL" || t.status === filter);

  return (
    <div className="page">
      <PageHeader title="Tasks" subtitle={isAdmin ? "Create, assign and track tasks." : "See the whole team's tasks. You can update only your own."} />

      {isAdmin && (
        <div className="card">
          <h2>{editId ? "Edit task" : "New task"}</h2>
          <form onSubmit={submit}>
            <div className="form-grid">
              <div className="field full">
                <label>Task name</label>
                <input name="taskName" value={form.taskName} onChange={set} placeholder="e.g. Build login page" required />
              </div>
              <div className="field">
                <label>Assign to</label>
                <select name="userId" value={form.userId} onChange={set}>
                  <option value="">Unassigned</option>
                  {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Sprint</label>
                <select name="sprintId" value={form.sprintId} onChange={set}>
                  <option value="">Product backlog</option>
                  {sprints.map((s) => <option key={s.id} value={s.id}>{s.sprintName}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Status</label>
                <select name="status" value={form.status} onChange={set}>
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
              </div>
              <div className="field">
                <label>Priority</label>
                <select name="priority" value={form.priority} onChange={set}>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
              <div className="field full">
                <label>Description</label>
                <textarea name="description" rows="3" value={form.description} onChange={set} placeholder="What needs to be done?" required />
              </div>
            </div>
            <div className="actions">
              <button className="btn btn-primary">{editId ? "Save changes" : "Create task"}</button>
              {editId && <button type="button" className="btn btn-ghost" onClick={reset}>Cancel</button>}
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="card-head">
          <h2>Tasks ({shown.length})</h2>
          <div className="actions tight">
          {!isAdmin && (
            <select className="filter" value={scope} onChange={(e) => setScope(e.target.value)}>
              <option value="ALL">All team tasks</option>
              <option value="MINE">My tasks</option>
            </select>
          )}
          <select className="filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="ALL">All statuses</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
          </div>
        </div>

        {shown.length === 0 ? (
          <Empty title="No tasks found" text={isAdmin ? "Create a task above." : "No tasks match this view."} />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Task</th><th>Assigned to</th><th>Sprint</th><th>Status</th><th>Priority</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {shown.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <strong>{t.taskName}</strong>
                      <div className="muted clamp">{t.description}</div>
                    </td>
                    <td>{t.assignedTo?.name || <span className="muted">Unassigned</span>}</td>
                    <td>{t.sprint?.sprintName || <span className="muted">Backlog</span>}</td>
                    <td>
                      {isAdmin || t.assignedTo?.id !== user.id ? <Badge value={t.status} /> : (
                        <select className="filter" value={t.status} onChange={(e) => changeStatus(t, e.target.value)}>
                          <option value="TODO">To Do</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="DONE">Done</option>
                        </select>
                      )}
                    </td>
                    <td><Badge value={t.priority} /></td>
                    <td>
                      {isAdmin && (
                        <div className="actions tight">
                          <button className="btn btn-soft btn-sm" onClick={() => edit(t)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => remove(t.id)}>Delete</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Task;
