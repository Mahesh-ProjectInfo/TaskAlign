package com.task.www.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.task.www.dto.SkillMatchingResultResponse;
import com.task.www.service.SkillMatchingService;

@RestController
@RequestMapping("/api/v1/assignments/{assignmentId}/skill-matching")
public class SkillMatchingController {

    private final SkillMatchingService skillMatchingService;

    public SkillMatchingController(SkillMatchingService skillMatchingService) {
        this.skillMatchingService = skillMatchingService;
    }

    @GetMapping
    public ResponseEntity<SkillMatchingResultResponse> getSkillMatchingForAssignment(
            @PathVariable Long assignmentId) {

        SkillMatchingResultResponse response = skillMatchingService.getSkillMatchingForAssignment(assignmentId);

        return ResponseEntity.ok(response);
    }
}
