package com.task.www.serviceImpl;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.task.www.dto.BulkUploadResponse;
import com.task.www.dto.ResourceRequest;
import com.task.www.entity.AssignmentType;
import com.task.www.entity.Role;
import com.task.www.entity.Skill;
import com.task.www.repository.AssignmentTypeRepository;
import com.task.www.repository.RoleRepository;
import com.task.www.repository.SkillRepository;
import com.task.www.service.BulkUploadService;
import com.task.www.service.ResourceService;
import com.task.www.util.ExcelHelper;

@Service
public class BulkUploadServiceImpl implements BulkUploadService {

    @Autowired
    private ResourceService resourceService;

    @Autowired
    private AssignmentTypeRepository assignmentTypeRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private SkillRepository skillRepository;

    private static final String KEY_ASSIGNMENT_TYPE = "ASSIGNMENT_TYPE";
    private static final String KEY_RESOURCE_NAME = "RESOURCE_NAME";
    private static final String KEY_ROLE = "ROLE";
    private static final String KEY_MONTHLY_SALARY = "MONTHLY_SALARY";
    private static final String KEY_PERFORMANCE_RATING = "PERFORMANCE_RATING";
    private static final String KEY_SKILLS = "SKILLS";

    @Override
    public BulkUploadResponse uploadResources(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return new BulkUploadResponse(0, 0, 0, "Uploaded file is empty.");
        }

        if (!ExcelHelper.hasSupportedFormat(file)) {
            return new BulkUploadResponse(0, 0, 0, "Please upload a valid CSV (.csv) or Excel (.xlsx / .xls) file.");
        }

