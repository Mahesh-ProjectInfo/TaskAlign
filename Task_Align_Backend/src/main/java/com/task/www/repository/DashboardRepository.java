package com.task.www.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.task.www.entity.User;

@Repository
public interface DashboardRepository extends JpaRepository<User, Long> {

    

    @Query("""
            SELECT COUNT(u)
            FROM User u
            WHERE u.isDeleted = false
            """)
    Long getTotalUsers();

    @Query("""
            SELECT COUNT(a)
            FROM Assignment a
            WHERE a.isDeleted = false
            """)
    Long getTotalAssignments();

    @Query("""
    	    SELECT COUNT(a)
    	    FROM Assignment a
    	    WHERE a.assignmentStatus = 'DRAFT'
    	      AND a.isDeleted = false
    	""")
    	Long getActiveAssignments();

    @Query("""
            SELECT COUNT(a)
            FROM Assignment a
            WHERE a.assignmentStatus = com.task.www.enums.AssignmentStatus.COMPLETED
            AND a.isDeleted = false
            """)
    Long getCompletedAssignments();

    @Query("""
            SELECT COUNT(r)
            FROM Resource r
            WHERE r.isDeleted = false
            """)
    Long getTotalResources();

    @Query("""
    	    SELECT COUNT(t)
    	    FROM Task t
    	    WHERE t.isDeleted = false
    	""")
    	Long getTotalTasks();

    
    @Query("""
            SELECT a.assignmentStatus, COUNT(a)
            FROM Assignment a
            WHERE a.isDeleted = false
            GROUP BY a.assignmentStatus
            """)
    List<Object[]> getAssignmentStatusStatistics();

    

    @Query("""
            SELECT a.assignmentType.assignmentTypeName,
                   COUNT(a)
            FROM Assignment a
            WHERE a.isDeleted = false
            GROUP BY a.assignmentType.assignmentTypeName
            """)
    List<Object[]> getAssignmentTypeStatistics();

    

    @Query("""
            SELECT FUNCTION('MONTHNAME', a.createdAt),
                   COUNT(a)
            FROM Assignment a
            WHERE a.isDeleted = false
            GROUP BY FUNCTION('MONTH', a.createdAt),
                     FUNCTION('MONTHNAME', a.createdAt)
            ORDER BY FUNCTION('MONTH', a.createdAt)
            """)
    List<Object[]> getMonthlyAssignmentStatistics();

}
