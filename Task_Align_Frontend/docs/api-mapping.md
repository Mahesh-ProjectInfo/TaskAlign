# Task Align – API Mapping Document

This document provides a complete, line-by-line mapping between the existing Spring Boot backend REST endpoints (`Task_Align_Backend`) and the React frontend pages and services (`Task_Align_Frontend`).

---

## 1. Authentication & User Management Module

### Endpoint 1.1: Register User
* **Module**: Authentication
* **Backend Endpoint**: `/api/auth/register`
* **HTTP Method**: `POST`
* **Authentication**: Public (`permitAll`)
* **Request DTO**: `RegisterRequest` (`fullName`, `email`, `mobileNumber`, `gender`, `state`, `country`, `password`, `confirmPassword`)
* **Response DTO**: `ApiResponse<RegisterResponse>` (`success`, `message`, `data`: `{ userId, fullName, email, mobileNumber, message }`)
* **Frontend Page**: `src/pages/auth/Register.jsx`
* **Frontend Service**: None (Currently mock local submit state)
* **Current Mock Data**: Static state inside component
* **Integration Status**: Mapped – Contract mismatch on `gender` (Enum required) and field validations.

### Endpoint 1.2: User Login
* **Module**: Authentication
* **Backend Endpoint**: `/api/auth/login`
* **HTTP Method**: `POST`
* **Authentication**: Public (`permitAll`)
* **Request DTO**: `LoginRequest` (`email`, `password`, `rememberme`)
* **Response DTO**: `ApiResponse<LoginResponse>` (`success`, `message`, `data`: `{ userId, fullName, email, mobileNumber, token, tokenType }`)
* **Frontend Page**: `src/pages/auth/Login.jsx`
* **Frontend Service**: `src/context/AuthContext.jsx`
* **Current Mock Data**: Simulates login by setting mock user state
* **Integration Status**: Mapped – Direct connection ready.

### Endpoint 1.3: Send Mobile OTP
* **Module**: Authentication
* **Backend Endpoint**: `/api/auth/send-mobile-otp`
* **HTTP Method**: `POST`
* **Authentication**: Public (`permitAll`)
* **Request DTO**: `MobileOtpRequest` (`mobileNumber`)
* **Response DTO**: `ApiResponse<String>` (`success`, `message`, `data`)
* **Frontend Page**: `src/pages/auth/Login.jsx` (OTP login tab)
* **Frontend Service**: None
* **Current Mock Data**: Static timer state
* **Integration Status**: Mapped.

### Endpoint 1.4: Mobile Login
* **Module**: Authentication
* **Backend Endpoint**: `/api/auth/mobile-login`
* **HTTP Method**: `POST`
* **Authentication**: Public (`permitAll`)
* **Request DTO**: `MobileLoginRequest` (`mobileNumber`, `otp`)
* **Response DTO**: `ApiResponse<LoginResponse>`
* **Frontend Page**: `src/pages/auth/Login.jsx`
* **Frontend Service**: `src/context/AuthContext.jsx`
* **Current Mock Data**: Mock state
* **Integration Status**: Mapped.

### Endpoint 1.5: Forgot Password (Send OTP)
* **Module**: Authentication
* **Backend Endpoint**: `/api/auth/forgot-password`
* **HTTP Method**: `POST`
* **Authentication**: Public (`permitAll`)
* **Request DTO**: `ForgotPasswordRequest` (`email`)
* **Response DTO**: `ApiResponse<String>`
* **Frontend Page**: `src/pages/auth/ForgotPassword.jsx`
* **Frontend Service**: None
* **Current Mock Data**: Step navigation state
* **Integration Status**: Mapped.

### Endpoint 1.6: Verify OTP
* **Module**: Authentication
* **Backend Endpoint**: `/api/auth/verify-otp`
* **HTTP Method**: `POST`
* **Authentication**: Public (`permitAll`)
* **Request DTO**: `VerifyOtpRequest` (`email`, `otp`)
* **Response DTO**: `ApiResponse<String>`
* **Frontend Page**: `src/pages/auth/ForgotPassword.jsx`
* **Frontend Service**: None
* **Current Mock Data**: Step navigation state
* **Integration Status**: Mapped.

