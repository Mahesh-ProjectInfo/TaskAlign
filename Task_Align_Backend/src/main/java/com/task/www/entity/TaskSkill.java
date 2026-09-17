package com.task.www.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
    name = "task_skills",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_task_skill",
            columnNames = {"task_id", "skill_id"}
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "task_skill_id")
    private Long taskSkillId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @Column(name = "skill_id", nullable = false)
    private Long skillId;

    public Long getTaskSkillId() {
        return taskSkillId;
    }

    public void setTaskSkillId(Long taskSkillId) {
        this.taskSkillId = taskSkillId;
    }

    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
    }

    public Long getSkillId() {
        return skillId;
    }

    public void setSkillId(Long skillId) {
        this.skillId = skillId;
    }

    public static TaskSkillBuilder builder() {
        return new TaskSkillBuilder();
    }

    public static class TaskSkillBuilder {
        private Long taskSkillId;
        private Task task;
        private Long skillId;

        public TaskSkillBuilder taskSkillId(Long taskSkillId) {
            this.taskSkillId = taskSkillId;
            return this;
        }

        public TaskSkillBuilder task(Task task) {
            this.task = task;
            return this;
        }

        public TaskSkillBuilder skillId(Long skillId) {
            this.skillId = skillId;
            return this;
        }

        public TaskSkill build() {
            TaskSkill entity = new TaskSkill();
            entity.setTaskSkillId(this.taskSkillId);
            entity.setTask(this.task);
            entity.setSkillId(this.skillId);
            return entity;
        }
    }
}
