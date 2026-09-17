package com.task.www.serviceImpl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.task.www.entity.AuditLog;
import com.task.www.repository.AuditLogRepository;
import com.task.www.service.AuditService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuditServiceImpl implements AuditService {

    private final AuditLogRepository auditLogRepository;

    @Override
    public void saveAuditLog(String userEmail,
                             String action,
                             String description,
                             String ipAddress,
                             String status) {

        AuditLog auditLog = AuditLog.builder()
                .userEmail(userEmail)
                .action(action)
                .description(description)
                .ipAddress(ipAddress)
                .status(status)
                .build();
        auditLog.setCreatedBy(userEmail);
        auditLog.setUpdatedBy(userEmail);

        auditLogRepository.save(auditLog);

    }

    @Override
    public List<AuditLog> getAllAuditLogs() {

        return auditLogRepository.findAll();

    }

    @Override
    public List<AuditLog> getAuditLogsByUserEmail(String userEmail) {

        return auditLogRepository.findByUserEmail(userEmail);

    }

    @Override
    public List<AuditLog> getAuditLogsByAction(String action) {

        return auditLogRepository.findByAction(action);

    }

    @Override
    public List<AuditLog> getAuditLogsByStatus(String status) {

        return auditLogRepository.findByStatus(status);

    }

}
