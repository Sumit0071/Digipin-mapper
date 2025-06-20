package com.example.Digipin.controller;

import com.example.Digipin.model.Coordinates;
import com.example.Digipin.model.EncodeResponse;
import com.example.Digipin.model.ErrorResponse;
import com.example.Digipin.model.*;
import com.example.Digipin.service.DigipinService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * DIGIPIN API Controller
 * Provides endpoints for encoding and decoding DIGIPIN codes
 */
@RestController
@RequestMapping("/api/digipin")
@Validated
@Tag(name = "DIGIPIN API", description = "DIGIPIN Encoder and Decoder API")
public class DigipinController {

    @Autowired
    private DigipinService digipinService;

    @Operation(summary = "Encode coordinates to DIGIPIN (POST)",
            description = "Encodes latitude and longitude coordinates into a 10-digit DIGIPIN code")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully encoded coordinates",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = EncodeResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid coordinates",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/encode")
    public ResponseEntity<?> encodePost(@Valid @RequestBody EncodeRequest request) {
        try {
            String digipin = digipinService.getDigiPin(request.getLatitude(), request.getLongitude());
            return ResponseEntity.ok(new EncodeResponse(digipin));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @Operation(summary = "Decode DIGIPIN to coordinates (POST)",
            description = "Decodes a DIGIPIN code back to its latitude and longitude coordinates")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully decoded DIGIPIN",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Coordinates.class))),
            @ApiResponse(responseCode = "400", description = "Invalid DIGIPIN",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/decode")
    public ResponseEntity<?> decodePost(@Valid @RequestBody DecodeRequest request) {
        try {
            Coordinates coordinates = digipinService.getLatLngFromDigiPin(request.getDigipin());
            return ResponseEntity.ok(coordinates);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @Operation(summary = "Encode coordinates to DIGIPIN (GET)",
            description = "Encodes latitude and longitude coordinates into a 10-digit DIGIPIN code using query parameters")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully encoded coordinates",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = EncodeResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid coordinates",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/encode")
    public ResponseEntity<?> encodeGet(
            @Parameter(description = "Latitude coordinate", example = "28.704060")
            @RequestParam
            @NotNull(message = "Latitude is required")
            @DecimalMin(value = "2.5", message = "Latitude must be at least 2.5")
            @DecimalMax(value = "38.5", message = "Latitude must be at most 38.5")
            Double latitude,

            @Parameter(description = "Longitude coordinate", example = "77.102493")
            @RequestParam
            @NotNull(message = "Longitude is required")
            @DecimalMin(value = "63.5", message = "Longitude must be at least 63.5")
            @DecimalMax(value = "99.5", message = "Longitude must be at most 99.5")
            Double longitude) {
        try {
            String digipin = digipinService.getDigiPin(latitude, longitude);
            return ResponseEntity.ok(new EncodeResponse(digipin));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @Operation(summary = "Decode DIGIPIN to coordinates (GET)",
            description = "Decodes a DIGIPIN code back to its latitude and longitude coordinates using query parameter")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully decoded DIGIPIN",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Coordinates.class))),
            @ApiResponse(responseCode = "400", description = "Invalid DIGIPIN",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/decode")
    public ResponseEntity<?> decodeGet(
            @Parameter(description = "DIGIPIN code to decode", example = "F23-456-789T")
            @RequestParam
            @NotBlank(message = "DIGIPIN is required")
            String digipin) {
        try {
            Coordinates coordinates = digipinService.getLatLngFromDigiPin(digipin);
            return ResponseEntity.ok(coordinates);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
}
