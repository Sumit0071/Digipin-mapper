package com.example.Digipin.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Response model for DIGIPIN encoding
 */
@Schema(description = "Response containing the encoded DIGIPIN")
public class EncodeResponse {

    @JsonProperty("digipin")
    @Schema(description = "The encoded DIGIPIN", example = "F23-456-789T")
    private String digipin;

    public EncodeResponse() {}

    public EncodeResponse(String digipin) {
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
        return "EncodeResponse{" +
                "digipin='" + digipin + '\'' +
                '}';
    }
}