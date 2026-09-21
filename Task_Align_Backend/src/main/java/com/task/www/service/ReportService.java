package com.task.www.service;

import java.util.List;

import com.task.www.entity.ReportHistory;


public interface ReportService {

    byte[] generateExcelReport(Long assignmentId);

    byte[] generatePdfReport(Long assignmentId);

    List<ReportHistory> getReportHistory();
}
