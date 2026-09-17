package com.task.www.util;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.task.www.dto.AssignmentResultDTO;
import com.task.www.dto.ConstraintDTO;
import com.task.www.dto.EligibilityDTO;
import com.task.www.dto.MatrixDTO;
import com.task.www.dto.OptimizationInputDTO;
import com.task.www.dto.ResourceDTO;
import com.task.www.dto.TaskAssignmentDTO;
import com.task.www.dto.TaskDTO;
import com.task.www.enums.OptimizationType;

@Component
public class ResultBuilderUtil {
	
	private final MatrixResponseBuilderUtil matrixResponseBuilderUtil;
	
	public ResultBuilderUtil(MatrixResponseBuilderUtil matrixResponseBuilderUtil) {
	    this.matrixResponseBuilderUtil = matrixResponseBuilderUtil;
	}

	public AssignmentResultDTO buildResult(
	        OptimizationInputDTO inputDTO,
	        int[] assignments,
	        double[][] matrix) {

	    List<TaskAssignmentDTO> taskAssignments =
	            buildTaskAssignments(inputDTO, assignments, matrix);

	    BigDecimal totalCost =
	            calculateTotalCost(taskAssignments);

	    BigDecimal totalSavedMoney =
	            calculateTotalSavedMoney(taskAssignments);
	    
	    String budgetStatus = calculateBudgetStatus(
	            totalCost,
	            inputDTO.getConstraint().getBudget());
	    
	    String timelineStatus = calculateTimelineStatus(
	            inputDTO,
	            assignments);


	    // Add this here
	    MatrixDTO matrixDTO = matrixResponseBuilderUtil.buildMatrix(
	            inputDTO,
	            matrix,
	            assignments,
	            "Assignment Cost Matrix",
	            "Cost matrix used by the Hungarian Algorithm.");
	    
	    return AssignmentResultDTO.builder()
	            .assignmentId(inputDTO.getAssignmentId())
	            .assignmentName(inputDTO.getAssignmentName())
	            .assignmentDescription(inputDTO.getAssignmentDescription())
	            .assignmentType(inputDTO.getAssignmentType())
	            .optimizationType(inputDTO.getOptimizationType().name())

	            .budget(inputDTO.getConstraint().getBudget())
	            .timelineDays(inputDTO.getConstraint().getTimelineDays())
	            .workingDaysPerMonth(inputDTO.getConstraint().getWorkingDaysPerMonth())

	            .totalResources(inputDTO.getResources().size())
	            .totalTasks(inputDTO.getTasks().size())

	            .taskAssignments(taskAssignments)
	            .matrix(matrixDTO)

	            .totalCost(totalCost)
	            .totalSavedMoney(totalSavedMoney)
	            .budgetStatus(budgetStatus)
	            .timelineStatus(timelineStatus)
	            .assignmentStatus("Completed")

	            .build();
	}

	private List<TaskAssignmentDTO> buildTaskAssignments(
	        OptimizationInputDTO inputDTO,
	        int[] assignments,
	        double[][] matrix) {

	    List<TaskAssignmentDTO> taskAssignments = new ArrayList<>();

	    for (int resourceIndex = 0; resourceIndex < assignments.length; resourceIndex++) {

	        int taskIndex = assignments[resourceIndex];

	        // Skip invalid assignments
	        if (taskIndex == -1) {
	            continue;
	        }

	        // Skip padded resources
	        if (resourceIndex >= inputDTO.getResources().size()) {
	            continue;
	        }

	        // Skip padded tasks
	        if (taskIndex >= inputDTO.getTasks().size()) {
	            continue;
	        }

	        ResourceDTO resource = inputDTO.getResources().get(resourceIndex);
	        TaskDTO task = inputDTO.getTasks().get(taskIndex);

	        BigDecimal assignedCost =
	                BigDecimal.valueOf(matrix[resourceIndex][taskIndex]);

	        BigDecimal savedMoney = BigDecimal.ZERO;

	        if (inputDTO.getOptimizationType() == OptimizationType.PROFIT_MAXIMIZATION) {
	            savedMoney = calculateSavedMoney(
	                    inputDTO,
	                    taskIndex,
	                    assignedCost);
	        }

	        TaskAssignmentDTO taskAssignment = TaskAssignmentDTO.builder()
	                .taskId(task.getTaskId())
	                .taskName(task.getTaskName())
	                .resourceId(resource.getResourceId())
	                .resourceName(resource.getResourceName())
	                .role(resource.getRole())
	                .estimatedDays(task.getEstimatedDays())
	                .assignedCost(assignedCost)
	                .savedMoney(savedMoney)
	                .performanceRating(resource.getPerformanceRating())
	                .build();

	        taskAssignments.add(taskAssignment);
	    }

	    return taskAssignments;
	}

