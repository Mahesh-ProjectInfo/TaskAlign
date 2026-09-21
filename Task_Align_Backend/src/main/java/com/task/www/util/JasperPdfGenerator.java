package com.task.www.util;

import java.io.InputStream;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.task.www.dto.AssignmentResultDTO;
import com.task.www.dto.MatrixCellDTO;
import com.task.www.dto.MatrixDTO;
import com.task.www.dto.MatrixRowDTO;
import com.task.www.dto.TaskAssignmentDTO;

import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;

@Component
public class JasperPdfGenerator {

    private static final Logger log = LoggerFactory.getLogger(JasperPdfGenerator.class);

    private volatile JasperReport cachedJasperReport;

    @PostConstruct
    public void init() {
        System.setProperty("java.awt.headless", "true");
        try {
            getOrCompileReport();
            log.info("JasperReport template successfully precompiled and cached at startup.");
        } catch (Exception e) {
            log.warn("JasperReport precompilation at startup postponed to first request: {}", e.getMessage());
        }
    }

    private JasperReport getOrCompileReport() throws Exception {
        if (cachedJasperReport == null) {
            synchronized (this) {
                if (cachedJasperReport == null) {
                    long start = System.currentTimeMillis();
                    try (InputStream jrxmlInput = getClass().getResourceAsStream("/reports/assignment_report.jrxml")) {
                        if (jrxmlInput == null) {
                            throw new IllegalStateException("Report template /reports/assignment_report.jrxml not found");
                        }
                        cachedJasperReport = JasperCompileManager.compileReport(jrxmlInput);
                    }
                    long elapsed = System.currentTimeMillis() - start;
                    log.info("Jasper report compiled successfully in {} ms", elapsed);
                }
            }
        }
        return cachedJasperReport;
    }

    public void generatePdf(AssignmentResultDTO resultDTO, OutputStream outputStream) throws Exception {
        long startTime = System.currentTimeMillis();
        JasperReport jasperReport = getOrCompileReport();

        boolean isProfit = "PROFIT_MAXIMIZATION".equalsIgnoreCase(resultDTO.getOptimizationType());
        NumberFormat currencyFormat = NumberFormat.getCurrencyInstance(new Locale("en", "IN"));

        Map<String, Object> parameters = new HashMap<>();
        parameters.put("ASSIGNMENT_NAME", resultDTO.getAssignmentName() != null ? resultDTO.getAssignmentName() : "Assignment");
        parameters.put("ASSIGNMENT_TYPE", resultDTO.getAssignmentType() != null ? resultDTO.getAssignmentType() : "—");
        parameters.put("OPTIMIZATION_TYPE", isProfit ? "Profit Maximization" : "Cost Minimization");
        parameters.put("IS_PROFIT", isProfit);

        parameters.put("BUDGET", resultDTO.getBudget() != null ? currencyFormat.format(resultDTO.getBudget()) : "₹0.00");
        parameters.put("TIMELINE", (resultDTO.getTimelineDays() != null ? resultDTO.getTimelineDays() : 0) + " Days");
        parameters.put("WORKING_DAYS", (resultDTO.getWorkingDaysPerMonth() != null ? resultDTO.getWorkingDaysPerMonth() : 0) + " Days");

        parameters.put("TOTAL_RESOURCES", resultDTO.getTotalResources() != null ? resultDTO.getTotalResources() : 0);
        parameters.put("TOTAL_TASKS", resultDTO.getTotalTasks() != null ? resultDTO.getTotalTasks() : 0);
        parameters.put("TOTAL_COST", resultDTO.getTotalCost() != null ? currencyFormat.format(resultDTO.getTotalCost()) : "₹0.00");
        parameters.put("TOTAL_SAVED_MONEY", resultDTO.getTotalSavedMoney() != null ? currencyFormat.format(resultDTO.getTotalSavedMoney()) : "₹0.00");

        parameters.put("BUDGET_STATUS", resultDTO.getBudgetStatus() != null ? resultDTO.getBudgetStatus() : "—");
        parameters.put("TIMELINE_STATUS", resultDTO.getTimelineStatus() != null ? resultDTO.getTimelineStatus() : "—");
        parameters.put("EXECUTION_TIME", (resultDTO.getExecutionTime() != null ? resultDTO.getExecutionTime() : 1) + " ms");
        parameters.put("ASSIGNMENT_STATUS", resultDTO.getAssignmentStatus() != null ? resultDTO.getAssignmentStatus() : "Completed");

        // Generate Profit Optimization Matrix HTML if Profit Maximization
        if (isProfit && resultDTO.getMatrix() != null) {
            String matrixHtml = generateMatrixHtml(resultDTO.getMatrix(), currencyFormat);
            parameters.put("PROFIT_MATRIX_HTML", matrixHtml);
        } else {
            parameters.put("PROFIT_MATRIX_HTML", "");
        }

        // Format task assignments for main table
        List<TaskAssignmentRow> tableRows = new ArrayList<>();
        if (resultDTO.getTaskAssignments() != null) {
            for (TaskAssignmentDTO ta : resultDTO.getTaskAssignments()) {
                TaskAssignmentRow row = new TaskAssignmentRow();
                row.setResourceName(ta.getResourceName() != null ? ta.getResourceName() : "Resource");
                row.setTaskName(ta.getTaskName() != null ? ta.getTaskName() : "—");
                row.setRole(ta.getRole() != null ? ta.getRole() : "—");
                row.setEstimatedDays((ta.getEstimatedDays() != null ? ta.getEstimatedDays() : 1) + " Days");
                row.setAssignedCost(ta.getAssignedCost() != null ? currencyFormat.format(ta.getAssignedCost()) : "₹0.00");
                row.setSavedMoney(ta.getSavedMoney() != null ? currencyFormat.format(ta.getSavedMoney()) : "₹0.00");
                tableRows.add(row);
            }
        }

        JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(tableRows);

        long fillStart = System.currentTimeMillis();
        JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, dataSource);
        long fillElapsed = System.currentTimeMillis() - fillStart;
        log.info("Jasper report filled in {} ms", fillElapsed);