### Endpoint 1.7: Reset Password
* **Module**: Authentication
* **Backend Endpoint**: `/api/auth/reset-password`
* **HTTP Method**: `POST`
* **Authentication**: Public (`permitAll`)
* **Request DTO**: `ResetPasswordRequest` (`email`, `otp`, `newPassword`, `confirmPassword`)
* **Response DTO**: `ApiResponse<String>`
* **Frontend Page**: `src/pages/auth/ForgotPassword.jsx`
* **Frontend Service**: None
* **Current Mock Data**: Step navigation state
* **Integration Status**: Mapped.

### Endpoint 1.8: Edit Profile
* **Module**: User Profile
* **Backend Endpoint**: `/api/auth/edit-profile`
* **HTTP Method**: `PUT`
* **Authentication**: Protected (`Bearer JWT`)
* **Request DTO**: `EditProfileRequest` (`fullName`, `mobileNumber`, `state`, `country`)
* **Response DTO**: `ApiResponse<ProfileResponse>`
* **Frontend Page**: `src/pages/settings/Settings.jsx`
* **Frontend Service**: `src/context/AuthContext.jsx`
* **Current Mock Data**: Local form state
* **Integration Status**: Mapped.

### Endpoint 1.9: Change Password
* **Module**: User Profile
* **Backend Endpoint**: `/api/auth/change-password`
* **HTTP Method**: `PUT`
* **Authentication**: Protected (`Bearer JWT`)
* **Request DTO**: `ChangePasswordRequest` (`oldPassword`, `newPassword`, `confirmPassword`)
* **Response DTO**: `ApiResponse<String>`
* **Frontend Page**: `src/pages/settings/Settings.jsx`
* **Frontend Service**: None
* **Current Mock Data**: Local form state
* **Integration Status**: Mapped.

---

## 2. Master Data Management Module

### Endpoint 2.1: Get All Assignment Types
* **Module**: Master Data
* **Backend Endpoint**: `/api/assignment-types`
* **HTTP Method**: `GET`
* **Authentication**: Protected (`Bearer JWT`)
* **Request DTO**: None
* **Response DTO**: `List<AssignmentTypeResponse>` (`assignmentTypeId`, `assignmentTypeName`, `isDeleted`)
* **Frontend Page**: `src/pages/master-data/*`, `src/pages/assignment/CreateAssignment.jsx`
* **Frontend Service**: `src/context/MasterDataContext.jsx`
* **Current Mock Data**: `MD_ASSIGNMENT_TYPES` array in `constants.js`
* **Integration Status**: Mapped – Mismatch: Frontend uses String name; Backend requires `assignmentTypeId` (Long).

### Endpoint 2.2: Create Assignment Type
* **Module**: Master Data
* **Backend Endpoint**: `/api/assignment-types`
* **HTTP Method**: `POST`
* **Authentication**: Protected (`Bearer JWT`)
* **Request DTO**: `AssignmentTypeRequest` (`assignmentTypeName`)
* **Response DTO**: `AssignmentTypeResponse`
* **Frontend Page**: `src/pages/master-data/*`
* **Frontend Service**: `src/context/MasterDataContext.jsx`
* **Current Mock Data**: Local React array state
* **Integration Status**: Mapped.

### Endpoint 2.3: Get All Roles
* **Module**: Master Data
* **Backend Endpoint**: `/api/roles`
* **HTTP Method**: `GET`
* **Authentication**: Protected (`Bearer JWT`)
* **Request DTO**: None
* **Response DTO**: `List<RoleResponse>` (`roleId`, `assignmentTypeId`, `assignmentTypeName`, `roleName`)
* **Frontend Page**: `src/pages/master-data/RoleMaster.jsx`
* **Frontend Service**: `src/context/MasterDataContext.jsx`
* **Current Mock Data**: `buildInitialRoles()` in `constants.js`
* **Integration Status**: Mapped – Mismatch: Frontend filters roles by string assignment type name, Backend uses `assignmentTypeId`.

