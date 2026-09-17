package com.task.www.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.task.www.dto.MatrixInputResponse;
import com.task.www.service.MatrixInputService;

@RestController
@RequestMapping("/api/v1/assignments/{assignmentId}/matrix-input")
public class MatrixInputController {

    private final MatrixInputService matrixInputService;

    public MatrixInputController(MatrixInputService matrixInputService) {
        this.matrixInputService = matrixInputService;
    }

    @GetMapping
    public ResponseEntity<MatrixInputResponse> prepareMatrixInput(
            @PathVariable Long assignmentId) {

        MatrixInputResponse response = matrixInputService.prepareMatrixInput(assignmentId);

        return ResponseEntity.ok(response);
    }
}
