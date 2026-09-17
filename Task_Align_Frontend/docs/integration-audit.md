# Task Align – Integration Audit Report (Phase 0)

> [!IMPORTANT]
> **Phase 0 Rule Compliance**: This document represents a complete, read-only audit of both `Task_Align_Backend` and `Task_Align_Frontend`. No backend files have been modified. No frontend UI redesign or integration code has been implemented.

---

## 1. Backend Architecture Summary
`Task_Align_Backend` is built on **Spring Boot 3** (Java 17) with **Spring Security**, **Jakarta Validation**, **Hibernate/JPA**, and **Lombok**.

* **Security Model**: Stateless session architecture using **JWT (JSON Web Token)** authentication. Password hashing via `BCryptPasswordEncoder`.
* **CORS**: Enabled globally via `CorsConfig` (`@CrossOrigin`) and `SecurityConfig`.
* **Controller Layer**: 18 `@RestController` classes exposing RESTful HTTP endpoints.
* **Service & Repository Layers**: Domain services mapped to JPA Repositories for entities (`Assignment`, `AssignmentType`, `Role`, `Skill`, `Resource`, `Task`, `Constraint`, `User`, `ReportHistory`).
* **Hungarian Optimization Engine**: Implemented in Java service builder (`OptimizationService`, `OptimizationInputBuilderService`, `MatrixInputService`) to calculate minimum cost or maximum profit resource-task assignments.
* **Error Handling**: Centralized global exception handler (`GlobalExceptionHandler`) utilizing `@RestControllerAdvice`.

---

## 2. Frontend Architecture Summary
`Task_Align_Frontend` is built on **React 19**, **Vite 8**, **React Router v7**, **TailwindCSS v4**, and **Shadcn UI** component utilities.

* **HTTP Client**: `axios` instance configured in `src/services/apiClient.js` with Bearer token request interceptor (`localStorage.getItem("ta_token")`).
* **State & Context Management**:
  * `AuthContext.jsx`: User authentication and session state.
  * `MasterDataContext.jsx`: In-memory CRUD state for roles, skills, and resources.
  * `AssignmentDraftContext.jsx`: Multi-step assignment creation wizard state.
* **Routing**: 13 client routes managed in `src/routes/AppRoutes.jsx` under `AppLayout` and `AuthLayout`.
* **Hungarian Algorithm Mock**: Client-side JavaScript implementation in `src/utils/optimization.js` for local matrix building and Hungarian optimization.

---

## 3. Backend API Inventory
The backend provides **34 REST endpoints** across 18 controllers:

