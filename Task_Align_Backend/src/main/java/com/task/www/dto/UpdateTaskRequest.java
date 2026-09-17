package com.task.www.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
public class UpdateTaskRequest {

    @NotBlank(message = "Task name is required.")
    @Size(max = 150, message = "Task name cannot exceed 150 characters.")
    private String taskName;

    @NotNull(message = "Estimated days is required.")
    @Min(value = 1, message = "Estimated days must be at least 1.")
    private Integer estimatedDays;
}
