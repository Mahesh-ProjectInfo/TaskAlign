package com.task.www.dto;

import java.util.List;

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
public class TaskEligibleResourceResponse {

    private Long taskId;
    private String taskName;
    private Integer estimatedDays;
    private List<Long> requiredSkillIds;
    private List<MatchingResourceResponse> matchingResources;
    private List<EligibleResourceResponse> eligibleResources;
    private Integer totalMatchingCount;
    private Integer totalEligibleCount;

    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }

    public String getTaskName() {
        return taskName;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    public Integer getEstimatedDays() {
        return estimatedDays;
    }

    public void setEstimatedDays(Integer estimatedDays) {
        this.estimatedDays = estimatedDays;
    }

    public List<Long> getRequiredSkillIds() {
        return requiredSkillIds;
    }

    public void setRequiredSkillIds(List<Long> requiredSkillIds) {
        this.requiredSkillIds = requiredSkillIds;
    }

    public List<MatchingResourceResponse> getMatchingResources() {
        return matchingResources;
    }

    public void setMatchingResources(List<MatchingResourceResponse> matchingResources) {
        this.matchingResources = matchingResources;
    }

    public List<EligibleResourceResponse> getEligibleResources() {
        return eligibleResources;
    }

    public void setEligibleResources(List<EligibleResourceResponse> eligibleResources) {
        this.eligibleResources = eligibleResources;
    }

    public Integer getTotalMatchingCount() {
        return totalMatchingCount;
    }

    public void setTotalMatchingCount(Integer totalMatchingCount) {
        this.totalMatchingCount = totalMatchingCount;
    }

    public Integer getTotalEligibleCount() {
        return totalEligibleCount;
    }

    public void setTotalEligibleCount(Integer totalEligibleCount) {
        this.totalEligibleCount = totalEligibleCount;
    }
}
