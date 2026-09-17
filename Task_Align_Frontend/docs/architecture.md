# Task Align Frontend – Architecture Documentation

## 1. Overview & Technology Stack
Task Align Frontend is a high-performance single-page React application built for resource allocation and task assignment management using the Hungarian Algorithm.

* **Core Framework**: React 19 (`react`, `react-dom`)
* **Build System & Bundler**: Vite 8 (`vite`, `@vitejs/plugin-react`)
* **Styling Framework**: Tailwind CSS v4 (`@tailwindcss/vite`, `@import "tailwindcss"`)
* **Routing**: React Router / TanStack Router (`react-router-dom`, `@tanstack/react-router`)
* **Data Fetching & Caching**: TanStack React Query (`@tanstack/react-query`)
* **Form Handling & Validation**: React Hook Form (`react-hook-form`) + Zod (`zod`) + `@hookform/resolvers`
* **Icons**: Lucide React (`lucide-react`)
* **Data Visualization**: Recharts (`recharts`) & Chart.js (`react-chartjs-2`)

---

## 2. Directory Structure

```
Task_Align_Frontend/
│
├── docs/                      # Frontend Documentation & Sprint Tracking
│   ├── project-rules.md       # Permanent Frontend Project Rules
│   ├── sprint-status.md       # Sprint Progress & Build Results
│   ├── implementation-log.md  # Development History & Chronological Log
│   ├── architecture.md        # Architecture & Component Technical Overview
│   └── api-integration-notes.md # API Client & Backend Integration Bridge
│
├── pics/                      # Design Reference Images (color palette, landing page)
├── public/                    # Static Public Assets (favicons, manifest)
│
├── src/
│   ├── assets/                # Images, Illustrations, SVGs
│   ├── components/
│   │   ├── common/            # Design System Primitive UI Components
│   │   │   ├── ActionButtons.jsx
│   │   │   ├── AlertMessage.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Checkbox.jsx
│   │   │   ├── ConfirmDialog.jsx
│   │   │   ├── DataTable.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── InputField.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── PageHeader.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── PasswordInput.jsx
│   │   │   ├── SearchInput.jsx
│   │   │   ├── SelectField.jsx
│   │   │   ├── SkillTag.jsx
│   │   │   ├── StatCard.jsx
│   │   │   └── StatusBadge.jsx
│   │   │
│   │   ├── layout/            # Application Shell & Navigation
│   │   │   ├── AppLayout.jsx  # Main App Shell (Sidebar + TopNavbar + Content)
│   │   │   ├── AuthLayout.jsx # Centered Auth Shell (Login / Register)
│   │   │   ├── Sidebar.jsx    # Collapsible Vertical Sidebar Nav
│   │   │   ├── TopNavbar.jsx  # Glassmorphic Sticky Header
│   │   │   └── UserProfileDropdown.jsx
│   │   │
│   │   └── ui/                # Base UI Primitives (Card, Button, PageHeader)
│   │
│   ├── context/               # Global React Contexts (AuthContext, ThemeContext)
│   ├── hooks/                 # Custom React Hooks (useAuth, useAssignments)
│   ├── pages/                 # Route Views
│   │   ├── activity-logs/     # Activity Audit Trail
│   │   ├── assignment/        # Assignment Management & Hungarian Optimizer
│   │   ├── auth/              # Login & Registration Pages
│   │   ├── dashboard/         # Core Dashboard Analytics & Key Metrics
│   │   ├── help-guide/        # User Guide & Documentation
│   │   ├── history/           # Optimization History & Past Runs
│   │   ├── master-data/       # Roles, Skills, Resources, Assignment Types
│   │   ├── report-history/    # Result Reports & Export History
│   │   └── settings/          # System Configuration & Preferences
│   │
│   ├── routes/                # Application Route Maps & Guard Controllers
│   ├── services/              # API Client & Data Services Layer
│   ├── utils/                 # Constants, Helper Functions, Formatters
│   ├── App.jsx                # Main Application Component Root
│   ├── main.jsx               # React Mount Point & Context Provider Shell
│   └── styles.css             # Global Design System CSS & Tailwind Theme Tokens
│
├── package.json               # Dependency & Script Manifest
└── vite.config.ts             # Vite Configuration & Alias Resolvers
```

---

## 3. Component & Design System Architecture
The application uses a 3-tier component architecture:

1. **Design System Primitives (`src/components/common/`)**: Highly reusable, unopinionated UI elements (`Button`, `InputField`, `DataTable`, `StatusBadge`, `StatCard`, `Modal`, `AlertMessage`). All primitives encapsulate the Phase 0 visual identity (pill borders, ice mint fills, pale sage borders).
2. **Layout Containers (`src/components/layout/`)**: Application shell components (`AppLayout`, `Sidebar`, `TopNavbar`) managing global navigation state, mobile responsiveness, and page breadcrumbs.
3. **Module Views (`src/pages/`)**: Composite page modules encapsulating workflow logic for Dashboard, Master Data, Assignment Wizard, Hungarian Matrix Optimizer, Reports, and Settings.

---

## 4. State Management & Service Strategy
* **Local UI State**: Managed via React `useState` and `useReducer` for form inputs, wizard step progression, filter chips, and modal visibility.
* **Global Context**: Managed via `AuthContext` for user session tokens, active role profiles, and global user preferences.
* **Server State & Caching**: TanStack React Query manages remote data fetching, mutation invalidations, and cached response payloads.

---

## 5. Mock Data vs Future Backend Integration Strategy
* **Phase 1 Strategy (Current)**: Data services in `src/services/` utilize structured local JSON mock providers and local storage caches to simulate backend responses. This enables complete visual redesign and UX testing without backend dependencies.
* **Phase 2 Strategy (Future)**: The service layer interfaces in `src/services/` will be pointed to real Spring Boot REST API endpoints (`/api/v1/*`). The component layer will require zero refactoring as service function signatures remain unchanged.
