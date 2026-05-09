# Stage 1: Build with Maven
FROM maven:3.9-eclipse-temurin-17 AS builder

WORKDIR /app

# Copy pom first to leverage Docker layer caching
COPY pom.xml ./
RUN mvn -q -DskipTests dependency:go-offline

# Copy source and build
COPY src ./src
RUN mvn -q -DskipTests package

# Stage 2: Run with slim JRE
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app
COPY --from=builder /app/target/estore-backend-1.0.0.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