| Controller | HTTP Method | Endpoint Path | Authentication | Description |
| :--- | :--- | :--- | :--- | :--- |
| `AuthController` | `POST` | `/api/auth/register` | Public | Register new user |
| `AuthController` | `POST` | `/api/auth/login` | Public | User email/password login |
| `AuthController` | `POST` | `/api/auth/send-mobile-otp` | Public | Send mobile OTP |
| `AuthController` | `POST` | `/api/auth/mobile-login` | Public | Login via mobile OTP |
| `AuthController` | `POST` | `/api/auth/forgot-password` | Public | Request password reset OTP |
| `AuthController` | `POST` | `/api/auth/verify-otp` | Public | Verify reset OTP |
| `AuthController` | `POST` | `/api/auth/reset-password` | Public | Reset password with OTP |
| `AuthController` | `PUT` | `/api/auth/edit-profile` | Protected | Update user profile |
| `AuthController` | `PUT` | `/api/auth/change-password` | Protected | Update user password |
| `AssignmentTypeController` | `POST` | `/api/assignment-types` | Protected | Create assignment type |
| `AssignmentTypeController` | `GET` | `/api/assignment-types` | Protected | Fetch all assignment types |
| `AssignmentTypeController` | `GET` | `/api/assignment-types/{id}` | Protected | Fetch assignment type by ID |
| `AssignmentTypeController` | `PUT` | `/api/assignment-types/{id}` | Protected | Update assignment type |
| `AssignmentTypeController` | `DELETE` | `/api/assignment-types/{id}` | Protected | Soft delete assignment type |
| `RoleController` | `POST` | `/api/roles` | Protected | Create role |
| `RoleController` | `GET` | `/api/roles` | Protected | Fetch all roles |
| `RoleController` | `GET` | `/api/roles/{id}` | Protected | Fetch role by ID |
| `RoleController` | `PUT` | `/api/roles/{id}` | Protected | Update role |
| `RoleController` | `DELETE` | `/api/roles/{id}` | Protected | Delete role |
| `SkillController` | `POST` | `/api/skills` | Protected | Create skill |
| `SkillController` | `GET` | `/api/skills` | Protected | Fetch all skills |
| `SkillController` | `GET` | `/api/skills/{id}` | Protected | Fetch skill by ID |
| `SkillController` | `PUT` | `/api/skills/{id}` | Protected | Update skill |
| `SkillController` | `DELETE` | `/api/skills/{id}` | Protected | Delete skill |
| `ResourceController` | `POST` | `/api/resources` | Protected | Create resource |
| `ResourceController` | `GET` | `/api/resources` | Protected | Fetch all resources |
| `ResourceController` | `GET` | `/api/resources/search` | Protected | Search resources by name |
| `ResourceController` | `GET` | `/api/resources/{id}` | Protected | Fetch resource by ID |
| `ResourceController` | `PUT` | `/api/resources/{id}` | Protected | Update resource |
| `ResourceController` | `DELETE` | `/api/resources/{id}` | Protected | Delete resource |
| `ResourceController` | `GET` | `/api/resources/role/{roleId}` | Protected | Filter resources by role |
| `ResourceController` | `GET` | `/api/resources/skill/{skillId}` | Protected | Filter resources by skill |
| `BulkUploadController` | `POST` | `/api/bulk-upload/resources` | Protected | Bulk upload resources CSV/Excel |
| `AssignmentController` | `POST` | `/api/v1/assignments` | Protected | Create assignment header |
| `AssignmentController` | `GET` | `/api/v1/assignments` | Protected | Fetch all assignments |
| `AssignmentController` | `GET` | `/api/v1/assignments/{id}` | Protected | Fetch assignment details |
| `AssignmentController` | `PUT` | `/api/v1/assignments/{id}` | Protected | Update assignment header |
| `AssignmentController` | `DELETE` | `/api/v1/assignments/{id}` | Protected | Delete assignment |
| `AssignmentResourceController` | `POST` | `/api/v1/assignments/{id}/resources` | Protected | Attach resources to assignment |
| `AssignmentResourceController` | `GET` | `/api/v1/assignments/{id}/resources` | Protected | Get resources of assignment |
| `AssignmentResourceController` | `PUT` | `/api/v1/assignments/{id}/resources` | Protected | Update assignment resources |
| `AssignmentResourceController` | `DELETE` | `/api/v1/assignments/{id}/resources` | Protected | Remove assignment resources |
| `TaskController` | `POST` | `/api/v1/assignments/{id}/tasks` | Protected | Create task for assignment |
| `TaskController` | `GET` | `/api/v1/assignments/{id}/tasks` | Protected | Get tasks for assignment |
| `TaskController` | `PUT` | `/api/v1/assignments/{id}/tasks/{taskId}` | Protected | Update task |
| `TaskController` | `DELETE` | `/api/v1/assignments/{id}/tasks/{taskId}` | Protected | Delete task |
| `TaskSkillController` | `POST` | `/api/v1/tasks/{taskId}/skills` | Protected | Attach skills to task |
| `TaskSkillController` | `GET` | `/api/v1/tasks/{taskId}/skills` | Protected | Get task skills |
| `TaskSkillController` | `PUT` | `/api/v1/tasks/{taskId}/skills` | Protected | Update task skills |
| `TaskSkillController` | `DELETE` | `/api/v1/tasks/{taskId}/skills` | Protected | Remove task skills |
| `AssignmentConstraintController` | `POST` | `/api/v1/assignments/{id}/constraints` | Protected | Create assignment constraints |
| `AssignmentConstraintController` | `GET` | `/api/v1/assignments/{id}/constraints` | Protected | Get assignment constraints |
| `AssignmentConstraintController` | `PUT` | `/api/v1/assignments/{id}/constraints/{cId}` | Protected | Update assignment constraints |
| `AssignmentConstraintController` | `DELETE` | `/api/v1/assignments/{id}/constraints/{cId}` | Protected | Soft delete constraints |
| `PreviewAssignmentController` | `GET` | `/api/v1/assignments/{id}/preview` | Protected | Fetch full assignment preview |
| `EligibleResourceController` | `GET` | `/api/v1/assignments/{id}/eligible-resources` | Protected | Fetch eligible resources |
| `SkillMatchingController` | `GET` | `/api/v1/assignments/{id}/skill-matching` | Protected | Fetch skill matching breakdown |
| `MatrixInputController` | `GET` | `/api/v1/assignments/{id}/matrix-input` | Protected | Prepare matrix input |
| `OptimizationController` | `POST` | `/api/optimization/preview/{id}` | Public | Preview cost/profit matrix |
| `OptimizationController` | `POST` | `/api/optimization/generate/{id}` | Public | Execute Hungarian Optimization |
| `DashboardController` | `GET` | `/api/dashboard/summary` | Protected | Fetch complete dashboard summary |
| `DashboardController` | `GET` | `/api/dashboard/cards` | Protected | Fetch dashboard metric cards |
| `DashboardController` | `GET` | `/api/dashboard/charts` | Protected | Fetch dashboard chart datasets |
| `ReportController` | `GET` | `/api/report/excel/{id}` | Protected | Download Excel report |
| `ReportController` | `GET` | `/api/report/history` | Protected | Fetch report download history |