        if (ExcelHelper.isCsvFile(file)) {
            return processCsvFile(file);
        } else {
            return processExcelFile(file);
        }
    }

    private BulkUploadResponse processCsvFile(MultipartFile file) {
        List<List<String>> rows = new ArrayList<>();
        try (BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            boolean firstLine = true;
            while ((line = br.readLine()) != null) {
                if (firstLine) {
                    if (line.startsWith("\uFEFF")) {
                        line = line.substring(1);
                    }
                    firstLine = false;
                }
                List<String> parsedLine = parseCsvLine(line);
                if (!isRowEmpty(parsedLine)) {
                    rows.add(parsedLine);
                }
            }
        } catch (Exception e) {
            return new BulkUploadResponse(0, 0, 0, "Error reading CSV file: " + e.getMessage());
        }

        return processRows(rows);
    }

    private BulkUploadResponse processExcelFile(MultipartFile file) {
        List<List<String>> rows = new ArrayList<>();
        DataFormatter dataFormatter = new DataFormatter();
        try (Workbook workbook = ExcelHelper.getWorkbook(file)) {
            Sheet sheet = workbook.getSheetAt(0);
            if (sheet == null) {
                return new BulkUploadResponse(0, 0, 0, "Excel sheet is empty.");
            }
            int lastRowNum = sheet.getLastRowNum();
            for (int i = 0; i <= lastRowNum; i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    continue;
                }
                List<String> rowData = new ArrayList<>();
                short lastCellNum = row.getLastCellNum();
                for (int c = 0; c < lastCellNum; c++) {
                    Cell cell = row.getCell(c);
                    rowData.add(getCellValueAsString(cell, dataFormatter));
                }
                if (!isRowEmpty(rowData)) {
                    rows.add(rowData);
                }
            }
        } catch (Exception e) {
            return new BulkUploadResponse(0, 0, 0, "Error reading Excel file: " + e.getMessage());
        }

        return processRows(rows);
    }

    private BulkUploadResponse processRows(List<List<String>> rows) {
        if (rows.isEmpty()) {
            return new BulkUploadResponse(0, 0, 0, "File contains no data.");
        }

        Map<String, Integer> columnMap = detectHeaderMap(rows.get(0));
        int startIndex = 0;
        if (columnMap != null) {
            startIndex = 1; // skip header row
        } else {
            columnMap = getDefaultColumnMap();
        }

        int total = 0;
        int success = 0;
        int failed = 0;

        for (int i = startIndex; i < rows.size(); i++) {
            List<String> row = rows.get(i);
            int rowNumForDisplay = i + 1;

            String assignmentTypeVal = getCellByMap(row, columnMap, KEY_ASSIGNMENT_TYPE);
            String resourceNameVal = getCellByMap(row, columnMap, KEY_RESOURCE_NAME);
            String roleVal = getCellByMap(row, columnMap, KEY_ROLE);
            String salaryVal = getCellByMap(row, columnMap, KEY_MONTHLY_SALARY);
            String ratingVal = getCellByMap(row, columnMap, KEY_PERFORMANCE_RATING);
            String skillsVal = getCellByMap(row, columnMap, KEY_SKILLS);

            if (assignmentTypeVal.isBlank() && resourceNameVal.isBlank() && roleVal.isBlank()
                    && salaryVal.isBlank() && ratingVal.isBlank() && skillsVal.isBlank()) {
                continue;
            }

            total++;

            try {
                // 1. Resolve Assignment Type
                if (assignmentTypeVal.isBlank()) {
                    throw new IllegalArgumentException("Assignment Type is required");
                }
                AssignmentType assignmentType = resolveAssignmentType(assignmentTypeVal);

                // 2. Resource Name
                if (resourceNameVal.isBlank()) {
                    throw new IllegalArgumentException("Resource Name is required");
                }

                // 3. Resolve Role under Assignment Type
                if (roleVal.isBlank()) {
                    throw new IllegalArgumentException("Role is required");
                }
                Role role = resolveRole(roleVal, assignmentType);

                // 4. Monthly Salary
                if (salaryVal.isBlank()) {
                    throw new IllegalArgumentException("Monthly Salary is required");
                }
                BigDecimal monthlySalary;
                try {
                    monthlySalary = new BigDecimal(salaryVal.replace(",", ""));
                } catch (Exception e) {
                    throw new IllegalArgumentException("Invalid Monthly Salary format: " + salaryVal);
                }
                if (monthlySalary.compareTo(new BigDecimal("0.01")) < 0) {
                    throw new IllegalArgumentException("Monthly Salary must be greater than 0");
                }

                // 5. Performance Rating
                if (ratingVal.isBlank()) {
                    throw new IllegalArgumentException("Performance Rating is required");
                }
                BigDecimal performanceRating;
                try {
                    performanceRating = new BigDecimal(ratingVal.replace(",", ""));
                } catch (Exception e) {
                    throw new IllegalArgumentException("Invalid Performance Rating format: " + ratingVal);
                }
                if (performanceRating.compareTo(BigDecimal.ZERO) < 0) {
                    throw new IllegalArgumentException("Performance Rating must be 0 or greater");
                }

                // 6. Resolve Skills under Assignment Type
                if (skillsVal.isBlank()) {
                    throw new IllegalArgumentException("At least one skill is required");
                }
                List<Long> skillIds = resolveSkillIds(skillsVal, assignmentType);
                if (skillIds.isEmpty()) {
                    throw new IllegalArgumentException("At least one valid skill is required");
                }

                // 7. Create Resource Request
                ResourceRequest request = new ResourceRequest();
                request.setResourceName(resourceNameVal);
                request.setAssignmentTypeId(assignmentType.getAssignmentTypeId());
                request.setRoleId(role.getRoleId());
                request.setSkillIds(skillIds);
                request.setMonthlySalary(monthlySalary);
                request.setPerformanceRating(performanceRating);

                resourceService.createResource(request);
                success++;

            } catch (Exception e) {
                failed++;
                System.err.println("==================================");
                System.err.println("Failed Row " + rowNumForDisplay + ": " + e.getMessage());
                System.err.println("==================================");
            }
        }

        String msg;
        if (total == 0) {
            msg = "No records were processed.";
        } else if (failed == 0) {
            msg = "Bulk Upload Completed Successfully. All " + success + " records saved.";
        } else {
            msg = "Bulk Upload Completed with warnings. Total: " + total + ", Success: " + success + ", Failed: " + failed + ".";
        }

        return new BulkUploadResponse(total, success, failed, msg);
    }

    private AssignmentType resolveAssignmentType(String val) {
        final String trimmedVal = val.trim();
        try {
            Long id = parseId(trimmedVal);
            if (id != null) {
                Optional<AssignmentType> atOpt = assignmentTypeRepository.findByAssignmentTypeIdAndIsDeletedFalse(id);
                if (atOpt.isPresent()) {
                    return atOpt.get();
                }
            }
        } catch (Exception ignored) {}

        return assignmentTypeRepository.findByAssignmentTypeNameIgnoreCaseAndIsDeletedFalse(trimmedVal)
                .orElseThrow(() -> new IllegalArgumentException("Assignment Type not found: " + trimmedVal));
    }

    private Role resolveRole(String val, AssignmentType assignmentType) {
        final String trimmedVal = val.trim();
        try {
            Long id = parseId(trimmedVal);
            if (id != null) {
                Optional<Role> roleOpt = roleRepository.findByRoleIdAndIsDeletedFalse(id);
                if (roleOpt.isPresent()) {
                    Role role = roleOpt.get();
                    if (role.getAssignmentType() != null && role.getAssignmentType().getAssignmentTypeId().equals(assignmentType.getAssignmentTypeId())) {
                        return role;
                    } else {
                        throw new IllegalArgumentException("Role ID " + id + " does not belong to Assignment Type '" + assignmentType.getAssignmentTypeName() + "'");
                    }
                }
            }
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception ignored) {}

        Optional<Role> roleOpt = roleRepository.findByRoleNameIgnoreCaseAndAssignmentTypeAssignmentTypeIdAndIsDeletedFalse(trimmedVal, assignmentType.getAssignmentTypeId());
        if (roleOpt.isPresent()) {
            return roleOpt.get();
        }

        Optional<Role> roleFallback = roleRepository.findByRoleNameIgnoreCaseAndIsDeletedFalse(trimmedVal);
        if (roleFallback.isPresent()) {
            Role r = roleFallback.get();
            String atName = r.getAssignmentType() != null ? r.getAssignmentType().getAssignmentTypeName() : "None";
            throw new IllegalArgumentException("Role '" + trimmedVal + "' belongs to Assignment Type '" + atName + "', not '" + assignmentType.getAssignmentTypeName() + "'");
        }

        throw new IllegalArgumentException("Role '" + trimmedVal + "' not found under Assignment Type '" + assignmentType.getAssignmentTypeName() + "'");
    }

    private List<Long> resolveSkillIds(String val, AssignmentType assignmentType) {
        String[] tokens = val.split("[,;|\\n]");
        List<Long> skillIds = new ArrayList<>();

        for (String rawToken : tokens) {
            final String token = rawToken.trim();
            if (token.isEmpty()) continue;

            Skill skill = null;

            try {
                Long id = parseId(token);
                if (id != null) {
                    Optional<Skill> sOpt = skillRepository.findBySkillIdAndIsDeletedFalse(id);
                    if (sOpt.isPresent()) {
                        Skill s = sOpt.get();
                        if (s.getAssignmentType() != null && s.getAssignmentType().getAssignmentTypeId().equals(assignmentType.getAssignmentTypeId())) {
                            skill = s;
                        } else {
                            throw new IllegalArgumentException("Skill ID " + id + " (" + s.getSkillName() + ") does not belong to Assignment Type '" + assignmentType.getAssignmentTypeName() + "'");
                        }
                    }
                }
            } catch (IllegalArgumentException e) {
                throw e;
            } catch (Exception ignored) {}

            if (skill == null) {
                Optional<Skill> sOpt = skillRepository.findBySkillNameIgnoreCaseAndAssignmentTypeAssignmentTypeIdAndIsDeletedFalse(token, assignmentType.getAssignmentTypeId());
                if (sOpt.isPresent()) {
                    skill = sOpt.get();
                } else {
                    Optional<Skill> sFallback = skillRepository.findBySkillNameIgnoreCaseAndIsDeletedFalse(token);
                    if (sFallback.isPresent()) {
                        String atName = sFallback.get().getAssignmentType() != null ? sFallback.get().getAssignmentType().getAssignmentTypeName() : "None";
                        throw new IllegalArgumentException("Skill '" + token + "' belongs to Assignment Type '" + atName + "', not '" + assignmentType.getAssignmentTypeName() + "'");
                    } else {
                        throw new IllegalArgumentException("Skill '" + token + "' not found under Assignment Type '" + assignmentType.getAssignmentTypeName() + "'");
                    }
                }
            }

            if (skill != null && !skillIds.contains(skill.getSkillId())) {
                skillIds.add(skill.getSkillId());
            }
        }

        return skillIds;
    }

    private Long parseId(String val) {
        if (val == null) return null;
        val = val.trim();
        if (val.matches("^\\d+(\\.0+)?$")) {
            if (val.contains(".")) {
                val = val.substring(0, val.indexOf("."));
            }
            return Long.parseLong(val);
        }
        return null;
    }

    private Map<String, Integer> detectHeaderMap(List<String> firstRow) {
        if (firstRow == null || firstRow.isEmpty()) return null;

        Map<String, Integer> map = new HashMap<>();
        int matches = 0;

        for (int i = 0; i < firstRow.size(); i++) {
            String col = firstRow.get(i).toLowerCase().trim().replaceAll("[_\\-\\s]+", "");
            if (col.contains("assignment")) {
                map.put(KEY_ASSIGNMENT_TYPE, i);
                matches++;
            } else if (col.contains("role")) {
                map.put(KEY_ROLE, i);
                matches++;
            } else if (col.contains("salary") || col.contains("monthly")) {
                map.put(KEY_MONTHLY_SALARY, i);
                matches++;
            } else if (col.contains("rating") || col.contains("performance")) {
                map.put(KEY_PERFORMANCE_RATING, i);
                matches++;
            } else if (col.contains("skill")) {
                map.put(KEY_SKILLS, i);
                matches++;
            } else if (col.contains("resource") || col.contains("name")) {
                map.put(KEY_RESOURCE_NAME, i);
                matches++;
            }
        }

        if (matches >= 2) {
            return map;
        }

        return null;
    }

    private Map<String, Integer> getDefaultColumnMap() {
        Map<String, Integer> map = new HashMap<>();
        map.put(KEY_ASSIGNMENT_TYPE, 0);
        map.put(KEY_RESOURCE_NAME, 1);
        map.put(KEY_ROLE, 2);
        map.put(KEY_MONTHLY_SALARY, 3);
        map.put(KEY_PERFORMANCE_RATING, 4);
        map.put(KEY_SKILLS, 5);
        return map;
    }

    private String getCellByMap(List<String> row, Map<String, Integer> columnMap, String key) {
        Integer colIdx = columnMap.get(key);
        if (colIdx != null && colIdx >= 0 && colIdx < row.size()) {
            return row.get(colIdx).trim();
        }
        return "";
    }

    private boolean isRowEmpty(List<String> row) {
        if (row == null) return true;
        for (String cell : row) {
            if (cell != null && !cell.trim().isEmpty()) {
                return false;
            }
        }
        return true;
    }

    public static List<String> parseCsvLine(String line) {
        List<String> result = new ArrayList<>();
        if (line == null) return result;
        
        StringBuilder sb = new StringBuilder();
        boolean inQuotes = false;

        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);
            if (c == '"') {
                inQuotes = !inQuotes;
            } else if (c == ',' && !inQuotes) {
                result.add(sb.toString().trim());
                sb.setLength(0);
            } else {
                sb.append(c);
            }
        }
        result.add(sb.toString().trim());
        return result;
    }

    private String getCellValueAsString(Cell cell, DataFormatter dataFormatter) {
        if (cell == null) return "";
        if (cell.getCellType() == CellType.NUMERIC) {
            double val = cell.getNumericCellValue();
            if (val == Math.floor(val) && !Double.isInfinite(val)) {
                return String.format("%.0f", val);
            }
        }
        return dataFormatter.formatCellValue(cell).trim();
    }
}
