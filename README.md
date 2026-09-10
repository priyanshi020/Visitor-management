# Visitor Management Mini System

A React + TypeScript admin dashboard for managing visitor check-ins, built with Redux Toolkit, Axios, and Material UI.

## Tech Stack

- **React 19** + **TypeScript** (Vite)
- **Redux Toolkit** for state management (`createSlice`, `createAsyncThunk`)
- **Axios** for HTTP communication, backed by a mock REST server (`axios-mock-adapter`)
- **Material UI (v6)** for UI components
- **React Router v7** for routing
- **notistack** for toast notifications
- **Vitest** + **React Testing Library** for testing

## Getting Started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

**Demo credentials:**
- Email: `admin@example.com`
- Password: `admin123`

### Other scripts

```bash
npm run build       # type-check and production build
npm run test        # run the test suite once
npm run test:watch  # run tests in watch mode
npm run lint         # lint the codebase
```

## Mock API Approach

Backend development was out of scope for this assessment, so the app uses **`axios-mock-adapter`** to intercept requests made by a real `axios` instance (`src/api/client.ts`) and respond as if they hit a live REST API — including realistic status codes, a simulated network delay (500ms), and error responses.

This was chosen over JSON Server or MSW because it:
- Requires no separate process to run alongside the dev server
- Intercepts at the Axios transport layer, so the rest of the app (services, thunks, components) is 100% agnostic to the fact the API is mocked — swapping to a real backend later only means removing `installMockServer()` from `src/main.tsx` and pointing `apiClient`'s `baseURL` at the real API
- Keeps request/response shapes identical to the documented REST endpoints

Mock data (visitors) is persisted to `localStorage` so state survives page reloads, and reset by clearing site storage.

### Implemented endpoints

| Method | Endpoint | Behavior |
|---|---|---|
| POST | `/auth/login` | Validates email/password, returns `{ user, token }` or 401 |
| GET | `/visitors` | Returns all visitors |
| GET | `/visitors/:id` | Returns a single visitor or 404 |
| POST | `/visitors` | Creates a visitor with `status: 'pending'` |
| PUT | `/visitors/:id` | Updates a visitor |
| DELETE | `/visitors/:id` | Deletes a visitor |
| PATCH | `/visitors/:id/approve` | Sets status to `approved` |
| PATCH | `/visitors/:id/reject` | Sets status to `rejected` |

## Architecture / Project Structure

```
src/
  api/                 # Axios instance, mock server, service layer (authService, visitorService)
  app/                 # Redux store configuration + typed hooks (useAppDispatch/useAppSelector)
  components/          # Reusable, presentation-focused components
    Layout.tsx           # Page shell (Navbar + container)
    Navbar.tsx
    ProtectedRoute.tsx    # Route guard based on auth token
    ConfirmDialog.tsx     # Generic confirmation modal (used for delete)
    StatusChip.tsx        # Visitor status badge
  features/
    auth/authSlice.ts       # Auth state + login thunk
    visitors/visitorsSlice.ts # Visitor list state + CRUD/approve/reject thunks
  pages/               # Route-level screens
    LoginPage.tsx
    VisitorListPage.tsx
    AddVisitorPage.tsx
  types/                # Shared TypeScript types (Visitor, User, etc.)
  utils/validators.ts   # Reusable form validation helpers
  test/setup.ts         # Vitest/RTL setup
```

**Data flow:** Pages dispatch thunks (`features/*/*.slice.ts`) → thunks call the service layer (`api/*Service.ts`) → services call the shared Axios instance (`api/client.ts`) → the mock adapter (`api/mockServer.ts`) intercepts and responds. No component ever holds hardcoded visitor data — everything is sourced from the Redux store, which is populated from the API layer.

**Auth:** the JWT-style mock token and user are persisted to `localStorage` and rehydrated into the Redux store on load. `ProtectedRoute` redirects to `/login` when no token is present. An Axios request interceptor attaches the token as a Bearer header on every request.

## Key Features

- **Login** with client-side validation (required fields, email format, min password length), loading state, and inline error alert on failed auth.
- **Visitor List** with Approve / Reject / Delete actions, per-row loading state while an approve/reject request is in flight, and a confirmation dialog before delete.
- **Add Visitor** with field-level validation (name length, phone format, unit format, visit date not in the past), submit loading state, and redirect + success toast on completion.
- **Notifications** via `notistack` for success/error/info feedback on every mutating action.
- **Responsive UI**: MUI's fluid layout, breakpoints, and scrollable table container handle small viewports.

## Form Validation

Implemented via lightweight, reusable predicate functions in [`src/utils/validators.ts`](src/utils/validators.ts) (email format, phone format, non-empty, unit format, date-not-in-past), applied per-field on submit in both `LoginPage` and `AddVisitorPage` with inline MUI `helperText`/`error` props.

## Error Handling & Loading States

- Axios response interceptor normalizes all errors to a consistent `Error` with a readable message.
- Async thunks use `rejectWithValue` so slices can store a typed error string per feature.
- `visitorsSlice` tracks `mutatingIds` so only the row being approved/rejected shows a disabled/loading state, without blocking the rest of the table.
- All errors surface as toast notifications; the login page additionally shows an inline `Alert`.

## Testing

Run with:

```bash
npm run test
```

Coverage includes:
- **Unit tests** for all validators (`src/utils/validators.test.ts`)
- **Reducer tests** for `authSlice` and `visitorsSlice` covering pending/fulfilled/rejected states for every thunk (`*.slice.test.ts`)
- **Component tests** for `LoginPage` verifying validation messages render for empty and malformed input, using React Testing Library with a real Redux store

## Assumptions & Technical Decisions

- No real backend was required per the assignment; `axios-mock-adapter` was chosen to keep the Axios/service-layer code identical to what a real backend integration would look like.
- Auth is a single hardcoded demo account (`admin@example.com` / `admin123`) since user management/registration was out of scope.
- "Unit" is treated as a short alphanumeric identifier (e.g. `A-101`); validated with a simple pattern rather than a fixed enum, since building layouts weren't specified.
- Visit date must be today or a future date, since visitor pre-registration for past dates isn't meaningful for this workflow.
- Newly added visitors always start in `pending` status, matching the approve/reject workflow described in the requirements.
- `localStorage` is used both for the auth token/user and the mock visitor dataset, simulating persistence across reloads without a real database.
- MUI v6 was used (rather than a v7/beta release) for a stable, well-documented API surface.

## Screenshots

Run `npm run dev` and visit `http://localhost:5173` to see:
1. Login page with validation
2. Visitor list with status chips and row actions
3. Add Visitor form
4. Delete confirmation dialog
5. Toast notifications on approve/reject/delete/add
