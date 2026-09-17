package com.task.www.util;

import org.springframework.stereotype.Component;

@Component
public class HungarianAlgorithmUtil {

	  // Constants
    private static final int STAR = 1;
    private static final int PRIME = 2;
    

     // Tolerance used for floating-point zero comparisons.
    private static final double EPSILON = 1e-9;
    
    // Fields
    private double[][] matrix;

    private int size;

    private int[][] mask;

    private boolean[] rowCover;

    private boolean[] columnCover;

    private int[][] path;

    private int pathRow;
    private int pathColumn;

    // Main Algorithm
    public int[] solve(double[][] inputMatrix) {

        validateMatrix(inputMatrix);

        initialize(inputMatrix);

        rowReduction();

        columnReduction();

        starInitialZeros();

        coverStarredColumns();

        while (!allColumnsCovered()) {

            while (true) {

                int[] zero = findUncoveredZero();

                if (zero == null) {

                    adjustMatrix();
                    continue;
                }

                int row = zero[0];
                int column = zero[1];

                mask[row][column] = PRIME;

                int starColumn = findStarInRow(row);

                if (starColumn == -1) {

                    pathRow = row;
                    pathColumn = column;

                    augmentPath();

                    clearCovers();

                    clearPrimes();

                    coverStarredColumns();

                    break;
                }

                rowCover[row] = true;
                columnCover[starColumn] = false;
            }
        }

        return buildAssignment();
    }
    
 // Initialization & Validation
    
    private void validateMatrix(double[][] matrix) {

        if (matrix == null) {
            throw new IllegalArgumentException("Matrix cannot be null.");
        }

        if (matrix.length == 0) {
            throw new IllegalArgumentException("Matrix cannot be empty.");
        }

        int columns = matrix[0].length;

        for (double[] row : matrix) {

            if (row.length != columns) {
                throw new IllegalArgumentException("Matrix must be rectangular.");
            }
        }

        if (matrix.length != columns) {
            throw new IllegalArgumentException("Hungarian Algorithm requires a square matrix.");
        }
    }
    
    private void initialize(double[][] inputMatrix) {

        size = inputMatrix.length;

        matrix = new double[size][size];

        for (int i = 0; i < size; i++) {
            System.arraycopy(inputMatrix[i], 0, matrix[i], 0, size);
        }

        mask = new int[size][size];

        rowCover = new boolean[size];

        columnCover = new boolean[size];

        path = new int[size * 2][2];
    }
    
 // Matrix Reduction

    private void rowReduction() {

        for (int i = 0; i < size; i++) {

            double minimum = matrix[i][0];

            for (int j = 1; j < size; j++) {

                if (matrix[i][j] < minimum) {
                    minimum = matrix[i][j];
                }
            }

            for (int j = 0; j < size; j++) {
                matrix[i][j] -= minimum;
            }
        }
    }
    
    private void columnReduction() {

        for (int j = 0; j < size; j++) {

            double minimum = matrix[0][j];

            for (int i = 1; i < size; i++) {

                if (matrix[i][j] < minimum) {
                    minimum = matrix[i][j];
                }
            }

            for (int i = 0; i < size; i++) {
                matrix[i][j] -= minimum;
            }
        }
    }
    
 // Initial Star Phase
    
    private void starInitialZeros() {

        boolean[] rowHasStar = new boolean[size];
        boolean[] columnHasStar = new boolean[size];

        for (int i = 0; i < size; i++) {

            for (int j = 0; j < size; j++) {

                if (Math.abs(matrix[i][j]) < EPSILON
                        && !rowHasStar[i]
                        && !columnHasStar[j]) {

                    mask[i][j] = STAR;

                    rowHasStar[i] = true;
                    columnHasStar[j] = true;
                }
            }
        }
    }
    
    private void coverStarredColumns() {

        clearCovers();

        for (int i = 0; i < size; i++) {

            for (int j = 0; j < size; j++) {

                if (mask[i][j] == STAR) {
                    columnCover[j] = true;
                }
            }
        }
    }
    
    private boolean allColumnsCovered() {

        int covered = 0;

        for (boolean column : columnCover) {

            if (column) {
                covered++;
            }
        }

        return covered == size;
    }
    
    private void clearCovers() {

        for (int i = 0; i < size; i++) {

            rowCover[i] = false;
            columnCover[i] = false;
        }
    }
    
    
    private int[] findUncoveredZero() {

        for (int i = 0; i < size; i++) {

            if (rowCover[i]) {
                continue;
            }

            for (int j = 0; j < size; j++) {

                if (columnCover[j]) {
                    continue;
                }

                if (Math.abs(matrix[i][j]) < EPSILON) {
                    return new int[] { i, j };
                }
            }
        }

        return null;
    }
    
    private int findStarInRow(int row) {

        for (int j = 0; j < size; j++) {

            if (mask[row][j] == STAR) {
                return j;
            }
        }

        return -1;
    }
    
    private int findStarInColumn(int column) {

        for (int i = 0; i < size; i++) {

            if (mask[i][column] == STAR) {
                return i;
            }
        }

        return -1;
    }
    
    private int findPrimeInRow(int row) {

        for (int j = 0; j < size; j++) {

            if (mask[row][j] == PRIME) {
                return j;
            }
        }

        return -1;
    }
    
    private void augmentPath() {

        int pathCount = 0;

        path[pathCount][0] = pathRow;
        path[pathCount][1] = pathColumn;

        boolean done = false;

        while (!done) {

            int row = findStarInColumn(path[pathCount][1]);

            if (row == -1) {

                done = true;

            } else {

                pathCount++;

                path[pathCount][0] = row;
                path[pathCount][1] = path[pathCount - 1][1];

                int column = findPrimeInRow(row);

                pathCount++;

                path[pathCount][0] = row;
                path[pathCount][1] = column;
            }
        }

        for (int i = 0; i <= pathCount; i++) {

            int row = path[i][0];
            int column = path[i][1];

            if (mask[row][column] == STAR) {

                mask[row][column] = 0;

            } else if (mask[row][column] == PRIME) {

                mask[row][column] = STAR;
            }
        }
    }
    
    private void adjustMatrix() {

        double minimum = Double.MAX_VALUE;

        // Find the smallest uncovered value
        for (int i = 0; i < size; i++) {

            if (rowCover[i]) {
                continue;
            }

            for (int j = 0; j < size; j++) {

                if (columnCover[j]) {
                    continue;
                }

                if (matrix[i][j] < minimum) {
                    minimum = matrix[i][j];
                }
            }
        }

        // Add minimum to covered rows
        for (int i = 0; i < size; i++) {

            if (rowCover[i]) {

                for (int j = 0; j < size; j++) {
                    matrix[i][j] += minimum;
                }
            }
        }

        // Subtract minimum from uncovered columns
        for (int j = 0; j < size; j++) {

            if (!columnCover[j]) {

                for (int i = 0; i < size; i++) {
                    matrix[i][j] -= minimum;
                }
            }
        }
    }
    
    private void clearPrimes() {

        for (int i = 0; i < size; i++) {

            for (int j = 0; j < size; j++) {

                if (mask[i][j] == PRIME) {

                    mask[i][j] = 0;
                }
            }
        }
    }
    
    private int[] buildAssignment() {

        int[] assignment = new int[size];

        for (int i = 0; i < size; i++) {

            assignment[i] = -1;

            for (int j = 0; j < size; j++) {

                if (mask[i][j] == STAR) {

                    assignment[i] = j;
                    break;
                }
            }
        }

        return assignment;
    }
    

}