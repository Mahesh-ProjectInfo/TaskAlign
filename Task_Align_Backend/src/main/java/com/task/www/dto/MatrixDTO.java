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
public class MatrixDTO {

    private String title;

    private String description;

    private List<String> taskNames;

    private List<MatrixRowDTO> rows;
}