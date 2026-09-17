package com.task.www.serviceImpl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.task.www.dto.RoleRequest;
import com.task.www.dto.RoleResponse;
import com.task.www.entity.Role;
import com.task.www.exception.DuplicateResourceException;
import com.task.www.exception.ResourceNotFoundException;
import com.task.www.entity.AssignmentType;
import com.task.www.repository.AssignmentTypeRepository;
import com.task.www.repository.RoleRepository;
import com.task.www.service.RoleService;

@Service
public class RoleServiceImpl implements RoleService {

	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private AssignmentTypeRepository assignmentTypeRepository;

	@Override
	public RoleResponse createRole(RoleRequest request) {

		AssignmentType assignmentType = assignmentTypeRepository.findByAssignmentTypeIdAndIsDeletedFalse(request.getAssignmentTypeId())
				.orElseThrow(() -> new ResourceNotFoundException("Assignment Type not found with ID: " + request.getAssignmentTypeId()));

		if (roleRepository.existsByRoleNameAndAssignmentTypeAssignmentTypeIdAndIsDeletedFalse(request.getRoleName(), request.getAssignmentTypeId())) {
			throw new DuplicateResourceException("Role name already exists under the selected Assignment Type");
		}

		Role role = new Role();

		role.setAssignmentType(assignmentType);

		role.setRoleName(request.getRoleName());

		role.setIsDeleted(false);

		return mapToResponse(roleRepository.save(role));

	}

	@Override
	public List<RoleResponse> getAllRoles() {

		return roleRepository.findByIsDeletedFalse().stream().map(this::mapToResponse).collect(Collectors.toList());

	}

	@Override
	public RoleResponse getRoleById(Long id) {

		Role role = roleRepository.findByRoleIdAndIsDeletedFalse(id).orElseThrow(() -> new ResourceNotFoundException("Role not found with ID: " + id));

		return mapToResponse(role);

	}

	@Override
	public RoleResponse updateRole(Long id, RoleRequest request) {

		Role role = roleRepository.findByRoleIdAndIsDeletedFalse(id).orElseThrow(() -> new ResourceNotFoundException("Role not found with ID: " + id));

		AssignmentType assignmentType = assignmentTypeRepository.findByAssignmentTypeIdAndIsDeletedFalse(request.getAssignmentTypeId())
				.orElseThrow(() -> new ResourceNotFoundException("Assignment Type not found with ID: " + request.getAssignmentTypeId()));

		// Duplicate Validation
		if (!role.getRoleName().equalsIgnoreCase(request.getRoleName())
				&& roleRepository.existsByRoleNameAndAssignmentTypeAssignmentTypeIdAndIsDeletedFalse(request.getRoleName(), request.getAssignmentTypeId())) {
			throw new DuplicateResourceException("Role name already exists under the selected Assignment Type");
		}

		role.setAssignmentType(assignmentType);

		role.setRoleName(request.getRoleName());

		return mapToResponse(roleRepository.save(role));

	}

	@Override
	public String deleteRole(Long id) {

		Role role = roleRepository.findByRoleIdAndIsDeletedFalse(id).orElseThrow(() -> new ResourceNotFoundException("Role not found with ID: " + id));

		role.setIsDeleted(true);

		roleRepository.save(role);

		return "Role deleted successfully";

	}

	private RoleResponse mapToResponse(Role role) {

		RoleResponse response = new RoleResponse();

		response.setRoleId(role.getRoleId());

		if (role.getAssignmentType() != null) {
			response.setAssignmentTypeId(role.getAssignmentType().getAssignmentTypeId());
			response.setAssignmentTypeName(role.getAssignmentType().getAssignmentTypeName());
		}

		response.setRoleName(role.getRoleName());

		return response;

	}

}

