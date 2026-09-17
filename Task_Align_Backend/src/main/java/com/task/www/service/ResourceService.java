package com.task.www.service;

import java.util.List;

import com.task.www.dto.ResourceRequest;
import com.task.www.dto.ResourceResponse;

public interface ResourceService {

	// CREATE RESOURCE
	ResourceResponse createResource(ResourceRequest request);

	// GET ALL RESOURCES
	List<ResourceResponse> getAllResources();

	// GET RESOURCE BY ID
	ResourceResponse getResourceById(Long id);

	// UPDATE RESOURCE
	ResourceResponse updateResource(Long id, ResourceRequest request);

	// DELETE RESOURCE
	String deleteResource(Long id);

	// SEARCH RESOURCE BY NAME
	List<ResourceResponse> searchByName(String name);


	// FILTER RESOURCE BY ROLE
	List<ResourceResponse> getByRole(Long roleId);

	// FILTER RESOURCE BY SKILL
	List<ResourceResponse> getBySkill(Long skillId);


}
