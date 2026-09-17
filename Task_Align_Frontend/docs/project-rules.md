# Task Align Frontend – Project Rules

## 1. Project Context & Separation
* **Project Root**: `Task_Align_Frontend` is the root directory of the Task Align frontend application.
* **Strict Backend Separation**: The frontend (`Task_Align_Frontend`) and backend (`Task_Align_Backend`) MUST remain completely separate repositories.
* **Zero Backend Artifact Pollution**: NEVER create frontend code, React components, CSS, frontend documentation, sprint status files, implementation logs, design tokens, or build artifacts inside the `Task_Align_Backend` folder.

---

## 2. Architecture Rules
* **Framework & Tooling**: Built with React 19, Vite, TanStack Router/React Router, and Tailwind CSS v4.
* **Component Modularity**: Maintain high component reusability and clear separation of concerns.
* **No Monolithic Files**: Avoid unnecessarily large components; decompose UI into focused, atomic components.
* **UI Logic Isolation**: Keep UI presentation components decoupled from API data fetching and state mutations.
* **Service Layer**: All API communication logic must reside strictly within `src/services/`.

---

## 3. Global Design System & Aesthetic Rules
* **Single Visual Identity**: Task Align utilizes ONE global visual identity across all public and authenticated modules.
* **Approved Color Palette**: All visual styling must use the Phase 0 global palette:
  * Primary Slate (Brand Dark): `#657166`
  * Surface Mint (Ice Mint): `#DAEBE3`
  * Warm Cream (Peach Puff): `#FDE8D3`
  * Blush Coral (Soft Salmon): `#F3C3B2`
  * Sage Neutral (Pale Border): `#CFD6C4`
  * Primary Accent (Pastel Teal): `#99CDD8`
  * Primary Text (Forest Charcoal): `#1E2421`
  * Canvas Background: `#F7FAFA`
* **Sprint 1 Primitive Reuse**: Reuse standardized primitives (`Button`, `InputField`, `DataTable`, `StatusBadge`, `StatCard`, `Modal`, `AlertMessage`).
* **Pill Design Language**: Interactive elements (CTAs, navigation items, filter tags, badges) enforce full pill rounded corners (`rounded-full`).
* **Cohesive Product Feel**: The public landing page and authenticated application must feel like the exact same product.
* **Responsive Standard**: Every UI layout must adapt seamlessly across Desktop (`1280px+`), Laptop (`1024px`), Tablet (`768px`), and Mobile (`375px+`).

---

## 4. Functionality Preservation Rules
During visual redesign sprints:
* **DO NOT** change existing business logic or user workflows unless explicitly instructed.
* **DO NOT** remove existing working features or navigation routes.
* **DO NOT** alter API endpoints, HTTP methods (`GET`, `POST`, `PUT`, `DELETE`), or query parameters.
* **DO NOT** modify request payload DTO structures or expected response schemas.
* **DO NOT** alter JWT authentication storage, header conventions, or token validation logic.

---

## 5. API Integration Rules
* **Backward Compatibility**: The frontend must remain 100% compatible with the Spring Boot backend (`Task_Align_Backend`).
* **Phase Isolation**: Frontend redesign (Phase 1) is decoupled from live backend integration (Phase 2).
* **Contract Integrity**: No endpoint URL modifications, contract structure shifts, or payload alterations are permitted for visual formatting purposes.

---

## 6. Development Phases Strategy
* **Phase 1 — Frontend Redesign (Current Phase)**:
  * Global Design System implementation.
  * Application UI redesign & component refactoring.
  * Public Landing Page construction.
  * UX enhancements & mock data preservation.
* **Phase 2 — Frontend ↔ Backend Integration (Future Phase)**:
  * Connect frontend service layer to Spring Boot backend APIs.
  * Replace mock data providers with live HTTP endpoints.
  * Real JWT token authentication & role-based routing.
  * End-to-end integration testing.

---

## 7. Team Development Context
The frontend architecture supports parallel module development across 4 team responsibilities:
* **Member 1**: Authentication, User Management & Main Dashboard.
* **Member 2**: Master Data Management (Roles, Skills, Resources, Types) & Report Management.
* **Member 3**: Assignment Management, Tasks, Task Skills, Constraints & Business Rule Engine.
* **Member 4**: Matrix Generation, Hungarian Optimization Engine & Assignment Result Management.

---

## 8. Sprint Management & Freeze Workflow
Every frontend sprint follows a strict cycle:

$$\text{Design} \longrightarrow \text{Implementation} \longrightarrow \text{Review} \longrightarrow \text{Testing} \longrightarrow \text{Freeze} \longrightarrow \text{Next Sprint}$$

* **Sprint Tracking**: Every sprint must record its status, file changes, features, and verification in `docs/sprint-status.md` and `docs/implementation-log.md`.
* **Sequential Execution**: Complete, test, verify, and freeze one sprint before starting the next.
