package com.task.www.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.task.www.entity.AssignmentType;

public interface AssignmentTypeRepository extends JpaRepository<AssignmentType, Long> {

    boolean existsByAssignmentTypeName(String assignmentTypeName);

    boolean existsByAssignmentTypeNameAndIsDeletedFalse(String assignmentTypeName);

    Optional<AssignmentType> findByAssignmentTypeName(String assignmentTypeName);

    Optional<AssignmentType> findByAssignmentTypeNameIgnoreCaseAndIsDeletedFalse(String assignmentTypeName);

    Optional<AssignmentType> findByAssignmentTypeIdAndIsDeletedFalse(Long id);

    List<AssignmentType> findByIsDeletedFalse();

}
