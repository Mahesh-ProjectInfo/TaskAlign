package com.task.www.serviceImpl;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.task.www.dto.AssignmentResultDTO;
import com.task.www.dto.EligibilityDTO;
import com.task.www.dto.OptimizationInputDTO;
import com.task.www.dto.OptimizationPreviewDTO;
import com.task.www.dto.ResourceDTO;
import com.task.www.dto.TaskDTO;
import com.task.www.entity.Assignment;
import com.task.www.enums.AssignmentStatus;
import com.task.www.enums.OptimizationType;
import com.task.www.repository.AssignmentRepository;
import com.task.www.service.OptimizationService;
import com.task.www.util.HungarianAlgorithmUtil;
import com.task.www.util.MatrixGenerationUtil;
import com.task.www.util.MatrixPaddingUtil;
import com.task.www.util.PreviewBuilderUtil;
import com.task.www.util.ResultBuilderUtil;

@Service
public class OptimizationServiceImpl implements OptimizationService {
	
	private final MatrixGenerationUtil matrixGenerationUtil;

	private final MatrixPaddingUtil matrixPaddingUtil;

	private final HungarianAlgorithmUtil hungarianAlgorithmUtil;

	private final ResultBuilderUtil resultBuilderUtil;
	
	private final PreviewBuilderUtil previewBuilderUtil;

	private final AssignmentRepository assignmentRepository;
	
	public OptimizationServiceImpl(
	        MatrixGenerationUtil matrixGenerationUtil,
	        MatrixPaddingUtil matrixPaddingUtil,
	        HungarianAlgorithmUtil hungarianAlgorithmUtil,
	        ResultBuilderUtil resultBuilderUtil,
	        PreviewBuilderUtil previewBuilderUtil,
	        AssignmentRepository assignmentRepository) {

	    this.matrixGenerationUtil = matrixGenerationUtil;
	    this.matrixPaddingUtil = matrixPaddingUtil;
	    this.hungarianAlgorithmUtil = hungarianAlgorithmUtil;
	    this.resultBuilderUtil = resultBuilderUtil;
	    this.previewBuilderUtil = previewBuilderUtil;
	    this.assignmentRepository = assignmentRepository;
	}

	@Override
	public AssignmentResultDTO optimizeAssignment(OptimizationInputDTO inputDTO) {
		
	    long startTime = System.currentTimeMillis();
	    
	    validateTaskEligibility(inputDTO);
	    double[][] previewMatrix = generateMatrix(inputDTO);

	    double[][] optimizationMatrix =
	            prepareMatrixForOptimization(
	                    previewMatrix,
	                    inputDTO.getOptimizationType());

	    optimizationMatrix =
	            matrixPaddingUtil.padMatrix(optimizationMatrix, 0);

	    int[] assignments =
	            hungarianAlgorithmUtil.solve(optimizationMatrix);

	    AssignmentResultDTO result =
	            resultBuilderUtil.buildResult(
	                    inputDTO,
	                    assignments,
	                    optimizationMatrix);
		   
	    long endTime = System.currentTimeMillis();
	    result.setExecutionTime(endTime - startTime);

	    if (inputDTO.getAssignmentId() != null) {
	        Assignment assignment = assignmentRepository.findById(inputDTO.getAssignmentId()).orElse(null);
	        if (assignment != null) {
	            assignment.setAssignmentStatus(AssignmentStatus.COMPLETED);
	            assignmentRepository.save(assignment);
	        }
	    }
		   
	    return result;
	}
	
	@Override
	public OptimizationPreviewDTO previewAssignment(
	        OptimizationInputDTO inputDTO) {

	    double[][] matrix = generateMatrix(inputDTO);

	    String title;
	    String description;

	    if (inputDTO.getOptimizationType() == OptimizationType.COST_MINIMIZATION) {

	        title = "Cost Matrix";

	        description =
	                "Assignment cost (Monthly Salary / Working Days × Estimated Days); 999999 for ineligible.";

	    } else {

	        title = "Profit Matrix";

	        description =
	                "Assignment cost (Monthly Salary / Working Days × Estimated Days); 0 for ineligible.";
	    }

	    return previewBuilderUtil.buildPreview(
	            inputDTO,
	            matrix,
	            title,
	            description);
	}
	
