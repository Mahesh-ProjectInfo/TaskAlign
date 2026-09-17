package com.task.www.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
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
public class UpdateAssignmentConstraintRequest {

    @NotNull(message = "Budget is required.")
    @DecimalMin(value = "0.01", message = "Budget must be greater than 0.")
    private BigDecimal budget;

    @NotNull(message = "Timeline days is required.")
    @Min(value = 1, message = "Timeline days must be at least 1.")
    private Integer timelineDays;

    @NotNull(message = "Working days per month is required.")
    @Min(value = 1, message = "Working days per month must be at least 1.")
    @Max(value = 31, message = "Working days per month cannot exceed 31.")
    private Integer workingDaysPerMonth;
}
