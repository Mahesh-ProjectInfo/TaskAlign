package com.task.www.builder;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.task.www.config.SecurityUtils;
import com.task.www.dto.ConstraintDTO;
import com.task.www.dto.EligibilityDTO;
import com.task.www.dto.MatchingResourceResponse;
import com.task.www.dto.OptimizationInputDTO;
import com.task.www.dto.ResourceDTO;
import com.task.www.dto.SkillMatchingResultResponse;
import com.task.www.dto.TaskDTO;
import com.task.www.dto.TaskSkillMatchResponse;
import com.task.www.entity.Assignment;
import com.task.www.entity.AssignmentConstraint;
import com.task.www.entity.AssignmentResource;
import com.task.www.entity.Resource;
import com.task.www.entity.Task;
import com.task.www.exception.ResourceNotFoundException;
import com.task.www.repository.AssignmentConstraintRepository;
import com.task.www.repository.AssignmentRepository;
import com.task.www.repository.AssignmentResourceRepository;
import com.task.www.repository.ResourceRepository;
import com.task.www.repository.TaskRepository;
import com.task.www.service.SkillMatchingService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OptimizationInputBuilderServiceImpl
        implements OptimizationInputBuilderService {

    private final AssignmentRepository assignmentRepository;
    private final AssignmentConstraintRepository assignmentConstraintRepository;
    private final AssignmentResourceRepository assignmentResourceRepository;
    private final ResourceRepository resourceRepository;
    private final TaskRepository taskRepository;
    private final SkillMatchingService skillMatchingService;

    @Override
    public OptimizationInputDTO build(Long assignmentId) {

        String currentUser = SecurityUtils.getCurrentUser();
        Assignment assignment =
                assignmentRepository
                        .findByAssignmentIdAndCreatedByAndIsDeletedFalse(assignmentId, currentUser)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Assignment not found"));
        AssignmentConstraint constraint =
                assignmentConstraintRepository
                        .findByAssignmentAssignmentIdAndIsDeletedFalse(assignmentId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Assignment Constraint not found"));
        ConstraintDTO constraintDTO =
                ConstraintDTO.builder()
                        .budget(constraint.getBudget())
                        .timelineDays(constraint.getTimelineDays())
                        .workingDaysPerMonth(constraint.getWorkingDaysPerMonth())
                        .build();
        List<AssignmentResource> assignmentResources =
                assignmentResourceRepository.findByAssignmentAssignmentId(assignmentId);
        
        List<ResourceDTO> resources = new ArrayList<>();

        for (AssignmentResource assignmentResource : assignmentResources) {

            Resource resource =
                    resourceRepository
                            .findByResourceIdAndIsDeletedFalse(
                                    assignmentResource.getResourceId())
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Resource not found: "
                                                    + assignmentResource.getResourceId()));

            ResourceDTO resourceDTO =
                    ResourceDTO.builder()
                            .resourceId(resource.getResourceId())
                            .resourceName(resource.getResourceName())
                            .role(resource.getRole().getRoleName())
                            .monthlySalary(resource.getMonthlySalary())
                            .performanceRating(
                                    resource.getPerformanceRating().intValue())
                            .build();

            resources.add(resourceDTO);
        }
        
        List<Task> taskEntities =
                taskRepository.findByAssignmentAssignmentIdAndIsDeletedFalse(assignmentId);	
        
        List<TaskDTO> tasks = new ArrayList<>();

        for (Task task : taskEntities) {

            TaskDTO taskDTO =
                    TaskDTO.builder()
                            .taskId(task.getTaskId())
                            .taskName(task.getTaskName())
                            .estimatedDays(task.getEstimatedDays())
                            .build();

            tasks.add(taskDTO);
        }
        
        SkillMatchingResultResponse skillMatchingResult =
                skillMatchingService.getSkillMatchingForAssignment(assignmentId);
        
        List<EligibilityDTO> eligibilityList = new ArrayList<>();
        
        for (TaskSkillMatchResponse taskMatch : skillMatchingResult.getTasks()) {
        	for (MatchingResourceResponse resource : taskMatch.getMatchingResources()) {
        		
        		EligibilityDTO eligibilityDTO =
        		        EligibilityDTO.builder()
        		                .taskId(taskMatch.getTaskId())
        		                .resourceId(resource.getResourceId())
        		                .eligible(true)
        		                .reason("Eligible")
        		                .build();

        		eligibilityList.add(eligibilityDTO);

        	}

        }
        
        
        return OptimizationInputDTO.builder()
                .assignmentId(assignment.getAssignmentId())
                .assignmentName(assignment.getAssignmentName())
                .assignmentDescription(assignment.getAssignmentDescription())
                .assignmentType(
                        assignment.getAssignmentType() != null
                                ? assignment.getAssignmentType().getAssignmentTypeName()
                                : null)
                .optimizationType(assignment.getOptimizationType())
                .constraint(constraintDTO)
                .resources(resources)
                .tasks(tasks)
                .eligibilityList(eligibilityList)
                .build();
    }
}