package com.task.www.serviceImpl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.task.www.config.SecurityUtils;
import com.task.www.dto.MatchingResourceResponse;
import com.task.www.dto.SkillMatchingResultResponse;
import com.task.www.dto.TaskSkillMatchResponse;
import com.task.www.entity.Assignment;
import com.task.www.entity.AssignmentResource;
import com.task.www.entity.Resource;
import com.task.www.entity.ResourceSkill;
import com.task.www.entity.Task;
import com.task.www.entity.TaskSkill;
import com.task.www.exception.AssignmentNotFoundException;
import com.task.www.repository.AssignmentRepository;
import com.task.www.repository.AssignmentResourceRepository;
import com.task.www.repository.ResourceRepository;
import com.task.www.repository.ResourceSkillRepository;
import com.task.www.repository.TaskRepository;
import com.task.www.repository.TaskSkillRepository;
import com.task.www.service.SkillMatchingService;

@Service
public class SkillMatchingServiceImpl implements SkillMatchingService {

    private final AssignmentRepository assignmentRepository;
    private final AssignmentResourceRepository assignmentResourceRepository;
    private final ResourceRepository resourceRepository;
    private final ResourceSkillRepository resourceSkillRepository;
    private final TaskRepository taskRepository;
    private final TaskSkillRepository taskSkillRepository;

