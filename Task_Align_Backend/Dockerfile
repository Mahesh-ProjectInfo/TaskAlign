# Multi-stage build for Task Align Spring Boot Backend
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy Maven pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build production package skipping tests
RUN mvn clean package -DskipTests

# Production runtime stage with native font libraries
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Install native font and FreeType dependencies required by JasperReports
RUN apt-get update && apt-get install -y --no-install-recommends \
    fontconfig \
    libfreetype6 \
    fonts-dejavu-core \
    && rm -rf /var/lib/apt/lists/*

# Copy built WAR artifact from build stage
COPY --from=build /app/target/Taskalign-0.0.1-SNAPSHOT.war app.war

# Set headless mode for JasperReports & Apache POI
ENV JAVA_OPTS="-Djava.awt.headless=true"
ENV PORT=8080

EXPOSE 8080

# Run Spring Boot with headless flag and Railway PORT binding
ENTRYPOINT ["sh", "-c", "java -Djava.awt.headless=true -Dserver.port=${PORT:-8080} -jar app.war"]
