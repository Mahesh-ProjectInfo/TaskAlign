package com.task.www.dto;

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
public class AssignmentResourceResponse {

    private Long assignmentResourceId;
    private Long assignmentId;
    private Long resourceId;


}
