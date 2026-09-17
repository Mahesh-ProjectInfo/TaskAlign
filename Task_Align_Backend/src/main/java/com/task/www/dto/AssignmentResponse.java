package com.task.www.dto;

import com.task.www.enums.AssignmentStatus;
import com.task.www.enums.OptimizationType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignmentResponse {

    private Long assignmentId;

    private String assignmentName;

    private String assignmentDescription;

    private Long assignmentTypeId;

    private String assignmentTypeName;

    private OptimizationType optimizationType;

    private AssignmentStatus assignmentStatus;

}