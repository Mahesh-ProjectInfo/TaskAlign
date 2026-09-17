package com.task.www.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResourceResponse {

    private Long resourceId;

    private String resourceName;

    private Long roleId;

    private String roleName;

    private List<SkillResponse> skills;

    private Long assignmentTypeId;

    private String assignmentTypeName;

    private BigDecimal monthlySalary;

    private BigDecimal performanceRating;

}
