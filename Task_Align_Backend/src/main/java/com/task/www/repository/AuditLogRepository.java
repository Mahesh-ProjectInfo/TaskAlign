package com.task.www.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.task.www.entity.AuditLog;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findByUserEmail(String userEmail);

    List<AuditLog> findByAction(String action);

    List<AuditLog> findByStatus(String status);

}
