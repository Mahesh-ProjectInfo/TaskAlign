package com.task.www.serviceImpl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.task.www.config.SecurityUtils;
import com.task.www.entity.Assignment;
import com.task.www.entity.ReportHistory;
import com.task.www.exception.AssignmentNotFoundException;
import com.task.www.exception.ResourceNotFoundException;
import com.task.www.repository.AssignmentRepository;
import com.task.www.repository.ReportHistoryRepository;
import com.task.www.service.ReportService;
import com.task.www.builder.OptimizationInputBuilderService;
import com.task.www.dto.AssignmentResultDTO;
import com.task.www.dto.OptimizationInputDTO;
import com.task.www.service.OptimizationService;
import com.task.www.util.ExcelGenerator;
import com.task.www.util.JasperPdfGenerator;

import jakarta.servlet.http.HttpServletResponse;

@Service
public class ReportServiceImpl implements ReportService {

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private ReportHistoryRepository reportHistoryRepository;

    @Autowired
    private ExcelGenerator excelGenerator;

    @Autowired
    private OptimizationInputBuilderService optimizationInputBuilderService;

    @Autowired
    private OptimizationService optimizationService;

    @Autowired
    private JasperPdfGenerator jasperPdfGenerator;

    @Override
    public void generateExcelReport(Long assignmentId,
                                    HttpServletResponse response) {

        String currentUser = SecurityUtils.getCurrentUser();
        assignmentRepository.findByAssignmentIdAndCreatedByAndIsDeletedFalse(assignmentId, currentUser)
                .orElseThrow(() -> new AssignmentNotFoundException(
                        "Assignment not found with id : " + assignmentId));

        OptimizationInputDTO inputDTO = optimizationInputBuilderService.build(assignmentId);
        AssignmentResultDTO resultDTO = optimizationService.optimizeAssignment(inputDTO);

        String fileName = "Assignment_" + assignmentId + ".xlsx";

        response.setContentType(
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

        response.setHeader("Content-Disposition",
                "attachment; filename=" + fileName);

        try {

            excelGenerator.generate(
                    resultDTO,
                    response.getOutputStream());

            saveReportHistory(
                    assignmentId,
                    "EXCEL",
                    fileName);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Excel generation failed: " + e.getMessage(), e);
        }

    }

    @Override
    public void generatePdfReport(Long assignmentId, HttpServletResponse response) {

        String currentUser = SecurityUtils.getCurrentUser();
        assignmentRepository.findByAssignmentIdAndCreatedByAndIsDeletedFalse(assignmentId, currentUser)
                .orElseThrow(() -> new AssignmentNotFoundException(
                        "Assignment not found with id : " + assignmentId));

        OptimizationInputDTO inputDTO = optimizationInputBuilderService.build(assignmentId);
        AssignmentResultDTO resultDTO = optimizationService.optimizeAssignment(inputDTO);

        String fileName = "Assignment_" + assignmentId + ".pdf";

        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=" + fileName);

        try {
            jasperPdfGenerator.generatePdf(resultDTO, response.getOutputStream());
            saveReportHistory(assignmentId, "PDF", fileName);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("PDF generation failed: " + e.getMessage(), e);
        }
    }

    @Override
    public List<ReportHistory> getReportHistory() {
        String currentUser = SecurityUtils.getCurrentUser();
        return reportHistoryRepository.findByGeneratedByAndIsDeletedFalse(currentUser);
    }

    private void saveReportHistory(Long assignmentId,
                                   String reportType,
                                   String fileName) {

        try {
            ReportHistory history = new ReportHistory();

            history.setAssignmentId(assignmentId);
            history.setReportType(reportType);
            history.setFileName(fileName);

            history.setGeneratedBy(SecurityUtils.getCurrentUser());
            history.setCreatedDate(LocalDateTime.now());

            reportHistoryRepository.save(history);
        } catch (Exception e) {
            // Report history is out of scope; log error without failing report generation
            System.err.println("Note: Report history logging skipped (" + e.getMessage() + ")");
        }

    }

}
