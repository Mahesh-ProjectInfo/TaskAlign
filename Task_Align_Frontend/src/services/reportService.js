import apiClient from "@/services/apiClient.js";
import { parseApiError } from "@/utils/errorHandler.js";
import { toast } from "react-toastify";

export const reportService = {
  // Download Excel Report for a specific assignment ID
  downloadExcel: async (assignmentId, defaultName) => {
    try {
      const response = await apiClient.get(`/api/report/excel/${assignmentId}`, {
        responseType: "blob",
      });

      // Handle server error returned as JSON Blob
      if (response.data && response.data.type === "application/json") {
        const text = await response.data.text();
        const json = JSON.parse(text);
        throw json;
      }

      // Extract filename from Content-Disposition header if present
      let fileName = defaultName || `Assignment_${assignmentId}.xlsx`;
      const disposition = response.headers["content-disposition"];
      if (disposition && disposition.includes("filename=")) {
        const matched = disposition.match(/filename=["']?([^"';]+)["']?/);
        if (matched && matched[1]) {
          fileName = matched[1];
        }
      }

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      toast.success(`Report downloaded: ${fileName}`);
      return { ok: true, fileName };
    } catch (err) {
      const parsed = parseApiError(err);
      toast.error(parsed.message || "Failed to download Excel report.");
      return { ok: false, error: parsed.message };
    }
  },

  // Download PDF Report for a specific assignment ID
  downloadPdf: async (assignmentId, defaultName) => {
    try {
      const response = await apiClient.get(`/api/report/pdf/${assignmentId}`, {
        responseType: "blob",
      });

      // Handle server error returned as JSON Blob
      if (response.data && response.data.type === "application/json") {
        const text = await response.data.text();
        const json = JSON.parse(text);
        throw json;
      }

      // Extract filename from Content-Disposition header if present
      let fileName = defaultName || `Assignment_${assignmentId}.pdf`;
      const disposition = response.headers["content-disposition"];
      if (disposition && disposition.includes("filename=")) {
        const matched = disposition.match(/filename=["']?([^"';]+)["']?/);
        if (matched && matched[1]) {
          fileName = matched[1];
        }
      }

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      toast.success(`PDF report downloaded: ${fileName}`);
      return { ok: true, fileName };
    } catch (err) {
      const parsed = parseApiError(err);
      toast.error(parsed.message || "Failed to download PDF report.");
      return { ok: false, error: parsed.message };
    }
  },

  // Get Report History
  getHistory: async () => {
    try {
      const res = await apiClient.get("/api/report/history");
      return res.data;
    } catch (err) {
      const parsed = parseApiError(err);
      toast.error(parsed.message || "Failed to fetch report history.");
      return [];
    }
  },
};
