package com.task.www.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.task.www.dto.ResourceRequest;
import com.task.www.dto.ResourceResponse;
import com.task.www.service.ResourceService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {

	private final ResourceService resourceService;

	public ResourceController(ResourceService resourceService) {
		this.resourceService = resourceService;
	}

	// CREATE RESOURCE
	@PostMapping
	public ResponseEntity<ResourceResponse> createResource(@Valid @RequestBody ResourceRequest request) {

		ResourceResponse response = resourceService.createResource(request);

		return new ResponseEntity<>(response, HttpStatus.CREATED);
	}

	// GET ALL RESOURCES
	@GetMapping
	public ResponseEntity<List<ResourceResponse>> getAllResources() {

		return ResponseEntity.ok(resourceService.getAllResources());
	}

	// SEARCH BY NAME
	@GetMapping("/search")
	public ResponseEntity<List<ResourceResponse>> searchByName(@RequestParam("name") String name) {

		return ResponseEntity.ok(resourceService.searchByName(name));
	}


	// GET RESOURCE BY ID
	@GetMapping("/{id}")
	public ResponseEntity<ResourceResponse> getResourceById(@PathVariable Long id) {

		return ResponseEntity.ok(resourceService.getResourceById(id));
	}

	// UPDATE RESOURCE
	@PutMapping("/{id}")
	public ResponseEntity<ResourceResponse> updateResource(@PathVariable Long id,
			@Valid @RequestBody ResourceRequest request) {

		return ResponseEntity.ok(resourceService.updateResource(id, request));
	}

	// DELETE RESOURCE
	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteResource(@PathVariable Long id) {

		return ResponseEntity.ok(resourceService.deleteResource(id));
	}

	// FILTER BY ROLE
	@GetMapping("/role/{roleId}")
	public ResponseEntity<List<ResourceResponse>> getByRole(@PathVariable Long roleId) {

		return ResponseEntity.ok(resourceService.getByRole(roleId));
	}

	// FILTER BY SKILL
	@GetMapping("/skill/{skillId}")
	public ResponseEntity<List<ResourceResponse>> getBySkill(@PathVariable Long skillId) {

		return ResponseEntity.ok(resourceService.getBySkill(skillId));
	}



}
