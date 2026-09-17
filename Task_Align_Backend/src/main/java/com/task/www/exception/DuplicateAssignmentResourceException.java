package com.task.www.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class DuplicateAssignmentResourceException extends RuntimeException {

    public DuplicateAssignmentResourceException(String message) {
        super(message);
    }
}
