package com.task.www.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.task.www.entity.Task;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByAssignmentAssignmentId(Long assignmentId);

    List<Task> findByAssignmentAssignmentIdAndIsDeletedFalse(Long assignmentId);

    Optional<Task> findByTaskIdAndAssignmentAssignmentId(Long taskId, Long assignmentId);

    Optional<Task> findByTaskIdAndAssignmentAssignmentIdAndIsDeletedFalse(Long taskId, Long assignmentId);

    boolean existsByAssignmentAssignmentIdAndTaskNameIgnoreCase(Long assignmentId, String taskName);

    boolean existsByAssignmentAssignmentIdAndTaskNameIgnoreCaseAndIsDeletedFalse(Long assignmentId, String taskName);

    boolean existsByAssignmentAssignmentIdAndTaskNameIgnoreCaseAndTaskIdNotAndIsDeletedFalse(Long assignmentId, String taskName, Long taskId);

    long countByAssignmentCreatedByAndIsDeletedFalse(String createdBy);
}

