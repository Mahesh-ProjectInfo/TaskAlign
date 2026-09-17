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
    name = "assignment_resources",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_assignment_resource",
            columnNames = {"assignment_id", "resource_id"}
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignmentResource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "assignment_resource_id")
    private Long assignmentResourceId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "assignment_id", nullable = false)
    private Assignment assignment;

    @Column(name = "resource_id", nullable = false)
    private Long resourceId;

    public Long getAssignmentResourceId() {
        return assignmentResourceId;
    }

    public void setAssignmentResourceId(Long assignmentResourceId) {
        this.assignmentResourceId = assignmentResourceId;
    }

    public Assignment getAssignment() {
        return assignment;
    }

    public void setAssignment(Assignment assignment) {
        this.assignment = assignment;
    }

    public Long getResourceId() {
        return resourceId;
    }

    public void setResourceId(Long resourceId) {
        this.resourceId = resourceId;
    }

    public static AssignmentResourceBuilder builder() {
        return new AssignmentResourceBuilder();
    }

    public static class AssignmentResourceBuilder {
        private Long assignmentResourceId;
        private Assignment assignment;
        private Long resourceId;

        public AssignmentResourceBuilder assignmentResourceId(Long assignmentResourceId) {
            this.assignmentResourceId = assignmentResourceId;
            return this;
        }

        public AssignmentResourceBuilder assignment(Assignment assignment) {
            this.assignment = assignment;
            return this;
        }

        public AssignmentResourceBuilder resourceId(Long resourceId) {
            this.resourceId = resourceId;
            return this;
        }

        public AssignmentResource build() {
            AssignmentResource entity = new AssignmentResource();
            entity.setAssignmentResourceId(this.assignmentResourceId);
            entity.setAssignment(this.assignment);
            entity.setResourceId(this.resourceId);
            return entity;
        }
    }
}
