package com.task.www.util;

import java.io.IOException;
import java.io.OutputStream;
import java.text.NumberFormat;
import java.util.Locale;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Component;

import com.task.www.dto.AssignmentResultDTO;
import com.task.www.dto.TaskAssignmentDTO;

@Component
public class ExcelGenerator {

    public void generate(AssignmentResultDTO resultDTO, OutputStream outputStream) throws IOException {
        if (resultDTO == null) {
            throw new IllegalArgumentException("Assignment result data cannot be null");
        }

        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            XSSFSheet sheet = workbook.createSheet("Assignment Report");

            boolean isProfit = "PROFIT_MAXIMIZATION".equalsIgnoreCase(resultDTO.getOptimizationType());
            NumberFormat currencyFormat = NumberFormat.getCurrencyInstance(new Locale("en", "IN"));

            // Cell Styles
            CellStyle titleStyle = workbook.createCellStyle();
            Font titleFont = workbook.createFont();
            titleFont.setBold(true);
            titleFont.setFontHeightInPoints((short) 14);
            titleFont.setColor(IndexedColors.DARK_BLUE.getIndex());
            titleStyle.setFont(titleFont);

            CellStyle sectionStyle = workbook.createCellStyle();
            Font sectionFont = workbook.createFont();
            sectionFont.setBold(true);
            sectionFont.setFontHeightInPoints((short) 11);
            sectionFont.setColor(IndexedColors.BLUE_GREY.getIndex());
            sectionStyle.setFont(sectionFont);

            CellStyle labelStyle = workbook.createCellStyle();
            Font labelFont = workbook.createFont();
            labelFont.setBold(true);
            labelStyle.setFont(labelFont);

            CellStyle headerTableStyle = workbook.createCellStyle();
            Font tableHeaderFont = workbook.createFont();
            tableHeaderFont.setBold(true);
            tableHeaderFont.setColor(IndexedColors.WHITE.getIndex());
            headerTableStyle.setFont(tableHeaderFont);
            headerTableStyle.setFillForegroundColor(IndexedColors.GREY_80_PERCENT.getIndex());
            headerTableStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            int rowNum = 0;

            // Report Title
            Row titleRow = sheet.createRow(rowNum++);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue("TASK ALIGN - OPTIMIZATION REPORT");
            titleCell.setCellStyle(titleStyle);

            rowNum++; // Empty row

            // Section 1: Assignment Summary
            Row s1Header = sheet.createRow(rowNum++);
            Cell s1Cell = s1Header.createCell(0);
            s1Cell.setCellValue("ASSIGNMENT SUMMARY");
            s1Cell.setCellStyle(sectionStyle);

            addKeyValueRow(sheet, rowNum++, "Assignment Name", resultDTO.getAssignmentName() != null ? resultDTO.getAssignmentName() : "Assignment", labelStyle);
            addKeyValueRow(sheet, rowNum++, "Assignment Type", resultDTO.getAssignmentType() != null ? resultDTO.getAssignmentType() : "—", labelStyle);
            addKeyValueRow(sheet, rowNum++, "Optimization Strategy", isProfit ? "Profit Maximization" : "Cost Minimization", labelStyle);
            addKeyValueRow(sheet, rowNum++, "Budget", resultDTO.getBudget() != null ? currencyFormat.format(resultDTO.getBudget()) : "₹0.00", labelStyle);
            addKeyValueRow(sheet, rowNum++, "Timeline", (resultDTO.getTimelineDays() != null ? resultDTO.getTimelineDays() : 0) + " Days", labelStyle);
            addKeyValueRow(sheet, rowNum++, "Working Days / Month", (resultDTO.getWorkingDaysPerMonth() != null ? resultDTO.getWorkingDaysPerMonth() : 0) + " Days", labelStyle);

            rowNum++; // Empty row

            // Section 2: Key Metrics
            Row s2Header = sheet.createRow(rowNum++);
            Cell s2Cell = s2Header.createCell(0);
            s2Cell.setCellValue("KEY METRICS");
            s2Cell.setCellStyle(sectionStyle);

            addKeyValueRow(sheet, rowNum++, "Total Resources", String.valueOf(resultDTO.getTotalResources() != null ? resultDTO.getTotalResources() : 0), labelStyle);
            addKeyValueRow(sheet, rowNum++, "Total Tasks", String.valueOf(resultDTO.getTotalTasks() != null ? resultDTO.getTotalTasks() : 0), labelStyle);
            addKeyValueRow(sheet, rowNum++, "Total Assignment Cost", resultDTO.getTotalCost() != null ? currencyFormat.format(resultDTO.getTotalCost()) : "₹0.00", labelStyle);
            addKeyValueRow(sheet, rowNum++, "Budget Status", resultDTO.getBudgetStatus() != null ? resultDTO.getBudgetStatus() : "—", labelStyle);
            addKeyValueRow(sheet, rowNum++, "Timeline Status", resultDTO.getTimelineStatus() != null ? resultDTO.getTimelineStatus() : "—", labelStyle);
            addKeyValueRow(sheet, rowNum++, "Execution Time", (resultDTO.getExecutionTime() != null ? resultDTO.getExecutionTime() : 1) + " ms", labelStyle);
            addKeyValueRow(sheet, rowNum++, "Assignment Status", resultDTO.getAssignmentStatus() != null ? resultDTO.getAssignmentStatus() : "Completed", labelStyle);

            if (isProfit) {
                addKeyValueRow(sheet, rowNum++, "Total Saved Money", resultDTO.getTotalSavedMoney() != null ? currencyFormat.format(resultDTO.getTotalSavedMoney()) : "₹0.00", labelStyle);
            }

            rowNum++; // Empty row

            // Section 3: Optimized Assignment Table
            Row s3Header = sheet.createRow(rowNum++);
            Cell s3Cell = s3Header.createCell(0);
            s3Cell.setCellValue("OPTIMIZED ASSIGNMENT");
            s3Cell.setCellStyle(sectionStyle);

            Row tableHeader = sheet.createRow(rowNum++);
            String[] headers = isProfit
                    ? new String[]{"Resource", "Assigned Task", "Role", "Estimated Days", "Cost", "Saved Money"}
                    : new String[]{"Resource", "Assigned Task", "Role", "Estimated Days", "Cost"};

            for (int i = 0; i < headers.length; i++) {
                Cell cell = tableHeader.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerTableStyle);
            }