	private double[][] generateMatrix(OptimizationInputDTO inputDTO) {

	    validateInput(inputDTO);
	    validateResourceNames(inputDTO);
	    validateTaskNames(inputDTO);
	    validateRoles(inputDTO);
	    validateMonthlySalary(inputDTO);
	    validatePerformanceRating(inputDTO);
	    validateEstimatedDays(inputDTO);
	    validateDuplicateResourceIds(inputDTO);
	    validateDuplicateTaskIds(inputDTO);
	    validateDuplicateEligibilityMappings(inputDTO);
	    validateEligibilityResourceIds(inputDTO);
	    validateEligibilityTaskIds(inputDTO);
	    //validateTaskEligibility(inputDTO);

	    if (inputDTO.getOptimizationType() == OptimizationType.COST_MINIMIZATION) {

	        return matrixGenerationUtil.generateCostMatrix(inputDTO);

	    }

	    return matrixGenerationUtil.generateProfitMatrix(inputDTO);
	}
	
	private double[][] prepareMatrixForOptimization(
	        double[][] matrix,
	        OptimizationType optimizationType) {

	    if (optimizationType != OptimizationType.PROFIT_MAXIMIZATION) {
	        return matrix;
	    }

	    double[][] optimizedMatrix = new double[matrix.length][matrix[0].length];

	    for (int i = 0; i < matrix.length; i++) {

	        for (int j = 0; j < matrix[i].length; j++) {

	            if (matrix[i][j] == 0) {

	                optimizedMatrix[i][j] = 999999;

	            } else {

	                optimizedMatrix[i][j] = matrix[i][j];
	            }
	        }
	    }

	    return optimizedMatrix;
	}
	private void validateInput(OptimizationInputDTO inputDTO) {

	    if (inputDTO == null) {
	        throw new IllegalArgumentException("Request body cannot be null.");
	    }

	    // Assignment ID
	    if (inputDTO.getAssignmentId() == null) {
	        throw new IllegalArgumentException("Assignment ID is required.");
	    }

	    // Assignment Name
	    if (inputDTO.getAssignmentName() == null ||
	            inputDTO.getAssignmentName().trim().isEmpty()) {

	        throw new IllegalArgumentException("Assignment name is required.");
	    }

	    // Assignment Type
	    if (inputDTO.getAssignmentType() == null) {
	        throw new IllegalArgumentException("Assignment type is required.");
	    }

	    // Optimization Type
	    if (inputDTO.getOptimizationType() == null) {
	        throw new IllegalArgumentException("Optimization type is required.");
	    }

	    // Constraint
	    if (inputDTO.getConstraint() == null) {
	        throw new IllegalArgumentException("Assignment constraint is required.");
	    }

	    // Budget
	    if (inputDTO.getConstraint().getBudget() == null ||
	            inputDTO.getConstraint().getBudget().doubleValue() <= 0) {

	        throw new IllegalArgumentException("Budget must be greater than 0.");
	    }

	    // Timeline
	    if (inputDTO.getConstraint().getTimelineDays() == null ||
	            inputDTO.getConstraint().getTimelineDays() <= 0) {

	        throw new IllegalArgumentException("Timeline days must be greater than 0.");
	    }

	    // Working Days
	    if (inputDTO.getConstraint().getWorkingDaysPerMonth() == null ||
	            inputDTO.getConstraint().getWorkingDaysPerMonth() <= 0) {

	        throw new IllegalArgumentException("Working days per month must be greater than 0.");
	    }

	    // Resources
	    if (inputDTO.getResources() == null ||
	            inputDTO.getResources().isEmpty()) {

	        throw new IllegalArgumentException("At least one resource is required.");
	    }

	    // Tasks
	    if (inputDTO.getTasks() == null ||
	            inputDTO.getTasks().isEmpty()) {

	        throw new IllegalArgumentException("At least one task is required.");
	    }

	    // Eligibility List
	    if (inputDTO.getEligibilityList() == null ||
	            inputDTO.getEligibilityList().isEmpty()) {

	        throw new IllegalArgumentException("Eligibility list cannot be empty.");
	    }
	}
	
	private void validateTaskEligibility(OptimizationInputDTO inputDTO) {

	    for (TaskDTO task : inputDTO.getTasks()) {

	        boolean hasEligibleResource = inputDTO.getEligibilityList()
	                .stream()
	                .anyMatch(eligibility ->
	                        eligibility.getTaskId().equals(task.getTaskId())
	                                && eligibility.isEligible());

	        if (!hasEligibleResource) {
	            throw new IllegalArgumentException(
	                    "No eligible resource found for task: " + task.getTaskName());
	        }
	    }
	}
	
	private void validateDuplicateResourceIds(OptimizationInputDTO inputDTO) {

	    Set<Long> resourceIds = new HashSet<>();

	    for (ResourceDTO resource : inputDTO.getResources()) {

	        if (!resourceIds.add(resource.getResourceId())) {
	            throw new IllegalArgumentException(
	                    "Duplicate Resource ID found: " + resource.getResourceId());
	        }
	    }
	}
	
