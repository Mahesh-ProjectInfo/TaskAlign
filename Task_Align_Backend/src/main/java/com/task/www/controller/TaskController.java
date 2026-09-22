package com.task.www.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.task.www.dto.BulkTaskRequest;
import com.task.www.dto.BulkTaskResponse;
import com.task.www.dto.BulkTaskSaveRequest;
import com.task.www.dto.CreateTaskRequest;
import com.task.www.dto.UpdateTaskRequest;
import com.task.www.dto.TaskResponse;
import com.task.www.service.TaskService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/assignments/{assignmentId}/tasks")
@Validated
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(
            @PathVariable Long assignmentId,
            @Valid @RequestBody CreateTaskRequest request) {

        TaskResponse response = taskService.createTask(assignmentId, request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/bulk")
    public ResponseEntity<List<BulkTaskResponse>> saveBulkTasks(
            @PathVariable Long assignmentId,
            @Valid @RequestBody BulkTaskSaveRequest request) {

        List<BulkTaskResponse> response = taskService.saveBulkTasks(assignmentId, request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getTasksByAssignmentId(
            @PathVariable Long assignmentId) {

        List<TaskResponse> response = taskService.getTasksByAssignmentId(assignmentId);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable Long assignmentId,
            @PathVariable Long taskId,
            @Valid @RequestBody UpdateTaskRequest request) {

        TaskResponse response = taskService.updateTask(assignmentId, taskId, request);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<String> deleteTask(
            @PathVariable Long assignmentId,
            @PathVariable Long taskId) {

        taskService.deleteTask(assignmentId, taskId);

        return ResponseEntity.ok("Task deleted successfully.");
    }
}

