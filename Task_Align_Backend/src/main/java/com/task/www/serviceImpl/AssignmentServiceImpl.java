package com.task.www.serviceImpl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.task.www.config.SecurityUtils;
import com.task.www.dto.CreateAssignmentRequest;
import com.task.www.dto.AssignmentResponse;
import com.task.www.entity.Assignment;
import com.task.www.entity.AssignmentType;
import com.task.www.enums.AssignmentStatus;
import com.task.www.exception.AssignmentNotFoundException;
import com.task.www.exception.DuplicateAssignmentException;
import com.task.www.mapper.AssignmentMapper;
import com.task.www.repository.AssignmentRepository;
import com.task.www.repository.AssignmentTypeRepository;
import com.task.www.service.AssignmentService;

@Service
@Transactional
public class AssignmentServiceImpl implements AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final AssignmentTypeRepository assignmentTypeRepository;
    private final AssignmentMapper assignmentMapper;

    public AssignmentServiceImpl(
            AssignmentRepository assignmentRepository,
            AssignmentTypeRepository assignmentTypeRepository,
            AssignmentMapper assignmentMapper) {
        this.assignmentRepository = assignmentRepository;
        this.assignmentTypeRepository = assignmentTypeRepository;
        this.assignmentMapper = assignmentMapper;
    }

    @Override
    public AssignmentResponse createAssignment(CreateAssignmentRequest request) {

        String currentUser = SecurityUtils.getCurrentUser();
        if (assignmentRepository.existsByAssignmentNameIgnoreCaseAndCreatedByAndIsDeletedFalse(
                request.getAssignmentName(), currentUser)) {
            throw new DuplicateAssignmentException(
                    "Assignment already exists with name : " + request.getAssignmentName());
        }

        AssignmentType assignmentType = null;
        if (request.getAssignmentTypeId() != null) {
            assignmentType = assignmentTypeRepository.findById(request.getAssignmentTypeId()).orElse(null);
        }

        Assignment assignment = Assignment.builder()
                .assignmentName(request.getAssignmentName())
                .assignmentDescription(request.getAssignmentDescription())
                .assignmentType(assignmentType)
                .optimizationType(request.getOptimizationType())
                .assignmentStatus(AssignmentStatus.DRAFT)
                .build();

        Assignment savedAssignment = assignmentRepository.save(assignment);

        return assignmentMapper.toResponse(savedAssignment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssignmentResponse> getAllAssignments() {

        String currentUser = SecurityUtils.getCurrentUser();
        return assignmentRepository.findByCreatedByAndIsDeletedFalse(currentUser)
                .stream()
                .map(assignmentMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AssignmentResponse getAssignmentById(Long assignmentId) {

        String currentUser = SecurityUtils.getCurrentUser();
        Assignment assignment = assignmentRepository
                .findByAssignmentIdAndCreatedByAndIsDeletedFalse(assignmentId, currentUser)
                .orElseThrow(() -> new AssignmentNotFoundException(
                        "Assignment not found with id : " + assignmentId));

        return assignmentMapper.toResponse(assignment);
    }

    @Override
    public AssignmentResponse updateAssignment(Long assignmentId, CreateAssignmentRequest request) {

        String currentUser = SecurityUtils.getCurrentUser();
        Assignment assignment = assignmentRepository
                .findByAssignmentIdAndCreatedByAndIsDeletedFalse(assignmentId, currentUser)
                .orElseThrow(() -> new AssignmentNotFoundException(
                        "Assignment not found with id : " + assignmentId));

        if (assignmentRepository.existsByAssignmentNameIgnoreCaseAndAssignmentIdNotAndCreatedByAndIsDeletedFalse(
                request.getAssignmentName(), assignmentId, currentUser)) {
            throw new DuplicateAssignmentException(
                    "Assignment already exists with name : " + request.getAssignmentName());
        }

        AssignmentType assignmentType = null;
        if (request.getAssignmentTypeId() != null) {
            assignmentType = assignmentTypeRepository.findById(request.getAssignmentTypeId()).orElse(null);
        }

        assignment.setAssignmentName(request.getAssignmentName());
        assignment.setAssignmentDescription(request.getAssignmentDescription());
        assignment.setAssignmentType(assignmentType);
        assignment.setOptimizationType(request.getOptimizationType());

        Assignment updatedAssignment = assignmentRepository.save(assignment);

        return assignmentMapper.toResponse(updatedAssignment);
    }

    @Override
    public void deleteAssignment(Long assignmentId) {

        String currentUser = SecurityUtils.getCurrentUser();
        Assignment assignment = assignmentRepository
                .findByAssignmentIdAndCreatedByAndIsDeletedFalse(assignmentId, currentUser)
                .orElseThrow(() -> new AssignmentNotFoundException(
                        "Assignment not found with id : " + assignmentId));

        assignment.setIsDeleted(true);

        assignmentRepository.save(assignment);
    }
}
