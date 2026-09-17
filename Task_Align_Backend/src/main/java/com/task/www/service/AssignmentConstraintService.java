package com.task.www.service;

import com.task.www.dto.CreateAssignmentConstraintRequest;
import com.task.www.dto.AssignmentConstraintResponse;

import com.task.www.dto.UpdateAssignmentConstraintRequest;

public interface AssignmentConstraintService {

    AssignmentConstraintResponse createConstraint(Long assignmentId, CreateAssignmentConstraintRequest request);

    AssignmentConstraintResponse getConstraintByAssignmentId(Long assignmentId);

    AssignmentConstraintResponse updateConstraint(Long assignmentId, Long constraintId, UpdateAssignmentConstraintRequest request);

    void deleteConstraint(Long assignmentId, Long constraintId);
}