### Endpoint 2.4: Create Role
* **Module**: Master Data
* **Backend Endpoint**: `/api/roles`
* **HTTP Method**: `POST`
* **Authentication**: Protected (`Bearer JWT`)
* **Request DTO**: `RoleRequest` (`assignmentTypeId`, `roleName`)
* **Response DTO**: `RoleResponse`
* **Frontend Page**: `src/pages/master-data/RoleMaster.jsx`
* **Frontend Service**: `src/context/MasterDataContext.jsx`
* **Current Mock Data**: `addRole` in `MasterDataContext`
* **Integration Status**: Mapped.

### Endpoint 2.5: Update Role
* **Module**: Master Data
* **Backend Endpoint**: `/api/roles/{id}`
* **HTTP Method**: `PUT`
* **Authentication**: Protected (`Bearer JWT`)
* **Request DTO**: `RoleRequest` (`assignmentTypeId`, `roleName`)
* **Response DTO**: `RoleResponse`
* **Frontend Page**: `src/pages/master-data/RoleMaster.jsx`
* **Frontend Service**: `src/context/MasterDataContext.jsx`
* **Current Mock Data**: `updateRole` in `MasterDataContext`
* **Integration Status**: Mapped.

### Endpoint 2.6: Delete Role
* **Module**: Master Data
* **Backend Endpoint**: `/api/roles/{id}`
* **HTTP Method**: `DELETE`
* **Authentication**: Protected (`Bearer JWT`)
* **Request DTO**: None
* **Response DTO**: `String`
* **Frontend Page**: `src/pages/master-data/RoleMaster.jsx`
* **Frontend Service**: `src/context/MasterDataContext.jsx`
* **Current Mock Data**: `deleteRole` in `MasterDataContext`
* **Integration Status**: Mapped.

### Endpoint 2.7: Get All Skills
* **Module**: Master Data
* **Backend Endpoint**: `/api/skills`
* **HTTP Method**: `GET`
* **Authentication**: Protected (`Bearer JWT`)
* **Request DTO**: None
* **Response DTO**: `List<SkillResponse>` (`skillId`, `assignmentTypeId`, `assignmentTypeName`, `skillName`, `isDeleted`)
* **Frontend Page**: `src/pages/master-data/SkillMaster.jsx`
* **Frontend Service**: `src/context/MasterDataContext.jsx`
* **Current Mock Data**: `buildInitialSkills()` in `constants.js`
* **Integration Status**: Mapped.

### Endpoint 2.8: Create Skill
* **Module**: Master Data
* **Backend Endpoint**: `/api/skills`
* **HTTP Method**: `POST`
* **Authentication**: Protected (`Bearer JWT`)
* **Request DTO**: `SkillRequest` (`assignmentTypeId`, `skillName`)
* **Response DTO**: `SkillResponse`
* **Frontend Page**: `src/pages/master-data/SkillMaster.jsx`
* **Frontend Service**: `src/context/MasterDataContext.jsx`
* **Current Mock Data**: `addSkill` in `MasterDataContext`
* **Integration Status**: Mapped.

### Endpoint 2.9: Update Skill
* **Module**: Master Data
* **Backend Endpoint**: `/api/skills/{id}`
* **HTTP Method**: `PUT`
* **Authentication**: Protected (`Bearer JWT`)
* **Request DTO**: `SkillRequest` (`assignmentTypeId`, `skillName`)
* **Response DTO**: `SkillResponse`
* **Frontend Page**: `src/pages/master-data/SkillMaster.jsx`
* **Frontend Service**: `src/context/MasterDataContext.jsx`
* **Current Mock Data**: `updateSkill` in `MasterDataContext`
* **Integration Status**: Mapped.

