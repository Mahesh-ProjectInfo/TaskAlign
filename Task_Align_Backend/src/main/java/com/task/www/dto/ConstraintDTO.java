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
public class ConstraintDTO {

    private BigDecimal budget;

    private Integer timelineDays;

    private Integer workingDaysPerMonth;

}