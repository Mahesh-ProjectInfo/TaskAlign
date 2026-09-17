package com.task.www.dto;

import java.math.BigDecimal;
import java.util.List;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResourceRequest {

    @NotBlank(message = "Resource Name is required")
    @Size(min = 2, max = 50, message = "Resource Name must be between 2 and 50 characters")
    @Pattern(regexp = "^[A-Za-z]+(?: [A-Za-z]+)*$", message = "Resource Name can contain letters and single spaces only")
    private String resourceName;

    @NotNull(message = "Role is required")
    private Long roleId;

    @NotEmpty(message = "At least one skill is required")
    private List<Long> skillIds;

    @NotNull(message = "Assignment Type is required")
    private Long assignmentTypeId;

    @NotNull(message = "Monthly Salary is required")
    @DecimalMin(value = "0.01", message = "Monthly Salary must be greater than 0")
    @DecimalMax(value = "99999999.99", message = "Monthly Salary cannot exceed 10 characters/digits")
    private BigDecimal monthlySalary;

    @NotNull(message = "Performance Rating is required")
    @DecimalMin(value = "1.0", message = "Performance Rating must be at least 1")
    @DecimalMax(value = "100.0", message = "Performance Rating cannot exceed 100")
    private BigDecimal performanceRating;
}