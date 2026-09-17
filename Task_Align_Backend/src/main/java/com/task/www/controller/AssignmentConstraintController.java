package com.task.www.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.Map;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;

import com.task.www.dto.CreateAssignmentConstraintRequest;
import com.task.www.dto.UpdateAssignmentConstraintRequest;
import com.task.www.dto.AssignmentConstraintResponse;
import com.task.www.service.AssignmentConstraintService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/assignments/{assignmentId}/constraints")
@Validated
public class AssignmentConstraintController {

    private final AssignmentConstraintService constraintService;

    public AssignmentConstraintController(AssignmentConstraintService constraintService) {
        this.constraintService = constraintService;
    }

    @PostMapping
    public ResponseEntity<AssignmentConstraintResponse> createConstraint(
            @PathVariable Long assignmentId,
            @Valid @RequestBody CreateAssignmentConstraintRequest request) {

        AssignmentConstraintResponse response = constraintService.createConstraint(assignmentId, request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<AssignmentConstraintResponse> getConstraintByAssignmentId(
            @PathVariable Long assignmentId) {

        AssignmentConstraintResponse response = constraintService.getConstraintByAssignmentId(assignmentId);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{constraintId}")
    public ResponseEntity<AssignmentConstraintResponse> updateConstraint(
            @PathVariable Long assignmentId,
            @PathVariable Long constraintId,
            @Valid @RequestBody UpdateAssignmentConstraintRequest request) {

        AssignmentConstraintResponse response = constraintService.updateConstraint(assignmentId, constraintId, request);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{constraintId}")
    public ResponseEntity<Map<String, String>> deleteConstraint(
            @PathVariable Long assignmentId,
            @PathVariable Long constraintId) {

        constraintService.deleteConstraint(assignmentId, constraintId);

        return ResponseEntity.ok(Collections.singletonMap("message", "Assignment constraint soft deleted successfully"));
    }
}
