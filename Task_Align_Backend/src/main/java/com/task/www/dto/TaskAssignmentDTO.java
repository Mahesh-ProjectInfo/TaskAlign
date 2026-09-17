package com.task.www.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskAssignmentDTO {

    private Long taskId;

    private String taskName;

    private Long resourceId;

    private String resourceName;
    
    private String role;

    private Integer estimatedDays;

    private BigDecimal assignedCost;

    private BigDecimal savedMoney;

    private Integer performanceRating;

}