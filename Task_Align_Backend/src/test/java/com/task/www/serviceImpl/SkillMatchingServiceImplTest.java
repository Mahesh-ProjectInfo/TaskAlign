package com.task.www.serviceImpl;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.anyList;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.task.www.dto.SkillMatchingResultResponse;
import com.task.www.dto.TaskSkillMatchResponse;
import com.task.www.entity.Assignment;
import com.task.www.entity.AssignmentResource;
import com.task.www.entity.Resource;
import com.task.www.entity.ResourceSkill;
import com.task.www.entity.Skill;
import com.task.www.entity.Task;
import com.task.www.entity.TaskSkill;
import com.task.www.enums.OptimizationType;
import com.task.www.repository.AssignmentRepository;
import com.task.www.repository.AssignmentResourceRepository;
import com.task.www.repository.ResourceRepository;
import com.task.www.repository.ResourceSkillRepository;
import com.task.www.repository.TaskRepository;
import com.task.www.repository.TaskSkillRepository;

@ExtendWith(MockitoExtension.class)
class SkillMatchingServiceImplTest {

    @Mock
    private AssignmentRepository assignmentRepository;
    @Mock
    private AssignmentResourceRepository assignmentResourceRepository;
    @Mock
    private ResourceRepository resourceRepository;
    @Mock
    private ResourceSkillRepository resourceSkillRepository;
    @Mock
    private TaskRepository taskRepository;
    @Mock
    private TaskSkillRepository taskSkillRepository;

    @InjectMocks
    private SkillMatchingServiceImpl skillMatchingService;

    private static final Long ASSIGNMENT_ID = 1L;
    private static final Long TASK_ID = 10L;
    private static final Long RESOURCE_ID = 100L;

    private static final Long SKILL_JAVA = 1L;
    private static final Long SKILL_SPRING_BOOT = 2L;
    private static final Long SKILL_MYSQL = 3L;

    private Assignment assignment;
    private Task task;
    private Resource resource;
    private AssignmentResource assignmentResource;

    @BeforeEach
    void setUp() {
        assignment = Assignment.builder()
                .assignmentId(ASSIGNMENT_ID)
                .assignmentName("Payment Project")
                .optimizationType(OptimizationType.COST_MINIMIZATION)
                .build();
        assignment.setIsDeleted(false);

        task = Task.builder()
                .taskId(TASK_ID)
                .taskName("Payment Page")
                .estimatedDays(5)
                .build();
        task.setIsDeleted(false);

        resource = Resource.builder()
                .resourceId(RESOURCE_ID)
                .resourceName("Developer A")
                .monthlySalary(BigDecimal.valueOf(5000))
                .build();
        resource.setIsDeleted(false);

        assignmentResource = AssignmentResource.builder()
                .assignmentResourceId(1L)
                .assignment(assignment)
                .resourceId(RESOURCE_ID)
                .build();
    }

    private void setupCommonMocks() {
        when(assignmentRepository.findByAssignmentIdAndIsDeletedFalse(ASSIGNMENT_ID))
                .thenReturn(Optional.of(assignment));

        when(assignmentResourceRepository.findByAssignmentAssignmentId(ASSIGNMENT_ID))
                .thenReturn(List.of(assignmentResource));

        when(resourceRepository.findAllById(List.of(RESOURCE_ID)))
                .thenReturn(List.of(resource));

        when(taskRepository.findByAssignmentAssignmentIdAndIsDeletedFalse(ASSIGNMENT_ID))
                .thenReturn(List.of(task));
    }

    @Test
    @DisplayName("Case 1: Task Requires [Java, Spring Boot], Resource Has [Java] -> NOT Eligible")
    void testCase1_PartialSkills_NotEligible() {
        setupCommonMocks();

        // Task skills: Java (1), Spring Boot (2)
        TaskSkill tsJava = TaskSkill.builder().taskSkillId(1L).skillId(SKILL_JAVA).build();
        TaskSkill tsSpringBoot = TaskSkill.builder().taskSkillId(2L).skillId(SKILL_SPRING_BOOT).build();
        when(taskSkillRepository.findByTaskTaskId(TASK_ID)).thenReturn(List.of(tsJava, tsSpringBoot));

        // Resource skills: Java (1) only
        Skill sJava = Skill.builder().skillId(SKILL_JAVA).skillName("Java").build();
        ResourceSkill rsJava = ResourceSkill.builder().resourceSkillId(1L).resource(resource).skill(sJava).build();
        when(resourceSkillRepository.findByResourceResourceIdIn(anyList())).thenReturn(List.of(rsJava));

        // Execute
        SkillMatchingResultResponse response = skillMatchingService.getSkillMatchingForAssignment(ASSIGNMENT_ID);

        // Assert
        assertNotNull(response);
        assertEquals(1, response.getTasks().size());
        TaskSkillMatchResponse taskMatch = response.getTasks().get(0);
        assertTrue(taskMatch.getMatchingResources().isEmpty(), "Resource should NOT be eligible because Spring Boot is missing");
    }

