import apiClient from "@/services/apiClient.js";
import { parseApiError } from "@/utils/errorHandler.js";
import { toast } from "react-toastify";

export const dashboardService = {
  // Get full dashboard summary (cards + charts combined)
  getSummary: async () => {
    try {
      const res = await apiClient.get("/api/dashboard/summary");
      return res.data?.data || res.data;
    } catch (err) {
      const parsed = parseApiError(err);
      toast.error(parsed.message || "Failed to load dashboard summary.");
      return null;
    }
  },

  // Get dashboard cards count metrics
  getCards: async () => {
    try {
      const res = await apiClient.get("/api/dashboard/cards");
      return res.data?.data || res.data;
    } catch (err) {
      const parsed = parseApiError(err);
      toast.error(parsed.message || "Failed to load dashboard cards.");
      return null;
    }
  },

  // Get dashboard charts distribution data
  getCharts: async () => {
    try {
      const res = await apiClient.get("/api/dashboard/charts");
      return res.data?.data || res.data;
    } catch (err) {
      const parsed = parseApiError(err);
      toast.error(parsed.message || "Failed to load dashboard charts.");
      return null;
    }
  },

  // Optional individual chart methods if needed
  getAssignmentStatusChart: async () => {
    try {
      const res = await apiClient.get("/api/dashboard/charts/assignment-status");
      return res.data?.data || res.data || [];
    } catch {
      return [];
    }
  },

  getAssignmentTypeChart: async () => {
    try {
      const res = await apiClient.get("/api/dashboard/charts/assignment-type");
      return res.data?.data || res.data || [];
    } catch {
      return [];
    }
  },

  getMonthlyAssignmentChart: async () => {
    try {
      const res = await apiClient.get("/api/dashboard/charts/monthly-assignments");
      return res.data?.data || res.data || [];
    } catch {
      return [];
    }
  },
};