---

## 4. Frontend Service Inventory
* `apiClient.js`: Axios instance with base URL configuration and JWT Bearer token request interceptor.
* `AuthContext.jsx`: Provides authentication state (`user`, `login`, `logout`).
* `MasterDataContext.jsx`: Manages mock roles, skills, and resources state.
* `AssignmentDraftContext.jsx`: Manages multi-step assignment creation wizard state.
* `optimization.js`: Client-side synthetic cost/profit matrix builder and Hungarian algorithm solver.

---

## 5. API-to-Screen Mapping

| Frontend Page / Component | Primary User Workflow | Required Backend Endpoint(s) |
| :--- | :--- | :--- |
| `src/pages/auth/Login.jsx` | User authentication | `POST /api/auth/login`, `POST /api/auth/mobile-login`, `POST /api/auth/send-mobile-otp` |
| `src/pages/auth/Register.jsx` | New user sign-up | `POST /api/auth/register` |
| `src/pages/auth/ForgotPassword.jsx` | Password recovery | `POST /api/auth/forgot-password`, `POST /api/auth/verify-otp`, `POST /api/auth/reset-password` |
| `src/pages/dashboard/Dashboard.jsx` | Metrics & overview charts | `GET /api/dashboard/summary` (or `/cards` + `/charts`) |
| `src/pages/master-data/RoleMaster.jsx` | Role CRUD management | `GET /api/roles`, `POST /api/roles`, `PUT /api/roles/{id}`, `DELETE /api/roles/{id}`, `GET /api/assignment-types` |
| `src/pages/master-data/SkillMaster.jsx` | Skill CRUD management | `GET /api/skills`, `POST /api/skills`, `PUT /api/skills/{id}`, `DELETE /api/skills/{id}`, `GET /api/assignment-types` |
| `src/pages/master-data/ResourceManagement.jsx` | Resource CRUD & Bulk Upload | `GET /api/resources`, `POST /api/resources`, `PUT /api/resources/{id}`, `DELETE /api/resources/{id}`, `POST /api/bulk-upload/resources` |
| `src/pages/assignment/CreateAssignment.jsx` | Multi-step assignment creation | `POST /api/v1/assignments`, `POST /api/v1/assignments/{id}/resources`, `POST /api/v1/assignments/{id}/tasks`, `POST /api/v1/tasks/{taskId}/skills`, `POST /api/v1/assignments/{id}/constraints`, `POST /api/optimization/preview/{id}` |
| `src/pages/assignment/ProcessingAssignment.jsx` | Execution simulation | `POST /api/optimization/generate/{id}` |
| `src/pages/assignment/AssignmentResults.jsx` | Optimal result breakdown & Excel export | `POST /api/optimization/generate/{id}`, `GET /api/report/excel/{id}` |
| `src/pages/history/AssignmentHistory.jsx` | View past assignments | `GET /api/v1/assignments` |
| `src/pages/settings/Settings.jsx` | Profile & security settings | `PUT /api/auth/edit-profile`, `PUT /api/auth/change-password` |

