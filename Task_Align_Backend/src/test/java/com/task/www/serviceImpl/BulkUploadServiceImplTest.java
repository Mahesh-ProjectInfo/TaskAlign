package com.task.www.serviceImpl;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Optional;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import com.task.www.dto.BulkUploadResponse;
import com.task.www.dto.ResourceResponse;
import com.task.www.entity.AssignmentType;
import com.task.www.entity.Role;
import com.task.www.entity.Skill;
import com.task.www.repository.AssignmentTypeRepository;
import com.task.www.repository.RoleRepository;
import com.task.www.repository.SkillRepository;
import com.task.www.service.ResourceService;

@ExtendWith(MockitoExtension.class)
class BulkUploadServiceImplTest {

    @Mock
    private ResourceService resourceService;

    @Mock
    private AssignmentTypeRepository assignmentTypeRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private SkillRepository skillRepository;

    @InjectMocks
    private BulkUploadServiceImpl bulkUploadService;

    private AssignmentType assignmentType;
    private Role role;
    private Skill skill1;
    private Skill skill2;

    @BeforeEach
    void setUp() {
        assignmentType = AssignmentType.builder()
                .assignmentTypeId(1L)
                .assignmentTypeName("Software Development")
                .build();
        assignmentType.setIsDeleted(false);

        role = Role.builder()
                .roleId(10L)
                .roleName("Backend Developer")
                .assignmentType(assignmentType)
                .build();
        role.setIsDeleted(false);

        skill1 = Skill.builder()
                .skillId(100L)
                .skillName("Java")
                .assignmentType(assignmentType)
                .build();
        skill1.setIsDeleted(false);

        skill2 = Skill.builder()
                .skillId(101L)
                .skillName("Spring Boot")
                .assignmentType(assignmentType)
                .build();
        skill2.setIsDeleted(false);
    }

    @Test
    @DisplayName("Upload empty file returns appropriate response")
    void testUploadEmptyFile() {
        MockMultipartFile emptyFile = new MockMultipartFile("file", "test.csv", "text/csv", new byte[0]);
        BulkUploadResponse response = bulkUploadService.uploadResources(emptyFile);
        assertEquals(0, response.getTotalRecords());
        assertEquals("Uploaded file is empty.", response.getMessage());
    }

    @Test
    @DisplayName("Upload unsupported file format returns appropriate response")
    void testUploadUnsupportedFormat() {
        MockMultipartFile txtFile = new MockMultipartFile("file", "test.pdf", "application/pdf", "dummy".getBytes(StandardCharsets.UTF_8));
        BulkUploadResponse response = bulkUploadService.uploadResources(txtFile);
        assertEquals(0, response.getTotalRecords());
        assertEquals("Please upload a valid CSV (.csv) or Excel (.xlsx / .xls) file.", response.getMessage());
    }

    @Test
    @DisplayName("Upload CSV with valid data and header by Name")
    void testUploadCsvSuccessByName() {
        String csvContent = "Assignment Type,Resource Name,Role,Monthly Salary,Performance Rating,Skills\n" +
                "Software Development,Alice Smith,Backend Developer,60000,85,\"Java, Spring Boot\"";

        MockMultipartFile file = new MockMultipartFile("file", "resources.csv", "text/csv", csvContent.getBytes(StandardCharsets.UTF_8));

        when(assignmentTypeRepository.findByAssignmentTypeNameIgnoreCaseAndIsDeletedFalse("Software Development"))
                .thenReturn(Optional.of(assignmentType));
        when(roleRepository.findByRoleNameIgnoreCaseAndAssignmentTypeAssignmentTypeIdAndIsDeletedFalse("Backend Developer", 1L))
                .thenReturn(Optional.of(role));
        when(skillRepository.findBySkillNameIgnoreCaseAndAssignmentTypeAssignmentTypeIdAndIsDeletedFalse("Java", 1L))
                .thenReturn(Optional.of(skill1));
        when(skillRepository.findBySkillNameIgnoreCaseAndAssignmentTypeAssignmentTypeIdAndIsDeletedFalse("Spring Boot", 1L))
                .thenReturn(Optional.of(skill2));
        when(resourceService.createResource(any())).thenReturn(new ResourceResponse());

        BulkUploadResponse response = bulkUploadService.uploadResources(file);

        assertNotNull(response);
        assertEquals(1, response.getTotalRecords());
        assertEquals(1, response.getSuccessRecords());
        assertEquals(0, response.getFailedRecords());
        verify(resourceService, times(1)).createResource(any());
    }

