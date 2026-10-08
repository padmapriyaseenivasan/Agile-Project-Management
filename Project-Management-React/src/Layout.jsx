import React from "react";

const NAV = [
  ["dashboard", "⌂", "Dashboard"],
  ["project", "▣", "Projects"],
  ["sprint", "◷", "Sprints"],
  ["backlog", "☰", "Backlog"],
  ["task", "✓", "Tasks"],
  ["progress", "↗", "Progress"],
];

function Layout({ user, page, onNavigate, onLogout, children }) {
  const isAdmin = user.role === "ADMIN";

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">P</div>
          <div>
            <h2>Project Management</h2>
            <span>System</span>
          </div>
        </div>

        <nav className="nav">
          {NAV.map(([key, icon, text]) => (
            <button
              key={key}
              className={page === key ? "nav-item active" : "nav-item"}
              onClick={() => onNavigate(key)}
            >
              <span className="nav-icon">{icon}</span>
              {text}
            </button>
          ))}
        </nav>

        <div className="side-bottom">
          <div className="side-user">
            <div className="avatar">{user.name?.charAt(0).toUpperCase()}</div>
            <div>
              <strong>{user.name}</strong>
              <span>{isAdmin ? "Administrator" : "Team member"}</span>
            </div>
          </div>
          <button className="logout" onClick={onLogout}>Log out</button>
        </div>
      </aside>

      <main className="main">{children}</main>
    </div>
  );
}

export default Layout;
