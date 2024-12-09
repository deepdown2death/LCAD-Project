# Stage 1: Build the application using Maven
FROM maven:3.8.5-openjdk-17 AS build

# Create app directory
WORKDIR /app

# Copy the pom.xml file and dependencies first to take advantage of Maven caching
COPY pom.xml ./
RUN mvn dependency:go-offline

# Copy the rest of the application code
COPY src ./src

# Compile the application
RUN mvn clean package -DskipTests

# Stage 2: Copy the JAR file from the build stage to the final image
FROM openjdk:17.0.1-jdk-slim AS runtime

# Create app directory
WORKDIR /app

# Copy the JAR file from the build stage
COPY --from=build /app/target/*.jar shop.jar

# Expose the port that the application will run on
EXPOSE 3301

# Run the application
CMD ["java", "-jar", "shop.jar"]
