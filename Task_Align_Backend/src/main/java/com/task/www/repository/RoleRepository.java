package com.task.www.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.task.www.entity.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    boolean existsByRoleName(String roleName);

    List<Role> findByIsDeletedFalse();

    long countByIsDeletedFalse();

    Optional<Role> findByRoleIdAndIsDeletedFalse(Long roleId);

    List<Role> findByAssignmentTypeAssignmentTypeIdAndIsDeletedFalse(Long assignmentTypeId);

    boolean existsByRoleNameAndAssignmentTypeAssignmentTypeIdAndIsDeletedFalse(String roleName, Long assignmentTypeId);

    Optional<Role> findByRoleNameIgnoreCaseAndAssignmentTypeAssignmentTypeIdAndIsDeletedFalse(String roleName, Long assignmentTypeId);

    Optional<Role> findByRoleNameIgnoreCaseAndIsDeletedFalse(String roleName);

}
