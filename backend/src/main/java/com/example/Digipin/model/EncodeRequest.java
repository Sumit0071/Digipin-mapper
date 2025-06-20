package com.example.Digipin.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

/**
 * Request model for encoding coordinates to DIGIPIN
 */
@Schema(description = "Request for encoding latitude and longitude to DIGIPIN")
public class EncodeRequest {

    @NotNull(message = "Latitude is required")
    @DecimalMin(value = "2.5", message = "Latitude must be at least 2.5")
    @DecimalMax(value = "38.5", message = "Latitude must be at most 38.5")
    @JsonProperty("latitude")
    @Schema(description = "Latitude coordinate", example = "28.704060", minimum = "2.5", maximum = "38.5")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    @DecimalMin(value = "63.5", message = "Longitude must be at least 63.5")
    @DecimalMax(value = "99.5", message = "Longitude must be at most 99.5")
    @JsonProperty("longitude")
    @Schema(description = "Longitude coordinate", example = "77.102493", minimum = "63.5", maximum = "99.5")
    private Double longitude;

    public EncodeRequest() {}

    public EncodeRequest(Double latitude, Double longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    @Override
    public String toString() {
        return "EncodeRequest{" +
                "latitude=" + latitude +
                ", longitude=" + longitude +
                '}';
    }
}
