
package com.task.www.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardChartResponse {

    private List<AssignmentStatusChartResponse> assignmentStatusChart;

    private List<AssignmentTypeChartResponse> assignmentTypeChart;

    private List<MonthlyAssignmentChartResponse> monthlyAssignmentChart;

}