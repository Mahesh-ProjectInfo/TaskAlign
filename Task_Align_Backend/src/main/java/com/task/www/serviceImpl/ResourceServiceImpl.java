package com.task.www.serviceImpl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.task.www.dto.ResourceRequest;
import com.task.www.dto.ResourceResponse;
import com.task.www.dto.SkillResponse;
import com.task.www.entity.AssignmentType;
import com.task.www.entity.Resource;
import com.task.www.entity.ResourceSkill;
import com.task.www.entity.Role;
import com.task.www.entity.Skill;
import com.task.www.exception.ResourceNotFoundException;
import com.task.www.repository.AssignmentTypeRepository;
import com.task.www.repository.ResourceRepository;
import com.task.www.repository.ResourceSkillRepository;
import com.task.www.repository.RoleRepository;
import com.task.www.repository.SkillRepository;
import com.task.www.service.ResourceService;

@Service
public class ResourceServiceImpl implements ResourceService {

	private final ResourceRepository resourceRepository;
	private final RoleRepository roleRepository;
	private final SkillRepository skillRepository;
	private final AssignmentTypeRepository assignmentTypeRepository;
	private final ResourceSkillRepository resourceSkillRepository;

	public ResourceServiceImpl(ResourceRepository resourceRepository, RoleRepository roleRepository,
			SkillRepository skillRepository, AssignmentTypeRepository assignmentTypeRepository,
			ResourceSkillRepository resourceSkillRepository) {

		this.resourceRepository = resourceRepository;
		this.roleRepository = roleRepository;
		this.skillRepository = skillRepository;
		this.assignmentTypeRepository = assignmentTypeRepository;
		this.resourceSkillRepository = resourceSkillRepository;
	}

	// CREATE RESOURCE
	@Override
	@Transactional
	public ResourceResponse createResource(ResourceRequest request) {

		Role role = roleRepository.findByRoleIdAndIsDeletedFalse(request.getRoleId())
				.orElseThrow(() -> new ResourceNotFoundException("Role not found with ID: " + request.getRoleId()));

		AssignmentType assignmentType = assignmentTypeRepository
				.findByAssignmentTypeIdAndIsDeletedFalse(request.getAssignmentTypeId())
				.orElseThrow(() -> new ResourceNotFoundException(
						"Assignment Type not found with ID: " + request.getAssignmentTypeId()));

		Resource resource = new Resource();

		setResourceData(resource, request, role, assignmentType);

		resource.setIsDeleted(false);

		Resource savedResource = resourceRepository.save(resource);

		saveResourceSkills(savedResource, extractSkillIds(request));

		return mapToResponse(savedResource);
	}

	// GET ALL
	@Override
	@Transactional(readOnly = true)
	public List<ResourceResponse> getAllResources() {

		List<Resource> resources = resourceRepository.findByIsDeletedFalseFetchRoleAndAssignmentType();

		if (resources.isEmpty()) {
			return Collections.emptyList();
		}

		List<Long> resourceIds = resources.stream()
				.map(Resource::getResourceId)
				.filter(Objects::nonNull)
				.collect(Collectors.toList());

		List<ResourceSkill> allResourceSkills = resourceSkillRepository.findByResourceResourceIdIn(resourceIds);

		Map<Long, List<ResourceSkill>> skillsByResourceMap = allResourceSkills.stream()
				.filter(rs -> rs.getResource() != null && rs.getResource().getResourceId() != null)
				.collect(Collectors.groupingBy(rs -> rs.getResource().getResourceId()));

		return resources.stream()
				.map(resource -> mapToResponse(resource, skillsByResourceMap.getOrDefault(resource.getResourceId(), Collections.emptyList())))
				.collect(Collectors.toList());
	}

	// GET BY ID
	@Override
	public ResourceResponse getResourceById(Long id) {

		Resource resource = resourceRepository.findByResourceIdAndIsDeletedFalse(id)
				.orElseThrow(() -> new ResourceNotFoundException("Resource not found with ID: " + id));

		return mapToResponse(resource);
	}

	// UPDATE
	@Override
	@Transactional
	public ResourceResponse updateResource(Long id, ResourceRequest request) {

		Resource resource = resourceRepository.findByResourceIdAndIsDeletedFalse(id)
				.orElseThrow(() -> new ResourceNotFoundException("Resource not found with ID: " + id));

		Role role = roleRepository.findByRoleIdAndIsDeletedFalse(request.getRoleId())
				.orElseThrow(() -> new ResourceNotFoundException("Role not found with ID: " + request.getRoleId()));

		AssignmentType assignmentType = assignmentTypeRepository
				.findByAssignmentTypeIdAndIsDeletedFalse(request.getAssignmentTypeId())
				.orElseThrow(() -> new ResourceNotFoundException(
						"Assignment Type not found with ID: " + request.getAssignmentTypeId()));

		setResourceData(resource, request, role, assignmentType);

		Resource updatedResource = resourceRepository.save(resource);

		syncResourceSkills(updatedResource, extractSkillIds(request));

		return mapToResponse(updatedResource);
	}

	// DELETE
	@Override
	@Transactional
	public String deleteResource(Long id) {

		Resource resource = resourceRepository.findByResourceIdAndIsDeletedFalse(id)
				.orElseThrow(() -> new ResourceNotFoundException("Resource not found with ID: " + id));

		resource.setIsDeleted(true);

		resourceRepository.save(resource);

		return "Resource deleted successfully";
	}

	// SEARCH BY NAME
	@Override
	public List<ResourceResponse> searchByName(String name) {

		return resourceRepository.findByResourceNameContainingIgnoreCaseAndIsDeletedFalse(name).stream()
				.map(this::mapToResponse).collect(Collectors.toList());
	}

