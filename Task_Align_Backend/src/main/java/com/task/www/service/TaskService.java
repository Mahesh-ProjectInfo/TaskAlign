package com.task.www.service;

import java.util.List;

import com.task.www.dto.CreateTaskRequest;
import com.task.www.dto.UpdateTaskRequest;
import com.task.www.dto.TaskResponse;

public interface TaskService {

    TaskResponse createTask(Long assignmentId, CreateTaskRequest request);

    List<TaskResponse> getTasksByAssignmentId(Long assignmentId);

    TaskResponse updateTask(Long assignmentId, Long taskId, UpdateTaskRequest request);

    void deleteTask(Long assignmentId, Long taskId);
}

