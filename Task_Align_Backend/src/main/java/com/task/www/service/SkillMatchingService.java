package com.task.www.service;

import com.task.www.dto.SkillMatchingResultResponse;

public interface SkillMatchingService {

    SkillMatchingResultResponse getSkillMatchingForAssignment(Long assignmentId);
}
