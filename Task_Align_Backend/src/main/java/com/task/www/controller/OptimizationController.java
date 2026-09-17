package com.task.www.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.task.www.builder.OptimizationInputBuilderService;
import com.task.www.dto.AssignmentResultDTO;
import com.task.www.dto.OptimizationInputDTO;
import com.task.www.dto.OptimizationPreviewDTO;
import com.task.www.service.OptimizationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/optimization")
@RequiredArgsConstructor
public class OptimizationController {

    private final OptimizationService optimizationService;
    private final OptimizationInputBuilderService optimizationInputBuilderService;

    
    @PostMapping("/generate/{assignmentId}")
    public ResponseEntity<AssignmentResultDTO> optimizeAssignment(
            @PathVariable Long assignmentId) {

        OptimizationInputDTO inputDTO =
                optimizationInputBuilderService.build(assignmentId);

        AssignmentResultDTO result =
                optimizationService.optimizeAssignment(inputDTO);

        return ResponseEntity.ok(result);
    }
    
    
    @PostMapping("/preview/{assignmentId}")
    public ResponseEntity<OptimizationPreviewDTO> previewAssignment(
            @PathVariable Long assignmentId) {

        OptimizationInputDTO inputDTO =
                optimizationInputBuilderService.build(assignmentId);

        OptimizationPreviewDTO preview =
                optimizationService.previewAssignment(inputDTO);

        return ResponseEntity.ok(preview);
    }
}