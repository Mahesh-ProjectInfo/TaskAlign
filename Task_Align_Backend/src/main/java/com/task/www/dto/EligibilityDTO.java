package com.task.www.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EligibilityDTO {

    private Long resourceId;

    private Long taskId;

    private boolean eligible;

    private String reason;

}