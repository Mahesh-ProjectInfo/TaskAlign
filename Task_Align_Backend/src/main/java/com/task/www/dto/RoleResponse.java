package com.task.www.dto;

import lombok.Data;


@Data
public class RoleResponse {

    private Long roleId;

    private Long assignmentTypeId;

    private String assignmentTypeName;

    private String roleName;


}