### Endpoint 2.10: Delete Skill
* **Module**: Master Data
* **Backend Endpoint**: `/api/skills/{id}`
* **HTTP Method**: `DELETE`
* **Authentication**: Protected (`Bearer JWT`)
* **Request DTO**: None
* **Response DTO**: `String`
* **Frontend Page**: `src/pages/master-data/SkillMaster.jsx`
* **Frontend Service**: `src/context/MasterDataContext.jsx`
* **Current Mock Data**: `deleteSkill` in `MasterDataContext`
* **Integration Status**: Mapped.

### Endpoint 2.11: Get All Resources
* **Module**: Master Data
* **Backend Endpoint**: `/api/resources`
* **HTTP Method**: `GET`
* **Authentication**: Protected (`Bearer JWT`)
* **Request DTO**: None
* **Response DTO**: `List<ResourceResponse>` (`resourceId`, `resourceName`, `roleId`, `roleName`, `skills`: `List<SkillResponse>`, `assignmentTypeId`, `assignmentTypeName`, `monthlySalary`, `performanceRating`)
* **Frontend Page**: `src/pages/master-data/ResourceManagement.jsx`
* **Frontend Service**: `src/context/MasterDataContext.jsx`
* **Current Mock Data**: `SEED_RESOURCES` array in `constants.js`
* **Integration Status**: Mapped – Mismatch: Frontend uses string role name & string skills; Backend expects numeric `roleId` and `List<Long> skillIds`.

### Endpoint 2.12: Create Resource
* **Module**: Master Data
* **Backend Endpoint**: `/api/resources`
* **HTTP Method**: `POST`
* **Authentication**: Protected (`Bearer JWT`)
* **Request DTO**: `ResourceRequest` (`resourceName`, `roleId`, `skillIds`, `assignmentTypeId`, `monthlySalary`, `performanceRating`)
* **Response DTO**: `ResourceResponse`
* **Frontend Page**: `src/pages/master-data/ResourceManagement.jsx`
* **Frontend Service**: `src/context/MasterDataContext.jsx`
* **Current Mock Data**: `addResource` in `MasterDataContext`
* **Integration Status**: Mapped.

### Endpoint 2.13: Update Resource
* **Module**: Master Data
* **Backend Endpoint**: `/api/resources/{id}`
* **HTTP Method**: `PUT`
* **Authentication**: Protected (`Bearer JWT`)
* **Request DTO**: `ResourceRequest`
* **Response DTO**: `ResourceResponse`
* **Frontend Page**: `src/pages/master-data/ResourceManagement.jsx`
* **Frontend Service**: `src/context/MasterDataContext.jsx`
* **Current Mock Data**: `updateResource` in `MasterDataContext`
* **Integration Status**: Mapped.

### Endpoint 2.14: Delete Resource
* **Module**: Master Data
* **Backend Endpoint**: `/api/resources/{id}`
* **HTTP Method**: `DELETE`
* **Authentication**: Protected (`Bearer JWT`)
* **Request DTO**: None
* **Response DTO**: `String`
* **Frontend Page**: `src/pages/master-data/ResourceManagement.jsx`
* **Frontend Service**: `src/context/MasterDataContext.jsx`
* **Current Mock Data**: `deleteResource` in `MasterDataContext`
* **Integration Status**: Mapped.

### Endpoint 2.15: Bulk Upload Resources
* **Module**: Master Data
* **Backend Endpoint**: `/api/bulk-upload/resources`
* **HTTP Method**: `POST`
* **Authentication**: Protected (`Bearer JWT`)
* **Request DTO**: Multipart Form Data (`file`)
* **Response DTO**: `BulkUploadResponse` (`totalRecords`, `successRecords`, `failedRecords`, `message`)
* **Frontend Page**: `src/pages/master-data/ResourceManagement.jsx`
* **Frontend Service**: None
* **Current Mock Data**: Mock CSV parser state
* **Integration Status**: Mapped.

