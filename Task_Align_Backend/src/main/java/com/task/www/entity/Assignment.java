package com.task.www.entity;

import java.util.List;

import com.task.www.enums.AssignmentStatus;
import com.task.www.enums.OptimizationType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
    name = "assignments",
    indexes = {
        @Index(name = "idx_assignments_created_deleted", columnList = "created_by, is_deleted"),
        @Index(name = "idx_assignments_created_deleted_status", columnList = "created_by, is_deleted, assignment_status"),
        @Index(name = "idx_assignments_created_deleted_type", columnList = "created_by, is_deleted, assignment_type_id")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Assignment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "assignment_id")
    private Long assignmentId;

    @Column(name = "assignment_name", nullable = false, length = 100)
    private String assignmentName;

    @Column(name = "assignment_description")
    private String assignmentDescription;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignment_type_id", referencedColumnName = "assignment_type_id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private AssignmentType assignmentType;



    @Enumerated(EnumType.STRING)
    @Column(name = "optimization_type", nullable = false, length = 30)
    private OptimizationType optimizationType;

    @Enumerated(EnumType.STRING)
    @Column(name = "assignment_status", nullable = false, length = 20)
    private AssignmentStatus assignmentStatus;

    @OneToMany(mappedBy = "assignment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AssignmentResource> assignmentResources;

    @OneToMany(mappedBy = "assignment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Task> tasks;

    @OneToOne(mappedBy = "assignment", cascade = CascadeType.ALL, orphanRemoval = true)
    private AssignmentConstraint assignmentConstraint;

    public Long getAssignmentTypeId() {
        return assignmentType != null ? assignmentType.getAssignmentTypeId() : null;
    }

    public Long getId() {
        return assignmentId;
    }
}