	private void validateDuplicateTaskIds(OptimizationInputDTO inputDTO) {

	    Set<Long> taskIds = new HashSet<>();

	    for (TaskDTO task : inputDTO.getTasks()) {

	        if (!taskIds.add(task.getTaskId())) {
	            throw new IllegalArgumentException(
	                    "Duplicate Task ID found: " + task.getTaskId());
	        }
	    }
	}
	
	private void validateDuplicateEligibilityMappings(OptimizationInputDTO inputDTO) {

	    Set<String> mappings = new HashSet<>();

	    for (EligibilityDTO eligibility : inputDTO.getEligibilityList()) {

	        String key = eligibility.getResourceId() + "-" + eligibility.getTaskId();

	        if (!mappings.add(key)) {
	            throw new IllegalArgumentException(
	                    "Duplicate Eligibility Mapping found for Resource ID "
	                            + eligibility.getResourceId()
	                            + " and Task ID "
	                            + eligibility.getTaskId());
	        }
	    }
	}
	

	
	private void validateEligibilityResourceIds(OptimizationInputDTO inputDTO) {

	    Set<Long> resourceIds = inputDTO.getResources()
	            .stream()
	            .map(ResourceDTO::getResourceId)
	            .collect(Collectors.toSet());

	    for (EligibilityDTO eligibility : inputDTO.getEligibilityList()) {

	        if (!resourceIds.contains(eligibility.getResourceId())) {
	            throw new IllegalArgumentException(
	                    "Invalid Resource ID in Eligibility List: "
	                            + eligibility.getResourceId());
	        }
	    }
	}

	private void validateEligibilityTaskIds(OptimizationInputDTO inputDTO) {

	    Set<Long> taskIds = inputDTO.getTasks()
	            .stream()
	            .map(TaskDTO::getTaskId)
	            .collect(Collectors.toSet());

	    for (EligibilityDTO eligibility : inputDTO.getEligibilityList()) {

	        if (!taskIds.contains(eligibility.getTaskId())) {
	            throw new IllegalArgumentException(
	                    "Invalid Task ID in Eligibility List: "
	                            + eligibility.getTaskId());
	        }
	    }
	}
	
	
	private void validateMonthlySalary(OptimizationInputDTO inputDTO) {

	    for (ResourceDTO resource : inputDTO.getResources()) {

	        if (resource.getMonthlySalary() == null ||
	                resource.getMonthlySalary().doubleValue() <= 0) {

	            throw new IllegalArgumentException(
	                    "Monthly salary must be greater than 0 for resource: "
	                            + resource.getResourceName());
	        }
	    }
	}
	
	private void validatePerformanceRating(OptimizationInputDTO inputDTO) {

	    for (ResourceDTO resource : inputDTO.getResources()) {

	        if (resource.getPerformanceRating() == null
	                || resource.getPerformanceRating() < 1
	                || resource.getPerformanceRating() > 100) {

	            throw new IllegalArgumentException(
	                    "Performance rating must be between 1 and 100 for resource: "
	                            + resource.getResourceName());
	        }
	    }
	}
	
	private void validateEstimatedDays(OptimizationInputDTO inputDTO) {

	    for (TaskDTO task : inputDTO.getTasks()) {

	        if (task.getEstimatedDays() == null ||
	                task.getEstimatedDays() <= 0) {

	            throw new IllegalArgumentException(
	                    "Estimated days must be greater than 0 for task: "
	                            + task.getTaskName());
	        }
	    }
	}
	
	private void validateResourceNames(OptimizationInputDTO inputDTO) {

	    for (ResourceDTO resource : inputDTO.getResources()) {

	        if (resource.getResourceName() == null ||
	                resource.getResourceName().trim().isEmpty()) {

	            throw new IllegalArgumentException(
	                    "Resource name is required.");
	        }
	    }
	}
	
	private void validateTaskNames(OptimizationInputDTO inputDTO) {

	    for (TaskDTO task : inputDTO.getTasks()) {

	        if (task.getTaskName() == null ||
	                task.getTaskName().trim().isEmpty()) {

	            throw new IllegalArgumentException(
	                    "Task name is required.");
	        }
	    }
	}
	
	private void validateRoles(OptimizationInputDTO inputDTO) {

	    for (ResourceDTO resource : inputDTO.getResources()) {

	        if (resource.getRole() == null ||
	                resource.getRole().trim().isEmpty()) {

	            throw new IllegalArgumentException(
	                    "Role is required for resource: "
	                            + resource.getResourceName());
	        }
	    }
	}
}