	// FILTER ROLE
	@Override
	public List<ResourceResponse> getByRole(Long roleId) {

		return resourceRepository.findByRoleRoleIdAndIsDeletedFalse(roleId).stream().map(this::mapToResponse)
				.collect(Collectors.toList());
	}

	// FILTER SKILL
	@Override
	public List<ResourceResponse> getBySkill(Long skillId) {

		List<ResourceSkill> resourceSkills = resourceSkillRepository.findBySkillSkillId(skillId);
		return resourceSkills.stream().map(ResourceSkill::getResource)
				.filter(r -> r.getIsDeleted() == null || !r.getIsDeleted()).distinct().map(this::mapToResponse)
				.collect(Collectors.toList());
	}

	private List<Long> extractSkillIds(ResourceRequest request) {

		return request.getSkillIds() == null ? new ArrayList<>() : request.getSkillIds();
	}

	private void saveResourceSkills(Resource resource, List<Long> rawSkillIds) {
		Set<Long> targetSkillIds = rawSkillIds == null ? Collections.emptySet() :
				rawSkillIds.stream()
						.filter(Objects::nonNull)
						.collect(Collectors.toSet());

		for (Long skillId : targetSkillIds) {
			Skill skill = skillRepository.findBySkillIdAndIsDeletedFalse(skillId)
					.orElseThrow(() -> new ResourceNotFoundException("Skill not found with ID: " + skillId));
			ResourceSkill resourceSkill = ResourceSkill.builder().resource(resource).skill(skill).build();
			resourceSkillRepository.save(resourceSkill);
		}
	}

	private void syncResourceSkills(Resource resource, List<Long> rawSkillIds) {
		Set<Long> targetSkillIds = rawSkillIds == null ? Collections.emptySet() :
				rawSkillIds.stream()
						.filter(Objects::nonNull)
						.collect(Collectors.toSet());

		List<ResourceSkill> existingResourceSkills =
				resourceSkillRepository.findByResourceResourceId(resource.getResourceId());

		Map<Long, ResourceSkill> existingSkillMap = new HashMap<>();
		for (ResourceSkill rs : existingResourceSkills) {
			if (rs.getSkill() != null && rs.getSkill().getSkillId() != null) {
				existingSkillMap.put(rs.getSkill().getSkillId(), rs);
			}
		}

		// Remove associations no longer present in target
		List<ResourceSkill> toDelete = new ArrayList<>();
		for (Map.Entry<Long, ResourceSkill> entry : existingSkillMap.entrySet()) {
			if (!targetSkillIds.contains(entry.getKey())) {
				toDelete.add(entry.getValue());
			}
		}
		if (!toDelete.isEmpty()) {
			resourceSkillRepository.deleteAll(toDelete);
		}

		// Add new associations not previously present
		for (Long skillId : targetSkillIds) {
			if (!existingSkillMap.containsKey(skillId)) {
				Skill skill = skillRepository.findBySkillIdAndIsDeletedFalse(skillId)
						.orElseThrow(() -> new ResourceNotFoundException("Skill not found with ID: " + skillId));
				ResourceSkill newResourceSkill = ResourceSkill.builder()
						.resource(resource)
						.skill(skill)
						.build();
				resourceSkillRepository.save(newResourceSkill);
			}
		}
	}

	private void setResourceData(Resource resource, ResourceRequest request, Role role, AssignmentType assignmentType) {

		resource.setResourceName(request.getResourceName());

		resource.setRole(role);

		resource.setAssignmentType(assignmentType);

		resource.setMonthlySalary(request.getMonthlySalary());

		resource.setPerformanceRating(request.getPerformanceRating());

	}

	// ENTITY TO DTO (Single item helper)
	private ResourceResponse mapToResponse(Resource resource) {
		List<ResourceSkill> resourceSkills = resourceSkillRepository.findByResourceResourceId(resource.getResourceId());
		return mapToResponse(resource, resourceSkills);
	}

	// ENTITY TO DTO (Batch helper)
	private ResourceResponse mapToResponse(Resource resource, List<ResourceSkill> resourceSkills) {

		ResourceResponse response = new ResourceResponse();

		response.setResourceId(resource.getResourceId());

		response.setResourceName(resource.getResourceName());

		if (resource.getRole() != null) {

			response.setRoleId(resource.getRole().getRoleId());

			response.setRoleName(resource.getRole().getRoleName());

		}

		if (resource.getAssignmentType() != null) {

			response.setAssignmentTypeId(resource.getAssignmentType().getAssignmentTypeId());

			response.setAssignmentTypeName(resource.getAssignmentType().getAssignmentTypeName());

		}

		List<SkillResponse> skillResponses = new ArrayList<>();
		if (resourceSkills != null) {
			for (ResourceSkill rs : resourceSkills) {
				if (rs.getSkill() != null) {
					Skill skill = rs.getSkill();
					SkillResponse sr = new SkillResponse();
					sr.setSkillId(skill.getSkillId());
					sr.setSkillName(skill.getSkillName());
					sr.setIsDeleted(skill.getIsDeleted());
					if (skill.getAssignmentType() != null) {
						sr.setAssignmentTypeId(skill.getAssignmentType().getAssignmentTypeId());
						sr.setAssignmentTypeName(skill.getAssignmentType().getAssignmentTypeName());
					}
					skillResponses.add(sr);
				}
			}
		}
		response.setSkills(skillResponses);

		response.setMonthlySalary(resource.getMonthlySalary());

		response.setPerformanceRating(resource.getPerformanceRating());

		return response;

	}

}