	private BigDecimal calculateTotalCost(
	        List<TaskAssignmentDTO> taskAssignments) {

	    BigDecimal totalCost = BigDecimal.ZERO;

	    for (TaskAssignmentDTO taskAssignment : taskAssignments) {

	        totalCost = totalCost.add(taskAssignment.getAssignedCost());
	    }

	    return totalCost;
	}

	private BigDecimal calculateTotalSavedMoney(
	        List<TaskAssignmentDTO> taskAssignments) {

	    BigDecimal totalSavedMoney = BigDecimal.ZERO;

	    for (TaskAssignmentDTO taskAssignment : taskAssignments) {

	        totalSavedMoney = totalSavedMoney.add(taskAssignment.getSavedMoney());
	    }

	    return totalSavedMoney;
	}

    private BigDecimal calculateSavedMoney(
            OptimizationInputDTO inputDTO,
            int taskIndex,
            BigDecimal assignedCost) {

        TaskDTO task = inputDTO.getTasks().get(taskIndex);
        ConstraintDTO constraint = inputDTO.getConstraint();

        BigDecimal highestEligibleTaskCost = BigDecimal.ZERO;

        for (EligibilityDTO eligibility : inputDTO.getEligibilityList()) {

            if (!Boolean.TRUE.equals(eligibility.isEligible())) {
                continue;
            }

            if (!eligibility.getTaskId().equals(task.getTaskId())) {
                continue;
            }

            ResourceDTO resource = inputDTO.getResources()
                    .stream()
                    .filter(r -> r.getResourceId().equals(eligibility.getResourceId()))
                    .findFirst()
                    .orElse(null);

            if (resource == null) {
                continue;
            }

            BigDecimal dailyCost = resource.getMonthlySalary()
                    .divide(
                            BigDecimal.valueOf(constraint.getWorkingDaysPerMonth()),
                            2,
                            RoundingMode.HALF_UP);

            BigDecimal taskCost = dailyCost.multiply(
                    BigDecimal.valueOf(task.getEstimatedDays()));

            if (taskCost.compareTo(highestEligibleTaskCost) > 0) {
                highestEligibleTaskCost = taskCost;
            }
        }

        return highestEligibleTaskCost.subtract(assignedCost);
    }
    
    private String calculateBudgetStatus(
            BigDecimal totalCost,
            BigDecimal budget) {

        if (totalCost.compareTo(budget) <= 0) {
            return "Within Budget";
        }

        return "Budget Exceeded";
    }
    
    private String calculateTimelineStatus(
            OptimizationInputDTO inputDTO,
            int[] assignments) {

        int projectDuration = 0;

        for (int resourceIndex = 0; resourceIndex < assignments.length; resourceIndex++) {

            int taskIndex = assignments[resourceIndex];

            // Ignore unassigned or padded tasks
            if (taskIndex == -1 ||
                taskIndex >= inputDTO.getTasks().size() ||
                resourceIndex >= inputDTO.getResources().size()) {
                continue;
            }

            TaskDTO task = inputDTO.getTasks().get(taskIndex);

            projectDuration = Math.max(projectDuration, task.getEstimatedDays());
        }

        if (projectDuration <= inputDTO.getConstraint().getTimelineDays()) {
            return "Within Timeline";
        }

        return "Timeline Exceeded";
    }

}