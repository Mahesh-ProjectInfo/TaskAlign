package com.task.www.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentStatusSummaryDto {

    private Long totalAssignments;
    private Long draftAssignments;
    private Long completedAssignments;
}
