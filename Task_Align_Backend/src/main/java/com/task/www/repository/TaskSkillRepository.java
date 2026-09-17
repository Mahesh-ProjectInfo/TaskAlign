package com.task.www.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.task.www.entity.TaskSkill;

@Repository
public interface TaskSkillRepository extends JpaRepository<TaskSkill, Long> {

    boolean existsByTaskTaskIdAndSkillId(Long taskId, Long skillId);

    List<TaskSkill> findByTaskTaskId(Long taskId);

    List<TaskSkill> findByTaskTaskIdAndSkillIdIn(Long taskId, List<Long> skillIds);
}
