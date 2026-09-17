package com.task.www.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.task.www.entity.ResourceSkill;

@Repository
public interface ResourceSkillRepository extends JpaRepository<ResourceSkill, Long> {

    List<ResourceSkill> findByResourceResourceId(Long resourceId);

    List<ResourceSkill> findByResourceResourceIdIn(List<Long> resourceIds);

    List<ResourceSkill> findBySkillSkillId(Long skillId);

    void deleteByResourceResourceId(Long resourceId);

    boolean existsByResourceResourceIdAndSkillSkillId(Long resourceId, Long skillId);

}
