package com.task.www.service;

import com.task.www.dto.EligibleResourceResultResponse;

public interface EligibleResourceService {

    EligibleResourceResultResponse getEligibleResourcesForAssignment(Long assignmentId);
}
