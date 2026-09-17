package com.task.www.serviceImpl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.task.www.config.SecurityUtils;
import com.task.www.dto.CreateTaskRequest;
import com.task.www.dto.UpdateTaskRequest;
import com.task.www.dto.TaskResponse;
import com.task.www.entity.Assignment;
import com.task.www.entity.Task;
import com.task.www.exception.AssignmentNotFoundException;
import com.task.www.exception.DuplicateTaskException;
import com.task.www.exception.TaskNotFoundException;
import com.task.www.mapper.TaskMapper;
import com.task.www.repository.AssignmentRepository;
import com.task.www.repository.TaskRepository;
import com.task.www.service.TaskService;

@Service
@Transactional
public class TaskServiceImpl implements TaskService {

    private final AssignmentRepository assignmentRepository;
    private final TaskRepository taskRepository;
    private final TaskMapper taskMapper;

    public TaskServiceImpl(
            AssignmentRepository assignmentRepository,
            TaskRepository taskRepository,
            TaskMapper taskMapper) {
        this.assignmentRepository = assignmentRepository;
        this.taskRepository = taskRepository;
        this.taskMapper = taskMapper;
    }

    @Override
    public TaskResponse createTask(Long assignmentId, CreateTaskRequest request) {

        String currentUser = SecurityUtils.getCurrentUser();
        Assignment assignment = assignmentRepository
                .findByAssignmentIdAndCreatedByAndIsDeletedFalse(assignmentId, currentUser)
                .orElseThrow(() -> new AssignmentNotFoundException(
                        "Assignment not found with id : " + assignmentId));

        if (taskRepository.existsByAssignmentAssignmentIdAndTaskNameIgnoreCaseAndIsDeletedFalse(
                assignmentId, request.getTaskName().trim())) {
            throw new DuplicateTaskException(
                    "Task already exists with name : " + request.getTaskName().trim() + " for assignment id : " + assignmentId);
        }

        Task task = Task.builder()
                .assignment(assignment)
                .taskName(request.getTaskName().trim())
                .estimatedDays(request.getEstimatedDays())
                .build();

        Task savedTask = taskRepository.save(task);

        return taskMapper.toResponse(savedTask);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksByAssignmentId(Long assignmentId) {

        String currentUser = SecurityUtils.getCurrentUser();
        if (assignmentRepository.findByAssignmentIdAndCreatedByAndIsDeletedFalse(assignmentId, currentUser).isEmpty()) {
            throw new AssignmentNotFoundException(
                    "Assignment not found with id : " + assignmentId);
        }

        return taskRepository.findByAssignmentAssignmentIdAndIsDeletedFalse(assignmentId)
                .stream()
                .map(taskMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public TaskResponse updateTask(Long assignmentId, Long taskId, UpdateTaskRequest request) {

        String currentUser = SecurityUtils.getCurrentUser();
        if (assignmentRepository.findByAssignmentIdAndCreatedByAndIsDeletedFalse(assignmentId, currentUser).isEmpty()) {
            throw new AssignmentNotFoundException(
                    "Assignment not found with id : " + assignmentId);
        }

        Task task = taskRepository
                .findByTaskIdAndAssignmentAssignmentIdAndIsDeletedFalse(taskId, assignmentId)
                .orElseThrow(() -> new TaskNotFoundException(
                        "Task not found with id : " + taskId + " for assignment id : " + assignmentId));

        String newName = request.getTaskName().trim();
        if (taskRepository.existsByAssignmentAssignmentIdAndTaskNameIgnoreCaseAndTaskIdNotAndIsDeletedFalse(
                assignmentId, newName, taskId)) {
            throw new DuplicateTaskException(
                    "Task already exists with name : " + newName + " for assignment id : " + assignmentId);
        }

        task.setTaskName(newName);
        task.setEstimatedDays(request.getEstimatedDays());

        Task updatedTask = taskRepository.save(task);

        return taskMapper.toResponse(updatedTask);
    }

    @Override
    public void deleteTask(Long assignmentId, Long taskId) {

        String currentUser = SecurityUtils.getCurrentUser();
        if (assignmentRepository.findByAssignmentIdAndCreatedByAndIsDeletedFalse(assignmentId, currentUser).isEmpty()) {
            throw new AssignmentNotFoundException(
                    "Assignment not found with id : " + assignmentId);
        }

        Task task = taskRepository
                .findByTaskIdAndAssignmentAssignmentIdAndIsDeletedFalse(taskId, assignmentId)
                .orElseThrow(() -> new TaskNotFoundException(
                        "Task not found with id : " + taskId + " for assignment id : " + assignmentId));

        task.setIsDeleted(true);

        taskRepository.save(task);
    }
}

