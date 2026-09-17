package com.task.www.service;

import org.springframework.web.multipart.MultipartFile;

import com.task.www.dto.BulkUploadResponse;

public interface BulkUploadService {

    BulkUploadResponse uploadResources(MultipartFile file);

}
