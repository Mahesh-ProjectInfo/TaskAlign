package com.task.www.util;

import java.time.LocalDateTime;

import org.springframework.stereotype.Component;

@Component
public class DateTimeUtil {

    public LocalDateTime getCurrentDateTime() {

        return LocalDateTime.now();

    }

    public LocalDateTime addMinutes(int minutes) {

        return LocalDateTime.now().plusMinutes(minutes);

    }

}
