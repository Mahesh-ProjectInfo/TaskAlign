package com.task.www.serviceImpl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.task.www.dto.EligibleResourceResultResponse;
import com.task.www.dto.MatrixInputResponse;
import com.task.www.dto.PreviewAssignmentResponse;
import com.task.www.dto.SkillMatchingResultResponse;
import com.task.www.service.EligibleResourceService;
import com.task.www.service.MatrixInputService;
import com.task.www.service.PreviewAssignmentService;
import com.task.www.service.SkillMatchingService;

@Service
public class MatrixInputServiceImpl implements MatrixInputService {

    private final PreviewAssignmentService previewAssignmentService;
    private final SkillMatchingService skillMatchingService;
    private final EligibleResourceService eligibleResourceService;

    public MatrixInputServiceImpl(
            PreviewAssignmentService previewAssignmentService,
            SkillMatchingService skillMatchingService,
            EligibleResourceService eligibleResourceService) {
        this.previewAssignmentService = previewAssignmentService;
        this.skillMatchingService = skillMatchingService;
        this.eligibleResourceService = eligibleResourceService;
    }

    @Override
    @Transactional(readOnly = true)
    public MatrixInputResponse prepareMatrixInput(Long assignmentId) {

        // 1. Retrieve Preview Assignment Data (Assignment, Resources, Tasks, TaskSkills, Constraints)
        PreviewAssignmentResponse preview = previewAssignmentService.getAssignmentPreview(assignmentId);

        // 2. Retrieve Skill Matching Results (Sprint 7 Feature 1)
        SkillMatchingResultResponse skillMatching = skillMatchingService.getSkillMatchingForAssignment(assignmentId);

        // 3. Retrieve Eligible Resources (Sprint 7 Feature 2)
        EligibleResourceResultResponse eligibleResources = eligibleResourceService
                .getEligibleResourcesForAssignment(assignmentId);

        // 4. Validate readiness for Member 4 Matrix Generation
        boolean isReady = preview.getTasks() != null && !preview.getTasks().isEmpty()
                && preview.getResources() != null && !preview.getResources().isEmpty();

        return MatrixInputResponse.builder()
                .assignmentId(preview.getAssignmentId())
                .assignmentName(preview.getAssignmentName())
                .assignmentTypeId(preview.getAssignmentTypeId())
                .assignmentTypeName(skillMatching.getAssignmentTypeName())
                .optimizationType(preview.getOptimizationType())
                .assignmentStatus(preview.getAssignmentStatus())
                .isReadyForMatrixGeneration(isReady)
                .preview(preview)
                .skillMatching(skillMatching)
                .eligibleResources(eligibleResources)
                .build();

    }
}