---

## 3. Assignment & Constraint Management Module

### Endpoint 3.1: Create Assignment
* **Module**: Assignment Management
* **Backend Endpoint**: `/api/v1/assignments`
* **HTTP Method**: `POST`
* **Authentication**: Protected (`Bearer JWT`)
* **Request DTO**: `CreateAssignmentRequest` (`assignmentName`, `assignmentTypeId`, `optimizationType`)
* **Response DTO**: `AssignmentResponse` (`assignmentId`, `assignmentName`, `assignmentTypeId`, `assignmentTypeName`, `optimizationType`, `assignmentStatus`)
* **Frontend Page**: `src/pages/assignment/CreateAssignment.jsx` (Step 1)
* **Frontend Service**: `src/context/AssignmentDraftContext.jsx`
* **Current Mock Data**: In-memory draft context state
* **Integration Status**: Mapped.

### Endpoint 3.2: Get All Assignments
* **Module**: Assignment Management
* **Backend Endpoint**: `/api/v1/assignments`
* **HTTP Method**: `GET`
* **Authentication**: Protected (`Bearer JWT`)
* **Request DTO**: None
* **Response DTO**: `List<AssignmentResponse>`
* **Frontend Page**: `src/pages/history/AssignmentHistory.jsx`
* **Frontend Service**: None
* **Current Mock Data**: Mock history list array
* **Integration Status**: Mapped.

### Endpoint 3.3: Add Resources to Assignment
* **Module**: Assignment Management
* **Backend Endpoint**: `/api/v1/assignments/{assignmentId}/resources`
* **HTTP Method**: `POST`
* **Authentication**: Protected (`Bearer JWT`)
* **Request DTO**: `AddAssignmentResourcesRequest` (`resourceIds`: `List<Long>`)
* **Response DTO**: `List<AssignmentResourceResponse>`
* **Frontend Page**: `src/pages/assignment/CreateAssignment.jsx` (Step 2)
* **Frontend Service**: `src/context/AssignmentDraftContext.jsx`
* **Current Mock Data**: In-memory draft state
* **Integration Status**: Mapped.

### Endpoint 3.4: Create Task for Assignment
* **Module**: Assignment Management
* **Backend Endpoint**: `/api/v1/assignments/{assignmentId}/tasks`
* **HTTP Method**: `POST`
* **Authentication**: Protected (`Bearer JWT`)
* **Request DTO**: `CreateTaskRequest` (`taskName`, `estimatedDays`)
* **Response DTO**: `TaskResponse` (`taskId`, `assignmentId`, `taskName`, `estimatedDays`)
* **Frontend Page**: `src/pages/assignment/CreateAssignment.jsx` (Step 3)
* **Frontend Service**: `src/context/AssignmentDraftContext.jsx`
* **Current Mock Data**: In-memory draft state
* **Integration Status**: Mapped.

### Endpoint 3.5: Add Skills to Task
* **Module**: Assignment Management
* **Backend Endpoint**: `/api/v1/tasks/{taskId}/skills`
* **HTTP Method**: `POST`
* **Authentication**: Protected (`Bearer JWT`)
* **Request DTO**: `AddTaskSkillsRequest` (`skillIds`: `List<Long>`)
* **Response DTO**: `List<TaskSkillResponse>` (`taskSkillId`, `taskId`, `skillId`)
* **Frontend Page**: `src/pages/assignment/CreateAssignment.jsx` (Step 3)
* **Frontend Service**: `src/context/AssignmentDraftContext.jsx`
* **Current Mock Data**: In-memory draft state
* **Integration Status**: Mapped.

