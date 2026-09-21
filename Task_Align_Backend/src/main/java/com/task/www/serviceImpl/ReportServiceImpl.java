package com.task.www.serviceImpl;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

@Service
public class ReportServiceImpl implements ReportService {

    private static final Logger log = LoggerFactory.getLogger(ReportServiceImpl.class);

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
    public byte[] generateExcelReport(Long assignmentId) {
        log.info("Starting Excel report generation for assignment {}", assignmentId);

        String currentUser = SecurityUtils.getCurrentUser();
        assignmentRepository.findByAssignmentIdAndCreatedByAndIsDeletedFalse(assignmentId, currentUser)
                .orElseThrow(() -> new AssignmentNotFoundException(
                        "Assignment not found with id : " + assignmentId));

        OptimizationInputDTO inputDTO = optimizationInputBuilderService.build(assignmentId);
        AssignmentResultDTO resultDTO = optimizationService.optimizeAssignment(inputDTO);

        String fileName = "Assignment_" + assignmentId + ".xlsx";
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        try {
            excelGenerator.generate(resultDTO, outputStream);
            byte[] reportBytes = outputStream.toByteArray();

            saveReportHistory(assignmentId, "EXCEL", fileName);
            log.info("Excel report generation completed for assignment {}, size: {} bytes", assignmentId, reportBytes.length);
            return reportBytes;
        } catch (Exception e) {
            log.error("Excel report generation failed for assignment {}", assignmentId, e);
            throw new RuntimeException("Excel generation failed: " + e.getMessage(), e);
        }
    }

    @Override
    public byte[] generatePdfReport(Long assignmentId) {
        log.info("Starting PDF report generation for assignment {}", assignmentId);

        String currentUser = SecurityUtils.getCurrentUser();
        assignmentRepository.findByAssignmentIdAndCreatedByAndIsDeletedFalse(assignmentId, currentUser)
                .orElseThrow(() -> new AssignmentNotFoundException(
                        "Assignment not found with id : " + assignmentId));

        OptimizationInputDTO inputDTO = optimizationInputBuilderService.build(assignmentId);
        AssignmentResultDTO resultDTO = optimizationService.optimizeAssignment(inputDTO);

        String fileName = "Assignment_" + assignmentId + ".pdf";
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        try {
            jasperPdfGenerator.generatePdf(resultDTO, outputStream);
            byte[] reportBytes = outputStream.toByteArray();

            saveReportHistory(assignmentId, "PDF", fileName);
            log.info("PDF report generation completed for assignment {}, size: {} bytes", assignmentId, reportBytes.length);
            return reportBytes;
        } catch (Exception e) {
            log.error("PDF report generation failed for assignment {}", assignmentId, e);
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
