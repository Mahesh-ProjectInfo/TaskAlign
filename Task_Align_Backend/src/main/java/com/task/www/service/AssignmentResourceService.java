package com.task.www.service;

import java.util.List;

import com.task.www.dto.AddAssignmentResourcesRequest;
import com.task.www.dto.AssignmentResourceResponse;

public interface AssignmentResourceService {

    List<AssignmentResourceResponse> addResourcesToAssignment(Long assignmentId, AddAssignmentResourcesRequest request);

    List<AssignmentResourceResponse> getResourcesByAssignmentId(Long assignmentId);

    List<AssignmentResourceResponse> updateAssignmentResources(Long assignmentId, AddAssignmentResourcesRequest request);

    List<AssignmentResourceResponse> removeResourcesFromAssignment(Long assignmentId, AddAssignmentResourcesRequest request);
}
