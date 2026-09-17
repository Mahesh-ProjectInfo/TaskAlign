package com.task.www.serviceImpl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.task.www.config.SecurityUtils;
import com.task.www.dto.CreateAssignmentConstraintRequest;
import com.task.www.dto.UpdateAssignmentConstraintRequest;
import com.task.www.dto.AssignmentConstraintResponse;
import com.task.www.entity.Assignment;
import com.task.www.entity.AssignmentConstraint;
import com.task.www.exception.AssignmentConstraintNotFoundException;
import com.task.www.exception.AssignmentNotFoundException;
import com.task.www.exception.DuplicateAssignmentConstraintException;
import com.task.www.mapper.AssignmentConstraintMapper;
import com.task.www.repository.AssignmentConstraintRepository;
import com.task.www.repository.AssignmentRepository;
import com.task.www.service.AssignmentConstraintService;

@Service
@Transactional
public class AssignmentConstraintServiceImpl implements AssignmentConstraintService {

    private final AssignmentRepository assignmentRepository;
    private final AssignmentConstraintRepository constraintRepository;
    private final AssignmentConstraintMapper constraintMapper;

    public AssignmentConstraintServiceImpl(
            AssignmentRepository assignmentRepository,
            AssignmentConstraintRepository constraintRepository,
            AssignmentConstraintMapper constraintMapper) {
        this.assignmentRepository = assignmentRepository;
        this.constraintRepository = constraintRepository;
        this.constraintMapper = constraintMapper;
    }

    @Override
    public AssignmentConstraintResponse createConstraint(Long assignmentId, CreateAssignmentConstraintRequest request) {

        String currentUser = SecurityUtils.getCurrentUser();
        Assignment assignment = assignmentRepository
                .findByAssignmentIdAndCreatedByAndIsDeletedFalse(assignmentId, currentUser)
                .orElseThrow(() -> new AssignmentNotFoundException(
                        "Assignment not found with id : " + assignmentId));

        if (constraintRepository.existsByAssignmentAssignmentIdAndIsDeletedFalse(assignmentId)) {
            throw new DuplicateAssignmentConstraintException(
                    "Constraints already exist for assignment id : " + assignmentId);
        }

        AssignmentConstraint constraint = AssignmentConstraint.builder()
                .assignment(assignment)
                .budget(request.getBudget())
                .timelineDays(request.getTimelineDays())
                .workingDaysPerMonth(request.getWorkingDaysPerMonth())
                .build();

        AssignmentConstraint savedConstraint = constraintRepository.save(constraint);

        return constraintMapper.toResponse(savedConstraint);
    }

    @Override
    @Transactional(readOnly = true)
    public AssignmentConstraintResponse getConstraintByAssignmentId(Long assignmentId) {

        String currentUser = SecurityUtils.getCurrentUser();
        if (assignmentRepository.findByAssignmentIdAndCreatedByAndIsDeletedFalse(assignmentId, currentUser).isEmpty()) {
            throw new AssignmentNotFoundException(
                    "Assignment not found with id : " + assignmentId);
        }

        AssignmentConstraint constraint = constraintRepository
                .findByAssignmentAssignmentIdAndIsDeletedFalse(assignmentId)
                .orElseThrow(() -> new AssignmentConstraintNotFoundException(
                        "Constraints not found for assignment id : " + assignmentId));

        return constraintMapper.toResponse(constraint);
    }

    @Override
    public AssignmentConstraintResponse updateConstraint(
            Long assignmentId,
            Long constraintId,
            UpdateAssignmentConstraintRequest request) {

        String currentUser = SecurityUtils.getCurrentUser();
        if (assignmentRepository.findByAssignmentIdAndCreatedByAndIsDeletedFalse(assignmentId, currentUser).isEmpty()) {
            throw new AssignmentNotFoundException(
                    "Assignment not found with id : " + assignmentId);
        }

        AssignmentConstraint constraint = constraintRepository
                .findByAssignmentConstraintIdAndAssignmentAssignmentIdAndIsDeletedFalse(constraintId, assignmentId)
                .orElseThrow(() -> new AssignmentConstraintNotFoundException(
                        "Constraint not found with id : " + constraintId + " for assignment id : " + assignmentId));

        constraint.setBudget(request.getBudget());
        constraint.setTimelineDays(request.getTimelineDays());
        constraint.setWorkingDaysPerMonth(request.getWorkingDaysPerMonth());

        AssignmentConstraint updatedConstraint = constraintRepository.save(constraint);

        return constraintMapper.toResponse(updatedConstraint);
    }

    @Override
    public void deleteConstraint(Long assignmentId, Long constraintId) {

        String currentUser = SecurityUtils.getCurrentUser();
        if (assignmentRepository.findByAssignmentIdAndCreatedByAndIsDeletedFalse(assignmentId, currentUser).isEmpty()) {
            throw new AssignmentNotFoundException(
                    "Assignment not found with id : " + assignmentId);
        }

        AssignmentConstraint constraint = constraintRepository
                .findByAssignmentConstraintIdAndAssignmentAssignmentIdAndIsDeletedFalse(constraintId, assignmentId)
                .orElseThrow(() -> new AssignmentConstraintNotFoundException(
                        "Constraint not found with id : " + constraintId + " for assignment id : " + assignmentId));

        constraint.setIsDeleted(true);
        constraintRepository.save(constraint);
    }
}
