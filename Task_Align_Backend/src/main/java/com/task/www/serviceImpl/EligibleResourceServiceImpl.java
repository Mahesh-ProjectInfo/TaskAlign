package com.task.www.serviceImpl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.task.www.dto.EligibleResourceResponse;
import com.task.www.dto.EligibleResourceResultResponse;
import com.task.www.dto.MatchingResourceResponse;
import com.task.www.dto.SkillMatchingResultResponse;
import com.task.www.dto.TaskEligibleResourceResponse;
import com.task.www.dto.TaskSkillMatchResponse;
import com.task.www.entity.AssignmentConstraint;
import com.task.www.entity.Resource;
import com.task.www.repository.AssignmentConstraintRepository;
import com.task.www.repository.ResourceRepository;
import com.task.www.service.EligibleResourceService;
import com.task.www.service.SkillMatchingService;

@Service
public class EligibleResourceServiceImpl implements EligibleResourceService {

    private final SkillMatchingService skillMatchingService;
    private final ResourceRepository resourceRepository;
    private final AssignmentConstraintRepository constraintRepository;

    public EligibleResourceServiceImpl(
            SkillMatchingService skillMatchingService,
            ResourceRepository resourceRepository,
            AssignmentConstraintRepository constraintRepository) {
        this.skillMatchingService = skillMatchingService;
        this.resourceRepository = resourceRepository;
        this.constraintRepository = constraintRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public EligibleResourceResultResponse getEligibleResourcesForAssignment(Long assignmentId) {

        // 1. Reuse Skill Matching Result from Feature 1
        SkillMatchingResultResponse skillMatchingResult = skillMatchingService
                .getSkillMatchingForAssignment(assignmentId);

        // 2. Fetch Optional Assignment Constraints
        Optional<AssignmentConstraint> constraintOpt = constraintRepository
                .findByAssignmentAssignmentIdAndIsDeletedFalse(assignmentId);

        List<TaskEligibleResourceResponse> taskEligibleResponses = new ArrayList<>();

        if (skillMatchingResult.getTasks() != null) {
            for (TaskSkillMatchResponse taskMatch : skillMatchingResult.getTasks()) {

                List<MatchingResourceResponse> matchingResources = taskMatch.getMatchingResources() != null
                        ? taskMatch.getMatchingResources()
                        : List.of();

                List<EligibleResourceResponse> eligibleResources = new ArrayList<>();

                for (MatchingResourceResponse matchingResource : matchingResources) {

                    // Retrieve full Resource entity to evaluate status, availability, and constraints
                    Optional<Resource> resourceOpt = resourceRepository.findById(matchingResource.getResourceId());

                    boolean isEligible = false;
                    String reason;

                    if (resourceOpt.isEmpty() || Boolean.TRUE.equals(resourceOpt.get().getIsDeleted())) {
                        reason = "Ineligible - Resource not found or soft-deleted";
                    } else {
                        Resource resource = resourceOpt.get();

                        {
                            // Check assignment-level constraints if present
                            if (constraintOpt.isPresent()) {
                                AssignmentConstraint constraint = constraintOpt.get();
                                // Validate timeline/days sanity constraint
                                if (constraint.getTimelineDays() != null
                                        && taskMatch.getEstimatedDays() != null
                                        && taskMatch.getEstimatedDays() > constraint.getTimelineDays()) {
                                    reason = "Ineligible - Task estimated days (" + taskMatch.getEstimatedDays()
                                            + ") exceeds assignment timeline constraint ("
                                            + constraint.getTimelineDays() + " days)";
                                } else {
                                    isEligible = true;
                                    reason = "Eligible - Skill matched, active, available, and constraint compliant";
                                }
                            } else {
                                isEligible = true;
                                reason = "Eligible - Skill matched, active, and available";
                            }
                        }
                    }

                    EligibleResourceResponse evaluatedResource = EligibleResourceResponse.builder()
                            .resourceId(matchingResource.getResourceId())
                            .resourceName(matchingResource.getResourceName())
                            .employeeId(matchingResource.getEmployeeId())
                            .email(matchingResource.getEmail())
                            .mobile(matchingResource.getMobile())
                            .roleId(matchingResource.getRoleId())
                            .roleName(matchingResource.getRoleName())
                            .skillId(matchingResource.getSkillId())
                            .skillName(matchingResource.getSkillName())
                            .experience(matchingResource.getExperience())
                            .costPerHour(matchingResource.getCostPerHour())
                            .isEligible(isEligible)
                            .eligibilityReason(reason)
                            .build();

                    eligibleResources.add(evaluatedResource);
                }

                List<EligibleResourceResponse> onlyEligibleResources = eligibleResources.stream()
                        .filter(r -> Boolean.TRUE.equals(r.getIsEligible()))
                        .toList();

                TaskEligibleResourceResponse taskResponse = TaskEligibleResourceResponse.builder()
                        .taskId(taskMatch.getTaskId())
                        .taskName(taskMatch.getTaskName())
                        .estimatedDays(taskMatch.getEstimatedDays())
                        .requiredSkillIds(taskMatch.getRequiredSkillIds())
                        .matchingResources(matchingResources)
                        .eligibleResources(onlyEligibleResources)
                        .totalMatchingCount(matchingResources.size())
                        .totalEligibleCount(onlyEligibleResources.size())
                        .build();

                taskEligibleResponses.add(taskResponse);
            }
        }

        return EligibleResourceResultResponse.builder()
                .assignmentId(skillMatchingResult.getAssignmentId())
                .assignmentName(skillMatchingResult.getAssignmentName())
                .assignmentTypeId(skillMatchingResult.getAssignmentTypeId())
                .assignmentTypeName(skillMatchingResult.getAssignmentTypeName())
                .optimizationType(skillMatchingResult.getOptimizationType())
                .totalTasks(skillMatchingResult.getTotalTasks())
                .totalAllocatedResources(skillMatchingResult.getTotalAllocatedResources())
                .tasks(taskEligibleResponses)
                .build();
    }
}
