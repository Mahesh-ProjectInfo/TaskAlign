package com.task.www.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RoleRequest {

    @NotNull(message = "Assignment Type ID is required")
    private Long assignmentTypeId;

    @NotBlank(message = "Role Name is required")
    private String roleName;
}
