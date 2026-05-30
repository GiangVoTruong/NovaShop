# ---- Build stage ----
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

COPY mvnw mvnw.cmd ./
COPY .mvn .mvn
COPY pom.xml .

RUN chmod +x mvnw \
    && ./mvnw dependency:go-offline -B

COPY src src

RUN ./mvnw package -DskipTests -B

# ---- Runtime stage ----
FROM eclipse-temurin:21-jre-alpine AS runtime
WORKDIR /app

RUN addgroup -S spring \
    && adduser -S spring -G spring

USER spring:spring

COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
