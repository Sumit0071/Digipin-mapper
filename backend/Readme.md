# DIGIPIN API - Java Spring Boot Project

## Project Structure

```
digipin-api/
├── pom.xml
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── company/
│   │   │           └── Digipin/
│   │   │               ├── DigipinApiApplication.java
│   │   │               ├── config/
│   │   │               │   ├── CorsConfig.java
│   │   │               │   └── OpenApiConfig.java
│   │   │               ├── controller/
│   │   │               │   └── DigipinController.java
│   │   │               ├── exception/
│   │   │               │   └── GlobalExceptionHandler.java
│   │   │               ├── model/
│   │   │               │   ├── Coordinates.java
│   │   │               │   ├── DecodeRequest.java
│   │   │               │   ├── EncodeRequest.java
│   │   │               │   ├── EncodeResponse.java
│   │   │               │   └── ErrorResponse.java
│   │   │               └── service/
│   │   │                   └── DigipinService.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── java/
│           └── com/
│               └── indiapost/
│                   └── digipin/
│                       └── service/
│                           └── DigipinServiceTest.java
```

## Setup Instructions

### Prerequisites
- Java 21 or higher
- Maven 3.6 or higher

### Build and Run

1. **Create the project directory:**
   ```bash
   mkdir digipin-api
   cd digipin-api
   ```

2. **Create the Maven structure:**
   ```bash
   mkdir -p src/main/java/com/company/Digipin/{config,controller,exception,model,service}
   mkdir -p src/main/resources
   mkdir -p src/test/java/com/company/Digipin/service
   ```

3. **Copy all the provided files to their respective directories according to the project structure above.**

4. **Build the project:**
   ```bash
   mvn clean compile
   ```

5. **Run tests:**
   ```bash
   mvn test
   ```

6. **Run the application:**
   ```bash
   mvn spring-boot:run
   ```

   Or build JAR and run:
   ```bash
   mvn clean package
   java -jar target/digipin-api-1.0.0.jar
   ```

### API Documentation

Once the application is running, you can access:

- **Swagger UI:** http://localhost:5000/api-docs
- **OpenAPI JSON:** http://localhost:5000/v3/api-docs

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/digipin/encode` | Encode coordinates to DIGIPIN |
| POST | `/api/digipin/decode` | Decode DIGIPIN to coordinates |
| GET | `/api/digipin/encode` | Encode coordinates to DIGIPIN (query params) |
| GET | `/api/digipin/decode` | Decode DIGIPIN to coordinates (query param) |

### Example Usage

#### Encode (POST)
```bash
curl -X POST http://localhost:5000/api/digipin/encode \
  -H "Content-Type: application/json" \
  -d '{"latitude": 28.704060, "longitude": 77.102493}'
```

#### Decode (POST)
```bash
curl -X POST http://localhost:5000/api/digipin/decode \
  -H "Content-Type: application/json" \
  -d '{"digipin": "F23-456-789T"}'
```

#### Encode (GET)
```bash
curl "http://localhost:5000/api/digipin/encode?latitude=28.704060&longitude=77.102493"
```

#### Decode (GET)
```bash
curl "http://localhost:5000/api/digipin/decode?digipin=F23-456-789T"
```

### Configuration

The application can be configured via `application.properties`:

- **Server Port:** `server.port=5000`
- **CORS Origins:** `cors.allowed-origins=http://localhost:5173`
- **API Documentation Path:** `springdoc.swagger-ui.path=/api-docs`

### Features

- ✅ Complete DIGIPIN encoding/decoding logic
- ✅ Input validation with proper error messages
- ✅ CORS configuration
- ✅ Swagger/OpenAPI documentation
- ✅ Global exception handling
- ✅ Unit tests
- ✅ Both POST and GET endpoints
- ✅ Proper HTTP status codes
- ✅ JSON request/response handling

### Dependencies Used

- **Spring Boot Starter Web** - REST API framework
- **Spring Boot Starter Validation** - Input validation
- **SpringDoc OpenAPI** - API documentation
- **Spring Boot Starter Test** - Unit testing framework

This Spring Boot project provides the exact same functionality as your Node.js Express application with proper Java conventions, validation, documentation, and testing.
