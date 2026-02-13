# Office Chore Manager

Full-stack web app for teams to schedule, assign, and track office chores via a calendar interface. Supports recurring chores, team management, notifications, and role-based access (admin/member).

## Tech Stack

| Layer     | Technology                                          |
|-----------|-----------------------------------------------------|
| Frontend  | React 19, Vite 7, Material-UI 5, React Router 6    |
| Backend   | Node.js, Express 4                                  |
| Auth      | JWT (jsonwebtoken), bcryptjs                        |
| Storage   | File-based JSON with proper-lockfile                |
| Calendar  | react-big-calendar with drag-and-drop               |
| HTTP      | Axios with interceptors                             |
| Dates     | date-fns (shared across client and server)          |

## Project Structure

```
server/
  index.js              # Express app entry, route registration, health check
  config.js             # Environment: PORT (3001), JWT_SECRET, DATA_DIR
  middleware/            # auth.js (JWT verify), adminOnly.js (role check)
  routes/               # authRoutes, choreRoutes, userRoutes, notificationRoutes
  services/             # Business logic: authService, choreService, fileStore,
                        #   notificationService, recurrenceService
  data/                 # JSON persistence files (gitignored)

client/src/
  App.jsx               # Routing, MUI theme, error boundary
  api/axiosInstance.js   # Axios config, JWT injection, 401 redirect
  auth/                 # AuthContext (global auth state), LoginPage, SignupPage,
                        #   ProtectedRoute
  components/
    Calendar/           # CalendarView (main), CalendarToolbar, ChoreEvent
    Chores/             # ChoreFormModal, RecurrenceSelect
    Layout/             # AppShell (shell), Header, Sidebar
    Team/               # TeamPage, MemberCard
    Notifications/      # NotificationPanel, NotificationBell
  hooks/                # useChores, useTeam, useNotifications (API + state)
```

## Commands

```bash
# Development (runs server + client concurrently)
npm run dev

# Individual
npm run server          # Node server on :3001
npm run client          # Vite dev server on :5173 (proxies /api -> :3001)

# Client build
npm run build --prefix client
npm run preview --prefix client
```

## API Routes

All routes prefixed with `/api`. Auth-protected unless noted.

- `POST /auth/signup`, `POST /auth/login` — public
- `GET /auth/me` — current user
- `GET /chores?from=&to=` — chores in date range (recurrence expanded server-side)
- `POST /chores`, `PUT /chores/:id`, `DELETE /chores/:id`
- `PATCH /chores/:id/move`, `PATCH /chores/:id/assign`
- `GET /users`, `DELETE /users/:id` (admin only)
- `GET /notifications`, `PATCH /notifications/:id/read`, `PATCH /notifications/read-all`

## Data Models

- **User**: id, email, displayName, passwordHash, role (`admin`|`member`), color
- **Chore**: id, title, description, assigneeId, date, startTime/endTime, allDay, recurrence (`daily`|`weekly`|`biweekly`|`monthly`|null), recurrenceEndDate, createdBy
- **Notification**: id, userId, type (`assigned`|`overdue`), choreId, message, read

## Key Behaviors

- First user to sign up becomes admin; subsequent users are members
- Recurrence expansion happens server-side in `server/services/recurrenceService.js`
- Notifications use 30-second polling, not WebSockets
- File store uses lockfiles to handle concurrent writes: `server/services/fileStore.js`

## Additional Documentation

Check these when working in related areas:

- `.claude/docs/architectural_patterns.md` — architectural patterns, design conventions, and cross-cutting concerns
