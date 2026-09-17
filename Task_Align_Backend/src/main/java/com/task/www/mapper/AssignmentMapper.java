package com.task.www.mapper;
import org.springframework.stereotype.Component;

import com.task.www.dto.AssignmentResponse;
import com.task.www.entity.Assignment;

@Component
public class AssignmentMapper {
	
	public AssignmentResponse toResponse(Assignment assignment) {

	    return AssignmentResponse.builder()
	            .assignmentId(assignment.getAssignmentId())
	            .assignmentName(assignment.getAssignmentName())
	            .assignmentDescription(assignment.getAssignmentDescription())
	            .assignmentTypeId(assignment.getAssignmentTypeId())
	            .assignmentTypeName(
	                    assignment.getAssignmentType() != null
	                            ? assignment.getAssignmentType().getAssignmentTypeName()
	                            : null)
	            .optimizationType(assignment.getOptimizationType())
	            .assignmentStatus(assignment.getAssignmentStatus())
	            .build();
	}

}
