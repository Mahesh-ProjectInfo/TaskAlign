package com.task.www.serviceImpl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.task.www.dto.SkillRequest;
import com.task.www.dto.SkillResponse;
import com.task.www.entity.Skill;
import com.task.www.exception.DuplicateResourceException;
import com.task.www.exception.ResourceNotFoundException;
import com.task.www.entity.AssignmentType;
import com.task.www.repository.AssignmentTypeRepository;
import com.task.www.repository.SkillRepository;
import com.task.www.service.SkillService;

@Service
public class SkillServiceImpl implements SkillService {

	@Autowired
	private SkillRepository skillRepository;

	@Autowired
	private AssignmentTypeRepository assignmentTypeRepository;

	@Override
	public SkillResponse createSkill(SkillRequest request) {

		AssignmentType assignmentType = assignmentTypeRepository.findByAssignmentTypeIdAndIsDeletedFalse(request.getAssignmentTypeId())
				.orElseThrow(() -> new ResourceNotFoundException("Assignment Type not found with ID: " + request.getAssignmentTypeId()));

		if (skillRepository.existsBySkillNameAndAssignmentTypeAssignmentTypeIdAndIsDeletedFalse(request.getSkillName(), request.getAssignmentTypeId())) {
			throw new DuplicateResourceException("Skill Name already exists under the selected Assignment Type.");
		}

		Skill skill = new Skill();

		skill.setAssignmentType(assignmentType);

		skill.setSkillName(request.getSkillName());

		skill.setIsDeleted(false);

		Skill savedSkill = skillRepository.save(skill);

		return mapToResponse(savedSkill);

	}

	@Override
	public List<SkillResponse> getAllSkills() {

		return skillRepository.findByIsDeletedFalse().stream().map(this::mapToResponse).collect(Collectors.toList());

	}

	@Override
	public SkillResponse getSkillById(Long id) {

		Skill skill = skillRepository.findBySkillIdAndIsDeletedFalse(id)
				.orElseThrow(() -> new ResourceNotFoundException("Skill not found with ID : " + id));

		return mapToResponse(skill);

	}

	@Override
	public SkillResponse updateSkill(Long id, SkillRequest request) {

		Skill skill = skillRepository.findBySkillIdAndIsDeletedFalse(id)
				.orElseThrow(() -> new ResourceNotFoundException("Skill not found with ID : " + id));

		AssignmentType assignmentType = assignmentTypeRepository.findByAssignmentTypeIdAndIsDeletedFalse(request.getAssignmentTypeId())
				.orElseThrow(() -> new ResourceNotFoundException("Assignment Type not found with ID: " + request.getAssignmentTypeId()));

		// Duplicate Validation
		if (!skill.getSkillName().equalsIgnoreCase(request.getSkillName())
				&& skillRepository.existsBySkillNameAndAssignmentTypeAssignmentTypeIdAndIsDeletedFalse(request.getSkillName(), request.getAssignmentTypeId())) {
			throw new DuplicateResourceException("Skill Name already exists under the selected Assignment Type.");
		}

		skill.setAssignmentType(assignmentType);

		skill.setSkillName(request.getSkillName());

		Skill updatedSkill = skillRepository.save(skill);

		return mapToResponse(updatedSkill);

	}

	@Override
	public String deleteSkill(Long id) {

		Skill skill = skillRepository.findBySkillIdAndIsDeletedFalse(id)
				.orElseThrow(() -> new ResourceNotFoundException("Skill not found with ID : " + id));

		skill.setIsDeleted(true);

		skillRepository.save(skill);

		return "Skill deleted successfully.";

	}

	private SkillResponse mapToResponse(Skill skill) {

		SkillResponse response = new SkillResponse();

		response.setSkillId(skill.getSkillId());

		if (skill.getAssignmentType() != null) {
			response.setAssignmentTypeId(skill.getAssignmentType().getAssignmentTypeId());
			response.setAssignmentTypeName(skill.getAssignmentType().getAssignmentTypeName());
		}

		response.setSkillName(skill.getSkillName());

		response.setIsDeleted(skill.getIsDeleted());

		return response;

	}

}