        long exportStart = System.currentTimeMillis();
        JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);
        long exportElapsed = System.currentTimeMillis() - exportStart;
        log.info("Jasper PDF exported to stream in {} ms (total PDF generation: {} ms)", exportElapsed, (System.currentTimeMillis() - startTime));
    }

    private String generateMatrixHtml(MatrixDTO matrix, NumberFormat currencyFormat) {
        StringBuilder sb = new StringBuilder();
        sb.append("<table border='1' cellpadding='4' cellspacing='0' style='width:100%; border-collapse:collapse; font-family:sans-serif; font-size:10px;'>");

        // Header Row
        sb.append("<tr style='background-color:#F0F4F2; font-weight:bold; color:#525E57;'>");
        sb.append("<th style='border:1px solid #E2E8E4; padding:6px; text-align:left;'>Resource / Task</th>");
        if (matrix.getTaskNames() != null) {
            for (String taskName : matrix.getTaskNames()) {
                sb.append("<th style='border:1px solid #E2E8E4; padding:6px; text-align:center;'>")
                  .append(escapeHtml(taskName))
                  .append("</th>");
            }
        }
        sb.append("</tr>");

        // Rows
        if (matrix.getRows() != null) {
            for (MatrixRowDTO row : matrix.getRows()) {
                sb.append("<tr>");
                sb.append("<td style='border:1px solid #E2E8E4; padding:6px; font-weight:bold; color:#1E2421;'>")
                  .append(escapeHtml(row.getResourceName() != null ? row.getResourceName() : ""))
                  .append("</td>");

                if (row.getCells() != null) {
                    for (MatrixCellDTO cell : row.getCells()) {
                        BigDecimal val = cell.getValue();
                        String displayVal;
                        String style = "border:1px solid #E2E8E4; padding:6px; text-align:center;";

                        if (val == null || val.compareTo(BigDecimal.ZERO) == 0 || val.doubleValue() >= 999990.0) {
                            displayVal = "-";
                            style += " color:#DC2626; background-color:#FEF2F2; font-weight:bold;";
                        } else {
                            displayVal = currencyFormat.format(val);
                            if (cell.isSelected()) {
                                style += " color:#1D4ED8; background-color:#EFF6FF; font-weight:bold;";
                            } else {
                                style += " color:#1E2421;";
                            }
                        }

                        sb.append("<td style='").append(style).append("'>")
                          .append(escapeHtml(displayVal))
                          .append("</td>");
                    }
                }
                sb.append("</tr>");
            }
        }
        sb.append("</table>");
        return sb.toString();
    }

    private String escapeHtml(String text) {
        if (text == null) return "";
        return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;");
    }

    public static class TaskAssignmentRow {
        private String resourceName;
        private String taskName;
        private String role;
        private String estimatedDays;
        private String assignedCost;
        private String savedMoney;

        public String getResourceName() { return resourceName; }
        public void setResourceName(String resourceName) { this.resourceName = resourceName; }

        public String getTaskName() { return taskName; }
        public void setTaskName(String taskName) { this.taskName = taskName; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }

        public String getEstimatedDays() { return estimatedDays; }
        public void setEstimatedDays(String estimatedDays) { this.estimatedDays = estimatedDays; }

        public String getAssignedCost() { return assignedCost; }
        public void setAssignedCost(String assignedCost) { this.assignedCost = assignedCost; }

        public String getSavedMoney() { return savedMoney; }
        public void setSavedMoney(String savedMoney) { this.savedMoney = savedMoney; }
    }
}
