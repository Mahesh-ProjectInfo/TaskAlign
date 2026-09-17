package com.task.www.serviceImpl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.task.www.dto.AssignmentTypeRequest;
import com.task.www.dto.AssignmentTypeResponse;
import com.task.www.entity.AssignmentType;
import com.task.www.exception.DuplicateResourceException;
import com.task.www.exception.ResourceNotFoundException;
import com.task.www.repository.AssignmentTypeRepository;
import com.task.www.service.AssignmentTypeService;

@Service
public class AssignmentTypeServiceImpl implements AssignmentTypeService {

    @Autowired
    private AssignmentTypeRepository assignmentTypeRepository;

    @Override
    public AssignmentTypeResponse createAssignmentType(AssignmentTypeRequest request) {

        if (assignmentTypeRepository.existsByAssignmentTypeNameAndIsDeletedFalse(
                request.getAssignmentTypeName())) {

            throw new DuplicateResourceException(
                    "Assignment Type already exists.");
        }

        AssignmentType assignmentType = new AssignmentType();

        assignmentType.setAssignmentTypeName(
                request.getAssignmentTypeName());

        assignmentType.setIsDeleted(false);

        AssignmentType savedAssignmentType =
                assignmentTypeRepository.save(assignmentType);

        return mapToResponse(savedAssignmentType);
    }

    @Override
    public List<AssignmentTypeResponse> getAllAssignmentTypes() {

        return assignmentTypeRepository.findByIsDeletedFalse()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AssignmentTypeResponse getAssignmentTypeById(Long id) {

        AssignmentType assignmentType =
                assignmentTypeRepository.findByAssignmentTypeIdAndIsDeletedFalse(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Assignment Type not found with ID : " + id));

        return mapToResponse(assignmentType);
    }

    @Override
    public AssignmentTypeResponse updateAssignmentType(
            Long id,
            AssignmentTypeRequest request) {

        AssignmentType assignmentType =
                assignmentTypeRepository.findByAssignmentTypeIdAndIsDeletedFalse(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Assignment Type not found with ID : " + id));

        // Duplicate Validation
        if (!assignmentType.getAssignmentTypeName()
                .equalsIgnoreCase(request.getAssignmentTypeName())
                &&
                assignmentTypeRepository.existsByAssignmentTypeNameAndIsDeletedFalse(
                        request.getAssignmentTypeName())) {

            throw new DuplicateResourceException(
                    "Assignment Type already exists.");
        }

        assignmentType.setAssignmentTypeName(
                request.getAssignmentTypeName());

        AssignmentType updatedAssignmentType =
                assignmentTypeRepository.save(assignmentType);

        return mapToResponse(updatedAssignmentType);
    }

    @Override
    public String deleteAssignmentType(Long id) {

        AssignmentType assignmentType =
                assignmentTypeRepository.findByAssignmentTypeIdAndIsDeletedFalse(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Assignment Type not found with ID : " + id));

        // Soft Delete
        assignmentType.setIsDeleted(true);

        assignmentTypeRepository.save(assignmentType);

        return "Assignment Type deleted successfully.";
    }

    /**
     * Entity -> Response DTO
     */
    private AssignmentTypeResponse mapToResponse(
            AssignmentType assignmentType) {

        AssignmentTypeResponse response =
                new AssignmentTypeResponse();

        response.setAssignmentTypeId(
                assignmentType.getAssignmentTypeId());

        response.setAssignmentTypeName(
                assignmentType.getAssignmentTypeName());

        response.setIsDeleted(
                assignmentType.getIsDeleted());

        return response;
    }

}