    public SkillMatchingServiceImpl(
            AssignmentRepository assignmentRepository,
            AssignmentResourceRepository assignmentResourceRepository,
            ResourceRepository resourceRepository,
            ResourceSkillRepository resourceSkillRepository,
            TaskRepository taskRepository,
            TaskSkillRepository taskSkillRepository) {
        this.assignmentRepository = assignmentRepository;
        this.assignmentResourceRepository = assignmentResourceRepository;
        this.resourceRepository = resourceRepository;
        this.resourceSkillRepository = resourceSkillRepository;
        this.taskRepository = taskRepository;
        this.taskSkillRepository = taskSkillRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public SkillMatchingResultResponse getSkillMatchingForAssignment(Long assignmentId) {

        // 1. Retrieve Assignment
        String currentUser = SecurityUtils.getCurrentUser();
        Assignment assignment = assignmentRepository
                .findByAssignmentIdAndCreatedByAndIsDeletedFalse(assignmentId, currentUser)
                .orElseThrow(() -> new AssignmentNotFoundException(
                        "Assignment not found with id: " + assignmentId));

        // 2. Retrieve Assignment Resources
        List<AssignmentResource> assignmentResources = assignmentResourceRepository
                .findByAssignmentAssignmentId(assignmentId);

        List<Long> allocatedResourceIds = assignmentResources.stream()
                .map(AssignmentResource::getResourceId)
                .filter(Objects::nonNull)
                .distinct()
                .toList();

        List<Resource> allocatedResources = allocatedResourceIds.isEmpty()
                ? List.of()
                : resourceRepository.findAllById(allocatedResourceIds).stream()
                        .filter(r -> Boolean.FALSE.equals(r.getIsDeleted()))
                        .toList();

        List<ResourceSkill> allResourceSkills = allocatedResourceIds.isEmpty()
                ? List.of()
                : resourceSkillRepository.findByResourceResourceIdIn(allocatedResourceIds);

        Map<Long, List<ResourceSkill>> resourceSkillsMap = allResourceSkills.stream()
                .collect(Collectors.groupingBy(rs -> rs.getResource().getResourceId()));

        // 3. Retrieve Tasks for the Assignment
        List<Task> tasks = taskRepository.findByAssignmentAssignmentIdAndIsDeletedFalse(assignmentId);

        List<TaskSkillMatchResponse> taskSkillMatches = new ArrayList<>();

        // 4. Match Task Skills against Resource Skills
        for (Task task : tasks) {

            List<TaskSkill> taskSkills = taskSkillRepository.findByTaskTaskId(task.getTaskId());

            List<Long> requiredSkillIds = taskSkills.stream()
                    .map(TaskSkill::getSkillId)
                    .filter(Objects::nonNull)
                    .distinct()
                    .toList();

            Set<Long> requiredSkillSet = requiredSkillIds.stream().collect(Collectors.toSet());

            // Filter allocated resources matching task skills
            List<Resource> matchingResourceEntities;
            if (requiredSkillSet.isEmpty()) {
                // If no specific skills required for task, all allocated resources match
                matchingResourceEntities = allocatedResources;
            } else {
                matchingResourceEntities = allocatedResources.stream()
                        .filter(resource -> {
                            List<ResourceSkill> rSkills = resourceSkillsMap.getOrDefault(resource.getResourceId(), List.of());
                            Set<Long> resourceSkillIds = rSkills.stream()
                                    .filter(rs -> rs.getSkill() != null && rs.getSkill().getSkillId() != null)
                                    .map(rs -> rs.getSkill().getSkillId())
                                    .collect(Collectors.toSet());
                            return resourceSkillIds.containsAll(requiredSkillSet);
                        })
                        .toList();

            }

            List<MatchingResourceResponse> matchingResourceResponses = matchingResourceEntities.stream()
                    .map(resource -> mapToMatchingResourceResponse(resource, resourceSkillsMap.getOrDefault(resource.getResourceId(), List.of()), requiredSkillSet))
                    .toList();

            TaskSkillMatchResponse taskMatch = TaskSkillMatchResponse.builder()
                    .taskId(task.getTaskId())
                    .taskName(task.getTaskName())
                    .estimatedDays(task.getEstimatedDays())
                    .requiredSkillIds(requiredSkillIds)
                    .matchingResources(matchingResourceResponses)
                    .build();

            taskSkillMatches.add(taskMatch);
        }

        String assignmentTypeName = assignment.getAssignmentType() != null
                ? assignment.getAssignmentType().getAssignmentTypeName()
                : null;

        Long assignmentTypeId = assignment.getAssignmentType() != null
                ? assignment.getAssignmentType().getAssignmentTypeId()
                : null;

        return SkillMatchingResultResponse.builder()
                .assignmentId(assignment.getAssignmentId())
                .assignmentName(assignment.getAssignmentName())
                .assignmentTypeId(assignmentTypeId)
                .assignmentTypeName(assignmentTypeName)
                .optimizationType(assignment.getOptimizationType())
                .totalTasks(tasks.size())
                .totalAllocatedResources(allocatedResources.size())
                .tasks(taskSkillMatches)
                .build();
    }

    private MatchingResourceResponse mapToMatchingResourceResponse(Resource resource, List<ResourceSkill> rSkills, Set<Long> requiredSkillSet) {
        Long roleId = resource.getRole() != null ? resource.getRole().getRoleId() : null;
        String roleName = resource.getRole() != null ? resource.getRole().getRoleName() : null;

        ResourceSkill matchedRs = rSkills.stream()
                .filter(rs -> rs.getSkill() != null && (requiredSkillSet.isEmpty() || requiredSkillSet.contains(rs.getSkill().getSkillId())))
                .findFirst()
                .orElse(!rSkills.isEmpty() ? rSkills.get(0) : null);

        Long skillId = matchedRs != null && matchedRs.getSkill() != null ? matchedRs.getSkill().getSkillId() : null;
        String skillName = matchedRs != null && matchedRs.getSkill() != null ? matchedRs.getSkill().getSkillName() : null;

        Double cost = resource.getMonthlySalary() != null ? resource.getMonthlySalary().doubleValue() : null;

        return MatchingResourceResponse.builder()
                .resourceId(resource.getResourceId())
                .resourceName(resource.getResourceName())
                .roleId(roleId)
                .roleName(roleName)
                .skillId(skillId)
                .skillName(skillName)
                .costPerHour(cost)
                .build();
    }
}
