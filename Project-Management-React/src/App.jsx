import React, { useEffect, useState } from "react";
import api from "./axiosConfig";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import Layout from "./Layout";
import Dashboard from "./Dashboard";
import Project from "./Project";
import Sprint from "./Sprint";
import Backlog from "./Backlog";
import Task from "./Task";
import Progress from "./Progress";

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));
  const [screen, setScreen] = useState("home");
  const [page, setPage] = useState("dashboard");
  const [user, setUser] = useState(null);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setLoggedIn(false);
    setScreen("login");
    setPage("dashboard");
  };

  // user is fetched ONCE here and shared with every page
  useEffect(() => {
    if (!loggedIn) return;
    api.get("/users/me").then((r) => setUser(r.data)).catch(() => {});
  }, [loggedIn]);

  useEffect(() => {
    window.addEventListener("auth-expired", logout);
    return () => window.removeEventListener("auth-expired", logout);
  }, []);

  if (!loggedIn) {
    if (screen === "home") {
      return <Home onLogin={() => setScreen("login")} onRegister={() => setScreen("register")} />;
    }
    return screen === "register" ? (
      <Register onLogin={() => setScreen("login")} onHome={() => setScreen("home")} />
    ) : (
      <Login
        onLogin={() => { setLoggedIn(true); setPage("dashboard"); }}
        onRegister={() => setScreen("register")}
        onHome={() => setScreen("home")}
      />
    );
  }

  if (!user) return <div className="splash">Loading your workspace…</div>;

  const isAdmin = user.role === "ADMIN";
  const props = { user, isAdmin, go: setPage };

  const pages = {
    dashboard: <Dashboard {...props} />,
    project: <Project {...props} />,
    sprint: <Sprint {...props} />,
    backlog: <Backlog {...props} />,
    task: <Task {...props} />,
    progress: <Progress {...props} />,
  };

  return (
    <Layout user={user} page={page} onNavigate={setPage} onLogout={logout}>
      {pages[page] || pages.dashboard}
    </Layout>
  );
}

export default App;
