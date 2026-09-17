package com.task.www.serviceImpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.task.www.config.SecurityUtils;
import com.task.www.dto.ApiResponse;
import com.task.www.dto.AssignmentStatusChartResponse;
import com.task.www.dto.AssignmentTypeChartResponse;
import com.task.www.dto.DashboardCardResponse;
import com.task.www.dto.DashboardChartResponse;
import com.task.www.dto.DashboardResponse;
import com.task.www.dto.MonthlyAssignmentChartResponse;
import com.task.www.enums.AssignmentStatus;
import com.task.www.repository.AssignmentRepository;
import com.task.www.repository.ReportHistoryRepository;
import com.task.www.repository.ResourceRepository;
import com.task.www.repository.RoleRepository;
import com.task.www.repository.SkillRepository;
import com.task.www.repository.TaskRepository;
import com.task.www.service.DashboardService;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private ResourceRepository resourceRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ReportHistoryRepository reportHistoryRepository;


    @Override
    public ApiResponse<DashboardResponse> getDashboardSummary() {

        DashboardCardResponse cards =
                getDashboardCards().getData();

        DashboardChartResponse charts =
                getDashboardCharts().getData();

        DashboardResponse response =
                DashboardResponse.builder()
                        .cards(cards)
                        .charts(charts)
                        .build();

        return new ApiResponse<>(
                true,
                "Dashboard summary fetched successfully",
                response);
    }


    @Override
    public ApiResponse<DashboardCardResponse> getDashboardCards() {

        String currentUser = SecurityUtils.getCurrentUser();

        Long totalAssignments =
                assignmentRepository.countByCreatedByAndIsDeletedFalse(currentUser);

        Long draftAssignments =
                assignmentRepository
                        .countByAssignmentStatusAndCreatedByAndIsDeletedFalse(
                                AssignmentStatus.DRAFT, currentUser);

        Long completedAssignments =
                assignmentRepository
                        .countByAssignmentStatusAndCreatedByAndIsDeletedFalse(
                                AssignmentStatus.COMPLETED, currentUser);

        /*
         * Current AssignmentStatus enum contains only:
         *
         * DRAFT
         * COMPLETED
         *
         * Therefore ACTIVE is currently returned as 0.
         */

        Long activeAssignments = 0L;

        Long totalRoles = roleRepository.count();

        Long totalSkills = skillRepository.count();

        Long totalResources = resourceRepository.count();

        Long totalTasks = taskRepository.countByAssignmentCreatedByAndIsDeletedFalse(currentUser);

        Long totalReports = reportHistoryRepository.countByGeneratedByAndIsDeletedFalse(currentUser);


        DashboardCardResponse response =
                DashboardCardResponse.builder()
                        .totalAssignments(totalAssignments)
                        .activeAssignments(activeAssignments)
                        .draftAssignments(draftAssignments)
                        .completedAssignments(completedAssignments)
                        .totalRoles(totalRoles)
                        .totalSkills(totalSkills)
                        .totalResources(totalResources)
                        .totalTasks(totalTasks)
                        .totalReports(totalReports)
                        .build();

        return new ApiResponse<>(
                true,
                "Dashboard cards fetched successfully",
                response);
    }


    @Override
    public ApiResponse<DashboardChartResponse> getDashboardCharts() {

        String currentUser = SecurityUtils.getCurrentUser();

        List<AssignmentStatusChartResponse> statusChart =
                assignmentRepository.getAssignmentStatusChartByCreatedBy(currentUser);

        List<AssignmentTypeChartResponse> typeChart =
                assignmentRepository.getAssignmentTypeChartByCreatedBy(currentUser);

        List<MonthlyAssignmentChartResponse> monthlyChart =
                assignmentRepository.getMonthlyAssignmentChartByCreatedBy(currentUser);


        DashboardChartResponse response =
                DashboardChartResponse.builder()
                        .assignmentStatusChart(statusChart)
                        .assignmentTypeChart(typeChart)
                        .monthlyAssignmentChart(monthlyChart)
                        .build();

        return new ApiResponse<>(
                true,
                "Dashboard charts fetched successfully",
                response);
    }


    @Override
    public ApiResponse<List<AssignmentStatusChartResponse>>
            getAssignmentStatusChart() {

        String currentUser = SecurityUtils.getCurrentUser();

        List<AssignmentStatusChartResponse> response =
                assignmentRepository.getAssignmentStatusChartByCreatedBy(currentUser);

        return new ApiResponse<>(
                true,
                "Assignment status chart fetched successfully",
                response);
    }


    @Override
    public ApiResponse<List<AssignmentTypeChartResponse>>
            getAssignmentTypeChart() {

        String currentUser = SecurityUtils.getCurrentUser();

        List<AssignmentTypeChartResponse> response =
                assignmentRepository.getAssignmentTypeChartByCreatedBy(currentUser);

        return new ApiResponse<>(
                true,
                "Assignment type chart fetched successfully",
                response);
    }


    @Override
    public ApiResponse<List<MonthlyAssignmentChartResponse>>
            getMonthlyAssignmentChart() {

        String currentUser = SecurityUtils.getCurrentUser();

        List<MonthlyAssignmentChartResponse> response =
                assignmentRepository.getMonthlyAssignmentChartByCreatedBy(currentUser);

        return new ApiResponse<>(
                true,
                "Monthly assignment chart fetched successfully",
                response);
    }

}