package com.task.www.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.task.www.dto.EligibleResourceResultResponse;
import com.task.www.service.EligibleResourceService;

@RestController
@RequestMapping("/api/v1/assignments/{assignmentId}/eligible-resources")
public class EligibleResourceController {

    private final EligibleResourceService eligibleResourceService;

    public EligibleResourceController(EligibleResourceService eligibleResourceService) {
        this.eligibleResourceService = eligibleResourceService;
    }

    @GetMapping
    public ResponseEntity<EligibleResourceResultResponse> getEligibleResourcesForAssignment(
            @PathVariable Long assignmentId) {

        EligibleResourceResultResponse response = eligibleResourceService
                .getEligibleResourcesForAssignment(assignmentId);

        return ResponseEntity.ok(response);
    }
}
