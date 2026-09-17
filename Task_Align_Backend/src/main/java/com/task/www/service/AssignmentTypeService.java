package com.task.www.service;

import java.util.List;

import com.task.www.dto.AssignmentTypeRequest;
import com.task.www.dto.AssignmentTypeResponse;

public interface AssignmentTypeService {

    AssignmentTypeResponse createAssignmentType(AssignmentTypeRequest request);

    List<AssignmentTypeResponse> getAllAssignmentTypes();

    AssignmentTypeResponse getAssignmentTypeById(Long id);

    AssignmentTypeResponse updateAssignmentType(Long id, AssignmentTypeRequest request);

    String deleteAssignmentType(Long id);

}
