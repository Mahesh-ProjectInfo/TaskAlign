package com.task.www.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SkillRequest {

    @NotNull(message = "Assignment Type ID is required")
    private Long assignmentTypeId;

    @NotBlank(message = "Skill Name is required")
    private String skillName;
}
