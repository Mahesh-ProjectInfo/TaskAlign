package com.task.www.util;

import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.web.multipart.MultipartFile;

public class ExcelHelper {

    public static String TYPE_XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    public static String TYPE_XLS = "application/vnd.ms-excel";
    public static String TYPE_CSV = "text/csv";

    public static boolean hasExcelFormat(MultipartFile file) {
        return isExcelFile(file);
    }

    public static boolean isExcelFile(MultipartFile file) {
        if (file == null) return false;
        String contentType = file.getContentType();
        String filename = file.getOriginalFilename() != null ? file.getOriginalFilename().toLowerCase() : "";
        
        return TYPE_XLSX.equals(contentType) || TYPE_XLS.equals(contentType)
                || filename.endsWith(".xlsx") || filename.endsWith(".xls");
    }

    public static boolean isCsvFile(MultipartFile file) {
        if (file == null) return false;
        String contentType = file.getContentType();
        String filename = file.getOriginalFilename() != null ? file.getOriginalFilename().toLowerCase() : "";

        return TYPE_CSV.equals(contentType) || "application/csv".equals(contentType)
                || "text/plain".equals(contentType) || filename.endsWith(".csv");
    }

    public static boolean hasSupportedFormat(MultipartFile file) {
        return isExcelFile(file) || isCsvFile(file);
    }

    public static Workbook getWorkbook(MultipartFile file) {
        try {
            return WorkbookFactory.create(file.getInputStream());
        } catch (Exception e) {
            throw new RuntimeException("Unable to read Excel file: " + e.getMessage(), e);
        }
    }

}
