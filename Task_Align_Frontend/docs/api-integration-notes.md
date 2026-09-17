# Task Align Frontend – API Integration Notes

This document defines the integration bridge between the React frontend (`Task_Align_Frontend`) and the Spring Boot backend (`Task_Align_Backend`).

> [!IMPORTANT]
> **Phase Isolation Rule**: During Phase 1 (Frontend Redesign), API integration notes are for tracking and preparation only. No backend endpoint contracts, HTTP methods, or DTO payloads shall be modified.

---

## 1. Configuration & Client Setup
* **Base URL**: Configurable via `.env` environment variable `VITE_API_BASE_URL` (Defaults to `http://localhost:8080/api/v1`).
* **HTTP Client**: Axios instance (`src/services/apiClient.js`).
* **Request Interceptor**: Automatically attaches JWT Bearer Tokens from session storage to outgoing HTTP requests (`Authorization: Bearer <token>`).
* **Response Interceptor**: Intercepts `401 Unauthorized` responses to handle session expiration and redirect users to `/login`.

---

## 2. Authentication & Authorization Mechanism
* **Authentication Method**: JWT (JSON Web Token) authentication.
* **Token Storage**: Encrypted JWT stored in `localStorage` under key `taskalign_token`.
* **Login Endpoint**: `POST /api/v1/auth/login` (Payload: `{ email, password }`).
* **Registration Endpoint**: `POST /api/v1/auth/register` (Payload: `{ name, email, password, role }`).

---

## 3. Backend Module Endpoint Mapping

### Module 1: Authentication & Dashboard (Member 1)
* `POST /api/v1/auth/login` — User authentication.
* `POST /api/v1/auth/register` — User registration.
* `GET /api/v1/users/me` — Current user profile.

### Module 2: Master Data Management (Member 2)
* `GET /api/v1/master-data/assignment-types` — Retrieve assignment types.
* `POST /api/v1/master-data/assignment-types` — Create assignment type.
* `GET /api/v1/master-data/roles` — Retrieve roles.
* `GET /api/v1/master-data/resources` — Retrieve resources.
* `POST /api/v1/master-data/resources` — Create resource.
* `GET /api/v1/master-data/skills` — Retrieve skills.
* `POST /api/v1/master-data/skills` — Create skill.

### Module 3: Assignment Management & Constraints (Member 3)
* `POST /api/v1/assignments` — Create assignment (Sprint 1).
* `GET /api/v1/assignments` — View all assignments (Sprint 1).
* `GET /api/v1/assignments/{assignmentId}` — View assignment details (Sprint 1).
* `PUT /api/v1/assignments/{assignmentId}` — Update assignment (Sprint 1).
* `DELETE /api/v1/assignments/{assignmentId}` — Soft delete assignment (Sprint 1).
* `POST /api/v1/assignments/{assignmentId}/resources` — Add assignment resources (Sprint 2).
* `GET /api/v1/assignments/{assignmentId}/resources` — View assignment resources (Sprint 2).
* `POST /api/v1/assignments/{assignmentId}/tasks` — Create task (Sprint 3).
* `GET /api/v1/assignments/{assignmentId}/tasks` — View tasks (Sprint 3).
* `POST /api/v1/tasks/{taskId}/skills` — Assign skills to task (Sprint 4).
* `GET /api/v1/tasks/{taskId}/skills` — View task skills (Sprint 4).
* `POST /api/v1/assignments/{assignmentId}/constraints` — Add constraint (Sprint 5).
* `GET /api/v1/assignments/{assignmentId}/constraints` — View constraints (Sprint 5).
* `GET /api/v1/assignments/{assignmentId}/preview` — Retrieve complete preview response (Sprint 6).

### Module 4: Hungarian Algorithm & Matrix Optimization (Member 4)
* `POST /api/v1/assignments/{assignmentId}/matrix/generate` — Generate cost/profit matrix.
* `POST /api/v1/assignments/{assignmentId}/optimize` — Execute Hungarian Algorithm.
* `GET /api/v1/assignments/{assignmentId}/results` — View optimal assignment pairings.

---

## 4. Request & Response Payload Conventions

### Standardized Success Response Structure
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "timestamp": "2026-08-12T00:11:17Z"
}
```

### Standardized Error Response Structure
```json
{
  "success": false,
  "status": 400,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Email address must be valid" }
  ],
  "timestamp": "2026-08-12T00:11:17Z"
}
```

---

## 5. Integration Status Summary
* **Phase 1 Status**: Frontend service layer currently provides structured mock data matching exact DTO signatures.
* **Phase 2 Status**: Pending frontend redesign completion and freeze.
