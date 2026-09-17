package com.task.www.service;

import java.util.List;

import com.task.www.entity.ReportHistory;

import jakarta.servlet.http.HttpServletResponse;

public interface ReportService {

    void generateExcelReport(Long assignmentId, HttpServletResponse response);

    void generatePdfReport(Long assignmentId, HttpServletResponse response);

    List<ReportHistory> getReportHistory();
}
