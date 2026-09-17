package com.task.www.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "report_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportHistory extends AuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "assignment_id")
    private Long assignmentId;

    @Column(name = "report_type")
    private String reportType;

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "generated_by")
    private String generatedBy;

    @Column(name = "is_deleted")
    private Boolean isDeleted = false;
}
