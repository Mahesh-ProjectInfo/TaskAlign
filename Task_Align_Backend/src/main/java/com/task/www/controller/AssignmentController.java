package com.task.www.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.task.www.dto.CreateAssignmentRequest;
import com.task.www.dto.AssignmentResponse;
import com.task.www.service.AssignmentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/assignments")

@Validated
@CrossOrigin
public class AssignmentController {

    private final AssignmentService assignmentService;
   
    public AssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @PostMapping
    public ResponseEntity<AssignmentResponse> createAssignment(
            @Valid @RequestBody CreateAssignmentRequest request) {

        AssignmentResponse response = assignmentService.createAssignment(request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<AssignmentResponse>> getAllAssignments() {

        return ResponseEntity.ok(
                assignmentService.getAllAssignments());
    }

    @GetMapping("/{assignmentId}")
    public ResponseEntity<AssignmentResponse> getAssignmentById(
            @PathVariable Long assignmentId) {

        return ResponseEntity.ok(
                assignmentService.getAssignmentById(assignmentId));
    }

    @PutMapping("/{assignmentId}")
    public ResponseEntity<AssignmentResponse> updateAssignment(
            @PathVariable Long assignmentId,
            @Valid @RequestBody CreateAssignmentRequest request) {

        return ResponseEntity.ok(
                assignmentService.updateAssignment(assignmentId, request));
    }

    @DeleteMapping("/{assignmentId}")
    public ResponseEntity<String> deleteAssignment(
            @PathVariable Long assignmentId) {

        assignmentService.deleteAssignment(assignmentId);

        return ResponseEntity.ok("Assignment deleted successfully.");
       
    }
   
}
