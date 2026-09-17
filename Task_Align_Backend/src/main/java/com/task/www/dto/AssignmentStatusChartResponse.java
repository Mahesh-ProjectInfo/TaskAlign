package com.task.www.dto;

import com.task.www.enums.AssignmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentStatusChartResponse {

    private AssignmentStatus status;

    private Long count;
}

