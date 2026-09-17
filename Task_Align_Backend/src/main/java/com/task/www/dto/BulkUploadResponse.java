package com.task.www.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BulkUploadResponse {

    private int totalRecords;

    private int successRecords;

    private int failedRecords;

    private String message;

}
