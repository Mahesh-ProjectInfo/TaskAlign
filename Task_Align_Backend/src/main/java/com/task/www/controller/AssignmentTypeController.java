package com.task.www.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import com.task.www.dto.AssignmentTypeRequest;
import com.task.www.dto.AssignmentTypeResponse;
import com.task.www.service.AssignmentTypeService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/assignment-types")
@Validated
public class AssignmentTypeController {

    @Autowired
    private AssignmentTypeService assignmentTypeService;

    @PostMapping
    public ResponseEntity<AssignmentTypeResponse> createAssignmentType(
            @Valid @RequestBody AssignmentTypeRequest request) {

        return new ResponseEntity<>(
                assignmentTypeService.createAssignmentType(request),
                HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<AssignmentTypeResponse>> getAllAssignmentTypes() {

        return ResponseEntity.ok(
                assignmentTypeService.getAllAssignmentTypes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AssignmentTypeResponse> getAssignmentTypeById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                assignmentTypeService.getAssignmentTypeById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AssignmentTypeResponse> updateAssignmentType(
            @PathVariable Long id,
            @Valid @RequestBody AssignmentTypeRequest request) {

        return ResponseEntity.ok(
                assignmentTypeService.updateAssignmentType(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAssignmentType(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                assignmentTypeService.deleteAssignmentType(id));
    }
}
