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
public class AssignmentResultDTO {

    private Long assignmentId;

    private String assignmentName;

    private String assignmentDescription;

    private String assignmentType;

    private String optimizationType;

    private BigDecimal budget;

    private Integer timelineDays;

    private Integer workingDaysPerMonth;

    private Integer totalResources;

    private Integer totalTasks;

    private List<TaskAssignmentDTO> taskAssignments;
    
    private MatrixDTO matrix;

    private BigDecimal totalCost;
    
    private String assignmentStatus;

    private BigDecimal totalSavedMoney;

    private String budgetStatus;

    private String timelineStatus;

    private Long executionTime;
}