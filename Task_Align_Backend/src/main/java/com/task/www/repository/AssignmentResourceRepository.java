package com.task.www.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.task.www.entity.AssignmentResource;

@Repository
public interface AssignmentResourceRepository extends JpaRepository<AssignmentResource, Long> {

    boolean existsByAssignmentAssignmentIdAndResourceId(Long assignmentId, Long resourceId);

    List<AssignmentResource> findByAssignmentAssignmentId(Long assignmentId);

    List<AssignmentResource> findByAssignmentAssignmentIdAndResourceIdIn(Long assignmentId, List<Long> resourceIds);
}
