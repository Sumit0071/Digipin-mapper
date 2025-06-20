package com.example.Digipin.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI (Swagger) Configuration
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("DIGIPIN API")
                        .version("1.0.0")
                        .description("DIGIPIN Encoder and Decoder API developed by India Post, Department of Posts. " +
                                "This API provides endpoints to encode latitude and longitude coordinates into " +
                                "10-digit alphanumeric DIGIPIN codes and decode them back to coordinates.")
                        .contact(new Contact()
                                .name("India Post")
                                .email("support@indiapost.gov.in")
                                .url("https://www.indiapost.gov.in"))
                        .license(new License()
                                .name("Open Source License")
                                .url("https://opensource.org/licenses")));
    }
}