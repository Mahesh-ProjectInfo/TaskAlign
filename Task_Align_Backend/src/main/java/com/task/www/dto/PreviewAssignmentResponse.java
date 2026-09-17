package com.task.www.dto;

import java.util.List;

import com.task.www.enums.AssignmentStatus;
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
public class PreviewAssignmentResponse {

    private Long assignmentId;
    private String assignmentName;
    private String assignmentDescription;
    private Long assignmentTypeId;
    private OptimizationType optimizationType;
    private AssignmentStatus assignmentStatus;
    private List<AssignmentResourceResponse> resources;
    private List<PreviewTaskResponse> tasks;
    private AssignmentConstraintResponse constraints;

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

    public String getAssignmentDescription() {
        return assignmentDescription;
    }

    public void setAssignmentDescription(String assignmentDescription) {
        this.assignmentDescription = assignmentDescription;
    }

    public Long getAssignmentTypeId() {
        return assignmentTypeId;
    }

    public void setAssignmentTypeId(Long assignmentTypeId) {
        this.assignmentTypeId = assignmentTypeId;
    }

    public OptimizationType getOptimizationType() {
        return optimizationType;
    }

    public void setOptimizationType(OptimizationType optimizationType) {
        this.optimizationType = optimizationType;
    }

    public AssignmentStatus getAssignmentStatus() {
        return assignmentStatus;
    }

    public void setAssignmentStatus(AssignmentStatus assignmentStatus) {
        this.assignmentStatus = assignmentStatus;
    }

    public List<AssignmentResourceResponse> getResources() {
        return resources;
    }

    public void setResources(List<AssignmentResourceResponse> resources) {
        this.resources = resources;
    }

    public List<PreviewTaskResponse> getTasks() {
        return tasks;
    }

    public void setTasks(List<PreviewTaskResponse> tasks) {
        this.tasks = tasks;
    }

    public AssignmentConstraintResponse getConstraints() {
        return constraints;
    }

    public void setConstraints(AssignmentConstraintResponse constraints) {
        this.constraints = constraints;
    }
}
