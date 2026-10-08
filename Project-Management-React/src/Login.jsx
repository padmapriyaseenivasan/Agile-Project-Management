import React, { useState } from "react";
import api, { errMsg } from "./axiosConfig";

function Login({ onLogin, onRegister , onHome }) {
  const [f, setF] = useState({ role: "TEAM_MEMBER", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (e) => setF({ ...f, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await api.post("/auth/login", f);
      localStorage.setItem("token", res.data);
      onLogin();
    } catch (err) {
      setError(errMsg(err, "Invalid role, email or password"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <button type="button" className="back-home" onClick={onHome}>← Back to home</button>
        <div className="brand-icon auth-logo">P</div>
        <h1>Project Management System</h1>
        <p className="muted">Log in to plan sprints, manage tasks and track progress.</p>

        {error && <div className="notice error">{error}</div>}

        <form onSubmit={submit}>
          <div className="field">
            <label>Role</label>
            <select name="role" value={f.role} onChange={set}>
              <option value="TEAM_MEMBER">Team member</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" name="email" placeholder="you@example.com" value={f.email} onChange={set} required />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" name="password" placeholder="Enter your password" value={f.password} onChange={set} required />
          </div>
          <button className="btn btn-primary btn-block" disabled={busy}>
            {busy ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="auth-switch">
          New here?
          <button type="button" className="link" onClick={onRegister}>Create an account</button>
        </p>
      </div>
    </div>
  );
}

export default Login;
