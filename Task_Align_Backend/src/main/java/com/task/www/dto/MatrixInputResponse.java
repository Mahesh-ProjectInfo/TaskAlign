package com.task.www.dto;

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
public class MatrixInputResponse {

    private Long assignmentId;
    private String assignmentName;
    private Long assignmentTypeId;
    private String assignmentTypeName;
    private OptimizationType optimizationType;
    private AssignmentStatus assignmentStatus;
    private Boolean isReadyForMatrixGeneration;
    private PreviewAssignmentResponse preview;
    private SkillMatchingResultResponse skillMatching;
    private EligibleResourceResultResponse eligibleResources;

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

    public AssignmentStatus getAssignmentStatus() {
        return assignmentStatus;
    }

    public void setAssignmentStatus(AssignmentStatus assignmentStatus) {
        this.assignmentStatus = assignmentStatus;
    }

    public Boolean getIsReadyForMatrixGeneration() {
        return isReadyForMatrixGeneration;
    }

    public void setIsReadyForMatrixGeneration(Boolean isReadyForMatrixGeneration) {
        this.isReadyForMatrixGeneration = isReadyForMatrixGeneration;
    }

    public PreviewAssignmentResponse getPreview() {
        return preview;
    }

    public void setPreview(PreviewAssignmentResponse preview) {
        this.preview = preview;
    }

    public SkillMatchingResultResponse getSkillMatching() {
        return skillMatching;
    }

    public void setSkillMatching(SkillMatchingResultResponse skillMatching) {
        this.skillMatching = skillMatching;
    }

    public EligibleResourceResultResponse getEligibleResources() {
        return eligibleResources;
    }

    public void setEligibleResources(EligibleResourceResultResponse eligibleResources) {
        this.eligibleResources = eligibleResources;
    }
}
