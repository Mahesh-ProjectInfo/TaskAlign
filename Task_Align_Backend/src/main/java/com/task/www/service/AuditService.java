package com.task.www.service;

import java.util.List;

import com.task.www.entity.AuditLog;

public interface AuditService {

    /**
     * Save Audit Log
     */
    void saveAuditLog(String userEmail,
                      String action,
                      String description,
                      String ipAddress,
                      String status);

    /**
     * Get All Audit Logs
     */
    List<AuditLog> getAllAuditLogs();

    /**
     * Get Audit Logs By User Email
     */
    List<AuditLog> getAuditLogsByUserEmail(String userEmail);

    /**
     * Get Audit Logs By Action
     */
    List<AuditLog> getAuditLogsByAction(String action);

    /**
     * Get Audit Logs By Status
     */
    List<AuditLog> getAuditLogsByStatus(String status);

}
