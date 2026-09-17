package com.task.www.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.task.www.dto.BulkUploadResponse;
import com.task.www.service.BulkUploadService;

@RestController
@RequestMapping("/api/bulk-upload")
@CrossOrigin("*")
public class BulkUploadController {

    @Autowired
    private BulkUploadService bulkUploadService;

    @PostMapping("/resources")
    public ResponseEntity<BulkUploadResponse> uploadResources(
            @RequestParam("file") MultipartFile file) {

        return ResponseEntity.ok(
                bulkUploadService.uploadResources(file));

    }

}
