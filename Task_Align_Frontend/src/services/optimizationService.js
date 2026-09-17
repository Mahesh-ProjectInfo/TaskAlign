import apiClient from "@/services/apiClient.js";

export const optimizationService = {
  // Fetch backend-generated matrix & optimization preview for assignment
  getPreview: async (assignmentId) => {
    const res = await apiClient.post(`/api/optimization/preview/${assignmentId}`);
    return res.data;
  },

  // Trigger backend optimization algorithm execution (if requested downstream)
  generateOptimization: async (assignmentId) => {
    const res = await apiClient.post(`/api/optimization/generate/${assignmentId}`);
    return res.data;
  },
};
