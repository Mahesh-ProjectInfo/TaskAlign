package com.task.www.dto;

import java.util.List;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BulkTaskRequest {

    private Long taskId;

    @NotBlank(message = "Task name is required")
    private String taskName;

    @NotNull(message = "Estimated effort (days) is required")
    @Min(value = 1, message = "Estimated effort must be at least 1 day")
    private Integer estimatedDays;

    private List<Long> skillIds;
}
