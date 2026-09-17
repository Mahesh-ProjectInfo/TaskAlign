package com.task.www.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.task.www.entity.Skill;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {

    boolean existsBySkillName(String skillName);

    List<Skill> findByIsDeletedFalse();

    Optional<Skill> findBySkillIdAndIsDeletedFalse(Long skillId);

    List<Skill> findByAssignmentTypeAssignmentTypeIdAndIsDeletedFalse(Long assignmentTypeId);

    boolean existsBySkillNameAndAssignmentTypeAssignmentTypeIdAndIsDeletedFalse(String skillName, Long assignmentTypeId);

    Optional<Skill> findBySkillNameIgnoreCaseAndAssignmentTypeAssignmentTypeIdAndIsDeletedFalse(String skillName, Long assignmentTypeId);

    Optional<Skill> findBySkillNameIgnoreCaseAndIsDeletedFalse(String skillName);

}
