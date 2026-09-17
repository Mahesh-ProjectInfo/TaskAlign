package com.task.www.util;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.task.www.dto.MatrixDTO;
import com.task.www.dto.OptimizationInputDTO;
import com.task.www.dto.OptimizationPreviewDTO;
import com.task.www.dto.TaskDTO;
import com.task.www.dto.ValidationIssueDTO;

@Component
public class PreviewBuilderUtil {

    @Autowired
    private MatrixResponseBuilderUtil matrixResponseBuilderUtil;
    
    public OptimizationPreviewDTO buildPreview(
            OptimizationInputDTO inputDTO,
            double[][] matrix,
            String title,
            String description) {

        MatrixDTO matrixDTO =
                matrixResponseBuilderUtil.buildMatrix(
                        inputDTO,
                        matrix,
                        title,
                        description);

        List<ValidationIssueDTO> validationIssues = new ArrayList<>();

        for (TaskDTO task : inputDTO.getTasks()) {

            boolean hasEligibleResource =
                    inputDTO.getEligibilityList()
                            .stream()
                            .anyMatch(e ->
                                    e.getTaskId().equals(task.getTaskId())
                                            && e.isEligible());

            if (!hasEligibleResource) {

                validationIssues.add(
                        ValidationIssueDTO.builder()
                                .taskId(task.getTaskId())
                                .taskName(task.getTaskName())
                                .reason("No eligible resource found")
                                .build());
            }
        }

        boolean valid = validationIssues.isEmpty();
        
        return OptimizationPreviewDTO.builder()
                .assignmentId(inputDTO.getAssignmentId())
                .assignmentName(inputDTO.getAssignmentName())
                .assignmentType(inputDTO.getAssignmentType())
                .optimizationType(inputDTO.getOptimizationType().name())

                .budget(inputDTO.getConstraint().getBudget())
                .timelineDays(inputDTO.getConstraint().getTimelineDays())
                .workingDaysPerMonth(inputDTO.getConstraint().getWorkingDaysPerMonth())

                .totalResources(inputDTO.getResources().size())
                .totalTasks(inputDTO.getTasks().size())

                .eligibleResources(calculateEligibleResources(inputDTO))
                .ineligibleResources(calculateIneligibleResources(inputDTO))

                .matrix(matrixDTO)

                .valid(valid)
                .validationIssues(validationIssues)
                .status(
                        valid
                                ? "READY_FOR_OPTIMIZATION"
                                : "VALIDATION_FAILED")

                .build();
    }
    
    private Integer calculateEligibleResources(
            OptimizationInputDTO inputDTO) {

        return (int) inputDTO.getResources()
                .stream()
                .filter(resource ->
                        inputDTO.getEligibilityList().stream()
                                .anyMatch(eligibility ->
                                        eligibility.getResourceId().equals(resource.getResourceId())
                                        && Boolean.TRUE.equals(eligibility.isEligible())))
                .count();
    }
    
    private Integer calculateIneligibleResources(
            OptimizationInputDTO inputDTO) {

        return inputDTO.getResources().size()
                - calculateEligibleResources(inputDTO);
    }

}