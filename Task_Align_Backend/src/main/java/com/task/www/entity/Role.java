package com.task.www.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "roles",
    indexes = {
        @Index(name = "idx_roles_is_deleted", columnList = "is_deleted")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role extends AuditEntity {

    // Primary Key
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_id")
    private Long roleId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignment_type_id", nullable = false)
    private AssignmentType assignmentType;

    @Column(name = "role_name", nullable = false)
    private String roleName;

    @Builder.Default
    @Column(name = "is_deleted")
    private Boolean isDeleted = false;
}
