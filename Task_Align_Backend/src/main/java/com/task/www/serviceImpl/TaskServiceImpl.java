package com.task.www.serviceImpl;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.task.www.config.SecurityUtils;
import com.task.www.dto.BulkTaskRequest;
import com.task.www.dto.BulkTaskResponse;
import com.task.www.dto.BulkTaskSaveRequest;
import com.task.www.dto.CreateTaskRequest;
import com.task.www.dto.UpdateTaskRequest;
import com.task.www.dto.TaskResponse;
import com.task.www.entity.Assignment;
import com.task.www.entity.Task;
import com.task.www.entity.TaskSkill;
import com.task.www.exception.AssignmentNotFoundException;
import com.task.www.exception.DuplicateTaskException;
import com.task.www.exception.TaskNotFoundException;
import com.task.www.mapper.TaskMapper;
import com.task.www.repository.AssignmentRepository;
import com.task.www.repository.TaskRepository;
import com.task.www.repository.TaskSkillRepository;
import com.task.www.service.TaskService;

@Service
@Transactional
public class TaskServiceImpl implements TaskService {

    private final AssignmentRepository assignmentRepository;
    private final TaskRepository taskRepository;
    private final TaskSkillRepository taskSkillRepository;
    private final TaskMapper taskMapper;

    public TaskServiceImpl(
            AssignmentRepository assignmentRepository,
            TaskRepository taskRepository,
            TaskSkillRepository taskSkillRepository,
            TaskMapper taskMapper) {
        this.assignmentRepository = assignmentRepository;
        this.taskRepository = taskRepository;
        this.taskSkillRepository = taskSkillRepository;
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

    @Override
    @Transactional
    public List<BulkTaskResponse> saveBulkTasks(Long assignmentId, BulkTaskSaveRequest request) {

        String currentUser = SecurityUtils.getCurrentUser();
        Assignment assignment = assignmentRepository
                .findByAssignmentIdAndCreatedByAndIsDeletedFalse(assignmentId, currentUser)
                .orElseThrow(() -> new AssignmentNotFoundException(
                        "Assignment not found with id : " + assignmentId));

        if (request.getTasks() == null || request.getTasks().isEmpty()) {
            return new ArrayList<>();
        }

        // Validate payload for in-memory duplicate task names
        Set<String> payloadTaskNames = new HashSet<>();
        for (BulkTaskRequest tr : request.getTasks()) {
            String nameKey = tr.getTaskName().trim().toLowerCase();
            if (!payloadTaskNames.add(nameKey)) {
                throw new DuplicateTaskException("Duplicate task name in request payload: " + tr.getTaskName().trim());
            }
        }

        // Fetch existing non-deleted tasks for this assignment
        List<Task> existingTasks = taskRepository.findByAssignmentAssignmentIdAndIsDeletedFalse(assignmentId);
        Map<Long, Task> existingTaskMap = existingTasks.stream()
                .collect(Collectors.toMap(Task::getTaskId, t -> t));

        List<Task> tasksToSave = new ArrayList<>();
        for (BulkTaskRequest tr : request.getTasks()) {
            String trimmedName = tr.getTaskName().trim();
            Task task;
            if (tr.getTaskId() != null) {
                task = existingTaskMap.get(tr.getTaskId());
                if (task == null) {
                    throw new TaskNotFoundException("Task not found with id : " + tr.getTaskId() + " for assignment id : " + assignmentId);
                }
                task.setTaskName(trimmedName);
                task.setEstimatedDays(tr.getEstimatedDays());
            } else {
                task = Task.builder()
                        .assignment(assignment)
                        .taskName(trimmedName)
                        .estimatedDays(tr.getEstimatedDays())
                        .build();
            }
            tasksToSave.add(task);
        }

        List<Task> savedTasks = taskRepository.saveAll(tasksToSave);

        // Fetch existing task skill mappings for saved tasks
        List<Long> savedTaskIds = savedTasks.stream().map(Task::getTaskId).collect(Collectors.toList());
        List<TaskSkill> existingTaskSkills = taskSkillRepository.findByTaskTaskIdIn(savedTaskIds);

        Map<Long, Set<Long>> existingSkillsByTaskId = existingTaskSkills.stream()
                .collect(Collectors.groupingBy(ts -> ts.getTask().getTaskId(),
                        Collectors.mapping(TaskSkill::getSkillId, Collectors.toSet())));

        List<TaskSkill> toDelete = new ArrayList<>();
        List<TaskSkill> toAdd = new ArrayList<>();
        List<BulkTaskResponse> responses = new ArrayList<>();

        for (int i = 0; i < savedTasks.size(); i++) {
            Task savedTask = savedTasks.get(i);
            BulkTaskRequest req = request.getTasks().get(i);

            List<Long> requestedSkillIds = req.getSkillIds() != null ? req.getSkillIds() : new ArrayList<>();
            Set<Long> uniqueSkillIds = new HashSet<>(requestedSkillIds);

            Set<Long> currentSkillIds = existingSkillsByTaskId.getOrDefault(savedTask.getTaskId(), new HashSet<>());

            for (TaskSkill ts : existingTaskSkills) {
                if (ts.getTask().getTaskId().equals(savedTask.getTaskId()) && !uniqueSkillIds.contains(ts.getSkillId())) {
                    toDelete.add(ts);
                }
            }

            for (Long sId : uniqueSkillIds) {
                if (!currentSkillIds.contains(sId)) {
                    TaskSkill mapping = TaskSkill.builder()
                            .task(savedTask)
                            .skillId(sId)
                            .build();
                    toAdd.add(mapping);
                }
            }

            responses.add(BulkTaskResponse.builder()
                    .taskId(savedTask.getTaskId())
                    .assignmentId(assignmentId)
                    .taskName(savedTask.getTaskName())
                    .estimatedDays(savedTask.getEstimatedDays())
                    .skillIds(new ArrayList<>(uniqueSkillIds))
                    .build());
        }

        if (!toDelete.isEmpty()) {
            taskSkillRepository.deleteAll(toDelete);
        }
        if (!toAdd.isEmpty()) {
            taskSkillRepository.saveAll(toAdd);
        }

        return responses;
    }
}

