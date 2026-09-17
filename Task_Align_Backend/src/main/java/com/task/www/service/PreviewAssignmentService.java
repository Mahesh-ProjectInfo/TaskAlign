package com.task.www.service;

import com.task.www.dto.PreviewAssignmentResponse;

public interface PreviewAssignmentService {

    PreviewAssignmentResponse getAssignmentPreview(Long assignmentId);
}
