package com.task.www.service;

import com.task.www.dto.AssignmentResultDTO;
import com.task.www.dto.OptimizationInputDTO;
import com.task.www.dto.OptimizationPreviewDTO;

public interface OptimizationService {

    AssignmentResultDTO optimizeAssignment(OptimizationInputDTO inputDTO);

    OptimizationPreviewDTO previewAssignment(OptimizationInputDTO inputDTO);

}