package com.task.www.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.task.www.entity.ReportHistory;

@Repository
public interface ReportHistoryRepository extends JpaRepository<ReportHistory, Long> {

    long countByGeneratedByAndIsDeletedFalse(String generatedBy);

    List<ReportHistory> findByGeneratedByAndIsDeletedFalse(String generatedBy);
}
