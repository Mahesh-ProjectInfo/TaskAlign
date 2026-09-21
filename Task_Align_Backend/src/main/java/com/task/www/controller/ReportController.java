package com.task.www.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.task.www.entity.ReportHistory;
import com.task.www.service.ReportService;

@RestController
@RequestMapping("/api/report")
@CrossOrigin
public class ReportController {

	@Autowired
	private ReportService reportService;

	// Download Excel Report
	@GetMapping("/excel/{id}")
	public ResponseEntity<byte[]> downloadExcel(@PathVariable Long id) {
		byte[] report = reportService.generateExcelReport(id);

		return ResponseEntity.ok()
				.header(
						HttpHeaders.CONTENT_DISPOSITION,
						"attachment; filename=Assignment_" + id + ".xlsx"
				)
				.contentType(
						MediaType.parseMediaType(
								"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
						)
				)
				.contentLength(report.length)
				.body(report);
	}

	// Download PDF Report
	@GetMapping("/pdf/{id}")
	public ResponseEntity<byte[]> downloadPdf(@PathVariable Long id) {
		byte[] report = reportService.generatePdfReport(id);

		return ResponseEntity.ok()
				.header(
						HttpHeaders.CONTENT_DISPOSITION,
						"attachment; filename=Assignment_" + id + ".pdf"
				)
				.contentType(MediaType.APPLICATION_PDF)
				.contentLength(report.length)
				.body(report);
	}

	// Report History
	@GetMapping("/history")
	public ResponseEntity<List<ReportHistory>> getHistory() {

		return ResponseEntity.ok(reportService.getReportHistory());
	}

}
