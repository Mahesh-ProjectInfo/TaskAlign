package com.task.www.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentTypeResponse {

    private Long assignmentTypeId;

    private String assignmentTypeName;

    private Boolean isDeleted;

}
