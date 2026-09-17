package com.task.www.util;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

import org.springframework.stereotype.Component;

import com.task.www.dto.ConstraintDTO;
import com.task.www.dto.EligibilityDTO;
import com.task.www.dto.OptimizationInputDTO;
import com.task.www.dto.ResourceDTO;
import com.task.www.dto.TaskDTO;

@Component
public class MatrixGenerationUtil {

	private static final double COST_INELIGIBLE = 999999;
	private static final double PROFIT_INELIGIBLE = 0;
	
    public double[][] generateCostMatrix(OptimizationInputDTO inputDTO) {

        List<ResourceDTO> resources = inputDTO.getResources();
        List<TaskDTO> tasks = inputDTO.getTasks();
        List<EligibilityDTO> eligibilityList = inputDTO.getEligibilityList();
        ConstraintDTO constraint = inputDTO.getConstraint();

        double[][] costMatrix = new double[resources.size()][tasks.size()];

        for (int i = 0; i < resources.size(); i++) {

            ResourceDTO resource = resources.get(i);

            BigDecimal dailyCost = resource.getMonthlySalary()
                    .divide(
                            BigDecimal.valueOf(constraint.getWorkingDaysPerMonth()),
                            2,
                            RoundingMode.HALF_UP);

            for (int j = 0; j < tasks.size(); j++) {

                TaskDTO task = tasks.get(j);

                boolean eligible = isEligible(
                        resource.getResourceId(),
                        task.getTaskId(),
                        eligibilityList);

                if (!eligible) {

                	costMatrix[i][j] = COST_INELIGIBLE;

                } else {

                    BigDecimal taskCost = dailyCost.multiply(
                            BigDecimal.valueOf(task.getEstimatedDays()));

                    costMatrix[i][j] = taskCost.doubleValue();
                }
            }
        }

        return costMatrix;
    }

    private boolean isEligible(Long resourceId,
                               Long taskId,
                               List<EligibilityDTO> eligibilityList) {

        for (EligibilityDTO eligibility : eligibilityList) {

            if (eligibility.getResourceId().equals(resourceId)
                    && eligibility.getTaskId().equals(taskId)) {

                return eligibility.isEligible();
            }
        }

        return false;
    }

    public double[][] generateProfitMatrix(OptimizationInputDTO inputDTO) {

        List<ResourceDTO> resources = inputDTO.getResources();
        List<TaskDTO> tasks = inputDTO.getTasks();
        List<EligibilityDTO> eligibilityList = inputDTO.getEligibilityList();
        ConstraintDTO constraint = inputDTO.getConstraint();

        double[][] profitMatrix = new double[resources.size()][tasks.size()];

        for (int i = 0; i < resources.size(); i++) {

            ResourceDTO resource = resources.get(i);

            BigDecimal dailyCost = resource.getMonthlySalary()
                    .divide(
                            BigDecimal.valueOf(constraint.getWorkingDaysPerMonth()),
                            2,
                            RoundingMode.HALF_UP);

            for (int j = 0; j < tasks.size(); j++) {

                TaskDTO task = tasks.get(j);

                boolean eligible = isEligible(
                        resource.getResourceId(),
                        task.getTaskId(),
                        eligibilityList);

                if (!eligible) {

                    // Profit Maximization:
                    // 0 means ineligible and HungarianAlgorithmUtil skips it.
                	profitMatrix[i][j] = PROFIT_INELIGIBLE;

                } else {

                    BigDecimal taskCost = dailyCost.multiply(
                            BigDecimal.valueOf(task.getEstimatedDays()));

                    profitMatrix[i][j] = taskCost.doubleValue();
                }
            }
        }

        return profitMatrix;
    }

}