package com.task.www.mapper;

import org.springframework.stereotype.Component;

import com.task.www.dto.TaskSkillResponse;
import com.task.www.entity.TaskSkill;

@Component
public class TaskSkillMapper {

    public TaskSkillResponse toResponse(TaskSkill taskSkill) {
        return TaskSkillResponse.builder()
                .taskSkillId(taskSkill.getTaskSkillId())
                .taskId(taskSkill.getTask() != null ? taskSkill.getTask().getTaskId() : null)
                .skillId(taskSkill.getSkillId())
                .build();
    }
}