---

## 6. Authentication Requirements
* **Token Standard**: JSON Web Token (JWT) transmitted via standard HTTP header:
  `Authorization: Bearer <token>`
* **Storage Location**: Token stored in `localStorage` under key `ta_token` (or `taskalign_token`).
* **Permitted Public Endpoints**:
  * `/api/auth/**` (All login, registration, OTP, and password reset endpoints)
  * `/api/v1/auth/**`
  * `/swagger-ui/**`, `/swagger-ui.html`, `/v3/api-docs/**`
  * `/api/optimization/**` (Matrix generate and preview)
* **Protected Endpoints**: All Master Data (`/api/roles`, `/api/skills`, `/api/resources`, `/api/assignment-types`), Assignment APIs (`/api/v1/assignments/**`), Dashboard (`/api/dashboard/**`), and Reports (`/api/report/**`) strictly require a valid JWT token.

---

## 7. DTO Comparison

### Authentication DTOs
* **Login Request**: Backend expects `{ email, password, rememberme }`. Frontend form supplies `email` and `password`.
* **Login Response**: Backend returns `ApiResponse<LoginResponse>` containing `{ userId, fullName, email, mobileNumber, token, tokenType: "Bearer" }`.
* **Register Request**: Backend requires `fullName`, `email`, `mobileNumber`, `gender` (Enum: `MALE`, `FEMALE`, `OTHER`), `state`, `country`, `password`, `confirmPassword`. Frontend currently omits `gender`, `state`, and `country` dropdowns in some form states.

### Master Data DTOs
* **Roles**: Backend expects `RoleRequest` `{ assignmentTypeId: Long, roleName: String }`. Frontend mock uses `{ id: String, type: String, name: String }`.
* **Skills**: Backend expects `SkillRequest` `{ assignmentTypeId: Long, skillName: String }`. Frontend mock uses `{ id: String, type: String, name: String }`.
* **Resources**: Backend expects `ResourceRequest` `{ resourceName: String, roleId: Long, skillIds: List<Long>, assignmentTypeId: Long, monthlySalary: BigDecimal, performanceRating: BigDecimal }`. Frontend mock uses string role names and string skill arrays.

### Assignment DTOs
* **Create Assignment**: Backend expects `CreateAssignmentRequest` `{ assignmentName: String, assignmentTypeId: Long, optimizationType: Enum (COST_MINIMIZATION / PROFIT_MAXIMIZATION) }`.
* **Constraints**: Backend expects `CreateAssignmentConstraintRequest` `{ budget: BigDecimal, timelineDays: Integer, workingDaysPerMonth: Integer }`. Frontend wizard uses `budget`, `timeline`, `workingDays`.

---

## 8. Validation Comparison
* **Backend Validation**: Uses `jakarta.validation` annotations:
  * Email format (`@Email`), Password pattern regex (`@Pattern`), Size bounds (`@Size`), Non-null / Non-blank (`@NotNull`, `@NotBlank`), Decimal constraints (`@DecimalMin`).
* **Frontend Validation**: Basic Zod schema / custom JS string checks in `src/utils/validators.js`. Must be synchronized with backend validation rules during integration.

---

## 9. Error Response Comparison
* **Backend Error Response Format**:
  * Global Exceptions return a JSON map: `{ "timestamp": "...", "status": 404, "error": "Not Found", "message": "..." }`.
  * Validation Exceptions return a JSON field-error map: `{ "email": "Email address must be valid", "password": "Password is required" }`.
* **Frontend Error Handling**: Currently expects standard error toast strings. Response interceptor in `apiClient.js` needs to correctly extract `err.response.data.message` or field error maps.

---

## 10. Mock Data Mapping

