package com.task.www.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {

        return new OpenAPI()
                .info(new Info()

                        .title("Task Align API")

                        .version("1.0")

                        .description("Authentication & User Management APIs")

                        .contact(new Contact()
                                .name("Task Align Development Team")
                                .email("support@taskalign.com")));

    }

}
