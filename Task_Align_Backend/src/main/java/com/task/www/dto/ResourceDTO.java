package com.task.www.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResourceDTO {

    private Long resourceId;

    private String resourceName;

    private String role;

    private BigDecimal monthlySalary;

    private Integer performanceRating;

}