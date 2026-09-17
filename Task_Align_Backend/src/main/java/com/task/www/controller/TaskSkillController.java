package com.task.www.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;

import com.task.www.dto.AddTaskSkillsRequest;
import com.task.www.dto.RemoveTaskSkillsRequest;
import com.task.www.dto.UpdateTaskSkillsRequest;
import com.task.www.dto.TaskSkillResponse;
import com.task.www.service.TaskSkillService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/tasks/{taskId}/skills")
@Validated
public class TaskSkillController {

    private final TaskSkillService taskSkillService;

    public TaskSkillController(TaskSkillService taskSkillService) {
        this.taskSkillService = taskSkillService;
    }

    @PostMapping
    public ResponseEntity<List<TaskSkillResponse>> addSkillsToTask(
            @PathVariable Long taskId,
            @Valid @RequestBody AddTaskSkillsRequest request) {

        List<TaskSkillResponse> response = taskSkillService.addSkillsToTask(taskId, request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<TaskSkillResponse>> getSkillsByTaskId(
            @PathVariable Long taskId) {

        List<TaskSkillResponse> response = taskSkillService.getSkillsByTaskId(taskId);

        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<List<TaskSkillResponse>> updateTaskSkills(
            @PathVariable Long taskId,
            @Valid @RequestBody UpdateTaskSkillsRequest request) {

        List<TaskSkillResponse> response = taskSkillService.updateTaskSkills(taskId, request);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping
    public ResponseEntity<List<TaskSkillResponse>> removeSkillsFromTask(
            @PathVariable Long taskId,
            @Valid @RequestBody RemoveTaskSkillsRequest request) {

        List<TaskSkillResponse> response = taskSkillService.removeSkillsFromTask(taskId, request);

        return ResponseEntity.ok(response);
    }
}
