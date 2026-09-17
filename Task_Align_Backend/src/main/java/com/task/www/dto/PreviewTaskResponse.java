package com.task.www.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PreviewTaskResponse {

    private Long taskId;
    private Long assignmentId;
    private String taskName;
    private Integer estimatedDays;
    private List<TaskSkillResponse> skills;


}
