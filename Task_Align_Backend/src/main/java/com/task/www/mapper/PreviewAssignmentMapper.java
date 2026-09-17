package com.task.www.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import com.task.www.dto.AssignmentConstraintResponse;
import com.task.www.dto.AssignmentResourceResponse;
import com.task.www.dto.PreviewAssignmentResponse;
import com.task.www.dto.PreviewTaskResponse;
import com.task.www.dto.TaskResponse;
import com.task.www.entity.Assignment;

@Component
public class PreviewAssignmentMapper {

    public PreviewAssignmentResponse toPreviewResponse(
            Assignment assignment,
            List<AssignmentResourceResponse> resources,
            List<PreviewTaskResponse> tasks,
            AssignmentConstraintResponse constraints) {
        return PreviewAssignmentResponse.builder()
                .assignmentId(assignment.getAssignmentId())
                .assignmentName(assignment.getAssignmentName())
                .assignmentDescription(assignment.getAssignmentDescription())
                .assignmentTypeId(assignment.getAssignmentTypeId())
                .optimizationType(assignment.getOptimizationType())
                .assignmentStatus(assignment.getAssignmentStatus())
                .resources(resources)
                .tasks(tasks)
                .constraints(constraints)
                .build();
    }

    public PreviewTaskResponse toPreviewTaskResponse(
            TaskResponse task,
            List<com.task.www.dto.TaskSkillResponse> skills) {

        return PreviewTaskResponse.builder()
                .taskId(task.getTaskId())
                .assignmentId(task.getAssignmentId())
                .taskName(task.getTaskName())
                .estimatedDays(task.getEstimatedDays())
                .skills(skills)
                .build();
    }
}
