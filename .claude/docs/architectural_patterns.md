# Architectural Patterns

## Service Layer Pattern

Routes delegate all business logic to services. Routes handle HTTP concerns (req/res, status codes); services handle data operations and domain logic.

- Routes: `server/routes/choreRoutes.js`, `server/routes/authRoutes.js`
- Services: `server/services/choreService.js`, `server/services/authService.js`

Example flow: route validates input → calls service → service calls fileStore → route sends response.

## Repository Pattern (FileStore)

`server/services/fileStore.js` abstracts all data access behind a uniform interface: `read`, `write`, `findById`, `insert`, `update`, `remove`, `findOne`, `findMany`. All services use fileStore rather than reading JSON files directly. Uses `proper-lockfile` with retry logic (5 retries, 50ms min timeout) for safe concurrent access.

## JWT Auth with Middleware Chain

Authentication follows a consistent middleware pattern across all protected routes:

- `server/middleware/auth.js` — extracts and verifies JWT from `Authorization: Bearer` header, attaches `req.user`
- `server/middleware/adminOnly.js` — checks `req.user.role === 'admin'`, used after auth middleware
- Applied in `server/index.js` at route registration: `app.use('/api/chores', auth, choreRoutes)`

## React Context for Global State

Auth state is managed via React Context, not a state management library:

- `client/src/auth/AuthContext.jsx` — provides `user`, `loading`, `login`, `signup`, `logout`
- Token stored in `localStorage`, restored on app initialization
- `client/src/auth/ProtectedRoute.jsx` — consumes context to guard routes

## Custom Hooks for API State

Each data domain has a dedicated hook encapsulating fetch logic, loading/error state, and mutation functions:

- `client/src/hooks/useChores.js` — CRUD + move + assign, manages local chore array
- `client/src/hooks/useTeam.js` — fetch members, delete member
- `client/src/hooks/useNotifications.js` — fetch with 30s polling interval, mark read

Pattern: hook calls `axiosInstance` → manages `useState` for data/loading/error → returns state + action functions.

## Axios Interceptor Pattern

`client/src/api/axiosInstance.js` centralizes HTTP concerns:

- Request interceptor: injects JWT from localStorage into every request
- Response interceptor: catches 401 responses and redirects to `/login`
- All hooks and components use this instance, never raw axios

## Composition-Based Layout

UI is composed through nested wrapper components rather than inheritance:

- `client/src/components/Layout/AppShell.jsx` — wraps page content with Header, Sidebar, NotificationPanel
- `client/src/App.jsx` — wraps everything with AuthProvider, ThemeProvider, Router, ErrorBoundary
- Pages are rendered as children of AppShell within route definitions

## Recurrence Expansion (Server-Side)

Recurring chores are stored as a single record; expansion into individual instances happens at query time:

- `server/services/recurrenceService.js` — expands one chore into N instances for a date range
- Instance IDs follow the pattern: `{choreId}_r{index}` (original keeps its UUID)
- Each instance carries `parentId` and `recurrenceIndex` for relationship tracking

## Notification Deduplication

`server/services/notificationService.js` prevents duplicate unread notifications by checking for existing unread entries matching `(userId, type, choreId)` before creating new ones. Types are extensible (`assigned`, `overdue`).

## Color-Coded Team Members

Users are assigned a color from a predefined palette at signup time (stored on the user record). This color is used consistently in calendar events (`client/src/components/Calendar/ChoreEvent.jsx`) and team cards (`client/src/components/Team/MemberCard.jsx`) for visual identification.

## Error Handling Convention

- Server: try/catch in route handlers, returning `{ error: message }` with appropriate status codes
- Client: `client/src/App.jsx` includes a class-based ErrorBoundary for uncaught React errors
- Hooks expose `error` state for component-level error display via MUI Snackbar/Alert
