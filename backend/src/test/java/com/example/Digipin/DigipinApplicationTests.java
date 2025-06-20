package com.example.Digipin;

import com.example.Digipin.model.Coordinates;
import com.example.Digipin.service.DigipinService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for DigipinService
 */
@ExtendWith(MockitoExtension.class)
class DigipinServiceTest {

	private DigipinService digipinService;

	@BeforeEach
	void setUp() {
		digipinService = new DigipinService();
	}

	@Test
	void testGetDigiPin_ValidCoordinates() {
		// Test with valid coordinates
		double lat = 28.704060;
		double lon = 77.102493;

		String digiPin = digipinService.getDigiPin(lat, lon);

		assertNotNull(digiPin);
		assertEquals(12, digiPin.length()); // 10 chars + 2 hyphens
		assertTrue(digiPin.matches("^[FCJKLMPTfcjklmpt2-9-]{12}$"));
	}

	@Test
	void testGetDigiPin_LatitudeOutOfRange() {
		// Test with latitude out of range
		double lat = 40.0; // Above max
		double lon = 77.102493;

		IllegalArgumentException exception = assertThrows(
				IllegalArgumentException.class,
				() -> digipinService.getDigiPin(lat, lon)
		);

		assertEquals("Latitude out of range", exception.getMessage());
	}

	@Test
	void testGetDigiPin_LongitudeOutOfRange() {
		// Test with longitude out of range
		double lat = 28.704060;
		double lon = 100.0; // Above max

		IllegalArgumentException exception = assertThrows(
				IllegalArgumentException.class,
				() -> digipinService.getDigiPin(lat, lon)
		);

		assertEquals("Longitude out of range", exception.getMessage());
	}

	@Test
	void testGetLatLngFromDigiPin_ValidDigiPin() {
		// First encode coordinates
		double originalLat = 28.704060;
		double originalLon = 77.102493;
		String digiPin = digipinService.getDigiPin(originalLat, originalLon);

		// Then decode and verify
		Coordinates coordinates = digipinService.getLatLngFromDigiPin(digiPin);

		assertNotNull(coordinates);
		assertTrue(Math.abs(coordinates.getLatitude() - originalLat) < 0.1);
		assertTrue(Math.abs(coordinates.getLongitude() - originalLon) < 0.1);
	}

	@Test
	void testGetLatLngFromDigiPin_InvalidLength() {
		String invalidDigiPin = "F23-456"; // Too short

		IllegalArgumentException exception = assertThrows(
				IllegalArgumentException.class,
				() -> digipinService.getLatLngFromDigiPin(invalidDigiPin)
		);

		assertEquals("Invalid DIGIPIN", exception.getMessage());
	}

	@Test
	void testGetLatLngFromDigiPin_InvalidCharacter() {
		String invalidDigiPin = "X23-456-789T"; // X is not valid

		IllegalArgumentException exception = assertThrows(
				IllegalArgumentException.class,
				() -> digipinService.getLatLngFromDigiPin(invalidDigiPin)
		);

		assertEquals("Invalid character in DIGIPIN", exception.getMessage());
	}

	@Test
	void testRoundTripConsistency() {
		// Test multiple coordinates for consistency
		double[][] testCoordinates = {
				{28.704060, 77.102493}, // Delhi
				{19.076090, 72.877426}, // Mumbai
				{13.067439, 80.237617}, // Chennai
				{22.572645, 88.363892}  // Kolkata
		};

		for (double[] coords : testCoordinates) {
			double lat = coords[0];
			double lon = coords[1];

			String digiPin = digipinService.getDigiPin(lat, lon);
			Coordinates decoded = digipinService.getLatLngFromDigiPin(digiPin);

			// Should be within reasonable precision
			assertTrue(Math.abs(decoded.getLatitude() - lat) < 0.1,
					String.format("Latitude mismatch for %f,%f", lat, lon));
			assertTrue(Math.abs(decoded.getLongitude() - lon) < 0.1,
					String.format("Longitude mismatch for %f,%f", lat, lon));
		}
	}
}