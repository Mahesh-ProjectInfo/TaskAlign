package com.task.www.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BulkTaskSaveRequest {

    @Valid
    @NotEmpty(message = "Task list must not be empty")
    private List<BulkTaskRequest> tasks;
}
