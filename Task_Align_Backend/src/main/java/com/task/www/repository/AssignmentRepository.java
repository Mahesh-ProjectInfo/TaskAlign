package com.task.www.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.task.www.dto.AssignmentStatusChartResponse;
import com.task.www.dto.AssignmentTypeChartResponse;
import com.task.www.dto.MonthlyAssignmentChartResponse;
import com.task.www.entity.Assignment;
import com.task.www.enums.AssignmentStatus;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {

    // =========================================================
    // EXISTING ASSIGNMENT METHODS
    // =========================================================

    List<Assignment> findByIsDeletedFalse();

    @Query("""
            SELECT a
            FROM Assignment a
            LEFT JOIN FETCH a.assignmentType
            WHERE a.createdBy = :createdBy
              AND a.isDeleted = false
            """)
    List<Assignment> findByCreatedByAndIsDeletedFalse(@Param("createdBy") String createdBy);

    Optional<Assignment> findByAssignmentIdAndIsDeletedFalse(
            Long assignmentId);

    Optional<Assignment> findByAssignmentIdAndCreatedByAndIsDeletedFalse(
            Long assignmentId, String createdBy);

    boolean existsByAssignmentNameIgnoreCaseAndIsDeletedFalse(
            String assignmentName);

    boolean existsByAssignmentNameIgnoreCaseAndCreatedByAndIsDeletedFalse(
            String assignmentName, String createdBy);

    boolean existsByAssignmentNameIgnoreCaseAndAssignmentIdNotAndIsDeletedFalse(
            String assignmentName,
            Long assignmentId);

    boolean existsByAssignmentNameIgnoreCaseAndAssignmentIdNotAndCreatedByAndIsDeletedFalse(
            String assignmentName,
            Long assignmentId,
            String createdBy);


    // =========================================================
    // DASHBOARD CARD QUERIES
    // =========================================================

    long countByIsDeletedFalse();

    long countByCreatedByAndIsDeletedFalse(String createdBy);

    long countByAssignmentStatusAndIsDeletedFalse(
            AssignmentStatus assignmentStatus);

    long countByAssignmentStatusAndCreatedByAndIsDeletedFalse(
            AssignmentStatus assignmentStatus, String createdBy);


    // =========================================================
    // ASSIGNMENT STATUS CHART
    // =========================================================

    @Query("""
    	    SELECT new com.task.www.dto.AssignmentStatusChartResponse(
    	        a.assignmentStatus,
    	        COUNT(a)
    	    )
    	    FROM Assignment a
    	    WHERE a.isDeleted = false
    	    GROUP BY a.assignmentStatus
    	""")
    List<AssignmentStatusChartResponse> getAssignmentStatusChart();

    @Query("""
            SELECT new com.task.www.dto.AssignmentStatusChartResponse(
                a.assignmentStatus,
                COUNT(a)
            )
            FROM Assignment a
            WHERE a.isDeleted = false
            AND a.createdBy = :createdBy
            GROUP BY a.assignmentStatus
        """)
    List<AssignmentStatusChartResponse> getAssignmentStatusChartByCreatedBy(@Param("createdBy") String createdBy);

    // =========================================================
    // ASSIGNMENT TYPE CHART
    // =========================================================

    @Query("""
            SELECT new com.task.www.dto.AssignmentTypeChartResponse(
                    a.assignmentType.assignmentTypeName,
                    COUNT(a)
            )
            FROM Assignment a
            WHERE a.isDeleted = false
            GROUP BY a.assignmentType.assignmentTypeName
            """)
    List<AssignmentTypeChartResponse> getAssignmentTypeChart();

    @Query("""
            SELECT new com.task.www.dto.AssignmentTypeChartResponse(
                    a.assignmentType.assignmentTypeName,
                    COUNT(a)
            )
            FROM Assignment a
            WHERE a.isDeleted = false
            AND a.createdBy = :createdBy
            GROUP BY a.assignmentType.assignmentTypeName
            """)
    List<AssignmentTypeChartResponse> getAssignmentTypeChartByCreatedBy(@Param("createdBy") String createdBy);


    // =========================================================
    // MONTHLY ASSIGNMENT CHART
    // =========================================================

    @Query("""
    	    SELECT new com.task.www.dto.MonthlyAssignmentChartResponse(
    	        MONTH(a.createdAt),
    	        COUNT(a)
    	    )
    	    FROM Assignment a
    	    WHERE a.isDeleted = false
    	    GROUP BY MONTH(a.createdAt)
    	    ORDER BY MONTH(a.createdAt)
    	""")
    List<MonthlyAssignmentChartResponse> getMonthlyAssignmentChart();

    @Query("""
            SELECT new com.task.www.dto.MonthlyAssignmentChartResponse(
                MONTH(a.createdAt),
                COUNT(a)
            )
            FROM Assignment a
            WHERE a.isDeleted = false
            AND a.createdBy = :createdBy
            GROUP BY MONTH(a.createdAt)
            ORDER BY MONTH(a.createdAt)
        """)
    List<MonthlyAssignmentChartResponse> getMonthlyAssignmentChartByCreatedBy(@Param("createdBy") String createdBy);
}