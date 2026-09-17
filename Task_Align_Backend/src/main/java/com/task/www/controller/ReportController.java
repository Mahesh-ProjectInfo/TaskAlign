package com.task.www.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import com.task.www.entity.ReportHistory;
import com.task.www.service.ReportService;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/report")
@CrossOrigin
public class ReportController {

	@Autowired
	private ReportService reportService;

	// Download Excel Report
	@GetMapping("/excel/{id}")
	public void downloadExcel(@PathVariable Long id, HttpServletResponse response) {

		reportService.generateExcelReport(id, response);
	}

	// Download PDF Report
	@GetMapping("/pdf/{id}")
	public void downloadPdf(@PathVariable Long id, HttpServletResponse response) {

		reportService.generatePdfReport(id, response);
	}

	// Report History
	@GetMapping("/history")
	public ResponseEntity<List<ReportHistory>> getHistory() {

		return ResponseEntity.ok(reportService.getReportHistory());
	}

}