| Frontend Mock Data Source | Current Structure | Target Backend API & DTO |
| :--- | :--- | :--- |
| `MD_ASSIGNMENT_TYPES` (`constants.js`) | `String[]` | `GET /api/assignment-types` -> `AssignmentTypeResponse[]` |
| `SEED_ROLES` (`constants.js`) | `{ type: string, names: string[] }[]` | `GET /api/roles` -> `RoleResponse[]` |
| `SEED_SKILLS` (`constants.js`) | `{ type: string, names: string[] }[]` | `GET /api/skills` -> `SkillResponse[]` |
| `SEED_RESOURCES` (`constants.js`) | `{ id, name, type, role, salary, rating, skills }[]` | `GET /api/resources` -> `ResourceResponse[]` |
| `EMPTY_DRAFT` (`AssignmentDraftContext.jsx`) | Single unified creation object | Multi-step `/api/v1/assignments` APIs |
| `optimization.js` matrix & Hungarian solver | Client-side JS calculation | `POST /api/optimization/generate/{id}` -> `AssignmentResultDTO` |

---

## 11. Missing Backend APIs

> [!WARNING]
> **MISSING BACKEND API – FRONTEND INTEGRATION BLOCKED**

1. **Current User Profile Fetch API (`GET /api/auth/me` or `/api/users/me`)**:
   * **Problem**: The backend provides `PUT /api/auth/edit-profile`, but lacks a `GET` endpoint to retrieve the currently logged-in user's profile details using the Bearer token upon page reload.
   * **Affected Feature**: User session restoration and header profile display.

2. **Paginated & Filtered Assignment History API (`GET /api/v1/assignments/user` or Query Filters)**:
   * **Problem**: Backend `GET /api/v1/assignments` returns an unpaginated list of all assignments across all users.
   * **Affected Feature**: `AssignmentHistory.jsx` pagination and search.

---

## 12. Frontend / Backend Mismatches

1. **API Base Path Inconsistency**:
   * Frontend `api-integration-notes.md` assumed `/api/v1/auth/login` and `/api/v1/master-data/*`.
   * Actual Backend Controllers are mapped to `/api/auth/*`, `/api/assignment-types`, `/api/roles`, `/api/skills`, `/api/resources`.

2. **Response Payload Wrapping Inconsistency**:
   * `AuthController` and `DashboardController` wrap responses in `ApiResponse<T>` (`success`, `message`, `data`).
   * Entity controllers (`AssignmentController`, `ResourceController`, `RoleController`, `SkillController`, `OptimizationController`) return raw DTOs without `ApiResponse` wrappers.

3. **Entity Linking (Strings vs. IDs)**:
   * Frontend mock services use string names for `assignmentType`, `role`, and `skills`.
   * Backend APIs require numeric foreign keys (`assignmentTypeId`, `roleId`, `skillIds`).

---

## 13. Integration Risks
1. **Creation Wizard Transactionality**: Creating an assignment header, attaching resources, adding tasks, assigning task skills, and attaching constraints requires 5 separate HTTP calls. If a middle call fails, partial data will remain in backend tables unless handled cleanly on frontend.
2. **Authentication Token Persistence**: Refreshing the browser requires re-verifying the JWT token. Without a `GET /api/auth/me` endpoint, frontend must cache profile info in `localStorage`.
3. **Form Payload Validation Fails**: Registration requires `gender` enum and specific password regex pattern. Submitting plain string values will trigger backend 400 Bad Request responses.

---

## 14. Recommended Integration Order

The recommended sequential order for integration is strictly:

1. **Phase 1 – Connectivity**: Setup environment variables (`VITE_API_BASE_URL`), configure CORS verification, and align API base paths in `apiClient.js`.
2. **Phase 2 – Authentication**: Integrate Login, Register, Forgot Password, and JWT token persistence in `AuthContext.jsx`.
3. **Phase 3 – Master Data**: Integrate Assignment Types, Roles, Skills, and Resources CRUD endpoints with ID-to-name mapping in `MasterDataContext.jsx`.
4. **Phase 4 – Assignment Management**: Connect multi-step assignment creation wizard (`CreateAssignment.jsx`) to backend `/api/v1/assignments` endpoints.
5. **Phase 5 – Business Rule Engine**: Replace local client-side matrix solver with backend `/api/optimization/generate/{id}`.
6. **Phase 6 – Reports**: Connect Excel report download to `/api/report/excel/{id}`.
7. **Phase 7 – Integration Testing**: End-to-end verification of user flows against live backend.
8. **Phase 8 – Integration Freeze**: Final cleanup and doc freeze.
