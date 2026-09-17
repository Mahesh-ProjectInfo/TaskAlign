package com.task.www.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.task.www.entity.AssignmentConstraint;

@Repository
public interface AssignmentConstraintRepository extends JpaRepository<AssignmentConstraint, Long> {

    Optional<AssignmentConstraint> findByAssignmentAssignmentIdAndIsDeletedFalse(Long assignmentId);

    boolean existsByAssignmentAssignmentIdAndIsDeletedFalse(Long assignmentId);

    Optional<AssignmentConstraint> findByAssignmentConstraintIdAndAssignmentAssignmentIdAndIsDeletedFalse(Long constraintId, Long assignmentId);

    void deleteByAssignmentAssignmentId(Long assignmentId);
}