    @Test
    @DisplayName("Case 2: Task Requires [Java, Spring Boot], Resource Has [Java, Spring Boot] -> Eligible")
    void testCase2_ExactSkillMatch_Eligible() {
        setupCommonMocks();

        // Task skills: Java (1), Spring Boot (2)
        TaskSkill tsJava = TaskSkill.builder().taskSkillId(1L).skillId(SKILL_JAVA).build();
        TaskSkill tsSpringBoot = TaskSkill.builder().taskSkillId(2L).skillId(SKILL_SPRING_BOOT).build();
        when(taskSkillRepository.findByTaskTaskId(TASK_ID)).thenReturn(List.of(tsJava, tsSpringBoot));

        // Resource skills: Java (1), Spring Boot (2)
        Skill sJava = Skill.builder().skillId(SKILL_JAVA).skillName("Java").build();
        Skill sSpringBoot = Skill.builder().skillId(SKILL_SPRING_BOOT).skillName("Spring Boot").build();
        ResourceSkill rsJava = ResourceSkill.builder().resourceSkillId(1L).resource(resource).skill(sJava).build();
        ResourceSkill rsSpringBoot = ResourceSkill.builder().resourceSkillId(2L).resource(resource).skill(sSpringBoot).build();
        when(resourceSkillRepository.findByResourceResourceIdIn(anyList())).thenReturn(List.of(rsJava, rsSpringBoot));

        // Execute
        SkillMatchingResultResponse response = skillMatchingService.getSkillMatchingForAssignment(ASSIGNMENT_ID);

        // Assert
        assertNotNull(response);
        assertEquals(1, response.getTasks().size());
        TaskSkillMatchResponse taskMatch = response.getTasks().get(0);
        assertFalse(taskMatch.getMatchingResources().isEmpty(), "Resource should be eligible as it possesses all required skills");
        assertEquals(RESOURCE_ID, taskMatch.getMatchingResources().get(0).getResourceId());
    }

    @Test
    @DisplayName("Case 3: Task Requires [Java, Spring Boot, MySQL], Resource Has [Java, Spring Boot] -> NOT Eligible")
    void testCase3_MissingOneOfThreeSkills_NotEligible() {
        setupCommonMocks();

        // Task skills: Java (1), Spring Boot (2), MySQL (3)
        TaskSkill ts1 = TaskSkill.builder().taskSkillId(1L).skillId(SKILL_JAVA).build();
        TaskSkill ts2 = TaskSkill.builder().taskSkillId(2L).skillId(SKILL_SPRING_BOOT).build();
        TaskSkill ts3 = TaskSkill.builder().taskSkillId(3L).skillId(SKILL_MYSQL).build();
        when(taskSkillRepository.findByTaskTaskId(TASK_ID)).thenReturn(List.of(ts1, ts2, ts3));

        // Resource skills: Java (1), Spring Boot (2)
        Skill sJava = Skill.builder().skillId(SKILL_JAVA).skillName("Java").build();
        Skill sSpringBoot = Skill.builder().skillId(SKILL_SPRING_BOOT).skillName("Spring Boot").build();
        ResourceSkill rsJava = ResourceSkill.builder().resourceSkillId(1L).resource(resource).skill(sJava).build();
        ResourceSkill rsSpringBoot = ResourceSkill.builder().resourceSkillId(2L).resource(resource).skill(sSpringBoot).build();
        when(resourceSkillRepository.findByResourceResourceIdIn(anyList())).thenReturn(List.of(rsJava, rsSpringBoot));

        // Execute
        SkillMatchingResultResponse response = skillMatchingService.getSkillMatchingForAssignment(ASSIGNMENT_ID);

        // Assert
        assertNotNull(response);
        assertEquals(1, response.getTasks().size());
        TaskSkillMatchResponse taskMatch = response.getTasks().get(0);
        assertTrue(taskMatch.getMatchingResources().isEmpty(), "Resource should NOT be eligible because MySQL is missing");
    }

    @Test
    @DisplayName("Case 4: Task Requires [Java], Resource Has [Java, Spring Boot, MySQL] -> Eligible")
    void testCase4_SupersetSkills_Eligible() {
        setupCommonMocks();

        // Task skills: Java (1)
        TaskSkill tsJava = TaskSkill.builder().taskSkillId(1L).skillId(SKILL_JAVA).build();
        when(taskSkillRepository.findByTaskTaskId(TASK_ID)).thenReturn(List.of(tsJava));

        // Resource skills: Java (1), Spring Boot (2), MySQL (3)
        Skill sJava = Skill.builder().skillId(SKILL_JAVA).skillName("Java").build();
        Skill sSpringBoot = Skill.builder().skillId(SKILL_SPRING_BOOT).skillName("Spring Boot").build();
        Skill sMysql = Skill.builder().skillId(SKILL_MYSQL).skillName("MySQL").build();
        ResourceSkill rs1 = ResourceSkill.builder().resourceSkillId(1L).resource(resource).skill(sJava).build();
        ResourceSkill rs2 = ResourceSkill.builder().resourceSkillId(2L).resource(resource).skill(sSpringBoot).build();
        ResourceSkill rs3 = ResourceSkill.builder().resourceSkillId(3L).resource(resource).skill(sMysql).build();
        when(resourceSkillRepository.findByResourceResourceIdIn(anyList())).thenReturn(List.of(rs1, rs2, rs3));

        // Execute
        SkillMatchingResultResponse response = skillMatchingService.getSkillMatchingForAssignment(ASSIGNMENT_ID);

        // Assert
        assertNotNull(response);
        assertEquals(1, response.getTasks().size());
        TaskSkillMatchResponse taskMatch = response.getTasks().get(0);
        assertFalse(taskMatch.getMatchingResources().isEmpty(), "Resource should be eligible as it possesses all required skills (plus extra)");
        assertEquals(RESOURCE_ID, taskMatch.getMatchingResources().get(0).getResourceId());
    }
}
