package com.task.www.serviceImpl;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.task.www.config.SecurityUtils;
import com.task.www.dto.AddTaskSkillsRequest;
import com.task.www.dto.RemoveTaskSkillsRequest;
import com.task.www.dto.UpdateTaskSkillsRequest;
import com.task.www.dto.TaskSkillResponse;
import com.task.www.entity.Task;
import com.task.www.entity.TaskSkill;
import com.task.www.exception.DuplicateTaskSkillException;
import com.task.www.exception.TaskNotFoundException;
import com.task.www.exception.TaskSkillNotFoundException;
import com.task.www.mapper.TaskSkillMapper;
import com.task.www.repository.TaskRepository;
import com.task.www.repository.TaskSkillRepository;
import com.task.www.service.TaskSkillService;

@Service
@Transactional
public class TaskSkillServiceImpl implements TaskSkillService {

    private final TaskRepository taskRepository;
    private final TaskSkillRepository taskSkillRepository;
    private final TaskSkillMapper taskSkillMapper;

    public TaskSkillServiceImpl(
            TaskRepository taskRepository,
            TaskSkillRepository taskSkillRepository,
            TaskSkillMapper taskSkillMapper) {
        this.taskRepository = taskRepository;
        this.taskSkillRepository = taskSkillRepository;
        this.taskSkillMapper = taskSkillMapper;
    }

    private Task getTaskAndVerifyOwnership(Long taskId) {
        String currentUser = SecurityUtils.getCurrentUser();
        Task task = taskRepository.findById(taskId)
                .filter(t -> !Boolean.TRUE.equals(t.getIsDeleted()))
                .orElseThrow(() -> new TaskNotFoundException(
                        "Task not found with id : " + taskId));

        if (task.getAssignment() == null || 
            task.getAssignment().getCreatedBy() == null || 
            !task.getAssignment().getCreatedBy().equalsIgnoreCase(currentUser)) {
            throw new TaskNotFoundException("Task not found with id : " + taskId);
        }
        return task;
    }

    @Override
    public List<TaskSkillResponse> addSkillsToTask(Long taskId, AddTaskSkillsRequest request) {

        Task task = getTaskAndVerifyOwnership(taskId);

        Set<Long> uniqueIds = new HashSet<>(request.getSkillIds());
        if (uniqueIds.size() < request.getSkillIds().size()) {
            throw new DuplicateTaskSkillException(
                    "Duplicate skill IDs found in request payload for task " + taskId);
        }

        List<TaskSkill> newMappings = new ArrayList<>();

        for (Long skillId : request.getSkillIds()) {
            if (taskSkillRepository.existsByTaskTaskIdAndSkillId(taskId, skillId)) {
                throw new DuplicateTaskSkillException(
                        "Skill with ID " + skillId + " is already assigned to task " + taskId);
            }

            TaskSkill mapping = TaskSkill.builder()
                    .task(task)
                    .skillId(skillId)
                    .build();

            newMappings.add(mapping);
        }

        List<TaskSkill> savedMappings = taskSkillRepository.saveAll(newMappings);

        return savedMappings.stream()
                .map(taskSkillMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskSkillResponse> getSkillsByTaskId(Long taskId) {

        getTaskAndVerifyOwnership(taskId);

        return taskSkillRepository.findByTaskTaskId(taskId)
                .stream()
                .map(taskSkillMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskSkillResponse> updateTaskSkills(Long taskId, UpdateTaskSkillsRequest request) {

        Task task = getTaskAndVerifyOwnership(taskId);

        Set<Long> uniqueIds = new HashSet<>(request.getSkillIds());
        if (uniqueIds.size() < request.getSkillIds().size()) {
            throw new DuplicateTaskSkillException(
                    "Duplicate skill IDs found in request payload for task " + taskId);
        }

        List<TaskSkill> existingMappings = taskSkillRepository.findByTaskTaskId(taskId);
        Set<Long> requestedSkillIds = new HashSet<>(request.getSkillIds());

        List<TaskSkill> toDelete = existingMappings.stream()
                .filter(m -> !requestedSkillIds.contains(m.getSkillId()))
                .collect(Collectors.toList());

        if (!toDelete.isEmpty()) {
            taskSkillRepository.deleteAll(toDelete);
        }

        Set<Long> existingSkillIds = existingMappings.stream()
                .map(TaskSkill::getSkillId)
                .collect(Collectors.toSet());

        List<TaskSkill> toAdd = request.getSkillIds().stream()
                .filter(sId -> !existingSkillIds.contains(sId))
                .map(sId -> TaskSkill.builder()
                        .task(task)
                        .skillId(sId)
                        .build())
                .collect(Collectors.toList());

        if (!toAdd.isEmpty()) {
            taskSkillRepository.saveAll(toAdd);
        }

        return taskSkillRepository.findByTaskTaskId(taskId)
                .stream()
                .map(taskSkillMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskSkillResponse> removeSkillsFromTask(Long taskId, RemoveTaskSkillsRequest request) {

        getTaskAndVerifyOwnership(taskId);

        Set<Long> uniqueIds = new HashSet<>(request.getSkillIds());
        if (uniqueIds.size() < request.getSkillIds().size()) {
            throw new DuplicateTaskSkillException(
                    "Duplicate skill IDs found in request payload for task " + taskId);
        }

        List<TaskSkill> matching = taskSkillRepository.findByTaskTaskIdAndSkillIdIn(taskId, request.getSkillIds());
        if (matching.size() < uniqueIds.size()) {
            throw new TaskSkillNotFoundException(
                    "One or more specified skill IDs are not assigned to task " + taskId);
        }

        taskSkillRepository.deleteAll(matching);

        return taskSkillRepository.findByTaskTaskId(taskId)
                .stream()
                .map(taskSkillMapper::toResponse)
                .collect(Collectors.toList());
    }
}
