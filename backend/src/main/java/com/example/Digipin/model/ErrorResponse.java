package com.example.Digipin.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Error response model
 */
@Schema(description = "Error response")
public class ErrorResponse {

    @JsonProperty("error")
    @Schema(description = "Error message", example = "Latitude out of range")
    private String error;

    public ErrorResponse() {}

    public ErrorResponse(String error) {
        this.error = error;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    @Override
    public String toString() {
        return "ErrorResponse{" +
                "error='" + error + '\'' +
                '}';
    }
}