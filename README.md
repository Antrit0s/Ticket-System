# IT Helpdesk & Service Management System

A multi-role enterprise IT Service Desk and asset management platform built with **React 19**, **TypeScript**, **Material UI v9**, and **Redux Toolkit with RTK Query**. The system simulates modern ITIL incident and request workflows, including role-based access control (RBAC), asset assignment, technician visit scheduling, real-time ticket activity audits, multi-party messaging, and dark/light system theming.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Test Accounts](#test-accounts)
- [Testing Guide](#testing-guide)
- [Key Workflows](#key-workflows)
- [API Endpoints](#api-endpoints)
- [State Management](#state-management)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Overview

This application simulates a real-world **IT Service Desk** environment where:

- **End users** can report hardware/software issues, request equipment, view their assigned assets, and book technician appointments.
- **Admins** can triage the ticket queue, assign technicians, manage assets inventory, oversee appointments, manage user roles, and monitor system-wide metrics.

The project demonstrates modern React patterns including feature-based architecture, RTK Query caching, role-based routing, form validation with Zod, and full dark/light theming.

---

## Features

### Authentication & Authorization

- **Dual sign-in mechanisms:** Standard email + password, or passwordless email OTP (6-digit code).
- **Session persistence** via `localStorage` (survives browser restart).
- **Role-based access control (RBAC):** Route guards for `user` and `admin` roles.
- **Forgot password flow:** Request OTP by email, verify code, set new password. OTP is single-use.
- **Profile management:** Edit name, email, department, and optionally change password.
- **Sign-up:** open to users only (admin role is granted, not self-assigned).

### Incident & Request Management

- **Create tickets** linked to category, priority, and optional related asset.
- **Business rule:** an asset can only have **one active ticket** at a time (status ≠ `closed` and ≠ `resolved`).
- **Admin triage:** assign tickets, update statuses (`open` → `in_progress` → `resolved` → `closed`), inspect related assets.
- **Automatic activity audit:** every state mutation logs an entry in `ticketActivity`.
- **Ticket conversation thread:** users and admins can reply, with attachment name support.

### Asset Lifecycle Management

- **Asset states:** `assigned`, `maintenance`, `returned`.
- **Admin actions:** register assets, assign/reassign to users, update status.
- **User actions:** view assigned assets, report an issue (redirects to new ticket with `assetId` pre-selected).

### Appointment Scheduling

- On-site or remote technician visits tied to a specific ticket.
- Fields: `scheduledAt`, `durationMinutes`, `location`, `notes`.
- **Statuses:** `scheduled`, `completed`, `cancelled`.
- Admins can schedule, edit, complete, or cancel.
- Users can view and cancel upcoming scheduled visits.

### Messaging System

- **Conversation list** per user (filtered by `participants`).
- **Direct messages** between users and admins.
- **Polling-based real-time updates** (every 3 seconds).
- **Read/unread tracking** (auto-mark as read on open).
- **Search + filter** within conversations.

### Theming & UX

- **Dark/light mode:** follows system preference on first visit; remembers choice in `localStorage`; animated sun/moon toggle.
- **Onboarding tour** via `driver.js`: triggers once after first login, replayable via help button.
- **Toast notifications** via `react-toastify` (theme-aware).
- **Responsive layout:** mobile collapsible sidebar, desktop 2/3 + 1/3 split layouts.
- **Loading states, empty states, and unified error handling.**

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 (Strict Mode) |
| **Build Tool** | Vite |
| **Language** | TypeScript (strict mode) |
| **UI Library** | Material UI v9 |
| **State Management** | Redux Toolkit |
| **Data Fetching** | RTK Query (tag-based caching + polling) |
| **Forms** | React Hook Form + Zod |
| **Routing** | React Router v6 |
| **Date Handling** | Day.js + MUI X Date Pickers |
| **Onboarding** | driver.js |
| **Notifications** | React Toastify |
| **Email** | EmailJS |
| **Mock Backend** | json-server |
| **Fonts** | Inter (Fontsource) |
| **Icons** | MUI Icons |

---

## Architecture

### Feature-Based Structure

Each domain (tickets, assets, auth, chat, etc.) lives in its own folder containing the RTK Query API slice, related components, and business logic.

### State Management Flow
Component
↓ (hook call)
RTK Query Hook (useGetTicketsQuery)
↓
baseApi (createApi)
↓
fetchBaseQuery → json-server
↓
Redux Store (cache)
↓
Component re-renders (if subscribed)

### Cache Invalidation Strategy

- **Tag-based invalidation** ensures fresh data after mutations.
- **Granular tags** (e.g., `{ type: "Ticket", id: "t1" }`) minimize refetches.
- **List tags** (`{ type: "Ticket", id: "LIST" }`) for collection queries.
- `updateTicket` invalidates 4 tags to keep related data in sync.

### Routing & Guards
Public Routes:
/ → AuthPage (role selection)
/signup → AuthPage
/forgot-password → AuthPage

Protected Routes (logged in):
/profile → ProfilePage

User-only Routes:
/dashboard → OverviewPage
/dashboard/tickets → UserTicketsPage
/dashboard/tickets/new → TicketForm
/dashboard/tickets/:id → TicketDetailsPage
/dashboard/assets → MyAssetsPage
/dashboard/appointments → UserAppointmentsPage
/dashboard/messages → ChatLayout

Admin-only Routes:
/admin → AdminTicketsQueue
/admin/tickets/:id → TicketDetailsPage
/admin/assets → AdminAssetsInventory
/admin/appointments → AdminAppointmentsPage
/admin/users → AdminUsersPage
/admin/messages → ChatLayout
/admin/metrics → AdminMetricsPage

Fallback:

→ NotFoundPage (redirects to role home)


---

## Project Structure
src/
├── app/
│ └── store.ts # Redux store + RTK Query middleware
├── assets/ # Static assets
├── components/
│ ├── auth/
│ │ ├── AuthPage.tsx
│ │ ├── LoginForm.tsx
│ │ ├── SignupForm.tsx
│ │ ├── ForgotPasswordForm.tsx
│ │ ├── RoleSelect.tsx
│ │ ├── OtpInput.tsx
│ │ └── PasswordField.tsx
│ ├── shared/
│ │ ├── DashboardLayout.tsx
│ │ ├── Sidebar.tsx
│ │ ├── TopBar.tsx
│ │ ├── ProtectedRoute.tsx
│ │ ├── NotFoundPage.tsx
│ │ ├── ProfilePage.tsx
│ │ ├── TicketDetailsPage.tsx
│ │ ├── StatusBadges.tsx
│ │ ├── PaginationControls.tsx
│ │ ├── MaterialUISwitch.tsx
│ │ ├── UserTourButton.tsx
│ │ ├── chat/
│ │ │ ├── ChatLayout.tsx
│ │ │ ├── ChatWindow.tsx
│ │ │ ├── ConversationList.tsx
│ │ │ └── NewMessageDialog.tsx
│ │ └── ticket-details/
│ │ ├── TicketHeader.tsx
│ │ ├── TicketStatusPanel.tsx
│ │ ├── TicketAssetSection.tsx
│ │ ├── TicketAppointmentSection.tsx
│ │ ├── AssignedAdminCard.tsx
│ │ ├── ConversationPanel.tsx
│ │ ├── ReplyBox.tsx
│ │ └── ActivityTimeline.tsx
│ ├── admin/
│ │ ├── AdminTicketsQueue.tsx
│ │ ├── AdminMetricsPage.tsx
│ │ ├── AdminUsersPage.tsx
│ │ ├── AppointmentComponents/
│ │ │ ├── AdminAppointmentsPage.tsx
│ │ │ └── AppointmentFormDialog.tsx
│ │ └── AssetsComponents/
│ │ ├── AdminAssetsInventory.tsx
│ │ ├── AddAssetDialog.tsx
│ │ ├── EditAssetDialog.tsx
│ │ ├── AssignAssetDialog.tsx
│ │ └── AssetTypeField.tsx
│ └── user/
│ ├── OverviewPage.tsx
│ ├── UserTicketsPage.tsx
│ ├── TicketForm.tsx
│ ├── MyAssetsPage.tsx
│ └── UserAppointmentsPage.tsx
├── features/
│ ├── api/baseApi.ts
│ ├── appointments/appointmentsApi.ts
│ ├── assets/assetsApi.ts
│ ├── auth/
│ │ ├── authApi.ts
│ │ └── authSlice.ts
│ ├── chat/chatApi.ts
│ ├── tickets/ticketsApi.ts
│ └── users/usersApi.ts
├── lib/
│ ├── email/
│ │ ├── generateOtp.ts
│ │ └── sendEmail.ts
│ ├── hooks.ts
│ ├── themeMode.tsx
│ ├── navSidebar.ts
│ ├── navTopbar.ts
│ ├── userTour.ts
│ ├── errorMessage.ts
│ └── utils.ts
├── types/index.ts
├── theme.ts
├── App.tsx
└── main.tsx

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9 (or pnpm/yarn)

### Installation

```bash
git clone https://github.com/Antrit0s/Ticket-System.git
cd Ticket-System
npm install
Running Locally
Option A — Single command (recommended):
npm run dev:all
Starts both Vite (port 5173) and json-server (port 3000) concurrently.

Option B — Separate terminals:
# Terminal 1: Mock backend
npm run server

# Terminal 2: Frontend
npm run dev
Open http://localhost:5173.

Environment Variables
Create a .env file in the root:
# URL of the json-server backend
VITE_API_URL=http://localhost:3000

# EmailJS configuration (optional)
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id


Note: If EmailJS isn't configured, OTP codes are displayed in a toast notification (dev-friendly fallback).
Available Scripts
Script	Description
npm run dev	Start Vite dev server (port 5173)
npm run server	Start json-server (port 3000)
npm run dev:all	Run both concurrently
npm run build	Production build (outputs to dist/)
npm run preview	Preview production build locally
npm run lint	Lint with ESLint
npm run server:render	Start json-server on Render's $PORT
Test Accounts
Admin Account
Email:    support@company.com
Password: password123
Role:     admin
Use this account to test:

Ticket queue triage & assignment

Asset inventory management

Appointment scheduling

User role management

System metrics dashboard

Replying to user tickets and messages

User Accounts :
Name	Email	Password
Mariam Tarek	mariam.tarek@company.com	password123
Omar Khaled	omar.khaled@company.com	password123
Nour El-Din	nour.eldin@company.com	password123

Use these accounts to test:
Creating tickets

Reporting asset issues

Viewing appointments

Messaging support

You can also register a new account from /signup. New accounts default to the user role.

Testing Guide
Quick Start: Full Flow
Step 1 — Login as Admin:
Email:    support@company.com
Password: password123

Step 2 — Explore Admin Features:

Feature	Route	What to Test
Ticket Queue	/admin	Search, filter by status/priority, assign tickets
Ticket Details	/admin/tickets/:id	Change status, view related asset, schedule appointment, reply to user
Asset Inventory	/admin/assets	Add asset, edit asset, assign to user, change status
Appointments	/admin/appointments	View all, mark completed, cancel
User Management	/admin/users	Change user role (user ↔ admin)
Messages	/admin/messages	Reply to user conversations
System Metrics	/admin/metrics	View stats + all tickets table

Step 3 — Login as User (separate browser or Incognito):
Email:    mariam.tarek@company.com
Password: password123
Step 4 — Explore User Features:

Feature	Route	What to Test
Overview	/dashboard	See stats: tickets, assets, resolved count
My Tickets	/dashboard/tickets	View list, search, sort, "New ticket" opens side form
New Ticket	(side panel)	Try linking an asset that already has an open ticket (should be blocked)
Ticket Details	/dashboard/tickets/:id	View status, reply, view activity timeline
My Assets	/dashboard/assets	View assigned equipment, "Report issue"
Appointments	/dashboard/appointments	View scheduled visits, cancel if scheduled
Messages	/dashboard/messages	Chat with admin support
Specific Test Scenarios
Scenario 1: Ticket Lifecycle
Login as user → create a new ticket.

Logout → login as admin → find the ticket in /admin.

Change status: open → in_progress.

Assign it to a technician.

Add a reply from the admin side.

Change status to resolved.

Logout → login as user → confirm the ticket shows resolved.

Scenario 2: Asset Duplicate Prevention
Login as user with an assigned asset (e.g., mariam.tarek@company.com).

Create a ticket linked to that asset (status = open).

Try to create another ticket on the same asset → the form should block with "This asset already has an open ticket."

As admin, resolve or close the first ticket.

Try again → the block should be lifted.

Scenario 3: OTP Login
On the login screen, select One-time code.

Enter a valid email (e.g., mariam.tarek@company.com).

Click "Send code".

If EmailJS is not configured, the OTP appears in a toast notification.

Enter the 6-digit code → login succeeds.

Scenario 4: Role Change
Login as admin → go to /admin/users.

Click "Change role".

Select a user, choose "Admin".

Confirm.

Logout, login as that user → they should now see the admin dashboard.

Scenario 5: Appointment Flow
Login as admin → open a ticket in /admin.

In the ticket details sidebar, click "Schedule appointment".

Fill in date, technician, location → submit.

The appointment appears in the ticket sidebar and in /admin/appointments.

Login as the user → confirm the appointment appears in /dashboard/appointments.

Scenario 6: Chat
Login as user → open /dashboard/messages.

Click "New", select admin, start a conversation.

Send a message.

Login as admin (in a separate browser) → the message appears in /admin/messages.

Reply from admin → the user sees it within 3 seconds (polling).

UI/UX Tests
Theme toggle: Click the sun/moon icon in the top bar — verify light/dark switch persists after reload.

Onboarding tour: Login for the first time → verify the tour triggers. Click the ? button in the top bar to replay.

Responsive: Resize below 900px → verify sidebar collapses and mobile layouts adapt.

Empty states: Navigate to pages with no data → verify friendly messages appear.

Loading states: Refresh pages → verify spinners show during fetch.

Key Workflows >>

Ticket Lifecycle
[User creates ticket]
        ↓
      open
        ↓ (admin triage)
   in_progress
        ↓ (admin fixes)
    resolved
        ↓ (user confirms)
     closed


 Asset Lifecycle >>
[Admin adds asset] → assigned
                        ↓
                  maintenance
                        ↓
                    returned
                        ↓
                   (reassign)
                        ↓
                    assigned
                
OTP Authentication (Passwordless)
1. User enters email
2. Backend generates 6-digit code, stores in user.otp
3. EmailJS sends code (or toast fallback)
4. User submits code
5. Backend verifies → clears user.otp (single-use)
6. Login succeeds, token issued

Ticket Activity Audit
Every mutation logs an entry:
{
  "ticketId": "t1",
  "action": "Status changed from Open to In progress",
  "createdAt": "2026-09-25T14:32:49.107Z"
}


API Endpoints
All endpoints are served by json-server from db.json.

Users
GET /users?email=...

GET /users?role=admin

POST /users

PATCH /users/:id

Tickets
GET /tickets?creatorId=...&status=...

GET /tickets/:id

POST /tickets

PATCH /tickets/:id

DELETE /tickets/:id

Assets
GET /assets?userId=...&status=...

GET /assets/:id

POST /assets

PATCH /assets/:id

Appointments
GET /appointments?userId=...&ticketId=...

POST /appointments

PATCH /appointments/:id

Conversations & Messages
GET /conversations

POST /conversations

PATCH /conversations/:id

GET /messages?conversationId=...&_sort=createdAt

POST /messages

PATCH /messages/:id

Ticket Messages & Activity
GET /ticketMessages?ticketId=...&_sort=createdAt

POST /ticketMessages

GET /ticketActivity?ticketId=...&_sort=createdAt

POST /ticketActivity

State Management
Redux Slices
Slice	Purpose	Persisted?
authSlice	User object + token	Yes (localStorage)
api (RTK Query)	Server cache	No (in-memory)
Caching Strategy
Polling:

Messages: every 3s (ChatWindow, TicketDetailsPage).

Tickets list: every 5s (OverviewPage, AdminTicketsQueue).

Refetch on focus: when tab regains focus.

Refetch on reconnect: when network restores.

Invalidation tags: every mutation invalidates related tags.

Typed Hooks:
// lib/hooks.ts
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
Always use these instead of raw useDispatch/useSelector.

Deployment
Backend (Render)
Setting	Value
Environment	Web Service (Node.js)
Build Command	npm install
Start Command	npm run server:render
The server:render script binds json-server to 0.0.0.0:$PORT.

Frontend (Vercel)
Setting	Value
Framework Preset	Vite
Build Command	npm run build
Output Directory	dist
Env Variables	VITE_API_URL=https://your-api.onrender.com
A vercel.json handles SPA rewrites:
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}




Troubleshooting
1. "Cannot connect to json-server"

Verify json-server is running on port 3000.

Check .env → VITE_API_URL=http://localhost:3000.

2. OTP not received

EmailJS may not be configured. Check the toast notification — the OTP appears there.

3. Login fails with wrong password

Use the Test Accounts above.

New accounts created via /signup have the user role.

4. Theme doesn't persist

Clear localStorage. The key is ticket-system-theme.

5. Push rejected (non-fast-forward)

Run git pull origin main --rebase first, or use --force-with-lease.

Known Limitations
Mock backend: json-server has no real auth, no relational integrity, and no race-condition handling.

Client-side auth: not secure for production — passwords are stored in db.json in plain text.

Fake token: token-${user.id}-${Date.now()} is for demo only.

Polling over WebSockets: chat uses polling (3s), not real-time.

Future Enhancements
Migrate to a real backend (Node/Express + PostgreSQL or Supabase).

Add unit/integration tests (Vitest + React Testing Library).

Replace polling with WebSockets for chat.

Add file upload for attachments.

Implement refresh tokens and proper session management.

Add internationalization (i18n).

Add audit export (CSV/PDF).

License
This project is for educational and portfolio purposes.