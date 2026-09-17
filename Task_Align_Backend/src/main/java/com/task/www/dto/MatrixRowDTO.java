package com.task.www.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatrixRowDTO {

    private String resourceName;

    private List<MatrixCellDTO> cells;
}