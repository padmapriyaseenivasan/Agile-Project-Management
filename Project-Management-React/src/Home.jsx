import React from "react";

// Edit these two lines to change the names shown in the About section
const AUTHOR = "Padmapriya S";
const PROJECT = "Project Management System";

const MODULES = [
  ["🔐", "User authentication", "Register once as a team member, then log in. Sessions are secured with JWT."],
  ["▣", "Project management", "Create, view, update and delete projects with start and end dates."],
  ["◷", "Sprint management", "Plan sprints for each project and move them from planned to active to completed."],
  ["✓", "Task management", "Create tasks, assign them to people and update their status as work moves."],
  ["↗", "Progress tracking", "See completion for every task, sprint and project, calculated live."],
  ["⌂", "Dashboard", "One screen with your projects, active sprint, latest tasks and overall progress."],
];

const ADMIN = [
  "Create, edit and delete projects and sprints",
  "Create tasks and assign them to team members",
  "Move tasks between the backlog and sprints",
  "See every task and the full progress report",
];

const MEMBER = [
  "View projects, sprints and every team task",
  "Update the status of your own tasks",
  "Follow sprint and project progress",
];

const MEMBER_NO = ["Cannot create projects, sprints or tasks"];

const STACK = ["React.js", "Spring Boot", "Java 21", "MySQL", "Spring Security", "JWT", "REST API"];

function Home({ onLogin, onRegister }) {
  return (
    <div className="home">
      <nav className="home-nav">
        <div className="home-logo">
          <div className="brand-icon">P</div>
          {PROJECT}
        </div>
        <div className="home-links">
          <a href="#modules">Modules</a>
          <a href="#roles">Roles</a>
          <a href="#about">About us</a>
        </div>
        <div className="home-actions">
          <button className="btn btn-outline btn-sm" onClick={onLogin}>Log in</button>
          <button className="btn btn-light btn-sm" onClick={onRegister}>Register</button>
        </div>
      </nav>

      <header className="hero">
        <div className="hero-grid">
          <div>
            <h1>Plan sprints. Assign work. See progress.</h1>
            <p className="lead">
              A project management system for software teams. Admins run projects and sprints,
              and team members keep their own tasks up to date.
            </p>
            <div className="actions">
              <button className="btn btn-light" onClick={onLogin}>Log in</button>
              <button className="btn btn-outline" onClick={onRegister}>Create an account</button>
            </div>
            <p className="hero-note">New team members register once, then log in.</p>
          </div>

          <div className="preview" aria-hidden="true">
            <div className="preview-head">
              <div>
                <strong>Sprint 3</strong>
                <div className="muted">Customer portal</div>
              </div>
              <span className="badge active">Active</span>
            </div>
            <div className="progress-row"><span>6 of 9 tasks done</span><strong>67%</strong></div>
            <div className="bar"><div style={{ width: "67%" }} /></div>
            <ul className="list">
              <li><span>Design login page</span><span className="badge done">Done</span></li>
              <li><span>Build task API</span><span className="badge in_progress">In Progress</span></li>
              <li><span>Write test cases</span><span className="badge todo">To Do</span></li>
            </ul>
            <div className="preview-tag">Sample sprint</div>
          </div>
        </div>
      </header>

      <section className="section" id="modules">
        <div className="section-inner">
          <h2 className="big">Everything a sprint needs, in six modules</h2>
          <p className="sub">From signing in to tracking progress, each part of the workflow has its own place.</p>
          <div className="features">
            {MODULES.map(([icon, title, text]) => (
              <div className="feature" key={title}>
                <div className="feature-icon">{icon}</div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt" id="roles">
        <div className="section-inner">
          <h2 className="big">Two panels, one clear set of rules</h2>
          <p className="sub">Everyone sees the whole team's work. Only the admin changes the plan.</p>
          <div className="panels">
            <div className="panel dark">
              <h3>Admin panel</h3>
              <p className="role-sub">Plans and manages the work</p>
              <ul>{ADMIN.map((t) => <li key={t}>{t}</li>)}</ul>
            </div>
            <div className="panel">
              <h3>Team member panel</h3>
              <p className="role-sub">Does the work and reports status</p>
              <ul>
                {MEMBER.map((t) => <li key={t}>{t}</li>)}
                {MEMBER_NO.map((t) => <li className="no" key={t}>{t}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="about">
        <div className="section-inner about-grid">
          <div>
            <h2 className="big">About us</h2>
            <p>
              {PROJECT} is an Agile sprint and project management platform. It helps a team break
              a project into sprints, share tasks between members and see how much work is finished,
              without spreadsheets or scattered messages.
            </p>
            <p>
              It was built as a full-stack project with a React front end and a Spring Boot back end
              on MySQL. Every request is protected by JWT authentication and role-based access, so
              admins and team members only see the actions that belong to them.
            </p>
            <div className="stack">
              {STACK.map((t) => <span className="chip" key={t}>{t}</span>)}
            </div>
          </div>
          <div className="facts">
            <div><span>Project</span><strong>{PROJECT}</strong></div>
            <div><span>Developed by</span><strong>{AUTHOR}</strong></div>
            <div><span>Front end</span><strong>React.js</strong></div>
            <div><span>Back end</span><strong>Spring Boot, Java</strong></div>
            <div><span>Database</span><strong>MySQL</strong></div>
            <div><span>Security</span><strong>Spring Security with JWT</strong></div>
          </div>
        </div>
      </section>

      <footer className="home-footer">© 2026 {PROJECT}. Built by {AUTHOR}.</footer>
    </div>
  );
}

export default Home;
