package com.task.www.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SkillResponse {

    private Long skillId;

    private Long assignmentTypeId;

    private String assignmentTypeName;

    private String skillName;

    private Boolean isDeleted;
}