    @Test
    @DisplayName("Upload CSV with IDs instead of Names")
    void testUploadCsvSuccessById() {
        String csvContent = "Assignment Type,Resource Name,Role,Monthly Salary,Performance Rating,Skills\n" +
                "1,Bob Jones,10,50000,90,\"100, 101\"";

        MockMultipartFile file = new MockMultipartFile("file", "resources.csv", "text/csv", csvContent.getBytes(StandardCharsets.UTF_8));

        when(assignmentTypeRepository.findByAssignmentTypeIdAndIsDeletedFalse(1L))
                .thenReturn(Optional.of(assignmentType));
        when(roleRepository.findByRoleIdAndIsDeletedFalse(10L))
                .thenReturn(Optional.of(role));
        when(skillRepository.findBySkillIdAndIsDeletedFalse(100L))
                .thenReturn(Optional.of(skill1));
        when(skillRepository.findBySkillIdAndIsDeletedFalse(101L))
                .thenReturn(Optional.of(skill2));
        when(resourceService.createResource(any())).thenReturn(new ResourceResponse());

        BulkUploadResponse response = bulkUploadService.uploadResources(file);

        assertNotNull(response);
        assertEquals(1, response.getTotalRecords());
        assertEquals(1, response.getSuccessRecords());
        assertEquals(0, response.getFailedRecords());
        verify(resourceService, times(1)).createResource(any());
    }

    @Test
    @DisplayName("Upload Excel (.xlsx) file successfully")
    void testUploadExcelSuccess() throws IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Resources");
            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("Assignment Type");
            header.createCell(1).setCellValue("Resource Name");
            header.createCell(2).setCellValue("Role");
            header.createCell(3).setCellValue("Monthly Salary");
            header.createCell(4).setCellValue("Performance Rating");
            header.createCell(5).setCellValue("Skills");

            Row data = sheet.createRow(1);
            data.createCell(0).setCellValue("Software Development");
            data.createCell(1).setCellValue("Charlie Brown");
            data.createCell(2).setCellValue("Backend Developer");
            data.createCell(3).setCellValue(75000);
            data.createCell(4).setCellValue(95);
            data.createCell(5).setCellValue("Java");

            workbook.write(out);
        }

        MockMultipartFile file = new MockMultipartFile("file", "resources.xlsx",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", out.toByteArray());

        when(assignmentTypeRepository.findByAssignmentTypeNameIgnoreCaseAndIsDeletedFalse("Software Development"))
                .thenReturn(Optional.of(assignmentType));
        when(roleRepository.findByRoleNameIgnoreCaseAndAssignmentTypeAssignmentTypeIdAndIsDeletedFalse("Backend Developer", 1L))
                .thenReturn(Optional.of(role));
        when(skillRepository.findBySkillNameIgnoreCaseAndAssignmentTypeAssignmentTypeIdAndIsDeletedFalse("Java", 1L))
                .thenReturn(Optional.of(skill1));
        when(resourceService.createResource(any())).thenReturn(new ResourceResponse());

        BulkUploadResponse response = bulkUploadService.uploadResources(file);

        assertNotNull(response);
        assertEquals(1, response.getTotalRecords());
        assertEquals(1, response.getSuccessRecords());
        assertEquals(0, response.getFailedRecords());
        verify(resourceService, times(1)).createResource(any());
    }

    @Test
    @DisplayName("Upload CSV with invalid Assignment Type handles error gracefully")
    void testUploadCsvInvalidAssignmentType() {
        String csvContent = "Assignment Type,Resource Name,Role,Monthly Salary,Performance Rating,Skills\n" +
                "Unknown Assignment,David Miller,Backend Developer,60000,80,Java";

        MockMultipartFile file = new MockMultipartFile("file", "resources.csv", "text/csv", csvContent.getBytes(StandardCharsets.UTF_8));

        when(assignmentTypeRepository.findByAssignmentTypeNameIgnoreCaseAndIsDeletedFalse("Unknown Assignment"))
                .thenReturn(Optional.empty());

        BulkUploadResponse response = bulkUploadService.uploadResources(file);

        assertNotNull(response);
        assertEquals(1, response.getTotalRecords());
        assertEquals(0, response.getSuccessRecords());
        assertEquals(1, response.getFailedRecords());
        verify(resourceService, times(0)).createResource(any());
    }

    @Test
    @DisplayName("Upload CSV with invalid Role under Assignment Type handles error gracefully")
    void testUploadCsvInvalidRoleForAssignmentType() {
        String csvContent = "Assignment Type,Resource Name,Role,Monthly Salary,Performance Rating,Skills\n" +
                "Software Development,Eve Adams,Nurse,60000,80,Java";

        MockMultipartFile file = new MockMultipartFile("file", "resources.csv", "text/csv", csvContent.getBytes(StandardCharsets.UTF_8));

        when(assignmentTypeRepository.findByAssignmentTypeNameIgnoreCaseAndIsDeletedFalse("Software Development"))
                .thenReturn(Optional.of(assignmentType));
        when(roleRepository.findByRoleNameIgnoreCaseAndAssignmentTypeAssignmentTypeIdAndIsDeletedFalse("Nurse", 1L))
                .thenReturn(Optional.empty());
        when(roleRepository.findByRoleNameIgnoreCaseAndIsDeletedFalse("Nurse"))
                .thenReturn(Optional.empty());

        BulkUploadResponse response = bulkUploadService.uploadResources(file);

        assertNotNull(response);
        assertEquals(1, response.getTotalRecords());
        assertEquals(0, response.getSuccessRecords());
        assertEquals(1, response.getFailedRecords());
        verify(resourceService, times(0)).createResource(any());
    }
}
