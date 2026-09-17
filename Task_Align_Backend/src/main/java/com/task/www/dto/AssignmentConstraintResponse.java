package com.task.www.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignmentConstraintResponse {

    private Long assignmentConstraintId;
    private Long assignmentId;
    private BigDecimal budget;
    private Integer timelineDays;
    private Integer workingDaysPerMonth;
}
