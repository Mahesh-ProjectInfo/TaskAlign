package com.task.www.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class DuplicateTaskSkillException extends RuntimeException {

    public DuplicateTaskSkillException(String message) {
        super(message);
    }
}
