package com.task.www.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OptimizationPreviewDTO {

    // Assignment Details
    private Long assignmentId;
    private String assignmentName;
    private String assignmentType;
    private String optimizationType;

    // Constraints
    private BigDecimal budget;
    private Integer timelineDays;
    private Integer workingDaysPerMonth;

    // Summary
    private Integer totalResources;
    private Integer eligibleResources;
    private Integer ineligibleResources;
    private Integer totalTasks;

    // Matrix
    private MatrixDTO matrix;

 // Validation
    private Boolean valid;

    private List<ValidationIssueDTO> validationIssues;
    
    // Status
    private String status;
}