### Endpoint 3.6: Add Constraints to Assignment
* **Module**: Assignment Management
* **Backend Endpoint**: `/api/v1/assignments/{assignmentId}/constraints`
* **HTTP Method**: `POST`
* **Authentication**: Protected (`Bearer JWT`)
* **Request DTO**: `CreateAssignmentConstraintRequest` (`budget`, `timelineDays`, `workingDaysPerMonth`)
* **Response DTO**: `AssignmentConstraintResponse` (`assignmentConstraintId`, `assignmentId`, `budget`, `timelineDays`, `workingDaysPerMonth`)
* **Frontend Page**: `src/pages/assignment/CreateAssignment.jsx` (Step 4)
* **Frontend Service**: `src/context/AssignmentDraftContext.jsx`
* **Current Mock Data**: In-memory draft state
* **Integration Status**: Mapped.

---

## 4. Hungarian Optimization & Matrix Module

### Endpoint 4.1: Preview Optimization Matrix
* **Module**: Optimization Engine
* **Backend Endpoint**: `/api/optimization/preview/{assignmentId}`
* **HTTP Method**: `POST`
* **Authentication**: Public (`permitAll`)
* **Request DTO**: None (Path Variable `assignmentId`)
* **Response DTO**: `OptimizationPreviewDTO` (`assignmentId`, `assignmentName`, `assignmentType`, `optimizationType`, `budget`, `timelineDays`, `workingDaysPerMonth`, `totalResources`, `eligibleResources`, `ineligibleResources`, `totalTasks`, `matrix`, `valid`, `validationIssues`, `status`)
* **Frontend Page**: `src/pages/assignment/CreateAssignment.jsx` (Step 5) & `ProcessingAssignment.jsx`
* **Frontend Service**: `src/utils/optimization.js`
* **Current Mock Data**: Client-side synthetic matrix generation in `optimization.js`
* **Integration Status**: Mapped – Frontend currently computes matrix locally; will switch to backend preview API.

### Endpoint 4.2: Execute Hungarian Optimization
* **Module**: Optimization Engine
* **Backend Endpoint**: `/api/optimization/generate/{assignmentId}`
* **HTTP Method**: `POST`
* **Authentication**: Public (`permitAll`)
* **Request DTO**: None (Path Variable `assignmentId`)
* **Response DTO**: `AssignmentResultDTO` (`assignmentId`, `assignmentName`, `assignmentType`, `optimizationType`, `budget`, `timelineDays`, `workingDaysPerMonth`, `totalResources`, `totalTasks`, `taskAssignments`, `matrix`, `totalCost`, `assignmentStatus`, `totalSavedMoney`, `budgetStatus`, `timelineStatus`, `executionTime`)
* **Frontend Page**: `src/pages/assignment/AssignmentResults.jsx`
* **Frontend Service**: `src/utils/optimization.js`
* **Current Mock Data**: Client-side Hungarian solver in `optimization.js`
* **Integration Status**: Mapped – Mismatch: Frontend result state stores local solver format, backend returns `AssignmentResultDTO`.

---

## 5. Dashboard & Analytics Module

### Endpoint 5.1: Get Dashboard Summary
* **Module**: Dashboard
* **Backend Endpoint**: `/api/dashboard/summary`
* **HTTP Method**: `GET`
* **Authentication**: Protected (`Bearer JWT`)
* **Request DTO**: None
* **Response DTO**: `ApiResponse<DashboardResponse>` (`cards`, `charts`)
* **Frontend Page**: `src/pages/dashboard/Dashboard.jsx`
* **Frontend Service**: None
* **Current Mock Data**: Static mock card numbers and static Chart.js arrays
* **Integration Status**: Mapped.

---

## 6. Reports Module

### Endpoint 6.1: Download Excel Report
* **Module**: Reports
* **Backend Endpoint**: `/api/report/excel/{id}`
* **HTTP Method**: `GET`
* **Authentication**: Protected (`Bearer JWT`)
* **Request DTO**: None (Path Variable `id`)
* **Response DTO**: File Stream (Excel Download)
* **Frontend Page**: `src/pages/assignment/AssignmentResults.jsx`
* **Frontend Service**: None
* **Current Mock Data**: Client-side CSV generator
* **Integration Status**: Mapped.
