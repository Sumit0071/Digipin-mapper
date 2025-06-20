package com.example.Digipin.service;

import com.example.Digipin.model.Coordinates;
import org.springframework.stereotype.Service;

/**
 * DIGIPIN Encoder and Decoder Service
 * Developed by India Post, Department of Posts
 * Released under an open-source license for public use
 *
 * This service contains two main functions:
 *  - getDigiPin(lat, lon): Encodes latitude & longitude into a 10-digit alphanumeric DIGIPIN
 *  - getLatLngFromDigiPin(digiPin): Decodes a DIGIPIN back into its central latitude & longitude
 */
@Service
public class DigipinService {
    private static final String[][] DIGIPIN_GRID = {
            {"F", "C", "9", "8"},
            {"J", "3", "2", "7"},
            {"K", "4", "5", "6"},
            {"L", "M", "P", "T"}
    };

    private static final double MIN_LAT = 2.5;
    private static final double MAX_LAT = 38.5;
    private static final double MIN_LON = 63.5;
    private static final double MAX_LON = 99.5;

    /**
     * Encodes latitude and longitude into a DIGIPIN
     * @param lat Latitude value
     * @param lon Longitude value
     * @return 10-digit alphanumeric DIGIPIN string
     * @throws IllegalArgumentException if coordinates are out of range
     */
    public String getDigiPin(double lat, double lon) {
        if (lat < MIN_LAT || lat > MAX_LAT) {
            throw new IllegalArgumentException("Latitude out of range");
        }
        if (lon < MIN_LON || lon > MAX_LON) {
            throw new IllegalArgumentException("Longitude out of range");
        }

        double minLat = MIN_LAT;
        double maxLat = MAX_LAT;
        double minLon = MIN_LON;
        double maxLon = MAX_LON;

        StringBuilder digiPin = new StringBuilder();

        for (int level = 1; level <= 10; level++) {
            double latDiv = (maxLat - minLat) / 4;
            double lonDiv = (maxLon - minLon) / 4;

            // REVERSED row logic (to match original)
            int row = 3 - (int) Math.floor((lat - minLat) / latDiv);
            int col = (int) Math.floor((lon - minLon) / lonDiv);

            row = Math.max(0, Math.min(row, 3));
            col = Math.max(0, Math.min(col, 3));

            digiPin.append(DIGIPIN_GRID[row][col]);

            if (level == 3 || level == 6) {
                digiPin.append("-");
            }

            // Update bounds (reverse logic for row)
            maxLat = minLat + latDiv * (4 - row);
            minLat = minLat + latDiv * (3 - row);

            minLon = minLon + lonDiv * col;
            maxLon = minLon + lonDiv;
        }

        return digiPin.toString();
    }

    /**
     * Decodes a DIGIPIN back into its central latitude and longitude
     * @param digiPin 10-digit alphanumeric DIGIPIN string
     * @return Coordinates object containing latitude and longitude
     * @throws IllegalArgumentException if DIGIPIN is invalid
     */
    public Coordinates getLatLngFromDigiPin(String digiPin) {
        String pin = digiPin.replace("-", "");
        if (pin.length() != 10) {
            throw new IllegalArgumentException("Invalid DIGIPIN");
        }

        double minLat = MIN_LAT;
        double maxLat = MAX_LAT;
        double minLon = MIN_LON;
        double maxLon = MAX_LON;

        for (int i = 0; i < 10; i++) {
            char character = pin.charAt(i);
            boolean found = false;
            int ri = -1, ci = -1;

            // Locate character in DIGIPIN grid
            for (int r = 0; r < 4; r++) {
                for (int c = 0; c < 4; c++) {
                    if (DIGIPIN_GRID[r][c].equals(String.valueOf(character))) {
                        ri = r;
                        ci = c;
                        found = true;
                        break;
                    }
                }
                if (found) break;
            }

            if (!found) {
                throw new IllegalArgumentException("Invalid character in DIGIPIN");
            }

            double latDiv = (maxLat - minLat) / 4;
            double lonDiv = (maxLon - minLon) / 4;

            double lat1 = maxLat - latDiv * (ri + 1);
            double lat2 = maxLat - latDiv * ri;
            double lon1 = minLon + lonDiv * ci;
            double lon2 = minLon + lonDiv * (ci + 1);

            // Update bounding box for next level
            minLat = lat1;
            maxLat = lat2;
            minLon = lon1;
            maxLon = lon2;
        }

        double centerLat = (minLat + maxLat) / 2;
        double centerLon = (minLon + maxLon) / 2;

        return new Coordinates(
                Double.parseDouble(String.format("%.6f", centerLat)),
                Double.parseDouble(String.format("%.6f", centerLon))
        );
    }
}