            if (resultDTO.getTaskAssignments() != null) {
                for (TaskAssignmentDTO ta : resultDTO.getTaskAssignments()) {
                    Row dataRow = sheet.createRow(rowNum++);
                    dataRow.createCell(0).setCellValue(ta.getResourceName() != null ? ta.getResourceName() : "Resource");
                    dataRow.createCell(1).setCellValue(ta.getTaskName() != null ? ta.getTaskName() : "—");
                    dataRow.createCell(2).setCellValue(ta.getRole() != null ? ta.getRole() : "—");
                    dataRow.createCell(3).setCellValue((ta.getEstimatedDays() != null ? ta.getEstimatedDays() : 1) + " Days");
                    dataRow.createCell(4).setCellValue(ta.getAssignedCost() != null ? currencyFormat.format(ta.getAssignedCost()) : "₹0.00");
                    if (isProfit) {
                        dataRow.createCell(5).setCellValue(ta.getSavedMoney() != null ? currencyFormat.format(ta.getSavedMoney()) : "₹0.00");
                    }
                }
            }

            // Auto-size columns
            for (int i = 0; i < (isProfit ? 6 : 5); i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(outputStream);
            outputStream.flush();
        }
    }

    private void addKeyValueRow(XSSFSheet sheet, int rowNum, String key, String value, CellStyle labelStyle) {
        Row row = sheet.createRow(rowNum);
        Cell keyCell = row.createCell(0);
        keyCell.setCellValue(key);
        keyCell.setCellStyle(labelStyle);

        Cell valueCell = row.createCell(1);
        valueCell.setCellValue(value);
    }
}
