package com.task.www.service;


import java.util.List;

import com.task.www.dto.RoleRequest;
import com.task.www.dto.RoleResponse;


public interface RoleService {


    RoleResponse createRole(RoleRequest request);


    List<RoleResponse> getAllRoles();


    RoleResponse getRoleById(Long id);


    RoleResponse updateRole(Long id, RoleRequest request);


    String deleteRole(Long id);

}
