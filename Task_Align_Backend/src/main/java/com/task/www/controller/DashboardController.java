package com.task.www.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.task.www.dto.ApiResponse;
import com.task.www.dto.AssignmentStatusChartResponse;
import com.task.www.dto.AssignmentTypeChartResponse;
import com.task.www.dto.DashboardCardResponse;
import com.task.www.dto.DashboardChartResponse;
import com.task.www.dto.DashboardResponse;
import com.task.www.dto.MonthlyAssignmentChartResponse;
import com.task.www.service.DashboardService;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboardSummary() {

        return ResponseEntity.ok(dashboardService.getDashboardSummary());

    }

    @GetMapping("/cards")
    public ResponseEntity<ApiResponse<DashboardCardResponse>> getDashboardCards() {

        return ResponseEntity.ok(dashboardService.getDashboardCards());

    }

    @GetMapping("/charts")
    public ResponseEntity<ApiResponse<DashboardChartResponse>> getDashboardCharts() {

        return ResponseEntity.ok(dashboardService.getDashboardCharts());

    }

    @GetMapping("/charts/assignment-status")
    public ResponseEntity<ApiResponse<List<AssignmentStatusChartResponse>>> getAssignmentStatusChart() {

        return ResponseEntity.ok(dashboardService.getAssignmentStatusChart());

    }

    @GetMapping("/charts/assignment-type")
    public ResponseEntity<ApiResponse<List<AssignmentTypeChartResponse>>> getAssignmentTypeChart() {

        return ResponseEntity.ok(dashboardService.getAssignmentTypeChart());

    }

    @GetMapping("/charts/monthly-assignments")
    public ResponseEntity<ApiResponse<List<MonthlyAssignmentChartResponse>>> getMonthlyAssignmentChart() {

        return ResponseEntity.ok(dashboardService.getMonthlyAssignmentChart());

    }

}   