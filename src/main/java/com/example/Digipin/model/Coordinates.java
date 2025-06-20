package com.example.Digipin.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Coordinates model representing latitude and longitude
 */
@Schema(description = "Coordinates containing latitude and longitude")
public class Coordinates {

    @JsonProperty("latitude")
    @Schema(description = "Latitude coordinate", example = "28.704060")
    private double latitude;

    @JsonProperty("longitude")
    @Schema(description = "Longitude coordinate", example = "77.102493")
    private double longitude;

    public Coordinates() {}

    public Coordinates(double latitude, double longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    @Override
    public String toString() {
        return "Coordinates{" +
                "latitude=" + latitude +
                ", longitude=" + longitude +
                '}';
    }
}