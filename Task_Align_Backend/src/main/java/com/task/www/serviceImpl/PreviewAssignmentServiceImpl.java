package com.task.www.serviceImpl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import java.util.stream.Collectors;

import com.task.www.config.SecurityUtils;
import com.task.www.dto.AssignmentConstraintResponse;
import com.task.www.dto.AssignmentResourceResponse;
import com.task.www.dto.PreviewAssignmentResponse;
import com.task.www.dto.PreviewTaskResponse;
import com.task.www.dto.TaskSkillResponse;
import com.task.www.dto.TaskResponse;
import com.task.www.entity.Assignment;
import com.task.www.exception.AssignmentConstraintNotFoundException;
import com.task.www.exception.AssignmentNotFoundException;
import com.task.www.mapper.PreviewAssignmentMapper;
import com.task.www.repository.AssignmentRepository;
import com.task.www.service.AssignmentConstraintService;
import com.task.www.service.AssignmentResourceService;
import com.task.www.service.PreviewAssignmentService;
import com.task.www.service.TaskService;
import com.task.www.service.TaskSkillService;

@Service
@Transactional(readOnly = true)
public class PreviewAssignmentServiceImpl implements PreviewAssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final AssignmentResourceService assignmentResourceService;
    private final TaskService taskService;
    private final TaskSkillService taskSkillService;
    private final AssignmentConstraintService assignmentConstraintService;
    private final PreviewAssignmentMapper previewAssignmentMapper;

    public PreviewAssignmentServiceImpl(
            AssignmentRepository assignmentRepository,
            AssignmentResourceService assignmentResourceService,
            TaskService taskService,
            TaskSkillService taskSkillService,
            AssignmentConstraintService assignmentConstraintService,
            PreviewAssignmentMapper previewAssignmentMapper) {
        this.assignmentRepository = assignmentRepository;
        this.assignmentResourceService = assignmentResourceService;
        this.taskService = taskService;
        this.taskSkillService = taskSkillService;
        this.assignmentConstraintService = assignmentConstraintService;
        this.previewAssignmentMapper = previewAssignmentMapper;
    }

    @Override
    public PreviewAssignmentResponse getAssignmentPreview(Long assignmentId) {

        String currentUser = SecurityUtils.getCurrentUser();
        Assignment assignment = assignmentRepository
                .findByAssignmentIdAndCreatedByAndIsDeletedFalse(assignmentId, currentUser)
                .orElseThrow(() -> new AssignmentNotFoundException(
                        "Assignment not found with id : " + assignmentId));

        List<AssignmentResourceResponse> resources = assignmentResourceService
                .getResourcesByAssignmentId(assignmentId);

        List<TaskResponse> rawTasks = taskService.getTasksByAssignmentId(assignmentId);

        List<PreviewTaskResponse> tasks = rawTasks.stream().map(task -> {
            List<TaskSkillResponse> skills = taskSkillService.getSkillsByTaskId(task.getTaskId());
            return previewAssignmentMapper.toPreviewTaskResponse(task, skills);
        }).collect(Collectors.toList());

        AssignmentConstraintResponse constraints = null;
        try {
            constraints = assignmentConstraintService.getConstraintByAssignmentId(assignmentId);
        } catch (AssignmentConstraintNotFoundException e) {
            // Assignment has no constraints attached yet
        }

        return previewAssignmentMapper.toPreviewResponse(assignment, resources, tasks, constraints);
    }
}
