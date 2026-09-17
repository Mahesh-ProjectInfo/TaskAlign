package com.task.www.mapper;

import org.springframework.stereotype.Component;

import com.task.www.dto.TaskResponse;
import com.task.www.entity.Task;

@Component
public class TaskMapper {

    public TaskResponse toResponse(Task task) {

        return TaskResponse.builder()
                .taskId(task.getTaskId())
                .assignmentId(
                        task.getAssignment() != null
                                ? task.getAssignment().getAssignmentId()
                                : null)
                .taskName(task.getTaskName())
                .estimatedDays(task.getEstimatedDays())
                .build();
    }
}