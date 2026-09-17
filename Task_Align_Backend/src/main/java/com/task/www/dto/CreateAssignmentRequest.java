package com.task.www.dto;

import com.task.www.enums.OptimizationType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
public class CreateAssignmentRequest {

    @NotBlank(message = "Assignment name is required.")
    @Size(max = 100, message = "Assignment name cannot exceed 100 characters.")
    private String assignmentName;

    @Size(max = 255)
    private String assignmentDescription;

    @NotNull(message = "Assignment type is required.")
    private Long assignmentTypeId;

    @NotNull(message = "Optimization type is required.")
    private OptimizationType optimizationType;

}
