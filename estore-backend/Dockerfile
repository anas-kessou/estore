# Backend Dockerfile
FROM eclipse-temurin:21-jdk-jammy

WORKDIR /app

# Copy pom first to leverage Docker layer caching
COPY pom.xml ./

# Download dependencies (offline cache)
RUN apt-get update -qq && apt-get install -y -qq maven && mvn -q -DskipTests dependency:go-offline

# Copy source
COPY src ./src

# Build jar
RUN mvn -q -DskipTests package

EXPOSE 8080

# Run the Spring Boot app
CMD ["java", "-jar", "target/estore-backend-1.0.0.jar"]

