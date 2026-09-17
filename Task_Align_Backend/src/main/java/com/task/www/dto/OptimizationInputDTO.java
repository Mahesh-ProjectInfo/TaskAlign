package com.task.www.dto;

import java.util.List;

import com.task.www.enums.OptimizationType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OptimizationInputDTO {

    private Long assignmentId;

    private String assignmentName;

    private String assignmentDescription;

    private String assignmentType;

    private OptimizationType optimizationType;

    private ConstraintDTO constraint;

    // Selected Resources
    private List<ResourceDTO> resources;

    // Tasks
    private List<TaskDTO> tasks;

    // Business Rule Engine Output
    private List<EligibilityDTO> eligibilityList;

}