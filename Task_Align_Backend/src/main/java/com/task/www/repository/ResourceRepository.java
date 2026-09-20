package com.task.www.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.task.www.entity.Resource;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {

	List<Resource> findByIsDeletedFalse();

	@Query("""
			SELECT DISTINCT r
			FROM Resource r
			LEFT JOIN FETCH r.role
			LEFT JOIN FETCH r.assignmentType
			WHERE r.isDeleted = false
			""")
	List<Resource> findByIsDeletedFalseFetchRoleAndAssignmentType();

	Optional<Resource> findByResourceIdAndIsDeletedFalse(Long id);

	// Search By Resource Name
	List<Resource> findByResourceNameContainingIgnoreCase(String name);

	List<Resource> findByResourceNameContainingIgnoreCaseAndIsDeletedFalse(String name);

	// Filter By Role
	List<Resource> findByRoleRoleId(Long roleId);

	List<Resource> findByRoleRoleIdAndIsDeletedFalse(Long roleId);

}
