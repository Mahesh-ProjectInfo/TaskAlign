package com.task.www.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskSkillResponse {

    private Long taskSkillId;
    private Long taskId;
    private Long skillId;

    public Long getTaskSkillId() {
        return taskSkillId;
    }

    public void setTaskSkillId(Long taskSkillId) {
        this.taskSkillId = taskSkillId;
    }

    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }

    public Long getSkillId() {
        return skillId;
    }

    public void setSkillId(Long skillId) {
        this.skillId = skillId;
    }

    public static TaskSkillResponseBuilder builder() {
        return new TaskSkillResponseBuilder();
    }

    public static class TaskSkillResponseBuilder {
        private Long taskSkillId;
        private Long taskId;
        private Long skillId;

        public TaskSkillResponseBuilder taskSkillId(Long taskSkillId) {
            this.taskSkillId = taskSkillId;
            return this;
        }

        public TaskSkillResponseBuilder taskId(Long taskId) {
            this.taskId = taskId;
            return this;
        }

        public TaskSkillResponseBuilder skillId(Long skillId) {
            this.skillId = skillId;
            return this;
        }

        public TaskSkillResponse build() {
            TaskSkillResponse response = new TaskSkillResponse();
            response.setTaskSkillId(this.taskSkillId);
            response.setTaskId(this.taskId);
            response.setSkillId(this.skillId);
            return response;
        }
    }
}
