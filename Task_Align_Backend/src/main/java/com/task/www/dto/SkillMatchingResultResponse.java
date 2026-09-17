package com.task.www.dto;

import java.util.List;

import com.task.www.enums.OptimizationType;

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
public class SkillMatchingResultResponse {

    private Long assignmentId;
    private String assignmentName;
    private Long assignmentTypeId;
    private String assignmentTypeName;
    private OptimizationType optimizationType;
    private Integer totalTasks;
    private Integer totalAllocatedResources;
    private List<TaskSkillMatchResponse> tasks;

    public Long getAssignmentId() {
        return assignmentId;
    }

    public void setAssignmentId(Long assignmentId) {
        this.assignmentId = assignmentId;
    }

    public String getAssignmentName() {
        return assignmentName;
    }

    public void setAssignmentName(String assignmentName) {
        this.assignmentName = assignmentName;
    }

    public Long getAssignmentTypeId() {
        return assignmentTypeId;
    }

    public void setAssignmentTypeId(Long assignmentTypeId) {
        this.assignmentTypeId = assignmentTypeId;
    }

    public String getAssignmentTypeName() {
        return assignmentTypeName;
    }

    public void setAssignmentTypeName(String assignmentTypeName) {
        this.assignmentTypeName = assignmentTypeName;
    }

    public OptimizationType getOptimizationType() {
        return optimizationType;
    }

    public void setOptimizationType(OptimizationType optimizationType) {
        this.optimizationType = optimizationType;
    }

    public Integer getTotalTasks() {
        return totalTasks;
    }

    public void setTotalTasks(Integer totalTasks) {
        this.totalTasks = totalTasks;
    }

    public Integer getTotalAllocatedResources() {
        return totalAllocatedResources;
    }

    public void setTotalAllocatedResources(Integer totalAllocatedResources) {
        this.totalAllocatedResources = totalAllocatedResources;
    }

    public List<TaskSkillMatchResponse> getTasks() {
        return tasks;
    }

    public void setTasks(List<TaskSkillMatchResponse> tasks) {
        this.tasks = tasks;
    }
}
