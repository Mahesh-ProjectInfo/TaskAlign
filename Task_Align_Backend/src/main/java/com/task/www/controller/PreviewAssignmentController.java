package com.task.www.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.task.www.dto.PreviewAssignmentResponse;
import com.task.www.service.PreviewAssignmentService;

@RestController
@RequestMapping("/api/v1/assignments/{assignmentId}/preview")
public class PreviewAssignmentController {

    private final PreviewAssignmentService previewAssignmentService;

    public PreviewAssignmentController(PreviewAssignmentService previewAssignmentService) {
        this.previewAssignmentService = previewAssignmentService;
    }

    @GetMapping
    public ResponseEntity<PreviewAssignmentResponse> getAssignmentPreview(
            @PathVariable Long assignmentId) {

        PreviewAssignmentResponse response = previewAssignmentService.getAssignmentPreview(assignmentId);

        return ResponseEntity.ok(response);
    }
}
