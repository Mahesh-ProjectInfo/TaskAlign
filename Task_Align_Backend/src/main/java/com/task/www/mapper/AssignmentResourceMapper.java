package com.task.www.mapper;

import org.springframework.stereotype.Component;

import com.task.www.dto.AssignmentResourceResponse;
import com.task.www.entity.AssignmentResource;

@Component
public class AssignmentResourceMapper {

    public AssignmentResourceResponse toResponse(AssignmentResource assignmentResource) {
        return AssignmentResourceResponse.builder()
                .assignmentResourceId(assignmentResource.getAssignmentResourceId())
                .assignmentId(assignmentResource.getAssignment() != null ? assignmentResource.getAssignment().getAssignmentId() : null)
                .resourceId(assignmentResource.getResourceId())
                .build();
    }
}
