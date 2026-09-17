package com.task.www.service;

import java.util.List;

import com.task.www.dto.SkillRequest;
import com.task.www.dto.SkillResponse;

public interface SkillService {

    SkillResponse createSkill(SkillRequest request);

    List<SkillResponse> getAllSkills();

    SkillResponse getSkillById(Long id);

    SkillResponse updateSkill(Long id, SkillRequest request);

    String deleteSkill(Long id);

}
