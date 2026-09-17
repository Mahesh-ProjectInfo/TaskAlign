package com.task.www.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.task.www.dto.AddAssignmentResourcesRequest;
import com.task.www.dto.AssignmentResourceResponse;
import com.task.www.service.AssignmentResourceService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/api/v1/assignments/{assignmentId}/resources")
@Validated
public class AssignmentResourceController {

    private final AssignmentResourceService assignmentResourceService;

    public AssignmentResourceController(AssignmentResourceService assignmentResourceService) {
        this.assignmentResourceService = assignmentResourceService;
    }

    @PostMapping
    public ResponseEntity<List<AssignmentResourceResponse>> addResourcesToAssignment(
            @PathVariable Long assignmentId,
            @Valid @RequestBody AddAssignmentResourcesRequest request) {

        List<AssignmentResourceResponse> response = assignmentResourceService
                .addResourcesToAssignment(assignmentId, request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<AssignmentResourceResponse>> getResourcesByAssignmentId(
            @PathVariable Long assignmentId) {

        List<AssignmentResourceResponse> response = assignmentResourceService
                .getResourcesByAssignmentId(assignmentId);

        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<List<AssignmentResourceResponse>> updateAssignmentResources(
            @PathVariable Long assignmentId,
            @Valid @RequestBody AddAssignmentResourcesRequest request) {

        List<AssignmentResourceResponse> response = assignmentResourceService
                .updateAssignmentResources(assignmentId, request);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping
    public ResponseEntity<List<AssignmentResourceResponse>> removeResourcesFromAssignment(
            @PathVariable Long assignmentId,
            @Valid @RequestBody AddAssignmentResourcesRequest request) {

        List<AssignmentResourceResponse> response = assignmentResourceService
                .removeResourcesFromAssignment(assignmentId, request);

        return ResponseEntity.ok(response);
    }
}
