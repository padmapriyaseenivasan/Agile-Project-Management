# Project Management System

React.js + Spring Boot (Java 21) + MySQL, JWT security, Admin and Team Member panels.

## Run

1. Start MySQL. The database `project_management_system` is created automatically.
   Default login is user `root` with an empty password (change it in `backend/src/main/resources/application.properties`).
2. Backend: open `backend/` in Eclipse/IntelliJ and run `AgileProjectManagementSystemApplication`
   (or `mvn spring-boot:run`). It starts on http://localhost:8080.
3. Frontend: `cd frontend && npm install && npm run dev`. It opens on http://localhost:5173.

## Admin login (created automatically on first start)

- Email: admin@gmail.com
- Password: admin123
- Role: Admin

Team members must **register once**, then log in with role "Team member".

## Rules

| Action | Admin | Team member |
|---|---|---|
| Create / edit / delete projects and sprints | Yes | No (view only) |
| Create / delete tasks, assign tasks, move to sprint | Yes | No |
| View all tasks | Yes | Yes |
| Update a task | Any task | Only own task, status only |
| View dashboard and progress | Yes | Yes |

A task with no sprint is in the product backlog.
