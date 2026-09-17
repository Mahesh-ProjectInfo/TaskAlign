package com.task.www.service;

import java.util.List;

import com.task.www.dto.ApiResponse;
import com.task.www.dto.AssignmentStatusChartResponse;
import com.task.www.dto.AssignmentTypeChartResponse;
import com.task.www.dto.DashboardCardResponse;
import com.task.www.dto.DashboardChartResponse;
import com.task.www.dto.DashboardResponse;
import com.task.www.dto.MonthlyAssignmentChartResponse;

public interface DashboardService {

    ApiResponse<DashboardResponse> getDashboardSummary();

    ApiResponse<DashboardCardResponse> getDashboardCards();

    ApiResponse<DashboardChartResponse> getDashboardCharts();

    ApiResponse<List<AssignmentStatusChartResponse>> getAssignmentStatusChart();

    ApiResponse<List<AssignmentTypeChartResponse>> getAssignmentTypeChart();

    ApiResponse<List<MonthlyAssignmentChartResponse>> getMonthlyAssignmentChart();

}
