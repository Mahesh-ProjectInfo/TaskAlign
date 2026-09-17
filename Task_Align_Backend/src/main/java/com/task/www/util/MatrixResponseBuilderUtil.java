package com.task.www.util;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.task.www.dto.MatrixCellDTO;
import com.task.www.dto.MatrixDTO;
import com.task.www.dto.MatrixRowDTO;
import com.task.www.dto.OptimizationInputDTO;
import com.task.www.dto.ResourceDTO;

@Component
public class MatrixResponseBuilderUtil {
	
	public MatrixDTO buildMatrix(
	        OptimizationInputDTO inputDTO,
	        double[][] matrix,
	        int[] assignments,
	        String title,
	        String description) {

	    List<String> taskNames = buildTaskNames(inputDTO);

	    List<MatrixRowDTO> rows =
	            buildRows(inputDTO, matrix, assignments);

	    return MatrixDTO.builder()
	            .title(title)
	            .description(description)
	            .taskNames(taskNames)
	            .rows(rows)
	            .build();
	}
	
	public MatrixDTO buildMatrix(
	        OptimizationInputDTO inputDTO,
	        double[][] matrix,
	        String title,
	        String description) {

	    return buildMatrix(
	            inputDTO,
	            matrix,
	            new int[0],
	            title,
	            description);
	}
	
	private List<String> buildTaskNames(
	        OptimizationInputDTO inputDTO) {

	    List<String> taskNames = new ArrayList<>();

	    inputDTO.getTasks().forEach(task ->
	            taskNames.add(task.getTaskName()));

	    return taskNames;
	}
	
	private List<MatrixRowDTO> buildRows(
	        OptimizationInputDTO inputDTO,
	        double[][] matrix,
	        int[] assignments) {

	    List<MatrixRowDTO> rows = new ArrayList<>();

	    for (int resourceIndex = 0;
	         resourceIndex < inputDTO.getResources().size();
	         resourceIndex++) {

	        ResourceDTO resource =
	                inputDTO.getResources().get(resourceIndex);

	        List<MatrixCellDTO> cells = new ArrayList<>();

	        for (int taskIndex = 0;
	             taskIndex < inputDTO.getTasks().size();
	             taskIndex++) {

	        	boolean selected =
	        	        resourceIndex < assignments.length &&
	        	        assignments[resourceIndex] == taskIndex;

	        	MatrixCellDTO cell = MatrixCellDTO.builder()
	        	        .value(BigDecimal.valueOf(matrix[resourceIndex][taskIndex]))
	        	        .selected(selected)
	        	        .build();

	            cells.add(cell);
	        }

	        MatrixRowDTO row = MatrixRowDTO.builder()
	                .resourceName(resource.getResourceName())
	                .cells(cells)
	                .build();

	        rows.add(row);
	    }

	    return rows;
	}
	

}
