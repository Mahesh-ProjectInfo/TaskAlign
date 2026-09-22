package com.task.www.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BulkTaskResponse {

    private Long taskId;
    private Long assignmentId;
    private String taskName;
    private Integer estimatedDays;
    private List<Long> skillIds;
}
