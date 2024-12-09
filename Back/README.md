# Spring Boot Application with Maven and Java 17

This project is a Spring Boot application built with Maven and Java 17. It is designed to connect to a PostgreSQL database and has CORS configuration for cross-origin requests from specific domains.

## Prerequisites

- Java 17 or higher
- Maven
- PostgreSQL Database
- IDE of your choice (e.g., IntelliJ IDEA, Eclipse)

### Clone the Repository
```bash
git clone <repository-url>
cd <project-directory>
```
### Database Configuration
```
spring.datasource.url=jdbc:postgresql://<yourPostgresUrl>/<DbName>
spring.datasource.username=
spring.datasource.password=
```
### CORS Configuration(security/SecurityConfiguration)
```
  configuration.setAllowedOrigins(Arrays.asList(
        "dev.url",  // Local frontend URL
        "production.url" // Production frontend URL
    ));
```