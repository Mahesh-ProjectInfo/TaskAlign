package com.task.www.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.task.www.entity.ResourceSkill;

@Repository
public interface ResourceSkillRepository extends JpaRepository<ResourceSkill, Long> {

    List<ResourceSkill> findByResourceResourceId(Long resourceId);

    @Query("""
            SELECT DISTINCT rs
            FROM ResourceSkill rs
            LEFT JOIN FETCH rs.skill s
            LEFT JOIN FETCH s.assignmentType
            WHERE rs.resource.resourceId IN :resourceIds
            """)
    List<ResourceSkill> findByResourceResourceIdIn(@Param("resourceIds") List<Long> resourceIds);

    List<ResourceSkill> findBySkillSkillId(Long skillId);

    void deleteByResourceResourceId(Long resourceId);

    boolean existsByResourceResourceIdAndSkillSkillId(Long resourceId, Long skillId);

}
