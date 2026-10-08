import React, { useState } from "react";
import api, { errMsg } from "./axiosConfig";

function Register({ onLogin , onHome }) {
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const set = (e) => setF({ ...f, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await api.post("/users", f);   // backend forces role = TEAM_MEMBER
      setDone(true);
      setTimeout(onLogin, 1200);
    } catch (err) {
      setError(errMsg(err, "Registration failed"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <button type="button" className="back-home" onClick={onHome}>← Back to home</button>
        <div className="brand-icon auth-logo">P</div>
        <h1>Create your account</h1>
        <p className="muted">Register once as a team member, then log in.</p>

        {error && <div className="notice error">{error}</div>}
        {done && <div className="notice success">Account created. Taking you to log in…</div>}

        <form onSubmit={submit}>
          <div className="field">
            <label>Name</label>
            <input name="name" placeholder="Your full name" value={f.name} onChange={set} required />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" name="email" placeholder="you@example.com" value={f.email} onChange={set} required />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" name="password" placeholder="Create a password" value={f.password} onChange={set} required />
          </div>
          <button className="btn btn-primary btn-block" disabled={busy || done}>
            {busy ? "Creating…" : "Create account"}
          </button>
        </form>

        <p className="auth-switch">
          Already registered?
          <button type="button" className="link" onClick={onLogin}>Log in</button>
        </p>
      </div>
    </div>
  );
}

export default Register;
