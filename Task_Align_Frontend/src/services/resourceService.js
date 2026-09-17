import apiClient from "./apiClient.js";

/**
 * Service for /api/resources & /api/bulk-upload/resources REST endpoints.
 */
export const resourceService = {
  async getAll() {
    const res = await apiClient.get("/api/resources");
    return res.data;
  },

  async getById(id) {
    const res = await apiClient.get(`/api/resources/${id}`);
    return res.data;
  },

  async searchByName(name) {
    const res = await apiClient.get(`/api/resources/search?name=${encodeURIComponent(name)}`);
    return res.data;
  },

  async getByRole(roleId) {
    const res = await apiClient.get(`/api/resources/role/${roleId}`);
    return res.data;
  },

  async getBySkill(skillId) {
    const res = await apiClient.get(`/api/resources/skill/${skillId}`);
    return res.data;
  },

  async create(payload) {
    // payload: { resourceName, roleId, skillIds: [Long], assignmentTypeId, monthlySalary, performanceRating }
    const res = await apiClient.post("/api/resources", payload);
    return res.data;
  },

  async update(id, payload) {
    // payload: { resourceName, roleId, skillIds: [Long], assignmentTypeId, monthlySalary, performanceRating }
    const res = await apiClient.put(`/api/resources/${id}`, payload);
    return res.data;
  },

  async delete(id) {
    const res = await apiClient.delete(`/api/resources/${id}`);
    return res.data;
  },

  async bulkUpload(file) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await apiClient.post("/api/bulk-upload/resources", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },
};
