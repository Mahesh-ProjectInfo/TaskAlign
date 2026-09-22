package com.task.www.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
	name = "resources",
	indexes = {
		@Index(name = "idx_resources_is_deleted", columnList = "is_deleted")
	}
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resource extends AuditEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "resource_id")
	private Long resourceId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "assignment_type_id", nullable = false)
	private AssignmentType assignmentType;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "role_id", nullable = false)
	private Role role;

	@Column(name = "resource_name", nullable = false)
	private String resourceName;

	@Column(name = "monthly_salary", nullable = false, precision = 12, scale = 2)
	private java.math.BigDecimal monthlySalary;

	@Column(name = "performance_rating", nullable = false, precision = 5, scale = 2)
	private java.math.BigDecimal performanceRating;

	@Builder.Default
	@Column(name = "is_deleted", nullable = false)
	private Boolean isDeleted = false;

}
