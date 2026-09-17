package com.task.www.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardCardResponse {

    private Long totalAssignments;

    private Long activeAssignments;

    private Long draftAssignments;

    private Long completedAssignments;

    private Long totalRoles;

    private Long totalSkills;

    private Long totalResources;

    private Long totalTasks;

    private Long totalReports;

}
