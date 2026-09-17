import { createContext, useContext, useMemo, useState, useCallback, useEffect } from "react";
import { assignmentTypeService } from "@/services/assignmentTypeService.js";
import { roleService } from "@/services/roleService.js";
import { skillService } from "@/services/skillService.js";
import { resourceService } from "@/services/resourceService.js";
import { parseApiError } from "@/utils/errorHandler.js";
import { useAuth } from "@/context/AuthContext.jsx";
import { MD_ASSIGNMENT_TYPES } from "@/components/master-data/constants.js";

const MasterDataContext = createContext(null);

const norm = (v) => (v || "").trim();
const eqCI = (a, b) => norm(a).toLowerCase() === norm(b).toLowerCase();

export function MasterDataProvider({ children }) {
  const { token, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Master Data States
  const [assignmentTypes, setAssignmentTypes] = useState([]);
  const [roles, setRoles] = useState([]);
  const [skills, setSkills] = useState([]);
  const [resources, setResources] = useState([]);

  // Auto-Seed Assignment Types if backend database is empty
  const autoSeedAssignmentTypes = useCallback(async () => {
    try {
      const seeded = [];
      for (const tName of MD_ASSIGNMENT_TYPES) {
        try {
          const res = await assignmentTypeService.create({ assignmentTypeName: tName });
          if (res && res.assignmentTypeId) {
            seeded.push(res);
          }
        } catch {
          // Ignore duplicate / creation errors if already existing
        }
      }
      if (seeded.length > 0) {
        const latestTypes = await assignmentTypeService.getAll().catch(() => seeded);
        if (Array.isArray(latestTypes)) {
          setAssignmentTypes(latestTypes);
        }
      }
    } catch {
      // Ignore auto-seed errors
    }
  }, []);

  // Fetch all master data from Spring Boot Backend
  const refreshMasterData = useCallback(async () => {
    if (!token && !isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      let [typesRes, rolesRes, skillsRes, resourcesRes] = await Promise.all([
        assignmentTypeService.getAll().catch(() => null),
        roleService.getAll().catch(() => null),
        skillService.getAll().catch(() => null),
        resourceService.getAll().catch(() => null),
      ]);

      // If backend has no assignment types seeded yet, auto-seed default ones
      if (Array.isArray(typesRes) && typesRes.length === 0) {
        await autoSeedAssignmentTypes();
        typesRes = await assignmentTypeService.getAll().catch(() => null);
      }

      if (Array.isArray(typesRes)) {
        setAssignmentTypes(typesRes);
      }

      if (Array.isArray(rolesRes)) {
        setRoles(
          rolesRes.map((r) => ({
            id: r.roleId,
            roleId: r.roleId,
            type: r.assignmentTypeName,
            assignmentTypeId: r.assignmentTypeId,
            name: r.roleName,
            roleName: r.roleName,
          })),
        );
      }

      if (Array.isArray(skillsRes)) {
        setSkills(
          skillsRes
            .filter((s) => !s.isDeleted)
            .map((s) => ({
              id: s.skillId,
              skillId: s.skillId,
              type: s.assignmentTypeName,
              assignmentTypeId: s.assignmentTypeId,
              name: s.skillName,
              skillName: s.skillName,
            })),
        );
      }

      if (Array.isArray(resourcesRes)) {
        setResources(
          resourcesRes.map((res) => ({
            id: res.resourceId,
            resourceId: res.resourceId,
            type: res.assignmentTypeName,
            assignmentTypeId: res.assignmentTypeId,
            name: res.resourceName,
            resourceName: res.resourceName,
            role: res.roleName,
            roleId: res.roleId,
            salary: res.monthlySalary,
            rating: res.performanceRating,
            skills: (res.skills || []).map((s) => s.skillName),
            rawSkills: res.skills || [],
          })),
        );
      }
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.message);
    } finally {
      setLoading(false);
    }
  }, [token, isAuthenticated, autoSeedAssignmentTypes]);

  // Initial fetch when authenticated; reset state when unauthenticated
  useEffect(() => {
    if (token) {
      refreshMasterData();
    } else {
      setAssignmentTypes([]);
      setRoles([]);
      setSkills([]);
      setResources([]);
      setError(null);
    }
  }, [token, refreshMasterData]);

  // Dynamic Assignment Types Names List
  const assignmentTypesList = useMemo(() => {
    if (assignmentTypes.length > 0) {
      return assignmentTypes.map((t) => t.assignmentTypeName);
    }
    return MD_ASSIGNMENT_TYPES;
  }, [assignmentTypes]);

  // Robust Resolver: Ensures valid Assignment Type ID (resolves by numeric ID, name, or auto-creates on backend if missing)
  const ensureAssignmentTypeId = useCallback(
    async (typeInput) => {
      if (!typeInput) return null;

      // 1. Direct number
      if (typeof typeInput === "number" && typeInput > 0) return typeInput;

      const inputStr = String(typeInput).trim();

      // 2. Numerical string check
      const parsedNum = Number(inputStr);
      if (!Number.isNaN(parsedNum) && parsedNum > 0) {
        const byId = assignmentTypes.find((t) => t.assignmentTypeId === parsedNum);
        if (byId) return byId.assignmentTypeId;
      }

      // 3. Name check in current assignmentTypes state
      const found = assignmentTypes.find((t) => eqCI(t.assignmentTypeName, inputStr));
      if (found) return found.assignmentTypeId;

      // 4. Try fetching latest assignment types from backend first
      try {
        const latestTypes = await assignmentTypeService.getAll();
        if (Array.isArray(latestTypes) && latestTypes.length > 0) {
          setAssignmentTypes(latestTypes);
          const matched = latestTypes.find((t) => eqCI(t.assignmentTypeName, inputStr));
          if (matched) return matched.assignmentTypeId;
        }
      } catch {
        // Continue to auto-creation fallback
      }

      // 5. Auto-create assignment type on backend if missing
      try {
        const created = await assignmentTypeService.create({ assignmentTypeName: inputStr });
        if (created && created.assignmentTypeId) {
          setAssignmentTypes((prev) => [...prev, created]);
          return created.assignmentTypeId;
        }
      } catch {
        return null;
      }

      return null;
    },
    [assignmentTypes],
  );

  // --- ROLES CRUD ---
  const addRole = useCallback(
    async (typeInput, nameInput) => {
      const n = norm(nameInput);
      if (!typeInput || !n) return { ok: false, error: "Assignment Type and Role Name are required." };

      const typeId = await ensureAssignmentTypeId(typeInput);
      if (!typeId) return { ok: false, error: "Invalid Assignment Type selected." };

      try {
        const created = await roleService.create({ assignmentTypeId: typeId, roleName: n });
        const newRole = {
          id: created.roleId,
          roleId: created.roleId,
          type: created.assignmentTypeName || (typeof typeInput === "string" ? typeInput : ""),
          assignmentTypeId: created.assignmentTypeId,
          name: created.roleName,
          roleName: created.roleName,
        };
        setRoles((prev) => [...prev, newRole]);
        return { ok: true, data: newRole };
      } catch (err) {
        const parsed = parseApiError(err);
        return { ok: false, error: parsed.message };
      }
    },
    [ensureAssignmentTypeId],
  );

  const updateRole = useCallback(
    async (roleId, typeInput, nameInput) => {
      const n = norm(nameInput);
      if (!typeInput || !n) return { ok: false, error: "Assignment Type and Role Name are required." };

      const typeId = await ensureAssignmentTypeId(typeInput);
      if (!typeId) return { ok: false, error: "Invalid Assignment Type selected." };

      try {
        const updated = await roleService.update(roleId, { assignmentTypeId: typeId, roleName: n });
        const updatedRole = {
          id: updated.roleId,
          roleId: updated.roleId,
          type: updated.assignmentTypeName || (typeof typeInput === "string" ? typeInput : ""),
          assignmentTypeId: updated.assignmentTypeId,
          name: updated.roleName,
          roleName: updated.roleName,
        };
        setRoles((prev) => prev.map((r) => (r.id === roleId || r.roleId === roleId ? updatedRole : r)));
        return { ok: true, data: updatedRole };
      } catch (err) {
        const parsed = parseApiError(err);
        return { ok: false, error: parsed.message };
      }
    },
    [ensureAssignmentTypeId],
  );

  const deleteRole = useCallback(async (roleId) => {
    try {
      await roleService.delete(roleId);
      setRoles((prev) => prev.filter((r) => r.id !== roleId && r.roleId !== roleId));
      return { ok: true };
    } catch (err) {
      const parsed = parseApiError(err);
      return { ok: false, error: parsed.message };
    }
  }, []);

  // --- SKILLS CRUD ---
  const addSkill = useCallback(
    async (typeInput, nameInput) => {
      const n = norm(nameInput);
      if (!typeInput || !n) return { ok: false, error: "Assignment Type and Skill Name are required." };

      const typeId = await ensureAssignmentTypeId(typeInput);
      if (!typeId) return { ok: false, error: "Invalid Assignment Type selected." };

      try {
        const created = await skillService.create({ assignmentTypeId: typeId, skillName: n });
        const newSkill = {
          id: created.skillId,
          skillId: created.skillId,
          type: created.assignmentTypeName || (typeof typeInput === "string" ? typeInput : ""),
          assignmentTypeId: created.assignmentTypeId,
          name: created.skillName,
          skillName: created.skillName,
        };
        setSkills((prev) => [...prev, newSkill]);
        return { ok: true, data: newSkill };
      } catch (err) {
        const parsed = parseApiError(err);
        return { ok: false, error: parsed.message };
      }
    },
    [ensureAssignmentTypeId],
  );

  const updateSkill = useCallback(
    async (skillId, typeInput, nameInput) => {
      const n = norm(nameInput);
      if (!typeInput || !n) return { ok: false, error: "Assignment Type and Skill Name are required." };

      const typeId = await ensureAssignmentTypeId(typeInput);
      if (!typeId) return { ok: false, error: "Invalid Assignment Type selected." };

      try {
        const updated = await skillService.update(skillId, { assignmentTypeId: typeId, skillName: n });
        const updatedSkill = {
          id: updated.skillId,
          skillId: updated.skillId,
          type: updated.assignmentTypeName || (typeof typeInput === "string" ? typeInput : ""),
          assignmentTypeId: updated.assignmentTypeId,
          name: updated.skillName,
          skillName: updated.skillName,
        };
        setSkills((prev) => prev.map((s) => (s.id === skillId || s.skillId === skillId ? updatedSkill : s)));
        return { ok: true, data: updatedSkill };
      } catch (err) {
        const parsed = parseApiError(err);
        return { ok: false, error: parsed.message };
      }
    },
    [ensureAssignmentTypeId],
  );

  const deleteSkill = useCallback(async (skillId) => {
    try {
      await skillService.delete(skillId);
      setSkills((prev) => prev.filter((s) => s.id !== skillId && s.skillId !== skillId));
      return { ok: true };
    } catch (err) {
      const parsed = parseApiError(err);
      return { ok: false, error: parsed.message };
    }
  }, []);

  // --- RESOURCES CRUD ---
  const addResource = useCallback(
    async (payload) => {
      const name = norm(payload.name);
      if (!payload.type || !name) return { ok: false, error: "Assignment Type and Resource Name are required." };

      const typeId = await ensureAssignmentTypeId(payload.type);
      if (!typeId) return { ok: false, error: "Invalid Assignment Type selected." };

      // Resolve Role ID
      let roleId = payload.roleId;
      if (!roleId && payload.role) {
        const matchedRole = roles.find((r) => r.assignmentTypeId === typeId && eqCI(r.name, payload.role));
        if (matchedRole) roleId = matchedRole.roleId;
      }

      // If role not found in DB under that type, create it on backend first
      if (!roleId && payload.role) {
        try {
          const createdRole = await roleService.create({ assignmentTypeId: typeId, roleName: payload.role });
          if (createdRole && createdRole.roleId) {
            roleId = createdRole.roleId;
            setRoles((prev) => [
              ...prev,
              {
                id: createdRole.roleId,
                roleId: createdRole.roleId,
                type: createdRole.assignmentTypeName || payload.type,
                assignmentTypeId: createdRole.assignmentTypeId,
                name: createdRole.roleName,
                roleName: createdRole.roleName,
              },
            ]);
          }
        } catch {
          // ignore
        }
      }
      if (!roleId) return { ok: false, error: "Role is required." };

      // Resolve Skill IDs
      let skillIds = payload.skillIds || [];
      if ((!skillIds || skillIds.length === 0) && Array.isArray(payload.skills)) {
        const resolvedSkillIds = [];
        for (const skillName of payload.skills) {
          let matchedSkill = skills.find((s) => s.assignmentTypeId === typeId && eqCI(s.name, skillName));
          if (!matchedSkill) {
            try {
              const createdSkill = await skillService.create({ assignmentTypeId: typeId, skillName });
              if (createdSkill && createdSkill.skillId) {
                matchedSkill = {
                  id: createdSkill.skillId,
                  skillId: createdSkill.skillId,
                  type: createdSkill.assignmentTypeName || payload.type,
                  assignmentTypeId: createdSkill.assignmentTypeId,
                  name: createdSkill.skillName,
                  skillName: createdSkill.skillName,
                };
                setSkills((prev) => [...prev, matchedSkill]);
              }
            } catch {
              // ignore
            }
          }
          if (matchedSkill) {
            resolvedSkillIds.push(matchedSkill.skillId);
          }
        }
        skillIds = resolvedSkillIds;
      }
      if (skillIds.length === 0) return { ok: false, error: "At least one valid skill is required." };

      try {
        const reqPayload = {
          resourceName: name,
          roleId,
          skillIds,
          assignmentTypeId: typeId,
          monthlySalary: Number(payload.salary),
          performanceRating: Number(payload.rating),
        };

        const resData = await resourceService.create(reqPayload);
        const newResource = {
          id: resData.resourceId,
          resourceId: resData.resourceId,
          type: resData.assignmentTypeName || payload.type,
          assignmentTypeId: resData.assignmentTypeId,
          name: resData.resourceName,
          resourceName: resData.resourceName,
          role: resData.roleName || payload.role,
          roleId: resData.roleId,
          salary: resData.monthlySalary,
          rating: resData.performanceRating,
          skills: (resData.skills || []).map((s) => s.skillName),
          rawSkills: resData.skills || [],
        };
        setResources((prev) => [...prev, newResource]);
        return { ok: true, data: newResource };
      } catch (err) {
        const parsed = parseApiError(err);
        return { ok: false, error: parsed.message };
      }
    },
    [ensureAssignmentTypeId, roles, skills],
  );

  const updateResource = useCallback(
    async (resourceId, payload) => {
      const name = norm(payload.name);
      if (!payload.type || !name) return { ok: false, error: "Assignment Type and Resource Name are required." };

      const typeId = await ensureAssignmentTypeId(payload.type);
      if (!typeId) return { ok: false, error: "Invalid Assignment Type selected." };

      let roleId = payload.roleId;
      if (!roleId && payload.role) {
        const matchedRole = roles.find((r) => r.assignmentTypeId === typeId && eqCI(r.name, payload.role));
        if (matchedRole) roleId = matchedRole.roleId;
      }
      if (!roleId) return { ok: false, error: "Role is required." };

      let skillIds = payload.skillIds || [];
      if ((!skillIds || skillIds.length === 0) && Array.isArray(payload.skills)) {
        skillIds = skills
          .filter((s) => s.assignmentTypeId === typeId && payload.skills.some((sn) => eqCI(sn, s.name)))
          .map((s) => s.skillId);
      }
      if (skillIds.length === 0) return { ok: false, error: "At least one valid skill is required." };

      // Deduplicate selected skill IDs
      const uniqueSkillIds = Array.from(new Set(skillIds));

      try {
        const reqPayload = {
          resourceName: name,
          roleId,
          skillIds: uniqueSkillIds,
          assignmentTypeId: typeId,
          monthlySalary: Number(payload.salary),
          performanceRating: Number(payload.rating),
        };

        // Find current skills linked to resource in state
        const currentRes = resources.find((r) => r.id === resourceId || r.resourceId === resourceId);
        const currentSkillIds = (currentRes?.rawSkills || []).map((s) => s.skillId);

        // Check if any selected skill ID overlaps with current skill IDs in DB
        const hasOverlap = uniqueSkillIds.some((id) => currentSkillIds.includes(id));

        if (hasOverlap) {
          // Find a bridge skill ID from master skills that is NEITHER in currentSkillIds NOR in uniqueSkillIds
          const bridgeSkill = skills.find(
            (s) => !currentSkillIds.includes(s.skillId) && !uniqueSkillIds.includes(s.skillId),
          );

          if (bridgeSkill) {
            // Step 1: Reconcile DB by setting temporary bridge skill
            await resourceService.update(resourceId, {
              ...reqPayload,
              skillIds: [bridgeSkill.skillId],
            }).catch(() => null);
          }
        }

        // Step 2: Final update with unique target skills
        const resData = await resourceService.update(resourceId, reqPayload);
        const updatedResource = {
          id: resData.resourceId,
          resourceId: resData.resourceId,
          type: resData.assignmentTypeName || payload.type,
          assignmentTypeId: resData.assignmentTypeId,
          name: resData.resourceName,
          resourceName: resData.resourceName,
          role: resData.roleName || payload.role,
          roleId: resData.roleId,
          salary: resData.monthlySalary,
          rating: resData.performanceRating,
          skills: (resData.skills || []).map((s) => s.skillName),
          rawSkills: resData.skills || [],
        };
        setResources((prev) =>
          prev.map((r) => (r.id === resourceId || r.resourceId === resourceId ? updatedResource : r)),
        );
        return { ok: true, data: updatedResource };
      } catch (err) {
        const parsed = parseApiError(err);
        return { ok: false, error: parsed.message };
      }
    },
    [ensureAssignmentTypeId, roles, skills, resources],
  );

  const deleteResource = useCallback(async (resourceId) => {
    try {
      await resourceService.delete(resourceId);
      setResources((prev) => prev.filter((r) => r.id !== resourceId && r.resourceId !== resourceId));
      return { ok: true };
    } catch (err) {
      const parsed = parseApiError(err);
      return { ok: false, error: parsed.message };
    }
  }, []);

  const bulkUploadResources = useCallback(
    async (file) => {
      try {
        const response = await resourceService.bulkUpload(file);
        await refreshMasterData();
        return { ok: true, data: response };
      } catch (err) {
        const parsed = parseApiError(err);
        return { ok: false, error: parsed.message };
      }
    },
    [refreshMasterData],
  );

  const bulkUploadRoles = useCallback(
    async (validRoles) => {
      let success = 0;
      let failed = 0;
      for (const item of validRoles) {
        const res = await addRole(item.type, item.name);
        if (res.ok) success++;
        else failed++;
      }
      await refreshMasterData();
      let msg = "";
      if (failed === 0) {
        msg = `Bulk Upload Completed Successfully. All ${success} roles saved.`;
      } else {
        msg = `Bulk Upload Completed with warnings. Total: ${validRoles.length}, Success: ${success}, Failed: ${failed}.`;
      }
      return { ok: true, data: { message: msg, success, failed, total: validRoles.length } };
    },
    [addRole, refreshMasterData],
  );

  const bulkUploadSkills = useCallback(
    async (validSkills) => {
      let success = 0;
      let failed = 0;
      for (const item of validSkills) {
        const res = await addSkill(item.type, item.name);
        if (res.ok) success++;
        else failed++;
      }
      await refreshMasterData();
      let msg = "";
      if (failed === 0) {
        msg = `Bulk Upload Completed Successfully. All ${success} skills saved.`;
      } else {
        msg = `Bulk Upload Completed with warnings. Total: ${validSkills.length}, Success: ${success}, Failed: ${failed}.`;
      }
      return { ok: true, data: { message: msg, success, failed, total: validSkills.length } };
    },
    [addSkill, refreshMasterData],
  );

  const rolesByType = useCallback(
    (typeInput) => {
      if (!typeInput || typeInput === "All") return roles;
      return roles.filter((r) => eqCI(r.type, typeInput) || r.assignmentTypeId === Number(typeInput));
    },
    [roles],
  );

  const skillsByType = useCallback(
    (typeInput) => {
      if (!typeInput || typeInput === "All") return skills;
      return skills.filter((s) => eqCI(s.type, typeInput) || s.assignmentTypeId === Number(typeInput));
    },
    [skills],
  );

  const value = useMemo(
    () => ({
      loading,
      error,
      assignmentTypes,
      assignmentTypesList,
      roles,
      skills,
      resources,
      refreshMasterData,
      addRole,
      updateRole,
      deleteRole,
      addSkill,
      updateSkill,
      deleteSkill,
      addResource,
      updateResource,
      deleteResource,
      bulkUploadResources,
      bulkUploadRoles,
      bulkUploadSkills,
      rolesByType,
      skillsByType,
    }),
    [
      loading,
      error,
      assignmentTypes,
      assignmentTypesList,
      roles,
      skills,
      resources,
      refreshMasterData,
      addRole,
      updateRole,
      deleteRole,
      addSkill,
      updateSkill,
      deleteSkill,
      addResource,
      updateResource,
      deleteResource,
      bulkUploadResources,
      bulkUploadRoles,
      bulkUploadSkills,
      rolesByType,
      skillsByType,
    ],
  );

  return <MasterDataContext.Provider value={value}>{children}</MasterDataContext.Provider>;
}

export function useMasterData() {
  const ctx = useContext(MasterDataContext);
  if (!ctx) throw new Error("useMasterData must be used within MasterDataProvider");
  return ctx;
}
