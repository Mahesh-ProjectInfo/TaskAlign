import apiClient from "@/services/apiClient.js";

export const businessRuleService = {
  // 1. Skill Matching
  getSkillMatching: async (assignmentId) => {
    const res = await apiClient.get(`/api/v1/assignments/${assignmentId}/skill-matching`);
    return res.data;
  },

  // 2. Eligible Resource Identification
  getEligibleResources: async (assignmentId) => {
    const res = await apiClient.get(`/api/v1/assignments/${assignmentId}/eligible-resources`);
    return res.data;
  },

  // 3. Matrix Input Preparation (Downstream Handoff object for Member 4)
  getMatrixInput: async (assignmentId) => {
    const res = await apiClient.get(`/api/v1/assignments/${assignmentId}/matrix-input`);
    return res.data;
  },
};
