package com.task.www.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AssignmentTypeRequest {

    @NotBlank(message = "Assignment Type Name is required")
    private String assignmentTypeName;
}
