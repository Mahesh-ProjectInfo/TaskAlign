package com.task.www.serviceImpl;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.task.www.config.SecurityUtils;
import com.task.www.dto.AddAssignmentResourcesRequest;
import com.task.www.dto.AssignmentResourceResponse;
import com.task.www.entity.Assignment;
import com.task.www.entity.AssignmentResource;
import com.task.www.exception.AssignmentNotFoundException;
import com.task.www.exception.DuplicateAssignmentResourceException;
import com.task.www.exception.ResourceNotAssignedException;
import com.task.www.mapper.AssignmentResourceMapper;
import com.task.www.repository.AssignmentRepository;
import com.task.www.repository.AssignmentResourceRepository;
import com.task.www.service.AssignmentResourceService;

@Service
@Transactional
public class AssignmentResourceServiceImpl implements AssignmentResourceService {

    private final AssignmentRepository assignmentRepository;
    private final AssignmentResourceRepository assignmentResourceRepository;
    private final AssignmentResourceMapper assignmentResourceMapper;

    public AssignmentResourceServiceImpl(
            AssignmentRepository assignmentRepository,
            AssignmentResourceRepository assignmentResourceRepository,
            AssignmentResourceMapper assignmentResourceMapper) {
        this.assignmentRepository = assignmentRepository;
        this.assignmentResourceRepository = assignmentResourceRepository;
        this.assignmentResourceMapper = assignmentResourceMapper;
    }

    @Override
    public List<AssignmentResourceResponse> addResourcesToAssignment(
            Long assignmentId, AddAssignmentResourcesRequest request) {

        String currentUser = SecurityUtils.getCurrentUser();
        Assignment assignment = assignmentRepository
                .findByAssignmentIdAndCreatedByAndIsDeletedFalse(assignmentId, currentUser)
                .orElseThrow(() -> new AssignmentNotFoundException(
                        "Assignment not found with id : " + assignmentId));

        List<AssignmentResource> newMappings = new ArrayList<>();

        for (Long resourceId : request.getResourceIds()) {
            if (assignmentResourceRepository.existsByAssignmentAssignmentIdAndResourceId(
                    assignmentId, resourceId)) {
                throw new DuplicateAssignmentResourceException(
                        "Resource with ID " + resourceId + " is already assigned to assignment " + assignmentId);
            }

            AssignmentResource mapping = AssignmentResource.builder()
                    .assignment(assignment)
                    .resourceId(resourceId)
                    .build();

            newMappings.add(mapping);
        }

        List<AssignmentResource> savedMappings = assignmentResourceRepository.saveAll(newMappings);

        return savedMappings.stream()
                .map(assignmentResourceMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssignmentResourceResponse> getResourcesByAssignmentId(Long assignmentId) {

        String currentUser = SecurityUtils.getCurrentUser();
        if (assignmentRepository.findByAssignmentIdAndCreatedByAndIsDeletedFalse(assignmentId, currentUser).isEmpty()) {
            throw new AssignmentNotFoundException(
                    "Assignment not found with id : " + assignmentId);
        }

        return assignmentResourceRepository.findByAssignmentAssignmentId(assignmentId)
                .stream()
                .map(assignmentResourceMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<AssignmentResourceResponse> updateAssignmentResources(
            Long assignmentId, AddAssignmentResourcesRequest request) {

        String currentUser = SecurityUtils.getCurrentUser();
        Assignment assignment = assignmentRepository
                .findByAssignmentIdAndCreatedByAndIsDeletedFalse(assignmentId, currentUser)
                .orElseThrow(() -> new AssignmentNotFoundException(
                        "Assignment not found with id : " + assignmentId));

        java.util.Set<Long> uniqueIds = new java.util.HashSet<>(request.getResourceIds());
        if (uniqueIds.size() < request.getResourceIds().size()) {
            throw new DuplicateAssignmentResourceException(
                    "Duplicate resource IDs found in request list for assignment " + assignmentId);
        }

        List<AssignmentResource> existingMappings = assignmentResourceRepository
                .findByAssignmentAssignmentId(assignmentId);

        java.util.Set<Long> existingResourceIds = existingMappings.stream()
                .map(AssignmentResource::getResourceId)
                .collect(Collectors.toSet());

        List<AssignmentResource> toRemove = existingMappings.stream()
                .filter(m -> !uniqueIds.contains(m.getResourceId()))
                .collect(Collectors.toList());

        if (!toRemove.isEmpty()) {
            assignmentResourceRepository.deleteAll(toRemove);
        }

        List<AssignmentResource> toAdd = uniqueIds.stream()
                .filter(rId -> !existingResourceIds.contains(rId))
                .map(rId -> AssignmentResource.builder()
                        .assignment(assignment)
                        .resourceId(rId)
                        .build())
                .collect(Collectors.toList());

        if (!toAdd.isEmpty()) {
            assignmentResourceRepository.saveAll(toAdd);
        }

        return assignmentResourceRepository.findByAssignmentAssignmentId(assignmentId)
                .stream()
                .map(assignmentResourceMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<AssignmentResourceResponse> removeResourcesFromAssignment(
            Long assignmentId, AddAssignmentResourcesRequest request) {

        String currentUser = SecurityUtils.getCurrentUser();
        Assignment assignment = assignmentRepository
                .findByAssignmentIdAndCreatedByAndIsDeletedFalse(assignmentId, currentUser)
                .orElseThrow(() -> new AssignmentNotFoundException(
                        "Assignment not found with id : " + assignmentId));

        java.util.Set<Long> uniqueIds = new java.util.HashSet<>(request.getResourceIds());
        if (uniqueIds.size() < request.getResourceIds().size()) {
            throw new DuplicateAssignmentResourceException(
                    "Duplicate resource IDs found in request list for assignment " + assignmentId);
        }

        List<AssignmentResource> mappingsToRemove = assignmentResourceRepository
                .findByAssignmentAssignmentIdAndResourceIdIn(assignmentId, request.getResourceIds());

        java.util.Set<Long> foundResourceIds = mappingsToRemove.stream()
                .map(AssignmentResource::getResourceId)
                .collect(Collectors.toSet());

        for (Long resourceId : uniqueIds) {
            if (!foundResourceIds.contains(resourceId)) {
                throw new ResourceNotAssignedException(
                        "Resource with ID " + resourceId + " is not assigned to assignment " + assignmentId);
            }
        }

        assignmentResourceRepository.deleteAll(mappingsToRemove);

        return assignmentResourceRepository.findByAssignmentAssignmentId(assignmentId)
                .stream()
                .map(assignmentResourceMapper::toResponse)
                .collect(Collectors.toList());
    }
}
