package com.task.www.mapper;

import org.springframework.stereotype.Component;

import com.task.www.dto.AssignmentConstraintResponse;
import com.task.www.entity.AssignmentConstraint;

@Component
public class AssignmentConstraintMapper {

    public AssignmentConstraintResponse toResponse(AssignmentConstraint constraint) {
        return AssignmentConstraintResponse.builder()
                .assignmentConstraintId(constraint.getAssignmentConstraintId())
                .assignmentId(constraint.getAssignment() != null ? constraint.getAssignment().getAssignmentId() : null)
                .budget(constraint.getBudget())
                .timelineDays(constraint.getTimelineDays())
                .workingDaysPerMonth(constraint.getWorkingDaysPerMonth())
                .build();
    }
}
