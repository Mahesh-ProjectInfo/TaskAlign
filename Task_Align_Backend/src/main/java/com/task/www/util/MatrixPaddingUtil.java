package com.task.www.util;

import org.springframework.stereotype.Component;

@Component
public class MatrixPaddingUtil {

    public double[][] padMatrix(double[][] matrix, double dummyValue) {

        int rows = matrix.length;
        int cols = matrix[0].length;

        if (rows == cols) {
            return matrix;
        }

        int size = Math.max(rows, cols);

        double[][] paddedMatrix = new double[size][size];

        for (int i = 0; i < size; i++) {

            for (int j = 0; j < size; j++) {

                paddedMatrix[i][j] = dummyValue;

            }
        }

        for (int i = 0; i < rows; i++) {

            for (int j = 0; j < cols; j++) {

                paddedMatrix[i][j] = matrix[i][j];

            }
        }

        return paddedMatrix;
    }

}