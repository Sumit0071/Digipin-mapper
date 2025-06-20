package com.example.Digipin.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

/**
 * Request model for decoding DIGIPIN to coordinates
 */
@Schema(description = "Request for decoding DIGIPIN to latitude and longitude")
public class DecodeRequest {

    @NotBlank(message = "DIGIPIN is required")
    @Pattern(regexp = "^[FCJKLMPTfcjklmpt2-9-]{10,12}$", message = "Invalid DIGIPIN format")
    @JsonProperty("digipin")
    @Schema(description = "10-digit alphanumeric DIGIPIN code", example = "F23-456-789T")
    private String digipin;

    public DecodeRequest() {}

    public DecodeRequest(String digipin) {
        this.digipin = digipin;
    }

    public String getDigipin() {
        return digipin;
    }

    public void setDigipin(String digipin) {
        this.digipin = digipin;
    }

    @Override
    public String toString() {
        return "DecodeRequest{" +
                "digipin='" + digipin + '\'' +
                '}';
    }
}