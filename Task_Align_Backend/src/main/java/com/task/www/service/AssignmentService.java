package com.task.www.service;

import java.util.List;

import com.task.www.dto.CreateAssignmentRequest;
import com.task.www.dto.AssignmentResponse;

public interface AssignmentService {

    AssignmentResponse createAssignment(CreateAssignmentRequest request);

    List<AssignmentResponse> getAllAssignments();

    AssignmentResponse getAssignmentById(Long assignmentId);

    AssignmentResponse updateAssignment(Long assignmentId, CreateAssignmentRequest request);

    void deleteAssignment(Long assignmentId);
    
}

